# Trawd

Trawd helps a self-employed tradesperson turn a messy customer enquiry into a structured job summary, with the missing information clearly highlighted.

**Ross Cashin | Project Prototype First Working Slice**

## What this slice does

A tradesperson pastes a customer enquiry, clicks **Analyse Enquiry**, and reviews the result beside the original message. The summary covers the likely trade or trades, job type, location, timing, urgency, scope, important details and follow-up questions. They can then mark it as reviewed or change the message and start again.

I am from a family of carpenters, so the problem I am interested in is fairly practical: the person doing the work is often the same person trying to make sense of incoming enquiries. Before they can even consider taking a job, they need to understand what the customer is asking for.

The first question is whether this format makes an enquiry easier to assess. A tradesperson still decides what happens next. There is no automatic acceptance, rejection or quotation.

## Opening the prototype

This version requires Node.js 20 or newer and has no external packages, database or API credentials.

**In Replit:** put the contents of this folder at the project root, then press Run. The included `.replit` configuration runs `npm start`. Open the web preview. If importing into the existing project, replace its old run configuration with the included one. The previous pnpm workspace is not required for this version.

**Locally:** open a terminal in this folder, run `npm start`, then open `http://localhost:3000` in a browser. A hosting platform can supply its own `PORT`.

Start with **Clear job**, **Vague enquiry** or **Multiple trades**, then click **Analyse Enquiry**. These buttons fill the input; they do not submit it for you. You can also paste your own message to see the unsupported-input behaviour.

## AI role and what is actually working

**The AI behaviour in this submission is simulated. No live model is connected.** The three example enquiries have prepared responses. Matching ignores letter case, whitespace and curly apostrophes; it does not interpret new wording. Changing a substantive detail produces a manual-review result rather than recycling an answer that might now be wrong.

The input, validation, result display, original-message comparison, optional photo preview, clear action and review confirmation work. There is no person secretly writing responses in the background. For messages outside the prepared examples, the app states that it cannot extract their details. In that fallback, “Not provided” means not extracted by this prototype, even if the original message contains the information.

The future AI would extract facts, suggest possible trades, summarise the job and identify missing information across different ways of describing the same problem. Image analysis could help describe visible damage, but it should not diagnose wiring or pipework behind a wall. Ordinary software should continue to handle validation, display and the review step.

The distinction matters: a successful prepared response shows the intended experience. It does not show that an AI model can reliably interpret a new customer enquiry.

## Connection to my problem framing

This follows the workflow in my prior submission: **customer enquiry → analysis → structured job lead → tradesperson review**. I have kept the tradesperson as the primary user. The earlier customer-facing wording describes where the enquiry comes from; it does not require a second user journey in this slice.

The original Replit build had expanded into public requests, photo uploads and a jobs map. This submission deliberately narrows that build. The visible name is now Trawd, and the first slice runs as a small browser application rather than the previous frontend/backend workspace.

Unclear prepared examples request an optional photo, which can be previewed locally. Image analysis is deferred and labelled as such. Location is shown when the prepared enquiry supplies it; a public address-submission or matching flow is outside this milestone. No enquiry or image is sent to a server, published or saved by the app. Refreshing or clearing removes the work from the interface.

## Three quick test cases

These tests were run using the actual page markup and event handlers in a DOM-based test environment. All three passed at that level. A full browser check, including visual layout and the hosted Replit flow, remains outstanding because a browser could not be installed in the development environment.

| Test | Input or action | What happened | Pass, partial, or fail |
|---|---|---|---|
| Typical case | “I need a plumber to replace a leaking kitchen tap in South Bend next Tuesday. I have bought the replacement tap.” | The prepared result displayed plumber, kitchen tap replacement, South Bend and the requested timing. Urgency remained “Not provided”. The original message stayed in the input, and marking it reviewed displayed a confirmation. | Pass - DOM flow; browser check pending |
| Challenge case | “There’s been a damp patch getting bigger near the back of the house and one of the sockets in that room has started cutting out sometimes. Part of the wall feels soft.” | The result showed several possible trades, explicitly left the cause unconfirmed, and retained missing location and timing. It displayed the electrical caution and optional photo-preview section. | Pass - DOM flow; browser check pending |
| Invalid or empty case | Click Clear, then Analyse Enquiry without entering a message. | The app displayed “Please paste a customer enquiry before analysing.” No previous summary remained visible, and the input stayed available for a retry. | Pass - DOM flow; browser check pending |

The five automated logic checks also passed. Additional DOM checks covered the vague example and a changed location, which correctly produced an unsupported-input result. HTTP checks verified the public files and rejected private paths and uploads.

These checks concern the prototype flow, not model accuracy or evidence of time saved by real tradespeople. The prepared enquiries can be repeated using the buttons in the interface.

## Known limitations

1. **The summaries are prepared examples.** The app cannot interpret arbitrary enquiries yet. Next I would connect a model and evaluate it on unfamiliar messages, checking invented details and incorrect certainty as well as whether the output is useful.
2. **Photos are previewed, not analysed.** The app cannot determine the cause of damp or an electrical fault from a picture. A later version should keep visible observations separate from possible causes and retain the tradesperson’s review.
3. **The benefit has not been tested with tradespeople.** The prototype has no saved history, and completing its flow does not establish that it saves time. Next I would compare assessment time and missed follow-up questions with and without the summary, using the same enquiries.

## AI-use record

I used Replit and ChatGPT to help develop the prototype. ChatGPT helped compare the code with the assignment and my earlier submission, narrow the flow, prepare the example responses, revise the interface, write checks and draft this README. The code assistance and prepared responses are separate from a working AI system inside the product.

One important revision was removing public job publication from this slice. It added storage and a second user journey before the basic enquiry-review experience had been tested. Another was ensuring that an edited example cannot keep an old summary on screen or inherit a prepared answer for a different job.

## Code and checks

- `public/index.html`, `public/style.css`, `public/app.js`: interface and review flow.
- `public/analysis.mjs`: clearly labelled prepared examples and unsupported-input handling.
- `server.mjs`: serves only the four public files; it accepts no enquiry or photo uploads.
- `tests/analysis.test.mjs`: five automated checks, run with `npm test`.

No API keys, passwords, access tokens or customer records are needed in this project. The supplied `.gitignore` excludes local environment files. This delivery contains no Git history from the earlier export.

## Submission status

The code and README are prepared for the existing public course repository. The public GitHub URL and working Replit URL were not supplied or found in the provided project, so neither has been published or verified as part of this work. Before submitting, update the existing repository and Replit project, then check both links in a signed-out browser.

**Canvas note:** “The three tests are under ‘Three quick test cases’ in README.md, and the current limitations are under ‘Known limitations’. The product’s AI behaviour is simulated and is explained under ‘AI role and what is actually working’.”
