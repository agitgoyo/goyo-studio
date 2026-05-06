import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    const supabase = getSupabase();

    // 1. 강의 정보 확인
    const { data: selectedClass, error: classError } = await supabase
      .from("classes")
      .select("*")
      .eq("id", body.classId)
      .single();

    if (classError || !selectedClass) {
      return NextResponse.json(
        { message: "강의 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 2. 현재 신청 인원 확인
    const { count, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("class_id", body.classId)
      .in("payment_status", ["paid", "bank_pending"]);

    if (countError) {
      return NextResponse.json(
        { message: countError.message },
        { status: 500 }
      );
    }

    if ((count || 0) >= selectedClass.capacity) {
      return NextResponse.json(
        { message: "해당 강의는 정원이 마감되었습니다." },
        { status: 409 }
      );
    }

    // 3. Supabase에 신청 저장
    const orderId = `bank_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const { error: insertError } = await supabase.from("applications").insert({
      class_id: body.classId,
      name: body.name || "",
      phone: body.phone || "",
      email: body.email || "",
      class_type: body.classType || "",
      job: body.job || "",
      level: body.level || "",
      message: body.message || "",
      payment_status: "bank_pending",
      order_id: orderId,
      amount: Number(body.amount || 0),
      method: "계좌이체 예정",
    });

    if (insertError) {
      return NextResponse.json(
        { message: `신청 정보 저장 오류: ${insertError.message}` },
        { status: 500 }
      );
    }

    // 4. 메일 발송
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (googleScriptUrl) {
      await fetch(googleScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: body.name || "",
          phone: body.phone || "",
          email: body.email || "",
          classType: body.classType || "",
          job: body.job || "",
          level: body.level || "",
          message: body.message || "",
          paymentStatus: "계좌이체 신청",
          amount: body.amount ? String(body.amount) : "",
          orderId,
        }),
      });
    }

    return NextResponse.json({
      message: "수강신청이 접수되었습니다.",
    });
  } catch (error) {
    console.error("수강신청 접수 오류:", error);

    return NextResponse.json(
      { message: error?.message || "수강신청 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}