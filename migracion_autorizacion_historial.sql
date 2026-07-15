-- Agregar tipo de evento 'autorizacion' al enum
DO $$ BEGIN
  ALTER TYPE tipo_evento_orden ADD VALUE 'autorizacion';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
