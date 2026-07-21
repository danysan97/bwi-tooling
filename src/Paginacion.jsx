import { C } from "./theme.js";

const btnStyle = (disabled) => ({
  width: 30, height: 30, borderRadius: 6,
  border: `1px solid ${C.border}`,
  background: "transparent",
  color: disabled ? C.border : C.text,
  cursor: disabled ? "default" : "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 14, transition: "all 0.15s",
});

const selectStyle = {
  background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
  color: C.text, fontSize: 12, padding: "4px 6px", cursor: "pointer",
};

export default function Paginacion({ total, pagina, porPagina, onCambio, onPorPaginaChange, opciones = [30, 50] }) {
  const totalPaginas = porPagina >= total ? 1 : Math.ceil(total / porPagina);
  const esUltima = pagina >= totalPaginas;
  const esPrimera = pagina <= 1;

  if (total === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <button disabled={esPrimera} onClick={() => !esPrimera && onCambio(pagina - 1)} style={btnStyle(esPrimera)}>◀</button>
        <span style={{ color: C.textSub, fontSize: 12 }}>
          Página <span style={{ color: C.text, fontWeight: 700 }}>{Math.min(pagina, totalPaginas)}</span> de <span style={{ color: C.text, fontWeight: 700 }}>{totalPaginas}</span>
        </span>
        <button disabled={esUltima} onClick={() => !esUltima && onCambio(pagina + 1)} style={btnStyle(esUltima)}>▶</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.muted, fontSize: 11 }}>{total} resultado{total !== 1 ? "s" : ""}</span>
        {onPorPaginaChange && (
          <select value={porPagina} onChange={e => { const v = Number(e.target.value); onPorPaginaChange(v); if (pagina > Math.ceil(total / v)) onCambio(Math.ceil(total / v) || 1); }} style={selectStyle}>
            {[...opciones, 0].map(v => (
              <option key={v} value={v}>{v === 0 ? "Todos" : `${v} / pág`}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
