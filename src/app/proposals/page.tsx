import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { listProposals } from "@/lib/db/proposals";
import type { ProposalStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { ProposalRow } from "@/features/proposals/proposal-row";
import { ClientFilterChip } from "./client-filter-chip";
import { StatusFilterChip } from "./status-filter-chip";
import { PlusCircle, FileText } from "lucide-react";

const VALID_STATUSES = new Set<ProposalStatus>([
  "draft", "sent", "viewed", "accepted", "declined",
]);

interface Props {
  searchParams: Promise<{ client?: string; status?: string }>;
}

export default async function ProposalsPage({ searchParams }: Props) {
  const { client: clientId, status: statusParam } = await searchParams;

  // Validate status so bad query params are ignored
  const statusFilter =
    statusParam && VALID_STATUSES.has(statusParam as ProposalStatus)
      ? (statusParam as ProposalStatus)
      : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { organization } = await getOrCreateOrganization(
    user.id,
    user.email!,
    user.user_metadata?.full_name ?? null
  );

  const allProposals = await listProposals(organization.id);

  // Chain both filters — each is a no-op when its param is absent
  const proposals = allProposals
    .filter((p) => (clientId ? p.client_id === clientId : true))
    .filter((p) => (statusFilter ? p.status === statusFilter : true));

  // Client name for the chip — look in filtered set first, then full list
  const activeClientName = clientId
    ? (proposals[0]?.client?.name ??
        allProposals.find((p) => p.client_id === clientId)?.client?.name ??
        "Client")
    : null;

  // Clear hrefs preserve the other active filter
  const clientClearHref = statusFilter
    ? `/proposals?status=${statusFilter}`
    : "/proposals";
  const statusClearHref = clientId
    ? `/proposals?client=${clientId}`
    : "/proposals";

  const isFiltered = Boolean(clientId || statusFilter);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {proposals.length}
            {isFiltered ? ` of ${allProposals.length}` : ""}{" "}
            proposal{proposals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/proposals/new">
            <PlusCircle className="h-4 w-4" />
            New proposal
          </Link>
        </Button>
      </div>

      {/* Active filter chips */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {activeClientName && (
            <ClientFilterChip
              clientName={activeClientName}
              clearHref={clientClearHref}
            />
          )}
          {statusFilter && (
            <StatusFilterChip
              status={statusFilter}
              clearHref={statusClearHref}
            />
          )}
          {activeClientName && statusFilter && (
            <Link
              href="/proposals"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors ml-1"
            >
              Clear all
            </Link>
          )}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center">
          <FileText className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500 mb-2">
            {isFiltered ? "No proposals match these filters" : "No proposals yet"}
          </p>
          {isFiltered && (
            <Link
              href="/proposals"
              className="text-xs text-violet-600 hover:underline mb-4"
            >
              Clear filters
            </Link>
          )}
          <Button asChild size="sm">
            <Link href="/proposals/new">Create first proposal</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Proposal
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Client
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Date
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {proposals.map((proposal) => (
                <ProposalRow key={proposal.id} proposal={proposal} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
