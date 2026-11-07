import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildAnalysisSystemPrompt } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import type { CaseFacts, UploadedFile, EvidenceClaim, CaseAnalysis } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      facts: Partial<CaseFacts>;
      evidenceClaims: EvidenceClaim[];
      files: UploadedFile[];
    };

    const { facts, evidenceClaims, files } = body;

    const systemPrompt = buildAnalysisSystemPrompt(facts, evidenceClaims, files);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Please analyse this consumer dispute and return the comprehensive case analysis JSON.",
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: Partial<CaseAnalysis>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const timeline = (parsed.timeline ?? []).map((t) => ({
      ...t,
      id: t.id ?? generateId(),
    }));

    const analysis: CaseAnalysis = {
      summary: parsed.summary ?? "",
      timeline,
      evidenceClaims,
      missingEvidence: parsed.missingEvidence ?? [],
      legalGrounds: parsed.legalGrounds ?? [],
      strengthAssessment: parsed.strengthAssessment ?? "moderate",
      strengthReason: parsed.strengthReason ?? "",
      possibleDefenses: parsed.possibleDefenses ?? [],
      recommendedAction: parsed.recommendedAction ?? "",
    };

    return NextResponse.json({ analysis });
  } catch (err: unknown) {
    console.error("[/api/analyse-case] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
