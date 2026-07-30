import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatClassSnapshot } from "@/app/lib/class-format";
import { getClassById } from "@/app/lib/classes-store";

const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const cleanPhone = (value) => String(value || "").replace(/\D/g, "");

export async function POST(request) {
  try {
    const body = await request.json();
    const selected = await getClassById(body.classId, { activeOnly: true });
    if (!selected) return NextResponse.json({ message: "강의를 찾을 수 없습니다." }, { status: 404 });
    const { error } = await db().rpc("create_application_with_slots", {
      p_class_id: body.classId, p_name: body.name || "", p_phone: cleanPhone(body.phone), p_email: String(body.email || "").trim().toLowerCase(),
      p_class_type: body.classType || formatClassSnapshot(selected), p_job: body.job || "", p_level: body.level || "", p_message: body.message || "",
      p_status: "payment_pending", p_order_id: body.orderId, p_amount: Number(selected.price), p_method: "결제 대기",
    });
    if (error) return NextResponse.json({ message: error.message.includes("CLASS_FULL") ? "해당 강의는 마감되었습니다." : error.message.includes("DUPLICATE") ? "이미 포함 수업을 신청하셨습니다." : error.message }, { status: 409 });
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error: expiryError } = await db().from("applications").update({ reservation_expires_at: expiresAt }).eq("order_id", body.orderId);
    if (expiryError) throw expiryError;
    return NextResponse.json({ expiresAt });
  } catch (error) { return NextResponse.json({ message: error?.message || "좌석 예약에 실패했습니다." }, { status: 500 }); }
}
