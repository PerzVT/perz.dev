import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken, lockedProjects } from "@/lib/access";

/** Locked case studies serve the access page at their own URL until the visitor holds a valid code cookie. */
export async function proxy(request: NextRequest) {
  const code = process.env.ACCESS_CODE;
  // No code configured means no gate, so a missing variable never locks the owner out.
  if (!code) return NextResponse.next();
  const slug = request.nextUrl.pathname.split("/")[2];
  if (!lockedProjects.has(slug)) return NextResponse.next();
  if (request.cookies.get(ACCESS_COOKIE)?.value === await accessToken(code)) return NextResponse.next();
  const gate = new URL("/access", request.url);
  gate.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.rewrite(gate);
}

export const config = { matcher: "/projects/:slug" };
