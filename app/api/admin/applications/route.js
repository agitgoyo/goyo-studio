import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "@/app/lib/admin-auth";

const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function GET(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "관리자 인증이 필요합니다." }, { status: 401 });
  const { data, error } = await db().from("applications").select("*").order("id", { ascending: false });
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function PATCH(request) {
  if (!isAdminRequest(request)) return NextResponse.json({ message: "관리자 인증이 필요합니다." }, { status: 401 });
  try {
    const { id } = await request.json();
    const supabase = db();
    const { data: application, error } = await supabase.from("applications").select("*").eq("id", id).single();
    if (error || !application) return NextResponse.json({ message: "신청 정보를 찾을 수 없습니다." }, { status: 404 });
    if (application.payment_status === "cancelled") return NextResponse.json({ ok: true, message: "이미 취소된 신청입니다." });

    const { error: updateError } = await supabase.from("applications").update({ payment_status: "cancelled" }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ ok: true, message: "신청을 취소하고 좌석을 복원했습니다. 토스 환불은 토스페이먼츠 콘솔에서 별도로 처리해 주세요." });
  } catch (error) { return NextResponse.json({ message: error?.message || "취소 처리 중 오류가 발생했습니다." }, { status: 500 }); }
}
