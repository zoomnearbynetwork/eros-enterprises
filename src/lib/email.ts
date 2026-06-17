import "server-only";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Eros Enterprises <notifications@erosenterprises.in>";
const ADMIN_EMAIL = "info@erosenterprises.in";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://erosenterprises.in";

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

async function sendEmail(opts: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Resend error:", res.status, body);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[email] Failed to send:", err);
    return false;
  }
}

function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:#f4f7fb; color:#1a1a2e; }
  .wrap { max-width:580px; margin:28px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
  .hdr { background:linear-gradient(135deg,#0C1E42,#1565C0); padding:24px 28px; }
  .hdr h1 { margin:0; color:#fff; font-size:18px; font-weight:700; }
  .hdr p { margin:4px 0 0; color:rgba(255,255,255,0.65); font-size:12px; }
  .body { padding:24px 28px; }
  .kv { margin-bottom:8px; }
  .kv .k { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#6b7280; margin-bottom:2px; }
  .kv .v { font-size:13px; color:#111827; font-weight:500; }
  .divider { height:1px; background:#f0f0f0; margin:18px 0; }
  .badge { display:inline-block; background:#EBF2FF; color:#1565C0; font-size:10px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:.04em; }
  .btn { display:inline-block; background:#1565C0; color:#fff !important; text-decoration:none; padding:11px 24px; border-radius:8px; font-size:13px; font-weight:600; margin-top:16px; }
  .footer { background:#f8f9fb; padding:16px 28px; text-align:center; font-size:10px; color:#9ca3af; border-top:1px solid #f0f0f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>💡 Eros Enterprises</h1>
    <p>Lighting with Purpose · Mumbai</p>
  </div>
  <div class="body">${content}</div>
  <div class="footer">© ${new Date().getFullYear()} Eros Enterprises · Mumbai, Maharashtra · <a href="${SITE_URL}" style="color:#1565C0">erosenterprises.in</a></div>
</div>
</body>
</html>`;
}

// ── Lead Alert to Admin ─────────────────────────────────────────
type LeadAlertData = {
  leadNumber: string;
  name: string;
  phone: string;
  email?: string | null;
  serviceInterest?: string | null;
  location?: string | null;
  budgetRange?: string | null;
  message?: string | null;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

export async function sendLeadAlert(data: LeadAlertData): Promise<void> {
  const dashboardUrl = `${SITE_URL}/dashboard/leads`;
  const waUrl = `https://wa.me/${data.phone?.replace(/\D/g, "")}`;

  const content = `
<p style="font-size:14px;font-weight:600;margin:0 0 16px">🔔 New lead received</p>
<div class="kv"><div class="k">Lead Number</div><div class="v"><span class="badge">${data.leadNumber}</span></div></div>
<div class="kv"><div class="k">Name</div><div class="v">${data.name}</div></div>
<div class="kv"><div class="k">Phone</div><div class="v"><a href="tel:${data.phone}" style="color:#1565C0">${data.phone}</a> &nbsp;·&nbsp; <a href="${waUrl}" style="color:#25D366">💬 WhatsApp</a></div></div>
${data.email ? `<div class="kv"><div class="k">Email</div><div class="v"><a href="mailto:${data.email}" style="color:#1565C0">${data.email}</a></div></div>` : ""}
<div class="divider"></div>
${data.serviceInterest ? `<div class="kv"><div class="k">Service Interest</div><div class="v">${data.serviceInterest}</div></div>` : ""}
${data.location ? `<div class="kv"><div class="k">Location</div><div class="v">${data.location}</div></div>` : ""}
${data.budgetRange ? `<div class="kv"><div class="k">Budget Range</div><div class="v">${data.budgetRange}</div></div>` : ""}
${data.message ? `<div class="kv"><div class="k">Message</div><div class="v" style="white-space:pre-wrap">${data.message}</div></div>` : ""}
<div class="divider"></div>
<div class="kv"><div class="k">Source Page</div><div class="v">${data.sourcePage ?? "/"}</div></div>
${data.utmSource ? `<div class="kv"><div class="k">UTM</div><div class="v">${data.utmSource}${data.utmMedium ? ` / ${data.utmMedium}` : ""}${data.utmCampaign ? ` / ${data.utmCampaign}` : ""}</div></div>` : ""}
<a href="${dashboardUrl}" class="btn">View in CRM Dashboard →</a>
`;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔔 New Lead: ${data.name} — ${data.serviceInterest ?? "General Enquiry"}`,
    html: baseTemplate(content),
    replyTo: data.email ?? undefined,
  });
}

// ── Quotation sent to client ────────────────────────────────────
type QuotationEmailData = {
  clientName: string;
  clientEmail: string;
  quotationNumber: string;
  totalAmount: string;
  validUntil?: string;
  pdfUrl: string;
};

export async function sendQuotationEmail(data: QuotationEmailData): Promise<void> {
  const content = `
<p style="font-size:14px;margin:0 0 16px">Dear ${data.clientName},</p>
<p style="font-size:13px;color:#374151;margin:0 0 16px">Thank you for your interest in Eros Enterprises. Please find your quotation details below.</p>
<div class="kv"><div class="k">Quotation Number</div><div class="v"><span class="badge">${data.quotationNumber}</span></div></div>
<div class="kv"><div class="k">Total Amount</div><div class="v" style="font-size:18px;font-weight:800;color:#1565C0">${data.totalAmount}</div></div>
${data.validUntil ? `<div class="kv"><div class="k">Valid Until</div><div class="v">${data.validUntil}</div></div>` : ""}
<div class="divider"></div>
<p style="font-size:12px;color:#6b7280;margin:0 0 8px">Your quotation PDF is attached. To accept this quotation or ask any questions, please reply to this email or contact us directly.</p>
<a href="${data.pdfUrl}" class="btn">Download PDF Quotation</a>
<p style="font-size:11px;color:#9ca3af;margin:16px 0 0">📞 ${ADMIN_EMAIL} &nbsp;·&nbsp; ${"+91 99201 11774"}</p>
`;

  await sendEmail({
    to: data.clientEmail,
    subject: `Your Quotation ${data.quotationNumber} from Eros Enterprises`,
    html: baseTemplate(content),
    replyTo: ADMIN_EMAIL,
  });
}

// ── Invoice sent to client ──────────────────────────────────────
type InvoiceEmailData = {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  totalAmount: string;
  dueDate?: string;
  pdfUrl: string;
  paymentLink?: string;
};

export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<void> {
  const content = `
<p style="font-size:14px;margin:0 0 16px">Dear ${data.clientName},</p>
<p style="font-size:13px;color:#374151;margin:0 0 16px">Please find your invoice from Eros Enterprises below.</p>
<div class="kv"><div class="k">Invoice Number</div><div class="v"><span class="badge">${data.invoiceNumber}</span></div></div>
<div class="kv"><div class="k">Amount Due</div><div class="v" style="font-size:18px;font-weight:800;color:#1565C0">${data.totalAmount}</div></div>
${data.dueDate ? `<div class="kv"><div class="k">Due Date</div><div class="v">${data.dueDate}</div></div>` : ""}
<div class="divider"></div>
${data.paymentLink ? `<a href="${data.paymentLink}" class="btn" style="background:#25D366">💳 Pay Online Now</a>&nbsp;` : ""}
<a href="${data.pdfUrl}" class="btn" style="background:#0C1E42">📄 Download Invoice PDF</a>
<p style="font-size:11px;color:#9ca3af;margin:16px 0 0">For queries, reply to this email or call ${"+91 99201 11774"}.</p>
`;

  await sendEmail({
    to: data.clientEmail,
    subject: `Invoice ${data.invoiceNumber} — Eros Enterprises`,
    html: baseTemplate(content),
    replyTo: ADMIN_EMAIL,
  });
}

// ── Payment receipt ─────────────────────────────────────────────
type PaymentReceiptData = {
  clientName: string;
  clientEmail: string;
  invoiceNumber: string;
  amountPaid: string;
  paymentDate: string;
  paymentId?: string;
};

export async function sendPaymentReceipt(data: PaymentReceiptData): Promise<void> {
  const content = `
<p style="font-size:14px;margin:0 0 16px">Dear ${data.clientName},</p>
<p style="font-size:13px;color:#374151;margin:0 0 16px">✅ Payment received. Thank you!</p>
<div class="kv"><div class="k">Invoice</div><div class="v"><span class="badge">${data.invoiceNumber}</span></div></div>
<div class="kv"><div class="k">Amount Paid</div><div class="v" style="font-size:18px;font-weight:800;color:#25D366">${data.amountPaid}</div></div>
<div class="kv"><div class="k">Date</div><div class="v">${data.paymentDate}</div></div>
${data.paymentId ? `<div class="kv"><div class="k">Transaction ID</div><div class="v" style="font-family:monospace;font-size:11px">${data.paymentId}</div></div>` : ""}
<div class="divider"></div>
<p style="font-size:12px;color:#6b7280;margin:0">Thank you for choosing Eros Enterprises. We look forward to completing your project.</p>
`;

  await sendEmail({
    to: data.clientEmail,
    subject: `Payment Received — ${data.invoiceNumber} | Eros Enterprises`,
    html: baseTemplate(content),
    replyTo: ADMIN_EMAIL,
  });
}
