"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

type Line = { type: "input" | "output" | "error" | "system"; text: string };

const easterEggs: Record<string, string> = {
  whoami: "percy — unity generalist, currently in calgary.",
  "sudo make me a sandwich": "Okay. (you have the power now)",
  "rm -rf /": "nice try.",
  vim: "you are trapped here forever. press ESC... no wait.",
  emacs: "wrong editor, friend.",
  "hello world": "hi there.",
  exit: "you cannot escape. this is the web.",
  ls: "projects/  about.txt",
  cat: "meow. try `cat about.txt`",
  "cat about.txt": "percy ali. game dev. unity. vr. multiplayer. that's it.",
  coffee: "brewing... done.",
  "the cake is a lie": "...indeed.",
};

/**
 * Terminal rendered as a centered spotlight overlay. Opens via:
 *   - backtick (`)
 *   - Cmd/Ctrl+K
 *
 * Closes on Escape (from anywhere in the modal) or click outside.
 *
 * Slug list is passed as a prop from the parent (server component)
 * so it stays synchronized with the filesystem — no hand-maintained
 * parallel array.
 */
export function Terminal({ slugs = [] as string[] }: { slugs?: string[] }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<Line[]>([
    { type: "system", text: "iykyk" },
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Keyboard triggers — promote Escape to the global listener so it
  // closes the dialog regardless of which child has focus (X button,
  // outside-click area, etc.). Open is gated inside the handler.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typingInField =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;

      // Cmd/Ctrl + K anywhere.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // Backtick — but only when not typing somewhere else.
      if (!typingInField && e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      // Escape closes when open, regardless of focus.
      if (e.key === "Escape") {
        setOpen((o) => (o ? false : o));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, open]);

  const print = (lines: Line[]) => setHistory((h) => [...h, ...lines]);

  const execute = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setCmdHistory((h) => [...h, cmd]);
    setCmdIndex(-1);
    print([{ type: "input", text: `$ ${cmd}` }]);

    const [base, ...rest] = cmd.split(" ");
    const arg = rest.join(" ");
    const lower = cmd.toLowerCase();

    if (lower === "help") {
      // Intentionally silent — keep it clean. iykyk.
    } else if (lower === "clear") {
      setHistory([]);
    } else if (lower === "projects") {
      if (slugs.length === 0) {
        print([{ type: "error", text: "no projects loaded." }]);
      } else {
        print([{ type: "output", text: slugs.map((s) => `  • ${s}`).join("\n") }]);
      }
    } else if (base === "goto") {
      if (!arg) print([{ type: "error", text: "usage: goto <slug>" }]);
      else if (slugs.includes(arg)) {
        print([{ type: "output", text: `opening /projects/${arg}...` }]);
        router.push(`/projects/${arg}`);
        setOpen(false);
      } else {
        print([{ type: "error", text: `unknown project: ${arg}` }]);
      }
    } else if (lower === "exit") {
      setOpen(false);
    } else if (lower === "date") {
      print([{ type: "output", text: new Date().toString() }]);
    } else if (easterEggs[lower]) {
      print([{ type: "output", text: easterEggs[lower] }]);
    } else {
      print([{ type: "error", text: `command not found: ${base}` }]);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      execute(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = cmdIndex < 0 ? cmdHistory.length - 1 : Math.max(0, cmdIndex - 1);
      setCmdIndex(next);
      setValue(cmdHistory[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndex < 0) return;
      const next = cmdIndex + 1;
      if (next >= cmdHistory.length) { setCmdIndex(-1); setValue(""); }
      else { setCmdIndex(next); setValue(cmdHistory[next]); }
    }
    // Escape handled at the window level — see useEffect above.
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-background/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        className="mt-[18vh] w-[min(640px,92vw)] overflow-hidden rounded-xl border border-border bg-popover"
        role="dialog"
        aria-modal="true"
        aria-label="terminal"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="font-display text-sm text-muted-foreground">$</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder=""
            aria-label="terminal command"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="close"
            data-sfx="click"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Output log */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="max-h-[40vh] overflow-y-auto px-4 py-3 text-xs leading-relaxed"
        >
          {history.map((line, i) => (
            <div
              key={i}
              className={[
                "whitespace-pre-wrap",
                line.type === "input"
                  ? "text-foreground"
                  : line.type === "error"
                    ? "text-destructive"
                    : "text-muted-foreground",
              ].join(" ")}
            >
              {line.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
