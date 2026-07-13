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
      const storedPayload = orderId
        ? sessionStorage.getItem(`pending_payment_${orderId}`)
        : null;
      const checkoutPayload = storedPayload ? JSON.parse(storedPayload) : null;

      if (!paymentKey || !orderId || !amount) {
        setStatus("error");
        setErrorMessage("Invalid payment information.");
        return;
      }

      const alreadyConfirmed = sessionStorage.getItem(`confirmed_${orderId}`);

      if (alreadyConfirmed) {
        setStatus("success");
        setPaymentData({
          orderId,
          totalAmount: Number(amount),
          method: "Already confirmed",
        });
        return;
      }

      try {
        if (!checkoutPayload?.classId) {
          throw new Error(
            "Application data is missing. Please try the payment again."
          );
        }

        const response = await fetch("/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            name: checkoutPayload.name || "",
            phone: checkoutPayload.phone || "",
            email: checkoutPayload.email || "",
            classId: checkoutPayload.classId || "",
            classType: checkoutPayload.classType || "",
            job: checkoutPayload.job || "",
            level: checkoutPayload.level || "",
            message: checkoutPayload.message || "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment confirmation failed.");
        }

        sessionStorage.setItem(`confirmed_${orderId}`, "true");
        sessionStorage.removeItem(`pending_payment_${orderId}`);
        setPaymentData(data);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error?.message || "An error occurred while confirming payment."
        );
        setStatus("error");
      }
    };

    void confirmPayment();
  }, [searchParams]);

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        {status === "confirming" ? (
          <>
            <p style={styles.label}>PAYMENT</p>
            <h1 style={styles.title}>Confirming payment</h1>
            <p style={styles.text}>Please wait a moment.</p>
          </>
        ) : null}

        {status === "success" ? (
          <>
            <p style={styles.label}>PAYMENT COMPLETE</p>
            <h1 style={styles.title}>Payment completed</h1>
            <p style={styles.text}>
              Your class application has been received successfully.
              <br />
              A confirmation has been sent to Goyo Studio.
            </p>

            {paymentData ? (
              <div style={styles.infoBox}>
                <p>Order ID: {paymentData.orderId}</p>
                <p>Amount: {paymentData.totalAmount?.toLocaleString()} KRW</p>
                <p>Method: {paymentData.method}</p>
              </div>
            ) : null}

            <Link href="/" style={styles.button}>
              Back to home
            </Link>
          </>
        ) : null}

        {status === "error" ? (
          <>
            <p style={styles.label}>PAYMENT ERROR</p>
            <h1 style={styles.title}>Payment confirmation failed</h1>
            <p style={styles.text}>
              If payment was completed but this screen is shown, please contact
              Goyo Studio.
            </p>
            {errorMessage ? <p style={styles.errorText}>{errorMessage}</p> : null}
            <Link href="/apply" style={styles.button}>
              Try again
            </Link>
          </>
        ) : null}
      </section>
    </main>
  );
}

function PaymentLoading() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>PAYMENT</p>
        <h1 style={styles.title}>Checking payment information</h1>
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
