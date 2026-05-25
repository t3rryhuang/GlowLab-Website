import nodemailer from "nodemailer";
import { buildAbandonedCartEmail } from "./abandoned-cart-email.js";

const ABANDONED_CART_TO =
  process.env.ABANDONED_CART_TO || "terry.huang25@imperial.ac.uk";

function createTransport() {
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

export async function sendAbandonedCartEmail({ items, checkoutUrl }) {
  const promoCode = "GLOW10";
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const html = buildAbandonedCartEmail({
    items,
    promoCode,
    expiresAt,
    checkoutUrl,
  });

  const subject = "GlowLab — 10% off your basket (expires in 24 hours)";
  const to = ABANDONED_CART_TO;
  const from =
    process.env.SMTP_FROM || "GlowLab <noreply@glowlab.demo>";

  const transport = createTransport();

  if (!transport) {
    console.log("\n=== GlowLab abandoned cart email (SMTP not configured) ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Promo:", promoCode, "expires:", expiresAt.toISOString());
    console.log("Items:", items.length);
    console.log("Set SMTP_HOST, SMTP_USER, SMTP_PASS in backend/.env to send for real.\n");
    return { ok: true, sent: false, logged: true, promoCode, expiresAt: expiresAt.toISOString() };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    html,
  });

  return { ok: true, sent: true, promoCode, expiresAt: expiresAt.toISOString() };
}
