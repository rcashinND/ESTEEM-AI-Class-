# Trawd enquiry-to-review browser verification (release pass)

- Tested URL: `https://2ff51f8e-b729-49e2-bad8-6844ff43cc73-00-1dytn2d5rdp6t.picard.replit.dev/`
- Date of run: 19 Nov 2026 session (single browser pass, fresh context, no login)
- App code was not changed and nothing was published. Only files written: this report and `docs/screenshots/release-*.png`.
- Prior evidence (`docs/evidence/browser-report.md`, `docs/screenshots/clear-job.png` etc.) was NOT used as verification; everything below was observed in this run.

## Tools used

1. Stagehand-managed Chromium (one context) for the journey: refs and `page.evaluate` reads. Viewport 2560×1440 at start, then 390×844 and 1280×800.
2. A local headless Chromium 155 driven over CDP (`/tmp/trawd-cdp/shot.mjs`) for the screenshot files and console/exception capture. It uses `element.click()` and synthetic `input` events, not real pointer input. Results matched the Stagehand run.

## Journey results

| # | Test executed | Observed | Verdict |
|---|---|---|---|
| 1 | Load app; click "Clear job" | Textarea = `I need a plumber to replace a leaking kitchen tap in South Bend next Tuesday. I have bought the replacement tap.` (112/4,000). Result hidden, empty state shown. | Pass |
| 2 | Analyse Enquiry (prepared fixture) | Label "Prepared response · simulated AI". Trade Plumber; Kitchen tap replacement; South Bend; "Next Tuesday (customer's wording)"; urgency Not provided. Original preserved. 3 follow-ups incl. time/compatibility and leak severity. | Pass |
| 3 | Mark as reviewed | "Reviewed in this tab. You remain responsible for deciding the next step." shown; button disabled. | Pass |
| 4 | Change Tuesday → Wednesday | Result hidden, reviewed status hidden, empty state back, button re-enabled. | Pass |
| 5 | Analyse edited Wednesday text | Label "Limited rule-based analysis · review required". Timing "next Wednesday". `Tuesday` absent from result text. Follow-ups: customer availability, replacement-tap compatibility, leak severity. | Pass |
| 6 | Change "I have bought" → "I haven't bought"; analyse | Stale result hidden on input. Materials / availability = "Not confirmed — purchase or availability wording is negative, qualified or outside supported patterns. Check the original." No "already purchased" claim. | Pass |
| 7 | Paste exact `Please repair the fence and assess a faulty socket in Dublin tomorrow.`; analyse | Likely trade "Uncertain — electrician; carpenter or general maintenance may be needed". Location Dublin; timing tomorrow. Limited-rule label and uncertainty note. Electrical caution: "do not touch or use affected fittings, or approach them to take a photo. Seek qualified assessment…". Photo section shown. | Pass |
| 8 | Paste `I have bought the replacement tap. It is not available.`; analyse | Label "Unsupported message · manual review needed". Materials / availability = "Not confirmed…". `claimsPurchased: false`. Job not classified (manual-review path). | Pass |
| 9 | Prepared "Multiple trades"; analyse | Label "Prepared response · simulated AI". Uncertain electrician / plumber-or-roofer; scope not established; electrical do-not-touch caution; 4 follow-ups. | Pass |
| 10 | Prepared "Vague enquiry"; analyse | Label "Prepared response · simulated AI". Trade "Not provided"; uncertainty "There is not enough information to select a trade…". 4 follow-ups; no safety caution. | Pass |
| 11 | Clear; Analyse with empty textarea | Textarea empty, counter 0/4,000, result hidden. Error "Please paste a customer enquiry before analysing." (red, next to textarea). | Pass |
| 12 | Whitespace-only `"   \n   "`; Analyse | Same error; result hidden. | Pass |
| 13 | Recover: Clear job → Analyse → Mark as reviewed | Prepared result restored, error cleared; reviewed status shown; original preserved. | Pass |
| 14 | Geolocation | Source search: no `geolocation`, `navigator.` or `fetch(`/XHR/beacon calls in `public/app.js`, `public/analysis.mjs`, `public/rules.mjs`, `public/index.html`. No permission prompt was seen during the run, but this was not instrumented at runtime. | Pass (static search; runtime not separately instrumented) |
| 15 | Photo copy | Section text: "Local preview only. Images are not analysed and do not change the summary." Up to 3 JPEG/PNG/WebP, 5 MB each. | Pass (copy verified; file chooser not exercised, as requested) |

Simulation label was checked in all three modes: prepared fixtures, rules, and manual review.

## Layout and responsiveness

- Desktop 1280×800: form ("Customer enquiry") and review ("Tradesperson review") side by side (left x=71, right x=613, same row). `scrollWidth` 1265 = `clientWidth` 1265, no horizontal overflow. Screenshot: `docs/screenshots/release-desktop-side-by-side.png`.
- Desktop 2560×1440 (initial load): form and review cards side by side in the screenshot; overflow was not measured at this size.
- Mobile 390×844: `scrollWidth` 375 = `clientWidth` 375 (Stagehand, no mobile emulation) and 390 = 390 (CDP mobile emulation). No element extended past the viewport in the fence-result check.
- Mobile empty-submit error: 13px red text, box x 37–338 in the 375px content width, readable. Screenshot: `docs/screenshots/release-mobile-empty-error.png`.
- Mobile fence result: electrical caution and uncertainty notes legible and wrapped. Screenshot: `docs/screenshots/release-mobile-fence-result.png`.

## Console, page errors and host warnings

- Stagehand logs: only `Browserbase keeping connection alive` (host-injected; not an app message).
- Init-script capture (window `error`, `unhandledrejection`, `console.error`) across load and analysis on desktop: `[]`, no app exceptions.
- CDP run (`Runtime.exceptionThrown`, `console.error/warning`, `Log.entryAdded` error/warning) over desktop fence analysis and mobile empty-error plus fence analysis: one event only, `Failed to load resource: 404` for `/favicon.ico`. The app has no `<link rel="icon">`, so the browser requests `/favicon.ico` and gets 404. Cosmetic, not an app exception. It is an app-side gap, but a minor one.
- Response header: a `Content-Security-Policy` is present (`default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'none'; …`). No CSP violation was logged.

## Tool and environment notes (not app defects)

- Stagehand snapshot-ref clicks failed after viewport changes with `No node found at given location` or `Stale snapshot reference`, even though the element was visible. Coordinate clicks on the hit-tested element worked. The CDP run did not depend on refs.
- On mobile, the Clear ref click failed twice and the Analyse ref click once (`No node found`); on desktop 1280 the Analyse ref click failed twice (`Stale snapshot reference`). Coordinate clicks, each hit-tested first, then produced the expected changes. A failed click was confirmed as not applied (textarea/result state) before the next attempt.

## Not verified in this run

- Actual photo file chooser and image upload (excluded by request).
- Mark as reviewed on mobile (done only on desktop).
- Replacement-tap "not available" contrast on mobile, and the Wednesday/fence journeys on the 2560 viewport (done on 1280 and 390).
- Keyboard-only navigation and screen-reader behaviour.
- Real pointer/touch input: the CDP run used synthetic clicks.
- Any server-side or persistence behaviour (none is expected; the app is client-only).
- Video recording: none made, none claimed.

## Findings

- No application bug reproduced in this pass.
- Minor: missing favicon (404 on `/favicon.ico`). Cosmetic.
- Interpretation caveat, as the app itself states: rules-mode results are tentative and the fence/socket result does not diagnose.

## Files

- `docs/evidence/release-browser.md` (this report)
- `docs/screenshots/release-desktop-side-by-side.png`
- `docs/screenshots/release-mobile-empty-error.png`
- `docs/screenshots/release-mobile-fence-result.png`
