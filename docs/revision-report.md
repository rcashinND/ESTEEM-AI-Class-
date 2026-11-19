# Prototype revision report

## MVP and intended customer
Trawd supports the self-employed tradesperson who must interpret enquiries as well as perform work. Its central journey remains paste → structured interpretation → compare original → review → decide independently.

## Feedback and priority
The supplied two peer reviews and instructor feedback praised retained facts, follow-up questions and uncertainty. Broken reproducibility, an old public release and brittle exact matching prevented evaluation of those strengths. Reliability and truthful representation were prioritised over expansion.

## Findings
The current local layout was already correct. The connected GitHub repository, however, had assets and its test at root while its server expected public/ and its command expected tests/. These are separate from the public URL, which returned an older React TrawdAI page. Local fixes cannot update that release automatically.

## Technical revision
The implementation retains Node's built-in server, browser JavaScript and reviewed examples. A small rules module now recognises supported work terms plus explicit place, timing and urgency phrases. It never fills a variation from an old fixture. Unsupported input and negation receive manual-review labels; multiple scheduling phrases are retained as unclear. Startup validates PORT and reports listen errors. HTTP tests check content types, successful asset loading, HEAD and rejected private paths/uploads. A clean verifier installs, tests, starts and fetches all assets in a temporary folder.

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

## Methodology and results
See [testing evidence](testing-evidence.md) for actual commands, browser outcomes and genuine images. Automated logic/HTTP tests and fresh-copy startup pass. These are software checks, not measured accuracy or external validation. Public deployment is independently checked and still requires republishing. Repository delivery and recording status are stated in the [submission checklist](submission-checklist.md).

## Limitations and lessons
Rules cannot interpret arbitrary natural language, diagnose hidden causes or resolve relative weekdays to dates. Place detection is intentionally narrow; matching a word does not prove a trade is appropriate. Manual review remains essential. No evidence establishes time saved with real tradespeople.

The main lesson is that source correctness, reproducible installation and public availability are distinct acceptance criteria. A working local UI and an accurate README do not establish that reviewers can access that version. Future evaluation should first verify the release, then compare assessment time and missed questions on unfamiliar enquiries with consenting tradespeople.
