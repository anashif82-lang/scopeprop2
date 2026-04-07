"use client";

import { useState } from "react";
import type { Proposal, ProposalSection, ProposalStatus, SectionKey } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn, statusColor, statusLabel } from "@/lib/utils";
import {
  Pencil,
  Check,
  X,
  Copy,
  ExternalLink,
  Send,
  FileOutput,
  Files,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SECTION_LABELS, SECTION_ORDER } from "@/lib/db/proposals";

interface ProposalEditorProps {
  proposal: Proposal;
  appUrl: string;
}

// Contextual transitions per status — only show what makes sense
const STATUS_TRANSITIONS: Record<
  ProposalStatus,
  { status: ProposalStatus; label: string; variant: "default" | "outline" | "ghost"; icon: React.ElementType }[]
> = {
  draft:    [{ status: "sent",     label: "Mark as sent",     variant: "default", icon: Send }],
  sent:     [{ status: "accepted", label: "Mark as accepted", variant: "default", icon: CheckCircle2 },
             { status: "declined", label: "Mark as declined", variant: "outline", icon: XCircle }],
  viewed:   [{ status: "accepted", label: "Mark as accepted", variant: "default", icon: CheckCircle2 },
             { status: "declined", label: "Mark as declined", variant: "outline", icon: XCircle }],
  accepted: [{ status: "declined", label: "Mark as declined", variant: "outline", icon: XCircle },
             { status: "draft",    label: "Reset to draft",   variant: "ghost",   icon: RotateCcw }],
  declined: [{ status: "accepted", label: "Mark as accepted", variant: "default", icon: CheckCircle2 },
             { status: "draft",    label: "Reset to draft",   variant: "ghost",   icon: RotateCcw }],
};

export function ProposalEditor({ proposal, appUrl }: ProposalEditorProps) {
  const router = useRouter();
  const { show, ToastComponent } = useToast();
  const [sections, setSections] = useState<Record<SectionKey, string>>(
    () => buildSectionMap(proposal.sections ?? [])
  );
  const [editing, setEditing] = useState<SectionKey | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  // Track status locally so badge + actions update immediately without a page reload
  const [currentStatus, setCurrentStatus] = useState<ProposalStatus>(proposal.status);
  const [updatingStatus, setUpdatingStatus] = useState<ProposalStatus | null>(null);

  const publicUrl = `${appUrl}/p/${proposal.public_slug}`;

  function startEdit(key: SectionKey) {
    setEditing(key);
    setEditContent(sections[key] ?? "");
  }

  async function saveSection(key: SectionKey) {
    setSaving(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/section`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_key: key, content: editContent }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSections((prev) => ({ ...prev, [key]: editContent }));
      setEditing(null);
      show("Section saved", "success");
    } catch {
      show("Failed to save section", "error");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    setEditing(null);
    setEditContent("");
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
    show("Link copied to clipboard", "success");
  }

  async function copySection(content: string) {
    await navigator.clipboard.writeText(content);
    show("Section copied to clipboard", "success");
  }

  async function duplicateProposal() {
    setDuplicating(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/duplicate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const { proposal: copy } = await res.json();
      router.push(`/dashboard/proposals/${copy.id}`);
    } catch {
      show("Failed to duplicate proposal", "error");
      setDuplicating(false);
    }
  }

  async function updateStatus(newStatus: ProposalStatus) {
    setUpdatingStatus(newStatus);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setCurrentStatus(newStatus);
      show(`Marked as ${statusLabel(newStatus).toLowerCase()}`, "success");
    } catch {
      show("Failed to update status", "error");
    } finally {
      setUpdatingStatus(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {ToastComponent}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{proposal.title}</h1>
            {/* Badge reflects local state — updates immediately on change */}
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                statusColor(currentStatus)
              )}
            >
              {statusLabel(currentStatus)}
            </span>
          </div>
          {proposal.client && (
            <p className="text-sm text-gray-500">
              {proposal.client.name}
              {proposal.client.company ? ` · ${proposal.client.company}` : ""}
            </p>
          )}
        </div>

        {/* Static actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            loading={duplicating}
            onClick={duplicateProposal}
          >
            <Files className="h-3.5 w-3.5" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/p/${proposal.public_slug}?print=1`, "_blank")}
          >
            <FileOutput className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Preview
            </a>
          </Button>
        </div>
      </div>

      {/* Status action bar — contextual buttons for current status */}
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
        <span className="text-xs font-semibold text-gray-400 mr-1">Status:</span>
        {STATUS_TRANSITIONS[currentStatus].map(({ status, label, variant, icon: Icon }) => (
          <Button
            key={status}
            size="sm"
            variant={variant}
            loading={updatingStatus === status}
            disabled={updatingStatus !== null}
            onClick={() => updateStatus(status)}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Share bar */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center gap-4 shadow-sm shadow-violet-200">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 flex-shrink-0">
            <LinkIcon className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-violet-200 mb-0.5">Shareable link</div>
            <div className="text-sm text-white font-mono truncate opacity-90">{publicUrl}</div>
          </div>
        </div>
        <Button
          size="sm"
          onClick={copyLink}
          className="bg-white/15 hover:bg-white/25 text-white border border-white/20 flex-shrink-0 active:scale-[0.97]"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy link
        </Button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTION_ORDER.map((key) => (
          <SectionCard
            key={key}
            sectionKey={key}
            label={SECTION_LABELS[key]}
            content={sections[key] ?? ""}
            isEditing={editing === key}
            editContent={editContent}
            saving={saving}
            onEdit={() => startEdit(key)}
            onSave={() => saveSection(key)}
            onCancel={cancelEdit}
            onEditChange={setEditContent}
            onCopy={() => copySection(sections[key] ?? "")}
          />
        ))}
      </div>
    </div>
  );
}

interface SectionCardProps {
  sectionKey: SectionKey;
  label: string;
  content: string;
  isEditing: boolean;
  editContent: string;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditChange: (val: string) => void;
  onCopy: () => void;
}

function SectionCard({
  label,
  content,
  isEditing,
  editContent,
  saving,
  onEdit,
  onSave,
  onCancel,
  onEditChange,
  onCopy,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50/60 border-b border-gray-100">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
          {label}
        </span>
        {!isEditing && (
          <div className="flex items-center gap-2">
            {content && (
              <button
                onClick={onCopy}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-1.5 py-0.5 rounded hover:bg-gray-100"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            )}
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-600 transition-colors px-1.5 py-0.5 rounded hover:bg-violet-50"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none min-h-[120px] leading-7"
              rows={Math.max(5, editContent.split("\n").length + 2)}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button size="sm" loading={saving} onClick={onSave}>
                <Check className="h-3.5 w-3.5" />
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-800 leading-7 whitespace-pre-wrap">
            {content || <span className="text-gray-400 italic">Empty section</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function buildSectionMap(sections: ProposalSection[]): Record<SectionKey, string> {
  const map = {} as Record<SectionKey, string>;
  for (const s of sections) {
    map[s.section_key] = s.section_content;
  }
  return map;
}
