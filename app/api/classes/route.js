import { NextResponse } from "next/server";
import { getDetailClasses, getPublicClasses } from "@/app/lib/classes-store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope");
  const classes =
    scope === "detail" || scope === "all"
      ? await getDetailClasses()
      : await getPublicClasses();

  return NextResponse.json(classes);
}
