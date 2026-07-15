-- Hacer que verificar_login acepte técnicos también
CREATE OR REPLACE FUNCTION verificar_login(p_no_empleado VARCHAR, p_pin VARCHAR)
RETURNS TABLE (
  id UUID, no_empleado VARCHAR, nombre_completo VARCHAR,
  rol rol_usuario, area_codigo INTEGER, departamento VARCHAR, debe_cambiar_pin BOOLEAN
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.no_empleado, u.nombre_completo, u.rol, u.area_codigo, u.departamento, u.debe_cambiar_pin
  FROM usuarios u
  WHERE u.no_empleado = p_no_empleado
    AND u.activo = TRUE
    AND u.pin_hash IS NOT NULL
    AND u.pin_hash = crypt(p_pin, u.pin_hash)
    AND u.rol IN ('administrador', 'superadmin', 'tecnico');

  UPDATE usuarios SET ultimo_acceso = NOW()
  WHERE usuarios.no_empleado = p_no_empleado;
END;
$$;

-- Hacer que crear_usuario_admin acepte técnicos también
CREATE OR REPLACE FUNCTION crear_usuario_admin(
  p_no_empleado VARCHAR, p_nombre_completo VARCHAR, p_rol rol_usuario,
  p_area_codigo INTEGER, p_departamento VARCHAR, p_pin VARCHAR
)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento, pin_hash, debe_cambiar_pin)
  VALUES (p_no_empleado, p_nombre_completo, p_rol, p_area_codigo, p_departamento,
          crypt(p_pin, gen_salt('bf')), TRUE)
  RETURNING id INTO v_id;

  UPDATE usuarios SET ultimo_acceso = NOW() WHERE usuarios.id = v_id;
  RETURN v_id;
END;
$$;

-- Hacer que cambiar_pin acepte técnicos también (ya debería, pero por si acaso)
-- La función existente ya opera por usuario_id, no por rol, así que no necesita cambio.
