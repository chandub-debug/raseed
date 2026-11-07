import { AlertTriangle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
      <p>
        <strong>RASEED is an assistance tool, not a lawyer.</strong> It helps you
        prepare and organise your complaint. For complex disputes, please consult a
        qualified legal professional.
      </p>
    </div>
  );
}
