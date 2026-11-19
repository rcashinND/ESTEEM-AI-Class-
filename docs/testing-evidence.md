# Testing evidence — 19 November 2026

## Scope and authenticity
This report distinguishes automated software checks, agent-driven browser checks and supplied historical reviewer feedback. No new external participant testing or measured time-saving study was performed.

## Executed commands
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
| T9 | Public URL | Revised disclosure and date marker | HTTP response still old TrawdAI; neither marker present | FAIL release acceptance; BLOCKED on Republish. [Status](evidence/public-status.txt), [captured response](evidence/public-before.html) |
| T10 | Prepared regressions; changed place; negation/adversarial/unsupported | No wrong fixture or invented cause | Correct Dublin; unsupported/manual mode; uncertainty preserved | PASS automated |
| T11 | Five public assets, HEAD, private paths, POST | Assets 200; private paths and uploads rejected | HTTP assertions all pass | PASS automated, server.test.mjs |
| T12 | Faucet tomorrow urgent; fence repair; electrical/damp | Bounded rules, explicit facts, tentative trade/caution | Assertions pass | PASS automated |

## Browser evidence
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
The current public release must be republished and checked independently. Video, Drive access and Canvas submission are not tested or claimed. Fresh GitHub download and browser results are recorded below only after execution.
