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
    const { id, reason } = await request.json();
    const supabase = db();
    const { data: application, error } = await supabase.from("applications").select("*").eq("id", id).single();
    if (error || !application) return NextResponse.json({ message: "신청 정보를 찾을 수 없습니다." }, { status: 404 });
    if (application.payment_status === "cancelled") return NextResponse.json({ ok: true, message: "이미 취소된 신청입니다." });

    if (application.payment_status === "paid") {
      if (!application.payment_key || !process.env.TOSS_SECRET_KEY) return NextResponse.json({ message: "토스 환불에 필요한 결제 정보가 없습니다." }, { status: 400 });
      const authorization = "Basic " + Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64");
      const cancelResponse = await fetch(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(application.payment_key)}/cancel`, {
        method: "POST",
        headers: { Authorization: authorization, "Content-Type": "application/json", "Idempotency-Key": `cancel_${application.order_id}` },
        body: JSON.stringify({ cancelReason: String(reason || "수강 취소").slice(0, 200) }),
      });
      const cancelData = await cancelResponse.json();
      if (!cancelResponse.ok) return NextResponse.json({ message: cancelData.message || "토스 환불 처리에 실패했습니다." }, { status: cancelResponse.status });
    }

    const { error: updateError } = await supabase.from("applications").update({ payment_status: "cancelled" }).eq("id", id);
    if (updateError) throw updateError;
    return NextResponse.json({ ok: true, message: application.payment_status === "paid" ? "전액 환불 및 좌석 복원이 완료되었습니다." : "신청 취소 및 좌석 복원이 완료되었습니다." });
  } catch (error) { return NextResponse.json({ message: error?.message || "취소 처리 중 오류가 발생했습니다." }, { status: 500 }); }
}
