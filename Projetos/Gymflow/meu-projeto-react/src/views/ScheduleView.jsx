export default function ScheduleView({ data, routine, update, setModal }) {
  if (!routine) return <div style={{ textAlign: "center", paddingTop: 80, color: "#444" }}>Nenhuma rotina ativa.</div>;

  const done = routine.days.filter(d => data.completedDayIds.includes(d.id)).length;
  const total = routine.days.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const handleGen = day => {
    const lastLog = [...data.history].reverse().find(h => h.routineId === routine.id && h.dayId === day.id);
    const items = genWorkout(day, data.exercises, lastLog, routine.exercisesPerDay || 5);
    update(d => ({ ...d, currentWorkout: { dayId: day.id, items, date: new Date().toISOString() } }));
  };

  return (
    <div>
      <div style={{ background: "#0D0D0D", border: "1px solid #1A1A1A", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#AAA" }}>Ciclo Atual</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#FFD600" }}>{done}/{total} <span style={{ fontSize: 11, color: "#555" }}>({pct}%)</span></span>
        </div>
        <div style={{ background: "#141414", borderRadius: 999, height: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#FFD600" : "#16A34A", borderRadius: 999, transition: "width 0.5s" }} />
        </div>
        {pct === 100 && <div style={{ marginTop: 8, fontSize: 11, color: "#FFD600", textAlign: "center" }}>🏆 Ciclo completo! Inicia nova volta.</div>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {routine.days.map((day, i) => {
          const isDone = data.completedDayIds.includes(day.id);
          const isNext = !isDone && routine.days.findIndex(d => !data.completedDayIds.includes(d.id)) === i;
          const isCurrent = data.currentWorkout?.dayId === day.id;
          const lastLog = [...data.history].reverse().find(h => h.routineId === routine.id && h.dayId === day.id);
          const lastDate = lastLog ? new Date(lastLog.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) : null;

          let bg = "#0A0A0A";
          let borderColor = "#1A1A1A";
          if (isDone) { bg = "#071207"; borderColor = "#1A2E1A"; }
          else if (isCurrent) borderColor = "#FFD600";
          else if (isNext) borderColor = "#3A2E00";

          return (
            <div key={day.id} style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 12, overflow: "hidden", transition: "all 0.3s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{day.emoji || "💪"}</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: isDone ? "#4ADE80" : isNext ? "#FFD600" : "#DDDDD" }}>{day.name}</div>
                    <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{day.groups.map(g => g.name).join(" · ")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  {lastDate && <span style={{ fontSize: 10, color: "#444" }}>{lastDate}</span>}
                  {isDone
                    ? <span style={{ fontSize: 18 }}>✅</span>
                    : <button onClick={() => handleGen(day)} style={{
                        background: isNext ? "#FFD600" : "#141414",
                        border: `1px solid ${isNext ? "#FFD600" : "#222"}`,
                        color: isNext ? "#000" : "#888",
                        padding: "6px 12px", borderRadius: 7, cursor: "pointer",
                        fontSize: 12, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
                      }}>⚡ Gerar</button>}
                  <button onClick={() => setModal({ type: "edit-day", dayId: day.id })} style={{
                    background: "#111", border: "1px solid #1E1E1E", color: "#555",
                    padding: "6px 8px", borderRadius: 7, cursor: "pointer", fontSize: 11,
                  }}>✏️</button>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #111", padding: "7px 14px", display: "flex", gap: 5, flexWrap: "wrap" }}>
                {day.groups.map(g => (
                  <span key={g.id} style={{ fontSize: 10, background: "#0F0F0F", border: "1px solid #181818", color: "#555", padding: "2px 7px", borderRadius: 999 }}>
                    {g.name} · {g.exerciseIds.length}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => setModal({ type: "add-day" })} style={{
        width: "100%", marginTop: 12, background: "transparent",
        border: "1px dashed #222", color: "#444", padding: "12px",
        borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani',sans-serif",
      }}>+ Adicionar Dia</button>
    </div>
  );
}