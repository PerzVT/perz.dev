import access from "../../content/portfolio/access.json";

/**
 * Case studies behind the access code. A project opens to everyone once its
 * slug is removed from `locked` in content/portfolio/access.json.
 */
export const lockedProjects = new Set<string>(access.locked);
export const ACCESS_COOKIE = "perz_access";
export const ACCESS_DAYS = 30;

/** The cookie value for a code: a digest, so the code itself never sits in the browser. Changing the code invalidates every cookie. */
export async function accessToken(code: string) {
  const bytes = new TextEncoder().encode(`perz.dev access:${code.trim().toUpperCase()}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}
