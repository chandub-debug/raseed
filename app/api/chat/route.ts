import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildIntakeSystemPrompt, buildAnalysisChatPrompt } from "@/lib/prompts";
import type { CaseFacts, EvidenceClaim, Message } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messages: Message[];
      mode: "intake" | "analysis-chat";
      facts?: Partial<CaseFacts>;
      evidenceClaims?: EvidenceClaim[];
    };

    const { messages, mode, facts = {}, evidenceClaims = [] } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const systemPrompt =
      mode === "analysis-chat"
        ? buildAnalysisChatPrompt(facts, evidenceClaims)
        : buildIntakeSystemPrompt();

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
          .filter((m) => m.role !== "system")
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error("[/api/chat] Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
