import { useEffect, useRef } from "react";

// ── Colores BWI ──────────────────────────────────────────────
const BWI_BLUE   = "#1B3A6B";
const BWI_ORANGE = "#F5A623";
const GRAY_LIGHT = "#F5F5F5";
const GRAY_BORDER= "#CCCCCC";

const PRIO_LABEL = {
  "1_seguridad":      "1 — SEGURIDAD",
  "2_queja_cliente":  "2 — QUEJA DE CLIENTE",
  "3_maquina_parada": "3 — MÁQUINA PARADA",
  "4_trabajo_rapido": "4 — TRABAJO RÁPIDO",
  "5_fabricacion":    "5 — FABRICACIÓN",
};

const AREAS = {
  1401:"IAMM/FRHC SALARY INDIRECT",
  1403:"MRD/MRF SALARY INDIRECT",
  1407:"RTA (MR/PASIVE/BMW) SALARY INDIRECT",
  1410:"BI-STATE SALARY INDIRECT",
  1411:"INGENIERIA AMBIENTAL",
  1414:"MANTENIMIENTO PLANTA",
  1415:"TALLER MÁQUINAS Y HERRAMIENTAS",
  1421:"PASIVE TT/BMW SALARY INDIRECT",
  1440:"INGENIERÍA",
  1441:"NUEVOS PROYECTOS",
  1601:"RECURSOS HUMANOS",
};

// ── Celda de campo ───────────────────────────────────────────
const Campo = ({ label, value, flex=1, bold=false }) => (
  <div style={{ flex, padding:"4px 8px", borderRight:`1px solid ${GRAY_BORDER}` }}>
    <div style={{ fontSize:7, color:"#666", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</div>
    <div style={{ fontSize:11, fontWeight:bold?"700":"400", minHeight:16, marginTop:2 }}>{value || ""}</div>
  </div>
);

// ── Fila de campos ───────────────────────────────────────────
const Fila = ({ children, borderBottom=true }) => (
  <div style={{ display:"flex", borderBottom:borderBottom?`1px solid ${GRAY_BORDER}`:"none" }}>
    {children}
  </div>
);

export default function ImprimirOrden({ orden, onCerrar }) {
  const printRef = useRef();

  const imprimir = () => {
    const contenido = printRef.current.innerHTML;
    const ventana = window.open("", "_blank");
    ventana.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Orden #${orden.no_orden} — BWI TOOLROOM</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          body { font-family: Arial, sans-serif; font-size:11px; }
          @page { size: letter; margin: 10mm; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>${contenido}</body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    setTimeout(() => { ventana.print(); ventana.close(); }, 500);
  };

  const fecha = orden.fecha_solicitud ? new Date(orden.fecha_solicitud).toLocaleDateString("es-MX") : "";
  const area  = orden.area_codigo ? `${orden.area_codigo} — ${AREAS[orden.area_codigo] ?? ""}` : (orden.area_nombre ?? "");

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000bb", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:12, width:"100%", maxWidth:780, maxHeight:"95vh", overflowY:"auto", boxShadow:"0 20px 60px #00000066" }}>

        {/* Controles */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", borderBottom:"1px solid #eee", background:"#f9f9f9", borderRadius:"12px 12px 0 0" }}>
          <span style={{ fontWeight:700, fontSize:14, color:"#333" }}>Vista previa — Orden #{orden.no_orden}</span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={imprimir} style={{ background:BWI_BLUE, color:"#fff", border:"none", borderRadius:8, padding:"8px 20px", fontWeight:700, cursor:"pointer", fontSize:13 }}>
              🖨️ Imprimir
            </button>
            <button onClick={onCerrar} style={{ background:"#eee", color:"#555", border:"none", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:13 }}>
              ✕ Cerrar
            </button>
          </div>
        </div>

        {/* Hoja imprimible */}
        <div ref={printRef} style={{ padding:20, fontFamily:"Arial, sans-serif", fontSize:11, color:"#000" }}>

          {/* Encabezado */}
          <div style={{ display:"flex", alignItems:"center", marginBottom:8 }}>
            {/* Logo BWI */}
            <div style={{ background:BWI_BLUE, color:"#fff", fontWeight:900, fontSize:18, padding:"8px 16px", letterSpacing:2, marginRight:12, borderRadius:4 }}>
              BWI
            </div>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ fontSize:15, fontWeight:700, color:BWI_BLUE, textTransform:"uppercase", letterSpacing:1 }}>
                ORDEN DE TRABAJO PARA TALLER
              </div>
              <div style={{ fontSize:9, color:"#666", marginTop:2 }}>TOOLROOM — TALLER MÁQUINAS Y HERRAMIENTAS</div>
            </div>
            <div style={{ textAlign:"right", fontSize:9, color:"#666" }}>
              <div style={{ fontWeight:700, fontSize:13, color:BWI_BLUE }}>No. Orden: #{orden.no_orden}</div>
              <div>F-1100.C.03-02</div>
              <div>Rev. 06</div>
            </div>
          </div>

          {/* Cuerpo principal */}
          <div style={{ border:`2px solid ${BWI_BLUE}`, borderRadius:4, overflow:"hidden" }}>

            {/* Fila 1: Solicitante + No. Empleado + Área + Depto */}
            <Fila>
              <Campo label="Solicitante" value={orden.solicitante_nombre} flex={3} />
              <Campo label="No. de empleado" value={orden.solicitante_empleado} flex={1} />
              <Campo label="Área" value={area} flex={2} />
              <Campo label="Departamento" value={orden.departamento} flex={2} />
            </Fila>

            {/* Fila 2: Fecha + Prioridad */}
            <Fila>
              <Campo label="Fecha de solicitud" value={fecha} flex={2} />
              <Campo label="Prioridad" value={PRIO_LABEL[orden.prioridad]} bold flex={4} />
              {(orden.prioridad === "2_queja_cliente") && (
                <Campo label="Folio de queja" value={orden.folio_queja || "___________"} flex={2} />
              )}
            </Fila>

            {/* Fila 3: Nombre pieza + SETC + No plano + Cantidad */}
            <div style={{ background:GRAY_LIGHT, padding:"3px 8px", fontSize:8, fontWeight:700, color:BWI_BLUE, textTransform:"uppercase", borderBottom:`1px solid ${GRAY_BORDER}` }}>
              DATOS DE LA PIEZA
            </div>
            <Fila>
              <Campo label="Nombre de la pieza" value={orden.nombre_pieza} bold flex={4} />
              <Campo label="S.E.T.C. #" value={orden.setc_numero} flex={2} />
              <Campo label="No. de plano" value={orden.no_plano} flex={2} />
              <Campo label="Cantidad" value={orden.cantidad} flex={1} />
            </Fila>

            {/* Fila 4: No. máquina + Línea/Celda */}
            <Fila>
              <Campo label="No. de máquina / Fixtura / Equipo" value={orden.no_maquina} flex={3} />
              <Campo label="Línea / Celda" value={orden.linea_celda || "—"} flex={2} />
              <div style={{ flex:4, padding:"4px 8px", borderRight:`1px solid ${GRAY_BORDER}` }}>
                <div style={{ fontSize:7, color:"#666", textTransform:"uppercase", letterSpacing:0.5 }}>Autorización urgencia</div>
                <div style={{ fontSize:11, minHeight:16, marginTop:2 }}>{orden.autorizada === true ? "✅ AUTORIZADA" : orden.autorizada === false ? "❌ RECHAZADA" : "___________________________"}</div>
                {orden.autorizada === true && orden.autorizado_por_nombre && (
                  <div style={{ fontSize:9, color:"#333", marginTop:2 }}>Autorizado por: {orden.autorizado_por_nombre}{orden.autorizado_por_puesto ? ` — ${orden.autorizado_por_puesto}` : ""}</div>
                )}
                {orden.autorizada === false && orden.motivo_rechazo && (
                  <div style={{ fontSize:9, color:"#c00", marginTop:2 }}>Motivo: {orden.motivo_rechazo}</div>
                )}
              </div>
            </Fila>

            {/* Descripción del trabajo */}
            <div style={{ background:GRAY_LIGHT, padding:"3px 8px", fontSize:8, fontWeight:700, color:BWI_BLUE, textTransform:"uppercase", borderBottom:`1px solid ${GRAY_BORDER}`, borderTop:`1px solid ${GRAY_BORDER}` }}>
              DESCRIPCIÓN DEL TRABAJO A REALIZAR
            </div>
            <div style={{ padding:"6px 8px", minHeight:60, borderBottom:`1px solid ${GRAY_BORDER}`, fontSize:11, lineHeight:1.5 }}>
              {orden.descripcion}
            </div>

            {/* Sección del taller */}
            <div style={{ background:BWI_BLUE, padding:"3px 8px", fontSize:8, fontWeight:700, color:"#fff", textTransform:"uppercase" }}>
              PARA SER LLENADO POR ENCARGADO DEL TALLER
            </div>
            <Fila>
              <Campo label="Fecha inicio" value={orden.fecha_inicio || ""} flex={2} />
              <Campo label="Fecha término" value={orden.fecha_termino || ""} flex={2} />
              <Campo label="Horas totales" value={orden.tiempo_real_hrs || ""} flex={2} />
              <Campo label="Técnico(s) que realizó" value={orden.tecnico_nombre || ""} flex={3} />
            </Fila>
            <Fila>
              <Campo label="Material utilizado" value={orden.material_usado || ""} flex={4} />
              <Campo label="Estado" value={orden.estado === "terminada" ? (orden.entregada ? "✅ TERMINADA / ENTREGADA" : "✅ TERMINADA — Pendiente de entrega") : orden.estado === "en_proceso" ? "🔧 EN PROCESO" : orden.estado === "cancelada" ? "❌ CANCELADA" : "🆕 NUEVA"} flex={2} />
            </Fila>

            {/* Comentarios */}
            <div style={{ padding:"6px 8px", minHeight:40, borderTop:`1px solid ${GRAY_BORDER}`, fontSize:11 }}>
              <span style={{ fontSize:8, color:"#666", textTransform:"uppercase" }}>Comentarios: </span>
              {orden.comentarios || ""}
            </div>

            {/* Firmas */}
            <div style={{ background:GRAY_LIGHT, borderTop:`1px solid ${GRAY_BORDER}` }}>
              <Fila borderBottom={false}>
                <div style={{ flex:1, padding:"12px 8px", borderRight:`1px solid ${GRAY_BORDER}`, textAlign:"center" }}>
                  <div style={{ borderTop:"1px solid #000", marginTop:24, paddingTop:4, fontSize:9, color:"#666" }}>Firma Gerente Tool Room / Autorización urgencia</div>
                </div>
                <div style={{ flex:1, padding:"12px 8px", textAlign:"center" }}>
                  <div style={{ borderTop:"1px solid #000", marginTop:24, paddingTop:4, fontSize:9, color:"#666" }}>Firma Conformidad del Solicitante</div>
                </div>
              </Fila>
            </div>

          </div>

          {/* Pie */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:8, color:"#999" }}>
            <span>F-1100.C.03-02 Rev. 06 — Fecha de última rev.: 26 agosto 2024</span>
            <span>BWI Group — Departamento de TOOLROOM</span>
            <span>Impreso: {new Date().toLocaleDateString("es-MX")}</span>
          </div>

          {/* Leyendas */}
          <div style={{ marginTop:8, padding:"6px 10px", border:`1px solid ${GRAY_BORDER}`, borderRadius:4, fontSize:8, color:"#555", lineHeight:1.6 }}>
            <strong>PRIORIDADES:</strong> 1-Seguridad (fabricación inmediata) · 2-Queja de cliente (agregar folio) · 3-Máquina parada · 4-Trabajo rápido (menos de 2 hrs) · 5-Fabricación (proveedor externo)<br/>
            <strong>REGLAS:</strong> Sin papeleta no se hará trabajo · No se hacen ajustes de proveedor externo · Si la línea de producción no está detenida, no se tomará como prioridad 3
          </div>

        </div>
      </div>
    </div>
  );
}
