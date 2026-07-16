import { useState, useRef, useEffect } from "react";
import {
  obtenerSesion, cerrarSesion,
  crearOrden, obtenerAreas, obtenerTecnicos, obtenerMateriales,
  listarUsuarios, actualizarEstado, registrarEvento, supabase,
} from "./lib/supabase";

// ── Paleta ───────────────────────────────────────────────────
const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
};

const PRIORIDADES = [
  { valor:"1_seguridad",      label:"1 — Seguridad",        color:C.danger  },
  { valor:"2_queja_cliente",  label:"2 — Queja de cliente", color:C.warn    },
  { valor:"3_maquina_parada", label:"3 — Máquina parada",   color:"#F97316" },
  { valor:"4_trabajo_rapido", label:"4 — Trabajo rápido",   color:C.accent  },
  { valor:"5_fabricacion",    label:"5 — Fabricación",      color:C.muted   },
];

// ── Componentes base ─────────────────────────────────────────
const Label = ({ children, required }) => (
  <label style={{ display:"block", color:C.textSub, fontSize:12, fontWeight:600,
    textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
    {children}{required && <span style={{ color:C.danger, marginLeft:3 }}>*</span>}
  </label>
);
const Input = ({ error, ...props }) => (
  <input {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg,
    border:`1px solid ${error ? C.danger : C.border}`, borderRadius:8,
    padding:"10px 14px", color:C.text, fontSize:14, outline:"none", ...props.style }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = error ? C.danger : C.border} />
);
const Select = ({ children, error, ...props }) => (
  <select {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg,
    border:`1px solid ${error ? C.danger : C.border}`, borderRadius:8,
    padding:"10px 14px", color:C.text, fontSize:14, outline:"none", cursor:"pointer", ...props.style }}>
    {children}
  </select>
);
const Textarea = ({ error, ...props }) => (
  <textarea {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg,
    border:`1px solid ${error ? C.danger : C.border}`, borderRadius:8,
    padding:"10px 14px", color:C.text, fontSize:14, outline:"none",
    resize:"vertical", minHeight:80, fontFamily:"inherit" }}
    onFocus={e => e.target.style.borderColor = C.accent}
    onBlur={e => e.target.style.borderColor = error ? C.danger : C.border} />
);
const ErrMsg = ({ msg }) => msg
  ? <div style={{ color:C.danger, fontSize:12, marginTop:4 }}>{msg}</div> : null;

const Section = ({ title, subtitle, children }) => (
  <div style={{ marginBottom:28 }}>
    <div style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:10, marginBottom:18 }}>
      <div style={{ color:C.muted, fontSize:11, fontWeight:700,
        textTransform:"uppercase", letterSpacing:1.5 }}>{title}</div>
      {subtitle && <div style={{ color:C.textSub, fontSize:12, marginTop:3 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);
const Row = ({ children, cols=2 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`,
    gap:14, marginBottom:14 }}>{children}</div>
);

// ── Buscador de solicitante ───────────────────────────────────
function BuscadorSolicitante({ usuarios, onSeleccionar, seleccionado }) {
  const [query, setQuery]   = useState(seleccionado ? `${seleccionado.no_empleado} — ${seleccionado.nombre_completo}` : "");
  const [abierto, setAb]    = useState(false);

  const filtrados = query.length > 0
    ? usuarios.filter(u =>
        u.no_empleado.includes(query) ||
        u.nombre_completo.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const elegir = u => {
    setQuery(`${u.no_empleado} — ${u.nombre_completo}`);
    setAb(false);
    onSeleccionar(u);
  };

  return (
    <div style={{ position:"relative" }}>
      <Input
        placeholder="Busca por nombre o número de empleado…"
        value={query}
        onChange={e => { setQuery(e.target.value); setAb(true); onSeleccionar(null); }}
        onFocus={() => setAb(true)}
        autoComplete="off"
      />
      {abierto && filtrados.length > 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50,
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", boxShadow:"0 8px 24px #00000066" }}>
          {filtrados.map(u => (
            <div key={u.id} onClick={() => elegir(u)}
              style={{ padding:"10px 14px", cursor:"pointer", borderBottom:`1px solid ${C.border}`,
                display:"flex", justifyContent:"space-between", alignItems:"center" }}
              onMouseEnter={e => e.currentTarget.style.background = C.accent+"18"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div>
                <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>{u.nombre_completo}</div>
                <div style={{ color:C.muted, fontSize:12 }}>{u.departamento ?? "—"}</div>
              </div>
              <span style={{ color:C.accent, fontWeight:700, fontSize:13 }}>{u.no_empleado}</span>
            </div>
          ))}
        </div>
      )}
      {abierto && query.length > 1 && filtrados.length === 0 && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50,
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:10,
          padding:"14px", color:C.muted, fontSize:13 }}>
          No encontrado. Puedes capturar el nombre manualmente abajo.
        </div>
      )}
    </div>
  );
}

// ── Formulario de captura manual ──────────────────────────────
function FormCaptura({ usuario, onExito }) {
  const fileRef   = useRef();
  const [usuarios, setUsuarios]           = useState([]);
  const [areas, setAreas]                 = useState([]);
  const [tecnicos, setTecnicos]           = useState([]);
  const [materiales, setMateriales]       = useState([]);
  const [solicitante, setSolicitante]     = useState(null); // usuario seleccionado del sistema
  const [archivo, setArchivo]             = useState(null);
  const [enviando, setEnv]                = useState(false);
  const [errores, setErr]                 = useState({});

  // Campos del formulario
  const [form, setForm] = useState({
    // Solicitante (manual si no está en sistema)
    nombre_manual:   "",
    empleado_manual: "",
    area_manual:     "",
    depto_manual:    "",
    // Pieza
    nombre_pieza:    "",
    setc_numero:     "",
    no_plano:        "",
    no_maquina:      "",
    cantidad:        "1",
    descripcion:     "",
    prioridad:       "",
    // Fechas
    folio_manual:    "",
    fecha_original:  new Date().toISOString().slice(0,10),
    fecha_inicio:    "",
    fecha_termino:   "",
    // Asignación y cierre
    tecnicos:         [{ tecnico_id: "", tiempo_real_hrs: "" }],
    material_id:     "",
    material_otro:   "",
    entregada:       false,
    comentarios:     "",
  });

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErr(e => ({...e, [k]:""})); };

  const agregarTecnico = () => {
    setForm(f => ({...f, tecnicos: [...f.tecnicos, { tecnico_id: "", tiempo_real_hrs: "" }]}));
  };
  const quitarTecnico = (idx) => {
    setForm(f => ({...f, tecnicos: f.tecnicos.filter((_, i) => i !== idx)}));
  };
  const actualizarTec = (idx, campo, valor) => {
    setForm(f => ({...f, tecnicos: f.tecnicos.map((t, i) => i === idx ? {...t, [campo]: valor} : t)}));
  };

  useEffect(() => {
    Promise.all([listarUsuarios(), obtenerAreas(), obtenerTecnicos(), obtenerMateriales()])
      .then(([{ data }, areasData, tecnicosData, materialesData]) => {
        setUsuarios(data ?? []);
        setAreas(areasData);
        setTecnicos(tecnicosData);
        setMateriales(materialesData);
      });
  }, []);

  const validar = () => {
    const e = {};
    // Solicitante: debe venir del sistema O tener nombre + empleado manual
    if (!solicitante && !form.nombre_manual.trim())   e.nombre_manual   = "Ingresa el nombre del solicitante.";
    if (!solicitante && !form.empleado_manual.trim()) e.empleado_manual = "Ingresa el número de empleado.";
    if (!form.nombre_pieza.trim())  e.nombre_pieza  = "Nombre de pieza obligatorio.";
    if (!form.descripcion.trim())   e.descripcion   = "Descripción obligatoria.";
    if (!form.cantidad || isNaN(form.cantidad) || Number(form.cantidad) < 1) e.cantidad = "Cantidad inválida.";
    if (!form.prioridad)            e.prioridad     = "Selecciona una prioridad.";
    if (!form.folio_manual || isNaN(form.folio_manual)) e.folio_manual = "Ingresa el número de folio de la papeleta.";
    if (!form.fecha_original)       e.fecha_original = "Ingresa la fecha de la orden original.";
    if (form.fecha_termino && !form.fecha_inicio) e.fecha_inicio = "Si hay fecha de término, también debes indicar la fecha de inicio.";
    if (form.fecha_termino && form.fecha_inicio && form.fecha_termino < form.fecha_inicio) e.fecha_termino = "La fecha de término no puede ser anterior a la de inicio.";
    if (!form.tecnicos.some(t => t.tecnico_id))  e.tecnico_id = "Asigna al menos un técnico.";
    if (form.entregada && !form.fecha_termino) e.entregada = "Para marcar como entregada, debes indicar fecha de término.";
    return e;
  };

  const enviar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErr(e); return; }

    setEnv(true);

    const solicitanteId = solicitante?.id ?? usuario.id;

    const nombreEditado   = solicitante && form.nombre_manual && form.nombre_manual !== solicitante.nombre_completo;
    const empleadoEditado = solicitante && form.empleado_manual && form.empleado_manual !== solicitante.no_empleado;

    let descripcionFinal = form.descripcion;
    if (nombreEditado || empleadoEditado) {
      const nombre   = form.nombre_manual.trim()   || solicitante.nombre_completo;
      const empleado = form.empleado_manual.trim()  || solicitante.no_empleado;
      const depto    = form.depto_manual || form.area_manual || "";
      descripcionFinal = `[DATOS EDITADOS — Solicitante: ${nombre} / Emp. ${empleado}${depto ? " / " + depto : ""}]\n\n${form.descripcion}`;
    } else if (!solicitante) {
      const nombre   = form.nombre_manual.trim();
      const empleado = form.empleado_manual.trim();
      const depto    = form.depto_manual || form.area_manual || "";
      descripcionFinal = `[ORDEN MANUAL — Solicitante: ${nombre} / Emp. ${empleado}${depto ? " / " + depto : ""}]\n\n${form.descripcion}`;
    }

    const { data, error } = await crearOrden({
      solicitante_id:   solicitanteId,
      nombre_pieza:     form.nombre_pieza,
      setc_numero:      form.setc_numero   || null,
      no_plano:         form.no_plano      || null,
      no_maquina:       form.no_maquina    || null,
      cantidad:         form.cantidad,
      descripcion:      descripcionFinal,
      prioridad:        form.prioridad,
      es_orden_manual:  true,
      capturado_por_id: usuario.id,
      folio_manual:     form.folio_manual,
    }, archivo);

    if (error || !data) { setEnv(false); setErr({ _global:"Error al guardar. Intenta de nuevo." }); return; }

    const noOrden = data.no_orden;

    // Convertir fechas a formato ISO (mediodía UTC para que se muestre correctamente en la zona local)
    const aISO = (f) => f ? new Date(f + "T12:00:00Z").toISOString() : null;

    const tieneInicio  = !!form.fecha_inicio;
    const tieneTermino = !!form.fecha_termino;

    // Calcular horas default si no se ingresaron individualmente
    const hrsCalc = tieneInicio && tieneTermino
      ? Math.round(((new Date(form.fecha_termino) - new Date(form.fecha_inicio)) / (1000 * 60 * 60)) * 10) / 10
      : null;

    // Material para el historial
    let nombreMaterial = null;
    if (form.material_id === "__otro__" && form.material_otro.trim()) {
      nombreMaterial = form.material_otro.trim();
    } else if (form.material_id && form.material_id !== "__otro__") {
      const mat = materiales.find(m => m.id === form.material_id);
      nombreMaterial = mat?.nombre ?? null;
    }

    // 1. Crear seguimiento_orden por cada técnico
    const tecnicosValidos = form.tecnicos.filter(t => t.tecnico_id);
    for (const tec of tecnicosValidos) {
      const horas = tec.tiempo_real_hrs ? Number(tec.tiempo_real_hrs) : hrsCalc;
      const { error: segErr } = await supabase.from("seguimiento_orden").insert({
        orden_id:        noOrden,
        tecnico_id:      tec.tecnico_id,
        fecha_inicio:    aISO(form.fecha_inicio),
        fecha_termino:   aISO(form.fecha_termino),
        tiempo_real_hrs: horas,
        material_id:     form.material_id !== "__otro__" ? form.material_id : null,
        material_otro:   form.material_id === "__otro__" ? form.material_otro.trim() : null,
        comentarios:     form.comentarios.trim() || null,
        actualizado_por: usuario.id,
      });
      if (segErr) console.error("Error creando seguimiento:", segErr);
    }

    // 2. Registrar eventos en historial (orden cronológica)
    // recepcion ya la registra crearOrden
    for (const tec of tecnicosValidos) {
      const nombreTec = tecnicos.find(t => t.id === tec.tecnico_id)?.nombre_completo ?? "Técnico";
      await registrarEvento(noOrden, "asignacion", `Técnico asignado: ${nombreTec}.`, usuario.id);
    }
    if (tieneInicio) {
      await registrarEvento(noOrden, "inicio", "Trabajo iniciado.", usuario.id);
    }
    if (nombreMaterial) {
      await registrarEvento(noOrden, "material", `Material registrado: ${nombreMaterial}.`, usuario.id);
    }
    if (tieneTermino) {
      await registrarEvento(noOrden, "terminado", "Trabajo finalizado.", usuario.id);
    }
    if (form.entregada && tieneTermino) {
      await registrarEvento(noOrden, "entrega", "Trabajo entregado al solicitante.", usuario.id);
    }

    // 3. Determinar y actualizar estado final
    let estadoFinal = "nueva_orden";
    if (tieneInicio && tieneTermino)  estadoFinal = "terminada";
    else if (tieneInicio)             estadoFinal = "en_proceso";

    if (estadoFinal !== "nueva_orden") {
      await actualizarEstado(noOrden, estadoFinal, usuario.id);
    }

    // 4. Si entregada, marcar boolean en BD
    if (form.entregada && tieneTermino) {
      await supabase.from("ordenes_trabajo").update({ entregada: true }).eq("no_orden", noOrden);
    }

    setEnv(false);
    onExito(noOrden);
  };

  const onFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setErr(er => ({...er, archivo:"Máximo 20 MB."})); return; }
    setArchivo(f);
  };

  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:"28px" }}>

      {/* Aviso de orden manual */}
      <div style={{ background:C.warn+"18", border:`1px solid ${C.warn}44`, borderRadius:10,
        padding:"12px 16px", marginBottom:24, display:"flex", gap:12, alignItems:"flex-start" }}>
        <span style={{ fontSize:20 }}>📋</span>
        <div>
          <div style={{ color:C.warn, fontWeight:700, fontSize:14 }}>Modo captura manual</div>
          <div style={{ color:C.textSub, fontSize:13, marginTop:2 }}>
            Esta orden quedará marcada como <strong>capturada a mano</strong> por {usuario.nombre_completo}.
            Ingresa los datos exactamente como aparecen en la papeleta física.
          </div>
        </div>
      </div>

      {errores._global && (
        <div style={{ background:C.danger+"18", border:`1px solid ${C.danger}44`, borderRadius:8,
          padding:"10px 14px", color:C.danger, marginBottom:20, fontSize:13 }}>{errores._global}</div>
      )}

      {/* ── Folio y fecha */}
      <Section title="Folio y fechas de la orden" subtitle="Ingresa el folio y las fechas reales de la papeleta. El estado se asigna automáticamente según las fechas.">
        <Row>
          <div>
            <Label required>Número de folio (papeleta)</Label>
            <Input type="number" placeholder="Ej. 10847" value={form.folio_manual} error={!!errores.folio_manual} onChange={e => set("folio_manual", e.target.value)} />
            <ErrMsg msg={errores.folio_manual} />
            <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>Folio exacto de la papeleta física.</div>
          </div>
          <div>
            <Label required>Fecha de la orden original</Label>
            <Input type="date" value={form.fecha_original} error={!!errores.fecha_original} onChange={e => set("fecha_original", e.target.value)} />
            <ErrMsg msg={errores.fecha_original} />
          </div>
        </Row>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:6, marginBottom:14 }}>
          <div style={{ color:C.textSub, fontSize:12, fontWeight:600, marginBottom:10 }}>Fechas de seguimiento (opcional)</div>
          <Row>
            <div>
              <Label>Fecha de inicio</Label>
              <Input type="date" value={form.fecha_inicio} error={!!errores.fecha_inicio} onChange={e => set("fecha_inicio", e.target.value)} />
              <ErrMsg msg={errores.fecha_inicio} />
              <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>Si se indica, la orden pasará a "En proceso".</div>
            </div>
            <div>
              <Label>Fecha de término</Label>
              <Input type="date" value={form.fecha_termino} error={!!errores.fecha_termino} onChange={e => set("fecha_termino", e.target.value)} />
              <ErrMsg msg={errores.fecha_termino} />
              <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>Requiere fecha de inicio. La orden quedará como "Terminada".</div>
            </div>
          </Row>

          {/* Status preview */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, padding:"8px 14px",
            background: C.bg, borderRadius:8, border:`1px solid ${C.border}` }}>
            <span style={{ color:C.muted, fontSize:12 }}>Estado resultante:</span>
            {form.entregada && form.fecha_termino && form.fecha_inicio ? (
              <span style={{ background:"#8B5CF622", color:"#8B5CF6", fontWeight:700, fontSize:12, padding:"3px 10px", borderRadius:6 }}>Entregada</span>
            ) : form.fecha_termino && form.fecha_inicio ? (
              <span style={{ background:C.success+"22", color:C.success, fontWeight:700, fontSize:12, padding:"3px 10px", borderRadius:6 }}>Terminada</span>
            ) : form.fecha_inicio ? (
              <span style={{ background:C.warn+"22", color:C.warn, fontWeight:700, fontSize:12, padding:"3px 10px", borderRadius:6 }}>En proceso</span>
            ) : (
              <span style={{ background:C.accent+"22", color:C.accent, fontWeight:700, fontSize:12, padding:"3px 10px", borderRadius:6 }}>Nueva orden</span>
            )}
          </div>
        </div>
      </Section>

      {/* ── Solicitante */}
      <Section title="Solicitante" subtitle="Busca en el sistema. Si no existe, llena los campos manuales.">
        <div style={{ marginBottom:14 }}>
          <Label>Buscar en el sistema</Label>
          <BuscadorSolicitante
            usuarios={usuarios}
            seleccionado={solicitante}
            onSeleccionar={u => { setSolicitante(u); if (u) { set("nombre_manual",""); set("empleado_manual",""); }}}
          />
        </div>

        {/* Separador */}
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }} />
          <span style={{ color:C.muted, fontSize:12 }}>o captura manualmente</span>
          <div style={{ flex:1, height:1, background:C.border }} />
        </div>

        {/* Campos manuales — siempre editables, prellenados si hay solicitante del sistema */}
        <Row>
          <div>
            <Label required>Nombre del solicitante</Label>
            <Input placeholder="Ej. Carlos Ponce"
              value={form.nombre_manual || (solicitante ? solicitante.nombre_completo : "")}
              error={!!errores.nombre_manual}
              onChange={e => set("nombre_manual", e.target.value)} />
            <ErrMsg msg={errores.nombre_manual} />
          </div>
          <div>
            <Label required>No. de empleado</Label>
            <Input placeholder="Ej. 33731"
              value={form.empleado_manual || (solicitante ? solicitante.no_empleado : "")}
              error={!!errores.empleado_manual}
              onChange={e => set("empleado_manual", e.target.value)} />
            <ErrMsg msg={errores.empleado_manual} />
          </div>
        </Row>
        <Row>
          <div>
            <Label>Área</Label>
            <Select value={form.area_manual || (solicitante ? (areas.find(a => a.codigo === solicitante.area_codigo)?.nombre ?? "") : "")}
              onChange={e => set("area_manual", e.target.value)}>
              <option value="">— Seleccionar —</option>
              {areas.map(a => <option key={a.codigo} value={a.nombre}>{a.codigo} · {a.nombre}</option>)}
            </Select>
          </div>
          <div>
            <Label>Departamento</Label>
            <Input placeholder="Ej. Toolroom, Producción…"
              value={form.depto_manual || (solicitante ? (solicitante.departamento ?? "") : "")}
              onChange={e => set("depto_manual", e.target.value)} />
          </div>
        </Row>
        {solicitante && (
          <button onClick={() => setSolicitante(null)} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:12 }}>
            ✕ Quitar selección y capturar manualmente
          </button>
        )}
      </Section>

      {/* ── Pieza */}
      <Section title="Datos de la pieza">
        <div style={{ marginBottom:14 }}>
          <Label required>Nombre completo de la pieza</Label>
          <Input placeholder="Ej. Buje de mesa x celda 5" value={form.nombre_pieza}
            error={!!errores.nombre_pieza} onChange={e => set("nombre_pieza", e.target.value)} />
          <ErrMsg msg={errores.nombre_pieza} />
        </div>
        <Row cols={3}>
          <div>
            <Label>S.E.T.C. #</Label>
            <Input placeholder="Ej. 3040798" value={form.setc_numero} onChange={e => set("setc_numero", e.target.value)} />
          </div>
          <div>
            <Label>No. de plano</Label>
            <Input placeholder="M-0015-12-D07" value={form.no_plano} onChange={e => set("no_plano", e.target.value)} />
          </div>
          <div>
            <Label required>Cantidad</Label>
            <Input type="number" min="1" value={form.cantidad} error={!!errores.cantidad}
              onChange={e => set("cantidad", e.target.value)} />
            <ErrMsg msg={errores.cantidad} />
          </div>
        </Row>
        <div>
          <Label>No. máquina / fixtura / equipo</Label>
          <Input placeholder="Ej. MB0137" value={form.no_maquina} onChange={e => set("no_maquina", e.target.value)} />
        </div>
      </Section>

      {/* ── Trabajo */}
      <Section title="Descripción del trabajo">
        <div style={{ marginBottom:14 }}>
          <Label required>Descripción</Label>
          <Textarea rows={4} placeholder="Copia la descripción tal como aparece en la papeleta…"
            value={form.descripcion} error={!!errores.descripcion}
            onChange={e => set("descripcion", e.target.value)} />
          <ErrMsg msg={errores.descripcion} />
        </div>

        {/* Adjuntar foto o scan del papel */}
        <div>
          <Label>Foto o escaneo de la orden física</Label>
          <div onClick={() => fileRef.current.click()} style={{
            border:`2px dashed ${archivo ? C.success : C.border}`, borderRadius:10,
            padding:20, textAlign:"center", cursor:"pointer",
            background:archivo ? C.success+"08" : "transparent" }}
            onMouseEnter={e => !archivo && (e.currentTarget.style.borderColor = C.accent)}
            onMouseLeave={e => !archivo && (e.currentTarget.style.borderColor = C.border)}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp"
              style={{ display:"none" }} onChange={onFile} />
            {archivo ? (
              <div>
                <div style={{ fontSize:22, marginBottom:4 }}>✅</div>
                <div style={{ color:C.success, fontWeight:600, fontSize:14 }}>{archivo.name}</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>Clic para cambiar</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                <div style={{ color:C.textSub, fontSize:14, fontWeight:600 }}>Adjuntar foto de la papeleta</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>PDF, JPG, PNG · Máx. 20 MB · Recomendado pero opcional</div>
              </div>
            )}
          </div>
          <ErrMsg msg={errores.archivo} />
        </div>
      </Section>

      {/* ── Prioridad */}
      <Section title="Prioridad">
        <div style={{ display:"grid", gap:8, marginBottom:8 }}>
          {PRIORIDADES.map(p => (
            <div key={p.valor} onClick={() => set("prioridad", p.valor)} style={{
              border:`1.5px solid ${form.prioridad === p.valor ? p.color : C.border}`,
              borderRadius:10, padding:"11px 16px", cursor:"pointer",
              background:form.prioridad === p.valor ? p.color+"11" : "transparent",
              display:"flex", alignItems:"center", gap:12, transition:"all .15s" }}>
              <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0,
                border:`2px solid ${form.prioridad === p.valor ? p.color : C.border}`,
                background:form.prioridad === p.valor ? p.color : "transparent",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {form.prioridad === p.valor && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }} />}
              </div>
              <span style={{ color:form.prioridad === p.valor ? p.color : C.text, fontWeight:600, fontSize:14 }}>{p.label}</span>
            </div>
          ))}
        </div>
        <ErrMsg msg={errores.prioridad} />
      </Section>

      {/* ── Asignación y cierre */}
      <Section title="Asignación y cierre" subtitle="Completa los datos de ejecución para cerrar la orden de un solo paso.">
        {/* Lista de técnicos */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <Label required>Técnicos asignados</Label>
            <button type="button" onClick={agregarTecnico}
              style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}55`,
                borderRadius:9999, padding:"4px 12px", cursor:"pointer", fontSize:11, fontWeight:600 }}>
              + Agregar técnico
            </button>
          </div>
          {errores.tecnico_id && <ErrMsg msg={errores.tecnico_id} />}

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {form.tecnicos.map((tec, idx) => (
              <div key={idx} style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ flex:1 }}>
                  <Select value={tec.tecnico_id} error={!!errores.tecnico_id && !form.tecnicos.some(t => t.tecnico_id)}
                    onChange={e => actualizarTec(idx, "tecnico_id", e.target.value)}>
                    <option value="">— Seleccionar técnico —</option>
                    {tecnicos.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre_completo} ({t.no_empleado})</option>
                    ))}
                  </Select>
                </div>
                <div style={{ width:120, flexShrink:0 }}>
                  <Input type="number" step="0.5" min="0" placeholder="Horas"
                    value={tec.tiempo_real_hrs}
                    onChange={e => actualizarTec(idx, "tiempo_real_hrs", e.target.value)} />
                </div>
                {form.tecnicos.length > 1 && (
                  <button type="button" onClick={() => quitarTecnico(idx)}
                    style={{ background:"none", color:C.danger, border:`1px solid ${C.danger}55`,
                      borderRadius:8, padding:"6px 10px", cursor:"pointer", fontSize:12, flexShrink:0 }}>
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          {form.fecha_inicio && form.fecha_termino && (
            <div style={{ color:C.muted, fontSize:11, marginTop:6 }}>
              Horas calculadas por técnico: {Math.round(((new Date(form.fecha_termino) - new Date(form.fecha_inicio)) / (1000*60*60)) * 10) / 10} hrs (editable en cada uno)
            </div>
          )}
        </div>

        <Row>
          <div>
            <Label>Material utilizado</Label>
            <Select value={form.material_id}
              onChange={e => { set("material_id", e.target.value); if (e.target.value) set("material_otro", ""); }}>
              <option value="">— Seleccionar material —</option>
              {materiales.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              <option value="__otro__">Otro (especificar)</option>
            </Select>
          </div>
          <div>
            {form.material_id === "__otro__" ? (
              <>
                <Label>Especificar material</Label>
                <Input placeholder="Ej. Acero inoxidable 304" value={form.material_otro}
                  onChange={e => set("material_otro", e.target.value)} />
              </>
            ) : (
              <>
                <Label>Comentarios</Label>
                <Input placeholder="Nota opcional sobre el trabajo…" value={form.comentarios}
                  onChange={e => set("comentarios", e.target.value)} />
              </>
            )}
          </div>
        </Row>

        {form.material_id === "__otro__" && (
          <div style={{ marginBottom:14 }}>
            <Label>Comentarios</Label>
            <Input placeholder="Nota opcional sobre el trabajo…" value={form.comentarios}
              onChange={e => set("comentarios", e.target.value)} />
          </div>
        )}

        {/* Entregada toggle */}
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, marginTop:6 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 16px", borderRadius:10,
            background: form.entregada ? "#8B5CF618" : C.bg,
            border:`1px solid ${form.entregada ? "#8B5CF655" : C.border}`,
            opacity: form.fecha_termino ? 1 : 0.5 }}>
            <div>
              <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>📦 ¿Trabajo entregado al solicitante?</div>
              <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>
                {form.fecha_termino
                  ? "Marca esta opción si el solicitante ya recogió la pieza."
                  : "Necesitas fecha de término para poder marcar como entregada."}
              </div>
            </div>
            <div onClick={() => {
                if (!form.fecha_termino) return;
                set("entregada", !form.entregada);
              }}
              style={{ width:48, height:26, borderRadius:13, cursor: form.fecha_termino ? "pointer" : "not-allowed",
                background: form.entregada ? "#8B5CF6" : C.border,
                position:"relative", transition:"background .2s", flexShrink:0 }}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff",
                position:"absolute", top:3, left: form.entregada ? 25 : 3,
                transition:"left .2s", boxShadow:"0 1px 3px #0004" }} />
            </div>
          </div>
          <ErrMsg msg={errores.entregada} />
        </div>
      </Section>

      {/* Botón */}
      <button onClick={enviar} disabled={enviando} style={{
        width:"100%", background:enviando ? C.border : C.success,
        color:enviando ? C.muted : "#fff", border:"none", borderRadius:12,
        padding:"14px 0", fontWeight:700, fontSize:16, cursor:enviando ? "default" : "pointer",
        transition:"background .15s" }}>
        {enviando ? "Guardando en el sistema…" : "✓ Registrar y cerrar orden"}
      </button>
    </div>
  );
}

// ── Pantalla de éxito ────────────────────────────────────────
function PantallaExito({ folio, onOtra, onVolver }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 24px" }}>
      <div style={{ maxWidth:400, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:14 }}>✅</div>
        <div style={{ color:C.text, fontWeight:800, fontSize:22, marginBottom:8 }}>¡Orden registrada!</div>
        <div style={{ color:C.muted, fontSize:14, marginBottom:24 }}>
          La orden fue capturada correctamente en el sistema.
        </div>
        <div style={{ background:C.surface, border:`2px solid ${C.success}`, borderRadius:14,
          padding:"18px 0", marginBottom:24 }}>
          <div style={{ color:C.muted, fontSize:12, marginBottom:4 }}>NÚMERO DE ORDEN ASIGNADO</div>
          <div style={{ color:C.success, fontSize:40, fontWeight:900 }}>#{folio}</div>
        </div>
        <div style={{ color:C.muted, fontSize:12, marginBottom:24 }}>
          Puedes escribir este folio en la papeleta física para mantener la trazabilidad.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onOtra} style={{ flex:1, background:C.accent, color:"#fff", border:"none",
            borderRadius:10, padding:"12px 0", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            + Capturar otra
          </button>
          <button onClick={onVolver} style={{ flex:1, background:C.border, color:C.text, border:"none",
            borderRadius:10, padding:"12px 0", fontWeight:600, fontSize:14, cursor:"pointer" }}>
            Ir al panel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── APP PRINCIPAL ─────────────────────────────────────────────
export default function App({ onVolver }) {
  const usuario = obtenerSesion();
  const [pantalla, setPantalla] = useState("form"); // form | exito
  const [folio, setFolio]       = useState(null);

  // Redirigir si no es admin
  if (!usuario || !["administrador","superadmin"].includes(usuario.rol)) {
    return (
      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ color:C.muted, fontSize:14 }}>Acceso restringido. Debes iniciar sesión como administrador.</div>
      </div>
    );
  }

  const salir = () => { cerrarSesion(); window.location.reload(); };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 28px" }}>
        <div style={{ maxWidth:780, margin:"0 auto", display:"flex", alignItems:"center",
          justifyContent:"space-between", height:54 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/logo-bwi.png" alt="BWI Group" style={{ height:32, objectFit:"contain" }} />
            <div>
              <div style={{ color:C.muted, fontSize:11 }}>Captura manual — TOOLROOM</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ color:C.muted, fontSize:12 }}>{usuario.nombre_completo}</span>
            <button onClick={() => { if (onVolver) onVolver(); else window.history.back(); }} style={{ background:C.border, color:C.muted,
              border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12 }}>
              ← Panel
            </button>
            <button onClick={salir} style={{ background:C.border, color:C.muted,
              border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:12 }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:780, margin:"0 auto", padding:"28px 24px" }}>
        {pantalla === "form" ? (
          <>
            <div style={{ marginBottom:24 }}>
              <div style={{ color:C.text, fontWeight:700, fontSize:22 }}>Captura de Orden Manual</div>
              <div style={{ color:C.muted, fontSize:14, marginTop:4 }}>
                Para órdenes que llegaron en papel o de forma verbal. Registrado por <strong style={{ color:C.textSub }}>{usuario.nombre_completo}</strong>.
              </div>
            </div>
            <FormCaptura
              usuario={usuario}
              onExito={n => { setFolio(n); setPantalla("exito"); }}
            />
          </>
        ) : (
          <PantallaExito
            folio={folio}
            onOtra={() => { setFolio(null); setPantalla("form"); }}
            onVolver={() => { if (onVolver) onVolver(); else window.history.back(); }}
          />
        )}
      </div>
    </div>
  );
}
