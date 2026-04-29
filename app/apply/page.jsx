"use client";

import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

export default function ApplyPage() {
  const PRICE = 240000;

  const [selectedClass, setSelectedClass] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);

  useEffect(() => {
    if (!selectedClass) {
      setCapacity(null);
      return;
    }

    const checkCapacity = async () => {
      setIsCheckingCapacity(true);

      try {
        const response = await fetch(
          `/api/applications/capacity?classType=${encodeURIComponent(
            selectedClass
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data);
          setCapacity(null);
          return;
        }

        setCapacity(data);
      } catch (error) {
        console.error(error);
        setCapacity(null);
      } finally {
        setIsCheckingCapacity(false);
      }
    };

    checkCapacity();
  }, [selectedClass]);

  const handlePayment = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const name = formData.get("name");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const classType = formData.get("classType");
    const job = formData.get("job") || "";
    const level = formData.get("level") || "";
    const message = formData.get("message") || "";

    if (!name || !phone || !email || !classType) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    try {
      const capacityResponse = await fetch(
        `/api/applications/capacity?classType=${encodeURIComponent(classType)}`
      );
      const capacityData = await capacityResponse.json();

      if (!capacityResponse.ok) {
        alert(capacityData.message || "정원 확인 중 오류가 발생했습니다.");
        return;
      }

      if (capacityData.isFull) {
        alert("해당 강의는 정원이 마감되었습니다.");
        setCapacity(capacityData);
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!clientKey) {
        alert("토스페이먼츠 Client Key가 설정되지 않았습니다.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      const orderId = `goyo_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const orderName = `${classType} 수강권`;

      const params = new URLSearchParams({
        name: String(name),
        phone: String(phone),
        email: String(email),
        classType: String(classType),
        job: String(job),
        level: String(level),
        message: String(message),
      });

      const siteUrl = window.location.origin;;

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: PRICE,
        },
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
    }
  };

  const isFull = capacity?.isFull;

  return (
    <main className="apply-page">
      <section className="apply-card">
        <span className="apply-label">D5렌더링 강의</span>

        <h1>강의 신청</h1>

        <p className="apply-description">
          안녕하세요. 고요입니다.
          <br />
          강의는 원데이 클래스로 하루 6시간 동안 진행됩니다.
          <br />
          아래 정보를 작성해주시고 원하시는 강의를 선택 후 결제 완료되면
          수강신청이 완료됩니다.
          <br />
          소수(정원8명)로 진행되는 강의라 신중한 신청 부탁드립니다.
          <br />
          감사합니다 :D
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
              <label htmlFor="classType">신청 강의 *</label>
              <select
                id="classType"
                name="classType"
                required
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">강의를 선택해주세요</option>
                <option value="[ 05/15 ] D5 투시도(초급반)">
                  [ 05/15 ] D5 투시도(초급반) - 24만원
                </option>
                <option value="[ 05/22 ] D5 조감도(중급반)">
                  [ 05/22 ] D5 조감도(중급반) - 24만원
                </option>
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

          {selectedClass && (
            <div className={`capacity-box ${isFull ? "full" : ""}`}>
              {isCheckingCapacity && <p>정원을 확인하고 있습니다...</p>}

              {!isCheckingCapacity && capacity && !capacity.isFull && (
                <>
                  <strong>
                    현재 {capacity.paidCount} / {capacity.maxCapacity}명 신청 완료
                  </strong>
                  <p>남은 자리 {capacity.remaining}명</p>
                </>
              )}

              {!isCheckingCapacity && capacity?.isFull && (
                <>
                  <strong>마감되었습니다.</strong>
                  <p>해당 강의는 정원 {capacity.maxCapacity}명이 모두 신청 완료되었습니다.</p>
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
            ></textarea>
          </div>
<div className="apply-final">
  <p>✓ 6시간 원데이 집중 강의</p>
  <p>✓ 실무에 바로 적용 가능</p>
  <p>✓ 소수 정예 피드백</p>
</div>
          <button
            type="submit"
            className="submit-button"
            disabled={isFull || isCheckingCapacity}
          >
            {isFull ? "마감되었습니다" : "강의 결제하기"}
          </button>

          <p className="apply-notice">
            정원은 기수별 8명이며, 결제 완료 순으로 최종 확정됩니다.
          </p>
        </form>
      </section>
    </main>
  );
}