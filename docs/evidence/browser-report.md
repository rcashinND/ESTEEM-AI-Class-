# Trawd enquiry-review browser report

Tested URL (development preview): `https://2ff51f8e-b729-49e2-bad8-6844ff43cc73-00-1dytn2d5rdp6t.picard.replit.dev/`
Initial load: HTTP 200, title `Trawd | Enquiry review`.
Browser: Stagehand/Browserbase-managed Chromium, one context. Desktop viewport 2560×1440 unless stated; mobile check 390×844.
Product code was not edited. Files written: `docs/screenshots/*.png` (5 files) and this report.

## Journey 1 – Clear job → Analyse → Mark reviewed → Tuesday→Wednesday → South Bend→Dublin

| Step | Action | Observed result | Verdict |
|---|---|---|---|
| 1 | Click "Clear job" | Textarea = "I need a plumber to replace a leaking kitchen tap in South Bend next Tuesday. I have bought the replacement tap." Counter 112 / 4,000. Result hidden; empty state shown. | Pass |
| 2 | Analyse Enquiry | Label "Prepared response · simulated AI". Trade Plumber; Job type Kitchen tap replacement; Location South Bend; Timing "Next Tuesday (customer's wording)"; Urgency "Not provided". 2 important details, 3 follow-up questions. Reviewed status hidden. | Pass |
| 3 | Mark as reviewed | Confirmation "Reviewed in this tab. You remain responsible for deciding the next step." shown; button disabled. | Pass |
| 4 | Fill textarea with "...next Wednesday..." | Result hidden, empty state shown, reviewed confirmation hidden, button re-enabled (stale result cleared before re-analysis). | Pass |
| 5 | Analyse Enquiry | Label "Limited rule-based analysis · review required". Summary begins "Tap / faucet replacement. Location" (full summary text was not captured in full). Re-check of result values: "South Bend" present (`southBendInValues: true`), "Wednesday" present (`wednesdayInValues: true`), "Tuesday" absent (`tuesdayInValues: false`). Trade/job/urgency fields were not re-read individually after this step. Reviewed status hidden. | Pass (location, weekday and label verified; full field text not re-read) |
| 6 | Fill textarea with "...in Dublin next Wednesday..." | Result hidden, empty state shown (stale result cleared). | Pass |
| 7 | Analyse Enquiry | Label "Limited rule-based analysis · review required". Summary "...Location phrase: Dublin. Timing: next Wednesday". Result contains "Dublin" and does not contain "South Bend" (`southBendInResult: false`). | Pass |

Note: an earlier check reported `tuesdayPresent: true` for the Wednesday result. That was a false positive from my check serialising object key names (`bodyHasTuesday`). Re-checked against the values only: `tuesdayInValues: false`, `wednesdayInValues: true`, `southBendInValues: true`.

## Journey 2 – Multiple trades

| Action | Observed result | Verdict |
|---|---|---|
| Click "Multiple trades" then Analyse Enquiry | Label "Prepared response · simulated AI". Uncertainty callout: "The enquiry does not establish a leaking pipe, roof fault or cause of the socket issue. Possible trades are suggestions for review, not a diagnosis." Trade field: "Uncertain - electrician; plumber or roofer may also be needed. Wall repair may follow assessment." Electrical warning visible: "Possible electrical concern: do not touch or use the affected socket, or approach it to take a photo…". Missing facts: 4 questions (where is property; when symptoms started; damp related to rain or plumbing; assessment carried out). Photo section: "Local preview only. Images are not analysed and do not change the summary." Reviewed status hidden. | Pass |

## Journey 3 – Vague enquiry

| Action | Observed result | Verdict |
|---|---|---|
| Click "Vague enquiry" then Analyse Enquiry | Textarea "Something is wrong in the bathroom. Can someone have a look?" (60 chars). Uncertainty: "There is not enough information to select a trade or infer a bathroom renovation." Likely trade: "Not provided". Job type, location, timing, urgency, scope: all "Not provided". Missing: 4 questions. The word "renovation" occurs only inside that negated sentence. | Pass |

## Journey 4 – Clear, then empty and whitespace input

| Action | Observed result | Verdict |
|---|---|---|
| Click Clear (with Vague result displayed) | Textarea empty, counter 0 / 4,000. Result hidden; empty state shown; no error. | Pass |
| Analyse Enquiry (empty) | Alert: "Please paste a customer enquiry before analysing." Result hidden; no stale summary. | Pass |
| Fill "   \n\t   " (8 chars, trimmed 0) then Analyse Enquiry | Same alert shown; result hidden. | Pass |

## Journey 5 – Unsupported new-website request

| Action | Observed result | Verdict |
|---|---|---|
| Fill "Can you build me a new website for my plumbing business with online booking and a blog?" then Analyse Enquiry | Label "Unsupported message · manual review needed". Uncertainty: "Manual review needed. Rules do not understand arbitrary wording or negation. Not provided means not extracted…". All six structured fields "Not provided". Follow-ups: what work is required; which trade should assess it; confirm location/timing/scope/access with customer. Photo and safety sections hidden. | Pass |

## Photo check (Multiple trades result)

| Action | Observed result | Verdict |
|---|---|---|
| Attach `docs/screenshots/empty-input.png` via the file input (harness setInputFiles) | Rejected: "Choose up to 3 JPEG, PNG or WebP files, each no larger than 5 MB." 0 previews. The recorded browser-side file type was `application/octet-stream` (the harness did not supply `image/png`), and the app validates by type. | Not verified via a real file chooser (tool limitation) |
| Synthetic 1×1 PNG injected in-page (`File` type `image/png`) via DataTransfer and a change event | 1 preview, caption `local-overview.png`, no error. Summary unchanged ("The customer reports growing damp…"), trade unchanged. | Pass for preview behaviour; this was a synthetic injection, not a user's file chooser |

## Mobile (390×844)

| Result checked | scrollWidth | clientWidth | innerWidth | Horizontal overflow | Verdict |
|---|---|---|---|---|---|
| Unsupported website result | 375 | 375 | 390 | false | Pass |
| Multiple trades result (after Analyse; safety and photo sections visible) | 375 | 375 | 390 | false | Pass |

Recorded elements past the viewport: none.

## Public deployment (read-only)

- `https://trade-lead-ai.replit.app/` loaded. Title `TrawdAI`. Page shows "TrawdAI PUBLIC PROTOTYPE", a "Customer request" form ("What is the problem?", 0 / 10,000) and a notice about drafts, photos and AI analysis.
- Text `Revision: 19 November 2026` was NOT present on this page (`hasRevision: false`). The "Multiple trades" text was also not present (`hasMultipleTrades: false`). The public page's visible text was not otherwise compared with the development preview.
- Not asserted as updated or stale beyond this observation. This check does not establish which code the public deployment runs.

## Screenshots saved (docs/screenshots/)

| File | Size | State captured |
|---|---|---|
| clear-job.png | 2560×1440, 255,043 bytes | Clear job Analyse result (Plumber, South Bend, Next Tuesday, urgency Not provided), reviewed status hidden |
| weekday-variation.png | 2560×1440, 261,735 bytes | Wednesday result, Limited rule-based label |
| multiple-trades.png | 2560×1440, 281,634 bytes | Multiple trades result with uncertainty, electrical warning, missing facts |
| empty-input.png | 2560×1440, 189,371 bytes | Whitespace-only input with "Please paste a customer enquiry before analysing." |
| mobile.png | 390×844, 65,476 bytes | 390px width with Multiple trades result; no horizontal overflow |

These are real page captures made with `page.screenshot` into the workspace.

## Console and page logs

- The only page log captured across all observations was `[log] Browserbase keeping connection alive`. No console errors or warnings were captured. Logging was not set up as a dedicated console listener for the whole session, so this is an observation limit, not a guarantee of zero errors.

## Screen recording

- Unavailable. The browser session exposes no recording, video, screencast or trace method (checked by listing the context and page members). No recording was created or synthesised.

## Tool issues observed (not application defects)

- After `setViewportSize(390, 844)`, snapshot-ref clicks failed repeatedly with `-32000 No node found at given location` and an XPath text lookup failed for the Analyse button. The CSS selector `form button[type="submit"]` succeeded. Ref-based clicks were restored after the viewport was reset to 2560×1440 (the Clear job replay used an XPath text match and succeeded).
- The first `weekday-variation` save attempt failed only because of a stray line in my cell (`require` is not defined); the retry succeeded.

## Limitations and gaps

- Photo upload through a real file chooser was not verified (type `application/octet-stream` from the harness). The preview behaviour was verified only through a synthetic in-page PNG.
- Prepared examples (Clear job, Vague enquiry, Multiple trades) show "Prepared response · simulated AI"; the Wednesday, Dublin and website inputs show the rule-based or manual-review labels. This matches the README's described behaviour.
- The request asked that the summary be read-only. No edit control was present in the review panel; only "Mark as reviewed" was observed. No edit feature was tested or invented.
- Only the tested inputs were checked. This is bounded verification, not an exhaustive test of the rules or of any external user's experience.
