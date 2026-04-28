export default function ApplyPage() {
  return (
    <main className="apply-page">
      <section className="apply-card">
        <span className="apply-label">D5렌더링 강의</span>

        <h1>강의 신청</h1>

        <p className="apply-description">
          안녕하세요. 고요입니다.<br />
          아래 정보를 작성해주시면 신청 내용을 확인한 뒤 개별 연락드립니다.<br />
          소수 정예로 진행되는 강의라 신청 후 승인 및 결제 안내가 순차적으로 진행됩니다.<br />
          감사합니다 :D
        </p>

        <form
          className="apply-form"
          action="https://script.google.com/macros/s/AKfycbxujdDp6MxnFDPCL1rEncsC97OT6yzqPMB8ke2y7J3ycKz_2K617TUejaTmyvUYVoiY/exec"
          method="POST"
        >
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
              <select id="classType" name="classType" required>
                <option value="">강의를 선택해주세요</option>
                <option value="D5 Render 기초반">D5 Render 투시도반(초급)</option>
                <option value="D5 Render 중급반">D5 Render 조감도반(중급)</option>
                <option value="1:1 개인강의">1:1 개인강의</option>
                <option value="그룹강의">그룹강의</option>
                <option value="기업,학교강의">기업,학교강의</option>
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

          <button type="submit" className="submit-button">
            신청서 제출하기
          </button>

          <p className="apply-notice">
            신청서 제출은 수강 확정이 아닙니다.
            신청 내용을 확인한 뒤 개별 승인 및 결제 안내를 보내드립니다.
            정원은 기수별 8명이며, 결제 완료 순으로 최종 확정됩니다.
          </p>
        </form>
      </section>
    </main>
  );
}