# README tour and screenshots

The README animation is captured from the actual local build with Playwright.
It shows the wool atlas, searching the brand directory for Fox Brothers, the
company research page, the weave and pattern guide, a herringbone/houndstooth comparison, and the houndstooth color-versus-interlacing view.
The media reflects repository content, which can be ahead of the hosted
deployment.

The capture uses a fresh browser context with no saved user data. It captures
at 1,280 × 880 pixels and encodes at 1,024 × 704 pixels. Playwright's clock
controls timers; a capture-only animation-frame queue and the CSS timeline
advance in 1/60-second steps. Moving scenes contain fresh browser screenshots,
even when capturing them takes longer than real time.
Reading scenes pause deliberately. The static poster provides an overview for
readers who prefer no motion; animated images do not offer a pause control in
every Markdown renderer.

## Formats and timing

The README embeds animated WebP at a nominal 60 fps. WebP stores frame durations
in milliseconds, so 16 and 17 ms delays preserve an average of 60 frames per
second. The downloadable H.264 MP4 has a constant 60 fps video track. A separate
GIF fallback uses 20 ms delays during motion, or 50 fps. Still scenes can be
stored as longer holds without changing the motion cadence.

GIF cannot represent an even 1/60-second interval because its delay field uses
hundredths of a second. Chromium also extends image-frame delays of 10 ms or
less to 100 ms, so forcing a GIF's metadata toward 60 fps can make it visibly
slower. WebP avoids that timing limit and is supported inline by GitHub.
See the [GIF89a timing specification](https://www.w3.org/Graphics/GIF/spec-gif89a.txt),
[Chromium's image-frame timing implementation](https://raw.githubusercontent.com/chromium/chromium/main/third_party/blink/renderer/platform/graphics/deferred_image_decoder.cc),
[WebP frame duration specification](https://developers.google.com/speed/webp/docs/riff_container),
and [GitHub's WebP support announcement](https://github.blog/changelog/2025-08-28-added-support-for-webp-images/).

## Reproduce the media

Media tools are optional. Python 3.10 or newer, Pillow and FFmpeg are not needed
to build or use the site, or to run its normal checks. The commands below use
Python 3.12 for the optional capture environment.

```sh
npm ci
npm run build
npx playwright install chromium
python3.12 -m venv work/tour-venv
work/tour-venv/bin/python -m pip install Pillow==12.3.0 imageio-ffmpeg==0.6.0
TOUR_PYTHON=work/tour-venv/bin/python npm run docs:tour
```

To use installed Chrome, prefix the last command with `BROWSER_CHANNEL=chrome`.
`BROWSER_EXECUTABLE` can select another Chromium executable. `TOUR_PORT` changes
the local preview port from its default of 4182. The encoder finds FFmpeg through
`TOUR_FFMPEG`, then `PATH`, then the `imageio-ffmpeg` package. Set `TOUR_PYTHON` to
the Python environment containing the optional media packages.

The command starts and stops its own preview server and browser.
`scripts/capture-tour.mjs` records screenshots and a frame manifest in the
ignored `work/readme-tour/` directory. `scripts/encode-tour.py` resizes the
frames, encodes the three formats, and checks their dimensions and timing.
The capture fails on browser JavaScript errors. Media generation is manual,
is not part of CI, and does not publish, deploy or schedule work.

## Committed outputs

| File in `docs/screenshots/` | Purpose |
| --- | --- |
| [site-tour.webp](screenshots/site-tour.webp) | Animated README hero with a nominal 60 fps motion cadence. |
| [site-tour.mp4](screenshots/site-tour.mp4) | Downloadable H.264 video at a constant 60 fps. |
| [site-tour.gif](screenshots/site-tour.gif) | GIF fallback with a 50 fps motion cadence. |
| [readme-poster.png](screenshots/readme-poster.png) | Fresh atlas screenshot and motion-free README alternative. |
| [brand-directory-desktop.png](screenshots/brand-directory-desktop.png) | Current directory filters and result cards. |
| [brand-research-desktop.png](screenshots/brand-research-desktop.png) | Research notes and evidence labels for Fox Brothers. |
| [weaves-tour-desktop.png](screenshots/weaves-tour-desktop.png) | Weave and pattern browsing with labeled schematic studies. |
| [weave-comparison-desktop.png](screenshots/weave-comparison-desktop.png) | Herringbone and houndstooth compared side by side. |
| [houndstooth-tour-desktop.png](screenshots/houndstooth-tour-desktop.png) | Houndstooth research and its colored weave diagram. |
| [science-tour-desktop.png](screenshots/science-tour-desktop.png) | The interactive weave and filament tools. |

Browser-test screenshots in the same directory are separate verification
artifacts. They are refreshed by `npm run test:browser` and recorded with the
browser report. After updating media, inspect the poster and a frame from each
scene, check distinct frames throughout moving scenes, verify encoded dimensions
and timing, and play the results in a browser. Confirm that GitHub renders the
README image and keep the download size small enough for a README. Capture real
UI behavior and preserve evidence labels.
