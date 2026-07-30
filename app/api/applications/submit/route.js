import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatClassSnapshot } from "@/app/lib/class-format";
import { getClassById } from "@/app/lib/classes-store";

const db = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const phone = (value) => String(value || "").replace(/\D/g, "");
const email = (value) => String(value || "").trim().toLowerCase();

export async function POST(request) {
  try {
    const body = await request.json();
    const selected = await getClassById(body.classId, { activeOnly: true });
    if (!selected) return NextResponse.json({ message: "강의를 찾을 수 없습니다." }, { status: 404 });
    const orderId = `bank_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const { error } = await db().rpc("create_application_with_slots", {
      p_class_id: body.classId, p_name: body.name || "", p_phone: phone(body.phone), p_email: email(body.email),
      p_class_type: body.classType || formatClassSnapshot(selected), p_job: body.job || "", p_level: body.level || "", p_message: body.message || "",
      p_status: "bank_pending", p_order_id: orderId, p_amount: Number(selected.price), p_method: "계좌이체 예정",
    });
    if (error) {
      const message = error.message.includes("CLASS_FULL") ? "해당 강의는 마감되었습니다." : error.message.includes("DUPLICATE") ? "이미 포함 수업을 신청하셨습니다." : error.message;
      return NextResponse.json({ message }, { status: /CLASS_FULL|DUPLICATE/.test(error.message) ? 409 : 500 });
    }
    return NextResponse.json({ message: "수강 신청이 접수되었습니다.", orderId });
  } catch (error) { return NextResponse.json({ message: error?.message || "신청 처리 중 오류가 발생했습니다." }, { status: 500 }); }
}
