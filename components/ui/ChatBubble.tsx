"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/lib/types";

interface ChatBubbleProps {
  message: Message;
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
        <span className="text-brand-600 text-xs font-bold">R</span>
      </div>
      <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isAssistant = message.role === "assistant";

  if (isAssistant) {
    return (
      <div className="flex items-start gap-3 animate-slide-up">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">R</span>
        </div>

        <div className="max-w-[82%]">
          <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="prose-raseed text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
          <p className="text-xs text-surface-400 mt-1 ml-1">
            {message.timestamp.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  // User message
  return (
    <div className="flex items-start gap-3 flex-row-reverse animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-surface-200 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-surface-600 text-xs font-bold">U</span>
      </div>

      <div className="max-w-[82%]">
        <div
          className={cn(
            "bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-surface-400 mt-1 mr-1 text-right">
          {message.timestamp.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
