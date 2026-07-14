import { useState, useRef, useEffect } from "react";
import { crearOrden, obtenerMisOrdenes, obtenerAreas, supabase, cargarHistorial, parseFechaUTC } from "./lib/supabase";
import ImprimirOrden from "./ImprimirOrden.jsx";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
};

const PRIORIDADES = [
  { valor:"1_seguridad",      etiqueta:"1 — Seguridad",        desc:"Fabricación inmediata. No trabajo de largo desarrollo.",   color:C.danger  },
  { valor:"2_queja_cliente",  etiqueta:"2 — Queja de cliente", desc:"Riesgo a la calidad. Agrega folio de queja.",             color:C.warn    },
  { valor:"3_maquina_parada", etiqueta:"3 — Máquina parada",   desc:"Trabajos espontáneos o recurrentes no previstos.",        color:"#F97316" },
  { valor:"4_trabajo_rapido", etiqueta:"4 — Trabajo rápido",   desc:"El tooling considera menos de 2 hrs para fabricarlo.",    color:C.accent  },
  { valor:"5_fabricacion",    etiqueta:"5 — Fabricación",      desc:"Se enviará a fabricar por proveedor externo.",            color:C.muted   },
];

const ESTADO_COLOR = { nueva_orden:C.accent, en_proceso:C.warn, terminada:C.success, cancelada:C.muted };
const ESTADO_LABEL = { nueva_orden:"Nueva", en_proceso:"En proceso", terminada:"Terminada", cancelada:"Cancelada" };
const PRIO_COLOR   = { "1_seguridad":C.danger,"2_queja_cliente":C.warn,"3_maquina_parada":"#F97316","4_trabajo_rapido":C.accent,"5_fabricacion":C.muted };
const PRIO_LABEL   = { "1_seguridad":"Seguridad","2_queja_cliente":"Queja","3_maquina_parada":"Máq. parada","4_trabajo_rapido":"Rápido","5_fabricacion":"Fabricación" };

const Label = ({ children, required }) => (
  <label style={{ display:"block", color:C.textSub, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
    {children}{required && <span style={{ color:C.danger, marginLeft:3 }}>*</span>}
  </label>
);
const Input = ({ error, ...props }) => (
  <input {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${error?C.danger:C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", ...props.style }}
    onFocus={e => e.target.style.borderColor=C.accent}
    onBlur={e => e.target.style.borderColor=error?C.danger:C.border} />
);
const Textarea = ({ error, ...props }) => (
  <textarea {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${error?C.danger:C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", resize:"vertical", minHeight:90, fontFamily:"inherit" }}
    onFocus={e => e.target.style.borderColor=C.accent}
    onBlur={e => e.target.style.borderColor=error?C.danger:C.border} />
);
const ErrMsg = ({ msg }) => msg ? <div style={{ color:C.danger, fontSize:12, marginTop:4 }}>{msg}</div> : null;
const Section = ({ title, children }) => (
  <div style={{ marginBottom:28 }}>
    <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:18 }}>{title}</div>
    {children}
  </div>
);
const Row = ({ children, cols=2 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:14, marginBottom:14 }}>{children}</div>
);
const Logo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
    <div style={{ width:5, height:28, background:C.accent, borderRadius:3 }} />
    <div>
      <div style={{ fontWeight:800, fontSize:16, color:C.text }}>BWI — TOOLROOM</div>
      <div style={{ color:C.muted, fontSize:11 }}>Portal de Órdenes de Trabajo</div>
    </div>
  </div>
);

function MisOrdenes({ usuario, onNueva, onSalir }) {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoad]    = useState(true);
  const [ordenSel, setOS]     = useState(null);
  const [imprimiendo, setImp] = useState(false);
  const [historial, setHistorial] = useState([]);

  const cargar = () => {
    setLoad(true);
    obtenerMisOrdenes(usuario.id).then(({ data }) => { setOrdenes(data ?? []); setLoad(false); });
  };

  useEffect(() => { cargar(); }, [usuario.id]);

  useEffect(() => {
    if (ordenSel) cargarHistorial(ordenSel.no_orden).then(({ data }) => setHistorial(data ?? []));
    else setHistorial([]);
  }, [ordenSel]);

  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:24 }}>
      <div style={{ maxWidth:720, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:10 }}>
          <Logo />
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ color:C.muted, fontSize:13 }}>{usuario.nombre_completo} · {usuario.no_empleado}</span>
            <button onClick={cargar} style={{ background:C.border, color:C.textSub, border:"none", borderRadius:10, padding:"9px 12px", fontSize:13, cursor:"pointer" }} title="Actualizar">🔄</button>
            <button onClick={onNueva} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Nueva orden</button>
            <button onClick={onSalir} style={{ background:C.border, color:C.muted, border:"none", borderRadius:10, padding:"9px 14px", fontSize:13, cursor:"pointer" }}>Salir</button>
          </div>
        </div>
        <div style={{ color:C.text, fontWeight:700, fontSize:16, marginBottom:14 }}>Mis órdenes</div>
        {loading
          ? <div style={{ textAlign:"center", padding:60, color:C.muted }}>Cargando…</div>
          : ordenes.length === 0
            ? <div style={{ textAlign:"center", padding:60, color:C.muted }}>Aún no tienes órdenes. ¡Crea la primera!</div>
            : ordenes.map(o => (
              <div key={o.no_orden} onClick={() => setOS(o)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px", marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10, cursor:"pointer" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <span style={{ color:C.accent, fontWeight:700, fontSize:15 }}>#{o.no_orden}</span>
                    <span style={{ background:PRIO_COLOR[o.prioridad]+"22", color:PRIO_COLOR[o.prioridad], border:`1px solid ${PRIO_COLOR[o.prioridad]}55`, borderRadius:6, padding:"1px 8px", fontSize:11, fontWeight:600 }}>{PRIO_LABEL[o.prioridad]}</span>
                  </div>
                  <div style={{ color:C.text, fontWeight:600, marginBottom:2 }}>{o.nombre_pieza}</div>
                  <div style={{ color:C.muted, fontSize:12 }}>{o.fecha_solicitud?.slice(0,10)} · Técnico: {o.tecnico_nombre ?? "Pendiente"}</div>
                </div>
                <span style={{ background:(o.estado==="terminada"&&o.entregada?"#8B5CF6":ESTADO_COLOR[o.estado])+"22", color:o.estado==="terminada"&&o.entregada?"#8B5CF6":ESTADO_COLOR[o.estado], border:`1px solid ${(o.estado==="terminada"&&o.entregada?"#8B5CF6":ESTADO_COLOR[o.estado])}55`, borderRadius:8, padding:"6px 14px", fontSize:13, fontWeight:700 }}>{o.estado==="terminada"&&o.entregada?"Entregada":ESTADO_LABEL[o.estado]}</span>
              </div>
            ))
        }
      </div>

      {/* Modal detalle */}
      {ordenSel && (
        <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={() => setOS(null)}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:28, width:"100%", maxWidth:540, maxHeight:"90vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", marginBottom:20 }}>
              <div>
                <div style={{ color:C.muted, fontSize:12 }}>ORDEN #{ordenSel.no_orden}</div>
                <div style={{ color:C.text, fontSize:20, fontWeight:700 }}>{ordenSel.nombre_pieza}</div>
              </div>
              <button onClick={() => setOS(null)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:20 }}>✕</button>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
              <span style={{ background:(ordenSel.estado==="terminada"&&ordenSel.entregada?"#8B5CF6":ESTADO_COLOR[ordenSel.estado])+"22", color:ordenSel.estado==="terminada"&&ordenSel.entregada?"#8B5CF6":ESTADO_COLOR[ordenSel.estado], border:`1px solid ${(ordenSel.estado==="terminada"&&ordenSel.entregada?"#8B5CF6":ESTADO_COLOR[ordenSel.estado])}55`, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{ordenSel.estado==="terminada"&&ordenSel.entregada?"Entregada":ESTADO_LABEL[ordenSel.estado]}</span>
              <span style={{ background:PRIO_COLOR[ordenSel.prioridad]+"22", color:PRIO_COLOR[ordenSel.prioridad], border:`1px solid ${PRIO_COLOR[ordenSel.prioridad]}55`, borderRadius:6, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{PRIO_LABEL[ordenSel.prioridad]}</span>
              <button onClick={() => setImp(true)} style={{ background:"#1B3A6B", color:"#fff", border:"none", borderRadius:6, padding:"2px 10px", fontSize:12, cursor:"pointer" }}>🖨️ Imprimir</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[
                ["Fecha solicitud", ordenSel.fecha_solicitud?.slice(0,10)],
                ["Técnico", ordenSel.tecnico_nombre ?? "Sin asignar"],
                ["Área", ordenSel.area_nombre ?? "—"],
                ["Departamento", ordenSel.departamento ?? "—"],
                ["Línea / Celda", ordenSel.linea_celda ?? "—"],
                ["S.E.T.C. #", ordenSel.setc_numero || "—"],
                ["No. plano", ordenSel.no_plano || "—"],
                ["No. máquina", ordenSel.no_maquina || "—"],
                ["Cantidad", ordenSel.cantidad],
                ["Material", ordenSel.material_usado ?? "—"],
                ["Fecha inicio", ordenSel.fecha_inicio || "—"],
                ["Fecha término", ordenSel.fecha_termino || "—"],
                ["Tiempo real", ordenSel.tiempo_real_hrs ? `${ordenSel.tiempo_real_hrs} hrs` : "—"],
              ].map(([k,v]) => (
                <div key={k}><div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>{k}</div><div style={{ color:C.text, fontSize:14 }}>{v}</div></div>
              ))}
              <div style={{ gridColumn:"1/-1" }}>
                <div style={{ color:C.muted, fontSize:11, marginBottom:2 }}>Descripción</div>
                <div style={{ color:C.text, fontSize:14 }}>{ordenSel.descripcion}</div>
              </div>
            </div>

            {/* Historial */}
            <div style={{ marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
              <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Historial</div>
              {historial.length === 0 ? (
                <div style={{ color:C.muted, fontSize:12 }}>Sin eventos registrados.</div>
              ) : (
                <div style={{ position:"relative", paddingLeft:24 }}>
                  <div style={{ position:"absolute", left:8, top:0, bottom:0, width:2, background:C.border }} />
                  {historial.map((ev) => {
                    const icon = { recepcion:"📥", asignacion:"👤", inicio:"🔧", comentario:"💬", cambio_estado:"🔄", material:"🔩", terminado:"✅", entrega:"📦" }[ev.evento_tipo] ?? "📌";
                    const color = { recepcion:C.accent, asignacion:"#60A5FA", inicio:C.warn, comentario:"#A78BFA", cambio_estado:C.success, material:"#F59E0B", terminado:C.success, entrega:C.purple }[ev.evento_tipo] ?? C.muted;
                    const label = { recepcion:"Recepción", asignacion:"Asignación", inicio:"Inicio", comentario:"Comentario", cambio_estado:"Cambio de estado", material:"Material", terminado:"Terminado", entrega:"Entrega" }[ev.evento_tipo] ?? ev.evento_tipo;
                    const fecha = parseFechaUTC(ev.fecha_evento);
                    return (
                      <div key={ev.id} style={{ position:"relative", marginBottom:12 }}>
                        <div style={{ position:"absolute", left:-18, top:2, width:14, height:14, borderRadius:"50%", background:color+"22", border:`2px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, zIndex:1 }}>{icon}</div>
                        <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                            <span style={{ color, fontWeight:600, fontSize:11 }}>{label}</span>
                            <span style={{ color:C.muted, fontSize:10 }}>{fecha.toLocaleDateString("es-MX")} {fecha.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" })}</span>
                          </div>
                          {ev.detalle && <div style={{ color:C.textSub, fontSize:12 }}>{ev.detalle}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {imprimiendo && ordenSel && <ImprimirOrden orden={ordenSel} onCerrar={() => setImp(false)} />}
    </div>
  );
}

function FormOrden({ usuario, onExito, onCancelar }) {
  const fileRef = useRef();
  const [areas, setAreas]     = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnv]    = useState(false);
  const [errores, setErr]     = useState({});
  const esNombreGenerico      = usuario.nombre_completo?.startsWith("Empleado ");

  const [form, setForm] = useState({
    nombre_solicitante: esNombreGenerico ? "" : (usuario.nombre_completo ?? ""),
    nombre_pieza:"", setc_numero:"", no_plano:"", no_maquina:"",
    cantidad:"", descripcion:"", prioridad:"",
    depto: usuario.departamento || "",
    linea_celda: "",
    area_sel: usuario.area_codigo || "",
  });

  useEffect(() => { obtenerAreas().then(setAreas); }, []);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErr(e => ({...e, [k]:""})); };

  const validar = () => {
    const e = {};
    if (!form.nombre_solicitante.trim()) e.nombre_solicitante = "Ingresa tu nombre completo.";
    if (!form.nombre_pieza.trim())  e.nombre_pieza  = "Nombre de pieza obligatorio.";
    if (!form.descripcion.trim())   e.descripcion   = "Describe el trabajo.";
    if (!form.cantidad || isNaN(form.cantidad) || Number(form.cantidad) < 1) e.cantidad = "Cantidad inválida.";
    if (!form.prioridad)            e.prioridad     = "Selecciona una prioridad.";
    if (!form.depto.trim())         e.depto         = "Indica el departamento.";
    return e;
  };

  const enviar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErr(e); return; }
    setEnv(true);

    if (esNombreGenerico && form.nombre_solicitante.trim()) {
      await supabase.from('usuarios').update({
        nombre_completo: form.nombre_solicitante.trim(),
        area_codigo:     form.area_sel || null,
        departamento:    form.depto.trim(),
      }).eq('id', usuario.id);
    }

    const { data, error } = await crearOrden({
      solicitante_id: usuario.id,
      nombre_pieza:   form.nombre_pieza,
      linea_celda:    form.linea_celda  || null,
      setc_numero:    form.setc_numero,
      no_plano:       form.no_plano,
      no_maquina:     form.no_maquina,
      cantidad:       form.cantidad,
      descripcion:    form.descripcion,
      prioridad:      form.prioridad,
    }, archivo);

    setEnv(false);
    if (error) { setErr({ _global:"Error al enviar. Intenta de nuevo." }); return; }
    onExito(data.no_orden);
  };

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 20*1024*1024) { setErr(er => ({...er, archivo:"Máximo 20 MB."})); return; }
    setArchivo(f);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, padding:"24px 16px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <button onClick={onCancelar} style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:14 }}>← Volver</button>
          <div>
            <div style={{ color:C.text, fontWeight:700, fontSize:18 }}>Nueva Orden de Trabajo</div>
            <div style={{ color:C.muted, fontSize:12 }}>BWI TOOLROOM · {usuario.no_empleado}</div>
          </div>
        </div>

        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:28 }}>
          {errores._global && <div style={{ background:C.danger+"18", border:`1px solid ${C.danger}44`, borderRadius:8, padding:"10px 14px", color:C.danger, marginBottom:20, fontSize:13 }}>{errores._global}</div>}

          <Section title="Solicitante">
            {esNombreGenerico && (
              <div style={{ background:C.accent+"18", border:`1px solid ${C.accent}44`, borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:C.accent }}>
                👋 Primera orden — completa tu nombre y área antes de continuar.
              </div>
            )}
            <Row>
              <div>
                <Label required>Nombre completo</Label>
                <Input placeholder="Tu nombre completo" value={form.nombre_solicitante} error={!!errores.nombre_solicitante}
                  disabled={!esNombreGenerico} style={!esNombreGenerico?{color:C.muted}:{}}
                  onChange={e => set("nombre_solicitante", e.target.value)} />
                <ErrMsg msg={errores.nombre_solicitante} />
              </div>
              <div><Label>No. empleado</Label><Input value={usuario.no_empleado} disabled style={{ color:C.muted }} /></div>
            </Row>
            <Row>
              <div>
                <Label>Área</Label>
                <select value={form.area_sel} onChange={e => set("area_sel", e.target.value)}
                  style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none", cursor:"pointer" }}>
                  <option value="">— Seleccionar —</option>
                  {areas.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo} · {a.nombre}</option>)}
                </select>
              </div>
              <div>
                <Label required>Departamento</Label>
                <Input placeholder="Ej. Toolroom, Producción…" value={form.depto} error={!!errores.depto} onChange={e => set("depto", e.target.value)} />
                <ErrMsg msg={errores.depto} />
              </div>
            </Row>
            <div style={{ marginBottom:14 }}>
              <Label>Línea / Celda</Label>
              <Input placeholder="Ej. Línea 3, Celda 10, Shooter…" value={form.linea_celda} onChange={e => set("linea_celda", e.target.value)} />
            </div>
          </Section>

          <Section title="Datos de la pieza">
            <div style={{ marginBottom:14 }}>
              <Label required>Nombre completo de la pieza</Label>
              <Input placeholder="Ej. Buje de mesa x celda 5" value={form.nombre_pieza} error={!!errores.nombre_pieza} onChange={e => set("nombre_pieza", e.target.value)} />
              <ErrMsg msg={errores.nombre_pieza} />
            </div>
            <Row cols={3}>
              <div><Label>S.E.T.C. #</Label><Input placeholder="Ej. 3040798" value={form.setc_numero} onChange={e => set("setc_numero", e.target.value)} /></div>
              <div>
                <Label required>Cantidad</Label>
                <Input type="number" min="1" value={form.cantidad} error={!!errores.cantidad} onChange={e => set("cantidad", e.target.value)} />
                <ErrMsg msg={errores.cantidad} />
              </div>
              <div><Label>No. plano</Label><Input placeholder="M-0015-12-D07" value={form.no_plano} onChange={e => set("no_plano", e.target.value)} /></div>
            </Row>
            <div><Label>No. máquina / fixtura / equipo</Label><Input placeholder="Ej. MB0137" value={form.no_maquina} onChange={e => set("no_maquina", e.target.value)} /></div>
          </Section>

          <Section title="Descripción del trabajo">
            <div style={{ marginBottom:14 }}>
              <Label required>Descripción detallada</Label>
              <Textarea rows={4} placeholder="Describe con suficiente detalle…" value={form.descripcion} error={!!errores.descripcion} onChange={e => set("descripcion", e.target.value)} />
              <ErrMsg msg={errores.descripcion} />
            </div>
            <div>
              <Label>Plano / archivo adjunto</Label>
              <div onClick={() => fileRef.current.click()} style={{ border:`2px dashed ${archivo?C.success:C.border}`, borderRadius:10, padding:20, textAlign:"center", cursor:"pointer", background:archivo?C.success+"08":"transparent" }}
                onMouseEnter={e => !archivo&&(e.currentTarget.style.borderColor=C.accent)}
                onMouseLeave={e => !archivo&&(e.currentTarget.style.borderColor=C.border)}>
                <input ref={fileRef} type="file" accept=".pdf,.dwg,.dxf,.doc,.docx,.png,.jpg" style={{ display:"none" }} onChange={onFile} />
                {archivo
                  ? <div><div style={{ fontSize:22, marginBottom:4 }}>✅</div><div style={{ color:C.success, fontWeight:600, fontSize:14 }}>{archivo.name}</div><div style={{ color:C.muted, fontSize:12, marginTop:2 }}>Clic para cambiar</div></div>
                  : <div><div style={{ fontSize:28, marginBottom:6 }}>📎</div><div style={{ color:C.textSub, fontSize:14, fontWeight:600 }}>Adjuntar plano o documento</div><div style={{ color:C.muted, fontSize:12, marginTop:2 }}>PDF, DWG, DXF, Word, JPG · Máx. 20 MB</div></div>
                }
              </div>
            </div>
          </Section>

          <Section title="Prioridad">
            <div style={{ display:"grid", gap:8, marginBottom:8 }}>
              {PRIORIDADES.map(p => (
                <div key={p.valor} onClick={() => set("prioridad", p.valor)} style={{ border:`1.5px solid ${form.prioridad===p.valor?p.color:C.border}`, borderRadius:10, padding:"12px 16px", cursor:"pointer", background:form.prioridad===p.valor?p.color+"11":"transparent", display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", marginTop:2, flexShrink:0, border:`2px solid ${form.prioridad===p.valor?p.color:C.border}`, background:form.prioridad===p.valor?p.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {form.prioridad===p.valor && <div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }} />}
                  </div>
                  <div>
                    <div style={{ color:form.prioridad===p.valor?p.color:C.text, fontWeight:700, fontSize:14 }}>{p.etiqueta}</div>
                    <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <ErrMsg msg={errores.prioridad} />
            {(form.prioridad==="1_seguridad"||form.prioridad==="2_queja_cliente") && (
              <div style={{ background:C.warn+"18", border:`1px solid ${C.warn}55`, borderRadius:8, padding:"10px 14px", fontSize:13, color:C.warn, marginTop:8 }}>
                ⚠️ Las urgencias deben ser autorizadas por Gerencia de Mantenimiento.
              </div>
            )}
          </Section>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={onCancelar} style={{ flex:1, background:C.border, color:C.text, border:"none", borderRadius:10, padding:"13px 0", cursor:"pointer", fontWeight:600, fontSize:14 }}>Cancelar</button>
            <button onClick={enviar} disabled={enviando} style={{ flex:2, background:enviando?C.border:C.accent, color:enviando?C.muted:"#fff", border:"none", borderRadius:10, padding:"13px 0", cursor:enviando?"default":"pointer", fontWeight:700, fontSize:15 }}>
              {enviando ? "Enviando…" : "Enviar orden de trabajo →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Exito({ folio, onVolver }) {
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ maxWidth:420, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
        <div style={{ color:C.text, fontWeight:800, fontSize:24, marginBottom:8 }}>¡Orden enviada!</div>
        <div style={{ color:C.muted, fontSize:14, marginBottom:28 }}>Tu orden fue registrada en BWI TOOLROOM.</div>
        <div style={{ background:C.surface, border:`2px solid ${C.accent}`, borderRadius:14, padding:"20px 0", marginBottom:28 }}>
          <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>NÚMERO DE ORDEN</div>
          <div style={{ color:C.accent, fontSize:42, fontWeight:900 }}>#{folio}</div>
        </div>
        <button onClick={onVolver} style={{ background:C.accent, color:"#fff", border:"none", borderRadius:10, padding:"13px 32px", fontWeight:700, fontSize:15, cursor:"pointer" }}>Ver mis órdenes</button>
      </div>
    </div>
  );
}

export default function PortalSolicitante({ usuario, onSalir }) {
  const [pantalla, setPantalla] = useState("ordenes");
  const [folio, setFolio]       = useState(null);

  if (pantalla === "ordenes") return <MisOrdenes usuario={usuario} onNueva={() => setPantalla("form")} onSalir={onSalir} />;
  if (pantalla === "form")    return <FormOrden  usuario={usuario} onExito={n => { setFolio(n); setPantalla("exito"); }} onCancelar={() => setPantalla("ordenes")} />;
  if (pantalla === "exito")   return <Exito folio={folio} onVolver={() => setPantalla("ordenes")} />;
}
