export const REVIEW_STATUSES = ["new", "shortlisted", "featured", "archived"];

export function sanitizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function sanitizeLongText(value) {
  return String(value || "").replace(/\r\n/g, "\n").trim();
}

export function clampText(value, maxLength) {
  const clean = sanitizeText(value);
  if (!clean) return "";
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

export function parseTags(value) {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => sanitizeText(item)).filter(Boolean))];
  }

  return [...new Set(String(value || "")
    .split(",")
    .map((item) => sanitizeText(item))
    .filter(Boolean))];
}

export function buildReviewSummaries(review) {
  const shortPieces = [
    clampText(review.one_line_review, 72),
    review.best_part ? `좋았던 점: ${clampText(review.best_part, 56)}` : "",
    review.recommended_for
      ? `추천 대상: ${clampText(review.recommended_for, 56)}`
      : "",
  ].filter(Boolean);

  const longPieces = [
    review.class_title_snapshot
      ? `${review.class_title_snapshot} 수업 후기`
      : "수업 후기",
    review.before_after_change
      ? `수업 전 고민과 변화: ${sanitizeLongText(review.before_after_change)}`
      : "",
    review.best_part ? `가장 좋았던 점: ${sanitizeLongText(review.best_part)}` : "",
    review.recommended_for
      ? `추천하고 싶은 분: ${sanitizeLongText(review.recommended_for)}`
      : "",
    review.detailed_review
      ? `추가 후기: ${sanitizeLongText(review.detailed_review)}`
      : "",
  ].filter(Boolean);

  return {
    admin_summary_short: clampText(shortPieces.join(" / "), 180),
    admin_summary_long: longPieces.join("\n\n"),
  };
}

export function normalizeReviewSubmission(body, classTitleSnapshot) {
  const classId = sanitizeText(body.class_id);
  const oneLineReview = clampText(body.one_line_review, 140);
  const bestPart = sanitizeLongText(body.best_part);
  const beforeAfterChange = sanitizeLongText(body.before_after_change);
  const recommendedFor = sanitizeLongText(body.recommended_for);
  const detailedReview = sanitizeLongText(body.detailed_review);
  const studentName = sanitizeText(body.student_name);
  const studentInstagram = sanitizeText(body.student_instagram);
  const consentPublic = Boolean(body.consent_public);
  const consentContact = Boolean(body.consent_contact);
  const ratingOverall = Number(body.rating_overall);

  if (!classId) {
    return { error: "수업을 선택해 주세요." };
  }

  if (!bestPart) {
    return { error: "수업에서 가장 좋았던 점을 적어 주세요." };
  }

  if (!recommendedFor) {
    return { error: "추천하고 싶은 대상을 적어 주세요." };
  }

  if (!oneLineReview) {
    return { error: "한 줄 후기를 적어 주세요." };
  }

  if (!Number.isInteger(ratingOverall) || ratingOverall < 1 || ratingOverall > 5) {
    return { error: "만족도는 1점부터 5점까지 선택해 주세요." };
  }

  if (!consentPublic) {
    return { error: "익명 후기 활용 동의가 필요합니다." };
  }

  const review = {
    class_id: classId,
    class_title_snapshot: sanitizeText(classTitleSnapshot),
    submitted_at: new Date().toISOString(),
    student_name: studentName || null,
    student_instagram: studentInstagram || null,
    rating_overall: ratingOverall,
    best_part: bestPart,
    before_after_change: beforeAfterChange,
    recommended_for: recommendedFor,
    one_line_review: oneLineReview,
    detailed_review: detailedReview || null,
    consent_public: consentPublic,
    consent_contact: consentContact,
    is_featured: false,
    status: "new",
    admin_tags: [],
  };

  const summaries = buildReviewSummaries(review);

  return {
    data: {
      ...review,
      ...summaries,
    },
  };
}

export function normalizeReviewUpdate(body) {
  const id = sanitizeText(body.id);
  const status = sanitizeText(body.status);

  if (!id) {
    return { error: "후기 ID가 없습니다." };
  }

  if (status && !REVIEW_STATUSES.includes(status)) {
    return { error: "유효하지 않은 후기 상태입니다." };
  }

  const review = {
    status: status || "new",
    is_featured: Boolean(body.is_featured),
    admin_tags: parseTags(body.admin_tags),
    admin_summary_short: clampText(body.admin_summary_short, 180) || null,
    admin_summary_long: sanitizeLongText(body.admin_summary_long) || null,
  };

  return { id, data: review };
}
