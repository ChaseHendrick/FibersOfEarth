# Brand directory research

The September 27, 2026 snapshot contains **2,241 directory entries**, separate from
the **112 material and technology profiles**. The directory includes 32 linked
textile profiles, 227 additional producer-reference entries, and 1,982 catalog
records. It contains 10,597 source-linked catalog statements and 64 original
producer-research notes across 62 brands. These figures measure records and
statements, not independently verified businesses or a global brand census.

## Reading the evidence

- **Textile profile:** an existing, substantial editorial profile with its own
  history, guide and citations. Its evidence limits remain visible there.
- **Producer references:** an original textile-focus description, company links,
  and, where available, company reading trails and attributed research notes.
- **Catalog research:** Wikidata descriptions and structured statements with
  source-entity links. They have not all been checked against primary sources.

Company and catalog evidence remain separate. Even when a producer note confirms
a date, an imported field remains labeled Wikidata. Conflicting dates or multiple
locations are retained with their source links. Dates are reduced to years and
can be approximate; they do not necessarily identify the legal incorporation of
the present entity. Location statements can be historical. No end date recorded
means unknown current status, not confirmed active trading. Websites from catalog
records may have changed ownership or disappeared; they are labeled accordingly.

## Discovery and review

The candidate pool contained 2,485 Wikidata entities. Discovery used the public
SPARQL service, English labels, and these classes and properties:

- Fashion label (`Q1618899`, including subclasses), clothing brand (`Q133459332`),
  textile manufacturer (`Q23754015`), and fashion house (`Q1941779`).
- Textile industry (`Q607081`) through industry property `P452`.
- Website `P856`, inception `P571`, dissolution `P576`, country `P17`, headquarters
  `P159`, founder `P112`, products `P1056`, and instance classification `P31`.

We removed records without English labels or sufficient business/brand
classification, people, unions, unrelated entity types and identified physical
building records. Matching names were consolidated where country or website
records supported identity, with an additional review for the named producer
entries. A brand and a parent company may remain distinct. Ambiguous homonyms
retain separate stable IDs and source records. This is conservative catalog
normalization, not a complete corporate-entity reconciliation.

A separate list of 227 producers covers cloth mills, yarn spinners, material
technologies, luxury houses, tailoring, knitwear, denim, outdoor clothing,
hosiery, underwear, sports clothing and workwear. Homepage checks were attempted
for that list, then up to three relevant same-site company/history/materials
pages per producer were fetched where available. 123 entries yielded a reading
trail. Fetched pages alone are not treated as verified evidence. Specific
research notes were selected and paraphrased after reading the relevant text.
Blocked, inaccessible or irrelevant pages did not generate findings. The
Cruciani reference uses its trade-show exhibitor profile because conflicting
content was observed at the company homepage.

Known gaps include local and non-English brands, businesses absent or misclassified
in Wikidata, incomplete founders and dates, changing company identities, and
product-level sourcing. No sustainability scores, material recipes, supplier
routes or certifications were inferred. Each page exposes open research questions.

## Maintain and extend

Edit `src/data/brand-directory.json` with stable IDs. Add primary-source findings
as `{text, title, url}` records, include the URL in the reading trail, and keep
claims narrow. Preserve the source for each imported fact. Do not replace a
source-reported fact with an unsupported guess or interpret the number of filled
fields as a quality rating. New full textile profiles belong in the existing
profile datasets and should be linked with `profileId`.

Run `npm run check:directory` for identity, provenance, URL and profile-link
validation. Run `npm run babysit` for the complete local check. It runs unit tests,
directory validation, the static build and browser verification, stopping at the
first failure. Install Playwright Chromium first, or set `BROWSER_CHANNEL=chrome`
for installed Chrome. CI invokes the same command on pushes and pull requests;
the Checks workflow also supports manual dispatch. There is no scheduled task,
auto-merge, deployment, or unattended external-site crawler in the babysit command.

The directory is bundled for offline reading. Static per-entry pages, an
alphabetical index and a JSON download are generated during build. Search filters
are shareable in the URL. Saved-brand shortlists stay in local storage, support
JSON export, and can compare the first four saved entries without ranking them.
