-- Corregir políticas RLS para registro_horas
-- Primero eliminar las existentes
DROP POLICY IF EXISTS "registro_horas_select" ON registro_horas;
DROP POLICY IF EXISTS "registro_horas_insert" ON registro_horas;
DROP POLICY IF EXISTS "registro_horas_update" ON registro_horas;
DROP POLICY IF EXISTS "registro_horas_delete" ON registro_horas;

-- Recrear con auth.uid() en vez de auth.role()
CREATE POLICY "registro_horas_select" ON registro_horas
  FOR SELECT USING (true);

CREATE POLICY "registro_horas_insert" ON registro_horas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "registro_horas_update" ON registro_horas
  FOR UPDATE USING (true);

CREATE POLICY "registro_horas_delete" ON registro_horas
  FOR DELETE USING (true);
