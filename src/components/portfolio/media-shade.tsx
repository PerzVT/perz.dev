import { useId } from "react";
// Figma's normalized fill transform maps object coordinates into gradient space.
// Invert it for SVG, whose gradientTransform maps gradient space into the object.
type Shade = { color: string; opacity: number; linear?: boolean; transform: number[][] };
const bannerTransform = [[-0.47504422068595886, 0.024955786764621735, 0.9750442504882812], [-0.024414343759417534, -0.02441432885825634, 0.5244143605232239]];
const defaultHero = [[0.005178541876375675, 0.563852071762085, 0.40411287546157837], [-0.5566849112510681, 0, 0.7930328249931335]];
export function heroShade(hash?: string, title?: string): Shade {
  if (title === "BisectHosting") return { color: "#111418", opacity: 1, linear: true, transform: [[0,2.3892617225646973,-1.548657774925232],[-4.832215309143066,0,3.0436248779296875]] };
  return { color: "#111418", opacity: 1, transform: hash === "327d11da149ca9ca805978b32275482358fce0b1" ? [[0,0.7439916729927063,0.2784743905067444],[-0.5125356316566467,0,0.7697930932044983]] : defaultHero };
}
export function bannerShade(hash?: string): Shade {
  const blue = ["50512c7f30a40fa2f52b652582e7ec6e4924cdae", "b340df9225991f0cc47c1d99b633e333811c33c6"].includes(hash || "");
  const games = hash === "8d0643a9e6f754dd5ae26067ede0d55c272a7f56";
  const contact = games || hash === "bf4525ba594a20733305ae311d8ddd9f46629c9d";
  return { color: blue ? "#2f398e" : contact ? "#1a1e24" : "#111418", opacity: games ? 1 : 0.82, transform: bannerTransform };
}
export function FigmaShade({ color, opacity, linear = false, transform: t, className }: Shade & { className: string }) {
  const id = useId();
  const [[a,c,e],[b,d,f]] = t;
  const det = a*d-b*c;
  const inverse = [d/det,-b/det,-c/det,a/det,(c*f-d*e)/det,(b*e-a*f)/det];
  return <svg className={className} aria-hidden="true" viewBox="0 0 1 1" preserveAspectRatio="none">
    <defs>{linear ? <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1="0.5" x2="1" y2="0.5" gradientTransform={`matrix(${inverse.join(" ")})`}>
      <stop offset="0" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor={color} stopOpacity={opacity} />
    </linearGradient> : <radialGradient id={id} gradientUnits="userSpaceOnUse" cx="0.5" cy="0.5" r="0.5" gradientTransform={`matrix(${inverse.join(" ")})`}>
      <stop offset="0" stopColor={color} stopOpacity="0" /><stop offset="1" stopColor={color} stopOpacity={opacity} />
    </radialGradient>}</defs>
    <rect width="1" height="1" fill={`url(#${id})`} />
  </svg>;
}
