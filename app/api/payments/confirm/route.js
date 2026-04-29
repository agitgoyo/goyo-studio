import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_CAPACITY = 8;

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
      classType,
      job,
      level,
      message,
    } = await request.json();

    if (!paymentKey || !orderId || !amount || !classType) {
      return NextResponse.json(
        { message: "필수 결제 정보가 없습니다." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // 이미 저장된 주문이면 중복 저장 방지
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

    // 정원 확인
    const { count, error: countError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("class_type", classType)
      .eq("payment_status", "paid");

    if (countError) {
      console.error("정원 확인 오류:", countError);
      return NextResponse.json(
        { message: `정원 확인 오류: ${countError.message}` },
        { status: 500 }
      );
    }

    if ((count || 0) >= MAX_CAPACITY) {
      return NextResponse.json(
        { message: "해당 강의는 정원이 마감되었습니다." },
        { status: 409 }
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
      console.error("토스 승인 오류:", paymentData);
      return NextResponse.json(paymentData, { status: tossResponse.status });
    }

    // Supabase 저장
    const { error: insertError } = await supabase.from("applications").insert({
      name: name || "",
      phone: phone || "",
      email: email || "",
      class_type: classType,
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
      console.error("신청 정보 저장 오류:", insertError);

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

    // Google Apps Script 메일 발송
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

if (googleScriptUrl) {
  const mailResponse = await fetch(googleScriptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      name: name || "",
      phone: phone || "",
      email: email || "",
      classType: classType || "",
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

  const mailText = await mailResponse.text();

  console.log("Google Script mail status:", mailResponse.status);
  console.log("Google Script mail response:", mailText);

  if (!mailResponse.ok) {
    console.error("메일 발송 실패:", mailText);
  }
} else {
  console.error("GOOGLE_SCRIPT_URL이 설정되지 않았습니다.");
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