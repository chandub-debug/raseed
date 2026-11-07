import { CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/lib/types";

interface EvidenceBadgeProps {
  status: EvidenceStatus;
  className?: string;
}

export default function EvidenceBadge({ status, className }: EvidenceBadgeProps) {
  if (status === "verified") {
    return (
      <span className={cn("badge-verified", className)}>
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </span>
    );
  }
  if (status === "missing") {
    return (
      <span className={cn("badge-missing", className)}>
        <AlertCircle className="w-3 h-3" />
        Missing
      </span>
    );
  }
  return (
    <span className={cn("badge-unverified", className)}>
      <HelpCircle className="w-3 h-3" />
      Unverified
    </span>
  );
}
