"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminApplicationManager({ password, isActive }) {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    const response = await fetch("/api/admin/applications", { headers: { "x-admin-password": password }, cache: "no-store" });
    const data = await response.json();
    setApplications(Array.isArray(data) ? data : []);
    if (!response.ok) setMessage(data.message || "신청 내역을 불러오지 못했습니다.");
  }, [password]);
  useEffect(() => {
    if (!isActive) return undefined;
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [isActive, load]);
  const cancel = async (application) => {
    const reason = window.prompt("취소/환불 사유를 입력하세요.", "수강 취소");
    if (reason === null || !window.confirm(`${application.name || "수강생"}님의 신청을 취소하고 좌석을 복원할까요?`)) return;
    const response = await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify({ id: application.id, reason }) });
    const data = await response.json();
    setMessage(data.message || "처리되었습니다.");
    if (response.ok) await load();
  };
  return <section style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><p style={{ color: "#d88b3a", fontWeight: 800 }}>APPLICATIONS</p><h2>신청·환불 관리</h2></div><button onClick={load}>새로고침</button></div>
    {applications.map((item) => <article key={item.id} style={{ padding: 20, borderRadius: 16, background: "#1b1b1b", display: "flex", gap: 20, justifyContent: "space-between", alignItems: "center" }}><div><strong>{item.name} · {item.class_type}</strong><p style={{ color: "#cfc8ba" }}>{item.email} · {Number(item.amount || 0).toLocaleString()}원 · {item.payment_status}</p></div>{item.payment_status === "cancelled" ? <span>취소됨</span> : <button onClick={() => cancel(item)} style={{ background: "#b64b4b", color: "white", border: 0, borderRadius: 10, padding: "10px 14px" }}>좌석 복원</button>}</article>)}
    {!applications.length ? <p>신청 내역이 없습니다.</p> : null}{message ? <p>{message}</p> : null}
  </section>;
}
