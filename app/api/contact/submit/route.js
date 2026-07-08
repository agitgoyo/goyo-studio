import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim() || "";
    const email = body?.email?.trim() || "";
    const phone = body?.phone?.trim() || "";
    const projectType = body?.projectType?.trim() || "";
    const message = body?.message?.trim() || "";

    if (!name || !email || !projectType || !message) {
      return NextResponse.json(
        { message: "필수 정보를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
      return NextResponse.json(
        { message: "문의 접수 설정이 아직 연결되지 않았습니다." },
        { status: 500 }
      );
    }

    const mailResponse = await fetch(googleScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        formType: "홈페이지 문의",
        notificationSubject: "새로운 문의가 들어왔습니다.",
        name,
        email,
        phone,
        classType: projectType,
        projectType,
        message,
      }),
    });

    if (!mailResponse.ok) {
      return NextResponse.json(
        { message: "문의 메일 전송에 실패했습니다." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "문의가 정상적으로 접수되었습니다.",
    });
  } catch (error) {
    console.error("홈페이지 문의 접수 오류:", error);

    return NextResponse.json(
      { message: error?.message || "문의 접수 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
