# RASEED — Consumer Dispute Assistant

RASEED is an AI assistant that helps ordinary people in India prepare evidence-backed consumer complaints for online shopping and refund disputes.

## Quick Start

### 1. Prerequisites

- **Node.js 18+** — [Download here](https://nodejs.org)
- **A Groq API key** — [Get one free here](https://console.groq.com/keys)

### 2. Install dependencies

```bash
cd raseed
npm install
```

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and add your OpenAI key:

```
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-70b-versatile
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
raseed/
├── app/
│   ├── api/
│   │   ├── chat/route.ts               # Step 1 intake & analysis follow-up chat
│   │   ├── analyse-evidence/route.ts   # Step 2 evidence → claims mapping
│   │   ├── analyse-case/route.ts       # Step 3 full case analysis
│   │   └── generate-complaint/route.ts # Step 4 complaint letter generation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                        # Entry point (landing → app shell)
├── components/
│   ├── AppShell.tsx                    # 4-step wizard with session management
│   ├── LandingPage.tsx                 # Marketing / onboarding page
│   ├── steps/
│   │   ├── Step1Intake.tsx             # Conversational problem intake
│   │   ├── Step2Evidence.tsx           # File upload + evidence analysis
│   │   ├── Step3Analysis.tsx           # Case summary, timeline, legal grounds
│   │   └── Step4Complaint.tsx          # Complaint generation + next steps
│   └── ui/
│       ├── ChatBubble.tsx
│       ├── DisclaimerBanner.tsx
│       ├── EvidenceBadge.tsx
│       ├── LoadingSpinner.tsx
│       └── StepIndicator.tsx
├── lib/
│   ├── legal-sources.ts               # Official Indian consumer law references
│   ├── prompts.ts                     # All AI system prompts
│   ├── session-store.ts               # localStorage session persistence
│   ├── types.ts                       # TypeScript domain types
│   └── utils.ts                       # Utilities
├── .env.local.example
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Features

| Feature | Description |
|---|---|
| Conversational intake | AI asks focused questions to understand the dispute |
| Evidence upload | Drag-and-drop JPG, PNG, PDF, TXT (max 5 MB) |
| Evidence analysis | Maps each claim to uploaded documents; marks verified / unverified / missing |
| Case analysis | Timeline, legal grounds (CPA 2019, E-Commerce Rules 2020), strength rating, possible defenses |
| Complaint generation | Formal letter, relief sought, enclosures, next steps with portal links |
| Official sources only | AI cannot cite legal sections outside the approved list |
| Session persistence | Progress saved in localStorage — refresh without losing work |

## Legal Sources

RASEED only cites official sources, including:

- Consumer Protection Act, 2019 (Sections 2, 34, 47, 58, 69, 80)
- Consumer Protection (E-Commerce) Rules, 2020
- National Consumer Helpline — [consumerhelpline.gov.in](https://consumerhelpline.gov.in)
- e-Daakhil portal — [edaakhil.nic.in](https://edaakhil.nic.in)
- RBI Integrated Ombudsman — [cms.rbi.org.in](https://cms.rbi.org.in)

## Test Scenarios

The prototype is designed to handle:

1. Product paid for but never delivered
2. Refund initiated but not received
3. Order cancelled without a refund
4. User has no payment receipt (evidence gap)
5. User provides contradictory dates
6. User reports suspected online fraud

## Limitations (v1)

- English text only (no voice, no regional languages)
- Online shopping and refund disputes only
- Requires OpenAI API key (no offline mode)
- Not a substitute for qualified legal advice

---

> **RASEED is a preparation tool, not a lawyer.**  
> Always review generated complaints before sending them.
