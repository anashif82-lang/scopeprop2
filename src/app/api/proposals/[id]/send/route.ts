import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { getProposal, updateProposalStatus, recordProposalEvent } from "@/lib/db/proposals";
import { createEmailProvider } from "@/lib/email/provider";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const recipientEmail: string | undefined = body.to?.trim();

    if (!recipientEmail || !recipientEmail.includes("@")) {
      return NextResponse.json({ error: "Valid recipient email required" }, { status: 400 });
    }

    const { organization, profile } = await getOrCreateOrganization(
      user.id,
      user.email!,
      user.user_metadata?.full_name ?? null
    );

    // Fetch proposal — enforces org ownership, includes client relation
    const proposal = await getProposal(id, organization.id);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const publicUrl = `${appUrl}/p/${proposal.public_slug}`;
    const senderName = profile.full_name || user.email!;

    // Send email via provider (Resend if key present, stub otherwise)
    const emailProvider = createEmailProvider();
    await emailProvider.sendProposal({
      to: recipientEmail,
      proposalTitle: proposal.title,
      senderName,
      publicUrl,
      appUrl,
    });

    // Advance status to "sent" unless already further along
    const advanceStatuses = new Set(["draft", "sent"]);
    if (advanceStatuses.has(proposal.status)) {
      await updateProposalStatus(id, "sent", organization.id);
    }

    // Record "shared" event with recipient metadata
    await recordProposalEvent(id, "shared", {
      sent_to: recipientEmail,
      sent_by: user.id,
      provider: process.env.RESEND_API_KEY ? "resend" : "stub",
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("[send-proposal]", err);
    const message = err instanceof Error ? err.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
