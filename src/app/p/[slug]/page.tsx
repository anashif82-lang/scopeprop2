import { notFound } from "next/navigation";
import { getProposalBySlug, recordProposalEvent, SECTION_LABELS, SECTION_ORDER } from "@/lib/db/proposals";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Proposal } from "@/types";
import {
  Star,
  CheckSquare,
  DollarSign,
  Calendar,
  AlertCircle,
  FileText,
  MessageSquare,
  Shield,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
import { AcceptBar } from "./accept-bar";

interface Props {
  params: Promise<{ slug: string }>;
}

const SECTION_ICONS: Record<string, React.ElementType> = {
  executive_summary: Star,
  scope_of_work: CheckSquare,
  deliverables: CheckSquare,
  pricing: DollarSign,
  timeline: Calendar,
  out_of_scope: AlertCircle,
  terms_and_conditions: Shield,
  about_us: MessageSquare,
  next_steps: ArrowRightIcon,
};

export default async function PublicProposalPage({ params }: Props) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);

  if (!proposal) notFound();

  // Record view event (fire and forget)
  recordProposalEvent(proposal.id, "viewed", { slug }).catch(() => {});

  const sectionMap = buildSectionMap(proposal);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Letterhead top bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500">
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">ScopeProp</div>
              <div className="text-xs text-gray-400">{formatDate(proposal.created_at)}</div>
            </div>
          </div>
          {proposal.client && (
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-0.5">Prepared for</div>
              <div className="text-sm font-semibold text-white">
                {proposal.client.name}
                {proposal.client.company ? ` · ${proposal.client.company}` : ""}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky accept bar (client component, desktop only) */}
      <AcceptBar
        title={proposal.title}
        email={proposal.client?.email ?? undefined}
        proposalTitle={proposal.title}
      />

      <div className="max-w-3xl mx-auto py-10 px-6">
        {/* Proposal header */}
        <div className="mb-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-violet-600 mb-3">
            Project Proposal
          </div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
            {proposal.title}
          </h1>

          {/* Meta chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            {proposal.project_type && (
              <Chip>{proposal.project_type}</Chip>
            )}
            {proposal.timeline && (
              <Chip>
                <Calendar className="h-3 w-3 mr-1 inline" />
                {proposal.timeline}
              </Chip>
            )}
            {proposal.total_amount && (
              <Chip className="bg-violet-50 text-violet-700 border-violet-100">
                <DollarSign className="h-3 w-3 mr-1 inline" />
                {formatCurrency(proposal.total_amount, proposal.currency)}
              </Chip>
            )}
            {proposal.hourly_rate && (
              <Chip className="bg-violet-50 text-violet-700 border-violet-100">
                {formatCurrency(proposal.hourly_rate, proposal.currency)}/hr
              </Chip>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {SECTION_ORDER.map((key) => {
            const content = sectionMap[key];
            if (!content) return null;
            const isPricing = key === "pricing";
            return (
              <Section
                key={key}
                sectionKey={key}
                label={SECTION_LABELS[key]}
                content={content}
                highlight={isPricing}
              />
            );
          })}
        </div>

        {/* CTA footer */}
        <div className="mt-14 relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 text-white p-10 text-center">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-2xl font-black mb-2">Ready to move forward?</h2>
            <p className="text-violet-200 text-sm mb-7 max-w-sm mx-auto leading-relaxed">
              Reply to this proposal or reach out directly to get started. We&apos;re excited to work with you.
            </p>
            {proposal.client?.email ? (
              <a
                href={`mailto:${proposal.client.email}?subject=Re: ${encodeURIComponent(proposal.title)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-violet-700 hover:bg-violet-50 transition-colors shadow-lg"
              >
                Accept &amp; get started →
              </a>
            ) : (
              <div className="text-violet-200 text-sm">
                Contact us to proceed with this proposal.
              </div>
            )}
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Created with{" "}
          <a href="/" className="text-violet-500 hover:underline">
            ScopeProp
          </a>
        </div>
      </div>
    </div>
  );
}

function Chip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function Section({
  sectionKey,
  label,
  content,
  highlight,
}: {
  sectionKey: string;
  label: string;
  content: string;
  highlight?: boolean;
}) {
  const Icon = SECTION_ICONS[sectionKey] ?? FileText;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        highlight
          ? "bg-violet-50 border-violet-100"
          : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`border-b px-6 py-3 flex items-center gap-2.5 ${
          highlight ? "border-violet-100 bg-violet-100/40" : "border-gray-100 bg-gray-50/60"
        }`}
      >
        <Icon
          className={`h-4 w-4 flex-shrink-0 ${highlight ? "text-violet-600" : "text-gray-400"}`}
        />
        <h2
          className={`text-xs font-bold uppercase tracking-wide ${
            highlight ? "text-violet-700" : "text-gray-500"
          }`}
        >
          {label}
        </h2>
      </div>
      <div
        className={`px-6 py-5 text-sm leading-7 whitespace-pre-wrap ${
          highlight ? "text-violet-900" : "text-gray-700"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

function buildSectionMap(proposal: Proposal): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of proposal.sections ?? []) {
    map[s.section_key] = s.section_content;
  }
  return map;
}
