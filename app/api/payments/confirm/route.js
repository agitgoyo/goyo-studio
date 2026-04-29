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
    const {
      paymentKey,
      orderId,
      amount,
      name,
      phone,
      email,
      classId,
      classType,
      job,
      level,
      message,
    } = await request.json();

    if (!paymentKey || !orderId || !amount || !classId) {
      return NextResponse.json(
        { message: "필수 결제 정보가 없습니다." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: selectedClass, error: classError } = await supabase
      .from("classes")
      .select("*")
      .eq("id", classId)
      .single();

    if (classError || !selectedClass) {
      return NextResponse.json(
        { message: "강의 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const { data: existingApplication } = await supabase
      .from("applications")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (existingApplication) {
      return NextResponse.json({
        orderId,
        totalAmount: amount,
        method: existingApplication.method || "확인 완료",
      });
    }

    const { count, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("class_id", classId)
      .eq("payment_status", "paid");

    if (countError) {
      return NextResponse.json(
        { message: `정원 확인 오류: ${countError.message}` },
        { status: 500 }
      );
    }

    if ((count || 0) >= selectedClass.capacity) {
      return NextResponse.json(
        { message: "해당 강의는 정원이 마감되었습니다." },
        { status: 409 }
      );
    }

    if (Number(amount) !== Number(selectedClass.price)) {
      return NextResponse.json(
        { message: "결제 금액이 강의 금액과 일치하지 않습니다." },
        { status: 400 }
      );
    }

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { message: "TOSS_SECRET_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const encryptedSecretKey =
      "Basic " + Buffer.from(secretKey + ":").toString("base64");

    const tossResponse = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: encryptedSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      }
    );

    const paymentData = await tossResponse.json();

    if (!tossResponse.ok) {
      return NextResponse.json(paymentData, { status: tossResponse.status });
    }

    const finalClassType =
      classType || `[ ${selectedClass.date} ] ${selectedClass.title}`;

    const { error: insertError } = await supabase.from("applications").insert({
      class_id: classId,
      name: name || "",
      phone: phone || "",
      email: email || "",
      class_type: finalClassType,
      job: job || "",
      level: level || "",
      message: message || "",
      payment_status: "paid",
      order_id: paymentData.orderId || orderId,
      payment_key: paymentData.paymentKey || paymentKey,
      amount: paymentData.totalAmount || amount,
      method: paymentData.method || "",
      approved_at: paymentData.approvedAt || null,
    });

    if (insertError) {
      return NextResponse.json(
        {
          message: `신청 정보 저장 오류: ${insertError.message}`,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        },
        { status: 500 }
      );
    }

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (googleScriptUrl) {
      await fetch(googleScriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: name || "",
          phone: phone || "",
          email: email || "",
          classType: finalClassType,
          job: job || "",
          level: level || "",
          message: message || "",
          paymentStatus: "결제 완료",
          orderId: paymentData.orderId || orderId,
          paymentKey: paymentData.paymentKey || paymentKey,
          amount: String(paymentData.totalAmount || amount),
          method: paymentData.method || "",
          approvedAt: paymentData.approvedAt || "",
        }),
      });
    }

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("결제 승인 API 오류:", error);

    return NextResponse.json(
      { message: error?.message || "결제 승인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}