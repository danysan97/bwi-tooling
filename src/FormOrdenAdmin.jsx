import { useState, useRef, useEffect } from "react";
import { crearOrden, obtenerAreas, supabase } from "./lib/supabase";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
};

const PRIORIDADES = [
  { valor:"1_seguridad",      etiqueta:"1 — Seguridad",        desc:"Fabricación inmediata.",                          color:C.danger  },
  { valor:"2_queja_cliente",  etiqueta:"2 — Queja de cliente", desc:"Riesgo a la calidad. Agrega folio de queja.",     color:C.warn    },
  { valor:"3_maquina_parada", etiqueta:"3 — Máquina parada",   desc:"Trabajos espontáneos o recurrentes.",             color:"#F97316" },
  { valor:"4_trabajo_rapido", etiqueta:"4 — Trabajo rápido",   desc:"Menos de 2 hrs para fabricarlo.",                 color:C.accent  },
  { valor:"5_programado",     etiqueta:"5 — Programado",       desc:"Trabajo planeado con anticipación.",              color:"#8B5CF6" },
  { valor:"5_fabricacion",    etiqueta:"6 — Fabricación",      desc:"Se enviará a fabricar por proveedor externo.",    color:C.muted   },
];

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
  <div style={{ marginBottom:24 }}>
    <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, borderBottom:`1px solid ${C.border}`, paddingBottom:8, marginBottom:16 }}>{title}</div>
    {children}
  </div>
);
const Row = ({ children, cols=2 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:14, marginBottom:14 }}>{children}</div>
);

export default function FormOrdenAdmin({ usuario, onCerrar, onExito }) {
  const fileRef = useRef();
  const [areas, setAreas]     = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnv]    = useState(false);
  const [exito, setExito]     = useState(null);
  const [errores, setErr]     = useState({});

  const [form, setForm] = useState({
    nombre_pieza:"", setc_numero:"", no_plano:"", no_maquina:"",
    cantidad:"", descripcion:"", prioridad:"",
    depto: usuario.departamento || "",
    area_sel: usuario.area_codigo || "",
  });

  useEffect(() => { obtenerAreas().then(setAreas); }, []);

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErr(e => ({...e, [k]:""})); };

  const validar = () => {
    const e = {};
    if (!form.nombre_pieza.trim()) e.nombre_pieza = "Nombre de pieza obligatorio.";
    if (!form.descripcion.trim())  e.descripcion  = "Describe el trabajo.";
    if (!form.cantidad || isNaN(form.cantidad) || Number(form.cantidad) < 1) e.cantidad = "Cantidad inválida.";
    if (!form.prioridad)           e.prioridad    = "Selecciona una prioridad.";
    return e;
  };

  const enviar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErr(e); return; }
    setEnv(true);

    const { data, error } = await crearOrden({
      solicitante_id: usuario.id,
      nombre_pieza:   form.nombre_pieza,
      setc_numero:    form.setc_numero  || null,
      no_plano:       form.no_plano     || null,
      no_maquina:     form.no_maquina   || null,
      cantidad:       form.cantidad,
      descripcion:    form.descripcion,
      prioridad:      form.prioridad,
    }, archivo);

    setEnv(false);
    if (error) { setErr({ _global:"Error al enviar. Intenta de nuevo." }); return; }
    setExito(data.no_orden);
    setTimeout(() => { onExito(); }, 2000);
  };

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 20*1024*1024) { setErr(er => ({...er, archivo:"Máximo 20 MB."})); return; }
    setArchivo(f);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onCerrar}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:640, maxHeight:"92vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding:"16px 24px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:C.text, fontWeight:700, fontSize:17 }}>Nueva Orden de Trabajo</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{usuario.nombre_completo} · {usuario.no_empleado} · {usuario.departamento}</div>
          </div>
          <button onClick={onCerrar} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:20 }}>✕</button>
        </div>

        {exito ? (
          <div style={{ padding:48, textAlign:"center" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
            <div style={{ color:C.success, fontWeight:700, fontSize:18, marginBottom:8 }}>¡Orden enviada!</div>
            <div style={{ color:C.muted, fontSize:14 }}>Folio asignado:</div>
            <div style={{ color:C.accent, fontSize:36, fontWeight:900, marginTop:8 }}>#{exito}</div>
          </div>
        ) : (
          <div style={{ padding:"24px" }}>
            {errores._global && <div style={{ background:C.danger+"18", border:`1px solid ${C.danger}44`, borderRadius:8, padding:"10px 14px", color:C.danger, marginBottom:20, fontSize:13 }}>{errores._global}</div>}

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
              <div><Label>No. máquina / fixtura / equipo</Label><Input placeholder="Ej. MB0137, Shooter, Celda 10" value={form.no_maquina} onChange={e => set("no_maquina", e.target.value)} /></div>
            </Section>

            <Section title="Descripción del trabajo">
              <div style={{ marginBottom:14 }}>
                <Label required>Descripción detallada</Label>
                <Textarea rows={4} placeholder="Describe con suficiente detalle para que cualquier técnico pueda realizarlo…" value={form.descripcion} error={!!errores.descripcion} onChange={e => set("descripcion", e.target.value)} />
                <ErrMsg msg={errores.descripcion} />
              </div>
              <div>
                <Label>Plano / archivo adjunto</Label>
                <div onClick={() => fileRef.current.click()} style={{ border:`2px dashed ${archivo?C.success:C.border}`, borderRadius:10, padding:16, textAlign:"center", cursor:"pointer", background:archivo?C.success+"08":"transparent" }}
                  onMouseEnter={e => !archivo&&(e.currentTarget.style.borderColor=C.accent)}
                  onMouseLeave={e => !archivo&&(e.currentTarget.style.borderColor=C.border)}>
                  <input ref={fileRef} type="file" accept=".pdf,.dwg,.dxf,.doc,.docx,.png,.jpg" style={{ display:"none" }} onChange={onFile} />
                  {archivo
                    ? <div><div style={{ fontSize:20, marginBottom:4 }}>✅</div><div style={{ color:C.success, fontWeight:600, fontSize:13 }}>{archivo.name}</div></div>
                    : <div><div style={{ fontSize:24, marginBottom:4 }}>📎</div><div style={{ color:C.textSub, fontSize:13 }}>Adjuntar plano · PDF, DWG, Word, JPG · Máx. 20 MB</div></div>
                  }
                </div>
              </div>
            </Section>

            <Section title="Prioridad">
              <div style={{ display:"grid", gap:8, marginBottom:8 }}>
                {PRIORIDADES.map(p => (
                  <div key={p.valor} onClick={() => set("prioridad", p.valor)} style={{ border:`1.5px solid ${form.prioridad===p.valor?p.color:C.border}`, borderRadius:10, padding:"10px 16px", cursor:"pointer", background:form.prioridad===p.valor?p.color+"11":"transparent", display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, border:`2px solid ${form.prioridad===p.valor?p.color:C.border}`, background:form.prioridad===p.valor?p.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {form.prioridad===p.valor && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }} />}
                    </div>
                    <div>
                      <div style={{ color:form.prioridad===p.valor?p.color:C.text, fontWeight:700, fontSize:13 }}>{p.etiqueta}</div>
                      <div style={{ color:C.muted, fontSize:11, marginTop:1 }}>{p.desc}</div>
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
              <button onClick={onCerrar} style={{ flex:1, background:C.border, color:C.text, border:"none", borderRadius:10, padding:"13px 0", cursor:"pointer", fontWeight:600, fontSize:14 }}>Cancelar</button>
              <button onClick={enviar} disabled={enviando} style={{ flex:2, background:enviando?C.border:C.success, color:enviando?C.muted:"#fff", border:"none", borderRadius:10, padding:"13px 0", cursor:enviando?"default":"pointer", fontWeight:700, fontSize:15 }}>
                {enviando ? "Enviando…" : "Enviar orden →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
