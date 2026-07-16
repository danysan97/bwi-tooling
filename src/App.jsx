import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { obtenerSesion, cerrarSesion, loginSinPin, loginConPin, necesitaPin } from './lib/supabase'
import { C, modalScale, fadeIn } from './theme'
import TallerDashboard   from './TallerDashboard.jsx'
import CapturaManual     from './CapturaManual.jsx'
import PortalSolicitante from './PortalSolicitante.jsx'
import TecnicoPortal     from './TecnicoPortal.jsx'

const ROLES_ADMIN = ['administrador', 'superadmin']
const ROL_TECNICO = 'tecnico'

const inputStyle = {
  width:"100%", boxSizing:"border-box",
  background:C.surface2, border:`1px solid ${C.border}`,
  borderRadius:10, padding:"11px 14px", color:C.text, fontSize:14,
  outline:"none", transition:"border-color 0.2s, box-shadow 0.2s",
};
const inputFocus = (e) => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentGlow}`; };
const inputBlur  = (e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; };

function PantallaLogin({ onLogin }) {
  const [paso, setPaso]    = useState("empleado")
  const [empleado, setEmp] = useState("")
  const [pin, setPin]      = useState("")
  const [err, setErr]      = useState("")
  const [loading, setLoad] = useState(false)

  const continuar = async () => {
    const val = empleado.trim();
    if (!val) { setErr("Ingresa tu número de empleado."); return; }
    const esSuperAdmin = val.toUpperCase() === "TOOLING01";
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
    <div style={{
      minHeight:"100vh", background:C.bg,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      backgroundImage:`radial-gradient(ellipse at 50% 0%, ${C.accentGlow} 0%, transparent 60%)`,
    }}>
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
        style={{ width:"100%", maxWidth:380 }}
      >
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:10 }}>
            <div style={{
              width:6, height:34, borderRadius:3,
              background:`linear-gradient(180deg, ${C.accent}, ${C.purple})`,
            }} />
            <span style={{ fontSize:24, fontWeight:800, color:C.text, letterSpacing:-0.5 }}>
              BWI — TOOLROOM
            </span>
          </div>
          <div style={{ color:C.muted, fontSize:13, letterSpacing:0.5 }}>Portal de Órdenes de Trabajo</div>
        </div>

        {/* Card */}
        <motion.div
          {...modalScale}
          style={{
            background:C.surface,
            border:`1px solid ${C.border}`,
            borderRadius:16, padding:"32px 28px",
            boxShadow:`0 4px 24px rgba(0,0,0,0.3), 0 0 60px ${C.accentGlow}`,
          }}
        >
          <AnimatePresence mode="wait">
            {paso === "empleado" ? (
              <motion.div key="empleado" {...fadeIn}>
                <div style={{ color:C.text, fontWeight:700, fontSize:19, marginBottom:4 }}>Ingresar</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Usa tu número de empleado BWI.</div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Número de empleado *</label>
                  <input placeholder="Ej. 33731" value={empleado}
                    onChange={e => { setEmp(e.target.value); setErr("") }}
                    onKeyDown={e => e.key === "Enter" && continuar()}
                    onFocus={inputFocus} onBlur={inputBlur}
                    autoFocus style={inputStyle}
                  />
                  {err && <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} style={{ color:C.danger, fontSize:12, marginTop:6 }}>{err}</motion.div>}
                </div>
                <motion.button
                  whileHover={{ scale:1.01, boxShadow:`0 0 20px ${C.accentGlow}` }}
                  whileTap={{ scale:0.98 }}
                  onClick={continuar} disabled={loading}
                  style={{
                    width:"100%",
                    background: loading ? C.surface2 : `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                    color: loading ? C.muted : "#fff",
                    border:"none", borderRadius:10, padding:"12px 0",
                    fontWeight:700, fontSize:15, cursor:loading?"default":"pointer",
                    transition:"all 0.3s",
                  }}
                >
                  {loading ? "Verificando…" : "Continuar →"}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="pin" {...fadeIn}>
                <button onClick={() => { setPaso("empleado"); setPin(""); setErr("") }}
                  style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, marginBottom:16, padding:0, transition:"color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.text}
                  onMouseLeave={e => e.target.style.color = C.muted}
                >← Cambiar número</button>
                <div style={{ color:C.text, fontWeight:700, fontSize:19, marginBottom:4 }}>Ingresa tu PIN</div>
                <div style={{ color:C.muted, fontSize:13, marginBottom:24 }}>Ingresa tu PIN de acceso · <strong style={{ color:C.accent }}>{empleado}</strong></div>
                <div style={{ marginBottom:20 }}>
                  <label style={{ display:"block", color:C.textSub, fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>PIN *</label>
                  <input type="password" placeholder="••••••" value={pin}
                    onChange={e => { setPin(e.target.value); setErr("") }}
                    onKeyDown={e => e.key === "Enter" && entrar()}
                    onFocus={inputFocus} onBlur={inputBlur}
                    autoFocus style={inputStyle}
                  />
                  {err && <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} style={{ color:C.danger, fontSize:12, marginTop:6 }}>{err}</motion.div>}
                </div>
                <motion.button
                  whileHover={{ scale:1.01, boxShadow:`0 0 20px ${C.accentGlow}` }}
                  whileTap={{ scale:0.98 }}
                  onClick={entrar} disabled={loading}
                  style={{
                    width:"100%",
                    background: loading ? C.surface2 : `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                    color: loading ? C.muted : "#fff",
                    border:"none", borderRadius:10, padding:"12px 0",
                    fontWeight:700, fontSize:15, cursor:loading?"default":"pointer",
                    transition:"all 0.3s",
                  }}
                >
                  {loading ? "Verificando…" : "Entrar →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div style={{ textAlign:"center", marginTop:20, color:C.muted, fontSize:12 }}>
          ¿Problemas para ingresar? Contacta al taller.
        </div>
      </motion.div>
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
      if (ROLES_ADMIN.includes(s.rol)) setVista('dashboard')
      else if (s.rol === ROL_TECNICO) setVista('tecnico')
      else setVista('portal')
    } else {
      setVista('login')
    }
  }, [])

  const onLogin = u => {
    setUsuario(u)
    if (ROLES_ADMIN.includes(u.rol)) setVista('dashboard')
    else if (u.rol === ROL_TECNICO) setVista('tecnico')
    else setVista('portal')
  }

  const salir = () => {
    cerrarSesion()
    setUsuario(null)
    setVista('login')
  }

  if (vista === 'cargando') return null
  if (vista === 'login')    return <PantallaLogin onLogin={onLogin} />
  if (vista === 'portal')   return <PortalSolicitante usuario={usuario} onSalir={salir} />
  if (vista === 'tecnico')  return <TecnicoPortal usuario={usuario} onSalir={salir} />
  if (vista === 'dashboard') return <TallerDashboard usuario={usuario} onCapturarManual={() => setVista('manual')} onSalir={salir} />
  if (vista === 'manual')   return <CapturaManual usuario={usuario} onVolver={() => setVista('dashboard')} />
  return null
}
