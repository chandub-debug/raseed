import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildEvidenceSystemPrompt } from "@/lib/prompts";
import { generateId } from "@/lib/utils";
import type { CaseFacts, UploadedFile, EvidenceClaim } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      facts: Partial<CaseFacts>;
      // dataUrl is stripped server-side — Groq has no vision endpoint
      files: Omit<UploadedFile, "dataUrl">[];
    };

    const { facts, files } = body;

    const systemPrompt = buildEvidenceSystemPrompt(facts, files as UploadedFile[]);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content:
            "Please analyse the uploaded evidence against the stated claims and return the JSON analysis.",
        },
      ],
      temperature: 0.2,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    let parsed: {
      evidenceClaims?: EvidenceClaim[];
      missingEvidence?: string[];
      overallAssessment?: string;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const evidenceClaims: EvidenceClaim[] = (parsed.evidenceClaims ?? []).map((c) => ({
      ...c,
      id: c.id ?? generateId(),
      linkedFileIds: c.linkedFileIds ?? [],
    }));

    return NextResponse.json({
      evidenceClaims,
      missingEvidence: parsed.missingEvidence ?? [],
      overallAssessment: parsed.overallAssessment ?? "",
    });
  } catch (err: unknown) {
    console.error("[/api/analyse-evidence] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
