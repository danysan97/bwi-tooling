import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import ImprimirOrden from "./ImprimirOrden.jsx";
import PanelTecnicos from "./PanelTecnicos.jsx";
import PanelUsuarios from "./PanelUsuarios.jsx";
import ExportarReportes from "./ExportarReportes.jsx";
import FormOrdenAdmin from "./FormOrdenAdmin.jsx";
import {
  supabase,
  obtenerSesion, cerrarSesion,
  obtenerOrdenes, actualizarEstado, guardarSeguimiento, cargarSeguimiento, obtenerUrlPlano,
  datosGraficaMes, datosGraficaTecnicos, datosGraficaPrioridades,
  obtenerMateriales, obtenerTecnicos, obtenerAreas,
  cargarHistorial, agregarComentarioHistorial, registrarEvento, parseFechaUTC,
} from "./lib/supabase";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
  purple:"#8B5CF6",
};
const PRIO_COLOR = { "1_seguridad":C.danger,"2_queja_cliente":C.warn,"3_maquina_parada":"#F97316","4_trabajo_rapido":C.accent,"5_fabricacion":C.muted };
const PRIO_LABEL = { "1_seguridad":"1·Seguridad","2_queja_cliente":"2·Queja","3_maquina_parada":"3·Máq.parada","4_trabajo_rapido":"4·Rápido","5_fabricacion":"5·Fabricación" };
const EST_COLOR  = { nueva_orden:C.accent, en_proceso:C.warn, terminada:C.success, cancelada:C.muted };
const EST_LABEL  = { nueva_orden:"Nueva", en_proceso:"En proceso", terminada:"Terminada", cancelada:"Cancelada" };

const Card = ({ children, style={} }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 24px", ...style }}>{children}</div>
);
const Badge = ({ estado, entregada }) => {
  const isEnt = estado === "terminada" && entregada;
  const c = isEnt ? C.purple : EST_COLOR[estado];
  const l = isEnt ? "Entregada" : EST_LABEL[estado];
  return <span style={{ background:c+"22", color:c, border:`1px solid ${c}55`, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{l}</span>;
};
const PrioBadge = ({ p }) => (
  <span style={{ background:PRIO_COLOR[p]+"22", color:PRIO_COLOR[p], border:`1px solid ${PRIO_COLOR[p]}55`, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{PRIO_LABEL[p]}</span>
);
const KPI = ({ label, value, sub, color=C.text }) => (
  <Card>
    <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{label}</div>
    <div style={{ color, fontSize:32, fontWeight:700, lineHeight:1 }}>{value}</div>
    {sub && <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>{sub}</div>}
  </Card>
);
const Label = ({ children, required }) => (
  <label style={{ display:"block", color:C.textSub, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
    {children}{required && <span style={{ color:C.danger, marginLeft:3 }}>*</span>}
  </label>
);
const Input = ({ ...props }) => (
  <input {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", ...props.style }}
    onFocus={e => e.target.style.borderColor=C.accent}
    onBlur={e => e.target.style.borderColor=C.border} />
);
const Select = ({ children, ...props }) => (
  <select {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", cursor:"pointer", ...props.style }}>{children}</select>
);
const Textarea = ({ ...props }) => (
  <textarea {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", resize:"vertical", minHeight:70, fontFamily:"inherit" }}
    onFocus={e => e.target.style.borderColor=C.accent}
    onBlur={e => e.target.style.borderColor=C.border} />
);
const Spinner = () => <div style={{ textAlign:"center", padding:60, color:C.muted }}>Cargando…</div>;
const sinSETC = (o) => {
  const v = (o.setc_numero ?? "").toString().trim();
  return !v || !/^\d{8}$/.test(v);
};

const Tooltip2 = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px" }}>
      <div style={{ color:C.textSub, fontSize:12, marginBottom:4 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color, fontSize:13 }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  );
};

// ── Modal detalle + seguimiento + estado ─────────────────────
function ModalOrden({ orden, onClose, onActualizado, usuario, tecnicos, materiales }) {
  const [tab, setTab]       = useState("detalle");
  const [estado, setEstado] = useState(orden?.estado ?? "");
  const [coment, setComent] = useState("");
  const [tecnicosSeg, setTecSeg] = useState([]);
  const [materialId, setMatId]   = useState("");
  const [materialOtro, setMatOtro] = useState("");
  const [comentarios, setComentSeg] = useState("");
  const [guardando, setG]   = useState(false);
  const [msg, setMsg]       = useState("");
  const [imprimiendo, setImp] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [nuevoComentario, setNuevoComent] = useState("");
  const [confirmandoEntrega, setConfEntrega] = useState(false);
  const [nombreAut, setNombreAut] = useState("");
  const [puestoAut, setPuestoAut] = useState("");
  const [planoUrl, setPlanoUrl] = useState(null);

  useEffect(() => {
    if (!orden) return;
    setEstado(orden.estado);
    setComent("");
    setNuevoComent("");
    setConfEntrega(false);
    setNombreAut("");
    setPuestoAut("");
    setPlanoUrl(null);
    if (orden.archivo_url) {
      obtenerUrlPlano(orden.archivo_url).then(({ url }) => setPlanoUrl(url));
    }
    cargarSeguimiento(orden.no_orden).then(({ data }) => {
      if (data?.length) {
        setTecSeg(data.map(s => ({
          id: s.id,
          tecnico_id: s.tecnico_id ?? "",
          fecha_inicio: s.fecha_inicio ?? "",
          fecha_termino: s.fecha_termino ?? "",
          tiempo_real_hrs: s.tiempo_real_hrs ?? "",
        })));
        setMatId(data[0]?.material_id ?? "");
        setMatOtro(data[0]?.material_otro ?? "");
        setComentSeg(data[0]?.comentarios ?? "");
      } else {
        setTecSeg([{ id: null, tecnico_id: "", fecha_inicio: "", fecha_termino: "", tiempo_real_hrs: "" }]);
        setMatId("");
        setMatOtro("");
        setComentSeg("");
      }
    });
    cargarHistorial(orden.no_orden).then(({ data }) => setHistorial(data ?? []));
  }, [orden]);

  if (!orden) return null;

  const agregarTecnico = () => {
    setTecSeg(ts => [...ts, { id: null, tecnico_id: "", fecha_inicio: "", fecha_termino: "", tiempo_real_hrs: "" }]);
  };
  const quitarTecnico = (idx) => {
    setTecSeg(ts => ts.filter((_, i) => i !== idx));
  };
  const actualizarTec = (idx, campo, valor) => {
    setTecSeg(ts => ts.map((t, i) => i === idx ? { ...t, [campo]: valor } : t));
  };

  const guardarSeg = async () => {
    const tecValidos = tecnicosSeg.filter(t => t.tecnico_id);
    if (!tecValidos.length) { setMsg("Asigna al menos un técnico."); return; }
    if (!materialId && !materialOtro) { setMsg("Selecciona un material."); return; }
    const sinHoras = tecValidos.filter(t => t.fecha_termino && !t.tiempo_real_hrs);
    if (sinHoras.length) { setMsg("Pon las horas reales a los técnicos que tienen fecha de término antes de guardar."); return; }
    setG(true);
    const { error } = await guardarSeguimiento(orden.no_orden, tecValidos, comentarios, materialId, materialOtro, usuario.id);
    if (error) { setG(false); setMsg("Error al guardar."); return; }
    const tieneInicio = tecValidos.some(t => t.fecha_inicio);
    const tieneTermino = tecValidos.some(t => t.fecha_termino);
    if (tieneInicio && orden.estado === "nueva_orden") {
      await actualizarEstado(orden.no_orden, "en_proceso", usuario.id, null);
    }
    if (tieneTermino && orden.estado === "en_proceso") {
      await actualizarEstado(orden.no_orden, "terminada", usuario.id, null);
    }
    setG(false);
    setMsg("Seguimiento guardado."); onActualizado();
    const { data } = await cargarHistorial(orden.no_orden);
    setHistorial(data ?? []);
    setTimeout(() => setMsg(""), 2000);
  };

  const verPlano = async () => {
    if (!orden.archivo_url) return;
    const { url } = await obtenerUrlPlano(orden.archivo_url);
    if (url) window.open(url, "_blank");
  };

  const agregarCom = async () => {
    if (!nuevoComentario.trim()) return;
    setG(true);
    await agregarComentarioHistorial(orden.no_orden, nuevoComentario.trim(), usuario.id);
    setNuevoComent("");
    const { data } = await cargarHistorial(orden.no_orden);
    setHistorial(data ?? []);
    setG(false);
  };

  const horasTotal = tecnicosSeg.reduce((s, t) => s + (Number(t.tiempo_real_hrs) || 0), 0);

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:28, width:"100%", maxWidth:620, maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:20 }}>
          <div>
            <div style={{ color:C.muted, fontSize:12 }}>ORDEN #{orden.no_orden}</div>
            <div style={{ color:C.text, fontSize:20, fontWeight:700 }}>{orden.nombre_pieza}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{orden.solicitante_nombre} · {orden.solicitante_empleado} · {orden.area_nombre}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
          <Badge estado={orden.estado} />
          <PrioBadge p={orden.prioridad} />
          {orden.archivo_url && (
            <button onClick={verPlano} style={{ background:C.border, color:C.text, border:"none", borderRadius:6, padding:"2px 10px", fontSize:12, cursor:"pointer" }}>📎 Ver plano</button>
          )}
          <button onClick={() => setImp(true)} style={{ background:"#1B3A6B", color:"#fff", border:"none", borderRadius:6, padding:"2px 10px", fontSize:12, cursor:"pointer" }}>🖨️ Imprimir</button>
        </div>

        <div style={{ display:"flex", gap:4, marginBottom:20, background:C.bg, borderRadius:8, padding:4 }}>
          {["detalle","seguimiento","estado","historial"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, background:tab===t?C.accent:"transparent", color:tab===t?"#fff":C.muted, border:"none", borderRadius:6, padding:"7px 0", cursor:"pointer", fontWeight:600, fontSize:12, textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>

        {/* Detalle */}
        {tab === "detalle" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              ["Fecha solicitud", orden.fecha_solicitud?.slice(0,10)],
              ["Cantidad", orden.cantidad],
              ["S.E.T.C. #", orden.setc_numero || "—"],
              ["No. plano", orden.no_plano || "—"],
              ["No. máquina", orden.no_maquina || "—"],
              ["Línea / Celda", orden.linea_celda || "—"],
              ["Departamento", orden.departamento || "—"],
              ["Técnico(s)", orden.tecnico_nombre || "Sin asignar"],
              ["Material", orden.material_usado || "—"],
              ["Fecha inicio", orden.fecha_inicio || "—"],
              ["Fecha término", orden.fecha_termino || "—"],
              ["Horas totales", orden.tiempo_real_hrs ? `${orden.tiempo_real_hrs} hrs` : "—"],
            ].map(([k,v]) => (
              <div key={k}><div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>{k}</div><div style={{ color:C.text, fontSize:14 }}>{v}</div></div>
            ))}
            {sinSETC(orden) && (
              <div style={{ gridColumn:"1/-1", background:C.danger+"18", border:`1px solid ${C.danger}55`, borderRadius:8, padding:"10px 14px", color:C.danger, fontWeight:600, fontSize:13 }}>
                ⚠️ SIN NUMERO S.E.T.C. # — NO ESTA DADA DE ALTA
              </div>
            )}
            {orden.autorizada === true && (orden.nombre_autoriza || orden.autorizado_por_nombre) && (
              <div style={{ gridColumn:"1/-1", background:C.success+"18", border:`1px solid ${C.success}55`, borderRadius:8, padding:"12px 16px" }}>
                <div style={{ color:C.success, fontWeight:700, fontSize:14, marginBottom:6 }}>✅ Autorizada</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:13 }}>
                  <div><div style={{ color:C.muted, fontSize:11 }}>Autorizado por (Nombre)</div><div style={{ color:C.text, fontWeight:600 }}>{orden.nombre_autoriza ?? orden.autorizado_por_nombre ?? "—"}</div></div>
                  <div><div style={{ color:C.muted, fontSize:11 }}>Puesto</div><div style={{ color:C.text, fontWeight:600 }}>{orden.puesto_autoriza ?? orden.autorizado_por_puesto ?? "—"}</div></div>
                </div>
              </div>
            )}
            {orden.autorizada === false && (
              <div style={{ gridColumn:"1/-1", background:C.danger+"18", border:`1px solid ${C.danger}55`, borderRadius:8, padding:"12px 16px" }}>
                <div style={{ color:C.danger, fontWeight:700, fontSize:14, marginBottom:6 }}>❌ Rechazada</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:13 }}>
                  <div><div style={{ color:C.muted, fontSize:11 }}>Rechazado por (Nombre)</div><div style={{ color:C.text, fontWeight:600 }}>{orden.nombre_autoriza ?? orden.autorizado_por_nombre ?? "—"}</div></div>
                  <div><div style={{ color:C.muted, fontSize:11 }}>Puesto</div><div style={{ color:C.text, fontWeight:600 }}>{orden.puesto_autoriza ?? orden.autorizado_por_puesto ?? "—"}</div></div>
                </div>
                {orden.motivo_rechazo && <div style={{ color:C.muted, fontSize:12, marginTop:8, borderTop:`1px solid ${C.border}`, paddingTop:8 }}>Motivo: {orden.motivo_rechazo}</div>}
              </div>
            )}
            <div style={{ gridColumn:"1/-1" }}>
              <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>Descripción</div>
              <div style={{ color:C.text, fontSize:14 }}>{orden.descripcion}</div>
            </div>
            {planoUrl && (
              <div style={{ gridColumn:"1/-1", marginTop:4 }}>
                <div style={{ color:C.muted, fontSize:11, marginBottom:6 }}>Plano / Archivo adjunto</div>
                {orden.archivo_nombre?.match(/\.(pdf)$/i) ? (
                  <iframe src={planoUrl} style={{ width:"100%", height:400, border:`1px solid ${C.border}`, borderRadius:8 }} title="Plano" />
                ) : (
                  <a href={planoUrl} target="_blank" rel="noopener noreferrer">
                    <img src={planoUrl} alt="Plano" style={{ maxWidth:"100%", maxHeight:400, borderRadius:8, border:`1px solid ${C.border}`, cursor:"pointer" }} />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Seguimiento — Multi-técnico */}
        {tab === "seguimiento" && (
          <div style={{ display:"grid", gap:14 }}>

            {/* Lista de técnicos */}
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <Label>Técnicos asignados ({tecnicosSeg.length})</Label>
                <button onClick={agregarTecnico} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}55`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:600 }}>+ Agregar técnico</button>
              </div>
              {tecnicosSeg.map((t, idx) => (
                <div key={idx} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:12, marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ color:C.textSub, fontSize:11, fontWeight:600 }}>TÉCNICO {idx + 1}</span>
                    {tecnicosSeg.length > 1 && (
                      <button onClick={() => quitarTecnico(idx)} style={{ background:"none", border:"none", color:C.danger, cursor:"pointer", fontSize:11 }}>✕ Quitar</button>
                    )}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div>
                      <Label>Técnico</Label>
                      <Select value={t.tecnico_id} onChange={e => actualizarTec(idx, "tecnico_id", e.target.value)}>
                        <option value="">— Seleccionar —</option>
                        {tecnicos.map(tec => <option key={tec.id} value={tec.id}>{tec.nombre_completo}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label>Horas reales</Label>
                      <Input type="number" min="0" step="0.5" placeholder="0.0" value={t.tiempo_real_hrs} onChange={e => actualizarTec(idx, "tiempo_real_hrs", e.target.value)} />
                    </div>
                    <div><Label>Fecha inicio</Label><Input type="date" value={t.fecha_inicio} onChange={e => actualizarTec(idx, "fecha_inicio", e.target.value)} /></div>
                    <div>
                      <Label>Fecha término</Label>
                      {(estado === "en_proceso" || estado === "terminada") ? (
                        <Input type="date" value={t.fecha_termino} onChange={e => actualizarTec(idx, "fecha_termino", e.target.value)} />
                      ) : (
                        <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.muted, fontSize:12 }}>
                          Disponible al estar en proceso
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ color:C.textSub, fontSize:12, marginTop:4 }}>Total horas: <strong style={{ color:C.text }}>{horasTotal.toFixed(1)} hrs</strong></div>
            </div>

            {/* Material compartido */}
            <div>
              <Label>Material</Label>
              <Select value={materialId} onChange={e => setMatId(e.target.value)}>
                <option value="">— Seleccionar —</option>
                {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                <option value="otro">Otro…</option>
              </Select>
              {materialId === "otro" && (
                <div style={{ marginTop:8 }}><Label>Especificar material</Label><Input placeholder="Ej. Acero D2" value={materialOtro} onChange={e => setMatOtro(e.target.value)} /></div>
              )}
            </div>

            {/* Comentarios compartidos */}
            <div><Label>Comentarios del taller</Label><Textarea rows={3} placeholder="Observaciones, ajustes, detalles…" value={comentarios} onChange={e => setComentSeg(e.target.value)} /></div>

            {msg && <div style={{ color: msg.includes("Error") ? C.danger : C.success, fontSize:13 }}>{msg}</div>}
            <button onClick={guardarSeg} disabled={guardando} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"11px 0", fontWeight:700, cursor:"pointer" }}>
              {guardando ? "Guardando…" : "Guardar seguimiento"}
            </button>
          </div>
        )}

        {/* Estado */}
        {tab === "estado" && (
          <div style={{ display:"grid", gap:12 }}>

            {/* Autorización para prioridad 1 y 2 */}
            {(orden.prioridad === "1_seguridad" || orden.prioridad === "2_queja_cliente") && (
              <div style={{
                background: orden.autorizada === null || orden.autorizada === undefined ? C.warn+"18" : orden.autorizada ? C.success+"18" : C.danger+"18",
                border: `1px solid ${orden.autorizada === null || orden.autorizada === undefined ? C.warn : orden.autorizada ? C.success : C.danger}55`,
                borderRadius:10, padding:"14px 16px"
              }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:8,
                  color: orden.autorizada === null || orden.autorizada === undefined ? C.warn : orden.autorizada ? C.success : C.danger }}>
                  {orden.autorizada === null || orden.autorizada === undefined ? "⚠️ Requiere autorización de Gerencia" : orden.autorizada ? "✅ Autorizada" : "❌ Rechazada"}
                </div>
                {(orden.autorizada === null || orden.autorizada === undefined) && (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
                      <div>
                        <Label>Nombre de quien autoriza *</Label>
                        <Input placeholder="Ej. Ing. Carlos Méndez" value={nombreAut} onChange={e => setNombreAut(e.target.value)} />
                      </div>
                      <div>
                        <Label>Puesto *</Label>
                        <Input placeholder="Ej. Gerente de Mantenimiento" value={puestoAut} onChange={e => setPuestoAut(e.target.value)} />
                      </div>
                    </div>
                    <div style={{ marginBottom:8 }}>
                      <Label>Comentario *</Label>
                      <Textarea rows={2} placeholder="Escribe un comentario para autorizar o rechazar…" value={coment} onChange={e => setComent(e.target.value)} />
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={async () => {
                        if (!coment.trim()) { setMsg("Escribe un comentario antes de autorizar."); return; }
                        if (!nombreAut.trim()) { setMsg("Indica el nombre de quien autoriza."); return; }
                        if (!puestoAut.trim()) { setMsg("Indica el puesto de quien autoriza."); return; }
                        setG(true);
                        await supabase.from("ordenes_trabajo").update({ autorizada: true, autorizado_por: usuario.id, nombre_autoriza: nombreAut.trim(), puesto_autoriza: puestoAut.trim() }).eq("no_orden", orden.no_orden);
                        const detalle = `Autorizado por ${nombreAut.trim()} — ${puestoAut.trim()}. ${coment.trim()}`;
                        await registrarEvento(orden.no_orden, 'autorizacion', detalle, usuario.id);
                        setG(false); setMsg("Orden autorizada."); onActualizado();
                      }} disabled={guardando} style={{ flex:1, background:C.success, color:"#fff", border:"none", borderRadius:8, padding:"10px 0", fontWeight:700, cursor:"pointer", fontSize:13 }}>
                        ✅ Autorizar
                      </button>
                      <button onClick={async () => {
                        if (!coment.trim()) { setMsg("Escribe el motivo del rechazo."); return; }
                        if (!nombreAut.trim()) { setMsg("Indica el nombre de quien rechaza."); return; }
                        if (!puestoAut.trim()) { setMsg("Indica el puesto de quien rechaza."); return; }
                        setG(true);
                        await supabase.from("ordenes_trabajo").update({ autorizada: false, autorizado_por: usuario.id, motivo_rechazo: coment, nombre_autoriza: nombreAut.trim(), puesto_autoriza: puestoAut.trim() }).eq("no_orden", orden.no_orden);
                        await registrarEvento(orden.no_orden, 'autorizacion', `Rechazado por ${nombreAut.trim()} — ${puestoAut.trim()}. Motivo: ${coment.trim()}`, usuario.id);
                        setG(false); setMsg("Orden rechazada."); onActualizado();
                      }} disabled={guardando} style={{ flex:1, background:C.danger, color:"#fff", border:"none", borderRadius:8, padding:"10px 0", fontWeight:700, cursor:"pointer", fontSize:13 }}>
                        ❌ Rechazar
                      </button>
                    </div>
                  </>
                )}
                {orden.autorizada === false && orden.motivo_rechazo && (
                  <div style={{ color:C.muted, fontSize:12, marginTop:6 }}>Motivo: {orden.motivo_rechazo}</div>
                )}
                {orden.autorizada !== null && orden.autorizada !== undefined && (orden.nombre_autoriza || orden.autorizado_por_nombre) && (
                  <div style={{ fontSize:12, marginTop:6, color:C.textSub }}>Autorizado por: <strong>{orden.nombre_autoriza ?? orden.autorizado_por_nombre}</strong>{(orden.puesto_autoriza ?? orden.autorizado_por_puesto) ? ` — ${orden.puesto_autoriza ?? orden.autorizado_por_puesto}` : ""}</div>
                )}
                {msg && <div style={{ color:C.success, fontSize:13, marginTop:8 }}>{msg}</div>}
              </div>
            )}

            {/* Confirmación entregada — solo cuando está terminada */}
            {orden.estado === "terminada" && !orden.entregada && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.purple+"18", border:`1px solid ${C.purple}55`, borderRadius:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>📦 ¿Trabajo entregado?</div>
                  <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>Marca cuando el solicitante recoja la pieza</div>
                </div>
                {!confirmandoEntrega ? (
                  <button onClick={() => setConfEntrega(true)} disabled={guardando} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}55`, borderRadius:8, padding:"8px 18px", cursor:"pointer", fontWeight:700, fontSize:13 }}>¿Entregado?</button>
                ) : (
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ color:C.text, fontSize:13, fontWeight:600 }}>¿Confirmas?</span>
                    <button onClick={async () => {
                      setG(true);
                      await supabase.from("ordenes_trabajo").update({ entregada: true }).eq("no_orden", orden.no_orden);
                      await registrarEvento(orden.no_orden, 'entrega', "Trabajo entregado al solicitante.", usuario.id);
                      setG(false);
                      setConfEntrega(false);
                      onActualizado();
                      onClose();
                    }} disabled={guardando} style={{ background:C.success, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>✓</button>
                    <button onClick={() => setConfEntrega(false)} disabled={guardando} style={{ background:C.danger, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>✕</button>
                  </div>
                )}
              </div>
            )}
            {orden.estado === "terminada" && orden.entregada && (
              <div style={{ padding:"12px 16px", background:C.purple+"18", border:`1px solid ${C.purple}55`, borderRadius:10, color:C.purple, fontWeight:600, fontSize:14 }}>✅ Trabajo entregado</div>
            )}
            <div style={{ display:"flex", gap:8 }}>
              <input placeholder="Agregar comentario…" value={nuevoComentario} onChange={e => setNuevoComent(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && nuevoComentario.trim()) agregarCom(); }} style={{ flex:1, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
              <button onClick={agregarCom} disabled={!nuevoComentario.trim() || guardando} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:600, fontSize:12 }}>Comentar</button>
            </div>
            {msg && <div style={{ color:C.success, fontSize:13 }}>{msg}</div>}
          </div>
        )}

        {/* Historial */}
        {tab === "historial" && (
          <div style={{ display:"grid", gap:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Label>Historial de la orden</Label>
              <button onClick={() => cargarHistorial(orden.no_orden).then(({ data }) => setHistorial(data ?? []))} style={{ background:C.border, color:C.textSub, border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11 }}>🔄 Actualizar</button>
            </div>

            {/* Timeline */}
            {historial.length === 0 ? (
              <div style={{ color:C.muted, fontSize:13, padding:20, textAlign:"center" }}>Sin eventos registrados.</div>
            ) : (
              <div style={{ position:"relative", paddingLeft:28 }}>
                <div style={{ position:"absolute", left:10, top:0, bottom:0, width:2, background:C.border }} />
                {historial.map((ev, i) => {
                  const icon = { recepcion:"📥", asignacion:"👤", inicio:"🔧", comentario:"💬", autorizacion:"📋", cambio_estado:"🔄", material:"🔩", terminado:"✅", entrega:"📦" }[ev.evento_tipo] ?? "📌";
                  const color = { recepcion:C.accent, asignacion:"#60A5FA", inicio:C.warn, comentario:"#A78BFA", autorizacion:"#F97316", cambio_estado:C.success, material:"#F59E0B", terminado:C.success, entrega:C.purple }[ev.evento_tipo] ?? C.muted;
                  const label = { recepcion:"Recepción", asignacion:"Asignación", inicio:"Inicio", comentario:"Comentario", autorizacion:"Autorización", cambio_estado:"Cambio de estado", material:"Material", terminado:"Terminado", entrega:"Entrega" }[ev.evento_tipo] ?? ev.evento_tipo;
                  const fecha = parseFechaUTC(ev.fecha_evento);
                  return (
                    <div key={ev.id} style={{ position:"relative", marginBottom:16 }}>
                      <div style={{ position:"absolute", left:-22, top:2, width:16, height:16, borderRadius:"50%", background:color+"22", border:`2px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, zIndex:1 }}>{icon}</div>
                      <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                          <span style={{ color, fontWeight:600, fontSize:12 }}>{label}</span>
                          <span style={{ color:C.muted, fontSize:11 }}>{fecha.toLocaleDateString("es-MX")} {fecha.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" })}</span>
                        </div>
                        {ev.detalle && <div style={{ color:C.textSub, fontSize:13 }}>{ev.detalle}</div>}
                        {ev.creado_por && <div style={{ color:C.muted, fontSize:11, marginTop:2 }}>Por: {ev.usuarios?.nombre_completo ?? "Sistema"}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      {imprimiendo && <ImprimirOrden orden={orden} onCerrar={() => setImp(false)} />}
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────
const TABS_ADMIN = ["Órdenes","Gráficas","Técnicos","Usuarios"];
const TABS_BASE  = ["Órdenes","Gráficas","Técnicos"];

export default function App({ usuario: usuarioProp, onCapturarManual, onSalir }) {
  const usuario = usuarioProp || obtenerSesion();
  const [tab, setTab]         = useState("Órdenes");
  const [ordenes, setOrdenes] = useState([]);
  const [grafMes, setGM]      = useState([]);
  const [grafTec, setGT]      = useState([]);
  const [grafPrio, setGP]     = useState([]);
  const [tecnicos, setTec]    = useState([]);
  const [materiales, setMat]  = useState([]);
  const [loading, setLoad]    = useState(true);
  const [filtroEst, setFE]    = useState("todos");
  const [busqueda, setBusq]   = useState("");
  const [ordenSel, setOS]     = useState(null);
  const [solicitando, setSol] = useState(false);
  const [exportando, setExp]  = useState(false);

  const cargar = async () => {
    setLoad(true);
    const [{ data }, gm, gt, gp, tec, mat] = await Promise.all([
      obtenerOrdenes(),
      datosGraficaMes(),
      datosGraficaTecnicos(),
      datosGraficaPrioridades(),
      obtenerTecnicos(),
      obtenerMateriales(),
    ]);
    setOrdenes(data ?? []);
    setGM(gm); setGT(gt); setGP(gp);
    setTec(tec); setMat(mat);
    setLoad(false);
  };

  useEffect(() => { cargar(); }, []);

  const filtradas = ordenes.filter(o => {
    let matchEst = filtroEst === "todos" || o.estado === filtroEst;
    if (filtroEst === "entregadas") matchEst = o.estado === "terminada" && o.entregada;
    if (filtroEst === "sin_setc") matchEst = sinSETC(o);
    const q = busqueda.toLowerCase();
    const matchQ = !q || String(o.no_orden).includes(q) || o.nombre_pieza?.toLowerCase().includes(q) || o.solicitante_nombre?.toLowerCase().includes(q) || o.area_nombre?.toLowerCase().includes(q);
    return matchEst && matchQ;
  });

  const kpis = {
    total:      ordenes.length,
    nuevas:     ordenes.filter(o => o.estado === "nueva_orden").length,
    proceso:    ordenes.filter(o => o.estado === "en_proceso").length,
    terminadas: ordenes.filter(o => o.estado === "terminada").length,
    entregadas: ordenes.filter(o => o.estado === "terminada" && o.entregada).length,
    urgentes:   ordenes.filter(o => o.prioridad === "1_seguridad" || o.prioridad === "2_queja_cliente").length,
    sinSetc:    ordenes.filter(o => sinSETC(o)).length,
  };

  const mesesMap = {};
  grafMes.forEach(r => {
    const mes = new Date(r.mes).toLocaleString("es-MX", { month:"short" });
    if (!mesesMap[mes]) mesesMap[mes] = { mes, nuevas:0, en_proceso:0, terminadas:0 };
    if (r.estado === "nueva_orden")  mesesMap[mes].nuevas     += Number(r.total);
    if (r.estado === "en_proceso")   mesesMap[mes].en_proceso += Number(r.total);
    if (r.estado === "terminada")    mesesMap[mes].terminadas += Number(r.total);
  });
  const dataMes = Object.values(mesesMap);

  const PRIO_NOMBRES = { "1_seguridad":"Seguridad","2_queja_cliente":"Queja","3_maquina_parada":"Máq. parada","4_trabajo_rapido":"Rápido","5_fabricacion":"Fabricación" };
  const dataPrio = Object.entries(
    grafPrio.reduce((acc, r) => { acc[r.prioridad] = (acc[r.prioridad]||0)+Number(r.total); return acc; }, {})
  ).map(([p, v]) => ({ name: PRIO_NOMBRES[p]??p, value:v, color:PRIO_COLOR[p] }));

  const salir = () => { cerrarSesion(); if (onSalir) onSalir(); else window.location.reload(); };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 28px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:54 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:6, height:26, background:C.accent, borderRadius:3 }} />
            <span style={{ fontWeight:800, fontSize:15 }}>BWI — TOOLROOM</span>
            <span style={{ color:C.muted, fontSize:12 }}>Panel de administración</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:C.muted, fontSize:12 }}>{usuario?.nombre_completo}</span>
            <button onClick={() => setExp(true)} style={{ background:"#8B5CF6", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
              📊 Exportar
            </button>
            <button onClick={() => setSol(true)} style={{ background:C.success, color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
              + Solicitar orden
            </button>
            <button onClick={onCapturarManual} style={{ background:C.warn, color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12, fontWeight:700 }}>
              📋 Captura manual
            </button>
            <button onClick={salir} style={{ background:C.border, color:C.muted, border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12 }}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"22px 28px" }}>

        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:10, marginBottom:20 }}>
          <KPI label="Total órdenes"  value={kpis.total}      sub="Este año"         color={C.text}    />
          <KPI label="Nuevas"         value={kpis.nuevas}     sub="Sin asignar"      color={C.accent}  />
          <KPI label="En proceso"     value={kpis.proceso}    sub="En taller"        color={C.warn}    />
          <KPI label="Terminadas"     value={kpis.terminadas} sub="Completadas"      color={C.success} />
          <KPI label="Entregadas"     value={kpis.entregadas} sub="Entregadas"       color={C.purple}  />
          <KPI label="Urgentes"       value={kpis.urgentes}   sub="Prioridad 1 y 2"  color={C.danger}  />
          <KPI label="Sin SETC"       value={kpis.sinSetc}    sub="No dada de alta"  color={C.danger}  />
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, marginBottom:18, background:C.surface, borderRadius:10, padding:4, width:"fit-content", border:`1px solid ${C.border}` }}>
          {(usuario?.rol === 'superadmin' ? TABS_ADMIN : TABS_BASE).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background:tab===t?C.accent:"transparent", color:tab===t?"#fff":C.muted, border:"none", borderRadius:8, padding:"7px 20px", cursor:"pointer", fontWeight:600, fontSize:13 }}>{t}</button>
          ))}
        </div>

        {/* ── ÓRDENES */}
        {tab === "Órdenes" && (
          <Card style={{ padding:0 }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8, flexWrap:"wrap" }}>
              <input placeholder="Folio, pieza, solicitante, área…" value={busqueda} onChange={e => setBusq(e.target.value)}
                style={{ flex:1, minWidth:200, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
              {["todos","nueva_orden","en_proceso","terminada","entregadas","cancelada","sin_setc"].map(e => {
                const c = e==="entregadas"?C.purple:e==="sin_setc"?C.danger:(EST_COLOR[e]||C.accent);
                return <button key={e} onClick={() => setFE(e)} style={{ background:filtroEst===e?c+"22":"transparent", color:filtroEst===e?c:C.muted, border:`1px solid ${filtroEst===e?c:C.border}`, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                  {{ todos:"Todas",nueva_orden:"Nuevas",en_proceso:"En proceso",terminada:"Terminadas",entregadas:"Entregadas",cancelada:"Canceladas",sin_setc:"⚠ Sin SETC" }[e]}
                </button>;
              })}
            </div>
            {loading ? <Spinner /> : (
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                      {["Folio","Fecha","Solicitante","Área","Pieza","S.E.T.C.","Prioridad","Estado","Técnico","Hrs"].map(h => (
                        <th key={h} style={{ padding:"10px 14px", color:C.muted, fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((o,i) => (
                      <tr key={o.no_orden} onClick={() => setOS(o)} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"transparent":C.bg+"66", cursor:"pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background=C.accent+"11"}
                        onMouseLeave={e => e.currentTarget.style.background=i%2===0?"transparent":C.bg+"66"}>
                        <td style={{ padding:"10px 14px", color:C.accent, fontWeight:700 }}>#{o.no_orden}</td>
                        <td style={{ padding:"10px 14px", color:C.textSub }}>{o.fecha_solicitud?.slice(0,10)}</td>
                        <td style={{ padding:"10px 14px" }}>{o.solicitante_nombre}</td>
                        <td style={{ padding:"10px 14px", color:C.textSub, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.area_nombre ?? o.departamento}</td>
                        <td style={{ padding:"10px 14px", fontWeight:500 }}>{o.nombre_pieza}</td>
                        <td style={{ padding:"10px 14px", color:sinSETC(o)?C.danger:C.textSub, fontWeight:sinSETC(o)?600:400, fontSize:12 }}>{sinSETC(o)?"⚠ SIN SETC":o.setc_numero || "—"}</td>
                        <td style={{ padding:"10px 14px" }}><PrioBadge p={o.prioridad} /></td>
                        <td style={{ padding:"10px 14px" }}><Badge estado={o.estado} entregada={o.entregada} /></td>
                        <td style={{ padding:"10px 14px", color:C.textSub }}>{o.tecnico_nombre ?? "—"}</td>
                        <td style={{ padding:"10px 14px", color:C.textSub }}>{o.tiempo_real_hrs ?? "—"}</td>
                      </tr>
                    ))}
                    {filtradas.length === 0 && (
                      <tr><td colSpan={9} style={{ padding:40, textAlign:"center", color:C.muted }}>Sin resultados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ── GRÁFICAS */}
        {tab === "Gráficas" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <Card style={{ gridColumn:"1/-1" }}>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Actividad mensual</div>
              <div style={{ color:C.text, fontSize:16, fontWeight:600, marginBottom:16 }}>Órdenes por mes — {new Date().getFullYear()}</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataMes} barSize={18} barGap={4}>
                  <XAxis dataKey="mes" tick={{ fill:C.muted, fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:C.muted, fontSize:12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tooltip2 />} cursor={{ fill:C.accent+"11" }} />
                  <Legend wrapperStyle={{ color:C.muted, fontSize:12 }} />
                  <Bar dataKey="nuevas"     name="Nuevas"     fill={C.accent}  radius={[4,4,0,0]} />
                  <Bar dataKey="en_proceso" name="En proceso" fill={C.warn}    radius={[4,4,0,0]} />
                <Bar dataKey="terminadas" name="Terminadas" fill={C.success} radius={[4,4,0,0]} />
              </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Distribución</div>
              <div style={{ color:C.text, fontSize:16, fontWeight:600, marginBottom:16 }}>Por prioridad</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dataPrio} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {dataPrio.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<Tooltip2 />} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Rendimiento</div>
              <div style={{ color:C.text, fontSize:16, fontWeight:600, marginBottom:16 }}>Órdenes por técnico</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={grafTec} layout="vertical" barSize={14}>
                  <XAxis type="number" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="tecnico" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<Tooltip2 />} cursor={{ fill:C.accent+"11" }} />
                  <Bar dataKey="total_ordenes" name="Órdenes" radius={[0,4,4,0]}>
                    {grafTec.map((_,i) => <Cell key={i} fill={C.accent} fillOpacity={1-i*0.1} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* ── TÉCNICOS */}
        {tab === "Técnicos" && <PanelTecnicos />}
      </div>

        {/* ── USUARIOS */}
        {tab === "Usuarios" && <PanelUsuarios usuarioActual={usuario} />}

      {exportando && <ExportarReportes onCerrar={() => setExp(false)} />}

      {/* Solicitar orden */}
      {solicitando && <FormOrdenAdmin usuario={usuario} onCerrar={() => setSol(false)} onExito={() => { setSol(false); cargar(); }} />}

      {/* Modal */}
      <ModalOrden orden={ordenSel} onClose={() => setOS(null)} onActualizado={async () => { const no = ordenSel?.no_orden; await cargar(); if (no) { const { data } = await supabase.from("vista_ordenes").select("*").eq("no_orden", no).single(); if (data) setOS(data); } }} usuario={usuario} tecnicos={tecnicos} materiales={materiales} />
    </div>
  );
}
