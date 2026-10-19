/** Mail failure must never turn a saved application/payment into a failed checkout. */
export async function sendApplicationNotification(application, fetcher = fetch) {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) {
    console.error("Application notification failed: GOOGLE_SCRIPT_URL is missing");
    return "failed";
  }
  const paid = application.paymentStatus === "결제 완료";
  const payload = new URLSearchParams({
    formType: "강의 신청",
    notificationSubject: "새로운 강의신청이 도착했습니다.",
    ...application,
    autoReplyEnabled: "true",
    autoReplyTo: application.email || "",
    autoReplyName: application.name || "",
    autoReplyClassType: application.classType || "",
    autoReplyPaymentStatus: application.paymentStatus,
    autoReplySubject: paid
      ? "[GOYO STUDIO] 강의 신청 및 결제가 완료되었습니다."
      : "[GOYO STUDIO] 수강신청이 접수되었습니다.",
  });
  if (process.env.GOOGLE_SCRIPT_TOKEN) payload.set("token", process.env.GOOGLE_SCRIPT_TOKEN);
  try {
    const response = await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload,
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    // Apps Script can return an HTML error page with HTTP 200.
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error("Mail service rejected the notification");
    return "sent";
  } catch {
    // Do not put applicant details, payment keys, or endpoint tokens in logs.
    console.error("Application notification failed: mail service did not confirm delivery");
    return "failed";
  }
}
