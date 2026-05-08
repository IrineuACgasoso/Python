import { useState, useEffect, useRef } from "react";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

async function compressImg(file) {
  return new Promise(res => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      let w = img.width, h = img.height, max = 480;
      if (w > max) { h = Math.round(h * max / w); w = max; }
      if (h > max) { w = Math.round(w * max / h); h = max; }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/jpeg", 0.72));
    };
    img.src = url;
  });
}

const SK = "gymflow_v2";
const loadData = async () => {
  try {
    const raw = localStorage.getItem(SK);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveData = async (d) => {
  try {
    localStorage.setItem(SK, JSON.stringify(d));
  } catch (e) {
    console.warn("Erro ao salvar dados:", e);
  }
};

const EXDATA = [
  { id: "ex1",  name: "Supino Reto c/ Barra",      groupId: "g_ps",       image: null },
  { id: "ex2",  name: "Supino Inclinado c/ Barra",  groupId: "g_ps",       image: null },
  { id: "ex3",  name: "Supino Reto c/ Halteres",    groupId: "g_ps",       image: null },
  { id: "ex4",  name: "Crucifixo Inclinado",         groupId: "g_ps",       image: null },
  { id: "ex5",  name: "Supino Declinado",            groupId: "g_pi",       image: null },
  { id: "ex6",  name: "Crucifixo Declinado",         groupId: "g_pi",       image: null },
  { id: "ex7",  name: "Crossover Baixo",             groupId: "g_pi",       image: null },
  { id: "ex8",  name: "Peck Deck",                   groupId: "g_pm",       image: null },
  { id: "ex9",  name: "Crossover Alto",              groupId: "g_pm",       image: null },
  { id: "ex10", name: "Puxada Frontal",              groupId: "g_dorsal",   image: null },
  { id: "ex11", name: "Puxada Neutra",               groupId: "g_dorsal",   image: null },
  { id: "ex12", name: "Remada Curvada c/ Barra",     groupId: "g_dorsal",   image: null },
  { id: "ex13", name: "Remada Baixa",                groupId: "g_dorsal",   image: null },
  { id: "ex14", name: "Encolhimento c/ Barra",       groupId: "g_trap",     image: null },
  { id: "ex15", name: "Remada Alta",                 groupId: "g_trap",     image: null },
  { id: "ex16", name: "Desenvolvimento Militar",     groupId: "g_del_ant",  image: null },
  { id: "ex17", name: "Elevação Frontal",            groupId: "g_del_ant",  image: null },
  { id: "ex18", name: "Elevação Lateral",            groupId: "g_del_lat",  image: null },
  { id: "ex19", name: "Elevação Lateral c/ Cabo",    groupId: "g_del_lat",  image: null },
  { id: "ex20", name: "Crucifixo Invertido",         groupId: "g_del_post", image: null },
  { id: "ex21", name: "Face Pull",                   groupId: "g_del_post", image: null },
  { id: "ex22", name: "Rosca Direta c/ Barra",       groupId: "g_biceps",   image: null },
  { id: "ex23", name: "Rosca Alternada",             groupId: "g_biceps",   image: null },
  { id: "ex24", name: "Rosca Martelo",               groupId: "g_biceps",   image: null },
  { id: "ex25", name: "Tríceps Testa",               groupId: "g_triceps",  image: null },
  { id: "ex26", name: "Tríceps na Corda",            groupId: "g_triceps",  image: null },
  { id: "ex27", name: "Tríceps Francês",             groupId: "g_triceps",  image: null },
  { id: "ex28", name: "Agachamento Livre",           groupId: "g_quad",     image: null },
  { id: "ex29", name: "Leg Press 45°",               groupId: "g_quad",     image: null },
  { id: "ex30", name: "Cadeira Extensora",           groupId: "g_quad",     image: null },
  { id: "ex31", name: "Mesa Flexora",                groupId: "g_post",     image: null },
  { id: "ex32", name: "Stiff",                       groupId: "g_post",     image: null },
  { id: "ex33", name: "Panturrilha em Pé",           groupId: "g_pant",     image: null },
  { id: "ex34", name: "Panturrilha Sentado",         groupId: "g_pant",     image: null },
];

const ROUTINE_SEED = {
  id: "r_main", name: "Rotina Principal", exercisesPerDay: 5,
  days: [
    { id: "d_peito",  name: "Peito",  emoji: "🫁", groups: [
      { id: "g_ps",  name: "Peitoral Superior", exerciseIds: ["ex1","ex2","ex3","ex4"] },
      { id: "g_pi",  name: "Peitoral Inferior", exerciseIds: ["ex5","ex6","ex7"] },
      { id: "g_pm",  name: "Peitoral Médio",    exerciseIds: ["ex8","ex9"] },
    ]},
    { id: "d_costas", name: "Costas", emoji: "🦾", groups: [
      { id: "g_dorsal", name: "Dorsal",    exerciseIds: ["ex10","ex11","ex12","ex13"] },
      { id: "g_trap",   name: "Trapézio", exerciseIds: ["ex14","ex15"] },
    ]},
    { id: "d_ombro",  name: "Ombro",  emoji: "🎯", groups: [
      { id: "g_del_ant",  name: "Deltoide Anterior",  exerciseIds: ["ex16","ex17"] },
      { id: "g_del_lat",  name: "Deltoide Lateral",   exerciseIds: ["ex18","ex19"] },
      { id: "g_del_post", name: "Deltoide Posterior", exerciseIds: ["ex20","ex21"] },
    ]},
    { id: "d_braco",  name: "Braço",  emoji: "💪", groups: [
      { id: "g_biceps",  name: "Bíceps",  exerciseIds: ["ex22","ex23","ex24"] },
      { id: "g_triceps", name: "Tríceps", exerciseIds: ["ex25","ex26","ex27"] },
    ]},
    { id: "d_perna",  name: "Perna",  emoji: "🦵", groups: [
      { id: "g_quad", name: "Quadríceps", exerciseIds: ["ex28","ex29","ex30"] },
      { id: "g_post", name: "Posterior",  exerciseIds: ["ex31","ex32"] },
      { id: "g_pant", name: "Panturrilha",exerciseIds: ["ex33","ex34"] },
    ]},
  ],
};

function genWorkout(day, allExercises, lastLog, count) {
  const lastCounts = {};
  if (lastLog) lastLog.exercises.forEach(e => { lastCounts[e.groupId] = (lastCounts[e.groupId] || 0) + 1; });

  let pools = day.groups
    .map(g => ({
      ...g,
      avail: g.exerciseIds.filter(id => allExercises.some(e => e.id === id)),
      lastCount: lastCounts[g.id] || 0,
      picked: [],
    }))
    .filter(g => g.avail.length > 0);

  if (!pools.length) return [];

  const maxPossible = pools.reduce((s, g) => s + g.avail.length, 0);
  let rem = Math.min(count, maxPossible);
  const result = [];

  const sortPools = () => pools.sort((a, b) => (a.picked.length + a.lastCount) - (b.picked.length + b.lastCount));
  sortPools();

  for (const gp of [...pools]) {
    if (rem <= 0) break;
    const unused = gp.avail.filter(id => !gp.picked.includes(id));
    if (!unused.length) continue;
    const pick = unused[Math.floor(Math.random() * unused.length)];
    result.push({ exerciseId: pick, groupId: gp.id, groupName: gp.name });
    gp.picked.push(pick);
    rem--;
  }

  let itr = 0;
  while (rem > 0 && itr < 300) {
    itr++;
    sortPools();
    let added = false;
    for (const gp of pools) {
      const unused = gp.avail.filter(id => !gp.picked.includes(id));
      if (!unused.length) continue;
      const pick = unused[Math.floor(Math.random() * unused.length)];
      result.push({ exerciseId: pick, groupId: gp.id, groupName: gp.name });
      gp.picked.push(pick);
      rem--;
      added = true;
      break;
    }
    if (!added) break;
  }

  return result;
}

const INP = {
  width: "100%", background: "#181818", border: "1px solid #262626",
  borderRadius: 8, padding: "10px 12px", color: "#F0F0F0", fontSize: 14,
  fontFamily: "'Rajdhani',sans-serif", outline: "none", marginBottom: 12,
};

function ExCard({ ex, groupName, onEdit, compact }) {
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

function Overlay({ onClose, children }) {
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

function MHead({ title, onClose }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: "#F0F0F0", letterSpacing: 0.5 }}>{title}</div>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#555", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
    </div>
  );
}

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
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do exercício" style={INP} />
      <select value={groupId} onChange={e => setGroupId(e.target.value)} style={{ ...INP, color: groupId ? "#F0F0F0" : "#555" }}>
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
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do dia (ex: Peito)" style={INP} />
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
                style={{ ...INP, marginBottom: 8, fontSize: 12, padding: "6px 10px" }} />
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
          style={{ ...INP, flex: 1, marginBottom: 0 }} />
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
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome da rotina" style={INP} />
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

function HomeView({ data, routine, update, setModal }) {
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

function ScheduleView({ data, routine, update, setModal }) {
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

function ExercisesView({ data, update, setModal }) {
  const [filterGroup, setFilterGroup] = useState(null);
  const [search, setSearch] = useState("");

  const allGroups = [];
  data.routines.forEach(r => r.days.forEach(d => d.groups.forEach(g => {
    if (!allGroups.some(ag => ag.id === g.id)) allGroups.push({ id: g.id, name: g.name });
  })));

  const getGName = gId => allGroups.find(g => g.id === gId)?.name;

  let filtered = data.exercises;
  if (filterGroup) filtered = filtered.filter(e => e.groupId === filterGroup);
  if (search) filtered = filtered.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Exercícios <span style={{ fontSize: 13, color: "#444", fontWeight: 400 }}>({filtered.length})</span></div>
        <button onClick={() => setModal({ type: "add-exercise" })} style={{
          background: "#FFD600", border: "none", color: "#000",
          padding: "8px 14px", borderRadius: 8, cursor: "pointer",
          fontSize: 13, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif",
        }}>+ Novo</button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar exercício..." style={INP} />

      <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
        <button onClick={() => setFilterGroup(null)} style={{
          fontSize: 10, padding: "4px 9px", borderRadius: 999, border: "none", cursor: "pointer",
          fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: 0.5,
          background: !filterGroup ? "#FFD600" : "#141414", color: !filterGroup ? "#000" : "#555",
        }}>TODOS</button>
        {allGroups.map(g => (
          <button key={g.id} onClick={() => setFilterGroup(g.id === filterGroup ? null : g.id)} style={{
            fontSize: 10, padding: "4px 9px", borderRadius: 999, border: "none", cursor: "pointer",
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: 0.5,
            background: filterGroup === g.id ? "#FFD600" : "#141414", color: filterGroup === g.id ? "#000" : "#555",
          }}>{g.name.toUpperCase()}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {filtered.map(ex => (
          <ExCard key={ex.id} ex={ex} groupName={getGName(ex.groupId)} compact={false}
            onEdit={() => setModal({ type: "edit-exercise", exerciseId: ex.id })} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#333", paddingTop: 50 }}>Nenhum exercício encontrado</div>
      )}
    </div>
  );
}

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