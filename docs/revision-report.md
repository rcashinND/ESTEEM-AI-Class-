# Prototype revision report

## MVP and intended customer
Trawd supports the self-employed tradesperson who must interpret enquiries as well as perform work. Its central journey remains paste → structured interpretation → compare original → review → decide independently.

## Feedback and priority
The supplied two peer reviews and instructor feedback praised retained facts, follow-up questions and uncertainty. Broken reproducibility, an old public release and brittle exact matching prevented evaluation of those strengths. Reliability and truthful representation were prioritised over expansion.

## Findings
The earlier connected GitHub repository had assets and its test at root while its server expected public/ and its command expected tests/. The corrected layout is now in GitHub. Earlier public checks also captured an older React TrawdAI page; the current public check instead returns the revised simulated prototype. The final safeguards build is a subsequent source revision and is not yet published.

## Technical revision
The implementation retains Node's built-in server, browser JavaScript and reviewed examples. Rules recognise supported work terms plus explicit place, timing and urgency phrases. Variations do not inherit old fixture facts. Unsupported, negated or conditional work clauses are skipped rather than classified from their keywords; a result without supported work requests manual review. Conflicting scheduling/location phrases remain unclear. Startup validates PORT and reports listen errors. HTTP tests check content types, assets, HEAD and rejected private paths/uploads, including inherited object-property names that previously could generate a spurious 500. A clean verifier uses a temporary source copy, fresh HOME and allowlisted environment to install, test, start and fetch all assets without app secrets.

## Final correctness revision after the independent audit
The audit reproduced two failures despite the earlier 13 passing tests. The purchase regex matched “bought” inside “haven't bought”; trade assignments overwrote earlier categories.

- Materials now have an explicit review field. Only narrowly supported first-person affirmative purchase sentences can produce a customer-stated purchase. Detected negation, contractions, qualifications, questions, attribution or conflicting statements make materials **Not confirmed**, with a direct clarification question. Buying is not equated with current availability. Negative statements are not converted to positive ones in the covered regressions; unfamiliar language still requires original-text review.
- Trade candidates are accumulated from supported work clauses. Fence plus faulty socket retains carpenter/general maintenance **and** electrician; plumbing can coexist when separately supported. Electrical caution is independent of materials confirmation and remains visible. No connection between damp and electrical symptoms is diagnosed.
- Clause-local work detection avoids suggesting a plumber solely because someone mentions buying a tap. The Wednesday variation retains useful plumbing follow-ups. The original prepared examples and edit/reanalyse/review/reset journey remain.
- Added 55 regression tests beyond the original 13 without loosening their assertions. Initial expanded tests exposed 46 failures before fixes; the completed 68-test suite passes.

## User experience and disclosure
The established responsive layout remains. The user sees prepared, rule-based or manual-review status. Editing the original invalidates results and review confirmation; Clear removes stale data. Fields remain read-only: correction means editing the enquiry and running again. Photo previews remain local and explicitly unanalysed. A dated revision marker makes the correct public build recognisable.

## Before / after

| Before | Revised |
|---|---|
| Remote root assets; server looked under public/ | Correct directories and HTTP regression |
| Remote root test; command looked under tests/ | Tests collected from tests/*.test.mjs |
| Wednesday discarded useful structured fields | Wednesday and other matched facts preserved under rules label |
| Changed location could not be extracted | Capitalised in/at place phrases retained without old location |
| README presented intended update without release distinction | Actual test and release states documented separately |
| Three exact scenarios only | Three reviewed scenarios plus explicitly bounded rules and manual fallback |
| Negated purchase could become “already purchased” | Conservative, customer-attributed materials states and explicit uncertainty |
| Maintenance assignment erased electrician suggestion | Supported trades accumulate; electrical warning retained |

## Methodology and results
See [testing evidence](testing-evidence.md) for actual commands, browser outcomes and genuine images. The final `npm test` and clean-source install/test/start checks each passed 68/68 tests. These are software checks, not measured accuracy or external validation. The [current HTTP/asset check](evidence/release-public-assets.txt) confirms the public simulated revision works, but its changed assets do not yet match the final safeguards source. Latest-build republishing and production verification remain separate acceptance criteria. Repository delivery and recording status are in the [submission checklist](submission-checklist.md).

## Limitations and lessons
Rules cannot interpret arbitrary natural language, diagnose hidden causes or resolve relative weekdays to dates. Place detection is intentionally narrow; matching a word does not prove a trade is appropriate. Manual review remains essential. No evidence establishes time saved with real tradespeople.

The main lesson is that source correctness, reproducible installation and public availability are distinct acceptance criteria. A working local UI and an accurate README do not establish that reviewers can access that version. Future evaluation should first verify the release, then compare assessment time and missed questions on unfamiliar enquiries with consenting tradespeople.
