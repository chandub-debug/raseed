"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, ArrowRight } from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import ChatBubble, { TypingIndicator } from "@/components/ui/ChatBubble";
import DisclaimerBanner from "@/components/ui/DisclaimerBanner";
import type { Message, CaseFacts, DisputeSession } from "@/lib/types";

interface Step1IntakeProps {
  session: DisputeSession;
  onUpdate: (updates: Partial<DisputeSession>) => void;
  onNext: () => void;
}

const ISSUE_KEYWORDS: Record<string, CaseFacts["issueType"]> = {
  "not delivered":        "product_not_delivered",
  "never delivered":      "product_not_delivered",
  "not received":         "product_not_delivered",
  "refund not received":  "refund_not_received",
  "refund not processed": "refund_not_received",
  "cancelled":            "order_cancelled_no_refund",
  "defective":            "defective_product",
  "damaged":              "defective_product",
};

function extractFacts(messages: Message[]): Partial<CaseFacts> {
  const fullText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  const facts: Partial<CaseFacts> = {};

  // Issue type
  for (const [kw, type] of Object.entries(ISSUE_KEYWORDS)) {
    if (fullText.includes(kw)) {
      facts.issueType = type;
      break;
    }
  }

  // Platform
  const platforms = ["amazon", "flipkart", "meesho", "myntra", "snapdeal", "ajio", "nykaa", "zepto", "blinkit", "swiggy", "zomato"];
  for (const p of platforms) {
    if (fullText.includes(p)) {
      facts.platform = p.charAt(0).toUpperCase() + p.slice(1);
      break;
    }
  }

  // Amount — look for ₹ or "rs" followed by numbers
  const amountMatch = fullText.match(/(?:₹|rs\.?\s*)(\d[\d,]*)/i);
  if (amountMatch) facts.orderAmount = `₹${amountMatch[1]}`;

  return facts;
}

const READY_PHRASES = [
  "please click 'continue'",
  "please click continue",
  "click continue",
  "ready to proceed",
  "ready to upload",
];

function detectReadyToAdvance(text: string): boolean {
  const lower = text.toLowerCase();
  return READY_PHRASES.some((p) => lower.includes(p));
}

export default function Step1Intake({ session, onUpdate, onNext }: Step1IntakeProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [readyToAdvance, setReadyToAdvance] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Show welcome message immediately on first load — no API call needed
  useEffect(() => {
    if (session.messages.length === 0) {
      const welcome: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "Hello! I'm **RASEED**, your consumer dispute assistant 👋\n\nI'm here to help you prepare a complaint about an **online shopping or refund problem** — no legal knowledge needed.\n\nCould you start by telling me what happened? Describe the problem in your own words.",
        timestamp: new Date(),
      };
      onUpdate({ messages: [welcome] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session.messages, isLoading]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...session.messages, userMsg];
    onUpdate({ messages: updatedMessages });
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "intake",
          messages: updatedMessages.map((m) => ({
            ...m,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(errData.error ?? `Server error ${res.status}`);
      }

      const data = (await res.json()) as { content?: string; error?: string };
      if (data.error) throw new Error(data.error);

      const reply = data.content ?? "I'm sorry, I had trouble processing that. Could you try again?";

      const assistantMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      const extractedFacts = extractFacts(finalMessages);

      onUpdate({
        messages: finalMessages,
        facts: { ...session.facts, ...extractedFacts },
      });

      if (detectReadyToAdvance(reply)) {
        setReadyToAdvance(true);
      }
    } catch (err) {
      const errMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: `Sorry, I ran into an error: ${err instanceof Error ? err.message : "unknown error"}. Please check that your GROQ_API_KEY is set in .env.local and restart the server.`,
        timestamp: new Date(),
      };
      onUpdate({ messages: [...updatedMessages, errMsg] });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, session.messages, session.facts, onUpdate]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const canContinue = readyToAdvance || session.messages.filter((m) => m.role === "user").length >= 3;

  return (
    <div className="flex flex-col h-full">
      {/* Disclaimer */}
      <div className="px-4 pt-4 pb-2">
        <DisclaimerBanner />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {session.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-surface-100 bg-white px-4 py-3">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your problem here…"
            rows={2}
            className={cn(
              "flex-1 resize-none rounded-xl border border-surface-200 bg-surface-50",
              "px-4 py-3 text-sm text-surface-900 placeholder-surface-400",
              "focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-400",
              "transition-colors duration-150"
            )}
            aria-label="Your message"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-primary h-11 px-4"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Continue button */}
        {canContinue && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={onNext}
              className="btn-primary gap-2"
            >
              Continue to Evidence
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
