import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#0F1117", surface:"#181C25", border:"#242935",
  accent:"#3B82F6", success:"#22C55E", muted:"#6B7280",
  text:"#F1F5F9", textSub:"#94A3B8",
};

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_CORTO = ["Lu","Ma","Mi","Ju","Vi","Sa","Do"];

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function startDayOfWeek(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }
function pad(n) { return String(n).padStart(2, "0"); }
function toISO(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

export default function DatePicker({ value, onChange, placeholder = "Seleccionar fecha", style = {} }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const hoy = new Date();
  const todayISO = toISO(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  const [viewY, setVY] = useState(() => value ? Number(value.slice(0, 4)) : hoy.getFullYear());
  const [viewM, setVM] = useState(() => value ? Number(value.slice(5, 7)) - 1 : hoy.getMonth());

  useEffect(() => {
    if (open && value) {
      setVY(Number(value.slice(0, 4)));
      setVM(Number(value.slice(5, 7)) - 1);
    }
  }, [open, value]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const prevMonth = () => { if (viewM === 0) { setVM(11); setVY(viewY - 1); } else setVM(viewM - 1); };
  const nextMonth = () => { if (viewM === 11) { setVM(0); setVY(viewY + 1); } else setVM(viewM + 1); };
  const irHoy = () => { setVY(hoy.getFullYear()); setVM(hoy.getMonth()); };

  const seleccionar = (d) => { onChange(toISO(viewY, viewM, d)); setOpen(false); };
  const limpiar = () => { onChange(""); setOpen(false); };

  const totalDias = daysInMonth(viewY, viewM);
  const offset = startDayOfWeek(viewY, viewM);
  const celdas = [];
  for (let i = 0; i < offset; i++) celdas.push(null);
  for (let d = 1; d <= totalDias; d++) celdas.push(d);

  const display = value
    ? `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}`
    : "";

  return (
    <div ref={ref} style={{ position:"relative", ...style }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          width:"100%", boxSizing:"border-box", background:C.bg,
          border:`1px solid ${open ? C.accent : C.border}`,
          borderRadius:8, padding:"9px 32px 9px 12px", color: display ? C.text : C.muted,
          fontSize:13, cursor:"pointer", position:"relative", userSelect:"none",
        }}
      >
        {display || placeholder}
        <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:C.muted, fontSize:12, pointerEvents:"none" }}>
          {display ? "✕" : "📅"}
        </div>
      </div>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:999,
          background:C.surface, border:`1px solid ${C.border}`, borderRadius:10,
          padding:12, width:280, boxShadow:"0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {/* Header: mes/año */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <button onClick={prevMonth} style={navBtn}>◀</button>
            <span style={{ color:C.text, fontWeight:700, fontSize:13 }}>{MESES[viewM]} {viewY}</span>
            <button onClick={nextMonth} style={navBtn}>▶</button>
          </div>

          {/* Días de la semana */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:6 }}>
            {DIAS_CORTO.map(d => (
              <div key={d} style={{ textAlign:"center", color:C.muted, fontSize:10, fontWeight:600, padding:"4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Celdas del calendario */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {celdas.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const iso = toISO(viewY, viewM, d);
              const isSelected = value === iso;
              const isToday = iso === todayISO;
              return (
                <button
                  key={d}
                  onClick={() => seleccionar(d)}
                  style={{
                    width:"100%", aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center",
                    border: isToday && !isSelected ? `1px solid ${C.accent}` : "1px solid transparent",
                    borderRadius:6, cursor:"pointer", fontSize:12, fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? C.accent : "transparent",
                    color: isSelected ? "#fff" : C.text,
                  }}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Botones rápidos */}
          <div style={{ display:"flex", gap:6, marginTop:10, borderTop:`1px solid ${C.border}`, paddingTop:10 }}>
            <button onClick={irHoy} style={{ flex:1, background:C.border, color:C.text, border:"none", borderRadius:6, padding:"5px 0", cursor:"pointer", fontSize:11, fontWeight:600 }}>Hoy</button>
            <button onClick={limpiar} style={{ flex:1, background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 0", cursor:"pointer", fontSize:11, fontWeight:600 }}>Limpiar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const navBtn = {
  background:"none", border:"none", color:C.textSub, cursor:"pointer",
  fontSize:12, fontWeight:700, padding:"4px 8px", borderRadius:4,
};
