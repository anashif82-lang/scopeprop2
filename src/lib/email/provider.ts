import { Resend } from "resend";

// ─── Interface ────────────────────────────────────────────────────────────────

export interface SendProposalInput {
  to: string;
  proposalTitle: string;
  senderName: string;
  publicUrl: string;
  appUrl: string;
}

export interface EmailProvider {
  sendProposal(input: SendProposalInput): Promise<void>;
}

// ─── Resend provider ──────────────────────────────────────────────────────────

class ResendEmailProvider implements EmailProvider {
  private client: Resend;
  private from: string;

  constructor(apiKey: string, from: string) {
    this.client = new Resend(apiKey);
    this.from = from;
  }

  async sendProposal(input: SendProposalInput) {
    const { to, proposalTitle, senderName, publicUrl, appUrl } = input;
    const { error } = await this.client.emails.send({
      from: this.from,
      to,
      subject: `Proposal: ${proposalTitle}`,
      html: buildProposalEmailHtml({ proposalTitle, senderName, publicUrl, appUrl }),
    });
    if (error) throw new Error(error.message);
  }
}

// ─── Stub provider (no API key — logs to console) ─────────────────────────────

class StubEmailProvider implements EmailProvider {
  async sendProposal(input: SendProposalInput) {
    console.log("[email:stub] Would send proposal email:");
    console.log(`  To:      ${input.to}`);
    console.log(`  Subject: Proposal: ${input.proposalTitle}`);
    console.log(`  Link:    ${input.publicUrl}`);
    // Simulate a brief delay so callers behave the same as the real provider
    await new Promise((r) => setTimeout(r, 300));
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createEmailProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const from =
      process.env.RESEND_FROM_EMAIL ?? "ScopeProp <onboarding@resend.dev>";
    return new ResendEmailProvider(apiKey, from);
  }
  return new StubEmailProvider();
}

// ─── Email HTML template ──────────────────────────────────────────────────────

function buildProposalEmailHtml(input: Omit<SendProposalInput, "to">): string {
  const { proposalTitle, senderName, publicUrl, appUrl } = input;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${proposalTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%);padding:28px 40px;">
              <span style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">ScopeProp</span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#7c3aed;text-transform:uppercase;letter-spacing:0.05em;">New Proposal</p>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111827;line-height:1.3;">${escapeHtml(proposalTitle)}</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.65;">
                <strong>${escapeHtml(senderName)}</strong> has sent you a proposal.
                Click the button below to review the full scope, pricing, and timeline.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:10px;background:#7c3aed;">
                    <a href="${publicUrl}"
                       style="display:inline-block;padding:14px 30px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                      View proposal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;word-break:break-all;">
                Or copy this link: <a href="${publicUrl}" style="color:#7c3aed;text-decoration:none;">${publicUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent via <a href="${appUrl}" style="color:#7c3aed;text-decoration:none;">ScopeProp</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
