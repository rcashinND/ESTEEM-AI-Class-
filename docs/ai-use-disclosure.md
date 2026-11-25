# Draft AI-use disclosure

## Tools and responsibilities

ChatGPT (Codex) assisted with this revision audit, regression design, browser testing, documentation and the demo materials. Replit Agent assisted with the implementation, debugging, customer and review interfaces, tests and release preparation. The records identify the tools. The underlying model versions were not established.

Ross specified the intended workflow, requested that customers supply clarifications and optional photos, and chose a concise tradesperson view. He also reported broken dropdowns and required truthful handling of uncertainty and photos. The earlier implementation displayed the original enquiry alongside the brief. Ross explicitly changed that design to separate the customer’s job of supplying information from the tradesperson’s job of reviewing it. The review therefore gives up side-by-side checking in exchange for a concise handoff, while the customer page remains the place to correct the input.

Before submitting, Ross should confirm any additional tools or code he personally used, whether he independently repeated any tests, and that this draft accurately represents his own decision-making. Automated and browser QA in the evidence was assistant-run. The demo is a real browser capture of the verified source, with assistant-drafted script and synthetic speech. The narration is identified as synthetic in the video.

## Representative prompt excerpts

| Actual prompt excerpt and source | Output, verification and iteration | Remaining limitation |
|---|---|---|
| “the drop downs dont work please fix.” — Ross, November 19 ChatGPT history. | Replit history records a dropdown repair. Fresh browser checks and automated results are in [evaluation evidence](testing-evidence.md). The relevant acceptance condition is delivery of the selected answer to the brief, as well as interaction with the control itself. | Desktop browser verification does not establish physical touch or assistive-technology coverage. |
| “If the description is vague, the application requests a photo and asks a small number of high-level clarifying questions.” — Ross, November 24 audit request. | This supplied the acceptance criteria for the two-stage Replit prototype. The QA replay starts from a sparse message, checks the prompts, supplies fictional answers and inspects the resulting review. The photo path remains optional and only previews images for human inspection. | The handoff is same-tab and cannot deliver a job to another device or account. |
| “an explicit visit timing answer such as custom Wednesday afternoon must survive editing the description to add that the issue started today, and the tradesperson brief must name the actual fence and faulty socket while preserving tentative trades and electrical caution.” — Codex prompt sent to Replit Agent during this revision. | The prompt targets two previously reported failures. The [evaluation evidence](testing-evidence.md) records independent checks of the resulting behavior and their scope. | Finite rules still cannot interpret general temporal language or every complex request. |

## AI inside Trawd

The intended AI task is to turn an enquiry and structured customer answers into a short, reviewable job brief with next questions. Current execution combines prepared examples and deterministic browser-side rules, with manual review where coverage is weak. There is no live generative model. An optional photo can be shown for human inspection without automated interpretation.

The intended benefit is faster triage with fewer follow-up messages. The evidence checks output usefulness and factual preservation on fictional cases. It does not measure job-processing time or live model accuracy. The tradesperson remains responsible for checking uncertain facts and deciding the next step.
