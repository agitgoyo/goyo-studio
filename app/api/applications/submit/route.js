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

async function findDuplicateApplication(supabase, { classId, email, phone }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const phoneCandidates = [
    ...new Set([normalizedPhone, formatPhone(normalizedPhone)].filter(Boolean)),
  ];

  if (normalizedEmail) {
    const { data, error } = await supabase
      .from("applications")
      .select("id, payment_status")
      .eq("class_id", classId)
      .in("payment_status", ["paid", "bank_pending"])
      .eq("email", normalizedEmail)
      .limit(1);

    if (error) {
      throw error;
    }

    if (data?.length) {
      return data[0];
    }
  }

  if (phoneCandidates.length) {
    const { data, error } = await supabase
      .from("applications")
      .select("id, payment_status")
      .eq("class_id", classId)
      .in("payment_status", ["paid", "bank_pending"])
      .in("phone", phoneCandidates)
      .limit(1);

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
    const body = await request.json();
    const normalizedEmail = normalizeEmail(body.email);
    const normalizedPhone = normalizePhone(body.phone);
    const supabase = getSupabase();
    const selectedClass = await getClassById(body.classId, { activeOnly: true });

    if (!selectedClass) {
      return NextResponse.json(
        { message: "강의 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const duplicateApplication = await findDuplicateApplication(supabase, {
      classId: body.classId,
      email: normalizedEmail,
      phone: normalizedPhone,
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
      .eq("class_id", body.classId)
      .in("payment_status", ["paid", "bank_pending"]);

    if (countError) {
      return NextResponse.json({ message: countError.message }, { status: 500 });
    }

    if ((count || 0) >= Number(selectedClass.capacity || 0)) {
      return NextResponse.json(
        { message: "해당 강의는 정원이 마감되었습니다." },
        { status: 409 }
      );
    }

    const orderId = `bank_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const { error: insertError } = await supabase.from("applications").insert({
      class_id: body.classId,
      name: body.name || "",
      phone: normalizedPhone,
      email: normalizedEmail,
      class_type: body.classType || formatClassSnapshot(selectedClass),
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
          name: body.name || "",
          phone: normalizedPhone,
          email: normalizedEmail,
          classType: body.classType || formatClassSnapshot(selectedClass),
          job: body.job || "",
          level: body.level || "",
          message: body.message || "",
          paymentStatus: "계좌이체 신청",
          amount: body.amount ? String(body.amount) : "",
          orderId,
          autoReplyEnabled: "true",
          autoReplyTo: normalizedEmail,
          autoReplySubject: "[GOYO STUDIO] 수강신청이 접수되었습니다.",
          autoReplyName: body.name || "",
          autoReplyFormType: "강의 신청",
          autoReplyClassType: body.classType || formatClassSnapshot(selectedClass),
          autoReplyPaymentStatus: "계좌이체 신청",
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
