import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_DAYS, accessToken } from "@/lib/access";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/** `POST { code }` sets the access cookie when the code matches ACCESS_CODE. */
export async function POST(request: NextRequest) {
  const expected = process.env.ACCESS_CODE;
  if (!expected) return NextResponse.json({ ok: true });
  let code = "";
  try { code = String((await request.json())?.code ?? ""); } catch { /* an empty code fails below */ }
  const [given, wanted] = await Promise.all([accessToken(code), accessToken(expected)]);
  if (given !== wanted) {
    // A pause on every wrong code slows guessing.
    await wait(800);
    return NextResponse.json({ ok: false, error: "That code didn't work. Check it and try again." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, wanted, { httpOnly: true, secure: url(request).protocol === "https:", sameSite: "lax", path: "/", maxAge: ACCESS_DAYS * 24 * 60 * 60 });
  return response;
}

function url(request: NextRequest) { return new URL(request.url); }
