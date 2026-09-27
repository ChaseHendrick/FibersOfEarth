# Contributing

Use Node.js 22 or newer. Install dependencies with `npm ci` and the test browser with `npx playwright install chromium`, then run `npm run babysit`. It runs unit tests, directory integrity checks, the static build and browser tests, stopping at the first failure. Installed Chrome is supported with `BROWSER_CHANNEL=chrome`.

For a quick local preview, run `npm run build` and `npm run dev`. The server serves the current `dist/` build, so rebuild after source changes. Build output is not committed.

Keep changes focused and describe the user-visible outcome. Add regression coverage for behavioral fixes. Check desktop, tablet and phone layouts, keyboard focus, empty results, direct routes and offline operation. Review generated browser evidence before committing screenshots or `docs/browser-results.json`. Refresh the README tour with `npm run docs:tour`; see [media guidance](docs/MEDIA.md) for capture requirements.

For full profiles, glossary terms and field notes, follow [the editorial methodology](docs/CONTENT.md). For the separate directory, follow [brand research guidance](docs/BRAND_RESEARCH.md) and preserve per-fact provenance and research-depth labels. A catalog listing is not a fully researched profile. Prefer primary references, distinguish brand names from generic fiber types, and label route evidence honestly. Never infer certifications, manufacturing locations or actual supplier connections from a geographic model or country association. Do not reproduce long passages from source sites.

Keep material and directory IDs stable because readers may have saved them locally. Update [PRIVACY.md](PRIVACY.md) for storage or data-flow changes, and document new export fields or reading-page routes. Preserve third-party license notices and keep the hosted canonical address consistent with [deployment guidance](docs/DEPLOYMENT.md).

Use the project name or the creator's pseudonym, **Chaos**, in public attribution. Do not add personal names, local filesystem paths, credentials, original private archive contents or unrelated projects to the repository. Do not use em dashes.

Update `CHANGELOG.md` and relevant documentation when behavior, content or deployment changes. Use a pull request and let automated checks pass before merging. Checks run on pushes, pull requests and manual dispatch; there is no scheduled automation. Deployment is a separate manual workflow.
