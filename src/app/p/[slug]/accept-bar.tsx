"use client";

import { CheckCircle2 } from "lucide-react";

interface AcceptBarProps {
  title: string;
  email?: string;
  proposalTitle: string;
}

export function AcceptBar({ title, email, proposalTitle }: AcceptBarProps) {
  return (
    <div className="sticky top-0 z-30 hidden md:flex items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-md px-6 py-3 shadow-sm">
      <span className="text-sm font-semibold text-gray-800 truncate max-w-md">{title}</span>
      {email ? (
        <a
          href={`mailto:${email}?subject=Re: ${encodeURIComponent(proposalTitle)}`}
          className="flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-sm font-bold text-white transition-colors shadow-sm shadow-violet-200"
        >
          <CheckCircle2 className="h-4 w-4" />
          Accept proposal
        </a>
      ) : null}
    </div>
  );
}
