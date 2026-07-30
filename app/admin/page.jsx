"use client";

import { useState } from "react";
import AdminClassManager from "./AdminClassManager";
import AdminReviewManager from "./AdminReviewManager";
import AdminApplicationManager from "./AdminApplicationManager";

const tabs = [
  { key: "classes", label: "수업 관리" },
  { key: "reviews", label: "후기 정리" },
];

tabs.push({ key: "applications", label: "신청·환불 관리" });

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [draftPassword, setDraftPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("classes");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!draftPassword.trim()) {
      setMessage("관리자 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch("/api/admin/auth", {
        headers: {
          "x-admin-password": draftPassword,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "관리자 로그인에 실패했습니다.");
        return;
      }

      setPassword(draftPassword);
      setIsLoggedIn(true);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("관리자 로그인 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.loginCard}>
          <p style={styles.label}>GOYO STUDIO</p>
          <h1 style={styles.loginTitle}>관리자 페이지</h1>
          <p style={styles.desc}>
            비밀번호만 확인한 뒤 수업 관리와 후기 관리 화면으로 들어갑니다.
          </p>

          <input
            style={styles.input}
            type="password"
            placeholder="관리자 비밀번호"
            value={draftPassword}
            onChange={(event) => setDraftPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                void handleLogin();
              }
            }}
          />

          <button style={styles.button} onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? "확인 중..." : "로그인"}
          </button>

          {message ? <p style={styles.message}>{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrap}>
        <div style={styles.topHeader}>
          <div>
            <p style={styles.label}>GOYO ADMIN</p>
            <h1 style={styles.pageTitle}>수업 운영 대시보드</h1>
            <p style={styles.desc}>
              수업 일정과 후기 노출 상태를 한 곳에서 관리할 수 있습니다.
            </p>
          </div>
          <a href="/review" style={styles.previewLink}>
            후기 페이지 보기
          </a>
        </div>

        <div style={styles.tabRow}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              style={{
                ...styles.tabButton,
                ...(activeTab === tab.key ? styles.tabButtonActive : {}),
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "classes" ? <AdminClassManager password={password} isActive /> : null}
        {activeTab === "reviews" ? <AdminReviewManager password={password} isActive /> : null}
        {activeTab === "applications" ? <AdminApplicationManager password={password} isActive /> : null}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111",
    color: "#f5f1e8",
    padding: "64px 6vw 90px",
  },
  wrap: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gap: "28px",
  },
  loginCard: {
    width: "100%",
    maxWidth: "520px",
    margin: "60px auto 0",
    background: "#1b1b1b",
    borderRadius: "28px",
    padding: "42px",
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "flex-start",
  },
  label: {
    color: "#d88b3a",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
    margin: 0,
  },
  loginTitle: {
    fontSize: "42px",
    lineHeight: 1.1,
    margin: "10px 0 14px",
  },
  pageTitle: {
    fontSize: "48px",
    lineHeight: 1.02,
    margin: "10px 0 14px",
  },
  desc: {
    color: "#cfc8ba",
    lineHeight: 1.7,
    margin: 0,
  },
  input: {
    width: "100%",
    height: "54px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "#111",
    color: "#f5f1e8",
    padding: "0 16px",
    fontSize: "16px",
    marginTop: "24px",
  },
  button: {
    width: "100%",
    height: "54px",
    borderRadius: "999px",
    border: "none",
    background: "#f5f1e8",
    color: "#111",
    fontWeight: 900,
    cursor: "pointer",
    marginTop: "16px",
  },
  tabRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  tabButton: {
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "transparent",
    color: "#f5f1e8",
    fontWeight: 800,
    cursor: "pointer",
  },
  tabButtonActive: {
    background: "#f5f1e8",
    color: "#111",
  },
  previewLink: {
    display: "inline-flex",
    minHeight: "46px",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "#f5f1e8",
    textDecoration: "none",
    fontWeight: 800,
  },
  message: {
    marginTop: "18px",
    color: "#d88b3a",
    fontWeight: 800,
  },
};
