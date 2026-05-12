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