"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { statusColor, statusLabel } from "@/lib/utils";

export function StatusFilterChip({
  status,
  clearHref,
}: {
  status: string;
  clearHref: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${statusColor(status)} border-current/20`}
    >
      <span>Status: {statusLabel(status)}</span>
      <Link
        href={clearHref}
        className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 transition-colors"
        aria-label="Clear status filter"
      >
        <X className="h-3 w-3" />
      </Link>
    </div>
  );
}
