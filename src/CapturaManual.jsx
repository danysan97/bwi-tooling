import { useState, useRef, useEffect } from "react";
import {
  obtenerSesion, cerrarSesion,
  crearOrden, obtenerAreas, obtenerTecnicos,
  listarUsuarios,
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
    // Fecha real de la orden en papel
    folio_manual:    "",
    fecha_original:  new Date().toISOString().slice(0,10),
  });

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErr(e => ({...e, [k]:""})); };

  useEffect(() => {
    Promise.all([listarUsuarios(), obtenerAreas()])
      .then(([{ data }, areasData]) => {
        setUsuarios(data ?? []);
        setAreas(areasData);
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
    return e;
  };

  const enviar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErr(e); return; }

    setEnv(true);

    // Si el solicitante no está en el sistema, usamos la cuenta del admin
    // pero marcamos los datos manuales en la descripción
    const solicitanteId = solicitante?.id ?? usuario.id;

    const descripcionFinal = solicitante
      ? form.descripcion
      : `[ORDEN MANUAL — Solicitante: ${form.nombre_manual.trim()} / Emp. ${form.empleado_manual.trim()} / ${form.depto_manual || form.area_manual || "—"}]\n\n${form.descripcion}`;

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

    setEnv(false);
    if (error) { setErr({ _global:"Error al guardar. Intenta de nuevo." }); return; }
    onExito(data.no_orden);
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
      <Section title="Folio y fecha de la orden" subtitle="Ingresa el folio de la papeleta física y la fecha real.">
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

        {/* Campos manuales — se deshabilitan si hay solicitante del sistema */}
        <Row>
          <div>
            <Label required={!solicitante}>Nombre del solicitante</Label>
            <Input placeholder="Ej. Carlos Ponce" value={solicitante ? solicitante.nombre_completo : form.nombre_manual}
              disabled={!!solicitante} error={!!errores.nombre_manual}
              style={solicitante ? { color:C.muted } : {}}
              onChange={e => set("nombre_manual", e.target.value)} />
            <ErrMsg msg={errores.nombre_manual} />
          </div>
          <div>
            <Label required={!solicitante}>No. de empleado</Label>
            <Input placeholder="Ej. 33731" value={solicitante ? solicitante.no_empleado : form.empleado_manual}
              disabled={!!solicitante} error={!!errores.empleado_manual}
              style={solicitante ? { color:C.muted } : {}}
              onChange={e => set("empleado_manual", e.target.value)} />
            <ErrMsg msg={errores.empleado_manual} />
          </div>
        </Row>
        <Row>
          <div>
            <Label>Área</Label>
            {solicitante ? (
              <Input value={areas.find(a => a.codigo === solicitante.area_codigo)?.nombre ?? "—"} disabled style={{ color:C.muted }} />
            ) : (
              <Select value={form.area_manual} onChange={e => set("area_manual", e.target.value)}>
                <option value="">— Seleccionar —</option>
                {areas.map(a => <option key={a.codigo} value={a.nombre}>{a.codigo} · {a.nombre}</option>)}
              </Select>
            )}
          </div>
          <div>
            <Label>Departamento</Label>
            <Input placeholder="Ej. Toolroom, Producción…"
              value={solicitante ? (solicitante.departamento ?? "") : form.depto_manual}
              disabled={!!solicitante} style={solicitante ? { color:C.muted } : {}}
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

      {/* Botón */}
      <button onClick={enviar} disabled={enviando} style={{
        width:"100%", background:enviando ? C.border : C.success,
        color:enviando ? C.muted : "#fff", border:"none", borderRadius:12,
        padding:"14px 0", fontWeight:700, fontSize:16, cursor:enviando ? "default" : "pointer",
        transition:"background .15s" }}>
        {enviando ? "Guardando en el sistema…" : "✓ Registrar orden manual"}
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
              <div style={{ color:C.muted, fontSize:11 }}>Captura de órdenes manuales</div>
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
