"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk";
import {
  formatClassOptionLabel,
  formatClassSnapshot,
} from "../lib/class-format";

function getSiteUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "";
}

export default function ApplyPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isLoadingWidget, setIsLoadingWidget] = useState(false);
  const [widgetError, setWidgetError] = useState("");
  const latestCapacityRequestRef = useRef(0);
  const widgetsRef = useRef(null);
  const paymentWidgetRef = useRef(null);
  const agreementWidgetRef = useRef(null);
  const renderedClassIdRef = useRef("");

  const selectedClass =
    classes.find((item) => item.id === selectedClassId) || null;
  const isFull = capacity?.isFull;
  const formBusy =
    isLoadingClasses ||
    isCheckingCapacity ||
    isStartingPayment ||
    isLoadingWidget;

  const fetchCapacity = async (classId) => {
    const requestId = Date.now() + Math.random();
    latestCapacityRequestRef.current = requestId;
    setIsCheckingCapacity(true);

    try {
      const response = await fetch(
        `/api/applications/capacity?classId=${encodeURIComponent(classId)}`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (latestCapacityRequestRef.current !== requestId) {
        return null;
      }

      if (!response.ok) {
        setCapacity(null);
        return {
          error: data.message || "정원 확인 중 오류가 발생했습니다.",
        };
      }

      setCapacity(data);
      return data;
    } catch (error) {
      if (latestCapacityRequestRef.current === requestId) {
        setCapacity(null);
      }

      console.error(error);
      return {
        error: "정원 확인 중 오류가 발생했습니다.",
      };
    } finally {
      if (latestCapacityRequestRef.current === requestId) {
        setIsCheckingCapacity(false);
      }
    }
  };

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch("/api/classes", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "강의 목록을 불러오지 못했습니다.");
          return;
        }

        setClasses(data);
      } catch (error) {
        console.error(error);
        alert("강의 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    void loadClasses();
  }, []);

  useEffect(() => {
    const setupWidgets = async () => {
      if (!selectedClass) {
        setWidgetError("");
        renderedClassIdRef.current = "";
        return;
      }

      const widgetClientKey = process.env.NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY;

      if (!widgetClientKey) {
        setWidgetError(
          "토스 결제위젯 키가 설정되지 않았습니다. NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY를 추가해주세요."
        );
        return;
      }

      try {
        setIsLoadingWidget(true);
        setWidgetError("");

        if (!widgetsRef.current) {
          const tossPayments = await loadTossPayments(widgetClientKey);
          widgetsRef.current = tossPayments.widgets({ customerKey: ANONYMOUS });
        }

        await widgetsRef.current.setAmount({
          currency: "KRW",
          value: Number(selectedClass.price),
        });

        if (renderedClassIdRef.current !== selectedClass.id) {
          if (paymentWidgetRef.current?.destroy) {
            await paymentWidgetRef.current.destroy();
            paymentWidgetRef.current = null;
          }

          if (agreementWidgetRef.current?.destroy) {
            await agreementWidgetRef.current.destroy();
            agreementWidgetRef.current = null;
          }

          const paymentVariantKey =
            process.env.NEXT_PUBLIC_TOSS_WIDGET_VARIANT_KEY || undefined;
          const agreementVariantKey =
            process.env.NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY || undefined;

          paymentWidgetRef.current =
            await widgetsRef.current.renderPaymentMethods({
              selector: "#toss-payment-methods",
              variantKey: paymentVariantKey,
            });

          agreementWidgetRef.current = await widgetsRef.current.renderAgreement({
            selector: "#toss-agreement",
            variantKey: agreementVariantKey,
          });

          renderedClassIdRef.current = selectedClass.id;
        }
      } catch (error) {
        console.error(error);
        setWidgetError(
          error?.message ||
            "결제 위젯을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setIsLoadingWidget(false);
      }
    };

    void setupWidgets();
  }, [selectedClass]);

  const handleClassChange = (event) => {
    const nextClassId = event.target.value;

    setSelectedClassId(nextClassId);
    setCapacity(null);
    setWidgetError("");

    if (!nextClassId) {
      latestCapacityRequestRef.current += 1;
      setIsCheckingCapacity(false);
      return;
    }

    void fetchCapacity(nextClassId);
  };

  const handlePayment = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget.closest("form");

    if (!formElement) {
      return;
    }

    const formData = new FormData(formElement);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const classId = formData.get("classId");
    const job = formData.get("job") || "";
    const level = formData.get("level") || "";
    const message = formData.get("message") || "";
    const selected = classes.find((item) => item.id === classId);

    if (!name || !phone || !email || !classId || !selected) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    if (!widgetsRef.current) {
      alert(
        widgetError ||
          "결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    try {
      setIsStartingPayment(true);

      const capacityData = await fetchCapacity(classId);

      if (capacityData?.error) {
        alert(capacityData.error);
        return;
      }

      if (!capacityData) {
        alert("정원 확인 중 오류가 발생했습니다.");
        return;
      }

      if (capacityData.isFull) {
        alert("해당 강의는 정원이 마감되었습니다.");
        return;
      }

      const orderId = `goyo_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const classSnapshot = formatClassSnapshot(selected);
      const orderName = `${classSnapshot} 수강권`;
      const siteUrl = getSiteUrl();

      sessionStorage.setItem(
        `pending_payment_${orderId}`,
        JSON.stringify({
          name: String(name),
          phone: String(phone),
          email: String(email),
          classId: String(classId),
          classType: classSnapshot,
          job: String(job),
          level: String(level),
          message: String(message),
        })
      );

      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        successUrl: `${siteUrl}/payment/success`,
        failUrl: `${siteUrl}/payment/fail`,
        customerEmail: String(email),
        customerName: String(name),
        customerMobilePhone: String(phone).replace(/\D/g, ""),
      });
    } catch (error) {
      console.error(error);
      const details = [error?.code, error?.message].filter(Boolean).join(" / ");

      alert(
        details
          ? `결제창을 여는 중 문제가 발생했습니다.\n${details}`
          : "결제창을 여는 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsStartingPayment(false);
    }
  };

  return (
    <main className="apply-page">
      <section className="apply-card">
        <span className="apply-label">D5 원데이 클래스</span>
        <h1>강의 신청</h1>

        <p className="apply-description">
          안녕하세요. 고요입니다.
          <br />
          <br />
          강의는 원데이 클래스로 하루 3시간 동안 진행됩니다.
          <br />
          처음 사용하시는 분들도 따라오실 수 있도록
          <br />
          D5의 기초부터 각 이미지에 맞는 표현법까지 다루고 있습니다.
        </p>

        <form className="apply-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">이름 *</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">연락처 *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 *</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="classId">신청 강의 *</label>
              <select
                id="classId"
                name="classId"
                required
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="">
                  {isLoadingClasses
                    ? "강의 목록을 불러오는 중..."
                    : "강의를 선택해주세요"}
                </option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {formatClassOptionLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="job">현재 상태</label>
              <select id="job" name="job">
                <option value="">선택해주세요</option>
                <option value="student">학생</option>
                <option value="job-seeker">취준생</option>
                <option value="working">실무자</option>
                <option value="freelancer">프리랜서</option>
                <option value="other">기타</option>
              </select>
            </div>
          </div>

          {selectedClassId ? (
            <div className={`capacity-box ${isFull ? "full" : ""}`}>
              {isCheckingCapacity ? <p>정원을 확인하고 있습니다...</p> : null}

              {!isCheckingCapacity && capacity && !capacity.isFull ? (
                <>
                  <strong>
                    현재 {capacity.paidCount} / {capacity.capacity}명 신청 완료
                  </strong>
                  <p>남은 자리 {capacity.remaining}명</p>
                </>
              ) : null}

              {!isCheckingCapacity && capacity?.isFull ? (
                <>
                  <strong>마감되었습니다</strong>
                  <p>해당 강의는 정원에 도달했습니다.</p>
                </>
              ) : null}
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="level">프로그램 사용 경험</label>
            <select id="level" name="level">
              <option value="">선택해주세요</option>
              <option value="beginner">처음 사용</option>
              <option value="basic">기초 사용 가능</option>
              <option value="intermediate">어느 정도 사용 가능</option>
              <option value="advanced">실무에서 사용 중</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">궁금한 점 / 배우고 싶은 내용</label>
            <textarea
              id="message"
              name="message"
              placeholder="강의를 통해 배우고 싶은 내용이나 현재 어려운 점을 적어주세요."
            />
          </div>

          <div className="apply-final">
            <p>총 3시간 원데이 집중 강의</p>
            <p>실무에 바로 적용 가능</p>
            <p>소수 정예 피드백</p>
          </div>

          {selectedClass ? (
            <div className="widget-section">
              <p className="payment-review-notice">
                아래에서 결제수단을 선택한 뒤 결제를 진행해주세요.
              </p>
              <div id="toss-payment-methods" className="toss-widget-box" />
              <div
                id="toss-agreement"
                className="toss-widget-box toss-agreement-box"
              />
            </div>
          ) : null}

          {widgetError ? (
            <p className="payment-review-notice" style={{ color: "#c45e42" }}>
              {widgetError}
            </p>
          ) : null}

          <button
            type="button"
            className="submit-button payment-primary-button"
            onClick={handlePayment}
            disabled={
              formBusy || !selectedClassId || isFull || Boolean(widgetError)
            }
          >
            {isFull
              ? "마감되었습니다"
              : isLoadingWidget
                ? "결제 위젯을 불러오고 있습니다..."
                : isStartingPayment
                  ? "결제를 준비하고 있습니다..."
                  : "강의 결제하기"}
          </button>

          <p className="payment-review-notice">
            카드 결제가 완료되면 신청이 최종 확정됩니다.
          </p>

          <div className="refund-policy-box">
            <p className="refund-policy-summary">
              결제 전에 환불 기준을 꼭 확인해 주세요.
              <br />
              수업 7일 전까지는 전액 환불, 3일 전까지는 50% 환불, 그
              이후에는 환불이 어렵습니다.
            </p>
            <Link href="/refund-policy" className="refund-policy-link">
              환불정책 보기
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
