"use client";

import { Scale, MessageCircle, Upload, Search, FileText, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

const STEPS = [
  {
    number: 1,
    icon: MessageCircle,
    title: "Tell us what happened",
    description:
      "Describe your problem in plain language. RASEED asks a few questions to understand your situation — no legal knowledge needed.",
  },
  {
    number: 2,
    icon: Upload,
    title: "Upload your proof",
    description:
      "Upload payment receipts, order confirmations, screenshots, or any relevant documents.",
  },
  {
    number: 3,
    icon: Search,
    title: "Understand your situation",
    description:
      "RASEED maps each claim to your evidence, identifies what is missing, and explains applicable consumer law.",
  },
  {
    number: 4,
    icon: FileText,
    title: "Prepare your complaint",
    description:
      "Get a formal complaint letter, list of supporting documents, and step-by-step instructions for what to do next.",
  },
];

const TRUST_POINTS = [
  "Only cites official government and statutory sources",
  "Clearly marks unverified claims — never presents them as facts",
  "Recommends professional legal help when needed",
  "You review everything before using it",
];

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-brand-50/20 flex flex-col">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-sm">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-surface-900 tracking-tight">RASEED</span>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-2xl mx-auto w-full gap-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-200">
          <Scale className="w-9 h-9 text-white" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold text-surface-900 leading-tight tracking-tight">
            Your consumer rights,<br />
            <span className="text-brand-500">made clear.</span>
          </h1>
          <p className="text-lg text-surface-500 leading-relaxed max-w-lg mx-auto">
            RASEED helps you prepare an evidence-backed complaint for online
            shopping and refund disputes in India — step by step, in plain English.
          </p>
        </div>

        <button
          onClick={onStart}
          className="btn-primary text-base px-8 py-3 shadow-lg shadow-brand-200 hover:shadow-xl hover:shadow-brand-200 transition-shadow"
        >
          Get started
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-xs text-surface-400">
          Free to use · No sign-up required · For Indian consumers
        </p>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-surface-200 py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">How it works</h2>
            <p className="text-surface-500">Four steps from problem to prepared complaint.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="card p-5 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">
                      Step {step.number}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-surface-900">{step.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Key differentiator ───────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-surface-900">Built around one principle</h2>
            <p className="text-brand-600 font-semibold text-lg">
              Every important claim is connected to proof — or clearly marked as unverified.
            </p>
          </div>

          <p className="text-surface-500 leading-relaxed">
            If you claim you paid ₹15,000 but haven&apos;t uploaded a payment receipt,
            RASEED will not present that payment as a verified fact. It will tell you
            exactly what evidence is missing.
          </p>

          {/* Trust points */}
          <div className="card p-5 text-left space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-surface-800">Our safeguards</span>
            </div>
            {TRUST_POINTS.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Covered scenarios ────────────────────────────────────────────── */}
      <section className="bg-white border-y border-surface-200 py-16 px-6">
        <div className="max-w-2xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-bold text-surface-900">What RASEED covers (v1)</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            {[
              "Product paid for but never delivered",
              "Refund initiated but not received",
              "Order cancelled without a refund",
              "Defective product, unresolved complaint",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-surface-50 rounded-xl px-4 py-3 text-sm text-surface-700"
              >
                <span className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-surface-400">
            English text-based complaints only · Voice and regional language support coming later
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <h2 className="text-2xl font-bold text-surface-900">
            Ready to take the first step?
          </h2>
          <button
            onClick={onStart}
            className="btn-primary text-base px-8 py-3 w-full sm:w-auto justify-center shadow-lg shadow-brand-200"
          >
            Start your complaint
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-200 bg-white/60">
        <div className="max-w-4xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-surface-400">
          <p>© 2026 RASEED · Not a legal service · For Indian consumers only</p>
          <div className="flex items-center gap-5">
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
            >
              National Consumer Helpline <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://edaakhil.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
            >
              e-Daakhil <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://consumeraffairs.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
            >
              Consumer Affairs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
