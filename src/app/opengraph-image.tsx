import { ImageResponse } from "next/og";

export const alt = "Percy | Making software fun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// next/og runs at build time on the edge runtime — no CSS, no DOM.
// Colors must be inlined. These mirror the single-mode palette in
// globals.css (--background / --foreground / --muted-foreground).
const BG_HEX = "#171717";
const FG_HEX = "#ededed";
const MUTED_HEX = "#a3a3a3";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "96px",
          background: BG_HEX,
          color: FG_HEX,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: MUTED_HEX,
          }}
        >
          perz.dev
        </div>
        <div
          style={{
            fontSize: 200,
            fontWeight: 700,
            lineHeight: 1,
            marginTop: 24,
            letterSpacing: -6,
          }}
        >
          Percy
        </div>
        <div
          style={{
            fontSize: 44,
            marginTop: 32,
            color: MUTED_HEX,
          }}
        >
          Making software fun
        </div>
      </div>
    ),
    { ...size },
  );
}
