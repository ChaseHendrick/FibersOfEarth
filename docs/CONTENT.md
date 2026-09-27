# Content and evidence

The current edition has **112 full material and technology profiles**: 80 fiber/material references, 20 proprietary materials or technologies, and twelve reference apparel or mill houses. These include named silk variants, fillings and historical materials; they are not 112 distinct chemical fiber classes. The glossary contains 102 terms and Learn contains ten field notes.

The separate **2,241-entry brand directory** contains 32 links to those full profiles, 227 producer-reference entries and 1,982 catalog records. Its snapshot date is September 27, 2026. A directory listing is not a complete material profile or an independently verified business. See [BRAND_RESEARCH.md](BRAND_RESEARCH.md) for discovery, deduplication, source provenance and known gaps.

The **114-entry weave and pattern guide** is a separate reference for constructions, color patterns, motifs and techniques. It adds no material profiles or glossary terms. Entries explain construction, recognition, common uses and easily confused names, with their own references and labeled schematic visuals. Its seven categories and maintenance rules are documented in [WEAVES.md](WEAVES.md).

Thirty material networks yield 115 named illustrative paths. They retain approximate geographic concepts from an earlier standalone atlas, with five added educational models. Routes follow connected origin-to-destination paths and are curated for origin variation. They do not represent recorded transactions, supplier relationships or actual transport itineraries.

## Editorial fields and sources

Each full profile has a stable ID, name, family, composition, feel, uses, care, sourcing tradeoff, question, history and source references. Proprietary entries identify their entry type and underlying material. Search aliases can describe related grades or trade terms without creating duplicate generic classifications.

The research layer supplies seven sections: source and geography, structure and chemistry, processing, performance, identification, labeling and standards, and deeper history. Key figures retain their conditions and references. The reader guide adds types, fabrics, buying cues, advantages, drawbacks, care and frequently asked questions. Brand profiles can explain materials language without implying a measured property of everything a company sells.

Technical and institutional references support material context. Producer references identify proprietary names and what their publishers claim. Neither type establishes a geographic route unless it specifically documents that relationship. The source registry is visible in the application and included in atlas JSON downloads. Directory facts preserve their own source links. Map and imported-data attribution appears in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

## Evidence labels and review dates

The full-profile data currently carries 96 **verified** labels and 16 **editorial** labels. These are editorial classifications, not certifications or proof that every statement is current:

- **Verified:** the earlier research pass recorded checks against the listed references for specific technical, historical or legal statements. Sources include institutional guidance, primary rules, museums and research literature; producer statements remain attributed.
- **Editorial:** conservative contextual interpretation or reference-brand coverage with explicit limits where primary evidence is incomplete. Unsupported dates and figures should be omitted or qualified.

The September 22, 2026 research pass established most of the older profile and glossary layer. Its recorded method used web searches, PubMed records and sources already checked during that pass. Those older checks were not all repeated during the directory expansion. Legal descriptions explain the scope of cited instruments; the current rule text controls. Corporate identity, commercial availability and ownership can change.

The September 26 follow-up added reference houses and selected cloth terminology, revised Canali and Loro Piana geography, and strengthened sources for Biella, Prato, Como and the summer-cloth note. The six further house profiles cover ZEGNA, Brunello Cucinelli, John Smedley, Johnstons of Elgin, Vitale Barberis Canonico and Reda. They distinguish earlier textile activity from present-company dates where the evidence supports that distinction. They add no mapped supply routes or laboratory scores.

The September 27 directory expansion uses separate research-depth labels: **Textile profile**, **Producer references** and **Catalog research**. Source-reported Wikidata statements remain labeled as imported facts even when a producer note independently discusses the same topic. A snapshot or retrieval date is not a fresh verification date for every claim. Missing end dates do not establish that a business still trades, and country associations do not establish manufacturing locations.

The September 27 weave and pattern research pass consulted technical industry references, museums, craft organizations and relevant producers. These entries use original summaries and source links rather than the full-profile evidence labels. A research date is not proof that every product sold under a term has that construction. Source availability checks establish whether a link responds, not whether its claims are true. Regional and trade usage can overlap.

## Maintain the content

Use stable lowercase hyphenated IDs, write original paraphrases, link evidence for exact dates or numbers, and classify names correctly. Add an alias when a name describes a grade or synonym. Do not fabricate routes, certifications or property scores to make an entry look complete. Reference-only profiles are intentional.

| Content | Source |
| --- | --- |
| Full-profile research, reader guides and data sheets | `src/data/details.json`, `guide.json`, `datasheet.json` |
| Full brand and technology profiles | `src/brands.js` and the profile datasets |
| Glossary | `src/glossary.js`, `src/data/glossary-extended.json` |
| Field notes and source registry | `src/content-articles.js`, `src/content-sources.js` |
| Brand directory and per-fact provenance | `src/data/brand-directory.json` |
| Weaves, patterns, knit structures and surface techniques | `src/data/weaves-woven.json`, `weaves-patterns.json`, `weaves-knits.json` |

Keep source IDs and relationships valid. Full-profile additions require their related data and guides; directory additions follow [BRAND_RESEARCH.md](BRAND_RESEARCH.md). Weave-guide changes follow [WEAVES.md](WEAVES.md): classify the term, cite its construction or technique, and distinguish symbolic motifs from interlacing diagrams. A field note can supply its own `reviewed` date. The reading editions and offline app are built from these same records.

Run `npm run check:directory` for directory integrity, then `npm run babysit` for the complete check sequence. Route additions require valid coordinates, connected edges, an origin, a destination and an explicit evidence status. Automated checks validate structure and behavior, not the truth of external claims.

## Scope limits

The reference is a finite research snapshot, not a census of every brand, botanical species, polymer grade, textile pattern or trademark. Care advice is general; the complete product's label and manufacturer guidance govern. Technical and historical materials are included for context, not as recommendations for household processing or protective applications. No universal quality or sustainability ranking is implied.
