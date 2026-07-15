import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", warn:"#F59E0B",
  danger:"#EF4444", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
  purple:"#8B5CF6",
};

const ROL_COLOR = {
  superadmin:    C.danger,
  administrador: C.warn,
  tecnico:       C.accent,
  solicitante:   C.muted,
};
const ROL_LABEL = {
  superadmin:    "Superadmin",
  administrador: "Administrador",
  tecnico:       "Técnico",
  solicitante:   "Solicitante",
};
const TURNO_COLOR = { primero: C.accent, segundo: C.purple };

const AREAS = [
  { codigo:1401, nombre:"IAMM/FRHC SALARY INDIRECT" },
  { codigo:1403, nombre:"MRD/MRF SALARY INDIRECT" },
  { codigo:1407, nombre:"RTA (MR/PASIVE/BMW) SALARY INDIRECT" },
  { codigo:1410, nombre:"BI-STATE SALARY INDIRECT" },
  { codigo:1411, nombre:"INGENIERIA AMBIENTAL" },
  { codigo:1414, nombre:"MANTENIMIENTO PLANTA" },
  { codigo:1415, nombre:"TALLER MÁQUINAS Y HERRAMIENTAS" },
  { codigo:1421, nombre:"PASIVE TT/BMW SALARY INDIRECT" },
  { codigo:1440, nombre:"INGENIERÍA" },
  { codigo:1441, nombre:"NUEVOS PROYECTOS" },
  { codigo:1601, nombre:"RECURSOS HUMANOS" },
];

const Badge = ({ color, label }) => (
  <span style={{ background:color+"22", color, border:`1px solid ${color}55`, borderRadius:6, padding:"2px 10px", fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{label}</span>
);

const Label = ({ children, required }) => (
  <label style={{ display:"block", color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>
    {children}{required && <span style={{ color:C.danger, marginLeft:3 }}>*</span>}
  </label>
);
const Input = ({ error, ...props }) => (
  <input {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${error?C.danger:C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", ...props.style }}
    onFocus={e => e.target.style.borderColor=C.accent}
    onBlur={e => e.target.style.borderColor=error?C.danger:C.border} />
);
const Select = ({ children, ...props }) => (
  <select {...props} style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", cursor:"pointer" }}>{children}</select>
);
const ErrMsg = ({ msg }) => msg ? <div style={{ color:C.danger, fontSize:11, marginTop:3 }}>{msg}</div> : null;

// ── Modal crear / editar usuario ─────────────────────────────
function ModalUsuario({ usuario, onCerrar, onGuardado }) {
  const esNuevo = !usuario;
  const necesitaPin = (rol) => ["administrador","superadmin","tecnico"].includes(rol);

  const [form, setForm] = useState({
    no_empleado:     usuario?.no_empleado     ?? "",
    nombre_completo: usuario?.nombre_completo ?? "",
    rol:             usuario?.rol             ?? "solicitante",
    area_codigo:     usuario?.area_codigo     ?? "",
    departamento:    usuario?.departamento    ?? "",
    turno:           usuario?.turno           ?? "primero",
    pin:             "",
    pin2:            "",
  });
  const [errores, setErr] = useState({});
  const [guardando, setG] = useState(false);
  const [msg, setMsg]     = useState("");

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErr(e=>({...e,[k]:""})); };

  const validar = () => {
    const e = {};
    if (!form.no_empleado.trim())     e.no_empleado     = "Obligatorio.";
    if (!form.nombre_completo.trim()) e.nombre_completo = "Obligatorio.";
    if (!form.rol)                    e.rol             = "Selecciona un rol.";
    if (esNuevo && necesitaPin(form.rol)) {
      if (!form.pin || form.pin.length < 4)  e.pin  = "Mínimo 4 dígitos.";
      if (form.pin !== form.pin2)            e.pin2 = "Los PINs no coinciden.";
      if (!/^\d+$/.test(form.pin))           e.pin  = "Solo números.";
    }
    return e;
  };

  const guardar = async () => {
    const e = validar();
    if (Object.keys(e).length) { setErr(e); return; }
    setG(true);

    if (esNuevo) {
      // Crear usuario
      if (necesitaPin(form.rol)) {
        // Con PIN — usar RPC
        const { error } = await supabase.rpc('crear_usuario_admin', {
          p_no_empleado:     form.no_empleado.trim().toUpperCase(),
          p_nombre_completo: form.nombre_completo.trim().toUpperCase(),
          p_rol:             form.rol,
          p_area_codigo:     form.area_codigo ? Number(form.area_codigo) : null,
          p_departamento:    form.departamento.trim() || null,
          p_pin:             form.pin,
        });
        if (error) { setMsg("Error: " + (error.message ?? "No se pudo crear.")); setG(false); return; }
        // Actualizar turno
        await supabase.from("usuarios").update({ turno: form.turno }).eq("no_empleado", form.no_empleado.trim().toUpperCase());
      } else {
        // Sin PIN
        const { error } = await supabase.from("usuarios").insert({
          no_empleado:     form.no_empleado.trim().toUpperCase(),
          nombre_completo: form.nombre_completo.trim().toUpperCase(),
          rol:             form.rol,
          area_codigo:     form.area_codigo ? Number(form.area_codigo) : null,
          departamento:    form.departamento.trim() || null,
          turno:           form.turno,
          activo:          true,
        });
        if (error) { setMsg("Error: " + (error.message ?? "No se pudo crear.")); setG(false); return; }
      }
    } else {
      // Editar usuario existente
      const { error } = await supabase.from("usuarios").update({
        nombre_completo: form.nombre_completo.trim().toUpperCase(),
        rol:             form.rol,
        area_codigo:     form.area_codigo ? Number(form.area_codigo) : null,
        departamento:    form.departamento.trim() || null,
        turno:           form.turno,
      }).eq("id", usuario.id);
      if (error) { setMsg("Error al guardar."); setG(false); return; }
    }

    setG(false);
    onGuardado();
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onCerrar}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>

        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:C.text, fontWeight:700, fontSize:16 }}>{esNuevo ? "Nuevo usuario" : "Editar usuario"}</div>
          <button onClick={onCerrar} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>

        <div style={{ padding:"20px 22px", display:"grid", gap:14 }}>
          {msg && <div style={{ background:C.danger+"18", border:`1px solid ${C.danger}44`, borderRadius:8, padding:"10px 14px", color:C.danger, fontSize:13 }}>{msg}</div>}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <Label required>No. de empleado</Label>
              <Input placeholder="Ej. 33179" value={form.no_empleado} error={!!errores.no_empleado}
                disabled={!esNuevo} style={!esNuevo?{color:C.muted}:{}}
                onChange={e => set("no_empleado", e.target.value)} />
              <ErrMsg msg={errores.no_empleado} />
            </div>
            <div>
              <Label required>Rol</Label>
              <Select value={form.rol} onChange={e => set("rol", e.target.value)}>
                <option value="solicitante">Solicitante</option>
                <option value="tecnico">Técnico</option>
                <option value="administrador">Administrador</option>
                <option value="superadmin">Superadmin</option>
              </Select>
              <ErrMsg msg={errores.rol} />
            </div>
          </div>

          <div>
            <Label required>Nombre completo</Label>
            <Input placeholder="Ej. RUEDA SOTO DANIEL SANTOS" value={form.nombre_completo} error={!!errores.nombre_completo}
              onChange={e => set("nombre_completo", e.target.value)} />
            <ErrMsg msg={errores.nombre_completo} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <Label>Área</Label>
              <Select value={form.area_codigo} onChange={e => set("area_codigo", e.target.value)}>
                <option value="">— Sin área —</option>
                {AREAS.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo} · {a.nombre}</option>)}
              </Select>
            </div>
            <div>
              <Label>Departamento</Label>
              <Input placeholder="Ej. ING. TOOL ROOM" value={form.departamento} onChange={e => set("departamento", e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Turno</Label>
            <div style={{ display:"flex", gap:8 }}>
              {[["primero","1° Turno — 8 hrs productivas"],["segundo","2° Turno — 7.5 hrs productivas"]].map(([v,l]) => (
                <div key={v} onClick={() => set("turno", v)} style={{ flex:1, border:`1.5px solid ${form.turno===v?TURNO_COLOR[v]:C.border}`, borderRadius:10, padding:"10px 14px", cursor:"pointer", background:form.turno===v?TURNO_COLOR[v]+"18":"transparent", display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${form.turno===v?TURNO_COLOR[v]:C.border}`, background:form.turno===v?TURNO_COLOR[v]:"transparent", flexShrink:0 }} />
                  <span style={{ color:form.turno===v?TURNO_COLOR[v]:C.textSub, fontSize:12, fontWeight:600 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PIN solo para admins nuevos */}
          {esNuevo && necesitaPin(form.rol) && (
            <div style={{ background:C.warn+"18", border:`1px solid ${C.warn}44`, borderRadius:10, padding:"14px 16px" }}>
              <div style={{ color:C.warn, fontWeight:600, fontSize:13, marginBottom:10 }}>🔐 Este rol requiere PIN</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <Label required>PIN inicial</Label>
                  <Input type="password" placeholder="Mín. 4 dígitos" value={form.pin} error={!!errores.pin}
                    onChange={e => set("pin", e.target.value)} />
                  <ErrMsg msg={errores.pin} />
                </div>
                <div>
                  <Label required>Confirmar PIN</Label>
                  <Input type="password" placeholder="Repite el PIN" value={form.pin2} error={!!errores.pin2}
                    onChange={e => set("pin2", e.target.value)} />
                  <ErrMsg msg={errores.pin2} />
                </div>
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <button onClick={onCerrar} style={{ flex:1, background:C.border, color:C.text, border:"none", borderRadius:10, padding:"11px 0", cursor:"pointer", fontWeight:600, fontSize:13 }}>Cancelar</button>
            <button onClick={guardar} disabled={guardando} style={{ flex:2, background:guardando?C.border:C.accent, color:guardando?C.muted:"#fff", border:"none", borderRadius:10, padding:"11px 0", cursor:guardando?"default":"pointer", fontWeight:700, fontSize:14 }}>
              {guardando ? "Guardando…" : esNuevo ? "Crear usuario" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Modal resetear PIN ───────────────────────────────────────
function ModalResetPin({ usuario, onCerrar, onGuardado }) {
  const [pin, setPin]   = useState("");
  const [pin2, setPin2] = useState("");
  const [err, setErr]   = useState("");
  const [ok, setOk]     = useState(false);
  const [g, setG]       = useState(false);

  const resetear = async () => {
    if (pin.length < 4)     { setErr("Mínimo 4 dígitos."); return; }
    if (pin !== pin2)       { setErr("Los PINs no coinciden."); return; }
    if (!/^\d+$/.test(pin)) { setErr("Solo números."); return; }
    setG(true);
    const { error } = await supabase.rpc("cambiar_pin", { p_usuario_id: usuario.id, p_pin_nuevo: pin });
    setG(false);
    if (error) { setErr("Error al resetear."); return; }
    setOk(true);
    setTimeout(onGuardado, 1500);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onCerrar}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:380 }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:"16px 22px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
          <div style={{ color:C.text, fontWeight:700, fontSize:15 }}>Resetear PIN</div>
          <button onClick={onCerrar} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:18 }}>✕</button>
        </div>
        <div style={{ padding:"20px 22px" }}>
          {ok ? (
            <div style={{ textAlign:"center", padding:20 }}>
              <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
              <div style={{ color:C.success, fontWeight:700 }}>PIN reseteado correctamente.</div>
            </div>
          ) : (
            <>
              <div style={{ color:C.muted, fontSize:13, marginBottom:16 }}>
                Nuevo PIN para <strong style={{ color:C.textSub }}>{usuario.nombre_completo}</strong>
              </div>
              <div style={{ display:"grid", gap:12 }}>
                <div>
                  <Label required>Nuevo PIN</Label>
                  <input type="password" placeholder="Mín. 4 dígitos" value={pin} onChange={e=>{setPin(e.target.value);setErr("");}}
                    style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${err?C.danger:C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none" }} />
                </div>
                <div>
                  <Label required>Confirmar PIN</Label>
                  <input type="password" placeholder="Repite el PIN" value={pin2} onChange={e=>{setPin2(e.target.value);setErr("");}}
                    onKeyDown={e => e.key==="Enter" && resetear()}
                    style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${err?C.danger:C.border}`, borderRadius:8, padding:"9px 12px", color:C.text, fontSize:13, outline:"none" }} />
                </div>
                {err && <div style={{ color:C.danger, fontSize:12 }}>{err}</div>}
                <button onClick={resetear} disabled={g} style={{ background:g?C.border:C.warn, color:g?C.muted:"#fff", border:"none", borderRadius:10, padding:"11px 0", cursor:g?"default":"pointer", fontWeight:700, fontSize:14 }}>
                  {g ? "Reseteando…" : "Resetear PIN"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Panel principal ──────────────────────────────────────────
export default function PanelUsuarios({ usuarioActual }) {
  const [usuarios, setUsuarios]   = useState([]);
  const [loading, setLoad]        = useState(true);
  const [busqueda, setBusq]       = useState("");
  const [filtroRol, setFR]        = useState("todos");
  const [modalEdit, setModalEdit] = useState(null);  // null | usuario | "nuevo"
  const [modalPin, setModalPin]   = useState(null);
  const [toggling, setToggling]   = useState(null);

  const esSuperAdmin = ["superadmin"].includes(usuarioActual?.rol);

  const cargar = async () => {
    setLoad(true);
    const { data } = await supabase
      .from("usuarios")
      .select("id, no_empleado, nombre_completo, rol, area_codigo, departamento, turno, activo, creado_en, ultimo_acceso")
      .order("nombre_completo");
    setUsuarios(data ?? []);
    setLoad(false);
  };

  useEffect(() => { cargar(); }, []);

  const toggleActivo = async (u) => {
    setToggling(u.id);
    await supabase.from("usuarios").update({ activo: !u.activo }).eq("id", u.id);
    await cargar();
    setToggling(null);
  };

  const filtrados = usuarios.filter(u => {
    const matchRol = filtroRol === "todos" || u.rol === filtroRol;
    const q = busqueda.toLowerCase();
    const matchQ = !q || u.nombre_completo?.toLowerCase().includes(q) || u.no_empleado?.toLowerCase().includes(q) || u.departamento?.toLowerCase().includes(q);
    return matchRol && matchQ;
  });

  const resumen = {
    total:         usuarios.length,
    activos:       usuarios.filter(u => u.activo).length,
    admins:        usuarios.filter(u => ["administrador","superadmin"].includes(u.rol)).length,
    tecnicos:      usuarios.filter(u => u.rol === "tecnico").length,
    solicitantes:  usuarios.filter(u => u.rol === "solicitante").length,
  };

  return (
    <>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:18 }}>
        {[
          { label:"Total usuarios",  value:resumen.total,        color:C.text    },
          { label:"Activos",         value:resumen.activos,      color:C.success },
          { label:"Admins",          value:resumen.admins,       color:C.warn    },
          { label:"Técnicos",        value:resumen.tecnicos,     color:C.accent  },
          { label:"Solicitantes",    value:resumen.solicitantes, color:C.muted   },
        ].map(k => (
          <div key={k.label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 20px" }}>
            <div style={{ color:C.textSub, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{k.label}</div>
            <div style={{ color:k.color, fontSize:28, fontWeight:800 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>

        {/* Filtros */}
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <input placeholder="Buscar por nombre, empleado, depto…" value={busqueda} onChange={e=>setBusq(e.target.value)}
            style={{ flex:1, minWidth:200, background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 12px", color:C.text, fontSize:13, outline:"none" }} />
          {["todos","superadmin","administrador","tecnico","solicitante"].map(r => (
            <button key={r} onClick={() => setFR(r)} style={{ background:filtroRol===r?(ROL_COLOR[r]||C.accent)+"22":"transparent", color:filtroRol===r?(ROL_COLOR[r]||C.accent):C.muted, border:`1px solid ${filtroRol===r?(ROL_COLOR[r]||C.accent):C.border}`, borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:12, fontWeight:600 }}>
              {{ todos:"Todos",superadmin:"Superadmin",administrador:"Admins",tecnico:"Técnicos",solicitante:"Solicitantes" }[r]}
            </button>
          ))}
          {esSuperAdmin && (
            <button onClick={() => setModalEdit("nuevo")} style={{ background:C.success, color:"#fff", border:"none", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:13, marginLeft:"auto" }}>
              + Nuevo usuario
            </button>
          )}
        </div>

        {/* Lista */}
        {loading ? <div style={{ padding:40, textAlign:"center", color:C.muted }}>Cargando…</div> : (
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {["No. Emp.","Nombre","Rol","Área / Depto","Turno","Último acceso","Estado","Acciones"].map(h => (
                    <th key={h} style={{ padding:"10px 16px", color:C.muted, fontWeight:600, textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u,i) => (
                  <tr key={u.id} style={{ borderBottom:`1px solid ${C.border}`, background:i%2===0?"transparent":C.bg+"66", opacity:u.activo?1:0.5 }}>
                    <td style={{ padding:"10px 16px", color:C.accent, fontWeight:700 }}>{u.no_empleado}</td>
                    <td style={{ padding:"10px 16px", fontWeight:600 }}>{u.nombre_completo}</td>
                    <td style={{ padding:"10px 16px" }}><Badge color={ROL_COLOR[u.rol]??C.muted} label={ROL_LABEL[u.rol]??u.rol} /></td>
                    <td style={{ padding:"10px 16px", color:C.textSub, fontSize:12 }}>
                      <div>{u.departamento ?? "—"}</div>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      {u.rol === "tecnico" ? (
                        <Badge color={TURNO_COLOR[u.turno??"primero"]} label={u.turno==="segundo"?"2° Turno":"1° Turno"} />
                      ) : <span style={{ color:C.muted }}>—</span>}
                    </td>
                    <td style={{ padding:"10px 16px", color:C.muted, fontSize:12 }}>
                      {u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleDateString("es-MX") : "Nunca"}
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      <span style={{ background:u.activo?C.success+"22":C.muted+"22", color:u.activo?C.success:C.muted, border:`1px solid ${u.activo?C.success:C.muted}55`, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 16px" }}>
                      {esSuperAdmin && (
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => setModalEdit(u)} style={{ background:C.accent+"22", color:C.accent, border:`1px solid ${C.accent}44`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:600 }}>Editar</button>
                          {["administrador","superadmin","tecnico"].includes(u.rol) && (
                            <button onClick={() => setModalPin(u)} style={{ background:C.warn+"22", color:C.warn, border:`1px solid ${C.warn}44`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:600 }}>PIN</button>
                          )}
                          <button onClick={() => toggleActivo(u)} disabled={toggling===u.id} style={{ background:u.activo?C.danger+"22":C.success+"22", color:u.activo?C.danger:C.success, border:`1px solid ${u.activo?C.danger:C.success}44`, borderRadius:6, padding:"4px 10px", cursor:"pointer", fontSize:11, fontWeight:600 }}>
                            {toggling===u.id ? "…" : u.activo ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:C.muted }}>Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      {modalEdit && (
        <ModalUsuario
          usuario={modalEdit === "nuevo" ? null : modalEdit}
          onCerrar={() => setModalEdit(null)}
          onGuardado={() => { setModalEdit(null); cargar(); }}
        />
      )}
      {modalPin && (
        <ModalResetPin
          usuario={modalPin}
          onCerrar={() => setModalPin(null)}
          onGuardado={() => { setModalPin(null); cargar(); }}
        />
      )}
    </>
  );
}
