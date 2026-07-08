import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatClassSnapshot } from "@/app/lib/class-format";
import { getClassById } from "@/app/lib/classes-store";

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhone(value) {
  if (value.length === 11) {
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  }

  if (value.length === 10) {
    return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
  }

  return value;
}

async function findDuplicateApplication(supabase, { classId, email, phone, orderId }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const phoneCandidates = [
    ...new Set([normalizedPhone, formatPhone(normalizedPhone)].filter(Boolean)),
  ];

  if (normalizedEmail) {
    let query = supabase
      .from("applications")
      .select("id, payment_status, order_id")
      .eq("class_id", classId)
      .in("payment_status", ["paid", "bank_pending"])
      .eq("email", normalizedEmail)
      .limit(1);

    if (orderId) {
      query = query.neq("order_id", orderId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data?.length) {
      return data[0];
    }
  }

  if (phoneCandidates.length) {
    let query = supabase
      .from("applications")
      .select("id, payment_status, order_id")
      .eq("class_id", classId)
      .in("payment_status", ["paid", "bank_pending"])
      .in("phone", phoneCandidates)
      .limit(1);

    if (orderId) {
      query = query.neq("order_id", orderId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data?.length) {
      return data[0];
    }
  }

  return null;
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
    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phone);

    if (!paymentKey || !orderId || !amount || !classId) {
      return NextResponse.json(
        { message: "필수 결제 정보가 없습니다." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    const selectedClass = await getClassById(classId, { activeOnly: true });

    if (!selectedClass) {
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

    const duplicateApplication = await findDuplicateApplication(supabase, {
      classId,
      email: normalizedEmail,
      phone: normalizedPhone,
      orderId,
    });

    if (duplicateApplication) {
      return NextResponse.json(
        {
          message:
            "이미 같은 강의에 신청하신 내역이 있습니다. 메일함을 먼저 확인해주세요.",
        },
        { status: 409 }
      );
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

    if ((count || 0) >= Number(selectedClass.capacity || 0)) {
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

    const finalClassType = classType || formatClassSnapshot(selectedClass);

    const { error: insertError } = await supabase.from("applications").insert({
      class_id: classId,
      name: name || "",
      phone: normalizedPhone,
      email: normalizedEmail,
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
          formType: "강의 신청",
          notificationSubject: "새로운 강의신청이 도착했습니다.",
          name: name || "",
          phone: normalizedPhone,
          email: normalizedEmail,
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
          autoReplyEnabled: "true",
          autoReplyTo: normalizedEmail,
          autoReplySubject: "[GOYO STUDIO] 수강신청이 접수되었습니다.",
          autoReplyName: name || "",
          autoReplyFormType: "강의 신청",
          autoReplyClassType: finalClassType,
          autoReplyPaymentStatus: "결제 완료",
        }),
      });
    }

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error("결제 확인 API 오류:", error);

    return NextResponse.json(
      { message: error?.message || "결제 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
