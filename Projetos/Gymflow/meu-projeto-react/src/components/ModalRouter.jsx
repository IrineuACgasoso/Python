import Overlay from "./common/Overlay"; 
import { MHead } from "./common/Overlay";
import { inputStyle } from "../styles/theme";


function ModalRouter({ modal, setModal, data, routine, update }) {
  const close = () => setModal(null);
  const TITLES = {
    "add-exercise": "Novo Exercício", "edit-exercise": "Editar Exercício",
    "edit-day": "Editar Dia", "add-day": "Novo Dia",
    "edit-routine": "Editar Rotina", "add-routine": "Nova Rotina",
    "switch-routine": "Trocar Rotina",
  };
  return (
    <Overlay onClose={close}>
      <MHead title={TITLES[modal.type] || ""} onClose={close} />
      {(modal.type === "add-exercise" || modal.type === "edit-exercise") && (
        <ExerciseForm exerciseId={modal.exerciseId} data={data} update={update} onClose={close} />
      )}
      {(modal.type === "edit-day" || modal.type === "add-day") && (
        <DayForm dayId={modal.dayId} routine={routine} data={data} update={update} onClose={close} />
      )}
      {(modal.type === "edit-routine" || modal.type === "add-routine") && (
        <RoutineForm routineId={modal.routineId} data={data} update={update} onClose={close} />
      )}
      {modal.type === "switch-routine" && (
        <div>
          {data.routines.map(r => (
            <div key={r.id} onClick={() => { update(d => ({ ...d, activeRoutineId: r.id, completedDayIds: [], currentWorkout: null })); close(); }}
              style={{
                background: r.id === data.activeRoutineId ? "#1A1200" : "#0A0A0A",
                border: `1px solid ${r.id === data.activeRoutineId ? "#FFD600" : "#1A1A1A"}`,
                borderRadius: 10, padding: "14px 16px", marginBottom: 8, cursor: "pointer",
              }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: r.id === data.activeRoutineId ? "#FFD600" : "#E0E0E0" }}>{r.name}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{r.days.length} dias · {r.exercisesPerDay} ex/treino</div>
            </div>
          ))}
          <button onClick={() => { close(); setModal({ type: "add-routine" }); }}
            style={{ width: "100%", marginTop: 6, background: "transparent", border: "1px dashed #222", color: "#555", padding: "12px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontFamily: "'Rajdhani',sans-serif" }}>
            + Nova Rotina
          </button>
        </div>
      )}
    </Overlay>
  );
}


//=========================================
//            EXERCISE FORM
//=========================================


function ExerciseForm({ exerciseId, data, update, onClose }) {
  const ex = data.exercises.find(e => e.id === exerciseId);
  const allGroups = [];
  data.routines.forEach(r => r.days.forEach(d => d.groups.forEach(g => {
    if (!allGroups.some(ag => ag.id === g.id)) allGroups.push({ id: g.id, name: g.name, dayName: d.name });
  })));

  const [name, setName] = useState(ex?.name || "");
  const [groupId, setGroupId] = useState(ex?.groupId || "");
  const [image, setImage] = useState(ex?.image || null);
  const fileRef = useRef();

  const handleImg = async e => {
    const f = e.target.files?.[0];
    if (f) setImage(await compressImg(f));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (ex) {
      update(d => ({ ...d, exercises: d.exercises.map(e => e.id === ex.id ? { ...e, name: name.trim(), groupId, image } : e) }));
    } else {
      const nx = { id: uid(), name: name.trim(), groupId, image };
      update(d => {
        const routines = d.routines.map(r => ({
          ...r, days: r.days.map(day => ({
            ...day, groups: day.groups.map(g => g.id === groupId ? { ...g, exerciseIds: [...g.exerciseIds, nx.id] } : g)
          }))
        }));
        return { ...d, exercises: [...d.exercises, nx], routines };
      });
    }
    onClose();
  };

  const handleDel = () => {
    if (!ex) return;
    update(d => ({
      ...d,
      exercises: d.exercises.filter(e => e.id !== ex.id),
      routines: d.routines.map(r => ({
        ...r, days: r.days.map(day => ({
          ...day, groups: day.groups.map(g => ({ ...g, exerciseIds: g.exerciseIds.filter(id => id !== ex.id) }))
        }))
      }))
    }));
    onClose();
  };

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do exercício" style={inputStyle} />
      <select value={groupId} onChange={e => setGroupId(e.target.value)} style={{ ...inputStyle, color: groupId ? "#F0F0F0" : "#555" }}>
        <option value="">— Grupo muscular —</option>
        {allGroups.map(g => <option key={g.id} value={g.id}>{g.dayName} → {g.name}</option>)}
      </select>
      <div
        onClick={() => fileRef.current?.click()}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#FFD600"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#262626"}
        style={{
          background: "#0A0A0A", border: "1px dashed #262626", borderRadius: 10,
          height: 130, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", cursor: "pointer", marginBottom: 16, overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        {image
          ? <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>📷</div>
              <div style={{ fontSize: 12, color: "#444" }}>Toque para adicionar foto</div>
            </>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
      <div style={{ display: "flex", gap: 8 }}>
        {ex && <button onClick={handleDel} style={{ background: "#1A0808", border: "1px solid #4A1010", color: "#EF4444", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🗑</button>}
        {image && <button onClick={() => setImage(null)} style={{ background: "#141414", border: "1px solid #252525", color: "#666", padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>✕ foto</button>}
        <button onClick={handleSave} style={{ flex: 1, background: "#FFD600", border: "none", color: "#000", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 1, fontFamily: "'Rajdhani',sans-serif" }}>
          {ex ? "SALVAR" : "CRIAR EXERCÍCIO"}
        </button>
      </div>
    </>
  );
}


//=========================================
//              DAY FORM
//=========================================

function DayForm({ dayId, routine, data, update, onClose }) {
  const day = dayId ? routine?.days.find(d => d.id === dayId) : null;
  const EMOJIS = ["💪","🫁","🦾","🎯","🦵","🏃","❤️‍🔥","🔥","⚡","🧠","🏊","🚴"];
  const [name, setName] = useState(day?.name || "");
  const [emoji, setEmoji] = useState(day?.emoji || "💪");
  const [groups, setGroups] = useState(() => day?.groups ? JSON.parse(JSON.stringify(day.groups)) : []);
  const [newGName, setNewGName] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [exSearch, setExSearch] = useState("");

  const addGroup = () => {
    if (!newGName.trim()) return;
    const ng = { id: uid(), name: newGName.trim(), exerciseIds: [] };
    setGroups(g => [...g, ng]);
    setNewGName("");
    setExpanded(ng.id);
  };

  const toggleEx = (gid, exId) => {
    setGroups(gs => gs.map(g => {
      if (g.id !== gid) return g;
      const has = g.exerciseIds.includes(exId);
      return { ...g, exerciseIds: has ? g.exerciseIds.filter(id => id !== exId) : [...g.exerciseIds, exId] };
    }));
  };

  const handleSave = () => {
    if (!name.trim() || !routine) return;
    if (day) {
      update(d => ({ ...d, routines: d.routines.map(r => r.id !== routine.id ? r : { ...r, days: r.days.map(dd => dd.id !== day.id ? dd : { ...dd, name: name.trim(), emoji, groups }) }) }));
    } else {
      const nd = { id: uid(), name: name.trim(), emoji, groups };
      update(d => ({ ...d, routines: d.routines.map(r => r.id !== routine.id ? r : { ...r, days: [...r.days, nd] }) }));
    }
    onClose();
  };

  const handleDel = () => {
    if (!day || !routine) return;
    update(d => ({ ...d, routines: d.routines.map(r => r.id !== routine.id ? r : { ...r, days: r.days.filter(dd => dd.id !== day.id) }) }));
    onClose();
  };

  const filtered = exSearch ? data.exercises.filter(e => e.name.toLowerCase().includes(exSearch.toLowerCase())) : data.exercises;

  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {EMOJIS.map(em => (
          <button key={em} onClick={() => setEmoji(em)} style={{
            fontSize: 20, borderRadius: 8, padding: "5px 7px", cursor: "pointer",
            background: emoji === em ? "#261D00" : "#161616",
            border: `1px solid ${emoji === em ? "#FFD600" : "#222"}`,
          }}>{em}</button>
        ))}
      </div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do dia (ex: Peito)" style={inputStyle} />
      <div style={{ fontSize: 10, color: "#555", letterSpacing: 2, marginBottom: 10 }}>GRUPOS MUSCULARES</div>

      {groups.map(g => (
        <div key={g.id} style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: 10, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", cursor: "pointer" }}
            onClick={() => setExpanded(expanded === g.id ? null : g.id)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD600" }}>{g.name}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#444" }}>{g.exerciseIds.length} ex.</span>
              <span style={{ color: "#444", fontSize: 12 }}>{expanded === g.id ? "▲" : "▼"}</span>
              <button onClick={e => { e.stopPropagation(); setGroups(gs => gs.filter(x => x.id !== g.id)); }}
                style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>✕</button>
            </div>
          </div>
          {expanded === g.id && (
            <div style={{ borderTop: "1px solid #141414", padding: "10px 12px" }}>
              <input value={exSearch} onChange={e => setExSearch(e.target.value)} placeholder="Buscar exercício..."
                style={{ ...inputStyle, marginBottom: 8, fontSize: 12, padding: "6px 10px" }} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, maxHeight: 150, overflowY: "auto" }}>
                {filtered.map(ex => {
                  const on = g.exerciseIds.includes(ex.id);
                  return (
                    <button key={ex.id} onClick={() => toggleEx(g.id, ex.id)} style={{
                      fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "none", cursor: "pointer",
                      background: on ? "#FFD600" : "#1A1A1A", color: on ? "#000" : "#777",
                      fontFamily: "'Rajdhani',sans-serif", fontWeight: on ? 700 : 400,
                    }}>{ex.name}</button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newGName} onChange={e => setNewGName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addGroup()}
          placeholder="Novo grupo (ex: Peitoral Superior)"
          style={{ ...inputStyle, flex: 1, marginBottom: 0 }} />
        <button onClick={addGroup} style={{ background: "#141414", border: "1px solid #FFD600", color: "#FFD600", padding: "0 16px", borderRadius: 8, cursor: "pointer", fontSize: 20, fontWeight: 700 }}>+</button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {day && <button onClick={handleDel} style={{ background: "#1A0808", border: "1px solid #4A1010", color: "#EF4444", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🗑</button>}
        <button onClick={handleSave} style={{ flex: 1, background: "#FFD600", border: "none", color: "#000", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 1, fontFamily: "'Rajdhani',sans-serif" }}>
          {day ? "SALVAR DIA" : "CRIAR DIA"}
        </button>
      </div>
    </>
  );
}


//=========================================
//             ROUTINE FORM
//=========================================


function RoutineForm({ routineId, data, update, onClose }) {
  const routine = data.routines.find(r => r.id === routineId);
  const [name, setName] = useState(routine?.name || "");
  const [epd, setEpd] = useState(routine?.exercisesPerDay || 5);

  const handleSave = () => {
    if (!name.trim()) return;
    if (routine) {
      update(d => ({ ...d, routines: d.routines.map(r => r.id === routineId ? { ...r, name: name.trim(), exercisesPerDay: epd } : r) }));
    } else {
      const nr = { id: uid(), name: name.trim(), exercisesPerDay: epd, days: [] };
      update(d => ({ ...d, routines: [...d.routines, nr] }));
    }
    onClose();
  };

  const handleDel = () => {
    if (!routine || data.routines.length <= 1) return;
    update(d => {
      const routines = d.routines.filter(r => r.id !== routineId);
      return { ...d, routines, activeRoutineId: d.activeRoutineId === routineId ? routines[0].id : d.activeRoutineId, completedDayIds: [], currentWorkout: null };
    });
    onClose();
  };

  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da rotina" style={inputStyle} />
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
          Exercícios por treino: <span style={{ color: "#FFD600", fontWeight: 700 }}>{epd}</span>
        </div>
        <input type="range" min={2} max={12} step={1} value={epd} onChange={e => setEpd(+e.target.value)}
          style={{ width: "100%", accentColor: "#FFD600" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#333", marginTop: 4 }}>
          <span>2</span><span>12</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {routine && data.routines.length > 1 && (
          <button onClick={handleDel} style={{ background: "#1A0808", border: "1px solid #4A1010", color: "#EF4444", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>🗑</button>
        )}
        <button onClick={handleSave} style={{ flex: 1, background: "#FFD600", border: "none", color: "#000", padding: "12px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, letterSpacing: 1, fontFamily: "'Rajdhani',sans-serif" }}>
          {routine ? "SALVAR" : "CRIAR ROTINA"}
        </button>
      </div>
    </>
  );
}

