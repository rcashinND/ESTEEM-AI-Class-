# Trawd AI — Project Prototype Revision

Trawd turns a customer’s unstructured home-repair enquiry into a short job brief for independent tradespeople. The customer can answer focused questions and attach an optional photo. The tradesperson reviews stated job details, tentative trades, missing information and follow-ups before deciding what to do.

This is the University of Notre Dame ESTM 60244 prototype revision. Use fictional information.

## Run the prototype

Open the [public customer enquiry](https://trade-lead-ai.replit.app/customer), type a description or choose a fictional example, answer any relevant questions, then select **Submit enquiry**. The [tradesperson review](https://trade-lead-ai.replit.app/review) displays the brief in the same tab after submission.

The browser runs prepared examples and limited, deterministic rules. The intake and review screens are distinct. Photos can be attached for human inspection. The prototype does not perform live language or image inference, diagnose faults, quote, send or accept jobs. The same-tab handoff expires after an hour.

## Assignment components

- [Revision report, risk response and priorities](docs/revision-report.md)
- [Response to both anonymous peer reviews and instructor feedback](docs/feedback-response.md)
- [Evaluation evidence, before/after, logs and screenshots](docs/testing-evidence.md)
- [Draft AI-use disclosure](docs/ai-use-disclosure.md)
- [Demo script and shot list](docs/demo-script.md)
- [Submission checklist](docs/submission-checklist.md)

## Demo Video

[Watch the 2:10 narrated demo on Google Drive](https://drive.google.com/file/d/1FwMdab1mJWTQyCu7STGQ8eTq18eTty9h/view). The video records the running prototype and uses synthetic narration. See the [shot list and script](docs/demo-script.md).

## Install and test

Requires Node.js 20 or later and npm. No keys or build step are needed.

```bash
git clone https://github.com/rcashinND/ESTEEM-AI-Class-.git
cd ESTEEM-AI-Class-
npm install
npm test
npm start
```

Open `http://localhost:3000/customer`. A host can supply a different `PORT`. In Replit, use **Run**. The code uses one static Node server, browser modules in [public](public/) and Node tests in [tests](tests/).

```bash
npm run verify:clean
```

The clean-copy verifier installs and tests a temporary copy, starts the real server and checks HTTP assets. The revision passed [162 automated tests](docs/evidence/current/release-tests.txt) and the [clean-copy run](docs/evidence/current/release-clean-install.txt).

## Known limitations

Patterns can miss unfamiliar phrasing, conflicting details and unusual place or date wording. A vague enquiry with blank clarifications can display a misleading mode label even though its factual fields stay unconfirmed. Review is summary-only, so users cannot compare the source text there. Photos and the brief stay in same-tab session storage. There are no authenticated roles or cross-device delivery. The [risk response and next priorities](docs/revision-report.md#concrete-risk-response) explain what remains to be tested.
