function RoutinesView({ data, update, setModal }) {
  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Rotinas Salvas</div>
      {data.routines.map(r => {
        const isActive = r.id === data.activeRoutineId;
        return (
          <div key={r.id} style={{
            background: "#0A0A0A", border: `1px solid ${isActive ? "#FFD600" : "#1A1A1A"}`,
            borderRadius: 12, padding: 16, marginBottom: 10,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: isActive ? "#FFD600" : "#E0E0E0" }}>{r.name}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{r.days.length} dias · {r.exercisesPerDay} ex/treino</div>
                {isActive && <div style={{ fontSize: 10, color: "#4ADE80", marginTop: 5, letterSpacing: 1 }}>● ATIVA</div>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {!isActive && (
                  <button onClick={() => update(d => ({ ...d, activeRoutineId: r.id, completedDayIds: [], currentWorkout: null }))} style={{
                    background: "#1A1200", border: "1px solid #FFD600", color: "#FFD600",
                    padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                    fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
                  }}>ATIVAR</button>
                )}
                <button onClick={() => setModal({ type: "edit-routine", routineId: r.id })} style={{
                  background: "#111", border: "1px solid #1E1E1E", color: "#555",
                  padding: "6px 10px", borderRadius: 7, cursor: "pointer", fontSize: 12,
                }}>✏️</button>
              </div>
            </div>
            {r.days.length > 0 && (
              <div style={{ marginTop: 12, display: "flex", gap: 5, flexWrap: "wrap" }}>
                {r.days.map(d => (
                  <span key={d.id} style={{ fontSize: 10, background: "#111", border: "1px solid #1A1A1A", color: "#555", padding: "3px 8px", borderRadius: 999 }}>
                    {d.emoji} {d.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button onClick={() => setModal({ type: "add-routine" })} style={{
        width: "100%", marginTop: 4, background: "transparent",
        border: "1px dashed #222", color: "#444", padding: "14px",
        borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani',sans-serif",
      }}>+ Nova Rotina</button>
    </div>
  );
}