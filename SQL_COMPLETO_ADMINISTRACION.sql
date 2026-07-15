-- ================================================================
-- BWI TOOLROOM — REFERENCIA COMPLETA DE SQL
-- Versión: 5.0
-- Fecha: Julio 2026
--
-- Este archivo contiene TODOS los comandos SQL útiles para
-- administrar la base de datos del sistema BWI TOOLROOM.
--
-- IMPORTANTE: Ejecutar estos comandos desde el SQL Editor de
-- Supabase (https://supabase.com/dashboard → tu proyecto → SQL)
--
-- ORDEN RECOMENDADO:
--   1. Revisar sección 1 (estructura) para entender las tablas
--   2. Usar secciones 2-5 para gestión de usuarios
--   3. Usar sección 6 para materiales y áreas
--   4. Usar sección 7 para consultas de órdenes
--   5. Usar sección 8 para estadísticas y KPIs
--   6. Usar sección 9 para diagnóstico
--   7. Usar sección 10 para mantenimiento de la vista
--   8. Usar sección 11 para migraciones
--   9. Usar sección 12 para configuración avanzada
-- ================================================================


-- ================================================================
-- 1. ESTRUCTURA DE TABLAS (REFERENCIA RÁPIDA)
-- ================================================================
-- Ejecutar solo para verificar que las tablas existen.

-- 1.1 Verificar tablas existentes
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 1.2 Verificar columnas de una tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'  -- cambiar nombre según tabla
ORDER BY ordinal_position;

-- 1.3 Verificar tipos ENUM
SELECT t.typname, e.enumlabel
FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid
ORDER BY t.typname, e.enumsortorder;

-- 1.4 Verificar que RLS está activo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('usuarios', 'ordenes_trabajo', 'seguimiento_orden', 'historial_orden', 'materiales', 'areas');


-- ================================================================
-- 2. GESTIÓN DE USUARIOS — CREAR
-- ================================================================

-- 2.1 CREAR USUARIO ADMINISTRADOR (con PIN, vía RPC recomendado)
-- Parámetros: no_empleado, nombre_completo, rol, area_codigo, departamento, pin
SELECT crear_usuario_admin(
  '33731',                          -- número de empleado (5 dígitos)
  'Carlos Ponce Martínez',          -- nombre completo
  'administrador',                  -- rol: superadmin / administrador / tecnico / solicitante
  1415,                             -- código de área (ver tabla areas)
  'Tooling',                        -- departamento
  '1234'                            -- PIN de 4 dígitos
);

-- 2.2 CREAR USUARIO TÉCNICO (con PIN)
SELECT crear_usuario_admin(
  '31292',
  'Carlos Méndez López',
  'tecnico',
  1415,
  'Tooling',
  '8472'                            -- PIN de 4 dígitos
);

-- 2.3 CREAR USUARIO SOLICITANTE (con PIN)
SELECT crear_usuario_admin(
  '50001',
  'Pedro Sánchez Ruiz',
  'solicitante',
  1440,
  'Ingeniería',
  '5678'
);

-- 2.4 CREAR SUPERADMIN (respaldo)
SELECT crear_usuario_admin(
  'TOOLING02',
  'Admin Respaldo',
  'superadmin',
  1415,
  'Tooling',
  'admin123'
);

-- 2.5 CREAR USUARIO SIN PIN (solicitante básico)
-- Para usuarios sin PIN, insertar directamente:
INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento)
VALUES ('50002', 'Laura Ramírez Solís', 'solicitante', 1440, 'Ingeniería');


-- ================================================================
-- 3. GESTIÓN DE USUARIOS — CAMBIAR CONTRASEÑA / PIN
-- ================================================================

-- 3.1 CAMBIAR PIN (vía RPC — recomendado)
-- Cambia el PIN y desactiva "debe_cambiar_pin"
SELECT cambiar_pin(
  (SELECT id FROM usuarios WHERE no_empleado = '31292'),  -- UUID del usuario
  '9999'                                                   -- nuevo PIN de 4 dígitos
);

-- 3.2 CAMBIAR PIN DIRECTAMENTE (sin RPC)
UPDATE usuarios
SET pin_hash = crypt('9999', gen_salt('bf'))
WHERE no_empleado = '31292';

-- 3.3 RESET DE PIN (borrar PIN para que pida uno nuevo)
UPDATE usuarios
SET pin_hash = NULL,
    debe_cambiar_pin = TRUE
WHERE no_empleado = '31292';

-- 3.4 CAMBIAR CONTRASEÑA DE ADMINISTRADOR
-- Generar hash bcrypt primero: https://bcrypt-generator.com/
-- Luego ejecutar:
UPDATE usuarios
SET password_hash = crypt('MiNuevaContraseña2026', gen_salt('bf'))
WHERE no_empleado = '33731';

-- 3.5 CAMBIAR CONTRASEÑA SIN GENERAR HASH EXTERNO
-- (usa pgcrypto directamente)
UPDATE usuarios
SET password_hash = crypt('NuevaPass123', gen_salt('bf'))
WHERE no_empleado = '33731';

-- 3.6 RESET COMPLETO DE CREDENCIALES
-- Borrar PIN y contraseña para forzar re-login
UPDATE usuarios
SET pin_hash = NULL,
    password_hash = NULL,
    debe_cambiar_pin = TRUE
WHERE no_empleado = '33731';


-- ================================================================
-- 4. GESTIÓN DE USUARIOS — EDITAR
-- ================================================================

-- 4.1 CAMBIAR NOMBRE DE UN USUARIO
UPDATE usuarios
SET nombre_completo = 'Carlos Ponce García'
WHERE no_empleado = '33731';

-- 4.2 CAMBIAR ROL DE UN USUARIO
-- IMPORTANTE: Si cambias de rol sin PIN a rol con PIN, asigna un PIN
UPDATE usuarios
SET rol = 'administrador',
    pin_hash = crypt('1234', gen_salt('bf')),
    debe_cambiar_pin = TRUE
WHERE no_empleado = '31292';

-- Si cambias de rol con PIN a rol sin PIN, borra el PIN
UPDATE usuarios
SET rol = 'solicitante',
    pin_hash = NULL,
    debe_cambiar_pin = FALSE
WHERE no_empleado = '31292';

-- 4.3 CAMBIAR DEPARTAMENTO
UPDATE usuarios
SET departamento = 'Mantenimiento'
WHERE no_empleado = '31292';

-- 4.4 CAMBIAR ÁREA
UPDATE usuarios
SET area_codigo = 1414
WHERE no_empleado = '31292';

-- 4.5 CAMBIAR TURNO
-- 'primero' = 8 hrs/día, 40 hrs/sem, 160 hrs/mes
-- 'segundo' = 7.5 hrs/día, 37.5 hrs/sem, 150 hrs/mes
UPDATE usuarios
SET turno = 'segundo'
WHERE no_empleado = '31292';

-- 4.6 CAMBIAR EMAIL
UPDATE usuarios
SET email = 'carlos.mendez@bwi.com'
WHERE no_empleado = '31292';

-- 4.7 ACTIVAR USUARIO
UPDATE usuarios SET activo = TRUE WHERE no_empleado = '31292';

-- 4.8 DESACTIVAR USUARIO
UPDATE usuarios SET activo = FALSE WHERE no_empleado = '31292';

-- 4.9 MARCAR QUE DEBE CAMBIAR PIN
UPDATE usuarios SET debe_cambiar_pin = TRUE WHERE no_empleado = '31292';

-- 4.10 ACTUALIZAR ÚLTIMO ACCESO MANUALMENTE
UPDATE usuarios
SET ultimo_acceso = NOW()
WHERE no_empleado = '31292';


-- ================================================================
-- 5. GESTIÓN DE USUARIOS — CONSULTAR
-- ================================================================

-- 5.1 LISTAR TODOS LOS USUARIOS
SELECT
  no_empleado,
  nombre_completo,
  rol,
  departamento,
  turno,
  activo,
  CASE WHEN pin_hash IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_pin,
  CASE WHEN password_hash IS NOT NULL THEN '✅' ELSE '❌' END AS tiene_contrasena,
  debe_cambiar_pin,
  ultimo_acceso,
  creado_en
FROM usuarios
ORDER BY rol, nombre_completo;

-- 5.2 LISTAR SOLO TÉCNICOS
SELECT no_empleado, nombre_completo, turno, activo, departamento
FROM usuarios
WHERE rol = 'tecnico'
ORDER BY nombre_completo;

-- 5.3 LISTAR SOLO ADMINISTRADORES
SELECT no_empleado, nombre_completo, turno, activo
FROM usuarios
WHERE rol IN ('administrador', 'superadmin')
ORDER BY nombre_completo;

-- 5.4 LISTAR SOLO SOLICITANTES
SELECT no_empleado, nombre_completo, departamento, activo
FROM usuarios
WHERE rol = 'solicitante'
ORDER BY nombre_completo;

-- 5.5 VER PIN DE UN USUARIO (descifrado)
-- IMPORTANTE: Esto no muestra el PIN real (está hasheado con bcrypt)
-- Solo puedes verificar si tiene PIN asignado
SELECT no_empleado, nombre_completo, rol,
  CASE WHEN pin_hash IS NOT NULL THEN '✅ Tiene PIN' ELSE '❌ Sin PIN' END AS estado_pin
FROM usuarios
WHERE no_empleado = '31292';

-- 5.6 VERIFICAR SI UN PIN ES CORRECTO
-- (comparar contra el hash guardado)
SELECT no_empleado, nombre_completo,
  pin_hash = crypt('8472', pin_hash) AS pin_correcto
FROM usuarios
WHERE no_empleado = '31292';

-- 5.7 VER USUARIOS CON MÁS DE UNA CUENTA (duplicados)
SELECT no_empleado, COUNT(*) AS veces
FROM usuarios
GROUP BY no_empleado
HAVING COUNT(*) > 1;

-- 5.8 VER USUARIOS SIN PIN ASIGNADO (que lo necesitan)
SELECT no_empleado, nombre_completo, rol
FROM usuarios
WHERE rol IN ('administrador', 'superadmin', 'tecnico')
  AND (pin_hash IS NULL OR pin_hash = '')
ORDER BY rol, nombre_completo;

-- 5.9 VER USUARIOS SIN CONTRASEÑA (que la necesitan)
SELECT no_empleado, nombre_completo, rol
FROM usuarios
WHERE rol IN ('administrador', 'superadmin')
  AND (password_hash IS NULL OR password_hash = '')
ORDER BY rol, nombre_completo;

-- 5.10 VER ÚLTIMOS LOGINS
SELECT no_empleado, nombre_completo, rol, ultimo_acceso
FROM usuarios
WHERE ultimo_acceso IS NOT NULL
ORDER BY ultimo_acceso DESC
LIMIT 20;


-- ================================================================
-- 6. GESTIÓN DE MATERIALES Y ÁREAS
-- ================================================================

-- 6.1 LISTAR MATERIALES
SELECT id, nombre, activo FROM materiales ORDER BY nombre;

-- 6.2 AGREGAR MATERIAL
INSERT INTO materiales (nombre, activo) VALUES ('Acero al carbono', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Aluminio 6061', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Bronce', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('HSS (Acero rápido)', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Carburo de tungsteno', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Stainless Steel 304', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Plástico (Delrin)', TRUE);
INSERT INTO materiales (nombre, activo) VALUES ('Goma / Neopreno', TRUE);

-- 6.3 DESACTIVAR MATERIAL
UPDATE materiales SET activo = FALSE WHERE id = 5;

-- 6.4 REACTIVAR MATERIAL
UPDATE materiales SET activo = TRUE WHERE id = 5;

-- 6.5 RENOMBRAR MATERIAL
UPDATE materiales SET nombre = 'Acero 4140 Modificado' WHERE id = 1;

-- 6.6 ELIMINAR MATERIAL (solo si no está en uso)
DELETE FROM materiales
WHERE id = 5
  AND id NOT IN (SELECT material_id FROM seguimiento_orden WHERE material_id IS NOT NULL);

-- 6.7 LISTAR ÁREAS
SELECT codigo, nombre, activo FROM areas ORDER BY codigo;

-- 6.8 AGREGAR ÁREA
INSERT INTO areas (codigo, nombre, activo) VALUES (1500, 'NUEVA ÁREA DE PRUEBA', TRUE);

-- 6.9 DESACTIVAR ÁREA
UPDATE areas SET activo = FALSE WHERE codigo = 1500;

-- 6.10 RENOMBRAR ÁREA
UPDATE areas SET nombre = 'TALLER DE MANTENIMIENTO' WHERE codigo = 1415;


-- ================================================================
-- 7. CONSULTAS DE ÓRDENES DE TRABAJO
-- ================================================================

-- 7.1 LISTAR TODAS LAS ÓRDENES (vista completa)
SELECT * FROM vista_ordenes ORDER BY no_orden DESC;

-- 7.2 ÓRDENES POR ESTADO
SELECT no_orden, nombre_pieza, estado, entregada, fecha_solicitud
FROM vista_ordenes
WHERE estado = 'nueva_orden'
ORDER BY fecha_solicitud DESC;

-- 7.3 ÓRDENES NUEVAS (sin asignar)
SELECT no_orden, nombre_pieza, solicitante_nombre, fecha_solicitud
FROM vista_ordenes
WHERE estado = 'nueva_orden'
ORDER BY fecha_solicitud;

-- 7.4 ÓRDENES EN PROCESO
SELECT no_orden, nombre_pieza, tecnico_nombre, fecha_inicio, fecha_solicitud
FROM vista_ordenes
WHERE estado = 'en_proceso'
ORDER BY fecha_solicitud;

-- 7.5 ÓRDENES TERMINADAS (no entregadas)
SELECT no_orden, nombre_pieza, tecnico_nombre, fecha_termino
FROM vista_ordenes
WHERE estado = 'terminada' AND (entregada IS FALSE OR entregada IS NULL)
ORDER BY fecha_termino;

-- 7.6 ÓRDENES ENTREGADAS
SELECT no_orden, nombre_pieza, tecnico_nombre, fecha_termino
FROM vista_ordenes
WHERE entregada = TRUE
ORDER BY fecha_termino DESC;

-- 7.7 ÓRDENES SIN S.E.T.C. VÁLIDO
SELECT no_orden, nombre_pieza, setc_numero, estado
FROM vista_ordenes
WHERE setc_numero IS NULL
   OR TRIM(setc_numero) = ''
   OR UPPER(TRIM(setc_numero)) IN ('NA', 'N/A')
   OR LENGTH(TRIM(setc_numero)) != 8
   OR TRIM(setc_numero) !~ '^[0-9]+$'
ORDER BY no_orden DESC;

-- 7.8 ÓRDENES PRIORIDAD 1 (SEGURIDAD) ABIERTAS
SELECT no_orden, nombre_pieza, estado, autorizada, fecha_solicitud
FROM vista_ordenes
WHERE prioridad = '1_seguridad'
  AND estado NOT IN ('terminada', 'cancelada')
ORDER BY fecha_solicitud;

-- 7.9 ÓRDENES PRIORIDAD 2 (QUEJA CLIENTE) ABIERTAS
SELECT no_orden, nombre_pieza, estado, autorizada, fecha_solicitud
FROM vista_ordenes
WHERE prioridad = '2_queja_cliente'
  AND estado NOT IN ('terminada', 'cancelada')
ORDER BY fecha_solicitud;

-- 7.10 ÓRDENES PENDIENTES DE AUTORIZACIÓN (prioridad 1-2)
SELECT no_orden, nombre_pieza, prioridad, fecha_solicitud, solicitante_nombre
FROM vista_ordenes
WHERE prioridad IN ('1_seguridad', '2_queja_cliente')
  AND (autorizada IS NULL)
  AND estado NOT IN ('terminada', 'cancelada')
ORDER BY prioridad, fecha_solicitud;

-- 7.11 ÓRDENES DEL MES ACTUAL
SELECT COUNT(*) AS total_mes
FROM vista_ordenes
WHERE fecha_solicitud >= DATE_TRUNC('month', NOW());

-- 7.12 ÓRDENES DE UN RANGO DE FECHAS
SELECT no_orden, nombre_pieza, estado, fecha_solicitud
FROM vista_ordenes
WHERE fecha_solicitud BETWEEN '2026-07-01' AND '2026-07-31'
ORDER BY fecha_solicitud;

-- 7.13 BUSCAR ORDEN POR FOLIO
SELECT * FROM vista_ordenes WHERE no_orden = 123;

-- 7.14 BUSCAR ORDEN POR PIEZA
SELECT no_orden, nombre_pieza, estado, solicitante_nombre
FROM vista_ordenes
WHERE nombre_pieza ILIKE '%prensa%'
ORDER BY no_orden DESC;

-- 7.15 BUSCAR ORDEN POR SOLICITANTE
SELECT no_orden, nombre_pieza, estado, fecha_solicitud
FROM vista_ordenes
WHERE solicitante_nombre ILIKE '%carlos%'
ORDER BY no_orden DESC;

-- 7.16 ÓRDENES CON ARCHIVO ADJUNTO
SELECT no_orden, nombre_pieza, archivo_nombre, archivo_url
FROM vista_ordenes
WHERE archivo_url IS NOT NULL
ORDER BY no_orden DESC;

-- 7.17 ÓRDENES MANUALES
SELECT no_orden, nombre_pieza, estado, fecha_solicitud
FROM vista_ordenes
WHERE es_orden_manual = TRUE
ORDER BY no_orden DESC;


-- ================================================================
-- 8. CONSULTAS DE SEGUIMIENTO Y TÉCNICOS
-- ================================================================

-- 8.1 SEGUIMIENTO DE UNA ORDEN ESPECÍFICA
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
WHERE s.orden_id = 123
ORDER BY u.nombre_completo;

-- 8.2 ÓRDENES ASIGNADAS A UN TÉCNICO
SELECT
  s.orden_id,
  o.nombre_pieza,
  o.estado,
  o.prioridad,
  s.fecha_inicio,
  s.fecha_termino,
  s.tiempo_real_hrs
FROM seguimiento_orden s
JOIN ordenes_trabajo o ON s.orden_id = o.no_orden
WHERE s.tecnico_id = (SELECT id FROM usuarios WHERE no_empleado = '31292')
ORDER BY s.fecha_inicio DESC;

-- 8.3 HORAS TRABAJADAS POR TÉCNICO (MES ACTUAL)
SELECT
  u.nombre_completo,
  u.turno,
  SUM(s.tiempo_real_hrs) AS horas_totales,
  COUNT(s.orden_id) AS total_ordenes
FROM seguimiento_orden s
JOIN usuarios u ON s.tecnico_id = u.id
WHERE s.fecha_inicio >= DATE_TRUNC('month', NOW())
GROUP BY u.nombre_completo, u.turno
ORDER BY horas_totales DESC;

-- 8.4 HORAS TRABAJADAS POR TÉCNICO (RANGO DE FECHAS)
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

-- 8.5 APROVECHAMIENTO POR TÉCNICO (MES)
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

-- 8.6 APROVECHAMIENTO POR TÉCNICO (SEMANA)
WITH hrs_tec AS (
  SELECT
    u.id,
    u.nombre_completo,
    u.turno,
    COALESCE(SUM(s.tiempo_real_hrs), 0) AS horas_trabajadas
  FROM usuarios u
  LEFT JOIN seguimiento_orden s ON s.tecnico_id = u.id
    AND s.fecha_inicio >= DATE_TRUNC('week', NOW())
  WHERE u.rol = 'tecnico' AND u.activo = TRUE
  GROUP BY u.id, u.nombre_completo, u.turno
)
SELECT
  nombre_completo,
  turno,
  horas_trabajadas,
  CASE turno
    WHEN 'primero' THEN 40
    WHEN 'segundo' THEN 37.5
  END AS horas_disponibles,
  ROUND(
    (horas_trabajadas / CASE turno
      WHEN 'primero' THEN 40.0
      WHEN 'segundo' THEN 37.5
    END) * 100
  ) AS aprovechamiento_pct
FROM hrs_tec
ORDER BY aprovechamiento_pct DESC;

-- 8.7 TOP 5 TÉCNICOS POR HORAS (MES ACTUAL)
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

-- 8.8 ÓRDENES SIN ASIGNAR (sin seguimiento)
SELECT o.no_orden, o.nombre_pieza, o.estado, o.fecha_solicitud
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.no_orden = s.orden_id
WHERE s.id IS NULL
  AND o.estado NOT IN ('terminada', 'cancelada')
ORDER BY o.fecha_solicitud;

-- 8.9 TÉCNICOS CON MÁS CARGA DE TRABAJO
SELECT
  u.nombre_completo,
  u.turno,
  COUNT(DISTINCT s.orden_id) AS ordenes_asignadas,
  SUM(s.tiempo_real_hrs) AS horas_totales
FROM usuarios u
JOIN seguimiento_orden s ON u.id = s.tecnico_id
WHERE u.rol = 'tecnico' AND u.activo = TRUE
GROUP BY u.id, u.nombre_completo, u.turno
ORDER BY ordenes_asignadas DESC;

-- 8.10 MATERIAL MÁS USADO
SELECT
  m.nombre,
  COUNT(*) AS veces_usado
FROM seguimiento_orden s
JOIN materiales m ON s.material_id = m.id
GROUP BY m.nombre
ORDER BY veces_usado DESC;

-- 8.11 HORAS PROMEDIO POR ORDEN
SELECT
  ROUND(AVG(tiempo_real_hrs), 2) AS promedio_hrs,
  MIN(tiempo_real_hrs) AS min_hrs,
  MAX(tiempo_real_hrs) AS max_hrs,
  COUNT(*) AS total_ordenes_con_horas
FROM seguimiento_orden
WHERE tiempo_real_hrs IS NOT NULL;

-- 8.12 ÓRDENES POR PRIORIDAD
SELECT
  prioridad,
  COUNT(*) AS total
FROM ordenes_trabajo
GROUP BY prioridad
ORDER BY prioridad;


-- ================================================================
-- 9. CONSULTAS DE HISTORIAL
-- ================================================================

-- 9.1 HISTORIAL COMPLETO DE UNA ORDEN
SELECT
  h.fecha_evento,
  h.evento_tipo,
  h.detalle,
  u.nombre_completo AS registrado_por,
  h.estado_anterior,
  h.estado_nuevo
FROM historial_orden h
LEFT JOIN usuarios u ON h.creado_por = u.id
WHERE h.orden_id = 123
ORDER BY h.fecha_evento ASC;

-- 9.2 ÚLTIMOS 20 EVENTOS DEL SISTEMA
SELECT
  h.orden_id,
  o.nombre_pieza,
  h.evento_tipo,
  h.detalle,
  u.nombre_completo,
  h.fecha_evento
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
LEFT JOIN usuarios u ON h.creado_por = u.id
ORDER BY h.fecha_evento DESC
LIMIT 20;

-- 9.3 CONTAR EVENTOS POR TIPO
SELECT
  evento_tipo,
  COUNT(*) AS total
FROM historial_orden
GROUP BY evento_tipo
ORDER BY total DESC;

-- 9.4 EVENTOS DE AUTORIZACIÓN
SELECT
  h.orden_id,
  o.nombre_pieza,
  o.prioridad,
  h.detalle,
  u.nombre_completo,
  h.fecha_evento
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
LEFT JOIN usuarios u ON h.creado_por = u.id
WHERE h.evento_tipo = 'autorizacion'
ORDER BY h.fecha_evento DESC;

-- 9.5 EVENTOS DE CAMBIO DE ESTADO
SELECT
  h.orden_id,
  o.nombre_pieza,
  h.estado_anterior,
  h.estado_nuevo,
  u.nombre_completo,
  h.fecha_evento
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
LEFT JOIN usuarios u ON h.creado_por = u.id
WHERE h.evento_tipo = 'cambio_estado'
ORDER BY h.fecha_evento DESC;

-- 9.6 HISTORIAL DE UN USUARIO ESPECÍFICO (eventos que registró)
SELECT
  h.orden_id,
  o.nombre_pieza,
  h.evento_tipo,
  h.detalle,
  h.fecha_evento
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
WHERE h.creado_por = (SELECT id FROM usuarios WHERE no_empleado = '31292')
ORDER BY h.fecha_evento DESC
LIMIT 50;


-- ================================================================
-- 10. ESTADÍSTICAS Y KPIs
-- ================================================================

-- 10.1 RESUMEN POR ESTADO
SELECT
  estado,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE entregada = TRUE) AS entregadas
FROM ordenes_trabajo
GROUP BY estado;

-- 10.2 ÓRDENES TOTALES
SELECT COUNT(*) AS total FROM ordenes_trabajo;

-- 10.3 ÓRDENAS DEL DÍA
SELECT COUNT(*) AS total_hoy
FROM ordenes_trabajo
WHERE fecha_solicitud >= DATE_TRUNC('day', NOW());

-- 10.4 ÓRDENAS DE LA SEMANA
SELECT COUNT(*) AS total_semana
FROM ordenes_trabajo
WHERE fecha_solicitud >= DATE_TRUNC('week', NOW());

-- 10.5 ÓRDENAS DEL MES
SELECT COUNT(*) AS total_mes
FROM ordenes_trabajo
WHERE fecha_solicitud >= DATE_TRUNC('month', NOW());

-- 10.6 ÓRDENAS DEL AÑO
SELECT COUNT(*) AS total_anio
FROM ordenes_trabajo
WHERE fecha_solicitud >= DATE_TRUNC('year', NOW());

-- 10.7 HORAS TOTALES REGISTRADAS
SELECT SUM(tiempo_real_hrs) AS horas_totales
FROM seguimiento_orden
WHERE tiempo_real_hrs IS NOT NULL;

-- 10.8 HORAS PROMEDIO POR ORDEN
SELECT ROUND(AVG(tiempo_real_hrs), 2) AS promedio
FROM seguimiento_orden
WHERE tiempo_real_hrs IS NOT NULL;

-- 10.9 TIEMPO PROMEDIO DE RESPUESTA (días desde solicitud hasta inicio)
SELECT
  ROUND(AVG(s.fecha_inicio - o.fecha_solicitud::date), 1) AS dias_promedio_respuesta
FROM seguimiento_orden s
JOIN ordenes_trabajo o ON s.orden_id = o.no_orden
WHERE s.fecha_inicio IS NOT NULL;

-- 10.10 RESUMEN COMPLETO DE KPIs
SELECT
  (SELECT COUNT(*) FROM ordenes_trabajo) AS total_ordenes,
  (SELECT COUNT(*) FROM ordenes_trabajo WHERE estado = 'nueva_orden') AS nuevas,
  (SELECT COUNT(*) FROM ordenes_trabajo WHERE estado = 'en_proceso') AS en_proceso,
  (SELECT COUNT(*) FROM ordenes_trabajo WHERE estado = 'terminada') AS terminadas,
  (SELECT COUNT(*) FROM ordenes_trabajo WHERE entregada = TRUE) AS entregadas,
  (SELECT COUNT(*) FROM ordenes_trabajo
   WHERE setc_numero IS NULL OR TRIM(setc_numero) = ''
   OR UPPER(TRIM(setc_numero)) IN ('NA','N/A')
   OR LENGTH(TRIM(setc_numero)) != 8
   OR TRIM(setc_numero) !~ '^[0-9]+$') AS sin_setc,
  (SELECT COUNT(*) FROM ordenes_trabajo
   WHERE prioridad = '1_seguridad'
   AND estado NOT IN ('terminada','cancelada')) AS prioridad1_abiertas,
  (SELECT SUM(tiempo_real_hrs) FROM seguimiento_orden
   WHERE tiempo_real_hrs IS NOT NULL) AS horas_totales;


-- ================================================================
-- 11. DIAGNÓSTICO Y TROUBLESHOOTING
-- ================================================================

-- 11.1 VERIFICAR QUE LAS RPC EXISTEN
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'registro_automatico', 'verificar_login',
    'crear_usuario_admin', 'cambiar_pin'
  );

-- 11.2 VER INTEGRIDAD REFERENCIAL
-- Órdenes sin seguimiento (puede ser normal para órdenes nuevas):
SELECT o.no_orden, o.estado, o.fecha_solicitud
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.no_orden = s.orden_id
WHERE s.id IS NULL
ORDER BY o.fecha_solicitud;

-- Seguimiento huérfano (NO debería existir):
SELECT s.id, s.orden_id
FROM seguimiento_orden s
LEFT JOIN ordenes_trabajo o ON s.orden_id = o.no_orden
WHERE o.no_orden IS NULL;

-- Historial huérfano (NO debería existir):
SELECT h.id, h.orden_id
FROM historial_orden h
LEFT JOIN ordenes_trabajo o ON h.orden_id = o.no_orden
WHERE o.no_orden IS NULL;

-- 11.3 VERIFICAR DUPLICADOS DE EMPLEADO
SELECT no_empleado, COUNT(*) AS veces
FROM usuarios
GROUP BY no_empleado
HAVING COUNT(*) > 1;

-- 11.4 VERIFICAR ESTADOS INVÁLIDOS
SELECT no_orden, estado
FROM ordenes_trabajo
WHERE estado NOT IN ('nueva_orden', 'en_proceso', 'terminada', 'cancelada');

-- 11.5 VERIFICAR PRIORIDADES INVÁLIDAS
SELECT no_orden, prioridad
FROM ordenes_trabajo
WHERE prioridad NOT IN ('1_seguridad', '2_queja_cliente', '3_maquina_parada', '4_trabajo_rapido', '5_fabricacion');

-- 11.6 VERIFICAR TAMAÑO DE TABLAS
SELECT
  relname AS tabla,
  pg_size_pretty(pg_total_relation_size(relid)) AS tamano_total
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- 11.7 VER COLUMNAS FALTANTES EN TABLAS
-- (comparar con el schema esperado)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

-- 11.8 VER TRIGGERS ACTIVOS
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- 11.9 VERÍNDICES CREADOS
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 11.10 VER ERRORES DE LOGIN RECIENTES
-- (si existe tabla de logs)
-- SELECT * FROM login_logs ORDER BY created_at DESC LIMIT 20;


-- ================================================================
-- 12. MANTENIMIENTO DE LA VISTA vista_ordenes
-- ================================================================

-- IMPORTANTE: Siempre hacer DROP VIEW antes de CREATE VIEW
-- La vista incluye columnas de ordenes_trabajo, seguimiento_orden,
-- usuarios, materiales, y areas.

DROP VIEW IF EXISTS vista_ordenes;

CREATE OR REPLACE VIEW vista_ordenes AS
SELECT
  o.no_orden,
  o.fecha_solicitud,
  o.solicitante_id,
  sol.nombre_completo    AS solicitante_nombre,
  sol.no_empleado        AS solicitante_empleado,
  a.codigo               AS area_codigo,
  a.nombre               AS area_nombre,
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

  (SELECT MIN(s2.fecha_inicio)    FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_inicio,
  (SELECT MAX(s2.fecha_termino)   FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS fecha_termino,
  (SELECT SUM(s2.tiempo_real_hrs) FROM seguimiento_orden s2 WHERE s2.orden_id = o.no_orden) AS tiempo_real_hrs,

  (SELECT STRING_AGG(
    COALESCE(m2.nombre, s2.material_otro, ''), ', '
  )
   FROM seguimiento_orden s2
   LEFT JOIN materiales m2 ON s2.material_id = m2.id
   WHERE s2.orden_id = o.no_orden) AS material_usado,

  (SELECT STRING_AGG(u2.nombre_completo, ', ')
   FROM seguimiento_orden s2
   JOIN usuarios u2 ON s2.tecnico_id = u2.id
   WHERE s2.orden_id = o.no_orden) AS tecnico_nombre,

  (SELECT s2.comentarios
   FROM seguimiento_orden s2
   WHERE s2.orden_id = o.no_orden
     AND s2.comentarios IS NOT NULL
     AND s2.comentarios != ''
   ORDER BY s2.fecha_registro DESC LIMIT 1) AS comentarios

FROM ordenes_trabajo o
LEFT JOIN usuarios sol ON o.solicitante_id = sol.id
LEFT JOIN areas a ON sol.area_codigo = a.codigo;


-- ================================================================
-- 13. MIGRACIONES Y CAMBIOS DE ESQUEMA
-- ================================================================

-- 13.1 AGREGAR COLUMNA A TABLA
-- ALTER TABLE ordenes_trabajo ADD COLUMN IF NOT EXISTS nueva_columna TIPO_DATO;

-- 13.2 ELIMINAR COLUMNA
-- ALTER TABLE ordenes_trabajo DROP COLUMN IF EXISTS columna_vieja;

-- 13.3 MODIFICAR TIPO DE COLUMNA
-- ALTER TABLE usuarios ALTER COLUMN no_empleado TYPE VARCHAR(30);

-- 13.4 AGREGAR VALOR A ENUM
DO $$ BEGIN
  ALTER TYPE tipo_evento_orden ADD VALUE 'nuevo_valor';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 13.5 AGREGAR ÍNDICE PARA MEJORAR RENDIMIENTO
-- CREATE INDEX IF NOT EXISTS idx_ordenes_departamento ON ordenes_trabajo(departamento);

-- 13.6 ELIMINAR ÍNDICE
-- DROP INDEX IF EXISTS idx_ordenes_departamento;

-- 13.7 CREAR BACKUP DE TABLA ANTES DE MIGRAR
-- CREATE TABLE backup_ordenes AS SELECT * FROM ordenes_trabajo;

-- 13.8 RESTAURAR DESDE BACKUP
-- INSERT INTO ordenes_trabajo SELECT * FROM backup_ordenes;

-- 13.9 VER TAMANO DE BACKUPS
SELECT
  relname AS tabla,
  pg_size_pretty(pg_total_relation_size(relid)) AS tamano
FROM pg_catalog.pg_statio_user_tables
WHERE relname LIKE 'backup_%'
ORDER BY pg_total_relation_size(relid) DESC;


-- ================================================================
-- 14. CONFIGURACIÓN DE STORAGE (PLANOS)
-- ================================================================

-- El bucket 'planos' se configura desde el Dashboard de Supabase:
-- Storage → New Bucket → Nombre: "planos" → Public: NO → File size limit: 10MB

-- Ver buckets existentes:
SELECT * FROM storage.buckets;

-- Ver archivos en el bucket planos:
SELECT name, metadata, created_at
FROM storage.objects
WHERE bucket_id = 'planos'
ORDER BY created_at DESC;

-- Eliminar un archivo específico del storage:
-- DELETE FROM storage.objects WHERE bucket_id = 'planos' AND name = 'ruta/archivo.ext';

-- Crear política de lectura (si no existe):
-- CREATE POLICY "Allow read for authenticated"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (bucket_id = 'planos');

-- Crear política de upload (si no existe):
-- CREATE POLICY "Allow upload for authenticated"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'planos');


-- ================================================================
-- 15. SCRIPTS DE PRUEBA
-- ================================================================

-- 15.1 CREAR USUARIOS DE PRUEBA
-- Solo ejecutar si se necesita poblar la BD con datos de ejemplo:

-- Superadmin
SELECT crear_usuario_admin('TOOLING01', 'Admin Sistema', 'superadmin', 1415, 'Tooling', 'admin123');

-- Administrador
SELECT crear_usuario_admin('10001', 'Roberto Martínez', 'administrador', 1415, 'Toolroom', 'Admin2026!');

-- Técnicos
SELECT crear_usuario_admin('31292', 'Carlos Méndez', 'tecnico', 1415, 'Toolroom', '8472');
SELECT crear_usuario_admin('32102', 'Ana Torres', 'tecnico', 1415, 'Toolroom', '5163');
SELECT crear_usuario_admin('39633', 'Luis García', 'tecnico', 1415, 'Toolroom', '7391');
SELECT crear_usuario_admin('35930', 'María López', 'tecnico', 1415, 'Toolroom', '2846');

-- Solicitantes
SELECT crear_usuario_admin('50001', 'Pedro Sánchez', 'solicitante', 1440, 'Ingeniería', '5678');
SELECT crear_usuario_admin('50002', 'Laura Ramírez', 'solicitante', 1440, 'Ingeniería', '9012');

-- 15.2 VERIFICAR LOGINS
-- Probando registro automático (sin PIN):
SELECT * FROM registro_automatico('50001');

-- Probando login con PIN:
SELECT * FROM verificar_login('31292', '8472');

-- 15.3 PROBAR CAMBIO DE PIN
SELECT cambiar_pin(
  (SELECT id FROM usuarios WHERE no_empleado = '31292'),
  '1111'
);

-- Verificar que el PIN cambió:
SELECT no_empleado,
  pin_hash = crypt('1111', pin_hash) AS nuevo_pin_correcto,
  pin_hash = crypt('8472', pin_hash) AS viejo_pin_correcto
FROM usuarios WHERE no_empleado = '31292';


-- ================================================================
-- 16. PARÁMETROS DEL SISTEMA (HORAS POR TURNO)
-- ================================================================
-- Estos valores están definidos en el frontend (supabase.js,
-- PanelTecnicos.jsx, TecnicoPortal.jsx, ExportarReportes.jsx).
--
-- Para cambiarlos, editar los archivos fuente:
--   const HRS_DIA    = { primero: 8,    segundo: 7.5   }
--   const HRS_SEMANA = { primero: 40,   segundo: 37.5  }
--   const HRS_MES    = { primero: 160,  segundo: 150   }
--
-- Tabla de referencia:
--   1° Turno: 8 hrs/día × 5 días = 40 hrs/semana = 160 hrs/mes
--   2° Turno: 7.5 hrs/día × 5 días = 37.5 hrs/semana = 150 hrs/mes


-- ================================================================
-- 17. BORRADO SEGURO (ELIMINAR ÓRDENES)
-- ================================================================

-- ADVERTENCIA: Estas operaciones son IRREVERSIBLES.
-- Usar solo si es absolutamente necesario.

-- 17.1 ELIMINAR UNA ORDEN Y TODOS SUS DATOS RELACIONADOS
-- (descomentar y cambiar el número de orden)
--
-- DELETE FROM historial_orden WHERE orden_id = 999;
-- DELETE FROM seguimiento_orden WHERE orden_id = 999;
-- DELETE FROM ordenes_trabajo WHERE no_orden = 999;

-- 17.2 ELIMINAR TODAS LAS ÓRDENES DE PRUEBA
-- ADVERTENCIA: ELIMINA TODOS LOS DATOS
--
-- DELETE FROM historial_orden;
-- DELETE FROM seguimiento_orden;
-- DELETE FROM ordenes_trabajo;
-- ALTER SEQUENCE ordenes_trabajo_no_orden_seq RESTART WITH 1;


-- ================================================================
-- 18. UTILIDADES VARIAS
-- ================================================================

-- 18.1 CONTAR REGISTROS EN TODAS LAS TABLAS
SELECT
  'usuarios' AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL SELECT 'ordenes_trabajo', COUNT(*) FROM ordenes_trabajo
UNION ALL SELECT 'seguimiento_orden', COUNT(*) FROM seguimiento_orden
UNION ALL SELECT 'historial_orden', COUNT(*) FROM historial_orden
UNION ALL SELECT 'materiales', COUNT(*) FROM materiales
UNION ALL SELECT 'areas', COUNT(*) FROM areas;

-- 18.2 VER ÚLTIMA ACTIVIDAD DEL SISTEMA
SELECT
  (SELECT MAX(fecha_solicitud) FROM ordenes_trabajo) AS ultima_orden_creada,
  (SELECT MAX(fecha_evento) FROM historial_orden) AS ultimo_evento,
  (SELECT MAX(ultimo_acceso) FROM usuarios) AS ultimo_login,
  (SELECT MAX(fecha_registro) FROM seguimiento_orden) AS ultimo_seguimiento;

-- 18.3 VER VERSIÓN DEL ESQUEMA
-- (buscar en los archivos SQL la versión más reciente)
SELECT 'Schema v5.0 - Julio 2026' AS version;

-- 18.4 LIMPIAR SESIONES EXPIRADAS (si existe tabla de sesiones)
-- DELETE FROM sessions WHERE expires_at < NOW();

-- 18.5 GENERAR REPORTE DE AUDITORÍA
SELECT
  u.no_empleado,
  u.nombre_completo,
  u.rol,
  u.ultimo_acceso,
  u.creado_en,
  CASE WHEN u.activo THEN 'Activo' ELSE 'Inactivo' END AS estado
FROM usuarios u
ORDER BY u.ultimo_acceso DESC NULLS LAST;


-- ================================================================
-- FIN DE REFERENCIA
-- ================================================================
-- Versión: 5.0
-- Última actualización: Julio 2026
-- BWI TOOLROOM — Departamento de Tooling
-- ================================================================
