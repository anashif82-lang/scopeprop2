import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateOrganization } from "@/lib/db/organizations";
import { updateProposalStatus, recordProposalEvent } from "@/lib/db/proposals";
import type { EventType, Proposal } from "@/types";

// Map proposal status → event type (draft has no dedicated event; use "updated")
const STATUS_EVENT: Record<Proposal["status"], EventType> = {
  draft:    "updated",
  sent:     "shared",
  viewed:   "viewed",
  accepted: "accepted",
  declined: "declined",
};

export async function PATCH(
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
    const { status } = await request.json();

    const validStatuses: Proposal["status"][] = [
      "draft", "sent", "viewed", "accepted", "declined",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { organization } = await getOrCreateOrganization(
      user.id,
      user.email!,
      user.user_metadata?.full_name ?? null
    );

    await updateProposalStatus(id, status, organization.id);
    await recordProposalEvent(id, STATUS_EVENT[status as Proposal["status"]], {
      updated_by: user.id,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[status-update]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
