"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatClassSnapshot } from "../lib/class-format";

const defaultFilters = {
  classId: "all",
  consent: "public-only",
  status: "all",
};

const statusOptions = [
  { value: "new", label: "새 후기" },
  { value: "shortlisted", label: "후보" },
  { value: "featured", label: "대표 후기" },
  { value: "archived", label: "보관" },
];

export default function AdminReviewManager({ password, isActive }) {
  const [reviews, setReviews] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState("");

  const loadReviews = useCallback(async () => {
    if (!password) return;

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/reviews", {
        headers: {
          "x-admin-password": password,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "후기 목록을 불러오지 못했습니다.");
        return;
      }

      setReviews(data.reviews || []);
      setClasses(data.classes || []);
    } catch (error) {
      console.error(error);
      setMessage("후기 목록을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (!isActive) return;

    const timeoutId = window.setTimeout(() => {
      void loadReviews();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isActive, loadReviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (filters.classId !== "all" && review.class_id !== filters.classId) {
        return false;
      }

      if (filters.consent === "public-only" && !review.consent_public) {
        return false;
      }

      if (filters.consent === "private-only" && review.consent_public) {
        return false;
      }

      if (filters.status !== "all" && review.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [filters, reviews]);

  const updateReviewField = (id, key, value) => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  const saveReview = async (review) => {
    try {
      setSavingId(review.id);
      setMessage("");

      const response = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          id: review.id,
          status: review.status,
          is_featured: review.is_featured,
          admin_tags: review.admin_tags,
          admin_summary_short: review.admin_summary_short,
          admin_summary_long: review.admin_summary_long,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "후기를 저장하지 못했습니다.");
        return;
      }

      setReviews((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      setMessage("후기 정리를 저장했습니다.");
    } catch (error) {
      console.error(error);
      setMessage("후기 저장 중 문제가 발생했습니다.");
    } finally {
      setSavingId("");
    }
  };

  return (
    <section style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <p style={styles.label}>GOYO STUDIO</p>
          <h2 style={styles.title}>후기 정리</h2>
          <p style={styles.desc}>
            후기 원문과 인스타용 짧은 문구, 긴 캡션 요약을 함께 관리합니다.
          </p>
        </div>
        <button style={styles.smallButton} onClick={loadReviews} disabled={isLoading}>
          {isLoading ? "불러오는 중..." : "새로고침"}
        </button>
      </div>

      <div style={styles.filterBar}>
        <select
          style={styles.select}
          value={filters.classId}
          onChange={(event) => setFilters((prev) => ({ ...prev, classId: event.target.value }))}
        >
          <option value="all">모든 수업</option>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {formatClassSnapshot(item)}
            </option>
          ))}
        </select>

        <select
          style={styles.select}
          value={filters.consent}
          onChange={(event) => setFilters((prev) => ({ ...prev, consent: event.target.value }))}
        >
          <option value="public-only">공개 동의만 보기</option>
          <option value="all">모든 후기</option>
          <option value="private-only">비공개만 보기</option>
        </select>

        <select
          style={styles.select}
          value={filters.status}
          onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="all">모든 상태</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.summaryBar}>
        <div style={styles.statCard}>
          <strong>{reviews.length}</strong>
          <span>전체 후기</span>
        </div>
        <div style={styles.statCard}>
          <strong>{reviews.filter((item) => item.consent_public).length}</strong>
          <span>인스타 활용 가능</span>
        </div>
        <div style={styles.statCard}>
          <strong>{reviews.filter((item) => item.status === "featured").length}</strong>
          <span>대표 후기</span>
        </div>
      </div>

      <div style={styles.reviewList}>
        {filteredReviews.map((review) => (
          <article key={review.id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div>
                <p style={styles.label}>{review.class_title_snapshot}</p>
                <h3 style={styles.cardTitle}>{review.one_line_review}</h3>
                <p style={styles.meta}>
                  제출일 {new Date(review.submitted_at).toLocaleString("ko-KR")} · 만족도{" "}
                  {review.rating_overall}/5
                </p>
              </div>
              <div style={styles.badges}>
                <span style={styles.badge}>
                  {review.consent_public ? "익명 공개 가능" : "비공개"}
                </span>
                {review.consent_contact ? <span style={styles.badge}>추가 연락 가능</span> : null}
              </div>
            </div>

            <div style={styles.contentGrid}>
              <div style={styles.panel}>
                <p style={styles.panelLabel}>원문 후기</p>
                <div style={styles.copyBlock}>
                  <strong>수업 전 고민 / 변화</strong>
                  <p>{review.before_after_change || "미입력"}</p>
                </div>
                <div style={styles.copyBlock}>
                  <strong>가장 좋았던 점</strong>
                  <p>{review.best_part}</p>
                </div>
                <div style={styles.copyBlock}>
                  <strong>추천 대상</strong>
                  <p>{review.recommended_for}</p>
                </div>
                {review.detailed_review ? (
                  <div style={styles.copyBlock}>
                    <strong>자세한 후기</strong>
                    <p>{review.detailed_review}</p>
                  </div>
                ) : null}
              </div>

              <div style={styles.panel}>
                <p style={styles.panelLabel}>인스타 정리</p>

                <label style={styles.formLabel}>상태</label>
                <select
                  style={styles.input}
                  value={review.status}
                  onChange={(event) =>
                    updateReviewField(review.id, "status", event.target.value)
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <label style={styles.formLabel}>태그</label>
                <input
                  style={styles.input}
                  value={Array.isArray(review.admin_tags) ? review.admin_tags.join(", ") : ""}
                  onChange={(event) =>
                    updateReviewField(review.id, "admin_tags", event.target.value.split(","))
                  }
                  placeholder="예: 투시도, 초보추천, 피드백"
                />

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={Boolean(review.is_featured)}
                    onChange={(event) =>
                      updateReviewField(review.id, "is_featured", event.target.checked)
                    }
                  />
                  대표 후기로 표시
                </label>

                <label style={styles.formLabel}>짧은 카드용 문구</label>
                <textarea
                  style={styles.textarea}
                  value={review.admin_summary_short || ""}
                  onChange={(event) =>
                    updateReviewField(review.id, "admin_summary_short", event.target.value)
                  }
                />

                <label style={styles.formLabel}>긴 캡션용 요약</label>
                <textarea
                  style={{ ...styles.textarea, minHeight: "220px" }}
                  value={review.admin_summary_long || ""}
                  onChange={(event) =>
                    updateReviewField(review.id, "admin_summary_long", event.target.value)
                  }
                />

                <button
                  style={styles.button}
                  onClick={() => saveReview(review)}
                  disabled={savingId === review.id}
                >
                  {savingId === review.id ? "저장 중..." : "정리 저장하기"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!isLoading && filteredReviews.length === 0 ? (
        <div style={styles.emptyBox}>조건에 맞는 후기가 아직 없습니다.</div>
      ) : null}

      {message ? <p style={styles.message}>{message}</p> : null}
    </section>
  );
}

const styles = {
  wrap: {
    display: "grid",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "flex-start",
  },
  label: {
    color: "#d88b3a",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    margin: 0,
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.15,
    margin: "0 0 14px",
  },
  cardTitle: {
    margin: "10px 0 8px",
    fontSize: "30px",
    lineHeight: 1.1,
  },
  desc: {
    color: "#cfc8ba",
    lineHeight: 1.7,
    margin: 0,
  },
  meta: {
    margin: 0,
    color: "#cfc8ba",
    fontSize: "14px",
  },
  badges: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  badge: {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.16)",
    color: "#f5f1e8",
    fontSize: "13px",
    fontWeight: 800,
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "flex-start",
  },
  filterBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  select: {
    height: "50px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "#111",
    color: "#f5f1e8",
    padding: "0 16px",
    fontSize: "15px",
  },
  summaryBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  statCard: {
    background: "#1b1b1b",
    borderRadius: "22px",
    padding: "22px",
    display: "grid",
    gap: "6px",
  },
  reviewList: {
    display: "grid",
    gap: "20px",
  },
  reviewCard: {
    background: "#1b1b1b",
    borderRadius: "28px",
    padding: "26px",
    display: "grid",
    gap: "22px",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },
  panel: {
    background: "#111",
    borderRadius: "22px",
    padding: "22px",
  },
  panelLabel: {
    margin: "0 0 18px",
    color: "#d88b3a",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  copyBlock: {
    marginBottom: "18px",
    color: "#f5f1e8",
  },
  formLabel: {
    display: "block",
    marginTop: "16px",
    marginBottom: "8px",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    height: "50px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "#171717",
    color: "#f5f1e8",
    padding: "0 16px",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "#171717",
    color: "#f5f1e8",
    padding: "14px 16px",
    fontSize: "15px",
    resize: "vertical",
    lineHeight: 1.7,
  },
  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "18px",
    color: "#cfc8ba",
  },
  button: {
    width: "100%",
    height: "52px",
    borderRadius: "999px",
    border: "none",
    background: "#f5f1e8",
    color: "#111",
    fontWeight: 900,
    cursor: "pointer",
    marginTop: "18px",
  },
  smallButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#f5f1e8",
    fontWeight: 800,
    cursor: "pointer",
  },
  emptyBox: {
    background: "#1b1b1b",
    borderRadius: "24px",
    padding: "28px",
    color: "#cfc8ba",
    textAlign: "center",
  },
  message: {
    marginTop: "8px",
    color: "#d88b3a",
    fontWeight: 800,
  },
};
