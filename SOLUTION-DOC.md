# RASEED — Solution Document
**Problem 2: Build an AI Lawyer**
**Kuku AI Generalist Assignment**

---

## Why I picked this problem

Most Indians who face consumer disputes — a refund that never came, a product that never arrived — never act. Not because they don't have a case, but because the first step is too hard: they don't know what evidence matters, what law applies, or how to write a complaint that someone will take seriously.

I chose Problem 2 because the bottleneck is not legal knowledge — it is preparation. A tool that turns a messy story into an evidence-backed, correctly-addressed complaint gives ordinary people a real first step. That felt more valuable to build than a Q&A chatbot.

I scoped it narrowly: **online shopping and consumer refund disputes only**, in English. This covers the highest-volume everyday consumer problem in India while staying within a legal domain I could source reliably.

---

## Assumptions made

| Area | Assumption |
|---|---|
| Scope | Online shopping and refund disputes only (not tenancy, salary, notices) |
| Language | English only in v1 |
| Legal sources | Only cite sections explicitly in the approved source list — no inference from memory |
| Evidence | Images sent to LLM for metadata only (Groq has no vision) — file name and type used to infer content |
| Model | Groq `llama-3.1-70b-versatile` — fast and free-tier accessible |
| Users | Assumed basic smartphone literacy; no assumed legal knowledge |
| Verification | User must confirm complaint before download — RASEED is a preparation tool, not a filing service |

---

## How it works

RASEED is a **4-step guided wizard**, not a freeform chatbot.

**Step 1 — Intake chat.** The AI asks one or two questions at a time to extract: platform, amount, issue type, what the user tried, and desired outcome. It does not give legal advice here — it only listens. Fact extraction (platform name, amount, issue type) runs client-side from the conversation text as a fallback.

**Step 2 — Evidence upload and mapping.** The user uploads receipts, screenshots, emails, PDFs. RASEED maps each stated claim to the uploaded files and assigns one of three statuses:
- **Verified** — a file directly supports the claim
- **Unverified** — the user stated it but no file supports it
- **Missing** — RASEED identifies what documents would strengthen the case

The core principle: **an unverified claim is never presented as a fact in the complaint.**

**Step 3 — Case analysis.** RASEED generates a timeline, assesses case strength (strong / moderate / weak), cites applicable legal sections from a locked source list, and lists what the other side might argue. A follow-up chat lets users ask questions about the analysis.

**Step 4 — Complaint generation.** A formal complaint letter is drafted, addressed to the correct Grievance Officer, with relief sought, enclosures list, and numbered next steps (platform portal → NCH helpline → e-Daakhil → RBI Ombudsman). The user must confirm they've reviewed it before the download button activates.

---

## How it avoids hallucinated law

This was the hardest problem to solve.

**Approach: source locking.** The system prompt for every AI call contains the complete list of approved legal sources — 15 official references from the Consumer Protection Act 2019, E-Commerce Rules 2020, NCH, e-Daakhil, and RBI Ombudsman. The instruction is explicit: *"You may ONLY cite sections from this list. Do not invent new sections, Acts, or court judgments."*

**The AI cannot cite what it doesn't see in the prompt.** If a user's case involves tenancy law or criminal fraud, RASEED tells them it cannot help with that category and directs them to appropriate authorities — it does not attempt to improvise.

**Verified vs unverified is structural, not stylistic.** The evidence analysis uses `response_format: json_object` — every claim gets a machine-readable status field. The complaint generation prompt explicitly receives the verified and unverified claim lists separately and is instructed to qualify unverified claims with "as stated by the consumer."

---

## How it scales

| Dimension | Current | At scale |
|---|---|---|
| Model | Groq llama-3.1-70b (env var) | Swap to GPT-4o or Claude 3.5 by changing one env var |
| Legal categories | Online shopping only | Each new category (tenancy, salary) = one new prompt module + new source list entries |
| Languages | English | Replace system prompt language; Hindi/Tamil variants require prompt translation |
| Volume | Single user, localStorage | Replace localStorage with a database (Supabase/Postgres); API routes are already stateless |
| Evidence analysis | File name/type only | Upgrade to GPT-4o vision for actual document content reading |

The architecture is intentionally modular: each step is a separate API route, the legal sources are a standalone file, and the model is an environment variable. A team could add a new legal category in a day.

---

## Test results summary (6 cases)

| # | Case | RASEED behaviour | Result |
|---|---|---|---|
| 1 | Product not delivered, full evidence | Verified all 4 claims, generated complete complaint with correct legal sections | ✅ Pass |
| 2 | Refund shown as processed, not credited | Correctly identified bank statement vs. platform contradiction | ✅ Pass |
| 3 | Order cancelled, no refund for 5 weeks | Identified Flipkart's written promise as key evidence, generated formal complaint | ✅ Pass |
| 4 | No payment receipt (COD) | Marked payment as **unverified**, explained COD context, still found valid legal path | ✅ Pass — core principle held |
| 5 | Contradictory dates (Aug before Sep order) | Flagged impossibility immediately, asked for clarification, rebuilt consistent timeline | ✅ Pass |
| 6 | Suspected online fraud | Identified fraud signals, recommended cybercrime.gov.in + 1930 helpline, stayed within consumer law scope | ✅ Pass — scope limits respected |

---

## Where it fails (honest)

- **No vision.** Groq cannot read document content from images. RASEED infers evidence from file names only — a receipt named `screenshot_123.png` gives it nothing. Switching to GPT-4o vision fixes this immediately.
- **No Hindi or regional language.** The system prompts are English-only. A Tamil or Hindi-speaking user can type in their language but the AI may switch to English in replies.
- **Contradictions within plausible ranges.** If a user says "October" when they mean "November" and both are plausible, RASEED will not catch it.
- **No email delivery.** The complaint is downloaded as a text file — RASEED does not send it anywhere. The user must still take the next step themselves.
- **Free-tier context limit.** Very long conversations (>15 messages) may exceed Groq's context window for the 70B model, causing truncated responses.

---

## Tools used

| Tool | Used for |
|---|---|
| Kiro (AI IDE) | Full code generation — all 26 files written with Kiro |
| Groq API (llama-3.1-70b-versatile) | All AI calls — chat, evidence analysis, case analysis, complaint generation |
| Next.js 14 + TypeScript | Application framework |
| Tailwind CSS | Styling |
| react-dropzone | File upload |

**Where AI got it wrong:** Kiro initially generated the evidence analysis route using OpenAI's vision API format (multi-part content array with `image_url` type). When I switched to Groq — which has no vision endpoint — the route would have silently failed on any image upload. I caught this and rewrote the route to strip `dataUrl` from files before sending to Groq, replacing vision analysis with filename/type-based inference. The fix was straightforward but the original generation made a wrong assumption about provider capability parity.

---

## Prototype

**GitHub:** https://github.com/chandud-debug/raseed

**To run locally:**
```bash
npm install
# Add GROQ_API_KEY to .env.local
npm run dev
```

**Raw outputs:** `/raw-outputs/` folder in the repository (6 test cases)

---

*RASEED is a preparation tool, not a lawyer. Always review generated complaints before sending.*
