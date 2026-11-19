import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const c = await createClient();
  if (c && code) await c.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(new URL("/admin", url.origin));
}
