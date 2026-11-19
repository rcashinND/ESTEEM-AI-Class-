# Response to reviewer feedback

19 November 2026. These are responses to the feedback supplied in the revision brief, not newly collected reviews.

| Reviewer / original concern | Identified problem | Implemented response and reason | Evidence / limitation |
|---|---|---|---|
| Peer 1: `npm start` returned “Unable to open Trawd” | GitHub contained index.html, app.js, analysis.mjs and style.css at root; server reads public/ relative to its own module | Ship one authoritative public/ directory; test every allowlisted asset | HTTP test in [test log](evidence/npm-test.txt); [clean startup](evidence/fresh-install.txt). Earlier local workspace already had the correct layout; this mismatch was confirmed separately in remote tree. |
| Peer 1: tests failed | Root analysis.test.mjs contradicted tests/ command and its ../public import | Keep tests under tests/, use Node's test runner on *.test.mjs; add real HTTP checks | 13 tests pass; no dependency installation needed beyond npm metadata |
| Peer 1: Wednesday fell back and modest wording changes were unusable | Exact normalised fixture matching was the only analysis | Preserve fixtures; add bounded extraction and distinct rules/manual labels | Wednesday, Dublin, faucet, urgency, conflicts and negation regression tests. Not general language understanding. |
| Peer 2: installation and browser blocked | Same file/path mismatch, plus no reproducible release check | Lockfile, self-contained source, repeatable clean verifier, clear root instructions | [Clean-copy evidence](evidence/fresh-install.txt); repository-download evidence is reported separately |
| Peer 2: README described unavailable public build | Source status conflated with published release | README explicitly distinguishes tested workspace, repository and public URL | [Public check](evidence/public-status.txt): old TrawdAI title, no revision or simulation marker. Republishing is blocked on user's Publish action. |
| Emelia Hughes: public demo old; misleading AI-generated language | Existing deployment still serves the older React application | Visible simulation/rules/manual labels plus dated revision marker; Node production run configuration retained | No live model added. Public response was checked independently and remains stale; no claim that publishing succeeded. |
| Emelia: reviewers should not need source download | Preview is not a public release | Prepare working release and exact publishing/recheck steps | [Submission checklist](submission-checklist.md). This concern remains open until public URL is verified after republishing. |
| All: preserve practical plumbing summary and original | Rewriting the entire app would risk useful behaviour | Keep original text alongside read-only results; retain fixture facts, follow-ups and review confirmation | Automated regression plus [browser evidence](testing-evidence.md) |
| All: preserve unknowns, multi-trade uncertainty and socket warning | Rules might turn guesses into diagnoses | Prepared caution retained, tentative classification and electrical symptom caution in supported rules, conservative manual fallback | No safety diagnosis, quotation, acceptance/rejection or new marketplace functionality |

No new external user study was performed. Successful software checks demonstrate operation, not business benefit.
