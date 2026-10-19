"use client";
import { useEffect, useRef, useState } from "react";
import "./access-gate.css";

/** One real input under a row of boxes, so typing, paste and one-time-code autofill all work. */
export function AccessGate({ length }: { length: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "error">("idle");
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  // Refocus once the input is enabled again after a failed check.
  useEffect(() => { if (state === "error") input.current?.focus(); }, [state]);

  async function submit(value: string) {
    setState("checking");
    setError("");
    const response = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: value }) }).catch(() => null);
    const result = await response?.json().catch(() => null);
    if (response?.ok && result?.ok) { window.location.reload(); return; }
    setState("error");
    setError(result?.error || "Couldn't check the code. Try again.");
    setCode("");
  }

  function change(raw: string) {
    const next = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, length);
    setCode(next);
    if (state === "error") setState("idle");
    if (next.length === length) void submit(next);
  }

  const active = Math.min(code.length, length - 1);
  return <form className="pf-access-form" onSubmit={event => { event.preventDefault(); if (code.length === length) void submit(code); }}>
    <label className="pf-access-label" htmlFor="access-code">Access code</label>
    <div className="pf-otp" data-state={state} onClick={() => input.current?.focus()}>
      <input ref={input} id="access-code" className="pf-otp-input" value={code} onChange={event => change(event.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        inputMode="text" autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} maxLength={length}
        aria-invalid={state === "error" || undefined} aria-describedby={error ? "access-error" : undefined} disabled={state === "checking"} autoFocus />
      {Array.from({ length }, (_, i) => <span key={i} className="pf-otp-box" aria-hidden="true" data-filled={!!code[i] || undefined} data-active={(focused && i === active && state !== "checking") || undefined}>{code[i] ?? ""}</span>)}
    </div>
    <p id="access-error" className="pf-access-error" role="status">{state === "checking" ? "Checking…" : error}</p>
  </form>;
}
