import { NextResponse } from "next/server";
import { isAdminRequest } from "@/app/lib/admin-auth";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";
import { readClasses } from "@/app/lib/classes-store";
import {
  buildReviewSummaries,
  normalizeReviewUpdate,
} from "@/app/lib/review-helpers";

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const [{ data: reviews, error: reviewError }, classes] = await Promise.all([
    supabase.from("reviews").select("*").order("submitted_at", { ascending: false }),
    readClasses(),
  ]);

  if (reviewError) {
    return NextResponse.json({ message: reviewError.message }, { status: 500 });
  }

  const hydratedReviews = (reviews || []).map((review) => {
    if (review.admin_summary_short && review.admin_summary_long) {
      return review;
    }

    return {
      ...review,
      ...buildReviewSummaries(review),
    };
  });

  return NextResponse.json({
    reviews: hydratedReviews,
    classes: classes || [],
  });
}

export async function PUT(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "권한이 없습니다." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const normalized = normalizeReviewUpdate(body);

    if (normalized.error) {
      return NextResponse.json({ message: normalized.error }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("reviews")
      .update(normalized.data)
      .eq("id", normalized.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("후기 관리자 저장 오류:", error);
    return NextResponse.json(
      { message: error?.message || "후기 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
