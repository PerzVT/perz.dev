/**
 * Home "Recommendations" — three skeleton cards. Quotes are owner-supplied
 * copy, so these stay as placeholders (never invented). Swap each card's
 * bars for a blockquote + attribution when the owner provides them.
 */

const CARDS = [
  { body: ["96%", "88%", "56%"], name: "120px", role: "170px" },
  { body: ["92%", "97%", "44%"], name: "110px", role: "150px" },
  { body: ["94%", "84%", "62%"], name: "130px", role: "160px" },
];

export function Recommendations() {
  return (
    <section
      id="recommendations"
      className="mx-auto max-w-[1160px] px-[clamp(20px,4vw,32px)] pt-[clamp(56px,8vh,88px)]"
    >
      <div className="flex items-baseline gap-3.5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pz-ink">
          Recommendations
        </h2>
        <span className="text-[12.5px] text-pz-faint">
          quotes land here — owner supplies
        </span>
      </div>
      <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-4">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className="flex min-h-[170px] flex-col gap-2 rounded-xl border border-pz-border p-6"
          >
            {card.body.map((w, j) => (
              <span
                key={j}
                className="pz-skeleton h-2.5"
                style={{ width: w, animationDelay: `${j * 0.15}s` }}
              />
            ))}
            <div className="mt-auto flex flex-col gap-1.5 pt-4">
              <span
                className="pz-skeleton h-2.5"
                style={{ width: card.name, animationDelay: "0.1s" }}
              />
              <span
                className="pz-skeleton h-[9px]"
                style={{ width: card.role, animationDelay: "0.25s" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
