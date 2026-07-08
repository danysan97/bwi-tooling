# Guía de Configuración — BWI Tooling
## Sistema de Órdenes de Trabajo en Supabase

---

## PASO 1 — Crear tu cuenta y proyecto en Supabase

1. Ve a **https://supabase.com** y haz clic en **"Start your project"**
2. Regístrate con tu correo (o con Google)
3. Haz clic en **"New project"**
4. Llena los datos:
   - **Organization:** BWI (o el nombre que quieras)
   - **Project name:** `bwi-tooling`
   - **Database password:** Pon una contraseña fuerte y **guárdala**, la necesitarás
   - **Region:** `US East (N. Virginia)` — es la más cercana a México
5. Haz clic en **"Create new project"**
6. Espera ~2 minutos mientras Supabase configura todo

---

## PASO 2 — Crear las tablas (ejecutar el SQL)

1. En el menú izquierdo de tu proyecto, haz clic en **"SQL Editor"**
2. Haz clic en **"New query"**
3. Copia y pega TODO el contenido del archivo `bwi_tooling_schema.sql`
4. Haz clic en **"Run"** (o Ctrl + Enter)
5. Deberías ver: `Success. No rows returned`

✅ Ya tienes todas las tablas, vistas e índices creados.

---

## PASO 3 — Configurar el almacenamiento de planos

1. En el menú izquierdo, haz clic en **"Storage"**
2. Haz clic en **"New bucket"**
3. Llena:
   - **Name:** `planos`
   - **Public bucket:** ❌ NO (los planos son privados)
4. Haz clic en **"Save"**

---

## PASO 4 — Obtener tus credenciales de conexión

1. En el menú izquierdo, haz clic en **"Settings"** → **"API"**
2. Copia y guarda estos dos valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → una cadena larga que empieza con `eyJ...`

> ⚠️ La `anon key` es segura para usar en el frontend.
> NUNCA uses la `service_role key` en código que llegue al navegador.

---

## PASO 5 — Configurar las variables de entorno

Crea un archivo llamado `.env` en la raíz de tu proyecto web con esto:

```
VITE_SUPABASE_URL=https://TU_PROJECT_URL.supabase.co
VITE_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
```

Reemplaza los valores con los que copiaste en el Paso 4.

---

## PASO 6 — Instalar el cliente de Supabase en tu proyecto

Abre una terminal en la carpeta de tu proyecto y ejecuta:

```bash
npm install @supabase/supabase-js
```

---

## PASO 7 — Verificar que funciona

1. Ve a **"Table Editor"** en el menú de Supabase
2. Deberías ver tus tablas: `usuarios`, `ordenes_trabajo`, `seguimiento_orden`, etc.
3. Haz clic en `usuarios` — deberías ver ya creado el superusuario `TOOLING01`

---

## Tu superusuario inicial

| Campo         | Valor      |
|---------------|------------|
| No. empleado  | `TOOLING01`|
| PIN           | `123456`   |
| Rol           | Superadmin |
| Departamento  | TALLER MÁQUINAS Y HERRAMIENTAS |

> ⚠️ **Cambia el PIN en tu primer login.** El sistema te lo pedirá automáticamente.

---

## Cómo agregar usuarios

Una vez dentro del sistema con tu cuenta superadmin podrás agregar usuarios
desde el panel. Si necesitas hacerlo manualmente vía SQL:

```sql
INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento, pin_hash)
VALUES (
  '33731',
  'Carlos Ponce',
  'administrador',   -- o 'tecnico' o 'solicitante'
  1415,
  'Tooling',
  crypt('123456', gen_salt('bf'))  -- PIN inicial, el usuario lo cambiará
);
```

Los roles disponibles son:
- `superadmin` — Control total del sistema
- `administrador` — Gestión de órdenes y captura manual
- `tecnico` — Ve y actualiza sus órdenes asignadas
- `solicitante` — Crea órdenes y rastrea las suyas

---

## Estructura de archivos del proyecto web

```
bwi-tooling/
├── .env                    ← Tus credenciales (NUNCA subir a git)
├── package.json
├── src/
│   ├── lib/
│   │   └── supabase.js     ← Cliente de conexión
│   ├── TallerDashboard.jsx ← Panel de administrador
│   └── PortalSolicitante.jsx ← Portal para ingenieros y técnicos
```

---

## Despliegue en Vercel (para tener el link final)

1. Ve a **https://vercel.com** y regístrate
2. Conecta tu repositorio de GitHub
3. En la configuración del proyecto, agrega las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Haz clic en **"Deploy"**
5. Vercel te dará un link como `https://bwi-tooling.vercel.app`

Ese link es el que compartes con los ingenieros y técnicos.

---

*BWI — Departamento de Tooling | Sistema v2.0*
