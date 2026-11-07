import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildComplaintSystemPrompt } from "@/lib/prompts";
import type { CaseFacts, EvidenceClaim, CaseAnalysis, ComplaintDraft } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      facts: Partial<CaseFacts>;
      evidenceClaims: EvidenceClaim[];
      analysis: CaseAnalysis;
    };

    const { facts, evidenceClaims, analysis } = body;

    const systemPrompt = buildComplaintSystemPrompt(facts, evidenceClaims, analysis);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Please generate the formal consumer complaint letter and return the JSON.",
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: Partial<ComplaintDraft>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const complaint: ComplaintDraft = {
      subject: parsed.subject ?? "Consumer Complaint",
      to: parsed.to ?? "The Grievance Officer",
      body: parsed.body ?? "",
      reliefSought: parsed.reliefSought ?? [],
      enclosures: parsed.enclosures ?? [],
      nextSteps: parsed.nextSteps ?? [],
    };

    return NextResponse.json({ complaint });
  } catch (err: unknown) {
    console.error("[/api/generate-complaint] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
