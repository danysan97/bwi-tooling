import { useState, useEffect } from 'react'
import { obtenerSesion, cerrarSesion, loginSinPin, loginConPin, necesitaPin } from './lib/supabase'
import TallerDashboard   from './TallerDashboard.jsx'
import CapturaManual     from './CapturaManual.jsx'
import PortalSolicitante from './PortalSolicitante.jsx'

const ROLES_ADMIN = ['administrador', 'superadmin']

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", muted:"#6B7280", text:"#F1F5F9", textSub:"#94A3B8",
  danger:"#EF4444",
}

function PantallaLogin({ onLogin }) {
  const [paso, setPaso]    = useState("empleado")
  const [empleado, setEmp] = useState("")
  const [pin, setPin]      = useState("")
  const [err, setErr]      = useState("")
  const [loading, setLoad] = useState(false)

  const continuar = async () => {
    const val = empleado.trim();
    if (!val) { setErr("Ingresa tu número de empleado."); return; }

    // Excepción: TOOLING01
    const esSuperAdmin = val.toUpperCase() === "TOOLING01";

    // Validación: debe ser exactamente 5 dígitos numéricos (o TOOLING01)
    if (!esSuperAdmin && !/^\d{5}$/.test(val)) {
      setErr("El número de empleado debe tener exactamente 5 dígitos.");
      return;
    }

    setLoad(true); setErr("")
    const requiere = await necesitaPin(val)
    if (requiere === true) { setLoad(false); setPaso("pin"); return; }
    const { usuario, error } = await loginSinPin(val)
    setLoad(false)
    if (error) { setErr(error); return; }
    onLogin(usuario)
  }

  const entrar = async () => {
    if (!pin.trim()) { setErr("Ingresa tu PIN."); return; }
    setLoad(true); setErr("")
    const { usuario, error } = await loginConPin(empleado, pin)
    setLoad(false)
    if (error) { setErr(error); return; }
    onLogin(usuario)
  }

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:8 }}>
            <div style={{ width:5, height:32, background:C.accent, borderRadius:3 }} />
            <span style={{ fontSize:22, fontWeight:800, color:C.text }}>BWI — Tooling</span>
          </div>
          <div style={{ color:C.muted, fontSize:13 }}>Portal de Órdenes de Trabajo</div>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:32 }}>
          {paso === "empleado" ? (
            <>
              <div style={{ color:C.text, fontWeight:700, fontSize:18, marginBottom:4 }}>Ingresar</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Usa tu número de empleado BWI.</div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", color:C.textSub, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Número de empleado *</label>
                <input placeholder="Ej. 33731" value={empleado}
                  onChange={e => { setEmp(e.target.value); setErr("") }}
                  onKeyDown={e => e.key === "Enter" && continuar()}
                  autoFocus
                  style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${err?C.danger:C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none" }}
                />
                {err && <div style={{ color:C.danger, fontSize:12, marginTop:4 }}>{err}</div>}
              </div>
              <button onClick={continuar} disabled={loading} style={{ width:"100%", background:loading?C.border:C.accent, color:loading?C.muted:"#fff", border:"none", borderRadius:10, padding:"12px 0", fontWeight:700, fontSize:15, cursor:loading?"default":"pointer" }}>
                {loading ? "Verificando…" : "Continuar →"}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setPaso("empleado"); setPin(""); setErr("") }} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, marginBottom:16, padding:0 }}>← Cambiar número</button>
              <div style={{ color:C.text, fontWeight:700, fontSize:18, marginBottom:4 }}>Ingresa tu PIN</div>
              <div style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Administrador · <strong style={{ color:C.textSub }}>{empleado}</strong></div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", color:C.textSub, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>PIN *</label>
                <input type="password" placeholder="••••••" value={pin}
                  onChange={e => { setPin(e.target.value); setErr("") }}
                  onKeyDown={e => e.key === "Enter" && entrar()}
                  autoFocus
                  style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1px solid ${err?C.danger:C.border}`, borderRadius:8, padding:"10px 14px", color:C.text, fontSize:14, outline:"none" }}
                />
                {err && <div style={{ color:C.danger, fontSize:12, marginTop:4 }}>{err}</div>}
              </div>
              <button onClick={entrar} disabled={loading} style={{ width:"100%", background:loading?C.border:C.accent, color:loading?C.muted:"#fff", border:"none", borderRadius:10, padding:"12px 0", fontWeight:700, fontSize:15, cursor:loading?"default":"pointer" }}>
                {loading ? "Verificando…" : "Entrar →"}
              </button>
            </>
          )}
        </div>
        <div style={{ textAlign:"center", marginTop:16, color:C.muted, fontSize:12 }}>¿Problemas para ingresar? Contacta al taller.</div>
      </div>
    </div>
  )
}

export default function App() {
  const [usuario, setUsuario] = useState(null)
  const [vista, setVista]     = useState('cargando')

  useEffect(() => {
    const s = obtenerSesion()
    if (s) {
      setUsuario(s)
      setVista(ROLES_ADMIN.includes(s.rol) ? 'dashboard' : 'portal')
    } else {
      setVista('login')
    }
  }, [])

  const onLogin = u => {
    setUsuario(u)
    setVista(ROLES_ADMIN.includes(u.rol) ? 'dashboard' : 'portal')
  }

  const salir = () => {
    cerrarSesion()
    setUsuario(null)
    setVista('login')
  }

  if (vista === 'cargando') return null
  if (vista === 'login')    return <PantallaLogin onLogin={onLogin} />
  if (vista === 'portal')   return <PortalSolicitante usuario={usuario} onSalir={salir} />
  if (vista === 'dashboard') return <TallerDashboard usuario={usuario} onCapturarManual={() => setVista('manual')} onSalir={salir} />
  if (vista === 'manual')   return <CapturaManual usuario={usuario} onVolver={() => setVista('dashboard')} />
  return null
}
