# Trawd

Trawd helps a self-employed tradesperson turn an unclear customer enquiry into a structured job summary, with the missing information clearly highlighted.

**Ross Cashin | Project Prototype First Working Slice**

## What the first working slice does

A tradesperson pastes a customer enquiry, clicks **Analyse Enquiry**, and reviews a structured summary beside the original message. The result shows the likely trade or trades, job type, location, timing, urgency, scope, important details and follow-up questions. The tradesperson can review the information, edit the enquiry or start again.

I am from a family of carpenters, so the problem I am interested in is fairly practical. The person completing the work is often also managing the enquiries. They need to understand what the customer is asking for before they can decide whether the job is relevant.

This slice follows the workflow in my problem-framing submission:

**Customer enquiry → analysis → structured job lead → tradesperson review.**

The original build included public job requests and a map. I narrowed this version to the enquiry-review task so I could test the core experience first. The system does not accept or reject jobs, generate quotations, match customers to tradespeople, or arrange payments.

## Links and how to open it

- **Public GitHub repository:** https://github.com/rcashinND/ESTEEM-AI-Class-
- **Replit project:** https://replit.com/@rcashin/Trawd-AI
- **Earlier published version:** https://trade-lead-ai.replit.app/

**The updated prototype was tested in Replit Preview.** I could not republish it because my Replit credits were exhausted. The public app link therefore still displays the earlier version and does not represent the updated prototype described in this README.

To run the updated code, download the current project files, open a terminal in the folder containing `package.json`, and run:

```bash
npm start
```

Then open **http://localhost:3000**. Node.js 20 or newer is required. No API key, database or external package installation is needed. In the updated Replit project, press **Run** and open **Preview**. Access to the editor may require project permission.

Try **Clear job**, **Vague enquiry** or **Multiple trades**, then click **Analyse Enquiry**. Each example button fills the message box so the user can see what is being submitted.

## AI role: working and simulated behaviour

**The product’s AI behaviour is simulated in this milestone. No live AI model is connected.** The three prepared examples return prewritten summaries. The app matches those examples after normalising letter case, whitespace and apostrophes; it does not understand new wording. Messages outside those examples receive a clearly labelled manual-review result.

The input, validation, result display, original-message comparison and review controls work. Optional photos can be previewed locally, but they are not analysed and do not change the summary. Enquiries and photos are not uploaded or permanently stored by this version. Clearing or refreshing the page removes the work from the interface.

The future AI system would extract facts, suggest possible trades, summarise the enquiry and identify unanswered questions across different customer descriptions. It should preserve uncertainty and say **“Not provided”** when information is missing. Image analysis could describe visible damage, but should not establish hidden causes from a photograph.

For unsupported messages in this simulation, “Not provided” means the prototype has not extracted the information; it may still be present in the original message. The tradesperson remains responsible for checking the summary and deciding the next step.

## Three quick test cases

I ran the following three tests in **Replit Preview on 13 October 2026**. All three passed. These results apply to the updated prototype in Preview, rather than the earlier version at the public app link.

| Test | Input or action | What happened | Result |
|---|---|---|---|
| Typical case | Selected **Clear job**: a plumber is needed to replace a leaking kitchen tap in South Bend next Tuesday, and the customer has bought the replacement. | The prepared summary showed the stated trade, job, location and timing. It presented the enquiry in a structured format for review. | Pass |
| Challenge case | Selected **Multiple trades**: growing damp, a socket intermittently cutting out and a soft section of wall. | The result showed several possible trades and flagged uncertainty instead of claiming a confirmed cause. Missing information remained visible. | Pass |
| Invalid or empty case | Cleared the message and clicked **Analyse Enquiry**. | The app displayed a validation error instead of generating a summary, allowing the user to enter an enquiry and try again. | Pass |

Five automated logic checks also passed during development, including checks for vague enquiries and edited examples. The interface behaviour was additionally checked using DOM-based tests.

These tests show that the intended prototype flow works for the selected cases. They do not establish the accuracy of a live AI model or prove that the product saves tradespeople time.

## Known limitations

1. **The analysis uses prepared examples.** The prototype cannot interpret arbitrary enquiries yet. Next I would connect a model and evaluate unfamiliar messages, paying particular attention to invented details and overly confident trade classifications.
2. **Photos are previewed, not analysed.** The prototype cannot determine the cause of damp or an electrical fault from an image. A later version should distinguish visible observations from possible causes and keep the tradesperson’s review in the workflow.
3. **The benefit has not been tested with tradespeople.** Passing my own tests does not establish that the summary reduces administrative work. Next I would compare assessment time and missed follow-up questions with and without the tool, using the same enquiries.

## Code and checks

- `index.html`, `style.css` and `app.js`: interface and review flow.
- `analysis.mjs`: prepared summaries and unsupported-input handling.
- `server.mjs`: serves the application files.
- `analysis.test.mjs`: automated logic checks.

Run the automated checks with:

```bash
npm test
```

The source files sit at the project root. No credentials are required, and local environment files are excluded by `.gitignore`.

## AI-use record

I used Replit and ChatGPT to help develop the prototype. ChatGPT helped compare the build with the assignment and my problem framing, narrow the workflow, prepare example responses, revise the interface, write checks and draft the README. I tested the three user-facing cases in Replit Preview.

An important revision was removing public job publication from this slice. It added a second user journey before I had tested whether the structured enquiry was useful. I also kept the original message visible and ensured that changing the input removes the previous result, so the tradesperson is not reviewing an outdated summary.

## Submission note

The three test cases and results are under **“Three quick test cases”**, and the current limitations are under **“Known limitations”**. The updated prototype was tested in Replit Preview. Republishing was blocked by exhausted Replit credits, so the public app link still shows the earlier version. The updated source code should be used to run the version described here.
