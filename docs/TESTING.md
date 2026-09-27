# Testing

[browser-results.json](browser-results.json) records the latest completed browser run, including its date and checked areas. The suite described below covers the brand directory, weave and pattern guide, reading editions and offline application. Content review dates are separate and are described in [CONTENT.md](CONTENT.md).

## Run the checks

Use Node.js 22 or newer, run `npm ci`, then install a browser once with `npx playwright install chromium`. Run `npm run babysit` for the complete sequence:

1. `npm test`
2. `npm run check:directory`
3. `npm run build`
4. `npm run test:browser`

The command stops at the first failure. To use installed Google Chrome, set `BROWSER_CHANNEL=chrome`; to use a specific Chromium binary, set `BROWSER_EXECUTABLE=/path/to/chromium`. Browser tests start their own local preview server. Build output goes to ignored `dist/`. Tests write evidence to `docs/browser-results.json` and `docs/screenshots/`; review intended evidence updates before committing them. The README tour is generated separately with `npm run docs:tour`; see [MEDIA.md](MEDIA.md) for the capture workflow.

The **Checks** workflow invokes the same command on pushes, pull requests and manual dispatch. There is no schedule, auto-merge, deployment or external-site crawl in babysit.

## Data and directory validation

The seventeen unit tests cover unique and complete profiles, source references, valid route coordinates and connected paths, combined search/filter/sort behavior, typo recovery and query syntax, glossary links, data-sheet references, dimensional calculations and converters. All 112 full profiles must have seven substantial research sections, key figures, HTTPS references, an evidence label and a reader guide. All glossary terms retain the original names and include science, history, valid related terms and references.

Three weave-guide tests cover complete source-linked records, unique IDs, category and alias search, cross-references, binary interlacing grids, colors, malformed pagination and comparison IDs, accessible SVG labeling and safe rendering. The houndstooth test distinguishes its colored cloth example from the warp/weft contrast view. These are data and behavior checks, not validation that a symbolic illustration matches every real fabric.

Directory tests cover composed filters, malformed pagination and corrupt or blocked shortlist storage. The separate directory validator checks all 2,241 entries for stable unique IDs, linked profiles, source-linked facts, source URLs, research-note trails and valid depth labels. These checks do not verify that imported facts are true or that external sites remain available.

## Browser coverage

The suite opens all 112 interactive material profiles and 115 journey routes. It exercises profile tabs, globe and map controls, library filters and sorting, saved-material persistence, material comparison, global search, science tools, display settings, unknown routes and escaped input. Fourteen main sections are checked at widths of 1440, 768 and 390 pixels for horizontal overflow. Selected views run axe rules for WCAG 2 A/AA and 2.1 AA; detected violations and JavaScript errors fail the run.

Directory checks exercise search, filters, pagination, saved-brand persistence, comparison, JSON exports and escaped input. Every generated brand page is audited for its heading and canonical URL. Representative brand pages and the alphabetical index are opened with JavaScript disabled; representative views are also checked for mobile overflow and accessibility. This is not a browser visit to every brand page.

Weave-guide checks exercise 18-card pagination, alias search, category filters, URL comparisons and reloading, comparison limits, global search, escaped input and the houndstooth contrast control. The guide index and all 114 detail pages are opened at mobile width with JavaScript disabled; headings, construction text, canonical URLs, structured data and horizontal overflow are checked. Representative interactive and reading views receive axe checks. The exported guide JSON and expanded sitemap are also checked.

The suite opens all 102 interactive glossary definitions and all 103 glossary reading pages, checking text, related links, metadata, structured data, sitemap coverage and missing-page 404 behavior. It opens all 112 material reading pages and all ten field-note pages with JavaScript disabled, plus their indexes. Field-note paragraphs are checked against source data, and local links, metadata and citations are checked. Representative reading views receive mobile-layout and axe checks.

The standalone `dist/offline.html` is opened from a file URL with populated materials, glossary-linked field notes, directory search, brand research notes and the houndstooth guide with its contrast diagram. Detailed same-origin map files are optional; the base globe remains bundled.

## Evidence limits

A completed passing run requires no browser JavaScript errors; its individual results are recorded in the evidence file. Screenshots in [screenshots](screenshots/) provide visual evidence for selected views. A passing run is not a full accessibility audit, screen-reader study, scientific peer review, live verification of every source or verification of supply chains. Routes remain illustrative, and evidence labels retain the limits in [CONTENT.md](CONTENT.md), [BRAND_RESEARCH.md](BRAND_RESEARCH.md) and [WEAVES.md](WEAVES.md).
