import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { ok: false, message: "관리자 비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
