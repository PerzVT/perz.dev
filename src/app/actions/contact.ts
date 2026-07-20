"use server";

import { siteConfig } from "@/lib/config";

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  /** Honeypot — bots fill this hidden field; humans never do. */
  company?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Contact submission handler. Validates server-side, then:
 *  - If a bot filled the honeypot, silently reports success (sends nothing).
 *  - If RESEND_API_KEY is set, emails via the Resend REST API (no SDK
 *    dependency). Configure CONTACT_TO / CONTACT_FROM in env; `from` must
 *    be a Resend-verified sender.
 *  - Otherwise (staging default) logs and returns a mocked success, so the
 *    form is fully exercisable before an email provider is wired.
 */
export async function sendContact(data: ContactInput): Promise<ContactResult> {
  if (data.company && data.company.trim()) return { ok: true };

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return { ok: false, error: "Please fill in every field." };
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(
      `[contact] (mock send — no RESEND_API_KEY) ${name} <${email}>: ${message.slice(0, 160)}`,
    );
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "perz.dev <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO ?? siteConfig.email],
        reply_to: email,
        subject: `Portfolio contact — ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: "Couldn't send just now — email me directly?" };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't send just now — email me directly?" };
  }
}
