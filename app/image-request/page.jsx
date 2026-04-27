const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdAr5MxMB9M8D8eW2lCK70bYw9W7DIuRaDQKSKqoksnBuQZLIDM4fa56lHfLyDYnI9/exec";

export default function ImageRequestPage() {
  return (
    <main className="image-request-page">
      <style>{`
        .image-request-page {
          min-height: 100vh;
          background: #f5f3ef;
          color: #111;
          font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", sans-serif;
        }

        .image-hero {
          padding: 96px 24px 72px;
          background: #111;
          color: #fff;
          text-align: center;
        }

        .image-eyebrow {
          font-size: 13px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 20px;
        }

        .image-hero h1 {
          font-size: clamp(36px, 7vw, 72px);
          line-height: 1.05;
          margin: 0 0 24px;
          font-weight: 700;
          letter-spacing: -0.04em;
        }

        .image-hero p {
          max-width: 720px;
          margin: 0 auto;
          color: #ccc;
          font-size: 18px;
          word-break: keep-all;
        }

        .image-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 72px 24px;
        }

        .section-title {
          margin-bottom: 28px;
        }

        .section-title span {
          display: block;
          font-size: 13px;
          color: #777;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .section-title h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 44px);
          letter-spacing: -0.04em;
          line-height: 1.15;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: start;
          margin-bottom: 72px;
        }

        .intro-card,
        .form-card {
          background: #fff;
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.06);
        }

        .intro-card p {
          margin: 0 0 16px;
          color: #333;
          word-break: keep-all;
        }

        .intro-card p:last-child {
          margin-bottom: 0;
        }

        .notice-box {
          background: #ebe7df;
          border-radius: 28px;
          padding: 32px;
        }

        .notice-box h3 {
          margin: 0 0 16px;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .notice-box ul {
          padding-left: 18px;
          margin: 0;
          color: #444;
        }

        .notice-box li {
          margin-bottom: 10px;
        }

        .price-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 72px;
        }

        .price-card {
          background: #fff;
          border-radius: 28px;
          padding: 32px;
          box-shadow: 0 18px 42px rgba(0,0,0,0.05);
          min-height: 360px;
        }

        .price-card.featured {
          background: #111;
          color: #fff;
          transform: translateY(-8px);
        }

        .price-label {
          display: inline-block;
          width: fit-content;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: #eee;
          color: #333;
          border-radius: 999px;
          padding: 6px 12px;
          margin-bottom: 20px;
        }

        .featured .price-label {
          background: #fff;
          color: #111;
        }

        .price-card h3 {
          margin: 0 0 12px;
          font-size: 24px;
          letter-spacing: -0.04em;
        }

        .price {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 20px;
        }

        .price small {
          font-size: 14px;
          font-weight: 400;
          color: #777;
        }

        .featured .price small {
          color: #bbb;
        }

        .price-card ul {
          padding-left: 18px;
          margin: 0;
          color: #444;
        }

        .featured ul {
          color: #ddd;
        }

        .price-card li {
          margin-bottom: 10px;
        }

        .process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 72px;
        }

        .process-card {
          background: #ebe7df;
          border-radius: 24px;
          padding: 28px;
        }

        .process-card strong {
          display: block;
          font-size: 14px;
          color: #777;
          margin-bottom: 12px;
        }

        .process-card h3 {
          margin: 0 0 10px;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .process-card p {
          margin: 0;
          color: #444;
          font-size: 15px;
          word-break: keep-all;
        }

        .request-form {
          display: grid;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 16px;
          padding: 15px 16px;
          font-size: 15px;
          font-family: inherit;
          background: #fafafa;
          outline: none;
        }

        textarea {
          min-height: 160px;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #111;
          background: #fff;
        }

        .submit-btn {
          margin-top: 12px;
          border: none;
          background: #111;
          color: #fff;
          border-radius: 999px;
          padding: 18px 28px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          background: #333;
        }

        .mail-note {
          margin: 0;
          color: #777;
          font-size: 14px;
          word-break: keep-all;
        }

        .direct-mail {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          border: 1px solid #111;
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 700;
          transition: 0.2s ease;
          color: #111;
          text-decoration: none;
        }

        .direct-mail:hover {
          background: #111;
          color: #fff;
        }

        @media (max-width: 900px) {
          .intro-grid,
          .price-grid,
          .process-grid,
          .form-row {
            grid-template-columns: 1fr;
          }

          .price-card.featured {
            transform: none;
          }

          .image-hero {
            padding-top: 72px;
          }

          .image-container {
            padding: 56px 20px;
          }

          .intro-card,
          .form-card {
            padding: 28px;
          }
        }
      `}</style>

      <section className="image-hero">
        <div className="image-eyebrow">GOYO STUDIO IMAGE REQUEST</div>
        <h1>
          건축 이미지를
          <br />
          더 설득력 있게 만듭니다.
        </h1>
        <p>
          투시도, 공모전 이미지, 제안서용 이미지, SNS/포트폴리오용 이미지까지.<br />
          프로젝트의 의도와 분위기가 잘 전달되도록 이미지를 제작합니다.
        </p>
      </section>

      <section className="image-container">
        <div className="intro-grid">
          <div>
            <div className="section-title">
              <span>Service</span>
              <h2>이미지 외주 작업 안내</h2>
            </div>

            <div className="intro-card">
              <p>
                보내주신 도면, 모델링 파일, 참고 이미지, 원하는 분위기를 바탕으로 건축 이미지를 제작합니다.
              </p>
              <p>
                단순 렌더링 보정부터 모델링을 포함한 이미지 제작, 디자인 방향 제안이 필요한 작업까지 프로젝트 상황에 맞춰 상담 후 진행합니다.
              </p>
              <p>
                작업은 1차 이미지 전달 후 피드백을 반영하는 방식으로 진행되며, 작은 수정은 가능한 선에서 충분히 맞춰드립니다.
              </p>
            </div>
          </div>

          <div className="notice-box ">
            <h3>신청 전 준비하면 좋은 자료</h3>
            <ul>
              <li>스케치업, D5, 캐드, PDF 등 프로젝트 자료</li>
              <li>원하는 분위기의 레퍼런스 이미지</li>
              <li>이미지 용도: 공모전, 보고서, 포트폴리오, SNS 등</li>
              <li>필요한 이미지 장수와 희망 마감일</li>
              <li>모델링 보유 여부</li>
            </ul>
          </div>
        </div>

        <div className="section-title">
          <span>Price</span>
          <h2>작업 범위에 따른 가격대</h2>
        </div>

        <div className="price-grid">
          <article className="price-card featured">
            <span className="price-label">Basic</span>
            <h3>실내투시도 이미지 </h3>
            <div className="price">
              10만원~ <small>/ 1장</small>
            </div>
            <ul>
              <li>카페,매장,전시,주거 등</li>
              <li>공간의 분위기와 재질감을 살린</li>
              <li>실내 공간 이미지 제작</li>
              
            </ul>
          </article>

          <article className="price-card featured">
            <span className="price-label">Standard</span>
            <h3>외부 투시도 이미지</h3>
            <div className="price">
              20만원~ <small>/ 1장</small>
            </div>
            <ul>
              <li>단일 건물 외관을 중심으로</li>
              <li>설계의도와 매스가 잘 드러나는</li>
              <li>외부 투시도 이미지 제작</li>
                          </ul>
          </article>

          <article className="price-card featured">
            <span className="price-label">Premium</span>
            <h3>조감도/대형프로젝트</h3>
            <div className="price">40만원~</div>
            <ul>
              <li>대지 구성,배치,동선,전체 규모가</li>
              <li>한눈에 읽히는 조감도 또는</li>
              <li>대형 프로젝트 이미지 제작</li>
              <li>작업 범위에 따라 별도 견적</li>
            </ul>
          </article>
        </div>

        <div className="section-title">
          <span>Process</span>
          <h2>진행 방식</h2>
        </div>

        <div className="process-grid">
          <div className="process-card">
            <strong>01</strong>
            <h3>신청</h3>
            <p>아래 신청서를 통해 작업 내용과 자료 상황을 보내주세요.</p>
          </div>

          <div className="process-card">
            <strong>02</strong>
            <h3>상담 및 견적</h3>
            <p>작업 범위, 장수, 마감일을 확인한 뒤 견적을 안내드립니다.</p>
          </div>

          <div className="process-card">
            <strong>03</strong>
            <h3>1차 이미지 전달</h3>
            <p>작업 진행 후 1차 이미지를 전달하고 피드백을 받습니다.</p>
          </div>

          <div className="process-card">
            <strong>04</strong>
            <h3>수정 및 2차 피드백/최종</h3>
            <p>피드백 반영 후 최종 이미지를 전달합니다.</p>
          </div>
        </div>

        <div className="section-title">
          <span>Request</span>
          <h2>이미지 외주 신청하기</h2>
        </div>

        <div className="form-card">
          <form className="request-form" action={GOOGLE_SCRIPT_URL} method="POST">
            <input type="hidden" name="formType" value="이미지 외주 신청" />

            <div className="form-row">
              <div>
                <label htmlFor="name">성함 / 업체명</label>
                <input id="name" name="name" type="text" placeholder="예: 홍길동 / OO건축" required />
              </div>

              <div>
                <label htmlFor="email">이메일</label>
                <input id="email" name="email" type="email" placeholder="답변 받을 이메일" required />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="phone">연락처</label>
                <input id="phone" name="phone" type="text" placeholder="선택 입력" />
              </div>

              <div>
                <label htmlFor="workType">희망 작업 유형</label>
                <select id="workType" name="workType" required>
                  <option value="">선택해주세요</option>
                  <option value="기존 모델링 기반 투시도">기존 모델링 기반 투시도</option>
                  <option value="모델링 포함 이미지 제작">모델링 포함 이미지 제작</option>
                  <option value="디자인 제안 포함 이미지">디자인 제안 포함 이미지</option>
                  <option value="공모전 / 제안서 이미지">공모전 / 제안서 이미지</option>
                  <option value="기타 상담">기타 상담</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="imageCount">필요 이미지 장수</label>
                <input id="imageCount" name="imageCount" type="text" placeholder="예: 외부 2장, 내부 1장" />
              </div>

              <div>
                <label htmlFor="deadline">희망 마감일</label>
                <input id="deadline" name="deadline" type="text" placeholder="예: 5월 10일까지" />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label htmlFor="modeling">모델링 파일 보유 여부</label>
                <select id="modeling" name="modeling">
                  <option value="">선택해주세요</option>
                  <option value="스케치업 모델링 있음">스케치업 모델링 있음</option>
                  <option value="D5 / 렌더링 파일 있음">D5 / 렌더링 파일 있음</option>
                  <option value="캐드 도면만 있음">캐드 도면만 있음</option>
                  <option value="자료 없음 / 상담 필요">자료 없음 / 상담 필요</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget">예상 예산</label>
                <input id="budget" name="budget" type="text" placeholder="예: 30만원 내외 / 상담 후 결정" />
              </div>
            </div>

            <div>
              <label htmlFor="referenceLink">자료 링크</label>
              <input
                id="referenceLink"
                name="referenceLink"
                type="text"
                placeholder="구글드라이브, 네이버 MYBOX, 드롭박스 링크 등"
              />
            </div>

            <div>
              <label htmlFor="message">작업 내용</label>
              <textarea
                id="message"
                name="message"
                placeholder="프로젝트 내용, 원하는 이미지 분위기, 참고 이미지, 필요한 작업 범위를 자유롭게 적어주세요."
                required
              />
            </div>

            <button className="submit-btn" type="submit">
              신청 및 상담 보내기
            </button>

            <p className="mail-note">
              자료 파일은 용량이 클 수 있으므로 구글드라이브, 네이버 MYBOX, 드롭박스 링크를 함께 적어주시면 확인이 빠릅니다.
            </p>

            <a
              className="direct-mail"
              href="mailto:agit.goyo@gmail.com?subject=[고요스튜디오] 이미지 외주 상담 문의&body=성함:%0D%0A연락처:%0D%0A희망 작업:%0D%0A필요 이미지 장수:%0D%0A희망 마감일:%0D%0A모델링 파일 보유 여부:%0D%0A자료 링크:%0D%0A작업 내용:%0D%0A"
            >
              이메일로 직접 상담하기
            </a>
          </form>
        </div>
      </section>
    </main>
  );
}