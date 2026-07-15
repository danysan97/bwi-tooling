import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./lib/supabase";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
};

const PRIO_LABEL = {
  "1_seguridad":"1-Seguridad","2_queja_cliente":"2-Queja cliente",
  "3_maquina_parada":"3-Máquina parada","4_trabajo_rapido":"4-Trabajo rápido",
  "5_fabricacion":"5-Fabricación",
};
const EST_LABEL = {
  nueva_orden:"Nueva", en_proceso:"En proceso", terminada:"Terminada", cancelada:"Cancelada"
};

function formatFecha(f) {
  if (!f) return "—";
  return new Date(f).toLocaleDateString("es-MX");
}

// ── Exportar órdenes ─────────────────────────────────────────
async function exportarOrdenes(fechaInicio, fechaFin) {
  let q = supabase.from("vista_ordenes").select("*").order("no_orden", { ascending: true });
  if (fechaInicio) q = q.gte("fecha_solicitud", fechaInicio);
  if (fechaFin)    q = q.lte("fecha_solicitud", fechaFin + "T23:59:59");

  const { data, error } = await q;
  if (error || !data?.length) return { ok: false, msg: error ? "Error de conexión." : "Sin órdenes en ese período." };

  const filas = data.map(o => ({
    "No. Orden":          o.no_orden,
    "Fecha Solicitud":    formatFecha(o.fecha_solicitud),
    "Solicitante":        o.solicitante_nombre ?? "—",
    "No. Empleado":       o.solicitante_empleado ?? "—",
    "Área":               o.area_nombre ?? "—",
    "Departamento":       o.departamento ?? "—",
    "Pieza":              o.nombre_pieza ?? "—",
    "S.E.T.C. #":         o.setc_numero ?? "—",
    "No. Plano":          o.no_plano ?? "—",
    "No. Máquina":        o.no_maquina ?? "—",
    "Línea / Celda":      o.linea_celda ?? "—",
    "Cantidad":           o.cantidad ?? 0,
    "Descripción":        o.descripcion ?? "—",
    "Prioridad":          PRIO_LABEL[o.prioridad] ?? o.prioridad,
    "Estado":             EST_LABEL[o.estado] ?? o.estado,
    "Técnico":            o.tecnico_nombre ?? "Sin asignar",
    "Material":           o.material_usado ?? "—",
    "Fecha Inicio":       formatFecha(o.fecha_inicio),
    "Fecha Término":      formatFecha(o.fecha_termino),
    "Horas Reales":       o.tiempo_real_hrs ?? 0,
    "Comentarios Taller": o.comentarios ?? "—",
    "Orden Manual":       o.es_orden_manual ? "Sí" : "No",
    "Autorizada":         o.autorizada === true ? "Sí" : o.autorizada === false ? "No" : "Pendiente",
    "Entregada":          o.entregada ? "Sí" : "No",
  }));

  const wb  = XLSX.utils.book_new();
  const ws  = XLSX.utils.json_to_sheet(filas);

  // Anchos de columna
  ws["!cols"] = [
    {wch:10},{wch:16},{wch:28},{wch:14},{wch:30},{wch:20},{wch:30},
    {wch:14},{wch:16},{wch:16},{wch:10},{wch:40},{wch:20},{wch:14},
    {wch:28},{wch:20},{wch:14},{wch:14},{wch:12},{wch:30},{wch:12},{wch:12},
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Órdenes de Trabajo");

  // Hoja resumen
  const resumen = [
    ["REPORTE DE ÓRDENES — BWI TOOLROOM"],
    ["Período:", fechaInicio ? `${fechaInicio} al ${fechaFin || "hoy"}` : "Todas"],
    ["Total órdenes:", filas.length],
    ["Nuevas:", filas.filter(f => f["Estado"]==="Nueva").length],
    ["En proceso:", filas.filter(f => f["Estado"]==="En proceso").length],
    ["Terminadas:", filas.filter(f => f["Estado"]==="Terminada").length],
    ["Entregadas:", filas.filter(f => f["Estado"]==="Entregada").length],
    ["Canceladas:", filas.filter(f => f["Estado"]==="Cancelada").length],
    [],
    ["Por prioridad:"],
    ...Object.entries(PRIO_LABEL).map(([k,v]) => [v+":", filas.filter(f=>f["Prioridad"]===v).length]),
  ];
  const wsRes = XLSX.utils.aoa_to_sheet(resumen);
  wsRes["!cols"] = [{wch:30},{wch:20}];
  XLSX.utils.book_append_sheet(wb, wsRes, "Resumen");

  const nombre = `BWI_TOOLROOM_Ordenes_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, nombre);
  return { ok: true, msg: `${filas.length} órdenes exportadas.` };
}

// ── Exportar desempeño técnicos ──────────────────────────────
async function exportarTecnicos(fechaInicio, fechaFin) {
  const { data: tecs, error: eT } = await supabase
    .from("usuarios")
    .select("id, no_empleado, nombre_completo, departamento, turno")
    .eq("rol", "tecnico").eq("activo", true).order("nombre_completo");

  if (!tecs?.length) return { ok: false, msg: "Sin técnicos registrados." };

  const { data: segs, error: eS } = await supabase.from("seguimiento_orden")
    .select("tecnico_id, tiempo_real_hrs, fecha_inicio, fecha_termino, orden_id");
  if (eS) return { ok: false, msg: `Error seguimiento: ${eS.message}` };

  let q = supabase.from("ordenes_trabajo")
    .select("no_orden, nombre_pieza, estado, prioridad, fecha_solicitud");
  if (fechaInicio) q = q.gte("fecha_solicitud", fechaInicio + "T00:00:00");
  if (fechaFin)    q = q.lte("fecha_solicitud", fechaFin + "T23:59:59");
  const { data: ordenes, error: eO } = await q;
  if (eO) return { ok: false, msg: `Error órdenes: ${eO.message}` };

  const ordenesMap = {};
  (ordenes ?? []).forEach(o => { ordenesMap[o.no_orden] = o; });

  const segsFiltrados = (segs ?? []).filter(s => {
    const o = ordenesMap[s.orden_id];
    return !!o;
  });

  const HRS_SEMANA = { primero:40, segundo:37.5 };
  const HRS_MES    = { primero:160, segundo:150 };

  // Hoja 1: Resumen por técnico
  const resumenTec = tecs.map(t => {
    const mis  = (segsFiltrados ?? []).filter(s => s.tecnico_id === t.id);
    const hrs  = mis.reduce((s,x) => s+(Number(x.tiempo_real_hrs)||0), 0);
    const hrsSem = HRS_SEMANA[t.turno ?? "primero"];
    const hrsMes = HRS_MES[t.turno ?? "primero"];
    return {
      "No. Empleado":       t.no_empleado,
      "Técnico":            t.nombre_completo,
      "Departamento":       t.departamento ?? "—",
      "Turno":              t.turno === "segundo" ? "2° Turno (7.5 hrs/día)" : "1° Turno (8 hrs/día)",
      "Hrs Productivas/Día": t.turno === "segundo" ? 7.5 : 8,
      "Hrs Disponibles/Sem": hrsSem,
      "Hrs Disponibles/Mes": hrsMes,
      "Total Órdenes":      mis.length,
      "Órdenes Terminadas": mis.filter(s=>ordenesMap[s.orden_id]?.estado==="terminada").length,
      "Horas Trabajadas":   parseFloat(hrs.toFixed(2)),
      "Prom. Hrs/Orden":    mis.length ? parseFloat((hrs/mis.length).toFixed(2)) : 0,
      "Aprovech. Mensual %": hrsMes > 0 ? Math.round((hrs/hrsMes)*100) : 0,
    };
  });

  // Hoja 2: Detalle de órdenes por técnico
  const detalle = [];
  tecs.forEach(t => {
    const mis = (segsFiltrados ?? []).filter(s => s.tecnico_id === t.id);
    mis.forEach(s => {
      const o = ordenesMap[s.orden_id] ?? {};
      detalle.push({
        "Técnico":          t.nombre_completo,
        "No. Orden":        o.no_orden ?? "—",
        "Pieza":            o.nombre_pieza ?? "—",
        "Prioridad":        PRIO_LABEL[o.prioridad] ?? "—",
        "Estado":           EST_LABEL[o.estado] ?? "—",
        "Fecha Solicitud":  formatFecha(o.fecha_solicitud),
        "Fecha Inicio":     formatFecha(s.fecha_inicio),
        "Fecha Término":    formatFecha(s.fecha_termino),
        "Horas Reales":     s.tiempo_real_hrs ?? 0,
      });
    });
  });

  const wb  = XLSX.utils.book_new();

  const ws1 = XLSX.utils.json_to_sheet(resumenTec);
  ws1["!cols"] = [{wch:14},{wch:32},{wch:20},{wch:26},{wch:18},{wch:18},{wch:18},{wch:14},{wch:16},{wch:16},{wch:14},{wch:18}];
  XLSX.utils.book_append_sheet(wb, ws1, "Resumen Técnicos");

  const ws2 = XLSX.utils.json_to_sheet(detalle);
  ws2["!cols"] = [{wch:32},{wch:10},{wch:30},{wch:28},{wch:20},{wch:14},{wch:14},{wch:14},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws2, "Detalle por Técnico");

  const nombre = `BWI_TOOLROOM_Tecnicos_${new Date().toISOString().slice(0,10)}.xlsx`;
  XLSX.writeFile(wb, nombre);
  return { ok: true, msg: `Reporte de ${tecs.length} técnicos exportado.` };
}

// ── Componente modal ─────────────────────────────────────────
export default function ExportarReportes({ onCerrar }) {
  const hoy    = new Date().toISOString().slice(0,10);
  const priMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);

  const [tipo, setTipo]         = useState("ordenes");
  const [fechaIni, setFechaIni] = useState(priMes);
  const [fechaFin, setFechaFin] = useState(hoy);
  const [usarFiltro, setUF]     = useState(true);
  const [exportando, setExp]    = useState(false);
  const [msg, setMsg]           = useState(null);

  const exportar = async () => {
    setExp(true); setMsg(null);
    const ini = usarFiltro ? fechaIni : null;
    const fin = usarFiltro ? fechaFin : null;
    const resultado = tipo === "ordenes"
      ? await exportarOrdenes(ini, fin)
      : await exportarTecnicos(ini, fin);
    setExp(false);
    setMsg(resultado);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onCerrar}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:480 }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:C.text, fontWeight:700, fontSize:16 }}>📊 Exportar reporte</div>
          <button onClick={onCerrar} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>

        <div style={{ padding:"22px" }}>

          {/* Tipo de reporte */}
          <div style={{ marginBottom:20 }}>
            <div style={{ color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Tipo de reporte</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                { v:"ordenes",  label:"📋 Órdenes de trabajo", desc:"Todas las órdenes con detalle completo" },
                { v:"tecnicos", label:"👷 Desempeño técnicos",  desc:"Horas, aprovechamiento y detalle por técnico" },
              ].map(op => (
                <div key={op.v} onClick={() => setTipo(op.v)} style={{ border:`1.5px solid ${tipo===op.v?C.accent:C.border}`, borderRadius:10, padding:"12px 14px", cursor:"pointer", background:tipo===op.v?C.accent+"11":"transparent" }}>
                  <div style={{ color:tipo===op.v?C.accent:C.text, fontWeight:700, fontSize:13, marginBottom:4 }}>{op.label}</div>
                  <div style={{ color:C.muted, fontSize:11 }}>{op.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de fechas */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div style={{ color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>Período</div>
              <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", marginLeft:"auto" }}>
                <input type="checkbox" checked={usarFiltro} onChange={e=>setUF(e.target.checked)} />
                <span style={{ color:C.muted, fontSize:12 }}>Filtrar por fechas</span>
              </label>
            </div>
            {usarFiltro ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <div style={{ color:C.textSub, fontSize:11, marginBottom:5 }}>Desde</div>
                  <input type="date" value={fechaIni} onChange={e=>setFechaIni(e.target.value)}
                    style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none" }} />
                </div>
                <div>
                  <div style={{ color:C.textSub, fontSize:11, marginBottom:5 }}>Hasta</div>
                  <input type="date" value={fechaFin} onChange={e=>setFechaFin(e.target.value)}
                    style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none" }} />
                </div>
              </div>
            ) : (
              <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.muted, fontSize:13 }}>
                Se exportarán todos los registros sin filtro de fecha.
              </div>
            )}
          </div>

          {/* Contenido del reporte */}
          <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
            <div style={{ color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>El archivo incluirá</div>
            {tipo === "ordenes" ? (
              <ul style={{ color:C.muted, fontSize:12, paddingLeft:16, lineHeight:2 }}>
                <li>Hoja 1: Todas las órdenes con 23 columnas de detalle</li>
                <li>Hoja 2: Resumen por estado y prioridad</li>
              </ul>
            ) : (
              <ul style={{ color:C.muted, fontSize:12, paddingLeft:16, lineHeight:2 }}>
                <li>Hoja 1: Resumen de desempeño por técnico (horas, aprovechamiento %)</li>
                <li>Hoja 2: Detalle de todas las órdenes realizadas por cada técnico</li>
              </ul>
            )}
          </div>

          {/* Mensaje resultado */}
          {msg && (
            <div style={{ background:msg.ok?C.success+"18":C.danger+"18", border:`1px solid ${msg.ok?C.success:C.danger}44`, borderRadius:8, padding:"10px 14px", color:msg.ok?C.success:C.danger, fontSize:13, marginBottom:16 }}>
              {msg.ok ? "✅ " : "❌ "}{msg.msg}
            </div>
          )}

          {/* Botones */}
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onCerrar} style={{ flex:1, background:C.border, color:C.text, border:"none", borderRadius:10, padding:"12px 0", cursor:"pointer", fontWeight:600, fontSize:14 }}>Cancelar</button>
            <button onClick={exportar} disabled={exportando} style={{ flex:2, background:exportando?C.border:C.success, color:exportando?C.muted:"#fff", border:"none", borderRadius:10, padding:"12px 0", cursor:exportando?"default":"pointer", fontWeight:700, fontSize:15 }}>
              {exportando ? "Generando Excel…" : "⬇️ Descargar Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
