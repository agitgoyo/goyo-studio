"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("confirming");
  const [paymentData, setPaymentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMessage("결제 정보가 올바르지 않습니다.");
        return;
      }

      const alreadyConfirmed = sessionStorage.getItem(`confirmed_${orderId}`);

      if (alreadyConfirmed) {
        setStatus("success");
        setPaymentData({
          orderId,
          totalAmount: Number(amount),
          method: "확인 완료",
        });
        return;
      }

      try {
        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            name: searchParams.get("name") || "",
            phone: searchParams.get("phone") || "",
            email: searchParams.get("email") || "",
            classId: searchParams.get("classId") || "",
            classType: searchParams.get("classType") || "",
            job: searchParams.get("job") || "",
            level: searchParams.get("level") || "",
            message: searchParams.get("message") || "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "결제 승인에 실패했습니다.");
        }

        sessionStorage.setItem(`confirmed_${orderId}`, "true");
        setPaymentData(data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setErrorMessage(error?.message || "결제 승인 중 오류가 발생했습니다.");
        setStatus("error");
      }
    };

    void confirmPayment();
  }, [searchParams]);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {status === "confirming" && (
          <>
            <p style={styles.label}>PAYMENT</p>
            <h1 style={styles.title}>결제 승인 중입니다.</h1>
            <p style={styles.text}>잠시만 기다려주세요.</p>
          </>
        )}

        {status === "success" && (
          <>
            <p style={styles.label}>PAYMENT COMPLETE</p>
            <h1 style={styles.title}>강의 결제가 완료되었습니다.</h1>
            <p style={styles.text}>
              수강 신청이 정상적으로 접수되었습니다.
              <br />
              신청 정보가 고요스튜디오 메일로 전송되었습니다.
            </p>

            {paymentData && (
              <div style={styles.infoBox}>
                <p>주문번호: {paymentData.orderId}</p>
                <p>결제금액: {paymentData.totalAmount?.toLocaleString()}원</p>
                <p>결제수단: {paymentData.method}</p>
              </div>
            )}

            <Link href="/" style={styles.button}>
              메인으로 돌아가기
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <p style={styles.label}>PAYMENT ERROR</p>
            <h1 style={styles.title}>결제 승인에 실패했습니다.</h1>
            <p style={styles.text}>
              결제는 되었는데 이 화면이 보인다면, 고요스튜디오에 문의해주세요.
            </p>
            {errorMessage ? <p style={styles.errorText}>{errorMessage}</p> : null}
            <Link href="/apply" style={styles.button}>
              다시 시도하기
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

function PaymentLoading() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>PAYMENT</p>
        <h1 style={styles.title}>결제 정보를 확인 중입니다.</h1>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111",
    color: "#f5f1e8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  card: {
    width: "100%",
    maxWidth: "720px",
    background: "#1b1b1b",
    borderRadius: "28px",
    padding: "56px",
    textAlign: "center",
  },
  label: {
    color: "#d88b3a",
    fontWeight: 800,
    letterSpacing: "0.18em",
    fontSize: "13px",
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.2,
    margin: "18px 0",
  },
  text: {
    color: "#cfc8ba",
    lineHeight: 1.8,
  },
  errorText: {
    color: "#f0b3b3",
    lineHeight: 1.7,
    marginTop: "12px",
  },
  infoBox: {
    marginTop: "30px",
    padding: "22px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.06)",
    color: "#f5f1e8",
    textAlign: "left",
  },
  button: {
    display: "inline-flex",
    marginTop: "32px",
    height: "52px",
    padding: "0 28px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#f5f1e8",
    color: "#111",
    textDecoration: "none",
    fontWeight: 800,
  },
};
