"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
const [newClass, setNewClass] = useState({
  id: "",
  title: "",
  date: "",
  price: 240000,
  capacity: 8,
  sort_order: 99,
  is_active: true,
});
  const loadClasses = async () => {
    setMessage("");

    const response = await fetch("/api/admin/classes", {
      headers: {
        "x-admin-password": password,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "불러오기에 실패했습니다.");
      return;
    }

    setClasses(data);
    setIsLoggedIn(true);
  };
const deleteClass = async (id) => {
  const ok = confirm(
    "정말 이 강의를 삭제할까요?\n결제자가 있는 강의는 삭제되지 않습니다."
  );

  if (!ok) return;

  setMessage("삭제 중...");

  const response = await fetch(`/api/admin/classes?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      "x-admin-password": password,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "삭제에 실패했습니다.");
    return;
  }

  setMessage("삭제되었습니다.");
  setClasses((prev) => prev.filter((item) => item.id !== id));
};
  const updateClass = async (classItem) => {
    setMessage("저장 중...");

    const response = await fetch("/api/admin/classes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify(classItem),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message || "저장에 실패했습니다.");
      return;
    }

    setMessage("저장되었습니다.");
    setClasses((prev) =>
      prev.map((item) => (item.id === data.id ? data : item))
    );
  };
const createClass = async () => {
  setMessage("새 강의를 추가하는 중...");

  const response = await fetch("/api/admin/classes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(newClass),
  });

  const data = await response.json();

  if (!response.ok) {
    setMessage(data.message || "새 강의 추가에 실패했습니다.");
    return;
  }

  setMessage("새 강의가 추가되었습니다.");
  setClasses((prev) => [...prev, data]);
  setNewClass({
    id: "",
    title: "",
    date: "",
    price: 240000,
    capacity: 8,
    sort_order: 99,
    is_active: true,
  });
};
  const changeClass = (id, key, value) => {
    setClasses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  };

  if (!isLoggedIn) {
    return (
      <main style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>GOYO 관리자</h1>
          <p style={styles.desc}>관리자 비밀번호를 입력해주세요.</p>

          <input
            style={styles.input}
            type="password"
            placeholder="관리자 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={loadClasses}>
            관리자 페이지 들어가기
          </button>

          {message && <p style={styles.message}>{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrap}>
        <div style={styles.header}>
          <div>
            <p style={styles.label}>GOYO STUDIO</p>
            <h1 style={styles.title}>강의 관리 페이지</h1>
            <p style={styles.desc}>
              강의 날짜, 수강료, 정원, 노출 여부를 수정할 수 있습니다.
            </p>
          </div>
          <button style={styles.smallButton} onClick={loadClasses}>
            새로고침
          </button>
        </div>
<div style={styles.classCard}>
  <p style={styles.label}>NEW CLASS</p>
  <h2 style={{ marginTop: 0 }}>새 강의 추가</h2>

  <label style={styles.formLabel}>고유 ID</label>
  <input
    style={styles.input}
    value={newClass.id}
    placeholder="예: d5-basic-202406"
    onChange={(e) => setNewClass({ ...newClass, id: e.target.value })}
  />

  <label style={styles.formLabel}>강의명</label>
  <input
    style={styles.input}
    value={newClass.title}
    placeholder="예: D5 투시도(초급반)"
    onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
  />

  <label style={styles.formLabel}>강의 날짜</label>
  <input
    style={styles.input}
    value={newClass.date}
    placeholder="예: 06/10"
    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
  />

  <label style={styles.formLabel}>수강료</label>
  <input
    style={styles.input}
    type="number"
    value={newClass.price}
    onChange={(e) => setNewClass({ ...newClass, price: e.target.value })}
  />

  <label style={styles.formLabel}>정원</label>
  <input
    style={styles.input}
    type="number"
    value={newClass.capacity}
    onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
  />

  <label style={styles.formLabel}>정렬 순서</label>
  <input
    style={styles.input}
    type="number"
    value={newClass.sort_order}
    onChange={(e) => setNewClass({ ...newClass, sort_order: e.target.value })}
  />

  <label style={styles.checkboxRow}>
    <input
      type="checkbox"
      checked={newClass.is_active}
      onChange={(e) =>
        setNewClass({ ...newClass, is_active: e.target.checked })
      }
    />
    신청 페이지에 노출
  </label>

  <button style={styles.button} onClick={createClass}>
    새 강의 추가하기
  </button>
</div>

        <div style={styles.grid}>
          {classes.map((item) => (
            <div key={item.id} style={styles.classCard}>
              <p style={styles.label}>{item.id}</p>

              <label style={styles.formLabel}>강의명</label>
              <input
                style={styles.input}
                value={item.title}
                onChange={(e) => changeClass(item.id, "title", e.target.value)}
              />

              <label style={styles.formLabel}>강의 날짜</label>
              <input
                style={styles.input}
                value={item.date}
                placeholder="예: 05/15"
                onChange={(e) => changeClass(item.id, "date", e.target.value)}
              />

              <label style={styles.formLabel}>수강료</label>
              <input
                style={styles.input}
                type="number"
                value={item.price}
                onChange={(e) => changeClass(item.id, "price", e.target.value)}
              />

              <label style={styles.formLabel}>정원</label>
              <input
                style={styles.input}
                type="number"
                value={item.capacity}
                onChange={(e) =>
                  changeClass(item.id, "capacity", e.target.value)
                }
              />

              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) =>
                    changeClass(item.id, "is_active", e.target.checked)
                  }
                />
                신청 페이지에 노출
              </label>

              <button style={styles.button} onClick={() => updateClass(item)}>
                저장하기
              </button>
              <button
  style={{
    ...styles.button,
    marginTop: "12px",
    background: "#3a2727",
    color: "#fff",
  }}
  onClick={() => deleteClass(item.id)}
>
  강의 삭제하기
</button>
            </div>
          ))}
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111",
    color: "#f5f1e8",
    padding: "80px 6vw",
  },
  wrap: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto",
    background: "#1b1b1b",
    borderRadius: "28px",
    padding: "42px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "flex-start",
    marginBottom: "36px",
  },
  label: {
    color: "#d88b3a",
    fontSize: "13px",
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.15,
    margin: "0 0 14px",
  },
  desc: {
    color: "#cfc8ba",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  classCard: {
    background: "#1b1b1b",
    borderRadius: "26px",
    padding: "30px",
  },
  formLabel: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "#111",
    color: "#f5f1e8",
    padding: "0 16px",
    fontSize: "16px",
  },
  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "22px",
    marginBottom: "22px",
    color: "#cfc8ba",
  },
  button: {
    width: "100%",
    height: "52px",
    borderRadius: "999px",
    border: "none",
    background: "#f5f1e8",
    color: "#111",
    fontWeight: 900,
    cursor: "pointer",
  },
  smallButton: {
    height: "44px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "#f5f1e8",
    fontWeight: 800,
    cursor: "pointer",
  },
  message: {
    marginTop: "24px",
    color: "#d88b3a",
    fontWeight: 800,
  },
};