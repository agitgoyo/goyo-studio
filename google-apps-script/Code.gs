function doPost(e) {
  const data = e.parameter;
  const adminEmail = "agit.goyo@gmail.com";

  const formType = data.formType || "";
  const notificationSubject =
    data.notificationSubject ||
    (formType === "홈페이지 문의"
      ? "새로운 문의가 들어왔습니다."
      : "새로운 강의신청이 도착했습니다.");

  const adminBody = [
    "새 신청이 접수되었습니다.",
    "",
    "구분: " + (formType || "-"),
    "이름: " + (data.name || "-"),
    "이메일: " + (data.email || "-"),
    "연락처: " + (data.phone || "-"),
    "강의/문의 유형: " + (data.classType || data.projectType || "-"),
    "직업: " + (data.job || "-"),
    "레벨: " + (data.level || "-"),
    "결제 상태: " + (data.paymentStatus || "-"),
    "금액: " + (data.amount || "-"),
    "주문번호: " + (data.orderId || "-"),
    "문의 내용: " + (data.message || "-"),
  ].join("\n");

  MailApp.sendEmail({
    to: adminEmail,
    subject: notificationSubject,
    body: adminBody,
  });

  const shouldAutoReply =
    data.autoReplyEnabled === "true" &&
    formType === "강의 신청" &&
    data.paymentStatus === "계좌이체 신청";

  const replyTo = data.autoReplyTo || data.email || "";
  const customerName = data.autoReplyName || data.name || "고객";
  const className =
    data.autoReplyClassType || data.classType || "신청하신 클래스";
  const rawAmount = data.amount || "";
  const formattedAmount = rawAmount
    ? Number(rawAmount).toLocaleString("ko-KR") + "원"
    : "수강료 별도 안내";
  const replySubject =
    data.autoReplySubject || "[GOYO STUDIO] 수강신청이 접수되었습니다.";

  if (shouldAutoReply && replyTo) {
    const replyBody = [
      "안녕하세요 " + customerName + " 님.",
      "고요스튜디오 한인용입니다.",
      className + " 강의를 신청해주셔서 진심으로 감사드립니다.",
      "원활한 신청 완료를 위해 안내드립니다.",
      "",
      "[입금 안내]",
      "계좌: 국민은행 612537-01-009278",
      "예금주: 한인용(고요스튜디오)",
      "수강료: " + formattedAmount,
      "",
      "입금 완료 후 확인 즉시 오픈채팅방 초대해드리겠습니다.",
      "더 많은 이야기 나눠요!",
      "",
      "강의를 통해 뵙기를 기대하겠습니다. 감사합니다 :D",
      "",
      "* 입금 전 클래스 관련 문의사항이 있으시면",
      "",
      "카카오톡 [클래스 문의하기] 채팅방에서 말 걸어주세요!",
      "https://open.kakao.com/o/s88CkEwi",
    ].join("\n");

    MailApp.sendEmail({
      to: replyTo,
      subject: replySubject,
      body: replyBody,
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}
