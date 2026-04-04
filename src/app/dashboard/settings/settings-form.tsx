"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Profile, Organization } from "@/types";

interface SettingsFormProps {
  profile: Profile;
  organization: Organization;
}

export function SettingsForm({ profile, organization }: SettingsFormProps) {
  const { show, ToastComponent } = useToast();
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [orgName, setOrgName] = useState(organization.name);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();

      const [profileResult, orgResult] = await Promise.all([
        supabase
          .from("profiles")
          .update({ full_name: fullName })
          .eq("id", profile.id),
        supabase
          .from("organizations")
          .update({ name: orgName })
          .eq("id", organization.id),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (orgResult.error) throw orgResult.error;

      show("Settings saved", "success");
    } catch {
      show("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {ToastComponent}

      {/* Account */}
      <section className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Account
          </h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
          <Input
            label="Email"
            value={profile.email}
            disabled
            hint="Email cannot be changed here"
          />
        </div>
      </section>

      {/* Workspace */}
      <section className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-3">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Workspace
          </h2>
        </div>
        <div className="px-6 py-5">
          <Input
            label="Workspace name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="My Workspace"
            hint="Shown in proposals and exports"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
