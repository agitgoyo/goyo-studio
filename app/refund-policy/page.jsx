import Link from "next/link";

const refundSteps = [
  {
    title: "수업 7일 전까지",
    detail: "결제 금액 전액 환불",
  },
  {
    title: "수업 3일 전까지",
    detail: "결제 금액의 50% 환불",
  },
  {
    title: "수업 2일 전부터 수업 당일",
    detail: "환불 불가",
  },
];

const notices = [
  "환불 요청은 결제 완료 후 문자 또는 안내된 연락 채널로 접수해 주세요.",
  "환불 승인 후 실제 카드 취소 및 환불 반영 시점은 카드사와 결제수단에 따라 영업일 기준 차이가 있을 수 있습니다.",
  "수업 일정 변경이나 운영 측 사유가 발생하는 경우에는 별도 안내 후 환불 또는 일정 변경을 도와드립니다.",
  "환불 기준일은 수업 시작일 자정을 기준으로 계산합니다.",
];

export default function RefundPolicyPage() {
  return (
    <main className="refund-policy-page">
      <section className="refund-policy-card">
        <div className="refund-policy-head">
          <span className="refund-policy-label">GOYO CLASS</span>
          <h1>환불정책 안내</h1>
          <p>
            고요클래스는 소수 정예로 운영되는 수업 특성상, 자리 확보와 준비 일정에 맞춰
            아래 기준으로 환불을 진행하고 있습니다.
            <br />
            결제 전 꼭 확인해 주세요.
          </p>
        </div>

        <div className="refund-policy-grid">
          {refundSteps.map((step) => (
            <article key={step.title} className="refund-policy-step">
              <h2>{step.title}</h2>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>

        <div className="refund-policy-section">
          <h2>환불 요청 방법</h2>
          <p>
            결제 완료 후 환불이 필요한 경우, 신청 시 남겨주신 연락처 기준으로 문자 또는
            안내된 연락 채널로 요청해 주세요. 신청자 성함, 수업명, 결제일을 함께 보내주시면
            확인이 더 빠릅니다.
          </p>
        </div>

        <div className="refund-policy-section">
          <h2>처리 안내</h2>
          <p>
            환불 요청이 접수되면 운영 확인 후 순차적으로 처리됩니다.
            <br />
            카드사 및 결제수단에 따라 실제 환불 반영은 영업일 기준 며칠 더 소요될 수
            있습니다.
          </p>
        </div>

        <div className="refund-policy-section">
          <h2>유의사항</h2>
          <ul className="refund-policy-list">
            {notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </div>

        <div className="refund-policy-actions">
          <Link href="/apply" className="refund-policy-back">
            신청 페이지로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
