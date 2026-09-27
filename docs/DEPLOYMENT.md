# Deployment

## Build and preview

Use Node.js 22 or newer. Run `npm ci` and `npm run build`, then `npm run dev` to preview the complete build at `http://127.0.0.1:4173/`. The preview server serves `dist/`; it does not rebuild edited source files.

Deploy all of `dist/` to a static host. Build output is not committed. Hash-based app navigation needs no rewrite rules. Serve `assets/` with long-lived caching because file names change with content, and serve `index.html` without it.

## Offline copy

The build writes `dist/offline.html` with the app, material profiles, brand directory, weave and pattern guide, glossary, field notes, styles and base 1:110m map inlined. Open this single file in a modern browser without a server. Search, saved collections, weave comparisons and locally generated downloads remain available. Storage availability for local files depends on the browser.

Detailed zoom coastlines load from same-origin `geo/` files when hosted. The separate reading editions and their cross-page links require the rest of `dist/`; they are not included as separate files in the single-file download.

## Reading editions and canonical URLs

The current build includes JavaScript-free indexes and pages for:

| Path | Detail pages |
| --- | ---: |
| `materials/` | 112 material and technology profiles |
| `glossary/` | 102 terms |
| `learn/` | 10 field notes |
| `brands/` | 2,241 directory entries |
| `weaves/` | 114 weave, pattern and technique entries |

Each section has an index in addition to its detail pages. The root and all five sections contribute 2,585 URLs to `sitemap.xml`. The brand dataset is available at `brands/directory.json`; `weaves/directory.json` contains the guide entries, schema version and research date. These JSON files are downloads rather than additional sitemap pages.

The default canonical base is `https://chasehendrick.github.io/FibersOfEarth/`. For another address, build with `SITE_URL=https://example.com/your-path/ npm run build`. Use the actual published address; do not publish mismatched canonicals. Sitemap submission is optional and does not guarantee indexing or ranking. See [GLOSSARY-RESEARCH.md](GLOSSARY-RESEARCH.md), [BRAND_RESEARCH.md](BRAND_RESEARCH.md) and [WEAVES.md](WEAVES.md) for the content boundaries.

## GitHub Pages

The included **Deploy site** workflow is manually triggered. In repository Settings, select GitHub Actions as the Pages source, then run that workflow against the branch or commit you intend to publish. It builds and uploads the complete `dist/` directory. Merging or passing checks alone does not deploy the site.

The workflow uses GitHub's repository token and Pages permissions; no custom API key or application backend is required. If a custom domain is configured, preserve HTTPS and verify direct reading-page and fragment links at that address.

## Updating safely

Edit `src/`, run `npm run babysit`, and commit the source. Install Playwright Chromium first, or use `BROWSER_CHANNEL=chrome` for installed Chrome. Review the pull request before merging and manually deploy when ready. Preserve material and directory IDs so saved collections continue to resolve, and preserve weave-guide IDs so direct links and shared comparisons remain valid.

The **Checks** workflow runs the same babysit command on pushes, pull requests and manual dispatch. Neither workflow has a scheduled trigger. Babysit validates the repository and browser behavior; it does not crawl external sources, merge changes or deploy the site.
