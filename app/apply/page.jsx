"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { formatClassOptionLabel, formatClassSnapshot } from "../lib/class-format";

export default function ApplyPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const [isPreparingPaymentWidget, setIsPreparingPaymentWidget] = useState(false);
  const [paymentWidgetError, setPaymentWidgetError] = useState("");
  const latestCapacityRequestRef = useRef(0);
  const widgetsRef = useRef(null);
  const paymentMethodWidgetRef = useRef(null);
  const agreementWidgetRef = useRef(null);

  const selectedClass = classes.find((item) => item.id === selectedClassId) || null;
  const isFull = capacity?.isFull;
  const formBusy =
    isLoadingClasses ||
    isCheckingCapacity ||
    isSubmittingApplication ||
    isStartingPayment ||
    isPreparingPaymentWidget;

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
        const response = await fetch("/api/classes", { cache: "no-store" });
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
    let cancelled = false;

    const destroyWidgets = async () => {
      widgetsRef.current = null;

      const widgetsToDestroy = [
        paymentMethodWidgetRef.current,
        agreementWidgetRef.current,
      ].filter(Boolean);

      paymentMethodWidgetRef.current = null;
      agreementWidgetRef.current = null;

      if (!widgetsToDestroy.length) {
        return;
      }

      await Promise.allSettled(widgetsToDestroy.map((widget) => widget.destroy()));
    };

    const setupPaymentWidget = async () => {
      await destroyWidgets();

      if (!selectedClass || isFull) {
        setPaymentWidgetError("");
        setIsPreparingPaymentWidget(false);
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!clientKey) {
        setPaymentWidgetError("토스페이먼츠 Client Key가 설정되지 않았습니다.");
        setIsPreparingPaymentWidget(false);
        return;
      }

      try {
        setIsPreparingPaymentWidget(true);
        setPaymentWidgetError("");

        const tossPayments = await loadTossPayments(clientKey);

        if (cancelled) {
          return;
        }

        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        await widgets.setAmount({
          currency: "KRW",
          value: Number(selectedClass.price),
        });

        if (cancelled) {
          return;
        }

        const paymentMethodWidget = await widgets.renderPaymentMethods({
          selector: "#payment-method",
        });
        const agreementWidget = await widgets.renderAgreement({
          selector: "#agreement",
        });

        if (cancelled) {
          await Promise.allSettled([
            paymentMethodWidget.destroy(),
            agreementWidget.destroy(),
          ]);
          return;
        }

        widgetsRef.current = widgets;
        paymentMethodWidgetRef.current = paymentMethodWidget;
        agreementWidgetRef.current = agreementWidget;
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setPaymentWidgetError(
            "결제 위젯을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
          );
        }
      } finally {
        if (!cancelled) {
          setIsPreparingPaymentWidget(false);
        }
      }
    };

    void setupPaymentWidget();

    return () => {
      cancelled = true;
      void destroyWidgets();
    };
  }, [selectedClass, isFull]);

  const handleClassChange = (event) => {
    const nextClassId = event.target.value;

    setSelectedClassId(nextClassId);
    setCapacity(null);

    if (!nextClassId) {
      latestCapacityRequestRef.current += 1;
      setIsCheckingCapacity(false);
      setPaymentWidgetError("");
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

      if (!widgetsRef.current) {
        alert("결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.");
        return;
      }

      const orderId = `goyo_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const classSnapshot = formatClassSnapshot(selected);
      const orderName = `${classSnapshot} 수강권`;
      const params = new URLSearchParams({
        name: String(name),
        phone: String(phone),
        email: String(email),
        classId: String(classId),
        classType: classSnapshot,
        job: String(job),
        level: String(level),
        message: String(message),
      });
      const siteUrl = window.location.origin;

      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        customerName: String(name),
        customerEmail: String(email),
        customerMobilePhone: String(phone).replaceAll("-", ""),
        successUrl: `${siteUrl}/payment/success?${params.toString()}`,
        failUrl: `${siteUrl}/payment/fail`,
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

      const response = await fetch("/api/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        "수강신청이 정상적으로 접수되었습니다. 메일로 결제 및 수강안내를 보내드렸으니 확인 부탁드립니다. ^^"
      );
      formElement.reset();
      setSelectedClassId("");
      setCapacity(null);
      setPaymentWidgetError("");
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
        <span className="apply-label">D5 렌더링 강의</span>
        <h1>강의 신청</h1>

        <p className="apply-description">
          안녕하세요. 고요입니다.
          <br />
          <br />
          강의는 원데이 클래스로 하루 3시간 동안 진행됩니다.
          <br />
          처음 사용하시는 분들도 따라오실 수 있도록
          <br />
          D5의 처음부터 각 이미지에 맞는 표현법까지의 방법을 다루고 있습니다.
          <br />
          <br />
          아래 정보를 작성해주시고 원하시는 강의를 선택해 주세요.
          <br />
          카드 결제 완료 후 수강신청이 최종 확정됩니다.
          <br />
          <br />
          소수 정예로 진행되는 강의라 신중한 신청 부탁드립니다.
          <br />
          감사합니다 :D
        </p>

        <form className="apply-form" onSubmit={handleSubmitApplication}>
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
                <option value="학생">학생</option>
                <option value="취준생">취준생</option>
                <option value="실무자">실무자</option>
                <option value="프리랜서">프리랜서</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          {selectedClassId && (
            <div className={`capacity-box ${isFull ? "full" : ""}`}>
              {isCheckingCapacity && <p>정원을 확인하고 있습니다...</p>}

              {!isCheckingCapacity && capacity && !capacity.isFull && (
                <>
                  <strong>
                    현재 {capacity.paidCount} / {capacity.capacity}명 신청 완료
                  </strong>
                  <p>남은 자리 {capacity.remaining}명</p>
                </>
              )}

              {!isCheckingCapacity && capacity?.isFull && (
                <>
                  <strong>마감되었습니다.</strong>
                  <p>
                    해당 강의는 정원 {capacity.capacity}명이 모두 신청 완료되었습니다.
                  </p>
                </>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="level">프로그램 사용 경험</label>
            <select id="level" name="level">
              <option value="">선택해주세요</option>
              <option value="처음 사용">처음 사용</option>
              <option value="기초 사용 가능">기초 사용 가능</option>
              <option value="어느 정도 사용 가능">어느 정도 사용 가능</option>
              <option value="실무에서 사용 중">실무에서 사용 중</option>
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

          {selectedClassId && !isFull && (
            <div className="payment-widget-section">
              <p className="payment-widget-notice">
                아래에서 결제수단을 선택한 뒤 결제를 진행해주세요.
              </p>
              <div id="payment-method" className="payment-widget-box" />
              <div id="agreement" className="payment-agreement-box" />

              {isPreparingPaymentWidget && (
                <p className="payment-widget-helper">
                  결제수단을 불러오는 중입니다...
                </p>
              )}

              {paymentWidgetError && (
                <p className="payment-widget-error">{paymentWidgetError}</p>
              )}
            </div>
          )}

          <button
            type="button"
            className="submit-button payment-primary-button"
            onClick={handlePayment}
            disabled={formBusy || !selectedClassId || isFull || !!paymentWidgetError}
          >
            {isFull
              ? "마감되었습니다"
              : isStartingPayment
                ? "결제를 준비하고 있습니다..."
                : "강의 결제하기"}
          </button>

          <p className="payment-review-notice">
            카드 결제가 완료되면 신청이 최종 확정됩니다.
          </p>

          <button
            type="submit"
            className="submit-button bank-button"
            disabled={formBusy || !selectedClassId || isFull}
          >
            {isFull
              ? "마감되었습니다"
              : isSubmittingApplication
                ? "신청 접수 중입니다..."
                : "수강 신청만 보내기"}
          </button>

          <p className="apply-notice">
            수강 신청만 먼저 보내고 싶은 경우 위 버튼으로 접수해주시면 안내 메일을 보내드립니다.
          </p>

          <div className="refund-policy-box">
            <p className="refund-policy-summary">
              결제 전에 환불 기준을 꼭 확인해 주세요.
              <br />
              수업 7일 전까지는 전액 환불, 3일 전까지는 50% 환불, 그 이후에는 환불이 어렵습니다.
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
