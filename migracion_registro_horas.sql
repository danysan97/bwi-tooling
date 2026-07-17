-- ============================================================
-- MIGRACIÓN: Registro de horas por sesión/trabajo diario
-- Cada técnico registra horas con fecha específica
-- Las horas suman en la semana/mes que se registraron
-- ============================================================

CREATE TABLE IF NOT EXISTS registro_horas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id      INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  tecnico_id    UUID NOT NULL REFERENCES usuarios(id),
  fecha         DATE NOT NULL,
  horas         DECIMAL(6,2) NOT NULL CHECK (horas > 0),
  comentario    TEXT,
  creado_por    UUID REFERENCES usuarios(id),
  creado_en     TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_registro_horas_orden   ON registro_horas(orden_id);
CREATE INDEX IF NOT EXISTS idx_registro_horas_tecnico  ON registro_horas(tecnico_id);
CREATE INDEX IF NOT EXISTS idx_registro_horas_fecha    ON registro_horas(fecha);

-- ============================================================
-- Vista helper: horas totales por seguimiento
-- ============================================================
CREATE OR REPLACE VIEW v_horas_por_seguimiento AS
SELECT
  orden_id,
  tecnico_id,
  SUM(horas) AS horas_totales,
  MIN(fecha) AS primera_fecha,
  MAX(fecha) AS ultima_fecha,
  COUNT(*)   AS total_registros
FROM registro_horas
GROUP BY orden_id, tecnico_id;

-- ============================================================
-- Vista helper: horas por técnico por semana (ISO)
-- ============================================================
CREATE OR REPLACE VIEW v_horas_semanal_tecnico AS
SELECT
  tecnico_id,
  EXTRACT(YEAR FROM fecha)  AS anio,
  EXTRACT(WEEK FROM fecha)  AS semana,
  SUM(horas)                AS horas_trabajadas,
  COUNT(DISTINCT orden_id)  AS ordenes,
  COUNT(*)                  AS registros
FROM registro_horas
GROUP BY tecnico_id, EXTRACT(YEAR FROM fecha), EXTRACT(WEEK FROM fecha);

-- ============================================================
-- Vista helper: horas por técnico por mes
-- ============================================================
CREATE OR REPLACE VIEW v_horas_mensual_tecnico AS
SELECT
  tecnico_id,
  EXTRACT(YEAR FROM fecha)  AS anio,
  EXTRACT(MONTH FROM fecha) AS mes,
  SUM(horas)                AS horas_trabajadas,
  COUNT(DISTINCT orden_id)  AS ordenes,
  COUNT(*)                  AS registros
FROM registro_horas
GROUP BY tecnico_id, EXTRACT(YEAR FROM fecha), EXTRACT(MONTH FROM fecha);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
ALTER TABLE registro_horas ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden leer
CREATE POLICY "registro_horas_select" ON registro_horas
  FOR SELECT USING (auth.role() = 'authenticated');

-- Solo autenticados pueden insertar
CREATE POLICY "registro_horas_insert" ON registro_horas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Solo autenticados pueden actualizar (propios registros o admin)
CREATE POLICY "registro_horas_update" ON registro_horas
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Solo autenticados pueden eliminar
CREATE POLICY "registro_horas_delete" ON registro_horas
  FOR DELETE USING (auth.role() = 'authenticated');
