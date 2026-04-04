import Link from "next/link";
import type { Proposal } from "@/types";
import { formatDate, statusColor, statusLabel, cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ProposalRowProps {
  proposal: Proposal;
}

export function ProposalRow({ proposal }: ProposalRowProps) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-violet-50/30 transition-colors duration-150 group">
      <td className="px-5 py-4">
        <Link
          href={`/dashboard/proposals/${proposal.id}`}
          className="font-semibold text-gray-900 hover:text-violet-600 group-hover:text-violet-700 transition-colors"
        >
          {proposal.title}
        </Link>
        <div className="text-xs text-gray-400 mt-0.5">{proposal.project_type}</div>
      </td>
      <td className="px-5 py-4">
        <span className="text-sm text-gray-700 font-medium">
          {proposal.client?.name ?? <span className="text-gray-400">—</span>}
        </span>
        {proposal.client?.company && (
          <div className="text-xs text-gray-400">{proposal.client.company}</div>
        )}
      </td>
      <td className="px-5 py-4">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            statusColor(proposal.status)
          )}
        >
          {statusLabel(proposal.status)}
        </span>
      </td>
      <td className="px-5 py-4 text-gray-500 text-xs font-medium">
        {formatDate(proposal.created_at)}
      </td>
      <td className="px-5 py-4">
        <Link
          href={`/dashboard/proposals/${proposal.id}`}
          className="flex items-center justify-end text-gray-300 group-hover:text-violet-500 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </td>
    </tr>
  );
}
