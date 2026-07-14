import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine } from "recharts";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
  purple:"#8B5CF6",
};

const HRS_DIA   = { primero: 8,   segundo: 7.5  };
const HRS_SEMANA = { primero: 40,  segundo: 37.5 };
const HRS_MES    = { primero: 160, segundo: 150  };

const Card = ({ children, style={} }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 22px", ...style }}>{children}</div>
);

const KPI = ({ label, value, sub, color=C.text }) => (
  <div style={{ textAlign:"center" }}>
    <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{label}</div>
    <div style={{ color, fontSize:26, fontWeight:800, lineHeight:1 }}>{value}</div>
    {sub && <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>{sub}</div>}
  </div>
);

const Barra = ({ pct, color }) => (
  <div style={{ flex:1, height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
    <div style={{ width:`${Math.min(pct,100)}%`, height:"100%", background:color, borderRadius:4, transition:"width .4s" }} />
  </div>
);

const TooltipCustom = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px" }}>
      <div style={{ color:C.textSub, fontSize:12, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color, fontSize:13 }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

const PRIO_LABEL = {
  "1_seguridad":"Seguridad","2_queja_cliente":"Queja","3_maquina_parada":"Máq. parada",
  "4_trabajo_rapido":"Rápido","5_fabricacion":"Fabricación"
};
const EST_COLOR = { nueva_orden:C.accent, en_proceso:C.warn, terminada:C.success, cancelada:C.muted };
const EST_LABEL = { nueva_orden:"Nueva", en_proceso:"En proceso", terminada:"Terminada", cancelada:"Cancelada" };

// ── Semana actual ────────────────────────────────────────────
function getSemanaActual() {
  const hoy   = new Date();
  const dia   = hoy.getDay() || 7;
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia + 1); lunes.setHours(0,0,0,0);
  const vier  = new Date(lunes); vier.setDate(lunes.getDate() + 4); vier.setHours(23,59,59,999);
  return { inicio: lunes, fin: vier };
}

function getMesActual() {
  const hoy   = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin    = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0, 23, 59, 59);
  return { inicio, fin };
}

// ── Historial de un técnico ──────────────────────────────────
function HistorialTecnico({ tecnico, onVolver }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [filtro, setFiltro]   = useState("todas");

  useEffect(() => {
    supabase
      .from("seguimiento_orden")
      .select("id, fecha_inicio, fecha_termino, tiempo_real_hrs, comentarios, orden_id, ordenes_trabajo(no_orden, nombre_pieza, estado, prioridad, fecha_solicitud, entregada)")
      .eq("tecnico_id", tecnico.id)
      .order("fecha_registro", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error("HistorialTecnico error:", error);
        setOrdenes(data ?? []);
        setLoad(false);
      });
  }, [tecnico.id]);

  const filtradas = filtro === "todas" ? ordenes : filtro === "entregadas" ? ordenes.filter(o => o.ordenes_trabajo?.estado === "terminada" && o.ordenes_trabajo?.entregada) : ordenes.filter(o => o.ordenes_trabajo?.estado === filtro);

  const totalHrs  = ordenes.reduce((s, o) => s + (Number(o.tiempo_real_hrs) || 0), 0);
  const terminadas = ordenes.filter(o => o.ordenes_trabajo?.estado === "terminada").length;

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000dd", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:900, maxHeight:"92vh", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:C.text, fontWeight:800, fontSize:18 }}>{tecnico.nombre_completo}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>
              {tecnico.departamento} · Turno {tecnico.turno === "segundo" ? "2° (7.5 hrs)" : "1° (8 hrs)"}
            </div>
          </div>
          <button onClick={onVolver} style={{ background:C.border, color:C.muted, border:"none", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13 }}>← Volver</button>
        </div>

        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:C.border, borderBottom:`1px solid ${C.border}` }}>
          {[
            { label:"Total órdenes",     value:ordenes.length,                        color:C.text    },
            { label:"Terminadas",        value:terminadas,                            color:C.success },
            { label:"Horas registradas", value:`${totalHrs.toFixed(1)} hrs`,          color:C.accent  },
            { label:"Prom. hrs/orden",   value:`${ordenes.length ? (totalHrs/ordenes.length).toFixed(1) : 0} hrs`, color:C.purple },
          ].map((k,i) => (
            <div key={i} style={{ background:C.surface, padding:"16px 20px", textAlign:"center" }}>
              <KPI {...k} />
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8, flexWrap:"wrap" }}>
          {["todas","nueva_orden","en_proceso","terminada","entregadas","cancelada"].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              background: filtro===f ? (f==="entregadas"?C.purple:(EST_COLOR[f]||C.accent))+"22" : "transparent",
              color:       filtro===f ? (f==="entregadas"?C.purple:(EST_COLOR[f]||C.accent)) : C.muted,
              border:     `1px solid ${filtro===f ? (f==="entregadas"?C.purple:(EST_COLOR[f]||C.accent)) : C.border}`,
              borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:600,
            }}>
              {{ todas:"Todas",nueva_orden:"Nuevas",en_proceso:"En proceso",terminada:"Terminadas",entregadas:"Entregadas",cancelada:"Canceladas" }[f]}
            </button>
          ))}
        </div>

        {/* Tabla de órdenes */}
        {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Cargando…</div> : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {["Folio","Fecha","Pieza","Solicitante","Prioridad","Estado","Hrs"].map(h => (
                    <th key={h} style={{ padding:"10px 16px", color:C.muted, fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtradas.map((o,i) => (
                  <tr key={o.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"transparent":C.bg+"66" }}>
                    <td style={{ padding:"10px 16px", color:C.accent, fontWeight:700 }}>#{o.ordenes_trabajo?.no_orden}</td>
                    <td style={{ padding:"10px 16px", color:C.textSub }}>{o.ordenes_trabajo?.fecha_solicitud?.slice(0,10)}</td>
                    <td style={{ padding:"10px 16px", fontWeight:500 }}>{o.ordenes_trabajo?.nombre_pieza}</td>
                    <td style={{ padding:"10px 16px", color:C.textSub }}>—</td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ fontSize:11, fontWeight:600 }}>{PRIO_LABEL[o.ordenes_trabajo?.prioridad] ?? "—"}</span>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ background:EST_COLOR[o.ordenes_trabajo?.estado]+"22", color:EST_COLOR[o.ordenes_trabajo?.estado], border:`1px solid ${EST_COLOR[o.ordenes_trabajo?.estado]}55`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                        {EST_LABEL[o.ordenes_trabajo?.estado]}
                      </span>
                    </td>
                    <td style={{ padding:"10px 16px", color:C.textSub }}>{o.tiempo_real_hrs ?? "—"}</td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:C.muted }}>Sin órdenes con ese filtro.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Panel principal de técnicos ──────────────────────────────
export default function PanelTecnicos() {
  const [tecnicos, setTecnicos]     = useState([]);
  const [metricas, setMetricas]     = useState({});
  const [historico, setHistorico]   = useState([]);
  const [loading, setLoad]          = useState(true);
  const [periodo, setPeriodo]       = useState("semana");
  const [tecSelec, setTecSelec]     = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setLoad(true);

    // Técnicos
    const { data: tecs } = await supabase
      .from("usuarios")
      .select("id, no_empleado, nombre_completo, departamento, turno")
      .eq("rol", "tecnico")
      .eq("activo", true)
      .order("nombre_completo");

    if (!tecs?.length) { setLoad(false); return; }
    setTecnicos(tecs);

    // Seguimiento de cada técnico
    const { data: segs } = await supabase
      .from("seguimiento_orden")
      .select("tecnico_id, tiempo_real_hrs, fecha_inicio, fecha_termino, orden_id, ordenes_trabajo(estado, prioridad, nombre_pieza)")
      .in("tecnico_id", tecs.map(t => t.id));

    // Calcular métricas por técnico
    const sem  = getSemanaActual();
    const mes  = getMesActual();
    const met  = {};

    tecs.forEach(t => {
      const misSegs = (segs ?? []).filter(s => s.tecnico_id === t.id);
      const hrsDia  = HRS_DIA[t.turno ?? "primero"];
      const hrsSem  = HRS_SEMANA[t.turno ?? "primero"];
      const hrsMes  = HRS_MES[t.turno ?? "primero"];

      const enSemana = misSegs.filter(s => {
        const f = s.fecha_inicio ? new Date(s.fecha_inicio) : null;
        return f && f >= sem.inicio && f <= sem.fin;
      });
      const enMes = misSegs.filter(s => {
        const f = s.fecha_inicio ? new Date(s.fecha_inicio) : null;
        return f && f >= mes.inicio && f <= mes.fin;
      });

      const hrsTrabSem = enSemana.reduce((s, x) => s + (Number(x.tiempo_real_hrs) || 0), 0);
      const hrsTrabMes = enMes.reduce((s, x) => s + (Number(x.tiempo_real_hrs) || 0), 0);
      const hrsTotal   = misSegs.reduce((s, x) => s + (Number(x.tiempo_real_hrs) || 0), 0);

      met[t.id] = {
        hrsDia,
        hrsSem,
        hrsMes,
        hrsTrabSem:   parseFloat(hrsTrabSem.toFixed(1)),
        hrsTrabMes:   parseFloat(hrsTrabMes.toFixed(1)),
        hrsTotal:     parseFloat(hrsTotal.toFixed(1)),
        aprovSem:     hrsSem > 0 ? Math.round((hrsTrabSem / hrsSem) * 100) : 0,
        aprovMes:     hrsMes > 0 ? Math.round((hrsTrabMes / hrsMes) * 100) : 0,
        ordenesSem:   enSemana.length,
        ordenesMes:   enMes.length,
        ordenesTotal: misSegs.length,
        terminadas:   misSegs.filter(s => s.ordenes_trabajo?.estado === "terminada").length,
      };
    });

    setMetricas(met);

    // Histórico mensual últimos 6 meses para gráfica de línea
    const hist = [];
    for (let i = 5; i >= 0; i--) {
      const d     = new Date();
      d.setMonth(d.getMonth() - i);
      const ini   = new Date(d.getFullYear(), d.getMonth(), 1);
      const fin2  = new Date(d.getFullYear(), d.getMonth()+1, 0, 23, 59, 59);
      const label = ini.toLocaleString("es-MX", { month:"short", year:"2-digit" });
      const row   = { mes: label };
      tecs.forEach(t => {
        const hrs = (segs ?? [])
          .filter(s => s.tecnico_id === t.id && s.fecha_inicio)
          .filter(s => { const f = new Date(s.fecha_inicio); return f >= ini && f <= fin2; })
          .reduce((sum, s) => sum + (Number(s.tiempo_real_hrs) || 0), 0);
        row[t.nombre_completo.split(" ")[0]] = parseFloat(hrs.toFixed(1));
      });
      hist.push(row);
    }
    setHistorico(hist);
    setLoad(false);
  };

  const colorTec = ["#3B82F6","#22C55E","#F59E0B","#EF4444","#8B5CF6","#06B6D4"];

  const aprovColor = pct => pct >= 80 ? C.success : pct >= 50 ? C.warn : C.danger;

  if (loading) return <div style={{ padding:60, textAlign:"center", color:C.muted }}>Cargando métricas…</div>;

  return (
    <>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ color:C.text, fontWeight:700, fontSize:18 }}>Panel de Técnicos</div>
        <div style={{ display:"flex", gap:4, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:4 }}>
          {["semana","mes","total"].map(p => (
            <button key={p} onClick={() => setPeriodo(p)} style={{ background:periodo===p?C.accent:"transparent", color:periodo===p?"#fff":C.muted, border:"none", borderRadius:8, padding:"6px 16px", cursor:"pointer", fontWeight:600, fontSize:12, textTransform:"capitalize" }}>
              {p === "semana" ? "Esta semana" : p === "mes" ? "Este mes" : "Total"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de métricas */}
      <Card style={{ padding:0, marginBottom:16 }}>
        <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:600, fontSize:14 }}>
          Resumen de desempeño — {periodo === "semana" ? "Semana actual" : periodo === "mes" ? "Mes actual" : "Histórico"}
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {["Técnico","Turno","Hrs disponibles","Hrs trabajadas","Aprovechamiento","Órdenes","Terminadas","Acción"].map(h => (
                  <th key={h} style={{ padding:"10px 16px", color:C.muted, fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tecnicos.map((t,i) => {
                const m = metricas[t.id] ?? {};
                const hrsDisp = periodo === "semana" ? m.hrsSem : periodo === "mes" ? m.hrsMes : null;
                const hrsTrab = periodo === "semana" ? m.hrsTrabSem : periodo === "mes" ? m.hrsTrabMes : m.hrsTotal;
                const aprov   = periodo === "semana" ? m.aprovSem : periodo === "mes" ? m.aprovMes : null;
                const ords    = periodo === "semana" ? m.ordenesSem : periodo === "mes" ? m.ordenesMes : m.ordenesTotal;

                return (
                  <tr key={t.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"transparent":C.bg+"66" }}>
                    <td style={{ padding:"12px 16px", fontWeight:700 }}>{t.nombre_completo}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ background:t.turno==="segundo"?C.purple+"22":C.accent+"22", color:t.turno==="segundo"?C.purple:C.accent, border:`1px solid ${t.turno==="segundo"?C.purple:C.accent}55`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                        {t.turno === "segundo" ? "2° — 7.5 hrs" : "1° — 8 hrs"}
                      </span>
                    </td>
                    <td style={{ padding:"12px 16px", color:C.textSub }}>{hrsDisp ? `${hrsDisp} hrs` : "—"}</td>
                    <td style={{ padding:"12px 16px", color:C.text, fontWeight:600 }}>{hrsTrab ?? 0} hrs</td>
                    <td style={{ padding:"12px 16px" }}>
                      {aprov !== null ? (
                        <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:140 }}>
                          <Barra pct={aprov} color={aprovColor(aprov)} />
                          <span style={{ color:aprovColor(aprov), fontWeight:700, minWidth:36 }}>{aprov}%</span>
                        </div>
                      ) : <span style={{ color:C.muted }}>—</span>}
                    </td>
                    <td style={{ padding:"12px 16px", textAlign:"center" }}>{ords ?? 0}</td>
                    <td style={{ padding:"12px 16px", textAlign:"center", color:C.success, fontWeight:600 }}>{m.terminadas ?? 0}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <button onClick={() => setTecSelec(t)} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}55`, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                        Ver historial
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gráficas */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

        {/* Barras: horas trabajadas vs disponibles */}
        <Card>
          <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Comparativa</div>
          <div style={{ color:C.text, fontSize:15, fontWeight:600, marginBottom:16 }}>
            Horas trabajadas vs disponibles — {periodo === "semana" ? "Semana" : "Mes"}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={tecnicos.map(t => {
              const m = metricas[t.id] ?? {};
              const nombre = t.nombre_completo.split(" ").slice(-2).join(" ");
              return {
                nombre,
                "Trabajadas": periodo === "semana" ? m.hrsTrabSem : m.hrsTrabMes,
                "Disponibles": periodo === "semana" ? m.hrsSem : m.hrsMes,
              };
            })} barSize={18} barGap={4}>
              <XAxis dataKey="nombre" tick={{ fill:C.muted, fontSize:10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipCustom />} cursor={{ fill:C.accent+"11" }} />
              <Legend wrapperStyle={{ color:C.muted, fontSize:12 }} />
              <Bar dataKey="Disponibles" fill={C.border}    radius={[4,4,0,0]} />
              <Bar dataKey="Trabajadas"  fill={C.accent}    radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Aprovechamiento en barras horizontales */}
        <Card>
          <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Eficiencia</div>
          <div style={{ color:C.text, fontSize:15, fontWeight:600, marginBottom:20 }}>
            Aprovechamiento — {periodo === "semana" ? "Semana" : "Mes"}
          </div>
          <div style={{ display:"grid", gap:14 }}>
            {tecnicos.map(t => {
              const m     = metricas[t.id] ?? {};
              const aprov = periodo === "semana" ? m.aprovSem : m.aprovMes;
              const nombre = t.nombre_completo.split(",")[0] ?? t.nombre_completo;
              return (
                <div key={t.id}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ color:C.textSub, fontSize:12 }}>{nombre}</span>
                    <span style={{ color:aprovColor(aprov ?? 0), fontWeight:700, fontSize:13 }}>{aprov ?? 0}%</span>
                  </div>
                  <Barra pct={aprov ?? 0} color={aprovColor(aprov ?? 0)} />
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:16, marginTop:20, fontSize:11, color:C.muted }}>
            <span><span style={{ color:C.success }}>■</span> ≥80% Óptimo</span>
            <span><span style={{ color:C.warn }}>■</span> 50-79% Aceptable</span>
            <span><span style={{ color:C.danger }}>■</span> &lt;50% Bajo</span>
          </div>
        </Card>

        {/* Tendencia mensual */}
        <Card style={{ gridColumn:"1/-1" }}>
          <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Tendencia</div>
          <div style={{ color:C.text, fontSize:15, fontWeight:600, marginBottom:16 }}>Horas trabajadas — Últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={historico}>
              <XAxis dataKey="mes" tick={{ fill:C.muted, fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<TooltipCustom />} />
              <Legend wrapperStyle={{ color:C.muted, fontSize:12 }} />
              {tecnicos.map((t,i) => (
                <Line key={t.id} type="monotone"
                  dataKey={t.nombre_completo.split(" ")[0]}
                  stroke={colorTec[i % colorTec.length]}
                  strokeWidth={2} dot={{ r:4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>

      {/* Modal historial */}
      {tecSelec && <HistorialTecnico tecnico={tecSelec} onVolver={() => setTecSelec(null)} />}
    </>
  );
}
