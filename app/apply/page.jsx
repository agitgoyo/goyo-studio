"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ANONYMOUS, loadTossPayments } from "@tosspayments/tosspayments-sdk";
import {
  formatClassOptionLabel,
  formatClassSnapshot,
} from "../lib/class-format";

function getSiteUrl() {
  return window.location.origin;
}

export default function ApplyPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isLoadingWidget, setIsLoadingWidget] = useState(false);
  const [widgetError, setWidgetError] = useState("");
  const latestCapacityRequestRef = useRef(0);
  const widgetsRef = useRef(null);
  const paymentWidgetRef = useRef(null);
  const agreementWidgetRef = useRef(null);
  const renderedClassIdRef = useRef("");

  const selectedClass = classes.find((item) => item.id === selectedClassId) || null;
  const isFull = capacity?.isFull;
  const formBusy =
    isLoadingClasses ||
    isCheckingCapacity ||
    isSubmittingApplication ||
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

      const clientKey = process.env.NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY;
      if (!clientKey) {
        setWidgetError("결제 시스템을 준비하지 못했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      try {
        setIsLoadingWidget(true);
        setWidgetError("");

        if (!widgetsRef.current) {
          const tossPayments = await loadTossPayments(clientKey);
          widgetsRef.current = tossPayments.widgets({ customerKey: ANONYMOUS });
        }

        await widgetsRef.current.setAmount({
          currency: "KRW",
          value: Number(selectedClass.price),
        });

        if (renderedClassIdRef.current !== selectedClass.id) {
          await paymentWidgetRef.current?.destroy?.();
          await agreementWidgetRef.current?.destroy?.();

          const paymentVariantKey = process.env.NEXT_PUBLIC_TOSS_WIDGET_VARIANT_KEY || undefined;
          const agreementVariantKey = process.env.NEXT_PUBLIC_TOSS_AGREEMENT_VARIANT_KEY || undefined;
          paymentWidgetRef.current = await widgetsRef.current.renderPaymentMethods({
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
        setWidgetError(error?.message || "결제 시스템을 준비하지 못했습니다. 잠시 후 다시 시도해주세요.");
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
    if (!formElement) return;

    const formData = new FormData(formElement);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");

    if (!name || !phone || !email || !selectedClassId || !selectedClass) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    if (!widgetsRef.current) {
      alert(widgetError || "결제 시스템을 준비하고 있습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    try {
      setIsStartingPayment(true);
      const capacityData = await fetchCapacity(selectedClassId);
      if (capacityData?.error) return alert(capacityData.error);
      if (!capacityData) return alert("정원 확인 중 오류가 발생했습니다.");
      if (capacityData.isFull) return alert("해당 강의는 정원이 마감되었습니다.");

      const orderId = `goyo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const reservationResponse = await fetch("/api/payments/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId, name, phone, email, classId: selectedClassId,
          classType: formatClassSnapshot(selectedClass), job: formData.get("job") || "",
          level: formData.get("level") || "", message: formData.get("message") || "",
        }),
      });
      const reservation = await reservationResponse.json();
      if (!reservationResponse.ok) throw new Error(reservation.message || "좌석 예약에 실패했습니다.");
      sessionStorage.setItem(
        `pending_payment_${orderId}`,
        JSON.stringify({
          name: String(name),
          phone: String(phone),
          email: String(email),
          classId: selectedClassId,
          classType: formatClassSnapshot(selectedClass),
          job: String(formData.get("job") || ""),
          level: String(formData.get("level") || ""),
          message: String(formData.get("message") || ""),
        })
      );

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: `${formatClassSnapshot(selectedClass)} 수강권`,
        successUrl: `${getSiteUrl()}/payment/success`,
        failUrl: `${getSiteUrl()}/payment/fail`,
        customerEmail: String(email),
        customerName: String(name),
        customerMobilePhone: String(phone).replace(/\D/g, ""),
      });
    } catch (error) {
      console.error(error);
      alert("결제창을 여는 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsStartingPayment(false);
    }
  };

  const handleSubmitApplication = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
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

    try {
      setIsSubmittingApplication(true);

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

      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          classId,
          classType: formatClassSnapshot(selected),
          job,
          level,
          message,
          amount: selected.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "신청 접수에 실패했습니다.");
        if (response.status === 409 && selectedClassId) {
          await fetchCapacity(selectedClassId);
        }
        return;
      }

      alert(
        "수강 신청이 정상적으로 접수되었습니다. 계좌번호와 결제 안내를 메일로 보내드릴 예정이니 확인 부탁드립니다."
      );
      formElement.reset();
      setSelectedClassId("");
      setCapacity(null);
      latestCapacityRequestRef.current += 1;
      setIsCheckingCapacity(false);
    } catch (error) {
      console.error(error);
      alert("신청 접수 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmittingApplication(false);
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

        <form className="apply-form" onSubmit={handlePayment}>
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

          <button
            type="submit"
            className="submit-button bank-button"
            disabled={formBusy || !selectedClassId || isFull}
          >
            {isFull
              ? "마감되었습니다"
              : isSubmittingApplication
                ? "수강 신청 접수 중입니다..."
                : "수강신청 보내기"}
          </button>

          <p className="payment-review-notice">
            수강 신청 접수 후 계좌번호와 입금 안내를 메일로 보내드립니다.
          </p>

          <div className="payment-review-panel">
            <p className="payment-review-notice">
              <strong>온라인 결제 시스템 심사 중</strong>
              <br />
              심사용으로 카드 결제는 정상 이용하실 수 있습니다.
            </p>
            {selectedClass ? (
              <div className="widget-section">
                <div id="toss-payment-methods" className="toss-widget-box" />
                <div
                  id="toss-agreement"
                  className="toss-widget-box toss-agreement-box"
                />
              </div>
            ) : null}
            <button
              type="submit"
              className="submit-button payment-primary-button"
              disabled={
                formBusy || !selectedClassId || isFull || Boolean(widgetError)
              }
            >
              {isFull
                ? "마감되었습니다"
                : isLoadingWidget
                  ? "결제 시스템 준비 중..."
                  : isStartingPayment
                    ? "결제창을 여는 중..."
                    : "카드로 결제하기 (심사 중)"}
            </button>
            {widgetError ? (
              <p className="payment-review-notice payment-widget-error">
                {widgetError}
              </p>
            ) : null}
          </div>

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
