# Glossary research and reading pages

The current glossary contains **102 terms**, preserving all 32 original names and offline availability. The main research pass on September 22, 2026 expanded the set to 99 terms; the September 26 editorial follow-up added Fresco, Gabardine and High-twist. Those dates describe distinct passes, not a new verification of every definition. No outside review or scientific peer review is claimed.

## Research method

Technical terminology draws on institutional and industry sources including Cotton Incorporated's CottonWorks guides, Woolmark, the International Wool Textile Organisation, the Alliance for European Flax-Linen & Hemp, BISFA, the Cashmere and Camel Hair Manufacturers Institute, Textile Exchange, NC State and the Craft Yarn Council. Lenzing and The LYCRA Company support descriptions of their own technologies and brand terminology. Manufacturer claims are not independent comparative evidence.

Each definition has a short answer, explanation, original practical example, distinctions, science and numbers, origins and history, related terms and linked references. Source records live in `src/glossary.js` and `src/data/glossary-extended.json`. Practical examples are teaching scenarios, not verified product claims. Numeric denier and micron examples are dimensional calculations.

The glossary distinguishes yarn linear density from fiber diameter, regenerated cellulose from recycled content, and traceability from certification. Its legal and certification entries explain cited instruments and their scope; current official rules control. Historical and editorial interpretations retain the evidence limits described in [CONTENT.md](CONTENT.md). Producer and contextual references for the newer cloth terms do not establish performance for every garment using those names.

## Reading and search

The interactive application uses `#/glossary` and `#/glossary/:id`, with ranked search, aliases, typo tolerance and combined topic/letter filters. Material profiles and field notes automatically link selected glossary mentions. Linking excludes common-word terms and known false friends, such as biological intermediate filaments.

A shared renderer generates `glossary/index.html` and 102 complete definition pages, for 103 glossary URLs in the current sitemap. These contain the actual text and normal links without JavaScript. The build also creates material, field-note and brand-directory reading editions, bringing the complete sitemap to 2,470 URLs including the root.

Each glossary definition has a title, description, canonical URL, Open Graph metadata, DefinedTerm structured data and BreadcrumbList structured data. The index uses DefinedTermSet. Structured descriptions match visible definitions. No search-engine indexing, rich-result eligibility or ranking improvement is promised.

See [TESTING.md](TESTING.md) for checks of every definition route and reading page, related-term navigation, metadata, structured data, mobile layout and representative accessibility scans.

## Deployment and offline use

The default canonical base is `https://chasehendrick.github.io/FibersOfEarth/`. Set `SITE_URL` before building if the published address differs. Deploy the complete `dist/` directory using the manual Deploy site workflow; a source commit or successful check run alone does not publish the site. Verify the production address before submitting a sitemap if desired.

Open `dist/offline.html` for the complete interactive app without a server. For separate reading pages, run `npm run build` followed by `npm run dev` to serve all of `dist/` locally. No external scripts, fonts or services are required to read the definitions. See [DEPLOYMENT.md](DEPLOYMENT.md).
