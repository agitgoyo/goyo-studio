"use client";

import { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";

export default function ApplyPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  const selectedClass = classes.find((item) => item.id === selectedClassId);
  const isFull = capacity?.isFull;

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetch("/api/classes");
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

    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setCapacity(null);
      return;
    }

    const checkCapacity = async () => {
      setIsCheckingCapacity(true);

      try {
        const response = await fetch(
          `/api/applications/capacity?classId=${encodeURIComponent(
            selectedClassId
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
  }, [selectedClassId]);

  const handlePayment = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget.closest("form");
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
      const capacityResponse = await fetch(
        `/api/applications/capacity?classId=${encodeURIComponent(classId)}`
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

      const orderName = `[ ${selected.date} ] ${selected.title} 수강권`;

      const params = new URLSearchParams({
        name: String(name),
        phone: String(phone),
        email: String(email),
        classId: String(classId),
        classType: `[ ${selected.date} ] ${selected.title}`,
        job: String(job),
        level: String(level),
        message: String(message),
      });

      const siteUrl = window.location.origin;

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: Number(selected.price),
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
        classType: `[ ${selected.date} ] ${selected.title}`,
        job,
        level,
        message,
        amount: selected.price,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "신청 접수에 실패했습니다.");
      return;
    }

    alert("수강신청이 접수되었습니다. 계좌이체 안내를 별도로 전달드릴게요.");
    formElement.reset();
    setSelectedClassId("");
    setCapacity(null);
  } catch (error) {
    console.error(error);
    alert("신청 접수 중 문제가 발생했습니다. 다시 시도해주세요.");
  }
};
  return (
    <main className="apply-page">
      <section className="apply-card">
        <span className="apply-label">D5렌더링 강의</span>

        <h1>강의 신청</h1>

        <p className="apply-description">
          안녕하세요. 고요입니다.
          <br />
          강의는 원데이 클래스로 하루 5시간 동안 진행됩니다.
          <br /><br />
          아래 정보를 작성해주시고 원하시는 강의를 선택 후<br /> 신청해주시면
          선착순 8명에 한하여 결제안내를 해드립니다.
          <br /><br />
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
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">
                  {isLoadingClasses
                    ? "강의 목록을 불러오는 중..."
                    : "강의를 선택해주세요"}
                </option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    [ {item.date} ] {item.title} -{" "}
                    {Number(item.price).toLocaleString()}원
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
                    해당 강의는 정원 {capacity.capacity}명이 모두 신청
                    완료되었습니다.
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
            ></textarea>
          </div>

          <div className="apply-final">
            <p>✓ 5시간 원데이 집중 강의</p>
            <p>✓ 실무에 바로 적용 가능</p>
            <p>✓ 소수 정예 피드백</p>
          </div>

<button
  type="button"
  className="submit-button payment-review-button"
  onClick={handlePayment}
  disabled={
    isLoadingClasses ||
    isCheckingCapacity ||
    !selectedClassId ||
    isFull
  }
>
  강의 결제하기
</button>

<p className="payment-review-notice">
  현재 카드 결제 시스템은 심사 중입니다. 정식 오픈 전까지는 아래
  <strong> 수강신청 보내기</strong> 버튼을 이용해주세요.
</p>

<button
  type="submit"
  className="submit-button bank-button"
  disabled={
    isLoadingClasses ||
    isCheckingCapacity ||
    !selectedClassId ||
    isFull
  }
>
  {isFull ? "마감되었습니다" : "수강신청 보내기"}
</button>





          <p className="apply-notice">
            결제 안내 문자를 받으시고 결제를 완료해주셔야 수강신청이 확정됩니다.
          </p>
        </form>
      </section>
    </main>
  );
}