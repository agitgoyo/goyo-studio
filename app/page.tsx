import Image from "next/image";
import Link from "next/link";

const works = [
  {
    title: "독봉산 근린공원",
    category: "Public Design · Competition",
    description:
      "공공 공간의 흐름과 풍경을 함께 설계한 제안입니다. 장소의 결, 이용자의 동선, 자연과 시설의 관계를 하나의 장면으로 풀어냈습니다.",
    image: "/images/project-dokbongsan.jpg",
    imageAlt: "독봉산 근린공원 프로젝트 이미지",
    variant: "wide dark",
  },
  {
    title: "연온재",
    category: "Residential · Concept",
    description:
      "주거의 온도와 분위기를 담아낸 프로젝트입니다. 차분한 재료감과 생활의 리듬을 중심으로 공간 이미지를 구성했습니다.",
    image: "/images/project-yeononjae.jpg",
    imageAlt: "연온재 프로젝트 이미지",
    variant: "small",
  },
  {
    title: "Tiny House",
    category: "Small House · Visualization",
    description:
      "작은 집이 가진 밀도와 여백을 함께 보여주는 작업입니다. 제한된 규모 안에서도 생활감과 분위기가 살아나도록 설계했습니다.",
    image: "/images/project-tinyhouse.jpg",
    imageAlt: "Tiny House 프로젝트 이미지",
    variant: "",
  },
  {
    title: "High-end Life",
    category: "Competition · Lifestyle",
    description:
      "라이프스타일과 공간 경험을 결합한 공모 작업입니다. 프로그램과 이미지, 사용자의 감각을 하나의 이야기로 연결했습니다.",
    image: "/images/project-highandlife.jpg",
    imageAlt: "High-end Life 프로젝트 이미지",
    variant: "dark",
  },
];

const services = [
  {
    number: "01",
    title: "D5 Render 강의",
    description:
      "SketchUp과 D5를 바탕으로 건축 이미지를 만드는 과정을 실무 흐름에 맞춰 안내합니다.",
    image: "/images/service-lecture.jpg",
    imageAlt: "D5 Render 강의 이미지",
    href: "/d5-class",
    label: "강의 자세히 보기",
  },
  {
    number: "02",
    title: "PDF 자료",
    description:
      "렌더 세팅, 표현법, 포트폴리오 구성법을 정리한 자료를 통해 작업 과정을 더 선명하게 정리할 수 있습니다.",
    image: "/images/service-pdf.jpg",
    imageAlt: "PDF 자료 이미지",
    href: "#contact",
    label: "자료 문의하기",
  },
  {
    number: "03",
    title: "무료 자료",
    description:
      "처음 시작하는 분들을 위한 체크리스트와 가이드, 렌더 팁을 가볍게 받아보실 수 있습니다.",
    image: "/images/service-free.jpg",
    imageAlt: "무료 자료 이미지",
    href: "#contact",
    label: "무료 자료 받기",
  },
  {
    number: "04",
    title: "이미지 외주",
    description:
      "건축 투시도, 다이어그램용 콘셉트 이미지, 프레젠테이션용 시각화를 프로젝트에 맞춰 제작합니다.",
    image: "/images/service-outsource.jpg",
    imageAlt: "이미지 외주 작업 이미지",
    href: "/image-request",
    label: "외주 문의하기",
  },
];

const keywords = [
  "Architecture Design",
  "Concept Planning",
  "3D Visualization",
  "SketchUp · D5",
  "Education",
];

export default function Page() {
  return (
    <>
      <style>{`
        :root {
          --bg: #fcfcfa;
          --paper: #ffffff;
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
          background: var(--bg);
          color: var(--ink);
          line-height: 1.65;
        }

        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }

        .page-shell {
          min-height: 100vh;
        }

        .wrap {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .site-header {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(252, 252, 250, 0.86);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(221, 213, 200, 0.75);
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
          letter-spacing: 0.01em;
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
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
          align-items: end;
        }

        .eyebrow {
          display: inline-flex;
          padding: 8px 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--accent);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 26px;
        }

        h1 {
          margin: 0;
          font-size: clamp(54px, 8.8vw, 132px);
          line-height: 0.88;
          letter-spacing: -0.085em;
          font-weight: 950;
        }

        .hero-logo-wrap {
          width: min(100%, 420px);
          margin-bottom: 14px;
        }

        .hero-logo {
          width: 100%;
          height: auto;
          mix-blend-mode: multiply;
        }

        .hero-heading-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .hero-desc {
          max-width: 680px;
          margin: 30px 0 0;
          color: var(--muted);
          font-size: clamp(18px, 2vw, 22px);
          letter-spacing: -0.02em;
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
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, color 0.18s ease;
        }

        .btn:hover { transform: translateY(-2px); }

        .btn.primary {
          background: var(--ink);
          color: var(--white);
          box-shadow: 0 18px 38px rgba(24, 24, 22, 0.16);
        }

        .btn.secondary { background: transparent; }

        .hero-visual {
          position: relative;
          overflow: hidden;
          min-height: 560px;
          border: 1px solid var(--line);
          border-radius: 34px;
          box-shadow: 0 32px 80px rgba(38, 35, 31, 0.14);
          background: linear-gradient(145deg, rgba(24, 24, 22, 0.08), rgba(24, 24, 22, 0.02));
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
          background: linear-gradient(90deg, rgba(244, 241, 235, 0.18) 0%, rgba(244, 241, 235, 0.08) 18%, rgba(244, 241, 235, 0) 38%);
        }

        .hero-title-stack {
          position: absolute;
          left: 26px;
          bottom: 26px;
          z-index: 1;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 950;
          color: var(--white);
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
          line-height: 0.98;
          letter-spacing: -0.065em;
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
          border: 1px solid rgba(24, 24, 22, 0.18);
          border-radius: 18px;
          background: var(--paper);
          box-shadow: 0 14px 36px rgba(38, 35, 31, 0.08);
          font-size: 18px;
          font-weight: 950;
          letter-spacing: 0.02em;
          white-space: nowrap;
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
          grid-template-columns: 0.8fr 1.2fr;
          gap: 48px;
        }

        .intro-title {
          font-size: clamp(36px, 5vw, 68px);
          line-height: 1.02;
          letter-spacing: -0.06em;
          font-weight: 950;
        }

        .intro-copy {
          color: #d2cabd;
          font-size: clamp(19px, 2.2vw, 28px);
          line-height: 1.52;
          letter-spacing: -0.035em;
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
          border: 1px solid rgba(255, 255, 255, 0.18);
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
          border: 1px solid var(--line);
          border-radius: 34px;
          overflow: hidden;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .project:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(38, 35, 31, 0.13);
        }

        .project.wide { grid-column: span 8; }
        .project.small { grid-column: span 4; }

        .thumb {
          min-height: 330px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(24, 24, 22, 0.1), rgba(24, 24, 22, 0.02)), repeating-linear-gradient(135deg, #d8cebd 0, #d8cebd 12px, #f7efe3 12px, #f7efe3 24px);
        }

        .thumb.dark { background: #26231f; }

        .thumb img {
          width: 100%;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .project:hover .thumb img {
          transform: scale(1.04);
        }

        .project-body {
          padding: 26px;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          gap: 18px;
        }

        .project-meta {
          color: var(--accent);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .project h3 {
          margin: 0;
          font-size: clamp(26px, 3vw, 40px);
          line-height: 1.04;
          letter-spacing: -0.055em;
          font-weight: 700;
        }

        .project p {
          margin: 0;
          color: var(--muted);
          word-break: keep-all;
        }

        .services {
          position: relative;
          overflow: hidden;
          background: #f4f1eb;
        }

        .services::before {
          content: "SERVICES";
          position: absolute;
          right: -18px;
          top: 26px;
          font-size: clamp(72px, 13vw, 180px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.08em;
          color: rgba(24, 24, 22, 0.055);
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
          line-height: 0.86;
          letter-spacing: -0.08em;
        }

        .services .section-head p {
          max-width: 520px;
          padding-top: 12px;
          font-size: 18px;
          color: rgba(24, 24, 22, 0.68);
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
          background: rgba(255, 250, 242, 0.9);
          border: 1px solid rgba(24, 24, 22, 0.16);
          border-radius: 34px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 22px 70px rgba(38, 35, 31, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .service:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 90px rgba(38, 35, 31, 0.18);
        }

        .service-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          background: linear-gradient(145deg, rgba(24, 24, 22, 0.1), rgba(24, 24, 22, 0.02));
        }

        .service-content {
          padding: 28px;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
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
          letter-spacing: 0.02em;
        }

        .service h3 {
          margin: 24px 0 12px;
          font-size: clamp(25px, 3vw, 30px);
          line-height: 0.98;
          letter-spacing: -0.06em;
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
          width: fit-content;
          min-height: 42px;
          align-items: center;
          justify-content: center;
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
          grid-template-columns: 0.95fr 1.05fr;
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
          letter-spacing: -0.06em;
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
          font-size: 18px;
        }

        .fact strong { color: var(--ink); }

        .profile-visual {
          position: relative;
          overflow: hidden;
          min-height: 500px;
          border: 1px solid var(--line);
          border-radius: 34px;
          display: flex;
          align-items: end;
          padding: 28px;
          font-size: clamp(34px, 4vw, 58px);
          font-weight: 950;
          line-height: 0.96;
          letter-spacing: -0.06em;
          color: var(--white);
          background: var(--dark);
        }

        .profile-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.78;
        }

        .profile-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.62) 100%);
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
          grid-template-columns: 1fr 0.75fr;
          gap: 40px;
          align-items: end;
        }

        .contact-box h2 {
          margin: 0;
          font-size: clamp(42px, 7vw, 86px);
          line-height: 0.95;
          letter-spacing: -0.07em;
        }

        .contact-box p {
          margin: 0 0 26px;
          color: #d2cabd;
          font-size: 18px;
          word-break: keep-all;
        }

        .contact-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .contact-box .btn {
          border-color: rgba(255, 255, 255, 0.8);
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
          align-items: center;
        }

        .footer-business {
          width: 100%;
          padding-top: 18px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .footer-business strong {
          color: var(--ink);
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

          .hero-logo-wrap {
            width: min(100%, 300px);
            margin-bottom: 10px;
          }

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

      <div className="page-shell">
        <header className="site-header">
          <div className="wrap nav">
            <Link className="logo" href="/">
              GOYO STUDIO
            </Link>
            <nav className="nav-links">
              <a href="#works">Works</a>
              <a href="#services">Services</a>
              <a href="#profile">Profile</a>
              <a href="#contact">Contact</a>
            </nav>
            <a className="nav-cta" href="#contact">
              문의하기
            </a>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="wrap hero-grid">
              <div>
                <div className="eyebrow">Architect · Visualizer · Educator</div>
                <div className="hero-logo-wrap">
                  <Image
                    className="hero-logo"
                    src="/images/goyo-logo.png"
                    alt="GOYO STUDIO 로고"
                    width={933}
                    height={626}
                    priority
                    sizes="(max-width: 560px) 88vw, (max-width: 960px) 70vw, 560px"
                  />
                </div>
                <h1 className="hero-heading-sr">GOYO STUDIO</h1>
                <p className="hero-desc">
                  고요스튜디오는 건축 설계, 공간 이미지, 렌더링 콘텐츠를 통해 생각이 있는
                  건축을 만들고 공유합니다. 설계자의 관점으로 공간을 읽고, 이미지로
                  설득합니다.
                </p>
                <div className="hero-actions">
                  <a className="btn primary" href="#works">
                    포트폴리오 보기
                  </a>
                  <a className="btn secondary" href="#services">
                    서비스 보기
                  </a>
                </div>
              </div>

              <div className="hero-visual">
                <Image
                  className="hero-image"
                  src="/images/hero-main.jpg"
                  alt="GOYO STUDIO 대표 이미지"
                  fill
                  preload
                  sizes="(max-width: 960px) 100vw, 45vw"
                />
                <div className="hero-gradient" />
                <div className="hero-title-stack">
                  Design with
                  <br />
                  quiet intensity
                </div>
              </div>
            </div>
          </section>

          <section className="intro">
            <div className="wrap intro-grid">
              <div className="intro-title">
                생각은 구조로,
                <br />
                구조는 이미지로.
              </div>
              <div>
                <div className="intro-copy">
                  건축은 결국 무엇을 보이게 할지 정하는 일이라고 믿습니다. 고요 스튜디오는
                  개념의 방향, 공간의 분위기, 설계의 핵심을 또렷하게 읽히는 시각 언어로
                  풀어냅니다.
                </div>
                <div className="keyword-row">
                  {keywords.map((keyword) => (
                    <span key={keyword} className="keyword">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="works">
            <div className="wrap">
              <div className="section-head">
                <div className="works-title-row">
                  <h2>
                    Selected
                    <br />
                    Works
                  </h2>
                  <a
                    className="more-portfolio-btn"
                    href="https://agit-goyo.myportfolio.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    MORE PORTFOLIO
                  </a>
                </div>
              </div>

              <div className="project-grid">
                {works.map((work) => (
                  <article key={work.title} className={`project ${work.variant}`.trim()}>
                    <div className={`thumb ${work.variant.includes("dark") ? "dark" : ""}`.trim()}>
                      <Image src={work.image} alt={work.imageAlt} fill sizes="(max-width: 960px) 100vw, 50vw" />
                    </div>
                    <div className="project-body">
                      <div>
                        <div className="project-meta">{work.category}</div>
                        <h3>{work.title}</h3>
                        <p>{work.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="services" className="services">
            <div className="wrap">
              <div className="section-head">
                <h2>SERVICES</h2>
                <p>
                  강의, 자료, 이미지 제작까지 건축 시각화 작업에 필요한 흐름을 한 스튜디오 안에서
                  연결합니다.
                </p>
              </div>

              <div className="service-grid">
                {services.map((service) => {
                  const isInternal = service.href.startsWith("/");

                  return (
                    <article key={service.number} className="service">
                      <Image
                        className="service-image"
                        src={service.image}
                        alt={service.imageAlt}
                        width={640}
                        height={440}
                        sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 25vw"
                      />
                      <div className="service-content">
                        <div>
                          <small>{service.number}</small>
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                        </div>
                        {isInternal ? (
                          <Link className="service-link" href={service.href}>
                            {service.label}
                          </Link>
                        ) : (
                          <a className="service-link" href={service.href}>
                            {service.label}
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="profile">
            <div className="wrap profile-grid">
              <div className="profile-card">
                <h2>
                  About
                  <br />
                  GOYO
                </h2>
                <p>
                  건축 실무와 시각화 작업을 함께 다뤄온 경험을 바탕으로, 설계의 의도와 이미지를
                  자연스럽게 연결하는 일을 합니다. 보기 좋은 그림보다 전달력 있는 장면을 더 중요하게
                  생각합니다.
                </p>
                <p>
                  인스타그램 <strong>@agit_goyo</strong>를 통해 SketchUp, D5 Render, 건축 이미지
                  제작 과정을 나누며 건축을 공부하고 작업하는 사람들과 꾸준히 소통하고 있습니다.
                </p>
                <div className="facts">
                  <div className="fact">
                    <strong>Role</strong>
                    <span>Architect / Creator</span>
                  </div>
                  <div className="fact">
                    <strong>Focus</strong>
                    <span>Design · Visualization · Education</span>
                  </div>
                  <div className="fact">
                    <strong>Tools</strong>
                    <span>SketchUp · D5 Render · Photoshop</span>
                  </div>
                  <div className="fact">
                    <strong>Instagram</strong>
                    <span>@agit_goyo</span>
                  </div>
                </div>
              </div>

              <div className="profile-visual">
                <Image
                  className="profile-image"
                  src="/images/profile-goyo.jpg"
                  alt="GOYO 프로필 이미지"
                  fill
                  sizes="(max-width: 960px) 100vw, 50vw"
                />
                <span>Quiet but not small.</span>
              </div>
            </div>
          </section>

          <section id="contact" className="contact">
            <div className="wrap">
              <div className="contact-box">
                <h2>
                  Let&apos;s make
                  <br />
                  something
                  <br />
                  clear.
                </h2>
                <div>
                  <p>
                    설계 작업, 렌더 외주, 강의, 콘텐츠 협업까지 열려 있습니다. 다루고 싶은 프로젝트가
                    있다면 편하게 연락 주세요. 좋은 생각은 더 선명한 전달에서 시작된다고 믿습니다.
                  </p>
                  <div className="contact-links">
                    <a className="btn primary" href="mailto:agit.goyo@gmail.com">
                      메일 보내기
                    </a>
                    <a
                      className="btn"
                      href="https://www.instagram.com/agit_goyo/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      인스타그램
                    </a>
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
            <Link href="/admin" className="admin-button">
              관리자 페이지
            </Link>
            <div className="footer-business">
              <strong>상호명</strong> 고요스튜디오 | <strong>대표자</strong> 한인용 |{" "}
              <strong>사업자등록번호</strong> 392-02-04286
              <br />
              <strong>사업장 주소</strong> 경기도 수원시 장안구 천천로22번길 34 | <strong>대표번호</strong> 010 6529 7029
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
