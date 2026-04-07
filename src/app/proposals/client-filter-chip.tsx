"use client";

import Link from "next/link";
import { X } from "lucide-react";

export function ClientFilterChip({ clientName }: { clientName: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
        <span>Client: {clientName}</span>
        <Link
          href="/proposals"
          className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-violet-200 transition-colors"
          aria-label="Clear filter"
        >
          <X className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
