-- Migracion: historial_orden — reemplaza historial_estados
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tipo de evento
DO $$ BEGIN
  CREATE TYPE tipo_evento_orden AS ENUM (
    'recepcion', 'asignacion', 'inicio', 'comentario',
    'cambio_estado', 'material', 'terminado', 'entrega'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Crear tabla nueva
CREATE TABLE IF NOT EXISTS historial_orden (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id         INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  evento_tipo      tipo_evento_orden NOT NULL,
  estado_anterior  estado_orden,
  estado_nuevo     estado_orden,
  detalle          TEXT,
  creado_por       UUID REFERENCES usuarios(id),
  fecha_evento     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_historial_orden ON historial_orden(orden_id);

-- 3. Migrar datos existentes de historial_estados si existe
DO $$ BEGIN
  INSERT INTO historial_orden (orden_id, evento_tipo, estado_anterior, estado_nuevo, detalle, creado_por, fecha_evento)
  SELECT
    orden_id,
    'cambio_estado'::tipo_evento_orden,
    estado_anterior,
    estado_nuevo,
    COALESCE(comentario, 'Estado cambiado a ' || estado_nuevo::text),
    cambiado_por,
    fecha_cambio
  FROM historial_estados;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 4. Eliminar tabla vieja (opcional, comentar si hay dependencias)
-- DROP TABLE IF EXISTS historial_estados;

-- 5. Habilitar RLS y politique de lectura/escritura
ALTER TABLE historial_orden ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lectura_historial" ON historial_orden
  FOR SELECT USING (true);

CREATE POLICY "escritura_historial" ON historial_orden
  FOR INSERT WITH CHECK (true);
