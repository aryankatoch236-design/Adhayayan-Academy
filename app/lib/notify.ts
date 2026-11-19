import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function notifyAdmins(e: { name: string; phone: string; course: string | null; message: string | null }) {
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return;
  const to = new Set((process.env.NOTIFY_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    const { data } = await createClient(url, key, { auth: { persistSession: false } }).from("admin_emails").select("email").eq("notify", true);
    (data || []).forEach((r: { email: string }) => to.add(r.email));
  }
  if (!to.size) return;
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  const digits = e.phone.replace(/\D/g, "");
  const wa = `https://wa.me/${digits.length === 10 ? "91" + digits : digits}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const text = `New enquiry\n\nName: ${e.name}\nPhone: ${e.phone}\nCourse: ${e.course || "-"}\nMessage: ${e.message || "-"}\n\nWhatsApp: ${wa}\nAdmin: ${site}/admin`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:520px"><h2 style="color:#0f5a46;margin:0 0 12px">New enquiry</h2><table style="width:100%;border-collapse:collapse;font-size:15px"><tr><td style="padding:6px 0;color:#667">Name</td><td><b>${esc(e.name)}</b></td></tr><tr><td style="padding:6px 0;color:#667">Phone</td><td><a href="tel:${esc(e.phone)}">${esc(e.phone)}</a></td></tr><tr><td style="padding:6px 0;color:#667">Course</td><td>${esc(e.course || "-")}</td></tr><tr><td style="padding:6px 0;color:#667;vertical-align:top">Message</td><td>${esc(e.message || "-")}</td></tr></table><p style="margin-top:18px"><a href="${wa}" style="background:#1fa855;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold">Reply on WhatsApp</a> <a href="${site}/admin" style="padding:10px 16px;color:#0f5a46">Open admin</a></p></div>`;
  await transport.sendMail({ from: process.env.MAIL_FROM || user, to: [...to], subject: `New enquiry: ${e.name}${e.course ? " · " + e.course : ""}`, text, html });
}
