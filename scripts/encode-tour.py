"""Encode a real 60 fps browser capture. Optional Pillow and FFmpeg tooling."""
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path
from PIL import Image


def find_ffmpeg():
    binary = os.environ.get("TOUR_FFMPEG") or shutil.which("ffmpeg")
    if not binary:
        import imageio_ffmpeg
        binary = imageio_ffmpeg.get_ffmpeg_exe()
    subprocess.run([binary, "-version"], check=True, stdout=subprocess.DEVNULL)
    return binary


ffmpeg = find_ffmpeg()
if sys.argv[1:] == ["--check"]:
    sys.exit(0)

manifest_path = Path(sys.argv[1])
manifest = json.loads(manifest_path.read_text())
output = Path(sys.argv[2])
output.mkdir(parents=True, exist_ok=True)
frames = manifest["frames"]
fps = manifest["fps"]
assert fps == 60 and len(frames) > 120
assert all(abs(frame["timeMs"] - i * 1000 / fps) < 1e-6 for i, frame in enumerate(frames))
width, height = manifest["width"], manifest["height"]
duration_ms = len(frames) * 1000 / fps
source = manifest_path.parent / "frame-%04d.png"
scale = f"scale={width}:{height}:flags=lanczos"
base = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y"]
inputs = ["-framerate", str(fps), "-i", str(source)]

# Check actual capture diversity, not just the fps value in an output header.
scene_checks = []
for scene in manifest["scenes"]:
    if scene["name"] not in ("atlas", "atlas-return", "directory-scroll"):
        continue
    selected = frames[scene["start"]:scene["start"] + scene["count"]]
    hashes = [hashlib.sha256((manifest_path.parent / item["file"]).read_bytes()).digest()
              for item in selected]
    changed = sum(a != b for a, b in zip(hashes, hashes[1:]))
    ratio = changed / (len(hashes) - 1)
    assert ratio >= .9, f"Too few fresh motion frames in {scene['name']}: {ratio:.1%}"
    scene_checks.append({"scene": scene["name"], "frames": len(hashes), "changed_neighbors": changed})

webp = output / "site-tour.webp"
subprocess.run(base + inputs + ["-frames:v", str(len(frames)), "-vf", scale,
    "-c:v", "libwebp_anim", "-lossless", "0", "-quality", "90", "-compression_level", "4",
    "-loop", "0", "-fps_mode", "passthrough", str(webp)], check=True)
print(f"Encoded WebP: {webp.stat().st_size / 1024:.0f} KB", flush=True)

mp4 = output / "site-tour.mp4"
subprocess.run(base + inputs + ["-frames:v", str(len(frames)), "-vf", scale,
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
    "-r", "60", "-fps_mode", "cfr", "-movflags", "+faststart", str(mp4)], check=True)
print(f"Encoded MP4: {mp4.stat().st_size / 1024:.0f} KB", flush=True)

# GIF has 10 ms timing units. Resample to an even, browser-safe 20 ms cadence.
palette = manifest_path.parent / "palette.png"
subprocess.run(base + inputs + ["-t", str(duration_ms / 1000), "-vf",
    f"fps=50,{scale},palettegen=max_colors=192:stats_mode=diff", "-frames:v", "1", str(palette)], check=True)
gif = output / "site-tour.gif"
subprocess.run(base + inputs + ["-i", str(palette), "-t", str(duration_ms / 1000),
    "-lavfi", f"[0:v]fps=50,{scale}[scaled];[scaled][1:v]paletteuse=dither=none:diff_mode=rectangle",
    "-loop", "0", "-fps_mode", "passthrough", str(gif)], check=True)
print(f"Encoded GIF: {gif.stat().st_size / 1024:.0f} KB", flush=True)

report = {"capture_fps": fps, "capture_frames": len(frames), "duration_ms": duration_ms,
          "width": width, "height": height, "motion_checks": scene_checks, "outputs": {}}
for media in (webp, gif):
    with Image.open(media) as image:
        assert image.size == (width, height) and image.n_frames > 100
        assert image.info.get("loop") == 0
        delays = []
        for index in range(image.n_frames):
            image.seek(index)
            image.load()
            delays.append(image.info["duration"])
        assert abs(sum(delays) - duration_ms) <= 20, (media.name, sum(delays), duration_ms)
        assert min(delays) >= (16 if media == webp else 20)
        if media == gif:
            assert all(delay % 20 == 0 for delay in delays)
        # The first scene moves continuously, so merged/static holds cannot hide dropped frames.
        moving = []
        time = 0
        for delay in delays:
            if time + delay <= 2900:
                moving.append(delay)
            time += delay
        assert max(moving) <= (17 if media == webp else 20), (media.name, max(moving))
        report["outputs"][media.name] = {"frames": image.n_frames, "duration_ms": sum(delays),
            "minimum_delay_ms": min(delays), "opening_motion_delays_ms": sorted(set(moving)),
            "bytes": media.stat().st_size}

# Decode every video frame and check the stream time base and timestamps.
checksums = manifest_path.parent / "video-frames.md5"
subprocess.run(base + ["-i", str(mp4), "-map", "0:v:0", "-f", "framemd5", str(checksums)], check=True)
lines = checksums.read_text().splitlines()
assert "#tb 0: 1/60" in lines
assert f"#dimensions 0: {width}x{height}" in lines
samples = [line.split(",") for line in lines if not line.startswith("#")]
assert len(samples) == len(frames)
assert all(int(fields[2]) == i and int(fields[3]) == 1 for i, fields in enumerate(samples))
report["outputs"][mp4.name] = {"fps": 60, "decoded_frames": len(samples), "bytes": mp4.stat().st_size}
(manifest_path.parent / "validation.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report, indent=2), flush=True)
