import React from "react";

export default function App() {
  const services = [
    {
      icon: "🎓",
      title: "강의 신청",
      text: "SketchUp, D5 Render, 건축 시각화 워크플로우를 실무자의 언어로 배웁니다.",
      link: "강의 보기",
      href: "#contact",
    },
    {
      icon: "📄",
      title: "PDF 파일",
      text: "렌더링 세팅, 표현법, 포트폴리오 구성법을 정리한 실전형 디지털 자료입니다.",
      link: "PDF 둘러보기",
      href: "#contact",
    },
    {
      icon: "↓",
      title: "무료 자료",
      text: "처음 시작하는 분들을 위한 무료 가이드, 체크리스트, 렌더링 팁을 제공합니다.",
      link: "무료 자료 받기",
      href: "#free",
    },
    {
      icon: "🖼",
      title: "이미지 외주 신청",
      text: "건축 투시도, 다이어그램, 컨셉 이미지, 프레젠테이션용 시각화를 의뢰할 수 있습니다.",
      link: "외주 문의하기",
      href: "#contact",
    },
  ];

  const portfolio = [
    {
      number: "01",
      label: "HOUSING",
      category: "Housing / Rendering",
      title: "Residential Visualization",
      text: "다세대 주거 프로젝트의 분위기와 재료감을 시각적으로 설득하는 이미지 작업.",
    },
    {
      number: "02",
      label: "CONCEPT",
      category: "Design / Concept",
      title: "Competition Concept",
      text: "공모전의 핵심 아이디어를 공간 구조와 이미지 언어로 정리한 컨셉 작업.",
    },
    {
      number: "03",
      label: "D5 STUDY",
      category: "Education / Rendering",
      title: "D5 Workflow Study",
      text: "실무자가 빠르게 결과물을 개선할 수 있는 D5 렌더링 워크플로우 연구.",
    },
  ];

  const fits = [
    "렌더링 결과물이 늘 아쉬웠던 분",
    "포트폴리오의 분위기와 완성도를 높이고 싶은 분",
    "건축 콘텐츠와 시각화로 수익화를 시작하고 싶은 분",
  ];

  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "#f5f1ea",
      color: "#211d18",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
      lineHeight: 1.6,
    },
    header: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      borderBottom: "1px solid rgba(33,29,24,0.12)",
      background: "rgba(245,241,234,0.88)",
      backdropFilter: "blur(18px)",
    },
    container: {
      width: "min(1180px, calc(100% - 40px))",
      margin: "0 auto",
    },
    nav: {
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    logoMark: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      background: "#211d18",
      color: "#f5f1ea",
      fontWeight: 800,
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: 32,
      fontSize: 14,
      color: "rgba(33,29,24,0.65)",
    },
    link: {
      color: "inherit",
      textDecoration: "none",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46,
      padding: "0 22px",
      borderRadius: 999,
      border: "1px solid transparent",
      background: "#211d18",
      color: "#f5f1ea",
      fontWeight: 800,
      fontSize: 14,
      textDecoration: "none",
      whiteSpace: "nowrap",
    },
    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46,
      padding: "0 22px",
      borderRadius: 999,
      border: "1px solid rgba(33,29,24,0.12)",
      background: "rgba(255,255,255,0.28)",
      color: "#211d18",
      fontWeight: 800,
      fontSize: 14,
      textDecoration: "none",
      whiteSpace: "nowrap",
    },
    hero: {
      position: "relative",
      overflow: "hidden",
      padding: "96px 0 88px",
    },
    heroGrid: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)",
      gap: 64,
      alignItems: "center",
    },
    blobOne: {
      position: "absolute",
      width: 440,
      height: 440,
      borderRadius: 999,
      filter: "blur(70px)",
      opacity: 0.7,
      background: "rgba(201,166,107,0.35)",
      right: -120,
      top: -140,
    },
    blobTwo: {
      position: "absolute",
      width: 360,
      height: 360,
      borderRadius: 999,
      filter: "blur(70px)",
      opacity: 0.7,
      background: "rgba(120,98,75,0.24)",
      left: -120,
      bottom: -160,
    },
    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 15px",
      border: "1px solid rgba(33,29,24,0.12)",
      borderRadius: 999,
      background: "rgba(255,255,255,0.38)",
      color: "rgba(33,29,24,0.65)",
      fontSize: 14,
      marginBottom: 28,
    },
    h1: {
      maxWidth: 780,
      fontSize: "clamp(46px, 7vw, 88px)",
      lineHeight: 1.03,
      letterSpacing: "-0.07em",
      fontWeight: 900,
      margin: 0,
    },
    heroCopy: {
      maxWidth: 680,
      marginTop: 28,
      fontSize: 20,
      lineHeight: 1.85,
      color: "rgba(33,29,24,0.65)",
      wordBreak: "keep-all",
    },
    actions: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 36,
    },
    heroCard: {
      aspectRatio: "4 / 5",
      borderRadius: 32,
      padding: 16,
      background: "#211d18",
      boxShadow: "0 24px 80px rgba(33,29,24,0.14)",
    },
    heroCardInner: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 24,
      padding: 32,
      color: "#fff",
      background:
        "linear-gradient(140deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), linear-gradient(135deg, #d7c6ad 0%, #bba17b 45%, #5b4b3d 100%)",
      overflow: "hidden",
    },
    label: {
      display: "inline-flex",
      width: "fit-content",
      padding: "8px 14px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.16)",
      fontSize: 13,
      color: "rgba(255,255,255,0.88)",
    },
    heroCardTitle: {
      marginTop: 22,
      fontSize: 48,
      lineHeight: 1.04,
      letterSpacing: "-0.05em",
      fontWeight: 900,
    },
    statList: {
      display: "grid",
      gap: 12,
    },
    stat: {
      padding: 16,
      borderRadius: 18,
      background: "rgba(255,255,255,0.16)",
      backdropFilter: "blur(12px)",
    },
    section: {
      padding: "88px 0",
    },
    sectionHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 32,
      marginBottom: 44,
    },
    kicker: {
      marginBottom: 12,
      color: "#9b7a4d",
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontSize: "clamp(34px, 5vw, 56px)",
      lineHeight: 1.14,
      letterSpacing: "-0.06em",
      fontWeight: 900,
      wordBreak: "keep-all",
      margin: 0,
    },
    sectionDesc: {
      maxWidth: 560,
      color: "rgba(33,29,24,0.65)",
      fontSize: 17,
      lineHeight: 1.8,
      wordBreak: "keep-all",
    },
    aboutGrid: {
      display: "grid",
      gridTemplateColumns: "0.8fr 1.2fr",
      gap: 64,
    },
    aboutText: {
      display: "grid",
      gap: 22,
      color: "rgba(33,29,24,0.65)",
      fontSize: 19,
      lineHeight: 1.9,
      wordBreak: "keep-all",
    },
    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 18,
    },
    card: {
      border: "1px solid rgba(33,29,24,0.12)",
      borderRadius: 24,
      background: "rgba(255,255,255,0.48)",
      padding: 28,
      boxShadow: "0 16px 50px rgba(33,29,24,0.04)",
    },
    icon: {
      width: 52,
      height: 52,
      display: "grid",
      placeItems: "center",
      borderRadius: 18,
      background: "#211d18",
      color: "#f5f1ea",
      fontSize: 24,
      marginBottom: 24,
      fontWeight: 900,
    },
    cardTitle: {
      fontSize: 22,
      margin: "0 0 12px",
      letterSpacing: "-0.03em",
    },
    cardText: {
      minHeight: 112,
      color: "rgba(33,29,24,0.65)",
      lineHeight: 1.75,
      wordBreak: "keep-all",
    },
    cardLink: {
      display: "inline-flex",
      marginTop: 24,
      fontWeight: 900,
      fontSize: 14,
      color: "#211d18",
      textDecoration: "none",
    },
    freeBox: {
      display: "grid",
      gridTemplateColumns: "1fr 0.9fr",
      gap: 48,
      alignItems: "center",
      borderRadius: 32,
      background: "#211d18",
      color: "#f5f1ea",
      padding: 56,
      boxShadow: "0 24px 80px rgba(33,29,24,0.14)",
    },
    freeDesc: {
      maxWidth: 640,
      color: "rgba(245,241,234,0.72)",
      fontSize: 17,
      lineHeight: 1.8,
      wordBreak: "keep-all",
    },
    formCard: {
      borderRadius: 24,
      background: "rgba(255,255,255,0.1)",
      padding: 28,
    },
    input: {
      width: "100%",
      height: 50,
      border: "1px solid rgba(255,255,255,0.14)",
      borderRadius: 999,
      background: "rgba(255,255,255,0.1)",
      color: "#fff",
      padding: "0 18px",
      outline: "none",
      marginBottom: 12,
    },
    lightButton: {
      width: "100%",
      minHeight: 50,
      borderRadius: 999,
      border: "none",
      background: "#f5f1ea",
      color: "#211d18",
      fontWeight: 900,
      cursor: "pointer",
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 22,
    },
    portfolioCard: {
      overflow: "hidden",
      border: "1px solid rgba(33,29,24,0.12)",
      borderRadius: 24,
      background: "rgba(255,255,255,0.48)",
    },
    portfolioThumb: {
      aspectRatio: "4 / 3",
      padding: 22,
      color: "#fff",
      background:
        "linear-gradient(140deg, rgba(255,255,255,0.12), rgba(255,255,255,0)), linear-gradient(135deg, #d4c0a0, #8d7356 52%, #2d261f)",
    },
    thumbFrame: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid rgba(255,255,255,0.25)",
      borderRadius: 20,
      padding: 20,
      fontWeight: 900,
    },
    portfolioBody: {
      padding: 26,
    },
    category: {
      color: "#9b7a4d",
      fontSize: 14,
      marginBottom: 8,
    },
    fitItem: {
      border: "1px solid rgba(33,29,24,0.12)",
      borderRadius: 24,
      background: "rgba(255,255,255,0.42)",
      padding: 28,
      fontSize: 19,
      fontWeight: 800,
      lineHeight: 1.7,
      wordBreak: "keep-all",
    },
    contact: {
      textAlign: "center",
      maxWidth: 860,
      margin: "0 auto",
    },
    contactActions: {
      display: "flex",
      justifyContent: "center",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 38,
    },
    footer: {
      borderTop: "1px solid rgba(33,29,24,0.12)",
      padding: "28px 0",
      color: "rgba(33,29,24,0.55)",
      fontSize: 14,
    },
    footerInner: {
      display: "flex",
      justifyContent: "space-between",
      gap: 20,
      flexWrap: "wrap",
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={{ ...styles.container, ...styles.nav }}>
          <a href="#" style={{ ...styles.logo, ...styles.link }}>
            <span style={styles.logoMark}>考</span>
            <span>GOYO STUDIO</span>
          </a>
          <nav style={styles.navLinks}>
            <a href="#about" style={styles.link}>소개</a>
            <a href="#portfolio" style={styles.link}>포트폴리오</a>
            <a href="#services" style={styles.link}>서비스</a>
            <a href="#contact" style={styles.link}>문의</a>
          </nav>
          <a href="#services" style={styles.button}>시작하기</a>
        </div>
      </header>

      <main>
        <section style={styles.hero}>
          <div style={styles.blobOne} />
          <div style={styles.blobTwo} />
          <div style={{ ...styles.container, ...styles.heroGrid }}>
            <div>
              <div style={styles.eyebrow}>✦ 건축가의 생각을 이미지와 교육으로 연결합니다</div>
              <h1 style={styles.h1}>건축은 언제나 상상으로부터,<br />상상을 설득하는 즐거운 과정.</h1>
              <p style={styles.heroCopy}>
                고요스튜디오는 건축 설계, 시각화, 교육 콘텐츠를 기반으로 건축하는 사람들의 표현력과 실무 감각을 함께 키우는 브랜드입니다.
              </p>
              <div style={styles.actions}>
                <a href="#services" style={styles.button}>서비스 둘러보기 →</a>
                <a href="#portfolio" style={styles.secondaryButton}>포트폴리오 보기</a>
              </div>
            </div>

            <div style={styles.heroCard}>
              <div style={styles.heroCardInner}>
                <div>
                  <span style={styles.label}>ARCHITECTURE / VISUAL / EDUCATION</span>
                  <div style={styles.heroCardTitle}>GOYO<br />STUDIO</div>
                </div>
                <div style={styles.statList}>
                  <div style={styles.stat}>✓ 10년차 건축사</div>
                  <div style={styles.stat}>✓ 8,000+ 건축 커뮤니티</div>
                  <div style={styles.stat}>✓ 설계·시각화·교육 통합</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" style={styles.section}>
          <div style={{ ...styles.container, ...styles.aboutGrid }}>
            <div>
              <p style={styles.kicker}>About</p>
              <h2 style={styles.sectionTitle}>툴을 넘어,<br />생각을 전달하는 방식.</h2>
            </div>
            <div style={styles.aboutText}>
              <p>
                좋은 이미지는 단순히 예쁜 렌더링이 아니라, 설계자의 생각을 정확하게 전달하는 언어입니다. 고요스튜디오는 건축 실무 경험을 바탕으로 설계와 시각화, 교육을 하나의 흐름으로 다룹니다.
              </p>
              <p>
                학생, 취준생, 실무자, 그리고 건축 콘텐츠를 필요로 하는 사람들에게 실질적인 방법과 결과물을 제공합니다. 어렵게 말하면 브랜드고, 쉽게 말하면 건축인의 비밀 아지트. 거의 치트키 상점입니다.
              </p>
            </div>
          </div>
        </section>

        <section id="services" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHead}>
              <div>
                <p style={styles.kicker}>Services</p>
                <h2 style={styles.sectionTitle}>필요한 순간에 바로 연결되는 서비스</h2>
              </div>
              <p style={styles.sectionDesc}>배우고, 내려받고, 의뢰하고, 함께 성장할 수 있는 구조로 설계했습니다.</p>
            </div>

            <div style={styles.grid4}>
              {services.map((service) => (
                <article key={service.title} style={styles.card}>
                  <div style={styles.icon}>{service.icon}</div>
                  <h3 style={styles.cardTitle}>{service.title}</h3>
                  <p style={styles.cardText}>{service.text}</p>
                  <a href={service.href} style={styles.cardLink}>{service.link} →</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="free" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.freeBox}>
              <div>
                <p style={{ ...styles.kicker, color: "#c9a66b" }}>Free Resource</p>
                <h2 style={styles.sectionTitle}>처음이라면 무료 자료부터 받아보세요.</h2>
                <p style={styles.freeDesc}>
                  D5 렌더링 기본 세팅, 포트폴리오 체크리스트, 이미지 퀄리티를 높이는 작은 습관들을 정리해 제공합니다. 무료 자료는 이후 강의와 PDF 구매로 자연스럽게 이어지는 입구입니다.
                </p>
              </div>
              <div style={styles.formCard}>
                <h3 style={{ marginTop: 0, marginBottom: 18, fontSize: 22 }}>무료 자료 신청</h3>
                <input aria-label="이메일 주소" type="email" placeholder="이메일 주소" style={styles.input} />
                <button type="button" style={styles.lightButton}>자료 받기 →</button>
              </div>
            </div>
          </div>
        </section>

        <section id="portfolio" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHead}>
              <div>
                <p style={styles.kicker}>Portfolio</p>
                <h2 style={styles.sectionTitle}>작업의 결과보다 먼저,<br />생각의 방향을 보여줍니다.</h2>
              </div>
            </div>

            <div style={styles.grid3}>
              {portfolio.map((item) => (
                <article key={item.number} style={styles.portfolioCard}>
                  <div style={styles.portfolioThumb}>
                    <div style={styles.thumbFrame}>
                      <span>{item.number}</span>
                      <strong>{item.label}</strong>
                    </div>
                  </div>
                  <div style={styles.portfolioBody}>
                    <p style={styles.category}>{item.category}</p>
                    <h3 style={styles.cardTitle}>{item.title}</h3>
                    <p style={styles.sectionDesc}>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={{ ...styles.container, ...styles.grid3 }}>
            {fits.map((fit) => (
              <div key={fit} style={styles.fitItem}>✓ {fit}</div>
            ))}
          </div>
        </section>

        <section id="contact" style={styles.section}>
          <div style={{ ...styles.container, ...styles.contact }}>
            <p style={styles.kicker}>Contact</p>
            <h2 style={styles.sectionTitle}>고요스튜디오와 함께 시작해볼까요?</h2>
            <p style={{ ...styles.sectionDesc, margin: "22px auto 0" }}>
              강의, 자료 구매, 이미지 외주, 협업 제안까지 편하게 문의해주세요. 생각만 들고 오셔도 됩니다. 나머지는 같이 그려보면 됩니다.
            </p>
            <div style={styles.contactActions}>
              <a href="mailto:hello@goyostudio.kr" style={styles.button}>문의하기</a>
              <a href="https://www.instagram.com/agit_goyo" target="_blank" rel="noreferrer" style={styles.secondaryButton}>@agit_goyo</a>
              <a href="#services" style={styles.secondaryButton}>서비스 다시 보기</a>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div style={{ ...styles.container, ...styles.footerInner }}>
          <p>© GOYO STUDIO. Architecture, Visual, Education.</p>
          <p>생각할 고, 중요할 요. 건축에서 중요한 것은 결국 생각입니다.</p>
        </div>
      </footer>
    </div>
  );
}
