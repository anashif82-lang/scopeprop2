import { createClient } from "@/lib/supabase/server";
import type { Client, ClientWithCount } from "@/types";

export type { ClientWithCount };

export async function listClients(organizationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("organization_id", organizationId)
    .order("name");

  if (error) throw error;
  return data as Client[];
}

export async function listClientsWithProposalCount(
  organizationId: string
): Promise<ClientWithCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*, proposals(id)")
    .eq("organization_id", organizationId)
    .order("name");

  if (error) throw error;

  return (data ?? []).map((c) => {
    const { proposals, ...client } = c as Client & { proposals: { id: string }[] | null };
    return { ...client, proposal_count: proposals?.length ?? 0 };
  });
}

export async function upsertClient(
  organizationId: string,
  input: { name: string; email?: string; company?: string; phone?: string }
): Promise<Client> {
  const supabase = await createClient();

  // Try to find existing client by email in this org
  if (input.email) {
    const { data: existing } = await supabase
      .from("clients")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("email", input.email)
      .single();

    if (existing) return existing as Client;
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ organization_id: organizationId, ...input })
    .select()
    .single();

  if (error) throw error;
  return data as Client;
}
