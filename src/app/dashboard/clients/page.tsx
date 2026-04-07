import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { listClientsWithProposalCount } from "@/lib/db/clients";
import { ClientsList } from "./clients-list";

export default async function ClientsPage() {
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

  const clients = await listClientsWithProposalCount(organization.id);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-sm text-gray-500 mt-1">
          {clients.length} client{clients.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ClientsList initialClients={clients} organizationId={organization.id} />
    </div>
  );
}
