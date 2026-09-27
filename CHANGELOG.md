# Changelog

## 2.5.0 - Unreleased

- Added a 114-entry weave and pattern guide across seven categories, including herringbone, houndstooth, woven cloth families, knits, motifs and surface techniques. Each entry has original construction and recognition notes, common uses, distinctions and references. Coverage and visual limits are explicit.
- Added alias search, category filters, 18-card pagination, shareable comparisons of up to three entries, global search results and a warp/weft contrast control for interlacing diagrams. The guide works in the standalone offline application without adding local-storage keys.
- Added 115 JavaScript-free guide pages, a guide JSON download and sitemap coverage for 2,585 URLs. Expanded unit, mobile, offline, accessibility and reading-page checks, and documented the guide's taxonomy and maintenance.

- Refreshed the README with a 60 fps animated WebP tour, a 60 fps H.264 video, a 50 fps GIF fallback, a motion-free screenshot, current feature and research counts, and a documentation index. Added reproducible media capture tooling with fresh browser frames throughout moving scenes.
- Updated architecture, privacy, contribution, deployment and testing guidance for the brand directory and on-demand repository checks.
- Corrected project links and generated canonical URLs to the current GitHub Pages address after the old address stopped resolving.

- Added a 2,241-entry brand, mill and textile-business directory with 10,597 attributed catalog statements and 64 producer-research notes. Evidence depth and historical uncertainty are explicit.
- Added directory search, country/category/history filters, shareable views, local saved brands, comparison, JSON exports and JavaScript-free reading pages.
- Added on-demand repository babysitting and manual CI dispatch, with directory provenance validation and expanded offline/mobile/browser coverage. No schedule.

- Glossary: first-class **Fresco**, **Gabardine**, and **High-twist** terms; Gabardine removed from Twill aliases and cross-linked.
- Wool guide: clearer split between farm micron / superfine classing and IWTO Super S **cloth** numbers; fresco called out as open high-twist tropical suiting language (trademark vs generic).
- Learn: field note on Italian textile districts (Biella worsted wool, Prato regenerated cardato wool, Como silk), stressing mill name ≠ fiber origin.
- Initial six reference houses: Wolf vs Goat, Canali, Loro Piana, Piacenza 1733, Paul Smith and Yves Salomon. These profiles add no supplier relationships to the atlas.
- Added ZEGNA, Brunello Cucinelli, John Smedley, Johnstons of Elgin, Vitale Barberis Canonico and Reda with full editorial profiles, reader guides, cited heritage timelines and search aliases.
- README: positioning line, micron-scale and Italy-districts SVGs, wider screenshot gallery; catalog counts 112 profiles / 32 linked brand profiles / 102 glossary terms / ten field notes.

- Added a practical summer-cloth field note and JavaScript-free reading pages for all ten notes, with an index, glossary links, source citations and sitemap entries.
- Corrected Canali and Loro Piana geography using producer histories; added district-specific sources and improved Fresco, gabardine and high-twist references.
- Consolidated uploaded research fragments into the four canonical JSON datasets and removed temporary upload probes.

## 2.4.0 - 2026-09-22

- Data sheets: sourced physical properties (density, moisture regain, tenacity, elongation, melting or decomposition, limiting oxygen index and more) with test conditions, a dated timeline of verified milestones, and world production figures with year and scope, each linked to its reference. Shown in the Science, History and Overview tabs and on every material reading page.
- Compare properties (`#/properties`): one table of every material with published values, sortable by any column in either direction and filterable by family. Values are normalized to one unit per column (tenacity in cN/tex) and ranges sort by midpoint; published values and conditions stay visible.

## 2.3.0 - 2026-09-22

- A JavaScript-free reading edition of every material at `materials/<id>/` plus a materials index: the full guide and research layers, key figures, table of contents, FAQ, sources and citation, with canonical URLs, Open Graph metadata, Article, FAQPage and BreadcrumbList structured data. The sitemap now lists 202 URLs, and each interactive profile links to its reading edition.
- Sort orders across the site: Z to A in the atlas list and journeys, family and most-journeys in the atlas list, fewest stages and material name for journeys, most sources first in the library, and best match, A to Z, Z to A and by topic in the glossary and histories.
- Editorial emphasis in profile and glossary prose: species names in italics, legal and standard citations in medium weight, up to three key figures per paragraph in semibold and a lead sentence.

- The site is now a multi-file static build: a small HTML shell with content-hashed script and stylesheet assets, glossary pages that share the stylesheet, and generated research content stored as JSON under `src/data/`. Build output is no longer committed (CI builds and deploys it); `dist/offline.html` remains available as a single-file offline copy.

- Every material gains a reader guide: types and grades, fabrics and products, how to judge quality, advantages and drawbacks, environmental and social footprint, a detailed care guide, an FAQ and notable facts, with references. Profiles reorganize into Overview, Types & fabrics, Buying & care, History, Science, Journeys, Labeling & law and a printable Full profile. Library cards show two key figures, and search covers the new sections (a search for denim finds cotton).
- The mouse wheel zooms the globe toward the pointer; at the zoom limits the page scrolls. Two-finger pinch zooms on touch screens.
- Keyboard control of the globe: arrow keys rotate and tilt, plus and minus zoom, 0 recenters on the route, P pauses motion; a polite live region announces the view. The globe's accessible name includes a spoken summary of the route.
- Display settings (header button): reduce motion, larger text (115% or 130%), high contrast and underlined links, stored in this browser.
- Full-screen map control and a scale bar that tracks zoom.
- Detailed 1:50m and 1:10m coastlines now load on demand from the same site instead of being bundled, cutting the standalone page from about 5.5 MB to about 1.2 MB. Opened from a local file, the globe keeps the bundled 1:110m map.

## 2.2.1 - 2026-09-22

- Each fiber's globe now opens centered on its trade route, zoomed so every stop fits; Reset returns to that view.
- The idle motion sways gently around the route instead of spinning it out of view; it holds still from 1.8x so detailed coastlines stay sharp.
- Zoom range widened to 0.6x to 16x, with ctrl/cmd+wheel, trackpad pinch and double-click zoom.
- Detail rises with zoom: Natural Earth 1:50m coastlines and borders, country names, a 5 degree grid and stage descriptions under place names from 1.8x; 1:10m coastlines from 4x; a 1 degree grid from 8x. Only polygons reaching the visible part of the globe are drawn, and a few reversed-winding 1:10m islets are corrected so they cannot flood the view.
- Home views center each route on the smallest spherical cap holding its stops, so wide routes such as New Zealand to Europe stay on one face of the globe.
- Traveling arrows are placed by one animation loop on the current arc, fixing arrows that flickered on short arcs or stuck in the top-left corner; arcs shorter than 40 px show no arrows.
- Removed the tap highlight, click focus ring and text selection when clicking or dragging the globe (keyboard focus still shows).

## 2.2.0 - 2026-09-22

- Added a research profile to all 100 catalog entries: source and geography, structure and chemistry, processing route, performance in use, identification, labeling law and standards, a deeper history, key figures with conditions, and entry-specific references with an evidence level.
- Expanded the glossary from 32 to 99 terms across fiber science, yarn formation, measurement, construction, coloration, claims and labeling law. Every term now includes "The science and numbers" and "Origins and history" sections and inline-linked references.
- Replaced substring matching with a ranked, offline search engine: field-weighted BM25 scoring, typo tolerance, prefix completion, British and American spelling folding, quoted phrases, exclusions, field filters such as `law:` and `chemistry:`, match snippets and "did you mean" suggestions.
- Added "Cite this profile" (APA and BibTeX), automatic glossary links in profile and glossary prose, research rows in comparisons, and glossary data in the JSON export.
- Added yarn-count (tex, dtex, denier, Nm, Ne) and fabric-weight (g/m2, oz/yd2, momme) converters to the science lab.
- Raised route arcs above the globe with ground shadows, direction chevrons, flowing dashes and traveling arrows, plus a pausable slow globe rotation that respects reduced-motion settings.
- Added an optional `BROWSER_EXECUTABLE` override for browser tests.

## 2.0.0 - 2026-09-22

- Rebuilt the fiber atlas with a responsive editorial interface and four primary navigation sections.
- Expanded the catalog to 100 material and proprietary-technology entries, each with historical context.
- Added 115 named illustrative journeys, route search and sorting, regional views and local JSON exports.
- Added qualitative material comparisons, local bookmarks, global search and direct links to profile tabs.
- Added field notes, a glossary, source methodology and an interactive science lab with weave and filament-diameter models.
- Bundled map data and runtime code for offline use without a build step for readers.
- Added automated data, routing, interaction, responsive-layout and accessibility checks, CI, project documentation and license notices.
- Removed personal branding, original review pages and unsupported live-tracking implications.

## 2.1.0

- Expanded all 32 glossary definitions with explanations, examples, distinctions, related terms and technical references.
- Added alias search, topic and letter filters, and glossary results in global search.
- Added a JavaScript-free reading edition with 33 static pages, unique metadata, structured data and a sitemap.
- Documented research sources and deployment requirements for search discovery.
