import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Percy ✦ Making software fun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card. Pure illustration — no text overlay. Title and
 * description text are supplied by the Twitter/OG meta tags and
 * rendered by the platform (Twitter, Discord, iMessage, etc) next to
 * the image, so duplicating the title in the card just steals visual
 * real estate from the art.
 *
 * The source `cover-art.png` is 1218×648 (≈1.88:1). next/og scales it
 * to the spec 1200×630 (1.91:1) with object-fit: cover, which crops a
 * few pixels off the long edges. Keep the perz wordmark inside a safe
 * margin on the source PNG so it doesn't get clipped.
 */
export default async function Image() {
  const cover = await readFile(join(process.cwd(), "public", "cover-art.png"));
  // ImageResponse runs in the edge runtime where fs lives at build
  // time. The file is read once during prerender and inlined as a
  // base64 data URL so the runtime doesn't re-touch disk.
  const dataUrl = `data:image/png;base64,${cover.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#171717",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
