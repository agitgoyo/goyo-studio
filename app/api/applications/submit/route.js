import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      return NextResponse.json(
        { message: "GOOGLE_SCRIPT_URL이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const response = await fetch(googleScriptUrl, {
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
      }),
    });

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "메일 전송에 실패했습니다.",
          detail: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "수강신청이 접수되었습니다.",
    });
  } catch (error) {
    console.error("수강신청 접수 오류:", error);

    return NextResponse.json(
      {
        message: error?.message || "수강신청 접수 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}