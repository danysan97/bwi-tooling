-- ================================================================
-- BWI TOOLROOM — DOCUMENTACIÓN DE BASE DE DATOS
-- Versión: 5.0
-- Fecha: Julio 2026
-- Descripción: Comandos SQL para mantenimiento, administración
--              y operación de la base de datos del sistema.
-- ================================================================
-- IMPORTANTE: Ejecutar estos comandos desde el SQL Editor de
-- Supabase (https://supabase.com/dashboard → tu proyecto → SQL)
-- ================================================================


-- ================================================================
-- 1. ESTRUCTURA DE TABLAS (REFERENCIA)
-- ================================================================

-- 1.1 Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  no_empleado      VARCHAR(20) UNIQUE NOT NULL,
  nombre_completo  VARCHAR(150) NOT NULL,
  email            VARCHAR(255),
  password_hash    TEXT,
  rol              VARCHAR(20) NOT NULL CHECK (rol IN ('superadmin','administrador','tecnico','solicitante')),
  area_codigo      INTEGER REFERENCES areas(codigo),
  departamento     VARCHAR(100),
  pin_acceso       TEXT,
  turno            VARCHAR(10) DEFAULT 'primero' CHECK (turno IN ('primero','segundo')),
  activo           BOOLEAN DEFAULT TRUE,
  creado_en        TIMESTAMP DEFAULT NOW(),
  actualizado_en   TIMESTAMP DEFAULT NOW()
);

-- 1.2 Tabla de órdenes de trabajo
CREATE TABLE IF NOT EXISTS ordenes_trabajo (
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
  prioridad         VARCHAR(30) NOT NULL DEFAULT '5_fabricacion',
  estado            VARCHAR(20) NOT NULL DEFAULT 'nueva_orden',
  archivo_url       TEXT,
  archivo_nombre    VARCHAR(255),
  es_orden_manual   BOOLEAN DEFAULT FALSE,
  capturado_por_id  UUID REFERENCES usuarios(id),
  autorizada        BOOLEAN,
  autorizado_por    UUID REFERENCES usuarios(id),
  nombre_autoriza   VARCHAR(150),
  puesto_autoriza   VARCHAR(100),
  motivo_rechazo    TEXT,
  folio_queja       VARCHAR(50),
  entregada         BOOLEAN DEFAULT FALSE,
  creado_en         TIMESTAMP DEFAULT NOW(),
  actualizado_en    TIMESTAMP DEFAULT NOW()
);

-- 1.3 Tabla de seguimiento (multi-técnico)
CREATE TABLE IF NOT EXISTS seguimiento_orden (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id         INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  tecnico_id       UUID REFERENCES usuarios(id),
  fecha_inicio     DATE,
  fecha_termino    DATE,
  tiempo_real_hrs  DECIMAL(6,2),
  material_id      INTEGER REFERENCES materiales(id),
  material_otro    VARCHAR(100),
  comentarios      TEXT,
  actualizado_por  UUID NOT NULL REFERENCES usuarios(id),
  fecha_registro   TIMESTAMP DEFAULT NOW()
);

-- 1.4 Tabla de historial
CREATE TABLE IF NOT EXISTS historial_orden (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id         INTEGER NOT NULL REFERENCES ordenes_trabajo(no_orden),
  evento_tipo      VARCHAR(30) NOT NULL,
  detalle          TEXT,
  registrado_por   UUID REFERENCES usuarios(id),
  metadatos        JSONB,
  fecha_evento     TIMESTAMP DEFAULT NOW()
);

-- 1.5 Tabla de materiales
CREATE TABLE IF NOT EXISTS materiales (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(100) NOT NULL,
  activo  BOOLEAN DEFAULT TRUE
);

-- 1.6 Tabla de áreas
CREATE TABLE IF NOT EXISTS areas (
  codigo   INTEGER PRIMARY KEY,
  nombre   VARCHAR(200) NOT NULL,
  activo   BOOLEAN DEFAULT TRUE
);

-- 1.7 Tipos ENUM
CREATE TYPE prioridad_orden AS ENUM (
  '1_seguridad', '2_queja_cliente', '3_maquina_parada',
  '4_trabajo_rapido', '5_fabricacion'
);

CREATE TYPE estado_orden AS ENUM (
  'nueva_orden', 'en_proceso', 'terminada', 'cancelada'
);

CREATE TYPE tipo_evento_orden AS ENUM (
  'recepcion', 'asignacion', 'inicio', 'comentario',
  'autorizacion', 'cambio_estado', 'material', 'terminado', 'entrega'
);


-- ================================================================
-- 2. GESTIÓN DE USUARIOS
-- ================================================================

-- 2.1 CREAR USUARIO (vía función RPC — recomendado)
-- Parámetros: no_empleado, nombre, email, contraseña, rol, departamento, turno
SELECT crear_usuario_admin(
  '12345',                          -- número de empleado
  'Juan Pérez García',              -- nombre completo
  'juan.perez@bwi.com',             -- email (opcional)
  'MiContraseña123',                -- contraseña (se guarda como bcrypt)
  'administrador',                  -- rol: superadmin/administrador/tecnico/solicitante
  'Toolroom',                       -- departamento
  'primero'                         -- turno: primero/segundo
);

-- 2.2 CREAR USUARIO TÉCNICO
SELECT crear_usuario_admin(
  '31292',
  'Carlos Méndez López',
  NULL,
  '1234',                           -- PIN de 4 dígitos
  'tecnico',
  'Toolroom',
  'primero'
);

-- 2.3 CREAR USUARIO SOLICITANTE
SELECT crear_usuario_admin(
  '50001',
  'María García Ruiz',
  NULL,
  '5678',
  'solicitante',
  'Producción',
  'primero'
);

-- 2.4 CREAR SUPERADMIN (respaldo)
SELECT crear_usuario_admin(
  'TOOLING01',
  'Admin Sistema',
  NULL,
  'admin123',
  'superadmin',
  'Toolroom',
  'primero'
);


-- 2.5 CAMBIAR CONTRASEÑA / PIN DE UN USUARIO
-- Opción A: Usar la función RPC (genera hash bcrypt automáticamente)
SELECT cambiar_pin(
  (SELECT id FROM usuarios WHERE no_empleado = '12345'),  -- UUID del usuario
  '9876'                                                   -- nuevo PIN de 4 dígitos
);

-- Opción B: Cambiar contraseña directamente (hash manual)
-- Primero generar el hash con bcrypt: https://bcrypt-generator.com/
-- Luego ejecutar:
UPDATE usuarios
SET password_hash = '$2b$10$GENERADO_AQUI',  -- hash bcrypt de la nueva contraseña
    actualizado_en = NOW()
WHERE no_empleado = '12345';

-- Opción C: Cambiar PIN directamente
UPDATE usuarios
SET pin_acceso = '$2b$10$GENERADO_AQUI',     -- hash bcrypt del nuevo PIN
    actualizado_en = NOW()
WHERE no_empleado = '12345';


-- 2.6 LISTAR TODOS LOS USUARIOS
SELECT
  no_empleado,
  nombre_completo,
  rol,
  departamento,
  turno,
  activo,
  CASE WHEN pin_acceso IS NOT NULL THEN 'Sí' ELSE 'No' END AS tiene_pin,
  CASE WHEN password_hash IS NOT NULL THEN 'Sí' ELSE 'No' END AS tiene_contrasena,
  creado_en
FROM usuarios
ORDER BY rol, nombre_completo;


-- 2.7 LISTAR USUARIOS POR ROL
-- Técnicos
SELECT no_empleado, nombre_completo, turno, activo, departamento
FROM usuarios WHERE rol = 'tecnico' ORDER BY nombre_completo;

-- Administradores
SELECT no_empleado, nombre_completo, activo
FROM usuarios WHERE rol = 'administrador' ORDER BY nombre_completo;

-- Solicitantes
SELECT no_empleado, nombre_completo, departamento, activo
FROM usuarios WHERE rol = 'solicitante' ORDER BY nombre_completo;


-- 2.8 ACTIVAR / DESACTIVAR USUARIO
UPDATE usuarios SET activo = TRUE  WHERE no_empleado = '12345';  -- activar
UPDATE usuarios SET activo = FALSE WHERE no_empleado = '12345';  -- desactivar


-- 2.9 CAMBIAR ROL DE UN USUARIO
UPDATE usuarios
SET rol = 'administrador',
    actualizado_en = NOW()
WHERE no_empleado = '12345';


-- 2.10 CAMBIAR TURNO DE UN USUARIO
UPDATE usuarios
SET turno = 'segundo',        -- primero (8h) o segundo (7.5h)
    actualizado_en = NOW()
WHERE no_empleado = '12345';


-- 2.11 ELIMINAR USUARIO (cuidado — usar solo si no tiene órdenes asociadas)
-- Primero verificar:
SELECT COUNT(*) AS ordenes_asociadas
FROM seguimiento_orden s
JOIN usuarios u ON s.tecnico_id = u.id
WHERE u.no_empleado = '12345';

-- Si count = 0, se puede eliminar:
DELETE FROM usuarios WHERE no_empleado = '12345';

-- Si tiene órdenes, mejor desactivar:
-- UPDATE usuarios SET activo = FALSE WHERE no_empleado = '12345';


-- 2.12 RESET DE PIN (borrar PIN para que vuelva a pedir)
UPDATE usuarios
SET pin_acceso = NULL,
    actualizado_en = NOW()
WHERE no_empleado = '12345';


-- 2.13 VERIFICAR LOGIN (prueba)
-- Probando credenciales de admin:
SELECT * FROM verificar_login('12345', 'MiContraseña123', 'administrador');

-- Probando PIN de técnico:
SELECT * FROM verificar_login('31292', '1234', 'tecnico');


-- ================================================================
-- 3. GESTIÓN DE MATERIALES
-- ================================================================

-- 3.1 AGREGAR MATERIAL
INSERT INTO materiales (nombre, activo) VALUES ('Acero al carbono', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Aluminio 6061', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Bronce', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('HSS (Acero rápido)', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Carburo de tungsteno', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Stainless Steel 304', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Plástico (Delrin)', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Goma / Neopreno', TRUE);

-- 3.2 LISTAR MATERIALES
SELECT id, nombre, activo FROM materiales ORDER BY nombre;

-- 3.3 DESACTIVAR MATERIAL
UPDATE materiales SET activo = FALSE WHERE id = 5;

-- 3.4 ELIMINAR MATERIAL (solo si no está en uso)
DELETE FROM materiales WHERE id = 5 AND id NOT IN (SELECT material_id FROM seguimiento_orden WHERE material_id = 5);


-- ================================================================
-- 4. GESTIÓN DE ÁREAS
-- ================================================================

-- 4.1 AGREGAR ÁREA
INSERT INTO areas (codigo, nombre, activo) VALUES (1415, 'TALLER MÁQUINAS Y HERRAMIENTAS', TRUE);

-- 4.2 LISTAR ÁREAS
SELECT codigo, nombre, activo FROM areas ORDER BY codigo;

-- 4.3 DESACTIVAR ÁREA
UPDATE areas SET activo = FALSE WHERE codigo = 1415;


-- ================================================================
-- 5. CONSULTAS DE ÓRDENES DE TRABAJO
-- ================================================================

-- 5.1 LISTAR TODAS LAS ÓRDENES CON DETALLE COMPLETO
SELECT *
FROM vista_ordenes
ORDER BY no_orden DESC;

-- 5.2 ÓRDENES POR ESTADO
SELECT no_orden, nombre_pieza, estado, entregada, fecha_solicitud
FROM vista_ordenes
WHERE estado = 'nueva_orden'
ORDER BY fecha_solicitud DESC;

-- 5.3 ÓRDENES SIN S.E.T.C. VÁLIDO
SELECT no_orden, nombre_pieza, setc_numero, estado
FROM vista_ordenes
WHERE setc_numero IS NULL
   OR setc_numero = ''
   OR setc_numero = 'NA'
   OR setc_numero = 'N/A'
   OR LENGTH(setc_numero) != 8
ORDER BY no_orden DESC;

-- 5.4 ÓRDENES PRIORIDAD 1 (SEGURIDAD) ABIERTAS
SELECT no_orden, nombre_pieza, estado, autorizada, fecha_solicitud
FROM vista_ordenes
WHERE prioridad = '1_seguridad'
  AND estado NOT IN ('terminada', 'cancelada')
ORDER BY fecha_solicitud;

-- 5.5 ÓRDENES DEL MES ACTUAL
SELECT COUNT(*) AS total_mes
FROM vista_ordenes
WHERE fecha_solicitud >= DATE_TRUNC('month', NOW());

-- 5.6 HORAS TOTALES REGISTRADAS
SELECT SUM(tiempo_real_hrs) AS horas_totales
FROM vista_ordenes
WHERE tiempo_real_hrs IS NOT NULL;


-- ================================================================
-- 6. CONSULTAS DE SEGUIMIENTO (MULTI-TÉCNICO)
-- ================================================================

-- 6.1 SEGUIMIENTO DE UNA ORDEN ESPECÍFICA
SELECT
  s.tecnico_id,
  u.nombre_completo AS tecnico,
  s.fecha_inicio,
  s.fecha_termino,
  s.tiempo_real_hrs,
  m.nombre AS material,
  s.material_otro,
  s.comentarios
FROM seguimiento_orden s
LEFT JOIN usuarios u ON s.tecnico_id = u.id
LEFT JOIN materiales m ON s.material_id = m.id
WHERE s.orden_id = 12345
ORDER BY u.nombre_completo;

-- 6.2 ÓRDENES ASIGNADAS A UN TÉCNICO
SELECT
  s.orden_id,
  o.nombre_pieza,
  o.estado,
  s.fecha_inicio,
  s.fecha_termino,
  s.tiempo_real_hrs
FROM seguimiento_orden s
JOIN ordenes_trabajo o ON s.orden_id = o.no_orden
WHERE s.tecnico_id = (SELECT id FROM usuarios WHERE no_empleado = '31292')
ORDER BY s.fecha_inicio DESC;

-- 6.3 HORAS TRABAJADAS POR TÉCNICO (RANGO DE FECHAS)
SELECT
  u.nombre_completo,
  u.turno,
  SUM(s.tiempo_real_hrs) AS horas_totales,
  COUNT(s.orden_id) AS total_ordenes
FROM seguimiento_orden s
JOIN usuarios u ON s.tecnico_id = u.id
WHERE s.fecha_inicio BETWEEN '2026-07-01' AND '2026-07-31'
GROUP BY u.nombre_completo, u.turno
ORDER BY horas_totales DESC;


-- ================================================================
-- 7. CONSULTAS DE HISTORIAL
-- ================================================================

-- 7.1 HISTORIAL COMPLETO DE UNA ORDEN
SELECT
  h.fecha_evento,
  h.evento_tipo,
  h.detalle,
  u.nombre_completo AS registrado_por,
  h.metadatos
FROM historial_orden h
LEFT JOIN usuarios u ON h.registrado_por = u.id
WHERE h.orden_id = 12345
ORDER BY h.fecha_evento ASC;

-- 7.2 ÚLTIMOS 20 EVENTOS DEL SISTEMA
SELECT
  h.orden_id,
  o.nombre_pieza,
  h.evento_tipo,
  h.detalle,
  u.nombre_completo,
  h.fecha_evento
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
LEFT JOIN usuarios u ON h.registrado_por = u.id
ORDER BY h.fecha_evento DESC
LIMIT 20;

-- 7.3 CONTAR EVENTOS POR TIPO
SELECT
  evento_tipo,
  COUNT(*) AS total
FROM historial_orden
GROUP BY evento_tipo
ORDER BY total DESC;


-- ================================================================
-- 8. ESTADÍSTICAS Y KPIs
-- ================================================================

-- 8.1 RESUMEN POR ESTADO
SELECT
  estado,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE entregada = TRUE) AS entregadas
FROM ordenes_trabajo
GROUP BY estado;

-- 8.2 ÓRDENES POR PRIORIDAD
SELECT
  prioridad,
  COUNT(*) AS total
FROM ordenes_trabajo
GROUP BY prioridad
ORDER BY prioridad;

-- 8.3 TOP 5 TÉCNICOS POR HORAS (MES ACTUAL)
SELECT
  u.nombre_completo,
  u.turno,
  SUM(s.tiempo_real_hrs) AS horas,
  COUNT(s.orden_id) AS ordenes
FROM seguimiento_orden s
JOIN usuarios u ON s.tecnico_id = u.id
WHERE s.fecha_inicio >= DATE_TRUNC('month', NOW())
GROUP BY u.nombre_completo, u.turno
ORDER BY horas DESC
LIMIT 5;

-- 8.4 APROVECHAMIENTO POR TÉCNICO (MES)
WITH hrs_tec AS (
  SELECT
    u.id,
    u.nombre_completo,
    u.turno,
    COALESCE(SUM(s.tiempo_real_hrs), 0) AS horas_trabajadas
  FROM usuarios u
  LEFT JOIN seguimiento_orden s ON s.tecnico_id = u.id
    AND s.fecha_inicio >= DATE_TRUNC('month', NOW())
  WHERE u.rol = 'tecnico' AND u.activo = TRUE
  GROUP BY u.id, u.nombre_completo, u.turno
)
SELECT
  nombre_completo,
  turno,
  horas_trabajadas,
  CASE turno
    WHEN 'primero' THEN 160
    WHEN 'segundo' THEN 150
  END AS horas_disponibles,
  ROUND(
    (horas_trabajadas / CASE turno
      WHEN 'primero' THEN 160.0
      WHEN 'segundo' THEN 150.0
    END) * 100
  ) AS aprovechamiento_pct
FROM hrs_tec
ORDER BY aprovechamiento_pct DESC;

-- 8.5 ÓRDENES SIN ASIGNAR (sin seguimiento)
SELECT o.no_orden, o.nombre_pieza, o.estado, o.fecha_solicitud
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.no_orden = s.orden_id
WHERE s.id IS NULL
  AND o.estado NOT IN ('terminada', 'cancelada')
ORDER BY o.fecha_solicitud;

-- 8.6 ÓRDENES PENDIENTES DE AUTORIZACIÓN
SELECT no_orden, nombre_pieza, prioridad, fecha_solicitud
FROM ordenes_trabajo
WHERE prioridad IN ('1_seguridad', '2_queja_cliente')
  AND autorizada IS NULL
  AND estado NOT IN ('terminada', 'cancelada')
ORDER BY prioridad, fecha_solicitud;


-- ================================================================
-- 9. MANTENIMIENTO DE LA VISTA vista_ordenes
-- ================================================================

-- PARA RECREAR LA VISTA (ejecutar si hay errores de columnas):
DROP VIEW IF EXISTS vista_ordenes;

CREATE OR REPLACE VIEW vista_ordenes AS
SELECT
  o.no_orden,
  o.fecha_solicitud,
  o.solicitante_id,
  sol.nombre_completo AS solicitante_nombre,
  sol.no_empleado AS solicitante_empleado,
  a.codigo AS area_codigo,
  a.nombre AS area_nombre,
  o.departamento,
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
  o.autorizada,
  o.autorizado_por,
  o.nombre_autoriza,
  o.puesto_autoriza,
  o.motivo_rechazo,
  o.folio_queja,
  o.entregada,

  -- Datos agregados del seguimiento
  (SELECT MIN(s2.fecha_inicio)   FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_inicio,
  (SELECT MAX(s2.fecha_termino)  FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_termino,
  (SELECT SUM(s2.tiempo_real_hrs) FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS tiempo_real_hrs,

  -- Material
  (SELECT STRING_AGG(
    COALESCE(m2.nombre, s2.material_otro, ''), ', '
  )
   FROM seguimiento_orden s2
   LEFT JOIN materiales m2 ON s2.material_id = m2.id
   WHERE s2.orden_id = o.no_orden) AS material_usado,

  -- Técnicos
  (SELECT STRING_AGG(u2.nombre_completo, ', ')
   FROM seguimiento_orden s2
   JOIN usuarios u2 ON s2.tecnico_id = u2.id
   WHERE s2.orden_id = o.no_orden) AS tecnico_nombre,

  -- Último comentario
  (SELECT s2.comentarios
   FROM seguimiento_orden s2
   WHERE s2.orden_id = o.no_orden
     AND s2.comentarios IS NOT NULL
     AND s2.comentarios != ''
   ORDER BY s2.fecha_registro DESC LIMIT 1) AS comentarios,

  -- Autorización
  ap.nombre_completo AS autorizado_por_nombre,
  ap.puesto AS autorizado_por_puesto

FROM ordenes_trabajo o
LEFT JOIN usuarios sol ON o.solicitante_id = sol.id
LEFT JOIN areas a ON sol.area_codigo = a.codigo
LEFT JOIN usuarios ap ON o.autorizado_por = ap.id;


-- ================================================================
-- 10. SEGURIDAD — RLS (Row Level Security)
-- ================================================================

-- Verificar RLS activo en todas las tablas:
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_activo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'usuarios', 'ordenes_trabajo', 'seguimiento_orden',
    'historial_orden', 'materiales', 'areas'
  );

-- Si RLS no está activo, activarlo:
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_trabajo ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento_orden ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_orden ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;


-- ================================================================
-- 11. BACKUP Y RESTAURACIÓN
-- ================================================================

-- 11.1 EXPORTAR TODA LA BASE (desde Supabase Dashboard):
-- Settings → Database → Backups → Create Backup

-- 11.2 EXPORTAR TABLA ESPECÍFICA (desde SQL):
-- COPY (SELECT * FROM ordenes_trabajo) TO STDOUT WITH CSV HEADER;

-- 11.3 VERIFICAR TAMAÑO DE TABLAS
SELECT
  relname AS tabla,
  pg_size_pretty(pg_total_relation_size(relid)) AS tamano_total
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;


-- ================================================================
-- 12. DIAGNÓSTICO Y TROUBLESHOOTING
-- ================================================================

-- 12.1 VER ERRORES RECIENTES DE LOGIN
-- (Si se agregó una tabla de logs, consultarla aquí)

-- 12.2 VERIFICAR QUE LAS RPC EXISTEN
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'verificar_login', 'crear_usuario_admin',
    'login_sin_pin', 'login_con_pin', 'cambiar_pin'
  );

-- 12.3 VERIFICAR INTEGRIDAD REFERENCIAL
-- Órdenes sin seguimiento (puede ser normal):
SELECT o.no_orden, o.estado
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.no_orden = s.orden_id
WHERE s.id IS NULL;

-- Seguimiento huérfano (no debería existir):
SELECT s.id, s.orden_id
FROM seguimiento_orden s
LEFT JOIN ordenes_trabajo o ON s.orden_id = o.no_orden
WHERE o.no_orden IS NULL;

-- 12.4 VERIFICAR DUPLICADOS DE EMPLEADO
SELECT no_empleado, COUNT(*) AS veces
FROM usuarios
GROUP BY no_empleado
HAVING COUNT(*) > 1;

-- 12.5 VERIFICAR PINs ASIGNADOS
SELECT no_empleado, nombre_completo, rol,
  CASE WHEN pin_acceso IS NOT NULL THEN '✅ Tiene PIN' ELSE '❌ Sin PIN' END AS estado_pin
FROM usuarios
WHERE rol IN ('tecnico', 'solicitante', 'administrador')
ORDER BY rol, nombre_completo;

-- 12.6 VERIFICAR CONTRASEÑAS ASIGNADAS
SELECT no_empleado, nombre_completo, rol,
  CASE WHEN password_hash IS NOT NULL THEN '✅ Tiene contraseña' ELSE '❌ Sin contraseña' END AS estado_pass
FROM usuarios
WHERE rol IN ('administrador', 'superadmin')
ORDER BY rol, nombre_completo;


-- ================================================================
-- 13. CONFIGURACIÓN DE SUPABASE STORAGE (PLANOS)
-- ================================================================

-- El bucket 'planos' se configura desde el Dashboard de Supabase:
-- Storage → New Bucket → Nombre: "planos" → Public: NO → File size limit: 10MB

-- Políticas de storage (ejecutar desde SQL Editor):
-- Permitir upload a usuarios autenticados:
CREATE POLICY "Allow upload for authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'planos');

-- Permitir lectura a usuarios autenticados:
CREATE POLICY "Allow read for authenticated"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'planos');


-- ================================================================
-- 14. PARÁMETROS DEL SISTEMA (HORAS POR TURNO)
-- ================================================================
-- Estos valores están definidos en el frontend (supabase.js y
-- PanelTecnicos.jsx). Para cambiarlos, editar los archivos:
--
-- HRS_DIA = { primero: 8, segundo: 7.5 }
-- HRS_SEMANA = { primero: 40, segundo: 37.5 }
-- HRS_MES = { primero: 160, segundo: 150 }
--
-- También están hardcodeados en ExportarReportes.jsx:
-- const HRS_SEMANA = { primero: 40, segundo: 37.5 };
-- const HRS_MES = { primero: 160, segundo: 150 };


-- ================================================================
-- 15. SCRIPT DE PRUEBA — USUARIOS DE EJEMPLO
-- ================================================================

-- Ejecutar solo si se necesita poblar la BD con datos de prueba:

-- Superadmin
SELECT crear_usuario_admin('TOOLING01', 'Admin Sistema', NULL, 'admin123', 'superadmin', 'Toolroom', 'primero');

-- Administrador
SELECT crear_usuario_admin('10001', 'Roberto Martínez', 'roberto@bwi.com', 'Admin2026!', 'administrador', 'Toolroom', 'primero');

-- Técnicos
SELECT crear_usuario_admin('31292', 'Carlos Méndez', NULL, '1234', 'tecnico', 'Toolroom', 'primero');
SELECT crear_usuario_admin('32102', 'Ana Torres', NULL, '5678', 'tecnico', 'Toolroom', 'primero');
SELECT crear_usuario_admin('39633', 'Luis García', NULL, '9012', 'tecnico', 'Toolroom', 'segundo');
SELECT crear_usuario_admin('35930', 'María López', NULL, '3456', 'tecnico', 'Toolroom', 'primero');

-- Solicitantes
SELECT crear_usuario_admin('50001', 'Pedro Sánchez', NULL, '5678', 'solicitante', 'Producción', 'primero');
SELECT crear_usuario_admin('50002', 'Laura Ramírez', NULL, '9012', 'solicitante', 'Calidad', 'primero');


-- ================================================================
-- FIN DE DOCUMENTACIÓN
-- ================================================================
