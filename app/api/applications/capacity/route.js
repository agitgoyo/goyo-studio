import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_CAPACITY = 8;

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classType = searchParams.get("classType");

    if (!classType) {
      return NextResponse.json(
        { message: "classType이 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { count, error } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("class_type", classType)
      .eq("payment_status", "paid");

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    const paidCount = count || 0;
    const remaining = Math.max(MAX_CAPACITY - paidCount, 0);

    return NextResponse.json({
      classType,
      maxCapacity: MAX_CAPACITY,
      paidCount,
      remaining,
      isFull: remaining <= 0,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error?.message || "정원 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}