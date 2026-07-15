-- Agregar tipo de evento 'autorizacion' al enum
DO $$ BEGIN
  ALTER TYPE tipo_evento_orden ADD VALUE 'autorizacion';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Recrear vista_ordenes con autorizado_por_nombre, autorizado_por_puesto, motivo_rechazo
DROP VIEW IF EXISTS vista_ordenes;

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
