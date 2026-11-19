# Submission and release checklist

## Completed locally
- Source revision, supported rule extraction, clear mode labels, fixture regression.
- Correct public/ and tests/ layout; Node/npm commands and lockfile.
- [68 passing automated tests, zero failures](evidence/release-tests.txt), including 55 additions to the original 13.
- [Final fresh-copy install/test/start/HTTP evidence](evidence/release-clean-install.txt), using fresh HOME and an allowlisted environment.
- Feedback response, report, testing evidence, draft disclosure and demo script.
- [Earlier browser report](evidence/browser-report.md) and five genuine screenshots; [final release browser report](evidence/release-browser.md) records the new pass separately.

## Public release — existing revision live; final safeguards require Republish
Verified URL: https://trade-lead-ai.replit.app/ . The current 19 November check returns HTTP 200, “Revision: 19 November 2026” and “Simulated AI prototype”. It is no longer the old React build. At 17:51 UTC its changed assets did **not** match the final safeguards source and its HTML lacked `Build: review-safeguards.`. [Raw current comparison](evidence/release-public-assets.txt).

1. In this Replit project, open Publishing and click **Republish** (or Publish).
2. Use the prepared Node server configuration; no build step or AI secrets are needed.
3. Wait for success. Open the public URL in a fresh signed-out window.
4. Confirm “Build: review-safeguards.”, revision and simulation disclosure. Check Clear job, Wednesday, “haven't bought”, fence plus faulty socket, Multiple trades and empty input.
5. Compare changed public modules to the final source and record the actual release time/outcomes. Source/Preview success is insufficient.

The agent cannot perform the user-controlled Publish action.

## GitHub
Target repository identified through the authorised connection: https://github.com/rcashinND/ESTEEM-AI-Class- (main).
The preceding revision's code, documents and five screenshots were committed to main via the authorised GitHub connection and its branch head was verified:
[verified implementation commit](https://github.com/rcashinND/ESTEEM-AI-Class-/commit/0eaf47b2db50ea5258e3fbc7a462c216b5f0efed).
A fresh GitHub archive of that preceding commit passed installation, all 13 tests, npm start and five HTTP asset checks: [prior evidence](evidence/github-clean-install.txt). This does not establish remote delivery of the new final safeguards. Final sync status is recorded below after the operation is verified.

Final safeguards implementation was committed to main through the authorised GitHub connection and its branch head verified:
[final implementation commit](https://github.com/rcashinND/ESTEEM-AI-Class-/commit/8d516558add05f77358194509eca49b5fb0b6d41).
A fresh public GitHub archive of that exact commit was downloaded at 17:54 UTC and ran its own clean verifier: successful install, **68 passed / 0 failed**, successful npm start, and five HTTP 200 checks. [Raw final GitHub evidence](evidence/release-github-clean.txt).
Supporting documentation and browser evidence are synced in a subsequent evidence commit; application/test code must remain identical to this tested implementation.

## Final acceptance

| Requirement | Status | Evidence / dependency |
|---|---|---|
| Correct remote layout and static/test imports | PASS | Corrected commit and fresh GitHub download |
| npm install, npm test, npm start | PASS | Final clean source: zero vulnerabilities, 68 tests, assets 200; fresh HOME/environment |
| Original plumbing, weekday variation, uncertainty/safety, vague/blank input, reset | PASS | Automated and browser evidence |
| Simulation and rules representation | PASS | Browser observed prepared/rules/manual labels |
| Desktop/mobile UI, original message and review | PASS | Final browser pass: desktop review/reset, mobile layout/errors/caution, genuine screenshots; limitations in report |
| Editing generated fields | NOT APPLICABLE | Not supported or claimed; edit original and rerun instead |
| Actual file-chooser photo selection | NOT TESTED | Harness MIME issue; synthetic preview only checked |
| Existing simulated revision public | PASS | Current HTTP 200, revision and simulation markers |
| Final safeguards published and checked | BLOCKED | User must Republish; final build marker/changed modules are currently absent |
| Feedback response, report, evidence, draft disclosure, demo script | PASS | Files exist and local relative links checked |
| Final GitHub implementation delivery and fresh download | PASS | Verified final implementation commit; freshly downloaded archive passed 68 tests and startup |
| Real demonstration video | BLOCKED | Recording unavailable in browser harness; script/checklist supplied |
| Google Drive sharing and Canvas submission | BLOCKED | No video or course-recipient addresses / authenticated submission session |
| New external-user efficacy study | NOT TESTED | Not conducted; no claim made |

Known non-blocking defect: `/favicon.ico` returns 404; no application exception was observed in the final browser pass. Rules remain deliberately narrow and may omit unfamiliar work/wording; passing regressions are not a universal natural-language correctness guarantee.

## External submission — BLOCKED
- Review and confirm personal details in the draft AI disclosure.
- Record the real demo using [the script](demo-script.md). No recording claimed.
- Upload MP4 to Google Drive and give Emelia and Samuel Viewer access using course-verified addresses; those addresses were not supplied.
- Add the verified video URL to README and demo script.
- Submit video file and repository URL in Canvas, then check submission receipt.

No Drive sharing, Canvas upload or assignment submission was performed by the agent.
