export default function Overlay({ onClose, children }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
        zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div style={{
        background: "#0E0E0E", borderRadius: "18px 18px 0 0",
        padding: "20px 16px 50px", width: "100%", maxWidth: 560,
        maxHeight: "92vh", overflowY: "auto",
        borderTop: "1px solid #1E1E1E",
      }}>
        {children}
      </div>
    </div>
  );
}

export function MHead({ title, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#F0F0F0", letterSpacing: 0.5 }}>{title}</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
    </div>
  );
}
