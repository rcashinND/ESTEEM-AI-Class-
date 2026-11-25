# Trawd AI prototype revision

## User and central task

Independent tradespeople need enough information to decide which jobs to call back about while they are doing other work. The first prototype had the tradesperson paste a customer’s message and review a summary beside it. Three prepared answers demonstrated the intended AI role. Extra wording or a weekday change could send a useful enquiry to a generic fallback.

In the revised flow, the customer describes the problem, answers short questions about missing details and can attach a photo for human inspection. The tradesperson gets a separate read-only brief with the stated job, tentative trades, area, timing, known safety concerns and follow-ups. The demo hands off inside one browser tab. It does not send work to a tradesperson.

## Three priorities

1. **Make the prototype accessible and reproducible.** Fix the repository layout that caused startup and test failures, verify a clean startup and put the two-stage version on the public URL.
2. **Preserve useful details and ask for the rest.** Keep the prepared examples. Use limited rules for explicit symptoms, work and time/place phrases, then ask short questions for missing facts. Keep a confirmed visit preference when a description edit mentions when the issue began. Name supported affected items in the review.
3. **Reduce over-reliance on the brief.** Make simulation and uncertainty visible, keep the relevant caution on electrical cases, distinguish materials purchase from current availability and retain follow-up questions. Remove the raw paragraph from the tradesperson view in line with the intended workflow. This reduces the reader’s ability to compare the summary with its original source.

The [peer-feedback response](feedback-response.md) explains which recommendations were adopted, adapted or deferred. The [same weekday edit](evidence/current/before-after-weekday.json) produced an uninformative fallback in the historical code and the correct next Wednesday in revised rules. The [evaluation](testing-evidence.md) records how the current browser flow handles that edit and the new intake controls.

## Method and evidence

A fresh source export was checked independently with Node 24 and npm 11. `npm test` and a separate clean-copy installation, test and server startup each passed **162/162** tests. The clean server served all 12 checked routes and assets. Signed-out HTTP requests verified the deployed release against source and key flows were replayed in the live browser. A separate local Chromium browser run executed the larger interaction matrix with screenshots, including file selection and an emulated mobile viewport. See the [evaluation and logs](testing-evidence.md) for observed outcomes and one partial result.

## Concrete risk response

A tradesperson could buy the wrong part or send only one trade if they rely on a fluent but incomplete brief. A customer could also mistake an electrical warning for an assessment of their safety. In the tested cases, the prototype leaves a negated material purchase unconfirmed, explicitly asks a person to verify availability and compatibility, and retains an electrical caution and more than one tentative trade for overlapping work. The review makes the uncertainty visible before marking a brief reviewed. This addresses **over-reliance on automated outputs**. There is no emergency assessment or diagnosis. Unfamiliar wording can still cause specific facts to be missed, and the summary-only layout increases the cost of checking a lost detail.

## Limitations and next evaluation

The running product uses prepared examples and deterministic rules. It cannot understand arbitrary language, resolve dates to a calendar, determine fault causes or analyse images. Photos and the brief remain in same-tab session storage for up to an hour and can be cleared. The session is unauthenticated and no job is delivered. Evaluation used fictional inputs and technical QA. It did not measure time saved or interview additional tradespeople.

1. With consenting tradespeople, compare the unanswered questions and triage time for a small set of unfamiliar fictional enquiries and briefs.
2. Calibrate the mode label for sparse inputs, test conflicts between narrative and structured answers, and evaluate a compact way to verify the provenance of important facts.
3. Test native mobile controls on physical devices and add keyboard and screen-reader checks before any broader pilot.
