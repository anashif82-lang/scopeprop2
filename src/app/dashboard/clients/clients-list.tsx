"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { ClientWithCount } from "@/lib/db/clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Users, Search, Plus, Pencil, X, Check, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ClientsListProps {
  initialClients: ClientWithCount[];
  organizationId: string;
}

const EMPTY_FORM = { name: "", email: "", company: "", phone: "" };

export function ClientsList({ initialClients, organizationId }: ClientsListProps) {
  const { show, ToastComponent } = useToast();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ClientWithCount | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return clients;
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEdit(client: ClientWithCount) {
    setEditing(client);
    setForm({
      name: client.name,
      email: client.email ?? "",
      company: client.company ?? "",
      phone: client.phone ?? "",
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);

    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim() || null,
      company: form.company.trim() || null,
      phone: form.phone.trim() || null,
    };

    try {
      if (editing) {
        const { data, error } = await supabase
          .from("clients")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single();

        if (error) throw error;
        setClients((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? { ...data, proposal_count: editing.proposal_count }
              : c
          )
        );
        show("Client updated", "success");
      } else {
        const { data, error } = await supabase
          .from("clients")
          .insert({ organization_id: organizationId, ...payload })
          .select()
          .single();

        if (error) throw error;
        setClients((prev) =>
          [...prev, { ...data, proposal_count: 0 }].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
        show("Client added", "success");
      }
      closeForm();
    } catch {
      show("Failed to save client", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {ToastComponent}

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 hover:border-gray-300 transition-colors"
          />
        </div>
        <div className="ml-auto">
          {formOpen ? (
            <Button variant="outline" size="sm" onClick={closeForm}>
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
          ) : (
            <Button size="sm" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" />
              Add client
            </Button>
          )}
        </div>
      </div>

      {/* Inline add/edit form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-xl border border-violet-100 bg-violet-50/40 p-5 step-in"
        >
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            {editing ? "Edit client" : "New client"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name *"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              autoFocus
            />
            <Input
              label="Email"
              type="email"
              placeholder="jane@acmecorp.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
            <Input
              label="Company"
              placeholder="Acme Corp"
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="+1 555 000 0000"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button type="submit" size="sm" loading={saving}>
              <Check className="h-3.5 w-3.5" />
              {editing ? "Save changes" : "Add client"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-100 bg-white py-20 text-center">
          <div className="relative mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Users className="h-7 w-7 text-gray-400" />
            </div>
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">No clients yet</p>
          <p className="text-sm text-gray-500 mb-5 max-w-xs">
            Clients are created automatically when you generate proposals, or add them manually.
          </p>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" />
            Add first client
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-16 text-center">
          <Search className="h-8 w-8 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No clients match &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Company
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Proposals
                </th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Added
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="group hover:bg-violet-50/30 transition-colors"
                >
                  <td className="px-5 py-3.5 font-semibold text-gray-900">
                    {client.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {client.company ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    {client.email ? (
                      <a
                        href={`mailto:${client.email}`}
                        className="hover:text-violet-600 transition-colors"
                      >
                        {client.email}
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {client.proposal_count > 0 ? (
                      <Link
                        href={`/proposals?client=${client.id}`}
                        className="inline-flex items-center gap-1.5 text-violet-600 hover:text-violet-700 font-medium"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {client.proposal_count}
                      </Link>
                    ) : (
                      <span className="text-gray-300">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => openEdit(client)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 transition-all px-2 py-1 rounded hover:bg-violet-50"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
