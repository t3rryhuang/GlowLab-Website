function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoney(amount) {
  return "£" + Number(amount).toFixed(2).replace(/\.00$/, "");
}

function formatExpiry(date) {
  return date.toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Europe/London",
  });
}

export function buildAbandonedCartEmail({ items, promoCode, expiresAt, checkoutUrl }) {
  const subtotal = items.reduce(function (sum, item) {
    return sum + item.price * (item.qty || 1);
  }, 0);
  const discount = subtotal * 0.1;
  const total = subtotal - discount;
  const expiryLabel = formatExpiry(expiresAt);
  const siteUrl = checkoutUrl || "http://localhost:3000/checkout.html";

  const rows = items
    .map(function (item) {
      return (
        "<tr>" +
        '<td style="padding:14px 0;border-bottom:1px solid #ece8e1;">' +
        '<div style="font-size:14px;font-weight:600;color:#1a1a2e;">' +
        escapeHtml(item.name) +
        "</div>" +
        '<div style="font-size:12px;color:#6b6b80;margin-top:4px;">' +
        escapeHtml(item.kind === "bundle" ? "Bundle" : "Product") +
        (item.qty > 1 ? " · Qty " + item.qty : "") +
        "</div></td>" +
        '<td style="padding:14px 0;border-bottom:1px solid #ece8e1;text-align:right;font-size:14px;font-weight:600;color:#6d4fc2;">' +
        formatMoney(item.price * (item.qty || 1)) +
        "</td></tr>"
      );
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your GlowLab basket is waiting</title>
</head>
<body style="margin:0;padding:0;background:#f4efe9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e9e5de;box-shadow:0 20px 60px rgba(26,26,46,0.08);">
          <tr>
            <td style="padding:36px 36px 28px;background:linear-gradient(135deg,#ebe3fb 0%,#ffffff 55%);text-align:center;">
              <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#6d4fc2;font-family:Helvetica,Arial,sans-serif;font-weight:700;">GlowLab</div>
              <h1 style="margin:14px 0 8px;font-size:34px;line-height:1.1;font-weight:400;color:#1a1a2e;font-style:italic;">You left something glowing behind</h1>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#4a4a5e;font-family:Helvetica,Arial,sans-serif;">Complete your ritual in the next 24 hours and enjoy <strong style="color:#6d4fc2;">10% off</strong> your order.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 36px 8px;text-align:center;">
              <div style="display:inline-block;padding:18px 28px;border-radius:18px;background:#faf8ff;border:2px dashed #9f7aea;">
                <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b6b80;font-family:Helvetica,Arial,sans-serif;">Your code</div>
                <div style="font-size:28px;font-weight:700;letter-spacing:0.08em;color:#6d4fc2;font-family:Helvetica,Arial,sans-serif;margin-top:6px;">${escapeHtml(promoCode)}</div>
              </div>
              <p style="margin:18px 0 0;font-size:13px;color:#8a8a99;font-family:Helvetica,Arial,sans-serif;">Expires <strong style="color:#1a1a2e;">${escapeHtml(expiryLabel)}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 36px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-family:Helvetica,Arial,sans-serif;">
                ${rows}
                <tr>
                  <td style="padding:16px 0 6px;font-size:14px;color:#4a4a5e;">Subtotal</td>
                  <td style="padding:16px 0 6px;text-align:right;font-size:14px;color:#4a4a5e;">${formatMoney(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 6px;font-size:14px;color:#6d4fc2;">10% off with ${escapeHtml(promoCode)}</td>
                  <td style="padding:0 0 6px;text-align:right;font-size:14px;color:#6d4fc2;">−${formatMoney(discount)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#1a1a2e;">Total after discount</td>
                  <td style="padding:10px 0 0;text-align:right;font-size:18px;font-weight:700;color:#6d4fc2;">${formatMoney(total)}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 36px;text-align:center;">
              <a href="${escapeHtml(siteUrl)}" style="display:inline-block;padding:16px 28px;border-radius:999px;background:#6d4fc2;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;font-family:Helvetica,Arial,sans-serif;">Return to checkout</a>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#8a8a99;font-family:Helvetica,Arial,sans-serif;">Demo email · Imperial College London GlowLab project</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
