import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    return NextResponse.json({ message: "classId 필요" }, { status: 400 });
  }

  const supabase = getSupabase();

  // 1) 클래스 정보
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("capacity")
    .eq("id", classId)
    .single();

  if (classError) {
    return NextResponse.json({ message: classError.message }, { status: 500 });
  }

  // 2) 결제 완료 수
  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId)
    .eq("payment_status", "paid");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const paidCount = count || 0;
  const capacity = classData.capacity;
  const remaining = Math.max(capacity - paidCount, 0);

  return NextResponse.json({
    paidCount,
    capacity,
    remaining,
    isFull: remaining <= 0,
  });
}