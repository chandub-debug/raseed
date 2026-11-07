"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload, X, FileText, Image as ImageIcon,
  ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, RefreshCw,
} from "lucide-react";
import { cn, generateId, formatFileSize, fileToDataUrl, isImageFile } from "@/lib/utils";
import EvidenceBadge from "@/components/ui/EvidenceBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { DisputeSession, UploadedFile, EvidenceClaim } from "@/lib/types";

interface Step2EvidenceProps {
  session: DisputeSession;
  onUpdate: (updates: Partial<DisputeSession>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ACCEPTED_TYPES: Record<string, string[]> = {
  "image/jpeg":      [".jpg", ".jpeg"],
  "image/png":       [".png"],
  "image/webp":      [".webp"],
  "application/pdf": [".pdf"],
  "text/plain":      [".txt"],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function Step2Evidence({ session, onUpdate, onNext, onBack }: Step2EvidenceProps) {
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [evidenceClaims, setEvidenceClaims] = useState<EvidenceClaim[]>(
    session.analysis?.evidenceClaims ?? []
  );
  const [missingEvidence, setMissingEvidence] = useState<string[]>(
    session.analysis?.missingEvidence ?? []
  );
  const [overallAssessment, setOverallAssessment] = useState<string>("");
  const [analysed, setAnalysed] = useState(evidenceClaims.length > 0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = [];
      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_SIZE) continue;
        const dataUrl = await fileToDataUrl(file);
        newFiles.push({
          id: generateId(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
          uploadedAt: new Date(),
        });
      }
      onUpdate({ uploadedFiles: [...session.uploadedFiles, ...newFiles] });
      // Reset analysis when new files are added
      setAnalysed(false);
      setEvidenceClaims([]);
      setMissingEvidence([]);
    },
    [session.uploadedFiles, onUpdate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  function removeFile(id: string) {
    onUpdate({
      uploadedFiles: session.uploadedFiles.filter((f) => f.id !== id),
    });
    setAnalysed(false);
    setEvidenceClaims([]);
  }

  async function analyseEvidence() {
    setIsAnalysing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/analyse-evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facts: session.facts,
          // Strip dataUrl — Groq has no vision endpoint; send only metadata
          files: session.uploadedFiles.map(({ dataUrl: _omit, ...f }) => ({
            ...f,
            uploadedAt: f.uploadedAt.toISOString(),
          })),
        }),
      });
      const data = await res.json() as {
        evidenceClaims?: EvidenceClaim[];
        missingEvidence?: string[];
        overallAssessment?: string;
        error?: string;
      };
      if (data.error) throw new Error(data.error);

      const claims = data.evidenceClaims ?? [];
      const missing = data.missingEvidence ?? [];
      const assessment = data.overallAssessment ?? "";

      setEvidenceClaims(claims);
      setMissingEvidence(missing);
      setOverallAssessment(assessment);
      setAnalysed(true);

      // Store in session analysis (partial)
      onUpdate({
        analysis: {
          ...(session.analysis ?? {
            summary: "",
            timeline: [],
            legalGrounds: [],
            strengthAssessment: "moderate",
            strengthReason: "",
            possibleDefenses: [],
            recommendedAction: "",
          }),
          evidenceClaims: claims,
          missingEvidence: missing,
        },
      });
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalysing(false);
    }
  }

  const verifiedCount  = evidenceClaims.filter((c) => c.status === "verified").length;
  const missingCount   = evidenceClaims.filter((c) => c.status === "missing").length;
  const unverifiedCount = evidenceClaims.filter((c) => c.status === "unverified").length;

  return (
    <div className="flex flex-col gap-6 p-5 overflow-y-auto">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900">Upload your evidence</h2>
        <p className="text-sm text-surface-500 mt-1">
          Upload any documents that support your case — payment receipts, order confirmations,
          screenshots of conversations, refund emails, etc.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-brand-400 bg-brand-50"
            : "border-surface-300 hover:border-brand-300 hover:bg-surface-50 bg-white"
        )}
        aria-label="File upload area"
      >
        <input {...getInputProps()} aria-label="Upload files" />
        <Upload className={cn("w-8 h-8 mx-auto mb-3", isDragActive ? "text-brand-500" : "text-surface-400")} />
        <p className="text-sm font-medium text-surface-700">
          {isDragActive ? "Drop files here…" : "Drag files here or click to browse"}
        </p>
        <p className="text-xs text-surface-400 mt-1">
          Supports JPG, PNG, PDF, TXT · Max 5 MB per file
        </p>
      </div>

      {/* Uploaded files list */}
      {session.uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">
            Uploaded files ({session.uploadedFiles.length})
          </p>
          {session.uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 bg-white border border-surface-200 rounded-xl px-4 py-3"
            >
              {isImageFile(file.name) ? (
                <ImageIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800 truncate">{file.name}</p>
                <p className="text-xs text-surface-400">{formatFileSize(file.size)}</p>
              </div>
              {/* Thumbnail for images */}
              {isImageFile(file.name) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-lg border border-surface-200"
                />
              )}
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analyse button */}
      {session.uploadedFiles.length > 0 && !analysed && (
        <button
          onClick={analyseEvidence}
          disabled={isAnalysing}
          className="btn-primary w-full justify-center"
        >
          {isAnalysing ? (
            <>
              <LoadingSpinner size="sm" />
              Analysing evidence…
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Analyse Evidence
            </>
          )}
        </button>
      )}

      {analysisError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {analysisError}
        </div>
      )}

      {/* Evidence claims table */}
      {analysed && evidenceClaims.length > 0 && (
        <div className="space-y-4">
          {/* Summary pills */}
          <div className="flex gap-3 flex-wrap">
            <span className="badge-verified text-sm px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {verifiedCount} verified
            </span>
            {unverifiedCount > 0 && (
              <span className="badge-unverified text-sm px-3 py-1">
                {unverifiedCount} unverified
              </span>
            )}
            {missingCount > 0 && (
              <span className="badge-missing text-sm px-3 py-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {missingCount} missing
              </span>
            )}
          </div>

          {/* Claims table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left px-4 py-3 font-semibold text-surface-600 w-[45%]">Claim</th>
                    <th className="text-left px-4 py-3 font-semibold text-surface-600 w-[20%]">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-surface-600 w-[15%]">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-surface-600 w-[20%]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {evidenceClaims.map((claim, idx) => (
                    <tr
                      key={claim.id}
                      className={cn(
                        "border-b border-surface-100 last:border-0",
                        idx % 2 === 0 ? "bg-white" : "bg-surface-50/50"
                      )}
                    >
                      <td className="px-4 py-3 text-surface-800">{claim.claim}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs bg-surface-100 text-surface-600 rounded-full">
                          {claim.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <EvidenceBadge status={claim.status} />
                      </td>
                      <td className="px-4 py-3 text-surface-500 text-xs">{claim.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Overall assessment */}
          {overallAssessment && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
              <strong>Assessment:</strong> {overallAssessment}
            </div>
          )}

          {/* Missing evidence */}
          {missingEvidence.length > 0 && (
            <div className="card p-4 space-y-2">
              <p className="text-sm font-semibold text-surface-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                Documents that would strengthen your case
              </p>
              <ul className="space-y-1.5">
                {missingEvidence.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                    <span className="text-amber-400 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Re-analyse */}
          <button
            onClick={analyseEvidence}
            className="btn-secondary text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-analyse
          </button>
        </div>
      )}

      {/* No files — allow skipping with warning */}
      {session.uploadedFiles.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <strong>Tip:</strong> Uploading evidence makes your complaint much stronger.
          You can still continue without evidence, but unverified claims will be clearly marked.
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={session.uploadedFiles.length > 0 && !analysed && !isAnalysing}
          className="btn-primary"
        >
          Continue to Analysis
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
