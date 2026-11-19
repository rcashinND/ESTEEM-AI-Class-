# Testing evidence — 19 November 2026

## Scope and authenticity
This report distinguishes automated software checks, agent-driven browser checks and supplied historical reviewer feedback. No new external participant testing or measured time-saving study was performed.

## Final safeguards revision — current evidence

All times below are UTC on 19 November 2026. No additional external participant research was performed.

- Added the first 49 regression cases before fixing source: `npm test` collected 62 tests, **16 passed / 46 failed**, including the newly reproduced defects and missing materials-state assertions. All original 13 remained passing. [Genuine development red-run output](evidence/release-red-run.txt); this was not the final suite. Further coverage brought the total to 68.
- Final `npm test`, 17:50 UTC: **68 passed, 0 failed, 0 skipped/cancelled/todo**, Node v24.22.3. [Raw output](evidence/release-tests.txt).
- Final `npm run verify:clean`: fresh source copy, empty HOME and allowlisted process environment; no app secrets or workspace node_modules. `npm install` succeeded with zero vulnerabilities, **68/68 tests passed**, `PORT=0 npm start` succeeded, and HTML plus four JS/CSS assets returned **200**. [Raw output](evidence/release-clean-install.txt). This shares the host's Node/npm and operating system; it is not independent cross-platform testing.
- Final GitHub archive check, 17:54 UTC: downloaded implementation commit `8d516558add05f77358194509eca49b5fb0b6d41` from the public repository and executed the downloaded clean verifier against that source. Install, **68 passed / 0 failed**, npm start and five HTTP 200 asset checks succeeded. [Raw GitHub-download output](evidence/release-github-clean.txt). Later documentation/evidence-only sync does not alter this tested application.
- Final documentation check: **52 local Markdown links checked, 0 broken**; `git diff --check` passed. This verifies local link targets and whitespace, not video availability or external sharing permissions.
- Preview/public HTTP comparison, 17:51 UTC: all five paths on each host returned **200**. Preview assets matched the final local source. Production already serves the revised simulated prototype, but its HTML lacks `Build: review-safeguards.` and its three changed JavaScript modules differ; CSS is unchanged. **Latest safeguards are not yet published.** [Status and SHA-256 comparisons](evidence/release-public-assets.txt).
- Final browser verification **PASS**: the [release browser report](evidence/release-browser.md) records actual enquiry → review → edit/reanalyse → reset checks, both audited defects, prepared/vague/empty states, and 390px mobile presentation. No app exceptions were observed. The missing favicon returns a cosmetic 404. Earlier browser evidence below is historical, not a substitute for this check.

Current genuine screenshots:
- [Desktop fence/socket result, side by side](screenshots/release-desktop-side-by-side.png)
- [Mobile empty-input error](screenshots/release-mobile-empty-error.png)
- [Mobile fence/socket result and caution](screenshots/release-mobile-fence-result.png)

The report distinguishes Stagehand interactions from supplemental headless Chromium/CDP screenshots and console capture. Photo-file selection, mobile review confirmation, keyboard/screen-reader accessibility and genuine touch input were not comprehensively verified. No recording was created.

### Final factual regression coverage

| Requirement | Actual automated result |
|---|---|
| Exact audited “I haven't bought…” plumbing input | Not confirmed materials, no affirmative purchased claim; South Bend and Tuesday retained |
| Contractions, curly apostrophes, have not, not bought, don't have, not yet purchased, unavailable | No negative-to-positive purchase reversal in covered cases; direct clarification question |
| Positive/negative contrasts, clause order, questions, conditionals, attributed speech, returned/sold materials | Materials remain Not confirmed; no confident purchase statement |
| Narrow unqualified first-person purchase | Customer-stated purchase retained; availability/compatibility require confirmation |
| Exact fence + faulty socket; reversed order; tap + fence + socket | All supported trade categories retained; electrical caution and unknown cause preserved |
| Negated work or unrelated purchased tap | No unsupported maintenance/plumber suggestion from those keywords |
| Tuesday → Wednesday and named location changes | Correct explicit facts, no stale fixture day/place; useful plumbing follow-ups |
| Vague, empty, whitespace, invalid types, repeat analysis | Unknowns/validation/independent result states preserved |
| HTTP assets, private paths, HEAD and POST | Assertions pass; object-property paths return 404 rather than spurious 500 |

The original analysis tests were not loosened. The existing server test's private-path coverage was strengthened. Tests assert fields, trade candidates, safety wording and absence of incorrect purchase statements, not merely existence of a response.

## Earlier revision — recorded prior evidence
The commands and browser checks below concern the preceding 13-test revision, not the final safeguards build. Original raw files are retained unchanged for traceability.

### Earlier executed commands
- `npm install`: success, zero vulnerabilities for this dependency-free application. The first workspace run warned about old node_modules lock metadata; the isolated clean install did not. [Raw workspace log](evidence/npm-install.txt).
- `npm test`: 13/13 passing. [Raw log](evidence/npm-test.txt).
- `npm run verify:clean`: isolated source copy, npm install, npm test, real npm start on an assigned port and all public assets returned 200. [Raw log](evidence/fresh-install.txt).

| ID | Input/action | Expected | Actual result | Status / evidence |
|---|---|---|---|---|
| T1 | Clean source folder, npm install/test/start | No workspace or secrets required | Zero vulnerabilities; 13 passes; startup and five assets HTTP 200 | PASS automated, fresh-install.txt |
| T2 | Original prepared plumbing enquiry | Plumber, South Bend, next Tuesday, purchased replacement; no invented urgency | All facts and follow-ups retained in assertions | PASS automated, npm-test.txt |
| T3 | Replace Tuesday with Wednesday | Wednesday, no Tuesday or unrelated fixture | Rules mode, Wednesday in timing/summary; South Bend and purchase retained | PASS automated |
| T4 | Original damp/socket enquiry | Multiple tentative trades, unconfirmed cause and electrical caution | Fixture uncertainty, missing location, optional photo and caution retained | PASS automated |
| T5 | Original vague bathroom enquiry | No invented renovation/trade | Job/trade unknown | PASS automated |
| T6 | Empty, whitespace, short, >4000 chars | Helpful validation | Throws as expected; browser results separately below | PASS automated |
| T7 | Analyse plumbing, then vague | No old location/details in new result | Independent result assertions pass | PASS automated |
| T8 | Editable summary | Only if supported | Read-only summary by design; edit original then rerun | NOT APPLICABLE; no editable-summary claim |
| T9 | Earlier public URL check | Revised disclosure and date marker | At that earlier time, HTTP response was old TrawdAI | Historical FAIL, superseded by current 200/revision/disclosure observation above. [Earlier capture](evidence/public-before.html) |
| T10 | Prepared regressions; changed place; negation/adversarial/unsupported | No wrong fixture or invented cause | Correct Dublin; unsupported/manual mode; uncertainty preserved | PASS automated |
| T11 | Five public assets, HEAD, private paths, POST | Assets 200; private paths and uploads rejected | HTTP assertions all pass | PASS automated, server.test.mjs |
| T12 | Faucet tomorrow urgent; fence repair; electrical/damp | Bounded rules, explicit facts, tentative trade/caution | Assertions pass | PASS automated |

### Earlier browser evidence
Real Chromium browser checks passed for Clear job and review confirmation, Wednesday, Dublin, Multiple trades, Vague enquiry, empty/whitespace input, repeated reset and unsupported website input. The original was retained and stale results were hidden on edit. At 390×844, scrollWidth and clientWidth were both 375: no horizontal overflow.

See the [complete browser report](evidence/browser-report.md), including observed fields, harness issues and console limitations.

- [Clear job](screenshots/clear-job.png)
- [Wednesday variation](screenshots/weekday-variation.png)
- [Multiple trades and electrical caution](screenshots/multiple-trades.png)
- [Empty-input validation](screenshots/empty-input.png)
- [390px mobile layout](screenshots/mobile.png)

Browser outcomes T2–T7 and T10 are PASS for the specific checks described in the report, not every possible input. T8 remains not applicable: the original can be changed, not the generated fields. The public browser independently loaded the older title without the revision marker. Photo preview was exercised using a synthetic in-page PNG; a genuine file-chooser upload was **NOT TESTED successfully** because the harness supplied an unsupported MIME type. No claim is made that image analysis exists. No dedicated console listener covered the entire browser session; no errors were captured in the available observations. Screen recording was unavailable.

## Reproduce
From a downloaded repository root run `npm install`, `npm test`, `npm start`, then open localhost:3000.
For each example click its button then Analyse Enquiry (buttons fill but do not submit).
Edit Tuesday to Wednesday and reanalyse; confirm the mode changes from prepared to rule-based. Clear before testing blank input. At 390px ensure controls remain reachable.

## Remaining verification
Production already serves the revised simulated prototype, not the old React build. Publish the final safeguards and verify its build marker, changed assets and central journey independently. Genuine photo-file selection remains outside final browser scope. Video, Drive access and Canvas submission are not tested or claimed.

## Earlier fresh GitHub download — PASS for the preceding revision

Committed the corrected source and evidence to the authorised course repository main branch and verified its head as `0eaf47b2db50ea5258e3fbc7a462c216b5f0efed`. Downloaded that exact public GitHub archive, extracted it to a clean folder, then ran the clean verifier against the extracted source. Installation reported zero vulnerabilities; all 13 tests passed; real npm start and all five assets returned 200. [Full output](evidence/github-clean-install.txt).

This establishes reproducibility for that preceding revision, not for the new safeguards source. Final GitHub delivery/download evidence is recorded in the submission checklist when verified.
