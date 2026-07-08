import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";
import { normalizeReviewSubmission } from "@/app/lib/review-helpers";
import { formatClassSnapshot } from "@/app/lib/class-format";
import { getClassById } from "@/app/lib/classes-store";

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const selectedClass = await getClassById(body.class_id);

    if (!selectedClass) {
      return NextResponse.json(
        { message: "선택한 수업 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const classTitleSnapshot = formatClassSnapshot(selectedClass);
    const normalized = normalizeReviewSubmission(body, classTitleSnapshot);

    if (normalized.error) {
      return NextResponse.json({ message: normalized.error }, { status: 400 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from("reviews")
      .insert(normalized.data)
      .select("id")
      .single();

    if (insertError) {
      return NextResponse.json(
        { message: `후기 저장 중 오류가 발생했습니다: ${insertError.message}` },
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
          formType: "수업 후기",
          notificationSubject: "[GOYO STUDIO] 새로운 수업 후기가 도착했습니다.",
          name: normalized.data.student_name || "익명",
          email: "",
          phone: "",
          classType: classTitleSnapshot,
          message: [
            `한 줄 후기: ${normalized.data.one_line_review}`,
            `좋았던 점: ${normalized.data.best_part}`,
            normalized.data.before_after_change
              ? `전후 변화: ${normalized.data.before_after_change}`
              : "",
            `추천 대상: ${normalized.data.recommended_for}`,
            `만족도: ${normalized.data.rating_overall}/5`,
            `익명 공개 동의: ${normalized.data.consent_public ? "예" : "아니오"}`,
            `추가 인터뷰 동의: ${normalized.data.consent_contact ? "예" : "아니오"}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    }

    return NextResponse.json({
      ok: true,
      id: inserted.id,
    });
  } catch (error) {
    console.error("후기 제출 오류:", error);
    return NextResponse.json(
      { message: error?.message || "후기 제출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
