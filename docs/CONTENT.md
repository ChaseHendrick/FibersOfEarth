# Content and evidence

The catalog contains 112 entries: 80 fiber/material references and 20 proprietary materials or technologies and twelve reference apparel or mill houses. These counts include named silk variants, fillings and historical materials. They are not 112 distinct chemical fiber classes.

Thirty material networks yield 115 named illustrative paths. Networks retain approximate geographic concepts from an earlier standalone atlas, with five added educational models. Routes are derived from connected origin-to-destination paths and curated for origin variation. They do not represent recorded transactions or actual transport itineraries.

## Editorial fields

Each material has a stable ID, name, family, composition, feel, uses, care, sourcing tradeoff, question, history and source references. Proprietary entries additionally identify their entry type and underlying material. Search aliases can refer to related grades or trade terms without creating duplicate generic classifications.

## Evidence distinctions

1. Technical and institutional references explain processes and material context.
2. Producer references identify proprietary names and their publishers' stated technologies.
3. Illustrative geographic links are educational models, not proof of supplier relationships.
4. Specialty legacy concepts retain an explicit unverified status.

Sources were selectively reviewed in September 2026. This update is not an exhaustive scholarly verification of every historical statement. Several extended entries use broad contextual references and should receive more material-specific primary citations in later editorial passes. Exact dates and numerical performance rankings are omitted when not substantiated. Commercial availability and brand ownership can change.

The source registry is visible in the application and included in JSON downloads. It distinguishes technical, institutional and producer references. Map attribution appears there and in THIRD_PARTY_NOTICES.md.

## Adding an entry

Use a stable lowercase hyphenated ID. Write original paraphrases, keep claims narrow, link evidence for exact dates or numbers, and classify the name correctly. Add an alias when a name describes a grade or synonym instead of a new material. Do not fabricate a geographic route to make a profile look complete. Reference-only profiles are intentional.

Maintain source IDs and relationships, then run unit and browser tests. Route additions need valid coordinates, connected edges, an origin, a destination and an explicit evidence status.

## Scope limits

The reference is broad, not exhaustive across every botanical species, polymer grade or trademark. Care advice is general; the complete product's label and manufacturer guidance govern. Technical and historical materials are included for context, not as recommendations for household processing or protective applications.

## Research profiles (edition 2.2)

Every catalog entry has a research profile in `src/data/details.json` with seven sections (source and geography, structure and chemistry, processing route, performance in use, identification, labeling law and standards, and deeper history), two to six key figures stated with their conditions, and two to five entry-specific references. The profiles hold 588 unique references across the detail layer and glossary additions, 291 of them peer-reviewed articles cited by DOI.

Each profile carries an evidence level:

- **verified** (96 entries): specific numbers, dates, names, ownership events and legal points were checked against the listed references. Sources are primary and institutional where possible: eCFR and FTC pages for US rules (16 CFR Parts 260, 300, 301 and 303), EUR-Lex for Regulation (EU) No 1007/2011, CITES, IWTO and Woolmark technical pages, Textile Exchange standards, museums and peer-reviewed literature. Producer statements are attributed to the producer.
- **editorial** (10 entries: PVC, PBI, Nuyarn, ZQ, Wolf vs Goat, Canali, Loro Piana, Piacenza 1733, Paul Smith and Yves Salomon): conservative, textbook-level context where public primary evidence is thin, or where the entry is a reference brand used to teach materials language. These entries avoid unsupported dates and figures and say what could not be verified.

Research took place on September 22, 2026. Web searches verified the first part of the pass. When the session's search allowance was exhausted, verification continued against PubMed records (abstracts and, where available, full text) and a pool of sources already confirmed in the same pass. Facts that could not be checked either way were omitted or stated qualitatively; several entries say explicitly what remains unverified (for example, some rare trade names, some Annex I name assignments and some craft histories). Key figures are approximate, drawn from cited studies or rules, and depend on the stated conditions and product. Legal descriptions explain what a rule covers; they are not legal advice, and current rule text controls. Corporate ownership reflects sources available in September 2026 and can change.

## September 26 editorial follow-up

The current catalog has 112 profiles: 80 material references, 20 proprietary materials or technologies, and twelve reference apparel or mill houses. The glossary has 102 terms; Learn has ten field notes. Source review in this follow-up covers the revised Canali and Loro Piana geography, district references, the new summer-cloth guide, and selected Fresco, gabardine and high-twist claims. It is not a fresh verification of every older profile.

Canali’s producer history identifies Triuggio and distinguishes the earlier workshop from company formation in 1934. LVMH locates the present Loro Piana company’s founding in Quarona in 1924. The Italian districts note cites national tourism and municipal accounts for Biella, Prato and Como. Producer performance statements remain attributed; illustrative comparisons are not laboratory results.

Edit research data directly in `src/data/details.json`, `guide.json`, `datasheet.json` and `glossary-extended.json`. The temporary upload shards and duplicate loaders have been removed. Field notes and their source registry are in `src/content-articles.js` and `src/content-sources.js`. `scripts/articles-build.mjs` creates JavaScript-free pages from the same note records; a note can supply its own `reviewed` date.

The additional house profiles cover ZEGNA, Brunello Cucinelli, John Smedley, Johnstons of Elgin, Vitale Barberis Canonico and Reda. Each has a cited history and an editorial reading guide, not a laboratory assessment of the brand. VBC’s family-textile record in 1663 is distinguished from the named company in 1936; Johnstons’ Hawick knitting milestone is distinguished from its earlier house history. New profiles add no mapped supply routes or property scores.

## Brand directory

The separate 2,241-entry research directory is documented in [BRAND_RESEARCH.md](BRAND_RESEARCH.md). Its imported catalog records are not counted as complete material profiles. Facts preserve source links and visible evidence limits, while original producer notes are separately attributed.
