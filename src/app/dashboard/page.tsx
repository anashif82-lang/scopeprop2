import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { listProposals } from "@/lib/db/proposals";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProposalRow } from "@/features/proposals/proposal-row";
import { PlusCircle, FileText, Send, CheckCircle2, Pencil, Zap, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
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

  const proposals = await listProposals(organization.id);

  const stats = {
    total: proposals.length,
    draft: proposals.filter((p) => p.status === "draft").length,
    sent: proposals.filter((p) => p.status === "sent" || p.status === "viewed").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
  };

  const closeRate =
    stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : null;

  const recent = proposals.slice(0, 8);

  // Friendly greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ?? user.email?.split("@")[0];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">{organization.name}</p>
        </div>
        <Button asChild className="shadow-sm shadow-violet-200">
          <Link href="/proposals/new">
            <PlusCircle className="h-4 w-4" />
            New proposal
          </Link>
        </Button>
      </div>

      {/* Welcome banner for new users */}
      {proposals.length === 0 && (
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
              Welcome to ScopeProp
            </div>
            <h2 className="text-xl font-black mb-1">
              Create your first proposal in 2 minutes
            </h2>
            <p className="text-violet-200 text-sm max-w-md leading-relaxed">
              Tell us about your client and project. Our AI writes the full
              scope, timeline, and pricing — you just review and send.
            </p>
          </div>
          <Button
            className="bg-white text-violet-700 hover:bg-violet-50 font-bold flex-shrink-0 shadow-lg"
            asChild
            size="lg"
          >
            <Link href="/proposals/new">
              <Zap className="h-4 w-4" />
              Generate first proposal
            </Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total proposals",
            value: stats.total,
            icon: FileText,
            color: "text-violet-700",
            bg: "bg-violet-50",
            trend: null,
            context: "All time",
          },
          {
            label: "Drafts",
            value: stats.draft,
            icon: Pencil,
            color: "text-gray-600",
            bg: "bg-gray-50",
            trend: null,
            context: "In progress",
          },
          {
            label: "Sent / Viewed",
            value: stats.sent,
            icon: Send,
            color: "text-blue-700",
            bg: "bg-blue-50",
            trend: stats.sent > 0 ? "Active" : null,
            context: "Awaiting response",
          },
          {
            label: "Accepted",
            value: stats.accepted,
            icon: CheckCircle2,
            color: "text-green-700",
            bg: "bg-green-50",
            trend: closeRate !== null ? `${closeRate}% close rate` : null,
            context: "Signed and closed",
          },
        ].map(({ label, value, icon: Icon, color, bg, trend, context }) => (
          <Card
            key={label}
            className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <CardContent className="py-5 px-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                {trend && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 rounded-full px-2.5 py-0.5">
                    <TrendingUp className="h-3 w-3" />
                    {trend}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-gray-900 mb-0.5">
                {value}
              </div>
              <div className="text-xs font-semibold text-gray-700">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{context}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent proposals */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Recent proposals</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/proposals">View all →</Link>
        </Button>
      </div>

      {recent.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Proposal
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Client
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recent.map((proposal) => (
                <ProposalRow key={proposal.id} proposal={proposal} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-100 bg-violet-50/20 py-24 px-6 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100">
          <FileText className="h-10 w-10 text-violet-500" />
        </div>
        <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 shadow-sm">
          <Zap className="h-4 w-4 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-black text-gray-900 mb-2">
        Your first proposal is one click away
      </h3>
      <p className="text-sm text-gray-500 mb-1 max-w-sm leading-relaxed">
        Describe your project and let AI write a complete, professional proposal
        in under 2 minutes.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        Scope of work · Timeline · Pricing · Terms — all included.
      </p>
      <Button asChild size="lg" className="shadow-lg shadow-violet-100">
        <Link href="/proposals/new">
          <Zap className="h-4 w-4" />
          Generate my first proposal
        </Link>
      </Button>
      <p className="text-xs text-gray-400 mt-4">Free · No credit card required</p>
    </div>
  );
}
