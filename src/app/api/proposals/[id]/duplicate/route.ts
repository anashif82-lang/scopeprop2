import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { getProposal, createProposal, saveProposalSections, recordProposalEvent, SECTION_ORDER } from "@/lib/db/proposals";
import type { SectionKey } from "@/types";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { organization } = await getOrCreateOrganization(
      user.id,
      user.email!,
      user.user_metadata?.full_name ?? null
    );

    // Fetch source proposal (enforces org ownership)
    const source = await getProposal(id, organization.id);

    // Create new proposal with "Copy of" title
    const duplicate = await createProposal(organization.id, {
      title: `Copy of ${source.title}`,
      client_id: source.client_id ?? null,
      project_type: source.project_type ?? "",
      project_description: source.project_description ?? "",
      pricing_model: source.pricing_model ?? "fixed",
      currency: source.currency ?? "USD",
      total_amount: source.total_amount ?? null,
      hourly_rate: source.hourly_rate ?? null,
      timeline: source.timeline ?? null,
      tone: source.tone ?? "professional",
    });

    // Copy sections
    const sections = SECTION_ORDER.reduce((acc, key) => {
      const match = source.sections?.find((s) => s.section_key === key);
      acc[key] = match?.section_content ?? "";
      return acc;
    }, {} as Record<SectionKey, string>);

    await saveProposalSections(duplicate.id, sections);

    await recordProposalEvent(duplicate.id, "created", {
      duplicated_from: id,
      user_id: user.id,
    });

    return NextResponse.json({ proposal: duplicate }, { status: 201 });
  } catch (err: unknown) {
    console.error("[duplicate]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
