import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization, getProfile } from "@/lib/db/organizations";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { organization, profile } = await getOrCreateOrganization(
    user.id,
    user.email!,
    user.user_metadata?.full_name ?? null
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account and workspace preferences.
        </p>
      </div>

      <SettingsForm profile={profile} organization={organization} />
    </div>
  );
}
