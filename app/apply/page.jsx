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
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [isStartingPayment, setIsStartingPayment] = useState(false);
  const latestCapacityRequestRef = useRef(0);

  const isFull = capacity?.isFull;
  const formBusy =
    isLoadingClasses ||
    isCheckingCapacity ||
    isSubmittingApplication ||
    isStartingPayment;

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
        return { error: data.message || "Failed to check seats." };
      }

      setCapacity(data);
      return data;
    } catch (error) {
      if (latestCapacityRequestRef.current === requestId) {
        setCapacity(null);
      }

      console.error(error);
      return { error: "Failed to check seats." };
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
          alert(data.message || "Could not load classes.");
          return;
        }

        setClasses(data);
      } catch (error) {
        console.error(error);
        alert("An error occurred while loading classes.");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    void loadClasses();
  }, []);

  const handleClassChange = (event) => {
    const nextClassId = event.target.value;

    setSelectedClassId(nextClassId);
    setCapacity(null);

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
      alert("Please fill in all required fields.");
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
        alert("Failed to check seats.");
        return;
      }

      if (capacityData.isFull) {
        alert("This class is sold out.");
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!clientKey) {
        alert("NEXT_PUBLIC_TOSS_CLIENT_KEY is not set.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });
      const orderId = `goyo_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      const classSnapshot = formatClassSnapshot(selected);
      const orderName = `${classSnapshot} ticket`;
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
        customerMobilePhone: String(phone).replace(/\D/g, ""),
        successUrl: `${siteUrl}/payment/success`,
        failUrl: `${siteUrl}/payment/fail`,
        windowTarget: "self",
        card: {
          useEscrow: false,
          flowMode: "DEFAULT",
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error(error);
      const details = [error?.code, error?.message].filter(Boolean).join(" / ");

      alert(
        details
          ? `Failed to open the payment window.\n${details}`
          : "Failed to open the payment window. Please try again."
      );
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
      alert("Please fill in all required fields.");
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
        alert(data.message || "Failed to submit the application.");

        if (response.status === 409 && selectedClassId) {
          await fetchCapacity(selectedClassId);
        }

        return;
      }

      alert(
        "Your application has been submitted. We will send payment and class details by email."
      );
      formElement.reset();
      setSelectedClassId("");
      setCapacity(null);
      latestCapacityRequestRef.current += 1;
      setIsCheckingCapacity(false);
    } catch (error) {
      console.error(error);
      alert("There was a problem submitting your application.");
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  return (
    <main className="apply-page">
      <section className="apply-card">
        <span className="apply-label">D5 One-day Class</span>
        <h1>Apply for Class</h1>

        <p className="apply-description">
          Hello, this is Goyo.
          <br />
          <br />
          This is a one-day class that runs for 3 hours.
          <br />
          It is designed so beginners can follow along,
          <br />
          covering D5 basics through image-specific expression methods.
        </p>

        <form className="apply-form" onSubmit={handleSubmitApplication}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
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
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="classId">Class *</label>
              <select
                id="classId"
                name="classId"
                required
                value={selectedClassId}
                onChange={handleClassChange}
              >
                <option value="">
                  {isLoadingClasses ? "Loading classes..." : "Select a class"}
                </option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {formatClassOptionLabel(item)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="job">Current Status</label>
              <select id="job" name="job">
                <option value="">Select</option>
                <option value="student">Student</option>
                <option value="job-seeker">Job Seeker</option>
                <option value="working">Working</option>
                <option value="freelancer">Freelancer</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {selectedClassId ? (
            <div className={`capacity-box ${isFull ? "full" : ""}`}>
              {isCheckingCapacity ? <p>Checking seats...</p> : null}

              {!isCheckingCapacity && capacity && !capacity.isFull ? (
                <>
                  <strong>
                    {capacity.paidCount} / {capacity.capacity} seats booked
                  </strong>
                  <p>{capacity.remaining} seats left</p>
                </>
              ) : null}

              {!isCheckingCapacity && capacity?.isFull ? (
                <>
                  <strong>Sold out</strong>
                  <p>This class has reached its capacity.</p>
                </>
              ) : null}
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="level">Experience Level</label>
            <select id="level" name="level">
              <option value="">Select</option>
              <option value="beginner">First time</option>
              <option value="basic">Basic usage</option>
              <option value="intermediate">Some experience</option>
              <option value="advanced">Using for work</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Questions / What you want to learn</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell us what you want to learn or what feels difficult right now."
            />
          </div>

          <div className="apply-final">
            <p>3-hour focused one-day class</p>
            <p>Practical and work-ready</p>
            <p>Small-group feedback</p>
          </div>

          <button
            type="button"
            className="submit-button payment-primary-button"
            onClick={handlePayment}
            disabled={formBusy || !selectedClassId || isFull}
          >
            {isFull
              ? "Sold out"
              : isStartingPayment
                ? "Preparing payment..."
                : "Pay for Class"}
          </button>

          <p className="payment-review-notice">
            Your booking is confirmed after card payment is completed.
          </p>

          <button
            type="submit"
            className="submit-button bank-button"
            disabled={formBusy || !selectedClassId || isFull}
          >
            {isFull
              ? "Sold out"
              : isSubmittingApplication
                ? "Submitting..."
                : "Submit Application Only"}
          </button>

          <p className="apply-notice">
            If you want to send the application first without payment, use the
            button above and we will email you the next steps.
          </p>

          <div className="refund-policy-box">
            <p className="refund-policy-summary">
              Please check the refund policy before payment.
              <br />
              Full refund up to 7 days before class, 50% refund up to 3 days
              before class, and no refund after that.
            </p>
            <Link href="/refund-policy" className="refund-policy-link">
              View refund policy
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
