"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisputeStep } from "@/lib/types";

const STEPS = [
  { number: 1, label: "What happened" },
  { number: 2, label: "Your evidence" },
  { number: 3, label: "Your situation" },
  { number: 4, label: "Your complaint" },
] as const;

interface StepIndicatorProps {
  currentStep: DisputeStep;
  className?: string;
}

export default function StepIndicator({ currentStep, className }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isDone    = step.number < currentStep;
          const isActive  = step.number === currentStep;
          const isPending = step.number > currentStep;

          return (
            <li key={step.number} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                    isDone    && "bg-green-500 text-white shadow-sm shadow-green-200",
                    isActive  && "bg-brand-500 text-white shadow-md shadow-brand-200 ring-4 ring-brand-100",
                    isPending && "bg-surface-100 text-surface-400 border border-surface-200"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isDone ? <Check className="w-4 h-4" /> : step.number}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap hidden sm:block",
                    isDone    && "text-green-600",
                    isActive  && "text-brand-600",
                    isPending && "text-surface-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors duration-300",
                    isDone ? "bg-green-400" : "bg-surface-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
