# Weaves and patterns

The guide adds **114 source-linked entries** for readers trying to recognize cloth or understand a product description. It explains how herringbone differs from houndstooth, how a knit differs from a weave, and why a motif does not identify a fiber. Every entry includes construction notes, recognition cues, common uses, distinctions, related terms and references.

This is a growing reference, not an exhaustive inventory of every textile, regional name or possible repeat. A manufacturer can combine several entries in one product: a cotton fabric might use a twill structure, a color pattern and a brushed finish. Appearance alone does not establish composition, origin, quality or a production method.

## Taxonomy and coverage

Each entry has one primary category for browsing. The category identifies the term's main role in this guide; it does not prevent the same cloth from having several descriptions.

| Category | Entries | What the name describes | Examples |
| --- | ---: | --- | --- |
| Weave structure | 17 | How warp and weft interlace | Plain weave, twill, herringbone, satin |
| Woven fabric | 19 | A cloth family with characteristic construction or surface | Denim, gabardine, velvet, seersucker |
| Knit structure | 15 | Connected loops or patterning within knitted fabric | Jersey, rib, interlock, cable, intarsia |
| Color pattern | 19 | A repeat defined by the arrangement of colors | Houndstooth, gingham, tartan, pinstripe |
| Motif | 19 | A recognizable design family, independent of one construction | Paisley, floral, chevron, Greek key |
| Surface & finish | 9 | A surface effect, including yarn texture or a treatment | Bouclé, slub, brushed fabric, moiré |
| Textile technique | 16 | A broader making, patterning or shaping process | Jacquard weaving, ikat, crochet, quilting |

The source files contain 39 entries in `weaves-woven.json`, 43 in `weaves-patterns.json` and 32 in `weaves-knits.json`. These file groupings are editorial ownership boundaries, not additional public categories. The existing 112 material profiles and 102 glossary terms remain separate collections.

Some distinctions deserve an explicit explanation rather than a shared alias:

- Herringbone describes a reversed twill arrangement; houndstooth describes a broken-check color effect often made with twill.
- Woven piqué and knitted piqué have different structures.
- Fair Isle and intarsia use different approaches to managing colored yarns.
- Quilting joins layers; patchwork joins pieces within a surface.
- Bouclé and slub are yarn effects that can appear in both woven and knitted cloth.

## Research and evidence

The initial guide research date is **September 27, 2026**, stored as `weaveReviewed` in `src/weaves.js`. References include CottonWorks, textile machinery makers, craft organizations, museums and relevant producers. Each entry links to its own sources instead of inheriting the full material profiles' evidence labels.

Descriptions are original, concise summaries. Technical references support construction and terminology; museum records can document a specific object or regional use; producer pages describe that producer's examples. None establishes that every item sold under a name uses the same construction. Trade vocabulary, spelling and regional usage can overlap.

A research date identifies an editorial pass, not independent verification of every product or a promise that sources will remain available. A successful HTTP request checks availability only. A blocked request may reflect a publisher's automated-access policy rather than a missing page. Preserve meaningful evidence and record uncertainty instead of substituting an unsupported origin story or precise date.

Do not import copyrighted photographs, published stitch charts or source passages to make an entry look complete. Reference links do not grant reuse rights. See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

## Visual scope

The guide uses inline SVG illustrations generated from local data. They have two forms:

| Visual | What it shows | What it does not establish |
| --- | --- | --- |
| `draft` | A repeated, simplified interlacing grid with example yarn colors | A full loom draft, threading plan, yarn specification or measured cloth surface |
| `motif` | A symbolic pattern family, loop study or surface study | An exact fabric swatch, knit stitch chart, photograph or registered design |

In a binary interlacing grid, columns represent warp yarns and rows represent weft picks. A `1` places warp above weft at that crossing; a `0` places weft above warp. The interactive detail view offers example cloth colors and a contrast view with green warp and gold weft. For houndstooth, this lets readers distinguish a color repeat from the underlying interlacing.

The motif illustrations are identification aids with deliberately limited fidelity. A generic loop study does not trace the actual loop path of every knit. A floral symbol does not demonstrate how lace, embroidery or burnout is constructed. Captions state those limits, and the text explains the relevant technique. Do not present these illustrations as production instructions or use them to certify a cultural or historical design.

## Reader features and routes

The interactive index is `#/weaves`. It supports alias-aware search, seven category filters, best-match or category ordering, 18 cards per page and comparisons of up to three entries. Global search also links to guide entries. Detail pages provide sources, related terms, sharing and a reading-edition link.

Examples:

```text
#/weaves?q=houndstooth
#/weaves?category=Knit%20structure
#/weaves?compare=herringbone,houndstooth
#/weaves/herringbone
```

The query fields are `q`, `category`, `sort`, `page` and `compare`. Comparison IDs are deduplicated, unknown IDs are ignored and the selection is limited to three. Comparison state lives in the URL fragment, so readers can share it without creating an account or local-storage collection. Filtering does not clear the selected comparison.

The full guide, search and diagrams are bundled in `dist/offline.html`. External references require a connection. The normal build also creates:

- `dist/weaves/index.html`, a categorized reading index.
- `dist/weaves/<id>/index.html`, one JavaScript-free page for each of the 114 entries.
- `dist/weaves/directory.json`, containing `schemaVersion`, `reviewed` and the full `entries` array.

The atlas JSON download also includes these records in its `weaves` field.

The 115 reading pages are included in the 2,585-URL sitemap. Interactive and static details use the same source data and shared renderer. Normal reading pages need the full `dist/` directory and its stylesheet; the standalone offline file bundles its own assets.

## Maintaining an entry

Edit the appropriate file under `src/data/`, then use the shared modules rather than creating a second description for the reading edition.

| Field | Requirement |
| --- | --- |
| `id` | Unique, stable, lowercase and hyphenated; preserve existing shared links |
| `name`, `category`, `aliases` | A clear preferred name, one existing category and genuinely useful alternate search terms |
| `summary` | A short explanation of what the name describes |
| `construction` | How it is made, with enough detail to distinguish the process |
| `recognize` | Practical visual or structural cues, qualified where appearance is insufficient |
| `uses` | Common applications, without implying suitability or certification for every product |
| `distinguish` | The nearby term or misconception readers should understand |
| `related` | Existing entry IDs, without self-links or duplicated entries |
| `references` | Descriptive titles and specific HTTPS source URLs supporting the explanation |
| `visual` | A valid `draft` or supported `motif`, consistent with the published caption |

Use aliases for spelling variants and true synonyms. Give separate entries to materially different constructions, while linking them and explaining the difference. Avoid creating entries merely to multiply a count. Prefer precise, specific references over generic publisher homepages. Keep unsupported chronology and numeric performance claims out of the guide.

Draft grids must be rectangular binary arrays with bound warp and weft yarns; the current validator accepts dimensions from 2 to 48 cells. Optional warp and weft colors use six-digit hexadecimal values. Motifs must use a renderer-supported kind. See `src/weaves-render.js` before adding a visual type or relying on a variant to produce a different drawing.

Run `npm run babysit` after a content or behavior change. The unit tests check record integrity, search, comparison state and diagrams. Browser checks cover the interactive controls, every static guide detail page at mobile width with JavaScript disabled, representative accessibility checks and offline rendering. These checks do not validate textile history or substitute for source review.

Update counts and scope in the README, [CONTENT.md](CONTENT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DEPLOYMENT.md](DEPLOYMENT.md), [TESTING.md](TESTING.md) and the changelog when coverage changes. Refresh the README tour when a visible change warrants it, following [MEDIA.md](MEDIA.md). All maintenance remains on demand or triggered by repository changes; no schedule is required.
