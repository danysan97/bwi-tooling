// ── DESIGN SYSTEM: BWI TOOLROOM Premium Dark Theme ───────────
// Inspired by Vercel, Linear, Supabase Dashboard

export const C = {
  bg:       "#0F1117",
  surface:  "#181C25",
  surface2: "#1E2230",
  border:   "#242935",
  borderLight: "#2D3343",
  accent:   "#3B82F6",
  accentHover: "#2563EB",
  accentGlow: "rgba(59,130,246,0.15)",
  success:  "#22C55E",
  successHover: "#16A34A",
  warn:     "#F59E0B",
  danger:   "#EF4444",
  dangerHover: "#DC2626",
  muted:    "#6B7280",
  text:     "#F1F5F9",
  textSub:  "#94A3B8",
  purple:   "#8B5CF6",
  purpleHover: "#7C3AED",
};

// ── Animation variants (Framer Motion) ──────────────────────
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const modalFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const modalScale = {
  initial: { opacity: 0, scale: 0.95, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.15 } },
};

export const slideUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ── Reusable style objects ──────────────────────────────────
export const glassSurface = {
  background: "rgba(24,28,37,0.8)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

export const glowAccent = {
  boxShadow: "0 0 40px rgba(59,130,246,0.12), 0 0 80px rgba(59,130,246,0.06)",
};

// ── Priority colors ─────────────────────────────────────────
export const PRIO_COLOR = {
  "1_seguridad":      C.danger,
  "2_queja_cliente":  C.warn,
  "3_maquina_parada": "#F97316",
  "4_trabajo_rapido":  C.accent,
  "5_fabricacion":    C.muted,
};

export const PRIO_LABEL = {
  "1_seguridad":      "1·Seguridad",
  "2_queja_cliente":  "2·Queja",
  "3_maquina_parada": "3·Máq.parada",
  "4_trabajo_rapido":  "4·Rápido",
  "5_fabricacion":    "5·Fabricación",
};

// ── Status colors ───────────────────────────────────────────
export const EST_COLOR = {
  nueva_orden: C.accent,
  en_proceso:  C.warn,
  terminada:   C.success,
  cancelada:   C.muted,
};

export const EST_LABEL = {
  nueva_orden: "Nueva",
  en_proceso:  "En proceso",
  terminada:   "Terminada",
  cancelada:   "Cancelada",
};
