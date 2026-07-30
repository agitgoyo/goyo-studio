"use client";

import { useCallback, useEffect, useState } from "react";

const emptyClass = {
  title: "",
  date: "06-20(토)",
  time_text: "",
  price: 120000,
  capacity: 8,
  sort_order: 99,
  is_active: true,
  class_type: "individual",
  bundle_class_ids: [],
};

export default function AdminClassManager({ password, isActive }) {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newClass, setNewClass] = useState(emptyClass);

  const loadClasses = useCallback(async () => {
    if (!password) return;

    try {
      setIsLoading(true);
      setMessage("");

      const response = await fetch("/api/admin/classes", {
        headers: {
          "x-admin-password": password,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "수업 목록을 불러오지 못했습니다.");
        return;
      }

      setClasses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("수업 목록을 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (!isActive) return;

    const timeoutId = window.setTimeout(() => {
      void loadClasses();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isActive, loadClasses]);

  const deleteClass = async (id) => {
    if (
      !window.confirm(
        "정말 이 수업을 삭제할까요? 연결된 신청/후기 데이터도 함께 정리될 수 있습니다."
      )
    ) {
      return;
    }

    try {
      setMessage("수업을 삭제하는 중입니다...");

      const response = await fetch(`/api/admin/classes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "수업을 삭제하지 못했습니다.");
        return;
      }

      await loadClasses();
      setMessage(data.message || "수업을 삭제했습니다.");
    } catch (error) {
      console.error(error);
      setMessage("수업 삭제 중 문제가 발생했습니다.");
    }
  };

  const updateClass = async (classItem) => {
    if (
      !String(classItem.title || "").trim() ||
      !String(classItem.date || "").trim() ||
      !String(classItem.time_text || "").trim() ||
      !Number(classItem.price) ||
      !Number(classItem.capacity)
    ) {
      setMessage("수업명, 날짜, 시간, 금액, 정원을 모두 입력해 주세요.");
      return;
    }

    try {
      setMessage("수업 정보를 저장하는 중입니다...");

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
        setMessage(data.message || "수업 정보를 저장하지 못했습니다.");
        return;
      }

      await loadClasses();
      setMessage("수업 정보를 저장했습니다.");
    } catch (error) {
      console.error(error);
      setMessage("수업 저장 중 문제가 발생했습니다.");
    }
  };

  const createClass = async () => {
    if (
      !String(newClass.title || "").trim() ||
      !String(newClass.date || "").trim() ||
      !String(newClass.time_text || "").trim() ||
      !Number(newClass.price) ||
      (newClass.class_type !== "master" && !Number(newClass.capacity)) ||
      (newClass.class_type === "master" && !newClass.bundle_class_ids.length)
    ) {
      setMessage("수업명, 날짜, 시간, 금액, 정원을 모두 입력해 주세요.");
      return;
    }

    try {
      setMessage("새 수업을 만드는 중입니다...");

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
        setMessage(data.message || "새 수업을 만들지 못했습니다.");
        return;
      }

      await loadClasses();
      setNewClass(emptyClass);
      setMessage("새 수업을 만들었습니다.");
    } catch (error) {
      console.error(error);
      setMessage("수업 생성 중 문제가 발생했습니다.");
    }
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

  return (
    <section style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <p style={styles.label}>GOYO STUDIO</p>
          <h2 style={styles.title}>수업 관리</h2>
          <p style={styles.desc}>
            수업명, 날짜, 시간, 금액, 정원, 신청 페이지 노출 여부를 한 곳에서 관리합니다.
          </p>
        </div>
        <button style={styles.smallButton} onClick={loadClasses} disabled={isLoading}>
          {isLoading ? "불러오는 중..." : "새로고침"}
        </button>
      </div>

      <div style={styles.classCard}>
        <p style={styles.label}>NEW CLASS</p>
        <h3 style={styles.cardTitle}>새 수업 추가</h3>

        <label style={styles.formLabel}>수업 유형</label>
        <select style={styles.input} value={newClass.class_type} onChange={(event) => setNewClass({ ...newClass, class_type: event.target.value, bundle_class_ids: [] })}>
          <option value="individual">개별 수업</option>
          <option value="master">마스터클래스</option>
        </select>

        <label style={styles.formLabel}>수업명</label>
        <input
          style={styles.input}
          value={newClass.title}
          placeholder="예: 왕초보반"
          onChange={(event) => setNewClass({ ...newClass, title: event.target.value })}
        />

        <label style={styles.formLabel}>수업 날짜</label>
        <input
          style={styles.input}
          value={newClass.date}
          placeholder="예: 06-20(토)"
          onChange={(event) => setNewClass({ ...newClass, date: event.target.value })}
        />

        <label style={styles.formLabel}>수업 시간</label>
        <input
          style={styles.input}
          value={newClass.time_text}
          placeholder="예: 오전 9시~12시 / 오후 1시~6시 / 13:00~18:00"
          onChange={(event) =>
            setNewClass({ ...newClass, time_text: event.target.value })
          }
        />

        <label style={styles.formLabel}>금액</label>
        <input
          style={styles.input}
          type="number"
          value={newClass.price}
          onChange={(event) => setNewClass({ ...newClass, price: event.target.value })}
        />

        {newClass.class_type === "master" ? <><label style={styles.formLabel}>포함 수업</label>{classes.filter((item) => item.class_type !== "master").map((item) => <label key={item.id} style={styles.checkboxRow}><input type="checkbox" checked={newClass.bundle_class_ids.includes(item.id)} onChange={(event) => setNewClass({ ...newClass, bundle_class_ids: event.target.checked ? [...newClass.bundle_class_ids, item.id] : newClass.bundle_class_ids.filter((id) => id !== item.id) })} />{item.title}</label>)}</> : null}

        {newClass.class_type !== "master" ? <><label style={styles.formLabel}>정원</label>
        <input
          style={styles.input}
          type="number"
          value={newClass.capacity}
          onChange={(event) =>
            setNewClass({ ...newClass, capacity: event.target.value })
          }
        />
        </> : <p style={styles.desc}>마스터 정원은 포함 수업의 최소 잔여석으로 자동 계산됩니다.</p>}

        <label style={styles.formLabel}>정렬 순서</label>
        <input
          style={styles.input}
          type="number"
          value={newClass.sort_order}
          onChange={(event) =>
            setNewClass({ ...newClass, sort_order: event.target.value })
          }
        />

        <label style={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={newClass.is_active}
            onChange={(event) =>
              setNewClass({ ...newClass, is_active: event.target.checked })
            }
          />
          신청 페이지에 노출
        </label>

        <button style={styles.button} onClick={createClass}>
          새 수업 추가하기
        </button>
      </div>

      <div style={styles.grid}>
        {classes.map((item) => (
          <div key={item.id} style={styles.classCard}>
            <p style={styles.label}>CLASS</p>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            {item.class_type === "master" ? (
              <p style={styles.desc}>마스터클래스 · 판매 가능 {item.remaining ?? "-"}명<br />{(item.capacity_details || []).map((row) => `${row.class_id}: ${row.occupied}/${row.capacity}`).join(" · ")}</p>
            ) : (
              <p style={styles.desc}>실제 점유 {item.occupied ?? "-"} / {item.capacity}명 · 잔여 {item.remaining ?? "-"}명</p>
            )}

            <label style={styles.formLabel}>수업명</label>
            <input
              style={styles.input}
              value={item.title}
              onChange={(event) => changeClass(item.id, "title", event.target.value)}
            />

            <label style={styles.formLabel}>수업 날짜</label>
            <input
              style={styles.input}
              value={item.date || ""}
              placeholder="예: 06-20(토)"
              onChange={(event) => changeClass(item.id, "date", event.target.value)}
            />

            <label style={styles.formLabel}>수업 시간</label>
            <input
              style={styles.input}
              value={item.time_text || ""}
              placeholder="예: 오전 9시~12시 / 오후 1시~6시 / 13:00~18:00"
              onChange={(event) =>
                changeClass(item.id, "time_text", event.target.value)
              }
            />

            <label style={styles.formLabel}>금액</label>
            <input
              style={styles.input}
              type="number"
              value={item.price}
              onChange={(event) => changeClass(item.id, "price", event.target.value)}
            />

            <label style={styles.formLabel}>정원</label>
            <input
              style={styles.input}
              type="number"
              value={item.capacity}
              onChange={(event) => changeClass(item.id, "capacity", event.target.value)}
            />

            <label style={styles.formLabel}>정렬 순서</label>
            <input
              style={styles.input}
              type="number"
              value={item.sort_order ?? 99}
              onChange={(event) =>
                changeClass(item.id, "sort_order", event.target.value)
              }
            />

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={Boolean(item.is_active)}
                onChange={(event) =>
                  changeClass(item.id, "is_active", event.target.checked)
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
              수업 삭제하기
            </button>
          </div>
        ))}
      </div>

      {message ? <p style={styles.message}>{message}</p> : null}
    </section>
  );
}

const styles = {
  wrap: {
    display: "grid",
    gap: "24px",
  },
  header: {
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
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.15,
    margin: "0 0 14px",
  },
  cardTitle: {
    margin: "0 0 12px",
    fontSize: "28px",
  },
  desc: {
    color: "#cfc8ba",
    lineHeight: 1.7,
    margin: 0,
  },
  smallButton: {
    minWidth: "120px",
    height: "48px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "transparent",
    color: "#f5f1e8",
    fontWeight: 800,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  classCard: {
    background: "#1b1b1b",
    borderRadius: "28px",
    padding: "28px",
  },
  formLabel: {
    display: "block",
    margin: "18px 0 8px",
    fontSize: "14px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.16)",
    background: "#111",
    color: "#f5f1e8",
    padding: "0 14px",
    fontSize: "15px",
  },
  checkboxRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginTop: "18px",
    color: "#f5f1e8",
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
    marginTop: "18px",
  },
  message: {
    color: "#d88b3a",
    fontWeight: 800,
    margin: 0,
  },
};
