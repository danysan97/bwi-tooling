import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, cerrarSesion, obtenerOrdenesTecnico, obtenerPerfilTecnico, cargarHistorial, obtenerMateriales, obtenerAreas, obtenerUrlPlano, registrarEvento, parseFechaUTC, obtenerLogoBase64, agregarRegistroHoras, eliminarRegistroHoras, obtenerRegistrosHoras } from "./lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import DatePicker from "./DatePicker.jsx";
import Paginacion from "./Paginacion.jsx";
import { C, PRIO_COLOR, PRIO_LABEL, EST_COLOR, EST_LABEL, modalScale, fadeIn, slideUp, glassSurface, glowAccent } from "./theme";

const HRS_DIA    = { primero: 8,   segundo: 7.5  };
const HRS_SEMANA = { primero: 40,  segundo: 37.5 };
const HRS_MES    = { primero: 160, segundo: 150  };

const Label = ({ children, required }) => (
  <label style={{ display:"block", color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>
    {children}{required && <span style={{ color:C.danger, marginLeft:3 }}>*</span>}
  </label>
);

const Badge = ({ color, label }) => (
  <span style={{
    background: color + "18",
    color,
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  }}>{label}</span>
);

const focusRing = {
  onFocus: (e) => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; },
  onBlur: (e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; },
};

const btnSmall = { width:28, height:28, borderRadius:6, border:`1px solid ${C.border}`, background:C.bg, color:C.text, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, transition:"all 0.15s" };

function getSemanaActual() {
  const hoy = new Date();
  const dia = hoy.getDay() || 7;
  const lunes = new Date(hoy); lunes.setDate(hoy.getDate() - dia + 1); lunes.setHours(0,0,0,0);
  const vier = new Date(lunes); vier.setDate(lunes.getDate() + 6); vier.setHours(23,59,59,999);
  return { inicio: lunes, fin: vier };
}

function semanaARango(anio, semana) {
  const enero1 = new Date(anio, 0, 1);
  const diaSemana = enero1.getDay() || 7;
  const lunesInicio = new Date(enero1);
  lunesInicio.setDate(enero1.getDate() - diaSemana + 1 + (semana - 1) * 7);
  lunesInicio.setHours(0, 0, 0, 0);
  const fin = new Date(lunesInicio);
  fin.setDate(lunesInicio.getDate() + 6);
  fin.setHours(23, 59, 59, 999);
  return { inicio: lunesInicio, fin };
}

function getNumeroSemana(fecha) {
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getMesActual() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth()+1, 0, 23, 59, 59);
  return { inicio, fin };
}

const inputStyle = {
  width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`,
  borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none",
  transition:"border-color 0.2s, box-shadow 0.2s",
};

// ── Modal detalle de orden ──────────────────────────────────
function DetalleOrden({ orden, segRow, usuario, materiales, onCerrar, onGuardado }) {
  const [tab, setTab] = useState("info");
  const [fechaInicio, setFInicio] = useState(segRow?.fecha_inicio ?? "");
  const [fechaTermino, setFTermino] = useState(segRow?.fecha_termino ?? "");
  const [horas, setHoras] = useState(segRow?.tiempo_real_hrs ?? "");
  const [materialId, setMatId] = useState(segRow?.material_id ?? "");
  const [materialOtro, setMatOtro] = useState(segRow?.material_otro ?? "");
  const [comentarios, setComent] = useState(segRow?.comentarios ?? "");
  const [historial, setHistorial] = useState([]);
  const [guardando, setG] = useState(false);
  const [msg, setMsg] = useState("");
  const [planoUrl, setPlanoUrl] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().slice(0,10));
  const [nuevasHoras, setNuevasHoras] = useState("");
  const [nuevoComent, setNuevoComent] = useState("");
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    cargarHistorial(orden.no_orden).then(({ data }) => setHistorial(data ?? []));
    obtenerRegistrosHoras(orden.no_orden).then(({ data }) => setRegistros(data ?? []));
    if (orden.archivo_url) {
      obtenerUrlPlano(orden.archivo_url).then(({ url }) => setPlanoUrl(url));
    }
  }, [orden.no_orden]);

  const cargarRegistros = () => obtenerRegistrosHoras(orden.no_orden).then(({ data }) => setRegistros(data ?? []));

  const handleAgregarHoras = async () => {
    if (!nuevaFecha || !nuevasHoras || Number(nuevasHoras) <= 0) { setMsg("Fecha y horas son obligatorias."); return; }
    setAgregando(true); setMsg("");
    const { error } = await agregarRegistroHoras(orden.no_orden, usuario.id, nuevaFecha, Number(nuevasHoras), nuevoComent || null, usuario.id);
    if (error) { setMsg("Error: " + error.message); setAgregando(false); return; }
    await registrarEvento(orden.no_orden, 'horas', `${usuario.nombre_completo || "Técnico"}: ${nuevasHoras}h el ${nuevaFecha}${nuevoComent ? ": " + nuevoComent : ""}`, usuario.id);
    setNuevasHoras(""); setNuevoComent("");
    await cargarRegistros();
    setMsg("Registro de horas guardado.");
    setAgregando(false);
    onGuardado();
  };

  const handleEliminarRegistro = async (reg) => {
    if (!window.confirm(`¿Eliminar registro de ${reg.horas}h del ${reg.fecha}?`)) return;
    await eliminarRegistroHoras(reg.id, orden.no_orden, usuario.id);
    await registrarEvento(orden.no_orden, 'horas', `Eliminó registro de ${usuario.nombre_completo || "Técnico"}: ${reg.horas}h del ${reg.fecha}`, usuario.id);
    await cargarRegistros();
    onGuardado();
  };

  const horasTotal = registros.reduce((s, r) => s + Number(r.horas), 0);

  const guardar = async () => {
    if (!fechaInicio) { setMsg("La fecha de inicio es obligatoria."); return; }
    setG(true); setMsg("");
    await supabase.from("seguimiento_orden").update({
      fecha_inicio:  fechaInicio || null,
      fecha_termino: fechaTermino || null,
      material_id:   materialId || null,
      material_otro: materialOtro || null,
      comentarios:   comentarios || null,
    }).eq("id", segRow.id);

    if (!segRow.fecha_inicio && fechaInicio) {
      await registrarEvento(orden.no_orden, 'inicio', `Trabajo iniciado.`, usuario.id);
    }
    if (!segRow.fecha_termino && fechaTermino) {
      await registrarEvento(orden.no_orden, 'terminado', `Trabajo finalizado.`, usuario.id);
      if (orden.estado === "en_proceso") {
        await supabase.from("ordenes_trabajo").update({ estado: "terminada" }).eq("no_orden", orden.no_orden);
        await registrarEvento(orden.no_orden, 'cambio_estado', `Estado cambiado a terminada.`, usuario.id, { estado_anterior: "en_proceso", estado_nuevo: "terminada" });
      }
    }

    setG(false); setMsg("Guardado correctamente.");
    onGuardado();
  };

  const o = orden;
  const prioColor = PRIO_COLOR[o.prioridad] ?? C.muted;
  const prioLabel = PRIO_LABEL[o.prioridad] ?? o.prioridad;
  const oDate = o.fecha_solicitud ? parseFechaUTC(o.fecha_solicitud) : null;

  const abrirImpresion = async () => {
    const logoB64 = await obtenerLogoBase64();
    const logoTag = logoB64 ? `<img src="${logoB64}" style="height:40px;object-fit:contain;margin-right:12px" alt="BWI Group" />` : `<div style="background:#1B3A6B;color:#fff;font-weight:900;font-size:18px;padding:8px 16px;letter-spacing:2;margin-right:12px;border-radius:4">BWI</div>`;
    const html = `<div style="padding:20px;font-family:Arial,sans-serif;font-size:11px;color:#000">
      <div style="display:flex;align-items:center;margin-bottom:8px">
        ${logoTag}
        <div style="flex:1;text-align:center"><div style="font-size:15px;font-weight:700;color:#1B3A6B;text-transform:uppercase;letter-spacing:1">ORDEN DE TRABAJO PARA TALLER</div><div style="font-size:9px;color:#666;margin-top:2">TOOLROOM — TALLER MÁQUINAS Y HERRAMIENTAS</div></div>
        <div style="text-align:right;font-size:9px;color:#666"><div style="font-weight:700;font-size:13px;color:#1B3A6B">No. Orden: #${o.no_orden}</div><div>F-1100.C.03-02</div><div>Rev. 06</div></div>
      </div>
      <div style="border:2px solid #1B3A6B;border-radius:4;overflow:hidden">
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:3;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Solicitante</div><div style="font-size:11px;margin-top:2">${o.solicitante_nombre||""}</div></div><div style="flex:1;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">No. de empleado</div><div style="font-size:11px;margin-top:2">${o.solicitante_empleado||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Área</div><div style="font-size:11px;margin-top:2">${o.area_codigo?`${o.area_codigo} — ${o.area_nombre||""}`:o.area_nombre||""}</div></div><div style="flex:2;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Departamento</div><div style="font-size:11px;margin-top:2">${o.departamento||""}</div></div></div>
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Fecha de solicitud</div><div style="font-size:11px;margin-top:2">${o.fecha_solicitud?new Date(o.fecha_solicitud).toLocaleDateString("es-MX"):""}</div></div><div style="flex:4;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Prioridad</div><div style="font-size:11px;font-weight:700;margin-top:2">${PRIO_LABEL[o.prioridad]||o.prioridad}</div></div></div>
        <div style="background:#F5F5F5;padding:3px 8px;font-size:8px;font-weight:700;color:#1B3A6B;text-transform:uppercase;border-bottom:1px solid #ccc">DATOS DE LA PIEZA</div>
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:4;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Nombre de la pieza</div><div style="font-size:11px;font-weight:700;margin-top:2">${o.nombre_pieza||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">S.E.T.C. #</div><div style="font-size:11px;margin-top:2">${o.setc_numero||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">No. de plano</div><div style="font-size:11px;margin-top:2">${o.no_plano||""}</div></div><div style="flex:1;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Cantidad</div><div style="font-size:11px;margin-top:2">${o.cantidad||""}</div></div></div>
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:3;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">No. de máquina / Fixtura / Equipo</div><div style="font-size:11px;margin-top:2">${o.no_maquina||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Línea / Celda</div><div style="font-size:11px;margin-top:2">${o.linea_celda||"—"}</div></div><div style="flex:4;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Autorización urgencia</div><div style="font-size:11px;margin-top:2">${o.autorizada===true?(o.nombre_autoriza?"Autorizado por: "+o.nombre_autoriza+(o.puesto_autoriza?" — "+o.puesto_autoriza:""):"✅ AUTORIZADA"):o.autorizada===false?"❌ RECHAZADA":"___________________________"}</div></div></div>
        <div style="background:#F5F5F5;padding:3px 8px;font-size:8px;font-weight:700;color:#1B3A6B;text-transform:uppercase;border-bottom:1px solid #ccc;border-top:1px solid #ccc">DESCRIPCIÓN DEL TRABAJO A REALIZAR</div>
        <div style="padding:6px 8px;min-height:60px;border-bottom:1px solid #ccc;font-size:11px;line-height:1.5">${o.descripcion||""}</div>
        <div style="background:#1B3A6B;padding:3px 8px;font-size:8px;font-weight:700;color:#fff;text-transform:uppercase">PARA SER LLENADO POR ENCARGADO DEL TALLER</div>
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Fecha inicio</div><div style="font-size:11px;margin-top:2">${fechaInicio||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Fecha término</div><div style="font-size:11px;margin-top:2">${fechaTermino||""}</div></div><div style="flex:2;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Horas totales</div><div style="font-size:11px;margin-top:2">${horasTotal?horasTotal.toFixed(1):""}</div></div><div style="flex:3;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Técnico(s) que realizó</div><div style="font-size:11px;margin-top:2">${usuario?.nombre_completo||""}</div></div></div>
        <div style="display:flex;border-bottom:1px solid #ccc"><div style="flex:4;padding:4px 8px;border-right:1px solid #ccc"><div style="font-size:7px;color:#666;text-transform:uppercase">Material utilizado</div><div style="font-size:11px;margin-top:2">${[materialId?(materiales.find(m=>m.id===materialId)?.nombre||materialId):"",materialOtro].filter(Boolean).join(", ")||""}</div></div><div style="flex:2;padding:4px 8px"><div style="font-size:7px;color:#666;text-transform:uppercase">Estado</div><div style="font-size:11px;margin-top:2">${o.estado==="terminada"?(o.entregada?"✅ TERMINADA / ENTREGADA":"✅ TERMINADA — Pendiente de entrega"):o.estado==="en_proceso"?"🔧 EN PROCESO":o.estado==="cancelada"?"❌ CANCELADA":"🆕 NUEVA"}</div></div></div>
        <div style="padding:6px 8px;min-height:40px;border-top:1px solid #ccc;font-size:11px"><span style="font-size:8px;color:#666;text-transform:uppercase">Comentarios: </span>${comentarios||""}</div>
        <div style="background:#F5F5F5;border-top:1px solid #ccc;display:flex"><div style="flex:1;padding:12px 8px;border-right:1px solid #ccc;text-align:center"><div style="border-top:1px solid #000;margin-top:24px;padding-top:4px;font-size:9px;color:#666">Firma Gerente Tool Room / Autorización urgencia</div></div><div style="flex:1;padding:12px 8px;text-align:center"><div style="border-top:1px solid #000;margin-top:24px;padding-top:4px;font-size:9px;color:#666">Firma Conformidad del Solicitante</div></div></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:8px;font-size:8px;color:#999"><span>F-1100.C.03-02 Rev. 06</span><span>BWI Group — Departamento de TOOLROOM</span><span>Impreso: ${new Date().toLocaleDateString("es-MX")}</span></div>
      <div style="margin-top:8px;padding:6px 10px;border:1px solid #ccc;border-radius:4px;font-size:8px;color:#555;line-height:1.6"><strong>PRIORIDADES:</strong> 1-Seguridad · 2-Queja de cliente · 3-Máquina parada · 4-Trabajo rápido · 5-Fabricación</div>
    </div>`;
    const ventana = window.open("", "_blank");
    ventana.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Orden #${o.no_orden} — BWI TOOLROOM</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11px;padding:20px}#btnImprimir{position:fixed;top:16px;right:16px;background:#3B82F6;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;z-index:999;box-shadow:0 2px 8px rgba(0,0,0,.3)}#btnImprimir:hover{background:#2563EB}@page{size:letter;margin:10mm}@media print{#btnImprimir{display:none}body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><button id="btnImprimir" onclick="window.print()">🖨 Imprimir</button>${html}</body></html>`);
    ventana.document.close();
    ventana.focus();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position:"fixed", inset:0,
        background:"rgba(0,0,0,0.6)",
        backdropFilter:"blur(8px)",
        WebkitBackdropFilter:"blur(8px)",
        zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16
      }}
    >
      <motion.div
        {...modalScale}
        style={{
          background:C.surface,
          border:`1px solid ${C.border}`,
          borderRadius:16,
          width:"100%", maxWidth:800, maxHeight:"92vh", overflowY:"auto",
          ...glowAccent,
        }}
      >

        {/* Header */}
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ color:C.accent, fontWeight:800, fontSize:20 }}>#{o.no_orden}</span>
              <Badge color={prioColor} label={prioLabel} />
              <Badge color={EST_COLOR[o.estado]} label={EST_LABEL[o.estado]} />
            </div>
            <div style={{ color:C.textSub, fontSize:13, marginTop:4 }}>{o.nombre_pieza}</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={abrirImpresion} style={{ background:C.border, color:C.textSub, border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>🖨 Imprimir</motion.button>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={onCerrar} style={{ background:C.border, color:C.muted, border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:13, transition:"all 0.2s" }}>✕ Cerrar</motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding:"0 24px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:0 }}>
          {[["info","Información"],["mi_avance","Mi avance"],["historial","Historial"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ background:"none", border:"none", borderBottom:`2px solid ${tab===k?C.accent:"transparent"}`, color:tab===k?C.accent:C.muted, padding:"12px 18px", cursor:"pointer", fontWeight:600, fontSize:13, transition:"all 0.2s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ padding:"20px 24px" }}>
          {tab === "info" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <InfoRow label="Folio" value={`#${o.no_orden}`} />
              <InfoRow label="Fecha solicitud" value={oDate ? oDate.toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}) : "—"} />
              <InfoRow label="Pieza" value={o.nombre_pieza} />
              <InfoRow label="Solicitante" value={o.solicitante_nombre ?? "—"} />
              <InfoRow label="SETC" value={o.setc_numero ?? "—"} />
              <InfoRow label="No. plano" value={o.no_plano ?? "—"} />
              <InfoRow label="No. máquina" value={o.no_maquina ?? "—"} />
              <InfoRow label="Línea / celda" value={o.linea_celda ?? "—"} />
              <InfoRow label="Cantidad" value={o.cantidad} />
              <InfoRow label="Prioridad" value={prioLabel} color={prioColor} />
              <InfoRow label="Estado" value={EST_LABEL[o.estado]} color={EST_COLOR[o.estado]} />
              <InfoRow label="Técnicos" value={o.tecnico_nombre ?? "—"} />
              {o.descripcion && (
                <div style={{ gridColumn:"1/-1" }}>
                  <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>Descripción</div>
                  <div style={{ color:C.text, fontSize:13, lineHeight:1.5 }}>{o.descripcion}</div>
                </div>
              )}
              {planoUrl && (
                <div style={{ gridColumn:"1/-1", marginTop:8 }}>
                  <div style={{ color:C.muted, fontSize:11, marginBottom:6 }}>Plano / Archivo adjunto</div>
                  {o.archivo_nombre?.match(/\.(pdf)$/i) ? (
                    <iframe src={planoUrl} style={{ width:"100%", height:400, border:`1px solid ${C.border}`, borderRadius:8 }} title="Plano" />
                  ) : (
                    <a href={planoUrl} target="_blank" rel="noopener noreferrer">
                      <img src={planoUrl} alt="Plano" style={{ maxWidth:"100%", maxHeight:400, borderRadius:8, border:`1px solid ${C.border}` }} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === "mi_avance" && segRow && (
            <div style={{ display:"grid", gap:14, maxWidth:500 }}>
              {msg && <div style={{ background:C.success+"18", border:`1px solid ${C.success}55`, borderRadius:8, padding:"10px 14px", color:C.success, fontSize:13 }}>{msg}</div>}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <Label>Fecha inicio</Label>
                  <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color: fechaInicio ? C.text : C.muted, fontSize:13 }}>
                    {fechaInicio ? new Date(fechaInicio + "T12:00:00").toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}) : "Sin asignar"}
                  </div>
                </div>
                <div>
                  <Label>Fecha término</Label>
                  {orden.estado === "terminada" ? (
                    <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color: fechaTermino ? C.text : C.muted, fontSize:13 }}>
                      {fechaTermino ? new Date(fechaTermino + "T12:00:00").toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
                    </div>
                  ) : (orden.estado === "en_proceso") ? (
                    <DatePicker value={fechaTermino} onChange={setFTermino} />
                  ) : (
                    <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.muted, fontSize:12 }}>
                      Disponible al estar en proceso
                    </div>
                  )}
                </div>
              </div>

              {/* ── Registro de horas por sesión ── */}
              {fechaInicio ? (
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <Label>Registro de horas</Label>
                  <span style={{ color:C.accent, fontWeight:700, fontSize:15 }}>{horasTotal.toFixed(1)}h</span>
                </div>

                {/* Lista de registros existentes */}
                {registros.length > 0 && (
                  <div style={{ display:"grid", gap:6, marginBottom:12 }}>
                    {registros.map(r => (
                      <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 10px", background:C.surface, borderRadius:8, border:`1px solid ${C.border}` }}>
                        <span style={{ color:C.textSub, fontSize:12, minWidth:90 }}>{new Date(r.fecha + "T12:00:00").toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</span>
                        <span style={{ color:C.accent, fontWeight:700, fontSize:13, minWidth:40 }}>{r.horas}h</span>
                        {r.comentario && <span style={{ color:C.muted, fontSize:11, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.comentario}</span>}
                        {r.usuarios?.nombre_completo && <span style={{ color:C.muted, fontSize:10, marginLeft:"auto" }}>{r.usuarios.nombre_completo}</span>}
                        {orden.estado !== "terminada" && usuario.rol === "superadmin" && <button onClick={() => handleEliminarRegistro(r)} style={{ background:"none", border:"none", color:C.danger, cursor:"pointer", fontSize:14, padding:2 }} title="Eliminar">✕</button>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulario nuevo registro */}
                {orden.estado !== "terminada" && (
                <div style={{ display:"grid", gridTemplateColumns:"110px 70px 1fr auto", gap:8, alignItems:"end" }}>
                  <div>
                    <div style={{ color:C.muted, fontSize:10, marginBottom:3 }}>Fecha</div>
                    <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} style={{ ...inputStyle, fontSize:12, padding:"7px 8px" }} />
                  </div>
                  <div>
                    <div style={{ color:C.muted, fontSize:10, marginBottom:3 }}>Horas</div>
                    <input type="number" step="0.5" min="0.5" placeholder="0" value={nuevasHoras} onChange={e => setNuevasHoras(e.target.value)} style={{ ...inputStyle, fontSize:12, padding:"7px 8px" }} />
                  </div>
                  <div>
                    <div style={{ color:C.muted, fontSize:10, marginBottom:3 }}>Nota (opc.)</div>
                    <input placeholder="Detalle breve…" value={nuevoComent} onChange={e => setNuevoComent(e.target.value)} style={{ ...inputStyle, fontSize:12, padding:"7px 8px" }} onKeyDown={e => { if (e.key === "Enter" && !agregando) handleAgregarHoras(); }} />
                  </div>
                  <motion.button whileHover={!agregando ? { scale:1.05 } : {}} whileTap={!agregando ? { scale:0.95 } : {}} onClick={handleAgregarHoras} disabled={agregando} style={{ background:agregando?C.border:C.accent, color:agregando?C.muted:"#fff", border:"none", borderRadius:8, width:36, height:36, cursor:agregando?"default":"pointer", fontSize:20, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                    +
                  </motion.button>
                </div>
                )}
                {registros.length === 0 && <div style={{ color:C.muted, fontSize:11, textAlign:"center", marginTop:8 }}>Sin registros aún. Usa "+" para agregar horas trabajadas.</div>}
              </div>
              ) : (
                <div style={{ background:C.warn+"18", border:`1px solid ${C.warn}55`, borderRadius:8, padding:"12px 16px", textAlign:"center" }}>
                  <div style={{ color:C.warn, fontWeight:600, fontSize:13 }}>⚠️ El admin debe guardar tu asignación (técnico + material + fecha de inicio) antes de registrar horas.</div>
                </div>
              )}

              <div>
                <Label>Material utilizado</Label>
                {orden.estado === "terminada" ? (
                  <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color: materialId ? C.text : C.muted, fontSize:13 }}>
                    {materialId ? (materiales.find(m => m.id === materialId)?.nombre || "Otro") + (materialOtro ? ` (${materialOtro})` : "") : "—"}
                  </div>
                ) : (
                <>
                <select value={materialId} onChange={e => setMatId(e.target.value)}
                  style={{ ...inputStyle, cursor:"pointer" }} {...focusRing}>
                  <option value="">— Seleccionar —</option>
                  {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                  <option value="otro">Otro</option>
                </select>
                </>
                )}
              </div>
              {materialId === "otro" && orden.estado !== "terminada" && (
                <div>
                  <Label>Otro material</Label>
                  <input placeholder="Especifica el material" value={materialOtro} onChange={e => setMatOtro(e.target.value)}
                    style={inputStyle} {...focusRing} />
                </div>
              )}
              <div>
                <Label>Comentarios</Label>
                {orden.estado === "terminada" ? (
                  <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px", color: comentarios ? C.text : C.muted, fontSize:13, whiteSpace:"pre-wrap" }}>
                    {comentarios || "—"}
                  </div>
                ) : (
                <textarea rows={3} placeholder="Observaciones, detalles del trabajo…" value={comentarios} onChange={e => setComent(e.target.value)}
                  style={{ ...inputStyle, resize:"vertical" }} {...focusRing} />
                )}
              </div>
              {orden.estado !== "terminada" && (
              <motion.button whileHover={!guardando ? { scale:1.02 } : {}} whileTap={!guardando ? { scale:0.98 } : {}} onClick={guardar} disabled={guardando} style={{ background:guardando?C.border:C.accent, color:guardando?C.muted:"#fff", border:"none", borderRadius:10, padding:"11px 0", cursor:guardando?"default":"pointer", fontWeight:700, fontSize:14, transition:"all 0.2s" }}>
                {guardando ? "Guardando…" : "Guardar avance"}
              </motion.button>
              )}
            </div>
          )}

          {tab === "historial" && (
            <div style={{ display:"grid", gap:8 }}>
              {historial.length === 0 && <div style={{ color:C.muted, textAlign:"center", padding:30 }}>Sin eventos registrados.</div>}
              {historial.map(ev => {
                const fecha = ev.fecha_evento ? parseFechaUTC(ev.fecha_evento) : null;
                const labels = { recepcion:"Recepción", asignacion:"Asignación", inicio:"Inicio", comentario:"Comentario", autorizacion:"Autorización", cambio_estado:"Cambio de estado", material:"Material", terminado:"Terminado", entrega:"Entrega", horas:"Registro de horas" };
                const colors = { recepcion:C.accent, asignacion:C.purple, inicio:C.warn, comentario:C.muted, autorizacion:C.success, cambio_estado:"#F97316", material:"#06B6D4", terminado:C.success, entrega:C.danger, horas:"#06B6D4" };
                const icon = { recepcion:"📥", asignacion:"👤", inicio:"▶️", comentario:"💬", autorizacion:"✅", cambio_estado:"🔄", material:"🔧", terminado:"🏁", entrega:"📦", horas:"⏱" };
                return (
                  <div key={ev.id} style={{ display:"flex", gap:12, padding:"10px 14px", background:C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:18, width:28, textAlign:"center" }}>{icon[ev.evento_tipo] ?? "📌"}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ color:colors[ev.evento_tipo] ?? C.muted, fontWeight:600, fontSize:12 }}>{labels[ev.evento_tipo] ?? ev.evento_tipo}</span>
                        <span style={{ color:C.muted, fontSize:11 }}>{fecha ? fecha.toLocaleDateString("es-MX",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : ""}</span>
                      </div>
                      {ev.detalle && <div style={{ color:C.textSub, fontSize:12, marginTop:3 }}>{ev.detalle}</div>}
                      {ev.creado_por && <div style={{ color:C.muted, fontSize:10, marginTop:2 }}>Por: {ev.usuarios?.nombre_completo ?? "Sistema"}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div>
      <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>{label}</div>
      <div style={{ color:color || C.text, fontSize:13, fontWeight:600 }}>{value}</div>
    </div>
  );
}

// ── Portal principal del técnico ────────────────────────────
export default function TecnicoPortal({ usuario, onSalir }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoad] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [ordenSel, setOS] = useState(null);
  const [segRow, setSegRow] = useState(null);
  const [materiales, setMateriales] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [pantalla, setPantalla] = useState("ordenes");
  const [allRegistros, setAllRegistros] = useState([]);
  const hoy = new Date();
  const [selSemana, setSelSemana] = useState(getNumeroSemana(hoy));
  const [selMes, setSelMes]       = useState(hoy.getMonth());
  const [selAnio, setSelAnio]     = useState(hoy.getFullYear());
  const [modoPeriodo, setModoPeriodo] = useState("semana");
  const [pagina, setPagina]     = useState(1);
  const [porPagina, setPorPag]  = useState(30);

  useEffect(() => { cargar(); }, []);
  useEffect(() => { setPagina(1); }, [filtro]);

  const cargar = async () => {
    setLoad(true);
    const [ordRes, matRes, perfRes, areasRaw] = await Promise.all([
      obtenerOrdenesTecnico(usuario.id),
      obtenerMateriales(),
      obtenerPerfilTecnico(usuario.id),
      obtenerAreas(),
    ]);
    const areasMap = Object.fromEntries((areasRaw ?? []).map(a => [a.codigo, a.nombre]));
    setOrdenes((ordRes.data ?? []).map(s => {
      const ot = s.ordenes_trabajo ?? {};
      const sol = ot.solicitante;
      const ac = sol?.area_codigo ?? ot.area_codigo;
      return {
        ...s,
        ordenes_trabajo: {
          ...ot,
          solicitante_nombre: sol?.nombre_completo ?? ot.solicitante_nombre,
          solicitante_empleado: sol?.no_empleado ?? ot.solicitante_empleado,
          area_nombre: areasMap[ac] ?? ot.area_nombre ?? null,
          area_codigo: ac,
          departamento: sol?.departamento ?? ot.departamento,
        }
      };
    }));
    setMateriales(matRes ?? []);
    setPerfil(perfRes.data);
    // Cargar todos los registros de horas del técnico
    const { data: regs } = await supabase.from("registro_horas").select("fecha, horas").eq("tecnico_id", usuario.id);
    setAllRegistros(regs ?? []);
    setLoad(false);
  };

  const filtradas = ordenes.filter(s => {
    if (filtro === "todas") return true;
    const e = s.ordenes_trabajo?.estado;
    if (filtro === "entregadas") return e === "terminada" && s.ordenes_trabajo?.entregada;
    return e === filtro;
  });

  const totalHrs = allRegistros.reduce((s, r) => s + (Number(r.horas) || 0), 0);
  const terminadas = ordenes.filter(o => o.ordenes_trabajo?.estado === "terminada").length;
  const enProceso = ordenes.filter(o => o.ordenes_trabajo?.estado === "en_proceso").length;
  const turno = perfil?.turno ?? "primero";
  const semRango = semanaARango(selAnio, selSemana);
  const semInicio = semRango.inicio.toISOString().slice(0,10);
  const semFin = semRango.fin.toISOString().slice(0,10);
  const mesInicio = new Date(selAnio, selMes, 1).toISOString().slice(0,10);
  const mesFin = new Date(selAnio, selMes + 1, 0).toISOString().slice(0,10);
  const hrsSem = allRegistros.filter(r => r.fecha >= semInicio && r.fecha <= semFin).reduce((s, r) => s + (Number(r.horas) || 0), 0);
  const hrsMes = allRegistros.filter(r => r.fecha >= mesInicio && r.fecha <= mesFin).reduce((s, r) => s + (Number(r.horas) || 0), 0);
  const aprovSem = HRS_SEMANA[turno] > 0 ? Math.round((hrsSem / HRS_SEMANA[turno]) * 100) : 0;
  const aprovMes = HRS_MES[turno] > 0 ? Math.round((hrsMes / HRS_MES[turno]) * 100) : 0;

  const kpiData = [
    { name: "Trabajadas", value: hrsSem, fill: C.accent },
    { name: "Disponibles", value: HRS_SEMANA[turno] - hrsSem, fill: C.border },
  ];

  const abrirOrden = (o, s) => {
    setOS(o);
    setSegRow(s);
  };

  const handlePrint = () => {
    window.print();
  };

  const filterActiveColor = (f) => {
    if (f === "entregadas") return C.purple;
    return EST_COLOR[f] || C.accent;
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      {/* Header */}
      <div style={{ ...glassSurface, borderBottom:`1px solid ${C.border}`, padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <img src="/logo-bwi.png" alt="BWI Group" style={{ height:32, objectFit:"contain" }} />
          <span style={{ color:C.muted, fontSize:12 }}>Portal del Técnico — TOOLROOM</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:13, fontWeight:600 }}>{usuario.nombre_completo}</div>
            <div style={{ color:C.muted, fontSize:11 }}>#{usuario.no_empleado} · Turno {turno === "segundo" ? "2° (7.5 hrs)" : "1° (8 hrs)"}</div>
          </div>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={onSalir} style={{ background:C.border, color:C.muted, border:"none", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>Salir</motion.button>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ ...glassSurface, borderBottom:`1px solid ${C.border}`, padding:"0 24px", display:"flex", gap:0 }}>
        {[["ordenes","Mis Órdenes"],["rendimiento","Mi Rendimiento"]].map(([k,l]) => (
          <button key={k} onClick={() => setPantalla(k)} style={{ background:"none", border:"none", borderBottom:`2px solid ${pantalla===k?C.accent:"transparent"}`, color:pantalla===k?C.accent:C.muted, padding:"12px 18px", cursor:"pointer", fontWeight:600, fontSize:13, transition:"all 0.2s" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding:"20px 24px" }}>
        {pantalla === "ordenes" && (
          <>
            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:18 }}>
              {[
                { label:"Total órdenes", value:ordenes.length, color:C.text },
                { label:"En proceso", value:enProceso, color:C.warn },
                { label:"Terminadas", value:terminadas, color:C.success },
                { label:"Horas registradas", value:`${totalHrs.toFixed(1)}`, sub:"hrs", color:C.accent },
                { label:"Aprovechamiento mes", value:`${aprovMes}%`, color:aprovMes >= 80 ? C.success : aprovMes >= 50 ? C.warn : C.danger },
              ].map(k => (
                <motion.div key={k.label} whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }} transition={{ duration:0.2 }} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px", transition:"all 0.2s" }}>
                  <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{k.label}</div>
                  <div style={{ color:k.color, fontSize:26, fontWeight:800 }}>{k.value}{k.sub && <span style={{ fontSize:12, fontWeight:400, color:C.muted }}> {k.sub}</span>}</div>
                </motion.div>
              ))}
            </div>

            {/* Filtros */}
            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {["todas","nueva_orden","en_proceso","terminada","entregadas"].map(f => {
                const ac = filterActiveColor(f);
                const active = filtro === f;
                return (
                  <button key={f} onClick={() => setFiltro(f)} style={{
                    background: active ? ac+"22" : C.surface,
                    color: active ? ac : C.muted,
                    border:`1px solid ${active ? ac+"44" : C.border}`,
                    borderRadius:20, padding:"6px 16px", cursor:"pointer", fontSize:12, fontWeight:600,
                    transition:"all 0.2s",
                  }}>
                    {{todas:"Todas",nueva_orden:"Nuevas",en_proceso:"En proceso",terminada:"Terminadas",entregadas:"Entregadas"}[f]}
                  </button>
                );
              })}
            </div>

            {/* Tabla */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
              {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Cargando…</div> : (
                <>
                <div style={{ overflowX:"auto", maxHeight:"65vh", overflowY:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                    <thead>
                      <tr style={{ ...glassSurface, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:2 }}>
                        {["Folio","Fecha","Pieza","Solicitante","Prioridad","Estado","Inicio","Término","Hrs","Acción"].map(h => (
                          <th key={h} style={{ padding:"10px 16px", color:C.muted, fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(porPagina >= filtradas.length ? filtradas : filtradas.slice((pagina - 1) * porPagina, pagina * porPagina)).map((s, i) => {
                        const o = s.ordenes_trabajo;
                        if (!o) return null;
                        const prioColor = PRIO_COLOR[o.prioridad] ?? C.muted;
                        const prioLabel = PRIO_LABEL[o.prioridad] ?? o.prioridad;
                        const oDate = o.fecha_solicitud ? parseFechaUTC(o.fecha_solicitud) : null;
                        return (
                          <tr key={s.id} style={{ borderBottom:`1px solid ${C.border}`, transition:"background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                            onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ padding:"10px 16px", color:C.accent, fontWeight:700 }}>#{o.no_orden}</td>
                            <td style={{ padding:"10px 16px", color:C.textSub }}>{oDate ? oDate.toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"2-digit"}) : "—"}</td>
                            <td style={{ padding:"10px 16px", fontWeight:500, maxWidth:150, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.nombre_pieza}</td>
                            <td style={{ padding:"10px 16px", color:C.textSub }}>{o.solicitante_nombre ?? "—"}</td>
                            <td style={{ padding:"10px 16px" }}><Badge color={prioColor} label={prioLabel} /></td>
                            <td style={{ padding:"10px 16px" }}><Badge color={EST_COLOR[o.estado]} label={EST_LABEL[o.estado]} /></td>
                            <td style={{ padding:"10px 16px", color:C.textSub, fontSize:12 }}>{s.fecha_inicio ?? "—"}</td>
                            <td style={{ padding:"10px 16px", color:C.textSub, fontSize:12 }}>{s.fecha_termino ?? "—"}</td>
                            <td style={{ padding:"10px 16px", color:C.textSub }}>{s.tiempo_real_hrs ?? "—"}</td>
                            <td style={{ padding:"10px 16px" }}>
                              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={() => abrirOrden(o, s)} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}55`, borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600, transition:"all 0.2s" }}>
                                Ver detalle
                              </motion.button>
                            </td>
                          </tr>
                        );
                      })}
                      {filtradas.length === 0 && (
                        <tr><td colSpan={10} style={{ padding:40, textAlign:"center", color:C.muted }}>Sin órdenes con ese filtro.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Paginacion total={filtradas.length} pagina={pagina} porPagina={porPagina} onCambio={setPagina} onPorPaginaChange={setPorPag} />
                </>
              )}
            </div>
          </>
        )}

        {pantalla === "rendimiento" && (
          <div style={{ display:"grid", gap:16 }}>
            {/* Selector de período */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 22px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <div style={{ display:"flex", borderRadius:8, overflow:"hidden", border:`1px solid ${C.border}` }}>
                {[["semana","Semana"],["mes","Mes"]].map(([k,l]) => (
                  <button key={k} onClick={() => setModoPeriodo(k)} style={{ padding:"6px 16px", fontSize:13, fontWeight:600, border:"none", cursor:"pointer", transition:"all 0.2s", background: modoPeriodo === k ? C.accent : "transparent", color: modoPeriodo === k ? "#fff" : C.muted }}>{l}</button>
                ))}
              </div>
              {modoPeriodo === "semana" ? (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:C.textSub, fontSize:12, minWidth:70 }}>Semana</span>
                  <button onClick={() => { setSelSemana(s => s > 1 ? s - 1 : 52); if (selSemana <= 1) setSelAnio(a => a - 1); }} style={{ ...btnSmall }}>◀</button>
                  <input type="number" min={1} max={52} value={selSemana} onChange={e => setSelSemana(Math.max(1, Math.min(52, Number(e.target.value) || 1)))} style={{ width:52, textAlign:"center", background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:12, padding:"4px 0" }} />
                  <button onClick={() => { setSelSemana(s => s < 52 ? s + 1 : 1); if (selSemana >= 52) setSelAnio(a => a + 1); }} style={{ ...btnSmall }}>▶</button>
                  <span style={{ color:C.textSub, fontSize:12, minWidth:36 }}>· {selAnio}</span>
                  <button onClick={() => { const h = new Date(); setSelAnio(h.getFullYear()); setSelSemana(getNumeroSemana(h)); }} style={{ ...btnSmall, background:C.accent, color:"#fff", border:"none" }}>Hoy</button>
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ color:C.textSub, fontSize:12, minWidth:60 }}>Mes</span>
                  <button onClick={() => { if (selMes === 0) { setSelMes(11); setSelAnio(a => a - 1); } else setSelMes(m => m - 1); }} style={{ ...btnSmall }}>◀</button>
                  <span style={{ color:C.text, fontSize:13, fontWeight:600, minWidth:100, textAlign:"center" }}>{["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][selMes]}</span>
                  <button onClick={() => { if (selMes === 11) { setSelMes(0); setSelAnio(a => a + 1); } else setSelMes(m => m + 1); }} style={{ ...btnSmall }}>▶</button>
                  <span style={{ color:C.textSub, fontSize:12, minWidth:36 }}>· {selAnio}</span>
                  <button onClick={() => { const h = new Date(); setSelAnio(h.getFullYear()); setSelMes(h.getMonth()); }} style={{ ...btnSmall, background:C.accent, color:"#fff", border:"none" }}>Hoy</button>
                </div>
              )}
            </div>

            {/* KPI cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
              {[
                { label:"Hrs semana", value:`${hrsSem.toFixed(1)}`, sub:`/ ${HRS_SEMANA[turno]}`, color:C.accent },
                { label:"Hrs mes", value:`${hrsMes.toFixed(1)}`, sub:`/ ${HRS_MES[turno]}`, color:C.accent },
                { label:"Aprovechamiento semana", value:`${aprovSem}%`, color:aprovSem >= 80 ? C.success : aprovSem >= 50 ? C.warn : C.danger },
                { label:"Aprovechamiento mes", value:`${aprovMes}%`, color:aprovMes >= 80 ? C.success : aprovMes >= 50 ? C.warn : C.danger },
              ].map(k => (
                <motion.div key={k.label} whileHover={{ y:-2, boxShadow:"0 8px 24px rgba(0,0,0,0.3)" }} transition={{ duration:0.2 }} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 22px", textAlign:"center", transition:"all 0.2s" }}>
                  <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{k.label}</div>
                  <div style={{ color:k.color, fontSize:28, fontWeight:800 }}>{k.value}{k.sub && <span style={{ fontSize:12, fontWeight:400, color:C.muted }}> {k.sub}</span>}</div>
                </motion.div>
              ))}
            </div>

            {/* Gráfica de barras */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Rendimiento</div>
              <div style={{ color:C.text, fontSize:15, fontWeight:600, marginBottom:16 }}>Horas trabajadas vs disponibles</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  { name:"Semana", Trabajadas: hrsSem, Disponibles: HRS_SEMANA[turno] - hrsSem },
                  { name:"Mes", Trabajadas: hrsMes, Disponibles: HRS_MES[turno] - hrsMes },
                ]} barSize={36}>
                  <XAxis dataKey="name" tick={{ fill:C.muted, fontSize:12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13 }} />
                  <Legend wrapperStyle={{ color:C.muted, fontSize:12 }} />
                  <Bar dataKey="Disponibles" fill={C.border} radius={[4,4,0,0]} />
                  <Bar dataKey="Trabajadas" fill={C.accent} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Barras de eficiencia */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Eficiencia</div>
              <div style={{ color:C.text, fontSize:15, fontWeight:600, marginBottom:20 }}>Aprovechamiento por período</div>
              {[{ label:"Semana", pct:aprovSem, hrs:hrsSem, disp:HRS_SEMANA[turno] },
                { label:"Mes", pct:aprovMes, hrs:hrsMes, disp:HRS_MES[turno] },
              ].map(x => (
                <div key={x.label} style={{ marginBottom:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ color:C.textSub, fontSize:12 }}>{x.label} — {x.hrs.toFixed(1)} hrs / {x.disp} hrs</span>
                    <span style={{ color:x.pct >= 80 ? C.success : x.pct >= 50 ? C.warn : C.danger, fontWeight:700, fontSize:13 }}>{x.pct}%</span>
                  </div>
                  <div style={{ height:10, background:C.border, borderRadius:5, overflow:"hidden" }}>
                    <div style={{ width:`${Math.min(x.pct, 100)}%`, height:"100%", background:x.pct >= 80 ? C.success : x.pct >= 50 ? C.warn : C.danger, borderRadius:5, transition:"width .4s" }} />
                  </div>
                </div>
              ))}
              <div style={{ display:"flex", gap:16, marginTop:12, fontSize:11, color:C.muted }}>
                <span><span style={{ color:C.success }}>■</span> ≥80% Óptimo</span>
                <span><span style={{ color:C.warn }}>■</span> 50-79% Aceptable</span>
                <span><span style={{ color:C.danger }}>■</span> &lt;50% Bajo</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal detalle */}
      <AnimatePresence>
        {ordenSel && (
          <DetalleOrden
            orden={ordenSel}
            segRow={segRow}
            usuario={usuario}
            materiales={materiales}
            onCerrar={() => { setOS(null); setSegRow(null); }}
            onGuardado={cargar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
