import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export default function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)} role="status">
      <div
        className={cn(
          "rounded-full border-surface-200 border-t-brand-500 animate-spin",
          sizeClasses[size]
        )}
      />
      {label && (
        <p className="text-sm text-surface-500 animate-pulse-soft">{label}</p>
      )}
    </div>
  );
}
