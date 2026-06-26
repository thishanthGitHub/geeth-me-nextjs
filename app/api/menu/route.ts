import { NextResponse } from "next/server";
import { parseMenuTxt } from "@/lib/menu-parser";

export function GET() {
  try {
    const menu = parseMenuTxt();
    return NextResponse.json(menu, {
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
    });
  } catch (err) {
    console.error("[/api/menu]", err);
    return NextResponse.json({ error: "Could not load menu" }, { status: 500 });
  }
}
