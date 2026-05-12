import { useState } from "react";

export default function ExCard({ ex, groupName, onEdit, compact }) {
  const [err, setErr] = useState(false);
  return (
    <div
      onClick={onEdit}
      onMouseEnter={e => onEdit && (e.currentTarget.style.borderColor = "#FFD600")}
      onMouseLeave={e => onEdit && (e.currentTarget.style.borderColor = "#1E1E1E")}
      style={{
        background: "#121212", border: "1px solid #1E1E1E", borderRadius: 10,
        overflow: "hidden", cursor: onEdit ? "pointer" : "default",
        transition: "border-color 0.15s",
      }}
    >
      <div style={{
        height: compact ? 68 : 105, background: "#0A0A0A",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative",
      }}>
        {ex.image && !err
          ? <img src={ex.image} alt={ex.name} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ fontSize: 26, opacity: 0.2 }}>🏋️</div>}
        {onEdit && (
          <div style={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.75)", borderRadius: 4, padding: "1px 5px", fontSize: 9, color: "#777" }}>✏️</div>
        )}
      </div>
      <div style={{ padding: "7px 9px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#ECECEC", lineHeight: 1.25 }}>{ex.name}</div>
        {groupName && <div style={{ fontSize: 9, color: "#FFD600", marginTop: 2, fontWeight: 600, letterSpacing: 0.5 }}>{groupName}</div>}
      </div>
    </div>
  );
}