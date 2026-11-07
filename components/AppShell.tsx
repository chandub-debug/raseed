"use client";

import { useState, useEffect, useCallback } from "react";
import { RotateCcw, Scale } from "lucide-react";
import StepIndicator from "@/components/ui/StepIndicator";
import Step1Intake from "@/components/steps/Step1Intake";
import Step2Evidence from "@/components/steps/Step2Evidence";
import Step3Analysis from "@/components/steps/Step3Analysis";
import Step4Complaint from "@/components/steps/Step4Complaint";
import { loadSession, saveSession, clearSession } from "@/lib/session-store";
import { cn } from "@/lib/utils";
import type { DisputeSession, DisputeStep } from "@/lib/types";

export default function AppShell() {
  const [session, setSession] = useState<DisputeSession | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    setSession(loadSession());
  }, []);

  // Persist on every change
  useEffect(() => {
    if (session) saveSession(session);
  }, [session]);

  const updateSession = useCallback((updates: Partial<DisputeSession>) => {
    setSession((prev) => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  }, []);

  function goToStep(step: DisputeStep) {
    updateSession({ currentStep: step });
    // Scroll to top of content area
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStartOver() {
    setShowResetConfirm(true);
  }

  function confirmReset() {
    const fresh = clearSession();
    setSession(fresh);
    setShowResetConfirm(false);
  }

  // SSR guard — don't render until client hydration
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-surface-200 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50/30 flex flex-col">

      {/* ── Top navigation bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-surface-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-surface-900 tracking-tight">RASEED</span>
              <span className="hidden sm:inline text-xs text-surface-400 ml-2">
                Consumer Dispute Assistant
              </span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleStartOver}
            className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-100"
            aria-label="Start a new case"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New case</span>
          </button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-6">

        {/* Step indicator */}
        <StepIndicator currentStep={session.currentStep} />

        {/* Step content card */}
        <div
          className={cn(
            "card flex-1 overflow-hidden",
            session.currentStep === 1 ? "flex flex-col" : ""
          )}
          style={{ minHeight: session.currentStep === 1 ? "560px" : undefined }}
        >
          {session.currentStep === 1 && (
            <Step1Intake
              session={session}
              onUpdate={updateSession}
              onNext={() => goToStep(2)}
            />
          )}

          {session.currentStep === 2 && (
            <Step2Evidence
              session={session}
              onUpdate={updateSession}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {session.currentStep === 3 && (
            <Step3Analysis
              session={session}
              onUpdate={updateSession}
              onNext={() => goToStep(4)}
              onBack={() => goToStep(2)}
            />
          )}

          {session.currentStep === 4 && (
            <Step4Complaint
              session={session}
              onUpdate={updateSession}
              onBack={() => goToStep(3)}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-200 bg-white/60 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-surface-400">
          <p>© 2026 RASEED · Not a legal service · For Indian consumer disputes</p>
          <div className="flex items-center gap-4">
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
            >
              National Consumer Helpline
            </a>
            <a
              href="https://edaakhil.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors"
            >
              e-Daakhil Portal
            </a>
          </div>
        </div>
      </footer>

      {/* ── Reset confirmation modal ──────────────────────────────────────── */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-title"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm mx-4 space-y-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 id="reset-title" className="font-semibold text-surface-900">Start a new case?</h2>
                <p className="text-sm text-surface-500">All current progress will be lost.</p>
              </div>
            </div>
            <p className="text-sm text-surface-600">
              This will clear your conversation, uploaded files, case analysis, and
              complaint draft. This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 justify-center inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
