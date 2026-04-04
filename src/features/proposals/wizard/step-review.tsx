"use client";

import type { ProposalFormData } from "@/types";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, Sparkles } from "lucide-react";

interface StepReviewProps {
  data: Partial<ProposalFormData>;
  onGenerate: () => void;
  onBack: () => void;
  loading: boolean;
}

export function StepReview({ data, onGenerate, onBack, loading }: StepReviewProps) {
  const sections = [
    {
      title: "Client",
      rows: [
        ["Name", data.client_name],
        ["Email", data.client_email || "—"],
        ["Company", data.client_company || "—"],
      ],
    },
    {
      title: "Project",
      rows: [
        ["Type", data.project_type],
        ["Description", data.project_description],
        ["Goals", data.goals],
      ],
    },
    {
      title: "Scope",
      rows: [
        ["Deliverables", data.deliverables],
        ["Out of scope", data.out_of_scope || "—"],
        ["Revisions", data.revisions || "—"],
      ],
    },
    {
      title: "Pricing",
      rows: [
        ["Model", data.pricing_model],
        [
          "Amount",
          data.pricing_model === "hourly"
            ? `${data.hourly_rate} ${data.currency}/hr`
            : `${data.currency} ${data.price_amount}`,
        ],
        ["Timeline", data.timeline],
      ],
    },
    {
      title: "Style",
      rows: [
        ["Tone", data.tone],
        ["Prepared by", `${data.your_name}${data.your_company ? `, ${data.your_company}` : ""}`],
      ],
    },
  ];

  // Quality indicator: count filled fields
  const filledCount = [
    data.client_name,
    data.project_type,
    data.project_description,
    data.goals,
    data.deliverables,
    data.timeline,
    data.your_name,
  ].filter(Boolean).length;

  const qualityLabel =
    filledCount >= 6
      ? { text: "Your inputs look great — expect a detailed, high-quality proposal", color: "text-green-700", bg: "bg-green-50 border-green-100" }
      : filledCount >= 4
      ? { text: "Good inputs. Adding more detail will improve the output.", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" }
      : { text: "Add more detail to get a better proposal.", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-0.5">Review & generate</h2>
          <p className="text-sm text-gray-500">
            Confirm your inputs, then let AI write the full proposal.
          </p>
        </div>
      </div>

      {/* Quality banner */}
      <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 ${qualityLabel.bg}`}>
        <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${qualityLabel.color}`} />
        <span className={`text-sm font-medium ${qualityLabel.color}`}>{qualityLabel.text}</span>
      </div>

      <div className="space-y-3">
        {sections.map(({ title, rows }) => (
          <div key={title} className="rounded-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              {title}
            </div>
            <div className="divide-y divide-gray-50">
              {rows.map(([label, value]) => (
                <div key={label} className="flex gap-4 px-4 py-2.5 text-sm">
                  <span className="w-32 flex-shrink-0 text-gray-500">{label}</span>
                  <span className="text-gray-900 whitespace-pre-wrap break-words flex-1">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 px-5 py-5 flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="animate-spin h-8 w-8 rounded-full border-2 border-violet-200 border-t-violet-600" />
            <Zap className="absolute inset-0 m-auto h-3.5 w-3.5 text-violet-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-violet-900">Generating your proposal…</div>
            <div className="text-xs text-violet-600 mt-0.5">
              AI is writing your scope, timeline, pricing, and terms
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          ← Back
        </Button>
        <Button onClick={onGenerate} loading={loading} size="lg">
          <Zap className="h-4 w-4" />
          Generate proposal
        </Button>
      </div>
    </div>
  );
}
