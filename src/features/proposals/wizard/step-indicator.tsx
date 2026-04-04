import { cn } from "@/lib/utils";

interface Step {
  label: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number;
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Step label */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <span className="text-sm font-bold text-violet-700">
          {steps[current].label}
        </span>
        <span className="text-xs text-gray-400 font-medium">
          {current + 1} of {steps.length}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-1">
        {steps.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              idx < current
                ? "bg-violet-500"
                : idx === current
                ? "bg-violet-400"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>

      {/* Description */}
      <p className="mt-1.5 text-xs text-gray-400 px-0.5">
        {steps[current].description}
      </p>
    </div>
  );
}
