<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>D5 Render Class | GOYO STUDIO</title>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, sans-serif;
  background: #111;
  color: #f5f1e8;
}

img {
  display: block;
  width: 100%;
}

section {
  padding: 110px 8vw;
}

h1, h2, h3 {
  margin: 0;
  letter-spacing: -0.05em;
}

p {
  line-height: 1.85;
  color: #cfc8ba;
}

.eyebrow {
  color: #d88b3a;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.18em;
  margin-bottom: 18px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 28px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
  transition: 0.25s;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn-primary {
  background: #f5f1e8;
  color: #111;
}

.btn-orange {
  background: #d88b3a;
  color: #111;
}

.btn-outline {
  border: 1px solid rgba(245,241,232,0.35);
  color: #f5f1e8;
}

/* HERO */
.hero {
  min-height: 94vh;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: 56px;
}

.hero h1 {
  font-size: clamp(46px, 7vw, 92px);
  line-height: 1.06;
}

.hero h1 span {
  color: #d88b3a;
}

.hero-desc {
  max-width: 680px;
  font-size: 19px;
  margin-top: 34px;
}

.hero-buttons {
  display: flex;
  gap: 14px;
  margin-top: 36px;
  flex-wrap: wrap;
}

.hero-image img {
  height: 72vh;
  object-fit: cover;
  border-radius: 32px;
}

/* QUESTION */
.question {
  background: #171717;
}

.question h2 {
  font-size: clamp(36px, 5.5vw, 72px);
  line-height: 1.16;
  max-width: 900px;
}

.question .lead {
  max-width: 760px;
  font-size: 20px;
  margin-top: 34px;
}

.question-box {
  margin-top: 56px;
  display: grid;
  gap: 16px;
}

.question-box p {
  margin: 0;
  padding: 24px 28px;
  border-radius: 22px;
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(245,241,232,0.12);
  color: #f5f1e8;
  font-size: 23px;
  line-height: 1.5;
}

/* STORY SECTIONS */
.story {
  background: #f5f1e8;
  color: #111;
}

.story.dark {
  background: #111;
  color: #f5f1e8;
}

.story h2 {
  font-size: clamp(34px, 4.8vw, 62px);
  line-height: 1.22;
  max-width: 880px;
}

.story p {
  max-width: 820px;
  font-size: 18px;
}

.story.dark p {
  color: #cfc8ba;
}

.story:not(.dark) p {
  color: #3c352d;
}

/* IMAGE STRIP */
.image-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0;
}

.image-strip img {
  height: 430px;
  object-fit: cover;
}

/* VALUE */
.value {
  background: #171717;
}

.value h2 {
  font-size: clamp(34px, 4.8vw, 62px);
  line-height: 1.2;
}

.value-grid {
  margin-top: 56px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.value-card {
  padding: 32px 28px;
  border-radius: 26px;
  background: rgba(255,255,255,0.055);
  border: 1px solid rgba(255,255,255,0.09);
}

.value-card span {
  color: #d88b3a;
  font-weight: 900;
}

.value-card h3 {
  font-size: 25px;
  margin-top: 18px;
}

.value-card p {
  margin-bottom: 0;
}

/* CLASS */
.class-section {
  background: #f5f1e8;
  color: #111;
}

.class-section h2 {
  font-size: clamp(34px, 4.8vw, 62px);
}

.class-desc {
  max-width: 760px;
  color: #3c352d;
  font-size: 18px;
}

.class-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 56px;
}

.class-card {
  background: #111;
  color: #f5f1e8;
  border-radius: 34px;
  overflow: hidden;
}

.class-card img {
  height: 340px;
  object-fit: cover;
}

.class-content {
  padding: 38px;
}

.class-label {
  color: #d88b3a;
  font-weight: 900;
  margin-bottom: 12px;
}

.class-content h3 {
  font-size: 38px;
}

.class-content p {
  color: #cfc8ba;
}

.class-content ul {
  padding-left: 20px;
  line-height: 2;
  color: #f5f1e8;
}

.class-point {
  margin-top: 28px;
  padding: 22px;
  border-radius: 20px;
  background: rgba(255,255,255,0.07);
}

/* CURRICULUM */
.curriculum {
  background: #111;
}

.curriculum h2 {
  font-size: clamp(34px, 4.8vw, 62px);
}

.curriculum-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  margin-top: 56px;
}

.curriculum-card {
  padding: 36px;
  border-radius: 30px;
  background: #1d1d1d;
}

.curriculum-card h3 {
  font-size: 30px;
  color: #d88b3a;
}

.curriculum-card ol {
  padding-left: 20px;
  line-height: 2;
  color: #f5f1e8;
}

/* RESULT */
.result {
  background: #171717;
}

.result h2 {
  font-size: clamp(34px, 4.8vw, 62px);
}

.result-grid {
  margin-top: 56px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.result-card {
  padding: 34px;
  border-radius: 26px;
  background: rgba(255,255,255,0.055);
}

.result-card h3 {
  color: #d88b3a;
  font-size: 25px;
}

/* GALLERY */
.gallery-section {
  background: #f5f1e8;
  color: #111;
}

.gallery-section h2 {
  font-size: clamp(34px, 4.8vw, 62px);
}

.gallery-section p {
  color: #3c352d;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 56px;
}

.gallery img {
  height: 330px;
  object-fit: cover;
  border-radius: 22px;
}

/* CTA */
.cta {
  text-align: center;
  background: #111;
}

.cta h2 {
  font-size: clamp(36px, 5vw, 68px);
  line-height: 1.18;
}

.cta p {
  max-width: 700px;
  margin: 28px auto 36px;
  font-size: 18px;
}

/* MOBILE */
@media (max-width: 900px) {
  section {
    padding: 80px 6vw;
  }

  .hero,
  .value-grid,
  .class-wrap,
  .curriculum-grid,
  .result-grid,
  .gallery {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 70px;
  }

  .hero-image img {
    height: 340px;
  }

  .image-strip {
    grid-template-columns: 1fr;
  }

  .image-strip img {
    height: 320px;
  }

  .question-box p {
    font-size: 19px;
  }

  .class-card img,
  .gallery img {
    height: 300px;
  }
}
</style>
</head>

<body>

<section class="hero">
  <div>
    <p class="eyebrow">GOYO STUDIO · D5 RENDER CLASS</p>
    <h1>
      건축 이미지는<br>
      예쁜 게 아니라<br>
      <span>설득이다</span>
    </h1>
    <p class="hero-desc">
      D5 Render를 활용해 단순히 보기 좋은 렌더링이 아니라,
      내가 설계한 공간의 매력을 제대로 전달하는 이미지를 만드는 클래스입니다.
      초급반은 투시도, 중급반은 조감도 완성을 목표로 진행됩니다.
    </p>
    <div class="hero-buttons">
      <a href="#class" class="btn btn-primary">클래스 보기</a>
      <a href="#apply" class="btn btn-outline">신청하기</a>
    </div>
  </div>

  <div class="hero-image">
    <img src="assets/d5-hero.jpg" alt="D5 렌더링 대표 이미지">
  </div>
</section>

<section class="question">
  <p class="eyebrow">QUESTION</p>
  <h2>
    AI 시대에,<br>
    아직도 렌더링을 배워야 할까요?
  </h2>
  <p class="lead">
    요즘은 AI로도 멋진 이미지가 만들어집니다.
    그런데 건축 이미지는 단순히 멋진 그림을 만드는 일이 아닙니다.
    내가 설계한 건물의 의도, 분위기, 장점, 공간감을 정확히 보여주는 일입니다.
  </p>

  <div class="question-box">
    <p>설계보다 렌더링이 더 어렵게 느껴지나요?</p>
    <p>잘 만든 설계를 어설픈 이미지로 망치고 있지는 않나요?</p>
    <p>외주를 맡겼는데, 내가 의도한 분위기와 다르게 나온 적 있나요?</p>
    <p>D5를 켜긴 했는데, 어디서부터 만져야 할지 막막했나요?</p>
    <p>포트폴리오에 넣을 이미지가 늘 아쉽게 느껴지나요?</p>
  </div>
</section>

<section class="story">
  <p class="eyebrow">PART 01</p>
  <h2>렌더링은 이미지 기술이 아니라 설계 언어입니다.</h2>
  <p>
    건축 이미지를 잘 만든다는 건 단순히 실사처럼 보이게 만든다는 뜻이 아닙니다.
    내가 디자인한 건물의 장점이 무엇인지 알고, 그 장점이 가장 잘 보이는 각도와 분위기를 선택하는 일입니다.
  </p>
  <p>
    같은 모델이어도 어떤 카메라를 잡는지, 어떤 시간대의 빛을 쓰는지,
    어떤 재질감을 강조하는지에 따라 이미지는 전혀 다른 설득력을 갖게 됩니다.
  </p>
  <p>
    그래서 이 수업에서는 D5 기능을 배우기 전에,
    먼저 좋은 건축 이미지를 보는 기준부터 함께 잡습니다.
  </p>
</section>

<section class="story dark">
  <p class="eyebrow">PART 02</p>
  <h2>잘 만든 설계가 이미지 때문에 작아 보이면 안 됩니다.</h2>
  <p>
    비례도 좋고, 매스도 좋고, 디테일도 고민했는데 렌더링 한 장에서 그 의도가 전달되지 않으면 너무 아깝습니다.
    건축 이미지는 설계의 마지막 포장지가 아니라, 설계를 이해시키고 설득시키는 중요한 과정입니다.
  </p>
  <p>
    이 클래스에서는 단순히 예쁜 장면을 만드는 것이 아니라,
    내가 의도한 디자인 포인트가 이미지 안에서 살아나도록 만드는 방법을 배웁니다.
  </p>
</section>

<section class="story">
  <p class="eyebrow">PART 03</p>
  <h2>그래서 결과물을 남기는 수업으로 만들었습니다.</h2>
  <p>
    초급반에서는 D5를 처음 켜는 분도 따라올 수 있도록 인터페이스, 카메라, 재질, 빛, 사람과 나무 배치까지 다룹니다.
    수업의 목표는 단 하나, 투시도 한 장을 완성하는 것입니다.
  </p>
  <p>
    중급반에서는 조감도를 중심으로 더 넓은 장면을 다룹니다.
    사이트의 분위기, 주변 환경, 스케일감, 날씨와 시간대까지 조절하며
    포트폴리오에 넣을 수 있는 이미지를 완성합니다.
  </p>
</section>

<div class="image-strip">
  <img src="assets/d5-01.jpg" alt="건축 렌더링 예시">
  <img src="assets/d5-02.jpg" alt="건축 렌더링 예시">
  <img src="assets/d5-03.jpg" alt="건축 렌더링 예시">
</div>

<section class="value">
  <p class="eyebrow">WHAT MATTERS</p>
  <h2>좋은 건축 이미지를 만드는 4가지 기준</h2>

  <div class="value-grid">
    <div class="value-card">
      <span>01</span>
      <h3>구도</h3>
      <p>건물이 가장 돋보이는 시선과 여백을 찾습니다.</p>
    </div>
    <div class="value-card">
      <span>02</span>
      <h3>재질</h3>
      <p>콘크리트, 유리, 금속, 목재의 성격을 이미지 안에서 살립니다.</p>
    </div>
    <div class="value-card">
      <span>03</span>
      <h3>빛</h3>
      <p>낮, 노을, 야경처럼 시간대에 따라 달라지는 분위기를 만듭니다.</p>
    </div>
    <div class="value-card">
      <span>04</span>
      <h3>디테일</h3>
      <p>사람, 나무, 차량, 조명으로 장면의 현실감과 밀도를 높입니다.</p>
    </div>
  </div>
</section>

<section class="class-section" id="class">
  <p class="eyebrow">CLASS LINE-UP</p>
  <h2>초급반과 중급반은 목적이 다릅니다.</h2>
  <p class="class-desc">
    두 반 모두 6시간으로 진행되지만 목표 결과물이 다릅니다.
    초급반은 D5를 처음 배우는 사람도 따라올 수 있는 투시도 중심,
    중급반은 더 넓은 장면과 분위기를 다루는 조감도 중심 수업입니다.
  </p>

  <div class="class-wrap">
    <div class="class-card">
      <img src="assets/d5-perspective.jpg" alt="초급반 투시도 예시">
      <div class="class-content">
        <p class="class-label">초급반 · 6시간</p>
        <h3>투시도 만들기</h3>
        <p>
          D5 Render를 처음 배우는 분들을 위한 클래스입니다.
          기본 인터페이스부터 카메라, 재질, 빛, 주변 요소까지 익히고
          최종적으로 설득력 있는 투시도 한 장을 완성합니다.
        </p>
        <ul>
          <li>D5 기본 인터페이스 이해</li>
          <li>SketchUp 모델 가져오기</li>
          <li>카메라와 구도 잡기</li>
          <li>재질, 빛, 사람, 나무 배치</li>
          <li>최종 투시도 1장 완성</li>
        </ul>
        <div class="class-point">
          추천 대상: D5를 처음 시작하는 분, 렌더링이 막막한 분, 빠르게 결과물을 만들고 싶은 분
        </div>
      </div>
    </div>

    <div class="class-card">
      <img src="assets/d5-aerial.jpg" alt="중급반 조감도 예시">
      <div class="class-content">
        <p class="class-label">중급반 · 6시간</p>
        <h3>조감도 만들기</h3>
        <p>
          기본 렌더링은 할 수 있지만 이미지의 완성도를 더 높이고 싶은 분들을 위한 클래스입니다.
          조감도의 목적, 환경 연출, 스케일감, 후반 보정까지 다룹니다.
        </p>
        <ul>
          <li>투시도와 조감도의 차이 이해</li>
          <li>조감도 구도와 스토리텔링</li>
          <li>환경, 날씨, 시간대 연출</li>
          <li>Scatter / Brush 활용</li>
          <li>포트폴리오용 조감도 1장 완성</li>
        </ul>
        <div class="class-point">
          추천 대상: D5 기본은 아는 분, 조감도가 어려운 분, 포트폴리오 이미지를 업그레이드하고 싶은 분
        </div>
      </div>
    </div>
  </div>
</section>

<section class="curriculum">
  <p class="eyebrow">CURRICULUM</p>
  <h2>6시간 안에 한 장을 끝까지 완성합니다.</h2>

  <div class="curriculum-grid">
    <div class="curriculum-card">
      <h3>초급반 · 투시도</h3>
      <ol>
        <li>건축 이미지의 목적 이해</li>
        <li>D5 기본 세팅과 화면 구성</li>
        <li>SketchUp 모델 가져오기</li>
        <li>카메라와 구도 잡기</li>
        <li>재질과 빛 세팅</li>
        <li>사람, 나무, 차량 배치</li>
        <li>최종 투시도 렌더링</li>
      </ol>
    </div>

    <div class="curriculum-card">
      <h3>중급반 · 조감도</h3>
      <ol>
        <li>조감도의 목적과 역할 이해</li>
        <li>상공 시점 구도 잡기</li>
        <li>사이트와 주변 환경 만들기</li>
        <li>날씨와 시간대 연출</li>
        <li>Scatter / Brush 활용</li>
        <li>스케일감과 밀도 조정</li>
        <li>포트폴리오용 조감도 완성</li>
      </ol>
    </div>
  </div>
</section>

<section class="result">
  <p class="eyebrow">RESULT</p>
  <h2>수업이 끝나면 남는 것</h2>

  <div class="result-grid">
    <div class="result-card">
      <h3>01. 결과물</h3>
      <p>단순 기능 학습이 아니라, 바로 보여줄 수 있는 이미지 한 장을 완성합니다.</p>
    </div>
    <div class="result-card">
      <h3>02. 감각</h3>
      <p>구도, 여백, 빛, 분위기를 보는 눈을 함께 훈련합니다.</p>
    </div>
    <div class="result-card">
      <h3>03. 워크플로우</h3>
      <p>모델링에서 렌더링, 보정까지 실제 실무 흐름으로 배웁니다.</p>
    </div>
  </div>
</section>

<section class="gallery-section">
  <p class="eyebrow">IMAGE MOOD</p>
  <h2>이런 이미지를 만들 수 있게 됩니다.</h2>
  <p>
    수업에서는 단순히 버튼을 따라 누르는 것이 아니라,
    왜 이 구도를 선택하는지, 왜 이 빛을 쓰는지, 왜 이 분위기가 어울리는지 함께 설명합니다.
  </p>

  <div class="gallery">
    <img src="assets/d5-gallery-01.jpg" alt="D5 렌더링 갤러리">
    <img src="assets/d5-gallery-02.jpg" alt="D5 렌더링 갤러리">
    <img src="assets/d5-gallery-03.jpg" alt="D5 렌더링 갤러리">
    <img src="assets/d5-gallery-04.jpg" alt="D5 렌더링 갤러리">
  </div>
</section>

<section class="cta" id="apply">
  <p class="eyebrow">APPLY NOW</p>
  <h2>
    이제 내 설계를<br>
    직접 설득력 있게 보여주세요.
  </h2>
  <p>
    초급반은 투시도, 중급반은 조감도 중심으로 진행됩니다.
    신청 후 일정과 준비사항을 안내드립니다.
  </p>
  <a href="apply-page.html" class="btn btn-primary">강의 신청하기</a>
</section>

</body>
</html>