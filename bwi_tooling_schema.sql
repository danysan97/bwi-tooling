-- ============================================================
--  BWI — DEPARTAMENTO DE TOOLING
--  Sistema de Órdenes de Trabajo
--  PostgreSQL / Supabase  |  Versión 3.0
--
--  ACCESOS:
--    Solicitantes / Técnicos → solo número de empleado
--    Administrador / Superadmin → número de empleado + PIN
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. CATÁLOGOS
-- ============================================================

CREATE TABLE areas (
  codigo  INTEGER PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  activo  BOOLEAN DEFAULT TRUE
);

INSERT INTO areas (codigo, nombre) VALUES
  (1401, 'IAMM/FRHC SALARY INDIRECT'),
  (1403, 'MRD/MRF SALARY INDIRECT'),
  (1407, 'RTA (MR/PASIVE/BMW) SALARY INDIRECT'),
  (1410, 'BI-STATE SALARY INDIRECT'),
  (1411, 'INGENIERIA AMBIENTAL'),
  (1414, 'MANTENIMIENTO PLANTA'),
  (1415, 'TALLER MÁQUINAS Y HERRAMIENTAS'),
  (1421, 'PASIVE TT/BMW SALARY INDIRECT'),
  (1440, 'INGENIERÍA'),
  (1441, 'NUEVOS PROYECTOS'),
  (1601, 'RECURSOS HUMANOS');

CREATE TABLE materiales (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL UNIQUE,
  activo  BOOLEAN DEFAULT TRUE
);

INSERT INTO materiales (nombre) VALUES
  ('Acero 4140'),
  ('Acero 1045'),
  ('Acero inoxidable'),
  ('Bronce'),
  ('Aluminio'),
  ('Hierro gris'),
  ('Nylon'),
  ('En base a muestra');

-- ============================================================
-- 2. USUARIOS
-- ============================================================

CREATE TYPE rol_usuario AS ENUM (
  'superadmin',    -- PIN obligatorio. Control total.
  'administrador', -- PIN obligatorio. Gestión de órdenes.
  'tecnico',       -- Sin PIN. Ve sus órdenes asignadas.
  'solicitante'    -- Sin PIN. Crea órdenes, ve las suyas.
);

CREATE TABLE usuarios (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  no_empleado      VARCHAR(20)  NOT NULL UNIQUE,
  nombre_completo  VARCHAR(150) NOT NULL,
  rol              rol_usuario  NOT NULL DEFAULT 'solicitante',
  area_codigo      INTEGER REFERENCES areas(codigo),
  departamento     VARCHAR(100),
  -- PIN solo para administrador y superadmin (NULL para los demás)
  pin_hash         TEXT,
  debe_cambiar_pin BOOLEAN DEFAULT FALSE,
  activo           BOOLEAN DEFAULT TRUE,
  creado_en        TIMESTAMP DEFAULT NOW(),
  ultimo_acceso    TIMESTAMP
);

-- ── Superusuario inicial
-- PIN: 123456  →  cámbialo en tu primer login
INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento, pin_hash, debe_cambiar_pin)
VALUES (
  'TOOLING01',
  'Administrador Tooling BWI',
  'superadmin',
  1415,
  'TALLER MÁQUINAS Y HERRAMIENTAS',
  crypt('123456', gen_salt('bf')),
  TRUE
);

-- ============================================================
-- 3. FUNCIONES DE AUTENTICACIÓN
-- ============================================================

-- Login para solicitantes y técnicos (solo número de empleado)
CREATE OR REPLACE FUNCTION login_sin_pin(p_no_empleado VARCHAR)
RETURNS TABLE (
  id               UUID,
  no_empleado      VARCHAR,
  nombre_completo  VARCHAR,
  rol              rol_usuario,
  area_codigo      INTEGER,
  departamento     VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.no_empleado, u.nombre_completo,
         u.rol, u.area_codigo, u.departamento
  FROM usuarios u
  WHERE u.no_empleado = p_no_empleado
    AND u.rol IN ('solicitante', 'tecnico')
    AND u.activo = TRUE;

  UPDATE usuarios SET ultimo_acceso = NOW()
  WHERE no_empleado = p_no_empleado
    AND rol IN ('solicitante', 'tecnico')
    AND activo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Login para administradores y superadmin (número + PIN)
CREATE OR REPLACE FUNCTION login_con_pin(p_no_empleado VARCHAR, p_pin VARCHAR)
RETURNS TABLE (
  id               UUID,
  no_empleado      VARCHAR,
  nombre_completo  VARCHAR,
  rol              rol_usuario,
  area_codigo      INTEGER,
  departamento     VARCHAR,
  debe_cambiar_pin BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.no_empleado, u.nombre_completo,
         u.rol, u.area_codigo, u.departamento, u.debe_cambiar_pin
  FROM usuarios u
  WHERE u.no_empleado = p_no_empleado
    AND u.pin_hash = crypt(p_pin, u.pin_hash)
    AND u.rol IN ('administrador', 'superadmin')
    AND u.activo = TRUE;

  UPDATE usuarios SET ultimo_acceso = NOW()
  WHERE no_empleado = p_no_empleado
    AND pin_hash = crypt(p_pin, pin_hash)
    AND rol IN ('administrador', 'superadmin')
    AND activo = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cambiar PIN (solo admins)
CREATE OR REPLACE FUNCTION cambiar_pin(p_usuario_id UUID, p_pin_nuevo VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE usuarios
  SET pin_hash = crypt(p_pin_nuevo, gen_salt('bf')),
      debe_cambiar_pin = FALSE
  WHERE id = p_usuario_id
    AND rol IN ('administrador', 'superadmin')
    AND activo = TRUE;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. ÓRDENES DE TRABAJO
-- ============================================================

CREATE TYPE prioridad_orden AS ENUM (
  '1_seguridad',
  '2_queja_cliente',
  '3_maquina_parada',
  '4_trabajo_rapido',
  '5_fabricacion'
);

CREATE TYPE estado_orden AS ENUM (
  'nueva_orden',
  'en_proceso',
  'terminada',
  'cancelada',
  'entregada'
);

CREATE TABLE ordenes_trabajo (
  no_orden          SERIAL PRIMARY KEY,
  fecha_solicitud   TIMESTAMP DEFAULT NOW(),
  solicitante_id    UUID NOT NULL REFERENCES usuarios(id),
  nombre_pieza      VARCHAR(200) NOT NULL,
  setc_numero       VARCHAR(50),
  no_plano          VARCHAR(100),
  no_maquina        VARCHAR(100),
  linea_celda       VARCHAR(100),
  cantidad          INTEGER NOT NULL DEFAULT 1,
  descripcion       TEXT NOT NULL,
  prioridad         prioridad_orden NOT NULL DEFAULT '5_fabricacion',
  estado            estado_orden NOT NULL DEFAULT 'nueva_orden',
  archivo_url       TEXT,
  archivo_nombre    VARCHAR(255),
  es_orden_manual   BOOLEAN DEFAULT FALSE,
  capturado_por_id  UUID REFERENCES usuarios(id),
  autorizada        BOOLEAN,
  autorizado_por    UUID REFERENCES usuarios(id),
  motivo_rechazo    TEXT,
  folio_queja       VARCHAR(50),
  entregada         BOOLEAN DEFAULT FALSE,
  creado_en         TIMESTAMP DEFAULT NOW(),
  actualizado_en    TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 5. SEGUIMIENTO
-- ============================================================

CREATE TABLE seguimiento_orden (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id         INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  fecha_inicio     DATE,
  fecha_termino    DATE,
  tiempo_real_hrs  DECIMAL(6,2),
  tecnico_id       UUID REFERENCES usuarios(id),
  material_id      INTEGER REFERENCES materiales(id),
  material_otro    VARCHAR(100),
  comentarios      TEXT,
  actualizado_por  UUID NOT NULL REFERENCES usuarios(id),
  fecha_registro   TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 6. HISTORIAL DE ESTADOS
-- ============================================================

CREATE TYPE tipo_evento_orden AS ENUM (
  'recepcion',
  'asignacion',
  'inicio',
  'comentario',
  'autorizacion',
  'cambio_estado',
  'material',
  'terminado',
  'entrega'
);

CREATE TABLE historial_orden (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id         INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  evento_tipo      tipo_evento_orden NOT NULL,
  estado_anterior  estado_orden,
  estado_nuevo     estado_orden,
  detalle          TEXT,
  creado_por       UUID REFERENCES usuarios(id),
  fecha_evento     TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 7. TRIGGER — timestamp automático
-- ============================================================

CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ordenes_actualizado
  BEFORE UPDATE ON ordenes_trabajo
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================================
-- 8. VISTAS PARA REPORTES Y GRÁFICAS
-- ============================================================

CREATE VIEW vista_ordenes AS
SELECT
  o.no_orden,
  o.fecha_solicitud,
  o.nombre_pieza,
  o.setc_numero,
  o.no_plano,
  o.no_maquina,
  o.linea_celda,
  o.cantidad,
  o.descripcion,
  o.prioridad,
  o.estado,
  o.archivo_url,
  o.archivo_nombre,
  o.es_orden_manual,
  o.solicitante_id,
  o.autorizada,
  o.folio_queja,
  o.entregada,
  u.nombre_completo    AS solicitante_nombre,
  u.no_empleado        AS solicitante_empleado,
  a.nombre             AS area_nombre,
  a.codigo             AS area_codigo,
  u.departamento,
  (SELECT MIN(s2.fecha_inicio)   FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_inicio,
  (SELECT MAX(s2.fecha_termino)  FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_termino,
  (SELECT SUM(s2.tiempo_real_hrs) FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS tiempo_real_hrs,
  (SELECT string_agg(s2.comentarios, ' | ' ORDER BY s2.fecha_registro)
   FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden AND s2.comentarios IS NOT NULL AND s2.comentarios != '') AS comentarios,
  (SELECT string_agg(t2.nombre_completo, ', ' ORDER BY s2.fecha_registro)
   FROM seguimiento_orden s2 JOIN usuarios t2 ON s2.tecnico_id = t2.id
   WHERE s2.orden_id = o.no_orden) AS tecnico_nombre,
  (SELECT array_agg(s2.tecnico_id ORDER BY s2.fecha_registro)
   FROM seguimiento_orden s2
   WHERE s2.orden_id = o.no_orden AND s2.tecnico_id IS NOT NULL) AS tecnico_ids,
  (SELECT string_agg(COALESCE(m2.nombre, s2.material_otro), ', ' ORDER BY s2.fecha_registro)
   FROM seguimiento_orden s2 LEFT JOIN materiales m2 ON s2.material_id = m2.id
   WHERE s2.orden_id = o.no_orden AND COALESCE(m2.nombre, s2.material_otro) IS NOT NULL) AS material_usado,
  ap.nombre_completo    AS autorizado_por_nombre,
  ap.departamento       AS autorizado_por_puesto,
  o.motivo_rechazo
FROM ordenes_trabajo o
JOIN  usuarios u        ON o.solicitante_id = u.id
LEFT JOIN areas a       ON u.area_codigo    = a.codigo
LEFT JOIN usuarios ap   ON o.autorizado_por = ap.id;

CREATE VIEW grafica_ordenes_por_mes AS
SELECT
  DATE_TRUNC('month', fecha_solicitud) AS mes,
  estado,
  COUNT(*) AS total
FROM ordenes_trabajo
GROUP BY mes, estado
ORDER BY mes DESC;

CREATE VIEW grafica_carga_tecnico AS
SELECT
  t.nombre_completo        AS tecnico,
  COUNT(*)                 AS total_ordenes,
  ROUND(AVG(s.tiempo_real_hrs), 2) AS promedio_hrs
FROM seguimiento_orden s
JOIN usuarios t ON s.tecnico_id = t.id
GROUP BY t.nombre_completo
ORDER BY total_ordenes DESC;

CREATE VIEW grafica_prioridades AS
SELECT
  prioridad,
  estado,
  COUNT(*) AS total
FROM ordenes_trabajo
GROUP BY prioridad, estado
ORDER BY prioridad;

-- ============================================================
-- 9. ÍNDICES
-- ============================================================

CREATE INDEX idx_ordenes_estado       ON ordenes_trabajo(estado);
CREATE INDEX idx_ordenes_prioridad    ON ordenes_trabajo(prioridad);
CREATE INDEX idx_ordenes_solicitante  ON ordenes_trabajo(solicitante_id);
CREATE INDEX idx_ordenes_fecha        ON ordenes_trabajo(fecha_solicitud);
CREATE INDEX idx_historial_orden      ON historial_orden(orden_id);
CREATE INDEX idx_usuarios_empleado    ON usuarios(no_empleado);

-- ============================================================
-- FIN DEL ESQUEMA  v3.0
-- ============================================================
--
--  SUPERUSUARIO INICIAL:
--    No. empleado : TOOLING01
--    PIN          : 123456
--    ⚠️  Cámbialo en tu primer login.
--
--  AGREGAR ADMIN:
--    INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento, pin_hash, debe_cambiar_pin)
--    VALUES ('33731', 'Carlos Ponce', 'administrador', 1415, 'Tooling', crypt('123456', gen_salt('bf')), TRUE);
--
--  AGREGAR SOLICITANTE (sin PIN):
--    INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento)
--    VALUES ('33800', 'Juan Pérez', 'solicitante', 1440, 'Ingeniería');
--
-- ============================================================
