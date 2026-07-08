"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatClassSnapshot } from "../lib/class-format";

const ratingOptions = [
  { value: 5, label: "5점", text: "정말 만족했어요" },
  { value: 4, label: "4점", text: "만족했어요" },
  { value: 3, label: "3점", text: "보통이에요" },
  { value: 2, label: "2점", text: "아쉬웠어요" },
  { value: 1, label: "1점", text: "많이 아쉬웠어요" },
];

const initialForm = {
  class_id: "",
  student_name: "",
  student_instagram: "",
  before_after_change: "",
  best_part: "",
  recommended_for: "",
  one_line_review: "",
  detailed_review: "",
  rating_overall: 5,
  consent_public: true,
  consent_contact: false,
};

export default function ReviewPage() {
  const [classes, setClasses] = useState([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch("/api/classes?scope=detail", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "수업 목록을 불러오지 못했습니다.");
          return;
        }

        setClasses(data);
      } catch (error) {
        console.error(error);
        setMessage("수업 목록을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "후기를 저장하지 못했습니다.");
        return;
      }

      setIsComplete(true);
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setMessage("후기 제출 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const noClasses = !isLoadingClasses && classes.length === 0;

  return (
    <>
      <style>{`
        .review-shell {
          min-height: 100vh;
          padding: 48px 16px 72px;
          background:
            radial-gradient(circle at top left, rgba(223, 208, 182, 0.75), transparent 28%),
            linear-gradient(180deg, #f7f2ea 0%, #f0e8dc 100%);
          color: #181816;
        }

        .review-wrap {
          width: min(920px, 100%);
          margin: 0 auto;
        }

        .review-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 24px;
        }

        .review-home {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 0 16px;
          border-radius: 999px;
          border: 1px solid rgba(24, 24, 22, 0.16);
          background: rgba(255, 250, 242, 0.75);
          font-size: 14px;
          font-weight: 800;
        }

        .review-card {
          overflow: hidden;
          border: 1px solid rgba(24, 24, 22, 0.08);
          border-radius: 36px;
          background: rgba(255, 251, 245, 0.88);
          box-shadow: 0 28px 80px rgba(61, 47, 35, 0.12);
          backdrop-filter: blur(18px);
        }

        .review-hero {
          padding: 40px 40px 28px;
          background: linear-gradient(135deg, #201d19 0%, #4b4033 100%);
          color: #fff8ef;
        }

        .review-pill {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255, 248, 239, 0.14);
          border: 1px solid rgba(255, 248, 239, 0.2);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .review-hero h1 {
          margin: 18px 0 12px;
          font-size: clamp(34px, 6vw, 62px);
          line-height: 0.96;
          letter-spacing: -0.06em;
        }

        .review-hero p {
          max-width: 640px;
          margin: 0;
          color: rgba(255, 248, 239, 0.82);
          font-size: 16px;
          line-height: 1.8;
          word-break: keep-all;
        }

        .review-body {
          padding: 34px 40px 40px;
        }

        .review-grid {
          display: grid;
          gap: 18px;
        }

        .review-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .review-field label {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 700;
        }

        .review-field input,
        .review-field select,
        .review-field textarea {
          width: 100%;
          border: 1px solid #ddd5c8;
          border-radius: 20px;
          background: #fffdf8;
          padding: 15px 16px;
          color: #181816;
          font: inherit;
        }

        .review-field textarea {
          min-height: 136px;
          resize: vertical;
          line-height: 1.7;
        }

        .review-rating-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .review-rating {
          cursor: pointer;
        }

        .review-rating input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .review-rating span {
          display: flex;
          min-height: 88px;
          border: 1px solid #ddd5c8;
          border-radius: 24px;
          background: #fffdf8;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          font-weight: 800;
          transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        }

        .review-rating small {
          color: #6f675d;
          font-size: 12px;
          font-weight: 600;
        }

        .review-rating input:checked + span {
          border-color: #181816;
          background: #181816;
          color: #fff8ef;
          transform: translateY(-2px);
        }

        .review-rating input:checked + span small {
          color: rgba(255, 248, 239, 0.78);
        }

        .review-consent {
          display: grid;
          gap: 12px;
          padding: 18px 20px;
          border: 1px solid #ddd5c8;
          border-radius: 24px;
          background: #faf4ea;
        }

        .review-check {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.6;
          color: #453f38;
        }

        .review-check input {
          margin-top: 3px;
        }

        .review-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 10px;
        }

        .review-message {
          margin: 0;
          color: #8a4b16;
          font-size: 14px;
          font-weight: 700;
        }

        .review-submit {
          min-width: 220px;
          min-height: 54px;
          padding: 0 24px;
          border: none;
          border-radius: 999px;
          background: #181816;
          color: #fff8ef;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }

        .review-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .review-empty,
        .review-complete {
          padding: 28px;
          border-radius: 28px;
          background: #fffdf8;
          border: 1px solid #ddd5c8;
          text-align: center;
        }

        .review-complete h2,
        .review-empty h2 {
          margin: 0 0 10px;
          font-size: 34px;
          line-height: 1.05;
          letter-spacing: -0.05em;
        }

        .review-complete p,
        .review-empty p {
          margin: 0;
          color: #6f675d;
          line-height: 1.75;
        }

        @media (max-width: 720px) {
          .review-shell {
            padding: 18px 12px 48px;
          }

          .review-hero,
          .review-body {
            padding: 24px 20px;
          }

          .review-row,
          .review-rating-grid,
          .review-actions {
            grid-template-columns: 1fr;
            display: grid;
          }

          .review-actions {
            justify-content: stretch;
          }

          .review-submit {
            width: 100%;
          }

          .review-card {
            border-radius: 28px;
          }
        }
      `}</style>

      <main className="review-shell">
        <div className="review-wrap">
          <div className="review-topbar">
            <Link className="review-home" href="/">
              GOYO STUDIO
            </Link>
          </div>

          <section className="review-card">
            <div className="review-hero">
              <span className="review-pill">Class Review</span>
              <h1>
                고요클래스
                <br />
                수업 후기
              </h1>
              <p>
                수업이 끝난 뒤 남겨주시는 한 문장과 한 경험이 다음 수강생에게는 가장
                분명한 안내가 됩니다. 인스타그램에 소개되는 후기는 익명으로만 활용돼요.
              </p>
            </div>

            <div className="review-body">
              {isComplete ? (
                <div className="review-complete">
                  <h2>후기 감사합니다.</h2>
                  <p>
                    남겨주신 이야기는 다음 수강생이 수업을 이해하는 데 큰 도움이 됩니다.
                  </p>
                </div>
              ) : noClasses ? (
                <div className="review-empty">
                  <h2>현재 선택 가능한 수업이 없어요.</h2>
                  <p>관리자 페이지에서 활성 수업을 열어두면 이곳에서 바로 후기를 받을 수 있습니다.</p>
                </div>
              ) : (
                <form className="review-grid" onSubmit={handleSubmit}>
                  <div className="review-field">
                    <label htmlFor="class_id">어떤 수업을 들으셨나요?</label>
                    <select
                      id="class_id"
                      value={form.class_id}
                      onChange={(event) => updateForm("class_id", event.target.value)}
                      disabled={isLoadingClasses || isSubmitting}
                      required
                    >
                      <option value="">
                        {isLoadingClasses ? "수업 목록을 불러오는 중..." : "수업을 선택해 주세요"}
                      </option>
                      {classes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {formatClassSnapshot(item)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="review-row">
                    <div className="review-field">
                      <label htmlFor="student_name">이름 또는 닉네임 (선택)</label>
                      <input
                        id="student_name"
                        value={form.student_name}
                        onChange={(event) => updateForm("student_name", event.target.value)}
                        placeholder="익명으로 남겨도 괜찮아요"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="review-field">
                      <label htmlFor="student_instagram">인스타그램 아이디 (선택)</label>
                      <input
                        id="student_instagram"
                        value={form.student_instagram}
                        onChange={(event) =>
                          updateForm("student_instagram", event.target.value)
                        }
                        placeholder="@example"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="review-field">
                    <label htmlFor="before_after_change">
                      수업 전 가장 궁금했거나 막막했던 점, 그리고 수업 후 달라진 점이 있다면
                      함께 적어 주세요.
                    </label>
                    <textarea
                      id="before_after_change"
                      value={form.before_after_change}
                      onChange={(event) =>
                        updateForm("before_after_change", event.target.value)
                      }
                      placeholder="예: 조감도 구도를 어떻게 잡아야 할지 막막했는데, 수업 후에는 장면 우선순위를 먼저 잡는 흐름이 생겼어요."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="review-field">
                    <label htmlFor="best_part">수업에서 가장 좋았던 점은 무엇이었나요?</label>
                    <textarea
                      id="best_part"
                      value={form.best_part}
                      onChange={(event) => updateForm("best_part", event.target.value)}
                      placeholder="예: 피드백이 구체적이어서 바로 수정 방향이 보였어요."
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="review-field">
                    <label htmlFor="recommended_for">
                      이 수업을 어떤 분께 추천하고 싶나요?
                    </label>
                    <textarea
                      id="recommended_for"
                      value={form.recommended_for}
                      onChange={(event) =>
                        updateForm("recommended_for", event.target.value)
                      }
                      placeholder="예: 렌더는 돌릴 수 있는데 결과가 늘 아쉽다고 느끼는 분들께 추천해요."
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="review-field">
                    <label htmlFor="one_line_review">한 줄로 남기는 후기</label>
                    <input
                      id="one_line_review"
                      value={form.one_line_review}
                      onChange={(event) =>
                        updateForm("one_line_review", event.target.value)
                      }
                      placeholder="예: 막막했던 흐름이 한 번에 정리되는 수업이었어요."
                      maxLength={140}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="review-field">
                    <label htmlFor="detailed_review">자세히 남기고 싶은 후기가 있으면 적어 주세요</label>
                    <textarea
                      id="detailed_review"
                      value={form.detailed_review}
                      onChange={(event) =>
                        updateForm("detailed_review", event.target.value)
                      }
                      placeholder="선택 항목이에요. 수업 흐름이나 인상 깊었던 순간을 자유롭게 적어 주세요."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="review-field">
                    <label>전체 만족도는 어느 정도인가요?</label>
                    <div className="review-rating-grid">
                      {ratingOptions.map((option) => (
                        <label key={option.value} className="review-rating">
                          <input
                            type="radio"
                            name="rating_overall"
                            value={option.value}
                            checked={Number(form.rating_overall) === option.value}
                            onChange={() => updateForm("rating_overall", option.value)}
                            disabled={isSubmitting}
                          />
                          <span>
                            {option.label}
                            <small>{option.text}</small>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="review-consent">
                    <label className="review-check">
                      <input
                        type="checkbox"
                        checked={form.consent_public}
                        onChange={(event) =>
                          updateForm("consent_public", event.target.checked)
                        }
                        disabled={isSubmitting}
                      />
                      <span>
                        인스타그램 등 홍보 콘텐츠에 익명으로 활용해도 괜찮습니다. 이름이나
                        아이디는 기본적으로 노출하지 않습니다.
                      </span>
                    </label>
                    <label className="review-check">
                      <input
                        type="checkbox"
                        checked={form.consent_contact}
                        onChange={(event) =>
                          updateForm("consent_contact", event.target.checked)
                        }
                        disabled={isSubmitting}
                      />
                      <span>필요하면 추가 인터뷰 요청을 받아도 괜찮습니다.</span>
                    </label>
                  </div>

                  <div className="review-actions">
                    <p className="review-message">{message}</p>
                    <button
                      type="submit"
                      className="review-submit"
                      disabled={isSubmitting || isLoadingClasses}
                    >
                      {isSubmitting ? "후기 보내는 중..." : "후기 보내기"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
