import React from "react";
import { genWorkout } from "../utils/generator";
import ExCard from "../components/ui/ExCard"; 
import { colors } from "../styles/theme";    
import { uid } from "../utils/uid"

export default function HomeView({ data, routine, update, setModal }) {
  const cw = data.currentWorkout;
  const cwDay = cw && routine?.days.find(d => d.id === cw.dayId);
  const nextDay = routine?.days.find(d => !data.completedDayIds.includes(d.id)) || routine?.days[0];

  const handleGen = day => {
    if (!day) return;
    const lastLog = [...data.history].reverse().find(h => h.routineId === routine.id && h.dayId === day.id);
    const items = genWorkout(day, data.exercises, lastLog, routine.exercisesPerDay || 5);
    update(d => ({ ...d, currentWorkout: { dayId: day.id, items, date: new Date().toISOString() } }));
  };

  const handleConfirm = () => {
    if (!cw) return;
    const entry = { id: uid(), date: new Date().toISOString(), routineId: routine.id, dayId: cw.dayId, exercises: cw.items };
    let completed = data.completedDayIds.includes(cw.dayId) ? data.completedDayIds : [...data.completedDayIds, cw.dayId];
    if (routine.days.every(d => completed.includes(d.id))) completed = [];
    update(d => ({ ...d, history: [...d.history, entry], completedDayIds: completed, currentWorkout: null }));
  };

  if (!routine) return (
    <div style={{ textAlign: "center", paddingTop: 80, color: "#444" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
      <div style={{ fontSize: 15 }}>Nenhuma rotina ativa.</div>
      <div style={{ fontSize: 13, marginTop: 8, color: "#333" }}>Crie uma na aba Rotinas</div>
    </div>
  );

  return (
    <div>
      {cw && cwDay ? (
        <div>
          <div style={{
            background: "#0E0C00", border: "1px solid #322500",
            borderRadius: 14, padding: 16, marginBottom: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "#666", letterSpacing: 2, marginBottom: 4 }}>TREINO GERADO</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#FFD600", lineHeight: 1 }}>{cwDay.emoji} {cwDay.name.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{cw.items.length} exercícios selecionados</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexDirection: "column", alignItems: "flex-end" }}>
                <button onClick={handleConfirm} style={{
                  background: "#16A34A", border: "none", color: "#fff",
                  padding: "10px 18px", borderRadius: 9, cursor: "pointer",
                  fontSize: 14, fontWeight: 700, letterSpacing: 1, fontFamily: "'Rajdhani',sans-serif",
                }}>✓ CONFIRMAR</button>
                <button onClick={() => handleGen(cwDay)} style={{
                  background: "#141414", border: "1px solid #262626", color: "#888",
                  padding: "7px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "'Rajdhani',sans-serif",
                }}>↻ Rolar Novamente</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {cw.items.map((item, i) => {
                const ex = data.exercises.find(e => e.id === item.exerciseId);
                return ex ? <ExCard key={i} ex={ex} groupName={item.groupName} /> : null;
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "#4ADE80", padding: "8px 12px", background: "rgba(22,163,74,0.07)", borderRadius: 7, border: "1px solid rgba(22,163,74,0.15)" }}>
              ✓ Confirme ao finalizar o treino para registrar e avançar o ciclo
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{
            background: "#0D0D0D", border: `1px solid ${nextDay ? "#FFD600" : "#1A1A1A"}`,
            borderRadius: 14, padding: "18px 18px", marginBottom: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 10, color: "#666", letterSpacing: 2, marginBottom: 6 }}>PRÓXIMO TREINO</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#FFD600", lineHeight: 1 }}>{nextDay?.emoji} {nextDay?.name?.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 5 }}>
                {nextDay?.groups?.length || 0} grupos · {routine.exercisesPerDay} exercícios
              </div>
            </div>
            <button onClick={() => handleGen(nextDay)} style={{
              background: "#FFD600", border: "none", color: "#000",
              padding: "18px 20px", borderRadius: 12, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              fontFamily: "'Rajdhani',sans-serif",
            }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2 }}>GERAR</span>
            </button>
          </div>

          {routine.days.filter(d => d.id !== nextDay?.id).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 8 }}>TREINAR OUTRO DIA</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {routine.days.filter(d => d.id !== nextDay?.id).map(day => (
                  <button key={day.id} onClick={() => handleGen(day)} style={{
                    background: "#0F0F0F", border: "1px solid #1E1E1E", color: "#999",
                    padding: "8px 13px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                    fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
                  }}>{day.emoji} {day.name}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data.history.length > 0 && (() => {
        const last = data.history[data.history.length - 1];
        const day = routine.days.find(d => d.id === last.dayId);
        const date = new Date(last.date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
        return (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: 2, marginBottom: 8 }}>ÚLTIMO TREINO</div>
            <div style={{ background: "#090F09", border: "1px solid #152415", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{day?.emoji || "💪"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#4ADE80" }}>{day?.name || "?"}</div>
                  <div style={{ fontSize: 10, color: "#444" }}>{last.exercises?.length} exercícios</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#444" }}>{date}</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}