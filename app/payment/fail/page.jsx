"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentFailPage() {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>PAYMENT FAILED</p>
        <h1 style={styles.title}>결제가 완료되지 않았습니다.</h1>

        <p style={styles.text}>
          결제가 취소되었거나 실패했습니다.
          <br />
          다시 신청을 진행해주세요.
        </p>

        {(code || message) && (
          <div style={styles.infoBox}>
            {code && <p>오류코드: {code}</p>}
            {message && <p>오류내용: {message}</p>}
          </div>
        )}

        <a href="/apply" style={styles.button}>
          다시 결제하기
        </a>
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