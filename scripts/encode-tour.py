"""Encode browser captures as a compact GIF. Requires Pillow, only for docs media."""
import json
import sys
from pathlib import Path
from PIL import Image

manifest_path = Path(sys.argv[1])
manifest = json.loads(manifest_path.read_text())
frames = []
for entry in manifest["frames"]:
    with Image.open(manifest_path.parent / entry["file"]) as source:
        width = manifest["width"]
        frames.append(source.convert("RGB").resize(
            (width, round(source.height * width / source.width)), Image.Resampling.LANCZOS))
# One palette across all scenes keeps text and the site's quiet colors consistent.
samples = [frame.resize((256, 176)) for frame in frames]
strip = Image.new("RGB", (256, 176 * len(samples)))
for i, sample in enumerate(samples):
    strip.paste(sample, (0, 176 * i))
palette = strip.quantize(colors=192, method=Image.Quantize.MEDIANCUT)
indexed = [frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames]
output = Path(sys.argv[2])
indexed[0].save(output, save_all=True, append_images=indexed[1:],
                duration=[entry["duration"] for entry in manifest["frames"]],
                loop=0, optimize=True, disposal=1)
with Image.open(output) as gif:
    duration = 0
    for frame in range(gif.n_frames):
        gif.seek(frame)
        duration += gif.info.get("duration", 0)
    assert gif.size == frames[0].size and duration > 10000
    print(f"GIF: {gif.n_frames} frames, {duration / 1000:.1f}s, "
          f"{gif.width}x{gif.height}, {output.stat().st_size / 1024:.0f} KB")
