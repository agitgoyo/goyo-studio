import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClassById } from "@/app/lib/classes-store";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const classId = searchParams.get("classId");

  if (!classId) {
    return NextResponse.json({ message: "classId가 필요합니다." }, { status: 400 });
  }

  const classData = await getClassById(classId);

  if (!classData) {
    return NextResponse.json(
      { message: "강의 정보를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const supabase = getSupabase();
  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId)
    .in("payment_status", ["paid", "bank_pending"]);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const paidCount = count || 0;
  const capacity = Number(classData.capacity || 0);
  const remaining = Math.max(capacity - paidCount, 0);

  return NextResponse.json({
    paidCount,
    capacity,
    remaining,
    isFull: remaining <= 0,
  });
}
