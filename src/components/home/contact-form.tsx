"use client";

import { useState } from "react";
import { sendContact } from "@/app/actions/contact";
import { Button } from "@/components/site/button";

/**
 * Contact form — client validation (name / email / message), a honeypot,
 * an aria-live status line, and a success state with reset. Submits to the
 * sendContact server action (real email when configured, mocked success on
 * staging). Field errors are announced via aria-invalid + aria-describedby.
 */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Errors = { name?: string; email?: string; message?: string };

const fieldBase =
  "pz-field rounded-lg border bg-pz-field px-[13px] py-[11px] text-sm text-pz-ink outline-none transition-colors focus:border-pz-accent";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Add your name.";
    if (!EMAIL_RE.test(email.trim()))
      next.email = "That email doesn't look right.";
    if (message.trim().length < 5)
      next.message = "A sentence or two helps me reply well.";

    if (Object.keys(next).length) {
      setErrors(next);
      setStatus("Fix the fields above.");
      return;
    }

    setErrors({});
    setStatus("");
    setSending(true);
    const res = await sendContact({ name, email, message, company });
    setSending(false);
    if (res.ok) setSent(true);
    else setStatus(res.error ?? "Something went wrong.");
  }

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setCompany("");
    setErrors({});
    setStatus("");
    setSent(false);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="flex flex-col gap-2.5 rounded-xl border border-pz-border p-7"
      >
        <div className="text-[22px] font-bold tracking-[-0.018em] text-pz-ink">
          Message sent.
        </div>
        <p className="text-sm leading-[1.65] text-pz-ink2">
          Thanks, expect a reply soon.
        </p>
        <Button
          onClick={reset}
          variant="secondary"
          className="mt-1.5 self-start border border-pz-border2"
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-semibold text-pz-ink2">Name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "err-name" : undefined}
          className={`${fieldBase} ${errors.name ? "border-pz-danger" : "border-pz-border2"}`}
        />
        {errors.name && (
          <span id="err-name" className="text-xs text-pz-danger">
            {errors.name}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-semibold text-pz-ink2">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          className={`${fieldBase} ${errors.email ? "border-pz-danger" : "border-pz-border2"}`}
        />
        {errors.email && (
          <span id="err-email" className="text-xs text-pz-danger">
            {errors.email}
          </span>
        )}
      </label>

      <label className="flex flex-col gap-[7px]">
        <span className="text-[13px] font-semibold text-pz-ink2">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="The team, the problem, the timeline…"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`${fieldBase} min-h-[120px] resize-y leading-[1.6] ${errors.message ? "border-pz-danger" : "border-pz-border2"}`}
        />
        {errors.message && (
          <span id="err-message" className="text-xs text-pz-danger">
            {errors.message}
          </span>
        )}
      </label>

      {/* Honeypot — visually hidden, off the tab order. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />

      <div className="flex flex-wrap items-center gap-3.5">
        <Button
          type="submit"
          size="lg"
          disabled={sending}
          data-sfx="toggle"
          className="disabled:opacity-70"
        >
          {sending ? "Sending…" : "Send message"}
        </Button>
        <span
          aria-live="polite"
          className={`text-[12.5px] ${Object.keys(errors).length ? "text-pz-danger" : "text-pz-faint"}`}
        >
          {status}
        </span>
      </div>
    </form>
  );
}
