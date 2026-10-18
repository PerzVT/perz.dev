"use client";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { createPortal } from "react-dom";
import type { ContentOp } from "@/lib/content-ops";
import "./content-editor.css";

type Status = { text: string; error?: boolean };
const listeners = new Set<(status: Status) => void>();
const announce = (status: Status) => listeners.forEach(listener => listener(status));

async function send(body: { ops: ContentOp[] } | { undo: true }) {
  announce({ text: "Saving…" });
  const response = await fetch("/api/dev/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({ error: "The save route did not answer." }));
  announce(response.ok ? { text: result.saved.join(" · ") } : { text: result.error, error: true });
  return response.ok;
}

/** Inline text editor over the clicked element; Ctrl+Enter or leaving saves, Escape cancels. */
function TextEditor({ target, onDone }: { target: HTMLElement; onDone: () => void }) {
  const area = useRef<HTMLTextAreaElement>(null);
  const kind = target.dataset.editKind;
  const original = target.dataset.editValue ?? "";
  const [value, setValue] = useState(original);
  const box = target.getBoundingClientRect();
  useEffect(() => { area.current?.focus(); area.current?.select(); }, []);
  const finish = useCallback(async (save: boolean) => {
    if (save && value !== original) {
      const path = target.dataset.editPath!;
      await send({ ops: [kind === "lines" ? { op: "setLines", path, value: value.split("\n") } : { op: "setText", path, value }] });
    }
    onDone();
  }, [value, original, kind, target, onDone]);
  return <textarea ref={area} className="pf-edit-text" value={value} spellCheck
    style={{ top: box.top + window.scrollY - 6, left: box.left + window.scrollX - 6, width: Math.max(box.width + 12, 280), minHeight: box.height + 12 }}
    onChange={event => setValue(event.target.value)}
    onBlur={() => finish(true)}
    onKeyDown={event => {
      if (event.key === "Escape") { event.preventDefault(); finish(false); }
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); area.current?.blur(); }
    }} />;
}

export function EditorBar() {
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState<Status>({ text: "Edit mode is off" });
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => { listeners.add(setStatus); return () => { listeners.delete(setStatus); }; }, []);
  useEffect(() => {
    document.documentElement.toggleAttribute("data-editing", on);
    if (!on) return;
    const pick = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-edit-path]");
      if (!element) return;
      event.preventDefault(); event.stopPropagation();
      setTarget(element);
    };
    document.addEventListener("click", pick, true);
    return () => document.removeEventListener("click", pick, true);
  }, [on]);
  return <>
    <div className="pf-edit-bar" role="toolbar" aria-label="Content editor">
      <button type="button" aria-pressed={on} onClick={() => setOn(value => !value)}>{on ? "Done editing" : "Edit page"}</button>
      {on && <button type="button" onClick={() => send({ undo: true })}>Undo</button>}
      <span role="status" data-error={status.error || undefined}>{on ? status.text : "Local editor"}</span>
    </div>
    {target && createPortal(<TextEditor key={target.dataset.editPath} target={target} onDone={() => setTarget(null)} />, document.body)}
  </>;
}

type Item = { src: string; alt?: string; video?: string };
const thumb = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`;
const DRAG = "application/x-perz-media";

/** Thumbnails of one media list: drag to reorder or onto another strip to move, × to remove. */
export function MediaStrip({ list, items, label }: { list: string; items: Item[]; label: string }) {
  const [over, setOver] = useState<number | null>(null);
  const drop = (event: DragEvent, index: number) => {
    event.preventDefault(); setOver(null);
    const raw = event.dataTransfer.getData(DRAG);
    if (!raw) return;
    const from = JSON.parse(raw) as { list: string; index: number };
    if (from.list === list) {
      const to = index > from.index ? index - 1 : index;
      if (to !== from.index) send({ ops: [{ op: "move", list, from: from.index, to }] });
    } else send({ ops: [{ op: "transfer", from, to: { list, index } }] });
  };
  const zone = (index: number) => ({
    onDragOver: (event: DragEvent) => { if (event.dataTransfer.types.includes(DRAG)) { event.preventDefault(); setOver(index); } },
    onDragLeave: () => setOver(current => (current === index ? null : current)),
    onDrop: (event: DragEvent) => drop(event, index),
  });
  return <div className="pf-edit-strip" aria-label={`${label}: ${items.length} images`}>
    <span className="pf-edit-strip-label">{label}</span>
    <ol>
      {items.map((item, index) => <li key={`${item.src}-${index}`} draggable data-over={over === index || undefined} {...zone(index)}
        onDragStart={event => { event.dataTransfer.setData(DRAG, JSON.stringify({ list, index })); event.dataTransfer.effectAllowed = "move"; }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- dev-only thumbnails through the optimiser */}
        <img src={thumb(item.src)} alt={item.alt ?? ""} draggable={false} />
        {item.video && <span className="pf-edit-video">video</span>}
        <span className="pf-edit-index">{index + 1}</span>
        <button type="button" aria-label={`Remove image ${index + 1}`} onClick={() => send({ ops: [{ op: "remove", list, index }] })}>×</button>
      </li>)}
      <li className="pf-edit-end" data-over={over === items.length || undefined} {...zone(items.length)}>{items.length ? "Drop at end" : "Drop images here"}</li>
    </ol>
  </div>;
}
