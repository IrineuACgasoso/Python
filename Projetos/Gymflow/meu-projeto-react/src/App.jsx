import { useState, useEffect } from "react";
// Utilitários
import { loadData, saveData } from "./utils/storage";
import { EXERCISE_DATA, ROUTINE_SEED } from "./data/seed";
// Componentes (Após você movê-los)
import HomeView from "./views/HomeView";
import ScheduleView from "./views/ScheduleView";
import ExercisesView from "./views/ExercisesView";
import RoutinesView from "./views/RoutinesView";
import ModalRouter from "./components/ModalRouter";
// Estilos
import { colors } from "./styles/theme";



function BottomNav({ view, setView }) {
  const tabs = [
    { id: "home",      emoji: "🏠", label: "HOJE" },
    { id: "schedule",  emoji: "📅", label: "CICLO" },
    { id: "exercises", emoji: "🏋️", label: "EXERC." },
    { id: "routines",  emoji: "📋", label: "ROTINAS" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(5,5,5,0.97)", borderTop: "1px solid #141414",
      display: "flex", zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} style={{
          flex: 1, padding: "10px 0 12px", background: "none", border: "none",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{t.emoji}</span>
          <span style={{
            fontSize: 8, fontWeight: view === t.id ? 700 : 400, letterSpacing: 1.5,
            color: view === t.id ? "#FFD600" : "#3A3A3A", fontFamily: "'Rajdhani',sans-serif",
          }}>{t.label}</span>
          {view === t.id && <div style={{ width: 18, height: 2, background: "#FFD600", borderRadius: 1 }} />}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [view, setView] = useState("home");
  const [modal, setModal] = useState(null);

  useEffect(() => {
    loadData().then(saved => {
      if (saved) {
        setData(saved);
      } else {
        const init = {
          routines: [ROUTINE_SEED],
          exercises: EXDATA,
          activeRoutineId: ROUTINE_SEED.id,
          history: [],
          completedDayIds: [],
          currentWorkout: null,
        };
        setData(init);
        saveData(init);
      }
    });
  }, []);

  const update = cb => setData(prev => {
    const next = cb({ ...prev });
    saveData(next);
    return next;
  });

  if (!data) return (
    <div style={{ background: "#050505", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 5, color: "#FFD600", fontFamily: "'Rajdhani',sans-serif" }}>⚡ GYMFLOW</div>
      <div style={{ fontSize: 12, color: "#333", letterSpacing: 2 }}>CARREGANDO...</div>
    </div>
  );

  const routine = data.routines.find(r => r.id === data.activeRoutineId) || data.routines[0];

  return (
    <div style={{ background: "#050505", minHeight: "100vh", fontFamily: "'Rajdhani',sans-serif", color: "#F0F0F0", paddingBottom: 72 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #1E1E1E; border-radius: 2px; }
        input, select { outline: none; }
        input::placeholder { color: #444; }
        select option { background: #111; color: #F0F0F0; }
      `}</style>

      <div style={{
        background: "#070707", borderBottom: "1px solid #121212",
        padding: "13px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 4, color: "#FFD600", lineHeight: 1 }}>⚡ GYMFLOW</div>
          <div style={{ fontSize: 9, color: "#383838", marginTop: 2, letterSpacing: 2 }}>{routine?.name?.toUpperCase()}</div>
        </div>
        <button onClick={() => setModal({ type: "switch-routine" })} style={{
          background: "#0F0F0F", border: "1px solid #1A1A1A", color: "#555",
          padding: "7px 12px", borderRadius: 8, cursor: "pointer",
          fontSize: 11, letterSpacing: 1, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600,
        }}>⇄ ROTINA</button>
      </div>

      <div style={{ padding: "14px 14px 0" }}>
        {view === "home"      && <HomeView      data={data} routine={routine} update={update} setModal={setModal} />}
        {view === "schedule"  && <ScheduleView  data={data} routine={routine} update={update} setModal={setModal} />}
        {view === "exercises" && <ExercisesView data={data}                  update={update} setModal={setModal} />}
        {view === "routines"  && <RoutinesView  data={data}                  update={update} setModal={setModal} />}
      </div>

      <BottomNav view={view} setView={setView} />

      {modal && <ModalRouter modal={modal} setModal={setModal} data={data} routine={routine} update={update} />}
    </div>
  );
}