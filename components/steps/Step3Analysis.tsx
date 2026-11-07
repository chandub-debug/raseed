"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle, CheckCircle2, TrendingUp, TrendingDown,
  Minus, Scale, ArrowRight, ArrowLeft, MessageCircle,
  ExternalLink, Send, Shield, Clock,
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import EvidenceBadge from "@/components/ui/EvidenceBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ChatBubble, { TypingIndicator } from "@/components/ui/ChatBubble";
import { getSourceById } from "@/lib/legal-sources";
import type { DisputeSession, CaseAnalysis, Message } from "@/lib/types";

interface Step3AnalysisProps {
  session: DisputeSession;
  onUpdate: (updates: Partial<DisputeSession>) => void;
  onNext: () => void;
  onBack: () => void;
}

const STRENGTH_CONFIG = {
  strong: {
    label: "Strong case",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    dot: "bg-green-500",
  },
  moderate: {
    label: "Moderate case",
    icon: Minus,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
  },
  weak: {
    label: "Weak case",
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
  },
} as const;

export default function Step3Analysis({
  session, onUpdate, onNext, onBack,
}: Step3AnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(session.analysis);

  // Follow-up chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-generate on mount if no analysis yet
  useEffect(() => {
    if (!analysis || !analysis.summary) {
      generateAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  async function generateAnalysis() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyse-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facts: session.facts,
          evidenceClaims: session.analysis?.evidenceClaims ?? [],
          files: session.uploadedFiles.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            size: f.size,
          })),
        }),
      });
      const data = await res.json() as { analysis?: CaseAnalysis; error?: string };
      if (data.error) throw new Error(data.error);
      if (!data.analysis) throw new Error("No analysis returned");

      setAnalysis(data.analysis);
      onUpdate({ analysis: data.analysis });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function sendChatMessage() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    setChatInput("");

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    const updated = [...chatMessages, userMsg];
    setChatMessages(updated);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "analysis-chat",
          facts: session.facts,
          evidenceClaims: session.analysis?.evidenceClaims ?? [],
          messages: updated.map((m) => ({ ...m, timestamp: m.timestamp.toISOString() })),
        }),
      });
      const data = await res.json() as { content?: string };
      const reply: Message = {
        id: generateId(),
        role: "assistant",
        content: data.content ?? "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };
      setChatMessages([...updated, reply]);
    } catch {
      setChatMessages([
        ...updated,
        {
          id: generateId(),
          role: "assistant",
          content: "Connection error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <LoadingSpinner size="lg" label="Analysing your case…" />
        <p className="text-sm text-surface-400 text-center max-w-xs">
          Checking legal grounds, identifying evidence gaps, and assessing case strength.
        </p>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <p className="text-surface-700 font-medium">{error}</p>
        <button onClick={generateAnalysis} className="btn-primary">
          Try again
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  const strengthCfg = STRENGTH_CONFIG[analysis.strengthAssessment] ?? STRENGTH_CONFIG.moderate;
  const StrengthIcon = strengthCfg.icon;

  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto">
      {/* ── Case summary ──────────────────────────────────────────────────── */}
      <section className="card p-4 space-y-2">
        <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
          <Scale className="w-4 h-4 text-brand-500" />
          Case Summary
        </h2>
        <p className="text-sm text-surface-700 leading-relaxed">{analysis.summary}</p>

        {/* Strength */}
        <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 mt-2", strengthCfg.bg)}>
          <StrengthIcon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", strengthCfg.color)} />
          <div>
            <p className={cn("text-sm font-semibold", strengthCfg.color)}>{strengthCfg.label}</p>
            <p className="text-xs text-surface-600 mt-0.5">{analysis.strengthReason}</p>
          </div>
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      {analysis.timeline.length > 0 && (
        <section className="card p-4 space-y-3">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            Timeline
          </h2>
          <ol className="relative border-l border-surface-200 ml-2 space-y-4">
            {analysis.timeline.map((event) => (
              <li key={event.id} className="ml-4">
                <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-brand-400 border-2 border-white" />
                <p className="text-xs text-surface-400 font-medium">{event.date}</p>
                <p className="text-sm text-surface-800 mt-0.5">{event.event}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Evidence claims ───────────────────────────────────────────────── */}
      {analysis.evidenceClaims.length > 0 && (
        <section className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-surface-100">
            <h2 className="text-base font-semibold text-surface-900">Evidence Check</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="text-left px-4 py-2.5 font-semibold text-surface-500 text-xs uppercase tracking-wide">Claim</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-surface-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-surface-500 text-xs uppercase tracking-wide hidden sm:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {analysis.evidenceClaims.map((claim, idx) => (
                  <tr key={claim.id} className={cn("border-b border-surface-50 last:border-0", idx % 2 === 0 ? "bg-white" : "bg-surface-50/30")}>
                    <td className="px-4 py-3 text-surface-800">{claim.claim}</td>
                    <td className="px-4 py-3"><EvidenceBadge status={claim.status} /></td>
                    <td className="px-4 py-3 text-surface-500 text-xs hidden sm:table-cell">{claim.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Missing evidence ──────────────────────────────────────────────── */}
      {analysis.missingEvidence.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Missing Evidence
          </h2>
          <ul className="space-y-1">
            {analysis.missingEvidence.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="mt-1 text-amber-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Legal grounds ─────────────────────────────────────────────────── */}
      {analysis.legalGrounds.length > 0 && (
        <section className="card p-4 space-y-3">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-500" />
            Legal Grounds
          </h2>
          <div className="space-y-3">
            {analysis.legalGrounds.map((ground, i) => {
              const src = getSourceById(ground.sourceId);
              return (
                <div key={i} className="bg-surface-50 rounded-xl px-4 py-3 space-y-1">
                  <p className="text-sm font-semibold text-surface-800">{ground.section}</p>
                  <p className="text-sm text-surface-600">{ground.description}</p>
                  {src && (
                    <a
                      href={src.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
                    >
                      Official source
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Possible defenses ─────────────────────────────────────────────── */}
      {analysis.possibleDefenses.length > 0 && (
        <section className="card p-4 space-y-3">
          <h2 className="text-base font-semibold text-surface-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-surface-500" />
            What the company might argue
          </h2>
          <p className="text-xs text-surface-400">
            Anticipating their response helps you prepare a stronger complaint.
          </p>
          <ul className="space-y-2">
            {analysis.possibleDefenses.map((defense, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="text-surface-400 mt-0.5 flex-shrink-0">↩</span>
                {defense}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Recommended action ────────────────────────────────────────────── */}
      {analysis.recommendedAction && (
        <section className="bg-brand-50 border border-brand-200 rounded-2xl px-4 py-3">
          <p className="text-sm font-semibold text-brand-800 mb-1">Recommended next step</p>
          <p className="text-sm text-brand-700">{analysis.recommendedAction}</p>
        </section>
      )}

      {/* ── Ask RASEED follow-up ──────────────────────────────────────────── */}
      <section className="card overflow-hidden">
        <button
          onClick={() => setChatOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-50 transition-colors"
          aria-expanded={chatOpen}
        >
          <span className="text-sm font-medium text-surface-700 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-brand-500" />
            Ask RASEED a question about this analysis
          </span>
          <span className="text-surface-400 text-xs">{chatOpen ? "▲ Close" : "▼ Open"}</span>
        </button>

        {chatOpen && (
          <div className="border-t border-surface-100">
            <div className="max-h-64 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-sm text-surface-400 text-center py-4">
                  Ask anything about your case analysis…
                </p>
              )}
              {chatMessages.map((m) => (
                <ChatBubble key={m.id} message={m} />
              ))}
              {chatLoading && <TypingIndicator />}
              <div ref={chatBottomRef} />
            </div>
            <div className="border-t border-surface-100 px-4 py-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="e.g. What does Section 2(7) mean for me?"
                className="flex-1 rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
                aria-label="Ask a follow-up question"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="btn-primary px-3 py-2"
                aria-label="Send question"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div className="flex justify-between pt-2 pb-4">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Prepare Complaint
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
