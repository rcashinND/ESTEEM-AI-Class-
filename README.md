# Trawd AI — prototype revision

Course: Current State and Future of Generative AI (ESTM 60244), University of Notre Dame. Revision: 19 November 2026.

## Purpose and users

Self-employed tradespeople often assess enquiries while also doing the work. Trawd keeps the original message beside a structured summary of trades, scope, location, timing, urgency, unknowns and follow-up questions. The tradesperson—not the software—decides what happens next.

## Demo and submission navigation

- [Public demo](https://trade-lead-ai.replit.app/) — **checked 19 November: the revised simulated prototype is live and returns HTTP 200. The final correctness changes described here still require republishing.** The latest build adds “Build: review-safeguards.”; that marker was absent from production at the recorded check. See [asset comparison](docs/evidence/release-public-assets.txt).
- [Course repository](https://github.com/rcashinND/ESTEEM-AI-Class-)
- [Feedback response](docs/feedback-response.md)
- [Revision report](docs/revision-report.md)
- [Testing evidence and genuine screenshots](docs/testing-evidence.md)
- [Draft AI-use disclosure](docs/ai-use-disclosure.md)
- [Two-minute demo script and recording checklist](docs/demo-script.md) — video not yet recorded or uploaded.
- [Final submission checklist](docs/submission-checklist.md)

## What actually runs

**Simulated AI prototype: no live generative model, paid API or external package is connected.**
Three exact prepared scenarios preserve reviewed responses. Other messages use limited rules for explicitly requested tap/faucet replacement, plumbing symptoms, electrical symptoms and a few maintenance terms. Supported trades accumulate instead of overwriting each other; negated/conditional work clauses are skipped and unsupported requests require manual review. Location extraction supports a capitalised place after “in” or “at”; weekdays, today/tomorrow, next week/month, and a short list of urgency phrases are recognised. Rules preserve matched wording rather than resolving dates or diagnosing causes.

Materials purchase is only retained as **customer-stated**, not independently verified, for a narrow first-person affirmative sentence with no detected qualification or contradiction. “Haven’t bought”, “have not”, “don’t have”, “not yet purchased”, uncertainty and contrasting statements instead show **Not confirmed** and request clarification. The rules do not turn “not purchased” into “purchased”, do not claim materials are available, and do not infer a plumbing job merely from buying a tap. Unsupported wording is deliberately not resolved; this is not a general-purpose negation parser.

Changing Tuesday to Wednesday or South Bend to Dublin no longer restores the old prepared details. Wednesday retains useful time/compatibility/severity follow-ups. A fence repair plus a faulty socket retains both electrician and carpenter/general-maintenance suggestions and the electrical caution, without asserting a cause. Results explicitly say whether they are prepared, rule-based, or manual-review. Unsupported messages can retain matched scheduling/location phrases without claiming the job was understood. Unknown fields read “Not provided,” meaning not extracted—not proof the information is absent.

Original text remains in the input beside the read-only result. Editing it hides the old result and resets review. Clear removes the message, summary, review status and photo previews. Optional photos are local previews only, never analysed. No jobs are priced, sent, accepted or rejected.

## Install and run

Node.js 20+ and npm are sufficient. No credentials, database, build step or pnpm workspace are needed.

```bash
git clone https://github.com/rcashinND/ESTEEM-AI-Class-.git
cd ESTEEM-AI-Class-
npm install
npm test
npm start
```

Open `http://localhost:3000`. A host may supply `PORT`; the server binds `0.0.0.0`. In Replit, Run uses `npm start`. Downloading GitHub's ZIP also works: extract it and run these commands in the folder containing `package.json`.

Required layout:

```text
package.json          package-lock.json     server.mjs
public/
  index.html          app.js                style.css
  analysis.mjs        rules.mjs
tests/
  analysis.test.mjs    server.test.mjs       verify-clean.mjs
docs/
```

Do not move assets or tests to the root: the server deliberately serves only the allowlisted public files.

## Tests

```bash
npm test                  # logic and real HTTP tests
npm run verify:clean      # temp clean copy, npm install/test/start, asset checks
```

The clean verifier also accepts a source directory: `node tests/verify-clean.mjs /path/to/extracted/repository`. It uses a temporary source copy, fresh HOME and allowlisted environment without app secrets or workspace node_modules. It still uses the host's Node/npm toolchain, not a separate operating system.
The final suite has **68 tests: 68 passed, 0 failed**. The original 13 tests remain, with stronger private-path checks. See [raw final test output](docs/evidence/release-tests.txt) and [fresh install/test/start output](docs/evidence/release-clean-install.txt).
The [evidence report](docs/testing-evidence.md) separates automated results, browser checks and external user testing.
The [final browser pass](docs/evidence/release-browser.md) verified the core review journey, both corrected defects, validation and desktop/mobile presentation. No app exception was observed; a missing favicon produces a cosmetic 404. Photo-file selection and full assistive-technology/touch coverage remain unverified.

## Revisions and limitations

The repository's previous root-level assets contradicted server/test paths, explaining the reported 500 and test-import failure. This revision puts assets under `public/` and tests under `tests/`, adds a lockfile, verifies assets over HTTP, and tests clean startup. The public hosting issue is separate: source edits do not republish an existing deployment.

Rules are deliberately limited: unfamiliar negation, cross-clause references, lowercase/complex place names, synonyms, quantities and compound jobs can be omitted or misclassified. Materials safeguards intentionally prefer “Not confirmed” over accepting loosely worded purchases. Multiple timing/location statements are flagged, not resolved. Safety warnings are cautions, not hazard assessment. Summary fields are not editable; correct the original and rerun. No time-saving or model-accuracy claims have been validated with new participants.

Messages/photos stay in browser memory; refresh clears them. Do not paste real contact details. Existing historical database/storage resources from an older version are not used or erased by this app.

## Status

The final source and clean-copy checks pass. Production already runs the revised simulated prototype, but its assets do not yet include these final safeguards. Latest-build republishing and signed-out production checks are still required. Video sharing and Canvas submission are not completed or claimed. See [submission checklist](docs/submission-checklist.md) for delivery evidence and remaining actions.
