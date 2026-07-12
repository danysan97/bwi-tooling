import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./lib/supabase";

const C = {
  bg: "#0F1117", surface: "#181C25", border: "#242935",
  accent: "#3B82F6", success: "#22C55E", danger: "#EF4444",
  muted: "#6B7280", text: "#F1F5F9", textSub: "#94A3B8",
};

const PRIORIDADES = {
  "1_seguridad": "1 - Seguridad",
  "2_queja_cliente": "2 - Queja de cliente",
  "3_maquina_parada": "3 - Máquina parada",
  "4_trabajo_rapido": "4 - Trabajo rápido",
  "5_fabricacion": "5 - Fabricación",
};
const ESTADOS = {
  nueva_orden: "Nueva",
  en_proceso: "En proceso",
  terminada: "Terminada",
  cancelada: "Cancelada",
};

const fecha = valor => valor ? new Date(`${String(valor).slice(0, 10)}T12:00:00`).toLocaleDateString("es-MX") : "—";
const fechaArchivo = () => new Date().toISOString().slice(0, 10);
const textoPeriodo = (inicio, fin) => inicio ? `${inicio} al ${fin || "hoy"}` : "Todos los registros";

function descargarLibro(libro, nombre) {
  XLSX.writeFile(libro, nombre, { compression: true });
}

function ajustarColumnas(hoja, anchos) {
  hoja["!cols"] = anchos.map(wch => ({ wch }));
}

async function obtenerOrdenes(inicio, fin) {
  let consulta = supabase.from("vista_ordenes").select("*").order("no_orden", { ascending: true });
  if (inicio) consulta = consulta.gte("fecha_solicitud", inicio);
  if (fin) consulta = consulta.lte("fecha_solicitud", `${fin}T23:59:59`);
  const { data, error } = await consulta;
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function exportarOrdenes(inicio, fin) {
  const ordenes = await obtenerOrdenes(inicio, fin);
  if (!ordenes.length) return { ok: false, msg: "No hay órdenes en el período seleccionado." };

  const detalle = ordenes.map(o => ({
    "No. orden": o.no_orden,
    "Fecha solicitud": fecha(o.fecha_solicitud),
    Solicitante: o.solicitante_nombre ?? "—",
    "No. empleado": o.solicitante_empleado ?? "—",
    Área: o.area_nombre ?? "—",
    Departamento: o.departamento ?? "—",
    Pieza: o.nombre_pieza ?? "—",
    "S.E.T.C.": o.setc_numero ?? "—",
    "No. plano": o.no_plano ?? "—",
    "No. máquina": o.no_maquina ?? "—",
    Cantidad: o.cantidad ?? 0,
    Descripción: o.descripcion ?? "—",
    Prioridad: PRIORIDADES[o.prioridad] ?? o.prioridad ?? "—",
    Estado: ESTADOS[o.estado] ?? o.estado ?? "—",
    Técnico: o.tecnico_nombre ?? "Sin asignar",
    Material: o.material_usado ?? "—",
    "Fecha inicio": fecha(o.fecha_inicio),
    "Fecha término": fecha(o.fecha_termino),
    "Horas reales": Number(o.tiempo_real_hrs ?? 0),
    "Comentarios taller": o.comentarios ?? "—",
    "Orden manual": o.es_orden_manual ? "Sí" : "No",
    Autorización: o.autorizada === true ? "Autorizada" : o.autorizada === false ? "Rechazada" : "Pendiente",
  }));

  const resumen = [
    ["REPORTE DE ÓRDENES — BWI TOOLING"],
    ["Período", textoPeriodo(inicio, fin)],
    ["Generado", new Date().toLocaleString("es-MX")],
    [],
    ["Indicador", "Cantidad"],
    ["Total", detalle.length],
    ...Object.entries(ESTADOS).map(([clave, nombre]) => [nombre, ordenes.filter(o => o.estado === clave).length]),
    [],
    ["Prioridad", "Cantidad"],
    ...Object.entries(PRIORIDADES).map(([clave, nombre]) => [nombre, ordenes.filter(o => o.prioridad === clave).length]),
  ];

  const libro = XLSX.utils.book_new();
  const hojaDetalle = XLSX.utils.json_to_sheet(detalle);
  ajustarColumnas(hojaDetalle, [11, 16, 28, 14, 30, 22, 30, 14, 16, 14, 10, 42, 24, 15, 28, 20, 15, 16, 14, 32, 14, 16]);
  XLSX.utils.book_append_sheet(libro, hojaDetalle, "Órdenes");
  const hojaResumen = XLSX.utils.aoa_to_sheet(resumen);
  ajustarColumnas(hojaResumen, [30, 32]);
  XLSX.utils.book_append_sheet(libro, hojaResumen, "Resumen");
  descargarLibro(libro, `BWI_Tooling_Ordenes_${fechaArchivo()}.xlsx`);
  return { ok: true, msg: `${detalle.length} órdenes exportadas.` };
}

async function exportarTecnicos(inicio, fin) {
  const [ordenes, usuariosResult] = await Promise.all([
    obtenerOrdenes(inicio, fin),
    supabase.from("usuarios").select("id, no_empleado, nombre_completo, departamento, rol").eq("activo", true).eq("rol", "tecnico").order("nombre_completo"),
  ]);
  if (usuariosResult.error) throw new Error(usuariosResult.error.message);
  const tecnicos = usuariosResult.data ?? [];
  if (!tecnicos.length) return { ok: false, msg: "No hay técnicos activos registrados." };

  const perteneceAlTecnico = (orden, tecnico) =>
    (orden.tecnico_id && orden.tecnico_id === tecnico.id) ||
    (!orden.tecnico_id && orden.tecnico_nombre === tecnico.nombre_completo);

  const resumen = tecnicos.map(tecnico => {
    const asignadas = ordenes.filter(orden => perteneceAlTecnico(orden, tecnico));
    const horas = asignadas.reduce((total, orden) => total + Number(orden.tiempo_real_hrs ?? 0), 0);
    const terminadas = asignadas.filter(orden => orden.estado === "terminada").length;
    return {
      "No. empleado": tecnico.no_empleado ?? "—",
      Técnico: tecnico.nombre_completo,
      Departamento: tecnico.departamento ?? "—",
      "Órdenes asignadas": asignadas.length,
      "Órdenes terminadas": terminadas,
      "Horas registradas": Number(horas.toFixed(2)),
      "Promedio hrs/orden": asignadas.length ? Number((horas / asignadas.length).toFixed(2)) : 0,
    };
  });

  const detalle = ordenes
    .filter(orden => orden.tecnico_nombre)
    .map(orden => ({
      Técnico: orden.tecnico_nombre,
      "No. orden": orden.no_orden,
      Pieza: orden.nombre_pieza ?? "—",
      Solicitante: orden.solicitante_nombre ?? "—",
      Prioridad: PRIORIDADES[orden.prioridad] ?? orden.prioridad ?? "—",
      Estado: ESTADOS[orden.estado] ?? orden.estado ?? "—",
      "Fecha solicitud": fecha(orden.fecha_solicitud),
      "Fecha inicio": fecha(orden.fecha_inicio),
      "Fecha término": fecha(orden.fecha_termino),
      "Horas reales": Number(orden.tiempo_real_hrs ?? 0),
    }));

  const libro = XLSX.utils.book_new();
  const hojaResumen = XLSX.utils.json_to_sheet(resumen);
  ajustarColumnas(hojaResumen, [14, 32, 24, 18, 19, 18, 20]);
  XLSX.utils.book_append_sheet(libro, hojaResumen, "Resumen técnicos");
  const hojaDetalle = XLSX.utils.json_to_sheet(detalle);
  ajustarColumnas(hojaDetalle, [32, 12, 32, 30, 25, 16, 16, 16, 16, 16]);
  XLSX.utils.book_append_sheet(libro, hojaDetalle, "Detalle órdenes");
  descargarLibro(libro, `BWI_Tooling_Tecnicos_${fechaArchivo()}.xlsx`);
  return { ok: true, msg: `Reporte de ${tecnicos.length} técnicos exportado.` };
}

export default function ExportarReportes({ onCerrar }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
  const [tipo, setTipo] = useState("ordenes");
  const [inicio, setInicio] = useState(inicioMes);
  const [fin, setFin] = useState(hoy);
  const [filtrar, setFiltrar] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const exportar = async () => {
    if (filtrar && (!inicio || !fin || inicio > fin)) {
      setMensaje({ ok: false, msg: "Selecciona un período válido." });
      return;
    }
    setCargando(true);
    setMensaje(null);
    try {
      const resultado = tipo === "ordenes" ? await exportarOrdenes(filtrar ? inicio : null, filtrar ? fin : null) : await exportarTecnicos(filtrar ? inicio : null, filtrar ? fin : null);
      setMensaje(resultado);
    } catch (error) {
      console.error("Error al exportar:", error);
      setMensaje({ ok: false, msg: "No se pudo generar el reporte. Revisa los permisos de Supabase." });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onCerrar}>
      <div style={{ width: "100%", maxWidth: 500, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: `1px solid ${C.border}` }}>
          <strong style={{ color: C.text }}>Exportar reporte a Excel</strong>
          <button onClick={onCerrar} aria-label="Cerrar" style={{ background: "none", border: 0, color: C.muted, fontSize: 20, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: 22 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ id: "ordenes", titulo: "Órdenes de trabajo", texto: "Detalle completo y resumen" }, { id: "tecnicos", titulo: "Desempeño de técnicos", texto: "Horas y órdenes asignadas" }].map(opcion => (
              <button key={opcion.id} onClick={() => setTipo(opcion.id)} style={{ textAlign: "left", cursor: "pointer", padding: 14, color: tipo === opcion.id ? C.accent : C.text, background: tipo === opcion.id ? `${C.accent}11` : C.bg, border: `1px solid ${tipo === opcion.id ? C.accent : C.border}`, borderRadius: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{opcion.titulo}</div>
                <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{opcion.texto}</div>
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", color: C.textSub, fontSize: 13, cursor: "pointer", marginBottom: 12 }}><input type="checkbox" checked={filtrar} onChange={e => setFiltrar(e.target.checked)} /> Filtrar por fechas</label>
            {filtrar ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ color: C.textSub, fontSize: 12 }}>Desde<input type="date" value={inicio} onChange={e => setInicio(e.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 5, padding: "9px 10px", color: C.text, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }} /></label>
              <label style={{ color: C.textSub, fontSize: 12 }}>Hasta<input type="date" value={fin} onChange={e => setFin(e.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: 5, padding: "9px 10px", color: C.text, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8 }} /></label>
            </div> : <div style={{ padding: 12, color: C.muted, background: C.bg, borderRadius: 8, fontSize: 13 }}>Se exportarán todos los registros.</div>}
          </div>
          {mensaje && <div style={{ color: mensaje.ok ? C.success : C.danger, fontSize: 13, marginBottom: 14 }}>{mensaje.ok ? "✓ " : "× "}{mensaje.msg}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onCerrar} style={{ flex: 1, padding: 12, color: C.text, border: 0, borderRadius: 10, background: C.border, cursor: "pointer" }}>Cancelar</button>
            <button onClick={exportar} disabled={cargando} style={{ flex: 2, padding: 12, color: "#fff", border: 0, borderRadius: 10, background: cargando ? C.border : C.success, cursor: cargando ? "wait" : "pointer", fontWeight: 700 }}>{cargando ? "Generando…" : "Descargar Excel"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
