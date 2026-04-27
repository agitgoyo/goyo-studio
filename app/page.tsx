import React from "react";

export default function App() {
  return (
    <>
      <style>{`
        :root {
          --bg: #f4f1eb;
          --paper: #fffaf2;
          --ink: #181816;
          --muted: #77736b;
          --line: #ddd5c8;
          --accent: #8b6f4e;
          --dark: #26231f;
          --white: #ffffff;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Pretendard", "Noto Sans KR", "Segoe UI", sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.65;
        }

        a { color: inherit; text-decoration: none; }
        img { max-width: 100%; display: block; }

        .wrap {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(244, 241, 235, .82);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(221, 213, 200, .75);
        }

        .nav {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .logo {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: .01em;
        }

        .nav-links {
          display: flex;
          gap: 26px;
          color: var(--muted);
          font-size: 14px;
        }

        .nav-links a:hover { color: var(--ink); }

        .nav-cta {
          padding: 10px 16px;
          border: 1px solid var(--ink);
          border-radius: 999px;
          font-weight: 800;
          font-size: 14px;
        }

        .hero {
          min-height: calc(100vh - 72px);
          padding: 82px 0 72px;
          display: flex;
          align-items: center;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 56px;
          align-items: end;
        }

        .eyebrow {
          display: inline-flex;
          padding: 8px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,250,242,.65);
          color: var(--accent);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 26px;
        }

        h1 {
          margin: 0;
          font-size: clamp(54px, 8.8vw, 132px);
          line-height: .88;
          letter-spacing: -.085em;
          font-weight: 950;
        }

        .hero-desc {
          max-width: 680px;
          margin: 30px 0 0;
          color: var(--muted);
          font-size: clamp(18px, 2vw, 22px);
          letter-spacing: -.02em;
          word-break: keep-all;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 36px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          padding: 0 22px;
          border-radius: 999px;
          font-weight: 900;
          border: 1px solid var(--ink);
          transition: transform .18s ease, box-shadow .18s ease;
        }

        .btn:hover { transform: translateY(-2px); }

        .btn.primary {
          background: var(--ink);
          color: var(--white);
          box-shadow: 0 18px 38px rgba(24,24,22,.16);
        }

        .btn.secondary { background: transparent; }

        .hero-visual {
          border-radius: 34px;
          min-height: 560px;
          background: linear-gradient(145deg, rgba(24,24,22,.08), rgba(24,24,22,.02)), repeating-linear-gradient(135deg, #dfd5c5 0, #dfd5c5 14px, #f7efe3 14px, #f7efe3 28px);
          border: 1px solid var(--line);
          position: relative;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(38,35,31,.14);
        }

        .hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(1.05) contrast(1.02);
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(244,241,235,0.85) 0%, rgba(244,241,235,0.55) 28%, rgba(244,241,235,0.0) 55%);
        }

        .hero-title-stack {
          position: absolute;
          left: 26px;
          bottom: 26px;
          font-size: clamp(34px, 4vw, 54px);
          line-height: .95;
          letter-spacing: -.06em;
          font-weight: 950;
          color: var(--white);
        }

        .hero-note {
          position: absolute;
          top: 24px;
          right: 24px;
          width: min(260px, calc(100% - 48px));
          padding: 18px;
          border-radius: 24px;
          background: rgba(255,250,242,.82);
          border: 1px solid var(--line);
          backdrop-filter: blur(10px);
          color: var(--muted);
          font-size: 14px;
        }

        .hero-note strong {
          display: block;
          color: var(--ink);
          font-size: 16px;
          margin-bottom: 6px;
        }

        section { padding: 90px 0; }

        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 32px;
          margin-bottom: 38px;
        }

        .section-head h2 {
          margin: 0;
          font-size: clamp(34px, 5vw, 64px);
          line-height: .98;
          letter-spacing: -.065em;
          font-weight: 900;
        }

        .section-head p {
          max-width: 430px;
          margin: 0;
          color: var(--muted);
          font-size: 16px;
          word-break: keep-all;
        }
          .works-title-row {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.more-portfolio-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0 24px;
  margin-bottom: 4px;
  border: 1px solid rgba(24,24,22,.18);
  border-radius: 18px;
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 14px 36px rgba(38,35,31,.08);
  font-size: 18px;
  font-weight: 950;
  letter-spacing: .02em;
  white-space: nowrap;
  cursor: pointer;
}

.more-portfolio-btn:hover {
  transform: translateY(-3px);
  background: var(--ink);
  color: var(--white);
}

        .intro {
          background: var(--dark);
          color: var(--white);
        }

        .intro-grid {
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          gap: 48px;
        }

        .intro-title {
          font-size: clamp(36px, 5vw, 68px);
          line-height: 1.02;
          letter-spacing: -.06em;
          font-weight: 950;
        }

        .intro-copy {
          color: #d2cabd;
          font-size: clamp(19px, 2.2vw, 28px);
          line-height: 1.52;
          letter-spacing: -.035em;
          word-break: keep-all;
        }

        .keyword-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 34px;
        }

        .keyword {
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          color: #efe5d5;
          font-size: 13px;
          font-weight: 800;
        }

        .project-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 18px;
        }

        .project {
          grid-column: span 6;
          min-height: 520px;
          border-radius: 34px;
          overflow: hidden;
          background: var(--paper);
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .project:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(38,35,31,.13);
        }

        .project.wide { grid-column: span 8; }
        .project.small { grid-column: span 4; }

        .thumb {
          min-height: 330px;
          background: linear-gradient(145deg, rgba(24,24,22,.1), rgba(24,24,22,.02)), repeating-linear-gradient(135deg, #d8cebd 0, #d8cebd 12px, #f7efe3 12px, #f7efe3 24px);
          position: relative;
          overflow: hidden;
        }

        .thumb.dark {
          background: #26231f;
        }

        .thumb img {
          width: 100%;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          transition: transform .3s ease;
        }

        .project:hover .thumb img {
          transform: scale(1.04);
        }

        .project-body {
          padding: 26px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          flex: 1;
          justify-content: space-between;
        }

        .project-meta {
          color: var(--accent);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .project h3 {
          margin: 0;
          font-size: clamp(26px, 3vw, 40px);
          line-height: 1.04;
          letter-spacing: -.055em;
          font-weight: 700;
        }

        .project p {
          margin: 0;
          color: var(--muted);
          word-break: keep-all;
        }

        .services {
          background: #e4d8c8;
          position: relative;
          overflow: hidden;
        }

        .services::before {
          content: "SERVICES";
          position: absolute;
          right: -18px;
          top: 26px;
          font-size: clamp(72px, 13vw, 180px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.08em;
          color: rgba(24,24,22,.055);
          pointer-events: none;
        }

        .services .section-head {
          position: relative;
          z-index: 1;
          align-items: flex-start;
          margin-bottom: 52px;
        }

        .services .section-head h2 {
          font-size: clamp(48px, 7vw, 96px);
          line-height: .86;
          letter-spacing: -.08em;
          
        }

        .services .section-head p {
          max-width: 520px;
          padding-top: 12px;
          font-size: 18px;
          color: rgba(24,24,22,.68);
        }

        .service-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .service {
          min-height: 520px;
          background: rgba(255,250,242,.9);
          border: 1px solid rgba(24,24,22,.16);
          border-radius: 34px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 22px 70px rgba(38,35,31,.08);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .service:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 90px rgba(38,35,31,.18);
        }

        .service-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: linear-gradient(145deg, rgba(24,24,22,.1), rgba(24,24,22,.02)), repeating-linear-gradient(135deg, #d8cebd 0, #d8cebd 12px, #f7efe3 12px, #f7efe3 24px);
        }

        .service-content {
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }

        .service small {
          display: inline-flex;
          width: 64px;
          height: 64px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--ink);
          color: var(--white);
          font-weight: 950;
          font-size: 18px;
          letter-spacing: .02em;
        }

        .service h3 {
          margin: 24px 0 12px;
          font-size: clamp(25px, 3vw, 30px);
          line-height: .98;
          letter-spacing: -.06em;
          font-weight: 700;
        }

        .service p {
          margin: 0;
          color: var(--muted);
          word-break: keep-all;
          font-size: 16px;
          line-height: 1.72;
        }

        .service-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          min-height: 42px;
          margin-top: 28px;
          padding: 0 16px;
          border-radius: 999px;
          background: var(--ink);
          color: var(--white);
          font-size: 13px;
          font-weight: 900;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          gap: 28px;
          align-items: stretch;
        }

        .profile-card {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 34px;
          padding: 34px;
        }

        .profile-card h2 {
          margin: 0 0 22px;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 1;
          letter-spacing: -.06em;
          font-weight: 900;
        
        }

        .profile-card p {
          color: var(--muted);
          margin: 0 0 16px;
          word-break: keep-all;
        }

        .facts {
          display: grid;
          gap: 10px;
          margin-top: 28px;
        }

        .fact {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid var(--line);
          padding-top: 12px;
          color: var(--muted);
          font-size: 14px;
        }

        .fact strong { color: var(--ink); }

        .profile-visual {
          min-height: 500px;
          border-radius: 34px;
          border: 1px solid var(--line);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: end;
          padding: 28px;
          font-size: clamp(34px, 4vw, 58px);
          font-weight: 950;
          line-height: .96;
          letter-spacing: -.06em;
          color: var(--white);
          background: var(--dark);
        }

        .profile-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .78;
        }

        .profile-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.62) 100%);
        }

        .profile-visual span {
          position: relative;
          z-index: 1;
        }

        .contact { padding: 100px 0; }

        .contact-box {
          background: var(--ink);
          color: var(--white);
          border-radius: 44px;
          padding: clamp(34px, 7vw, 78px);
          display: grid;
          grid-template-columns: 1fr .75fr;
          gap: 40px;
          align-items: end;
        }

        .contact-box h2 {
          margin: 0;
          font-size: clamp(42px, 7vw, 86px);
          line-height: .95;
          letter-spacing: -.07em;
        }

        .contact-box p {
          color: #d2cabd;
          margin: 0 0 26px;
          font-size: 18px;
          word-break: keep-all;
        }

        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .contact-box .btn {
          border-color: rgba(255,255,255,.8);
          color: var(--white);
        }

        .contact-box .btn.primary {
          background: var(--white);
          color: var(--ink);
        }

        footer {
          padding: 34px 0;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
        }

        .footer-inner {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
        }

        @media (max-width: 960px) {
          .nav-links { display: none; }
          .hero-grid,
          .intro-grid,
          .profile-grid,
          .contact-box {
            grid-template-columns: 1fr;
          }
          .hero { min-height: auto; }
          .hero-visual { min-height: 420px; }
          .section-head { display: block; }
          .section-head p { margin-top: 14px; }
          .project,
          .project.wide,
          .project.small {
            grid-column: span 12;
          }
          .service-grid { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 560px) {
          .wrap { width: min(100% - 28px, 1180px); }
          .nav { height: 66px; }
          .nav-cta { display: none; }
          .hero { padding: 56px 0 54px; }
          section { padding: 62px 0; }
          h1 { font-size: clamp(52px, 18vw, 88px); }
          .hero-actions,
          .contact-links {
            align-items: stretch;
          }
          .btn { width: 100%; }
          .hero-visual,
          .profile-visual {
            min-height: 360px;
          }
          .project { min-height: auto; }
          .thumb { min-height: 260px; }
          .thumb img { min-height: 260px; }
          .project-body,
          .profile-card,
          .service-content {
            padding: 24px;
          }
          .service-grid { grid-template-columns: 1fr; }
          .service { min-height: auto; }
          .service-image { height: 240px; }
          .fact { flex-direction: column; gap: 4px; }
        }
      `}</style>

      <header>
        <div className="wrap nav">
          <a className="logo" href="#">GOYO STUDIO</a>
          <nav className="nav-links">
            <a href="#works">Works</a>
            <a href="#services">Services</a>
            <a href="#profile">Profile</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="nav-cta" href="#contact">문의하기</a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">Architect · Visualizer · Educator</div>
              <h1>GOYO<br />STUDIO</h1>
            
              <p className="hero-desc">
                고요스튜디오는 건축 설계, 공간 이미지, 렌더링 콘텐츠를 통해 생각이 있는 건축을 만들고 공유합니다.
                설계자의 관점으로 공간을 읽고, 이미지로 설득합니다.
              </p>
              <div className="hero-actions">
                <a className="btn primary" href="#works">포트폴리오 보기</a>
                <a className="btn secondary" href="#services">서비스 보기</a>
              </div>
            </div>

            <div className="hero-visual">
              <img className="hero-image" src="/images/hero-main.jpg" alt="GOYO STUDIO 대표 이미지" />
              
                           <div className="hero-title-stack">Design with<br />quiet intensity</div>
            </div>
          </div>
        </section>

        <section className="intro">
          <div className="wrap intro-grid">
            <div className="intro-title">생각을 구조로,<br />구조를 이미지로.</div>
            <div>
              <div className="intro-copy">
                건축은 예쁜 이미지를 만드는 일이기 전에, 무엇을 중요하게 볼지 정하는 일이라고 생각합니다.
                고요는 계획의 방향, 공간의 분위기, 표현의 완성도를 함께 다루는 건축 기반 크리에이티브 스튜디오입니다.
              </div>
              <div className="keyword-row">
                <span className="keyword">Architecture Design</span>
                <span className="keyword">Concept Planning</span>
                <span className="keyword">3D Visualization</span>
                <span className="keyword">SketchUp · D5</span>
                <span className="keyword">Education</span>
              </div>
            </div>
          </div>
        </section>

        <section id="works">
          <div className="wrap">
            <div className="section-head">
               <div className="works-title-row">
                <h2>Selected<br />Works</h2>
                <a className="more-portfolio-btn" href="https://agit-goyo.myportfolio.com/" target="_blank" rel="noreferrer">
  MORE PORTFOLIO →
</a>
               </div>
             
            </div>

            <div className="project-grid">
              <article className="project wide">
                <div className="thumb dark">
                  <img src="/images/project-dokbongsan.jpg" alt="독봉산 웰빙공원" />
                </div>
                <div className="project-body">
                  <div>
                    <div className="project-meta">Public Design · Competition</div>
                    <h3>독봉산 웰빙공원</h3>
                    <p>공공 공간의 경험과 풍경을 재구성하는 제안. 장소의 흐름, 이용자의 동선, 자연과 시설의 관계를 중심으로 계획합니다.</p>
                  </div>
                </div>
              </article>

              <article className="project small">
                <div className="thumb">
                  <img src="/images/project-yeononjae.jpg" alt="연온재" />
                </div>
                <div className="project-body">
                  <div>
                    <div className="project-meta">Residential · Concept</div>
                    <h3>연온재</h3>
                    <p>주거의 온도와 밀도를 다루는 프로젝트. 차분한 재료감과 생활의 장면을 중심으로 공간 이미지를 구성합니다.</p>
                  </div>
                </div>
              </article>

              <article className="project">
                <div className="thumb">
                  <img src="/images/project-tinyhouse.jpg" alt="Tiny House" />
                </div>
                <div className="project-body">
                  <div>
                    <div className="project-meta">Small House · Visualization</div>
                    <h3>Tiny House</h3>
                    <p>작은 집이 가질 수 있는 밀도와 장면을 탐구한 작업. 제한된 규모 안에서 생활감과 분위기를 설계합니다.</p>
                  </div>
                </div>
              </article>

              <article className="project">
                <div className="thumb dark">
                  <img src="/images/project-highandlife.jpg" alt="High & Life" />
                </div>
                <div className="project-body">
                  <div>
                    <div className="project-meta">Competition · Lifestyle</div>
                    <h3>High-end Life</h3>
                    <p>라이프스타일과 공간 경험을 결합한 공모전 작업. 프로그램, 이미지, 사용자 경험을 하나의 이야기로 엮습니다.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="wrap">
            <div className="section-head">
              <h2>SERVICES</h2>
              
            </div>

            <div className="service-grid">
              <article className="service">
                <img className="service-image" src="/images/service-lecture.jpg" alt="강의 신청" />
                <div className="service-content">
                  <div>
                    <small>01</small>
                    <h3>강의 신청</h3>
                    <p>SketchUp과 D5 기반의 건축 시각화 워크플로우를 실무자의 언어로 배웁니다.</p>
                  </div>
                  <a className="service-link" href="#contact">강의 문의하기 →</a>
                </div>
              </article>

              <article className="service">
                <img className="service-image" src="/images/service-pdf.jpg" alt="PDF 파일" />
                <div className="service-content">
                  <div>
                    <small>02</small>
                    <h3>PDF 파일</h3>
                    <p>렌더링 세팅, 표현법, 포트폴리오 구성법을 정리한 실전형 디지털 자료입니다.</p>
                  </div>
                  <a className="service-link" href="#contact">자료 구매하기 →</a>
                </div>
              </article>

              <article className="service">
                <img className="service-image" src="/images/service-free.jpg" alt="무료 자료" />
                <div className="service-content">
                  <div>
                    <small>03</small>
                    <h3>무료 자료</h3>
                    <p>처음 시작하는 분들을 위한 체크리스트, 가이드, 렌더링 팁을 제공합니다.</p>
                  </div>
                  <a className="service-link" href="#contact">무료 자료 받기 →</a>
                </div>
              </article>

              <article className="service">
                <img className="service-image" src="/images/service-outsource.jpg" alt="이미지 외주 신청" />
                <div className="service-content">
                  <div>
                    <small>04</small>
                    <h3>이미지 외주 신청</h3>
                    <p>건축 투시도, 다이어그램, 컨셉 이미지, 프레젠테이션용 시각화를 의뢰할 수 있습니다.</p>
                  </div>
                  <a className="service-link" href="#contact">외주 문의하기 →</a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="profile">
          <div className="wrap profile-grid">
            <div className="profile-card">
              <h2>About<br />GOYO</h2>
              <p>건축사 자격을 가진 10년차 실무자로, 설계와 이미지 사이를 오가며 작업합니다. 건축을 예술과 실무 사이의 언어로 바라보고, 생각이 분명한 공간을 만들고자 합니다.</p>
              <p>@agit_goyo를 통해 SketchUp, D5 렌더링, 건축 모델링과 설계 콘텐츠를 공유하며 건축인들과 소통하고 있습니다.</p>
              <div className="facts">
                <div className="fact"><strong>Role</strong><span>Architect / Creator</span></div>
                <div className="fact"><strong>Focus</strong><span>Design · Visualization · Education</span></div>
                <div className="fact"><strong>Tools</strong><span>SketchUp · D5 Render · Photoshop</span></div>
                <div className="fact"><strong>Instagram</strong><span>@agit_goyo</span></div>
              </div>
            </div>
            <div className="profile-visual">
              <img className="profile-image" src="/images/profile-goyo.jpg" alt="GOYO profile" />
              <span>Quiet but not small.</span>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="wrap">
            <div className="contact-box">
              <h2>Let’s make<br />something<br />clear.</h2>
              <div>
                <p>설계 협업, 렌더링 의뢰, 강의, 콘텐츠 협업을 제안하고 싶다면 편하게 연락주세요. 좋은 생각은 대화에서 시작된다고 믿습니다.</p>
                <div className="contact-links">
                  <a className="btn primary" href="mailto:hello@goyostudio.kr">메일 보내기</a>
                  <a className="btn" href="https://www.instagram.com/agit_goyo/" target="_blank" rel="noreferrer">인스타그램</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-inner">
          <div>© GOYO STUDIO. All rights reserved.</div>
          <div>Architecture · Visualization · Education</div>
        </div>
      </footer>
    </>
  );
}
