# BWI Tooling — Sistema de Órdenes de Trabajo

Sistema web para gestión de órdenes del departamento de Tooling.  
Base de datos en la nube (Supabase), accesible desde cualquier navegador.

---

## Estructura del proyecto

```
bwi-tooling/
│
├── index.html                  ← Página principal
├── vite.config.js              ← Configuración del servidor
├── package.json                ← Dependencias
├── vercel.json                 ← Configuración de despliegue
├── .env                        ← Tus credenciales (NO subir a git)
├── .env.example                ← Plantilla del archivo .env
├── .gitignore
│
├── src/
│   ├── main.jsx                ← Punto de entrada
│   ├── App.jsx                 ← Enrutador principal
│   │
│   ├── lib/
│   │   └── supabase.js         ← Cliente y todas las funciones de BD
│   │
│   ├── PortalSolicitante.jsx   ← Portal para ingenieros y técnicos
│   ├── TallerDashboard.jsx     ← Panel del administrador
│   └── CapturaManual.jsx       ← Registro de órdenes en papel
│
└── sql/
    └── bwi_tooling_schema.sql  ← Script completo de la base de datos
```

---

## Requisitos previos

- **Node.js** v18 o superior → https://nodejs.org
- **Cuenta en Supabase** (gratuita) → https://supabase.com
- **Cuenta en Vercel** (gratuita, para el link final) → https://vercel.com

---

## Instalación paso a paso

### 1. Configurar Supabase

1. Entra a https://supabase.com y crea un proyecto llamado `bwi-tooling`
2. Ve a **SQL Editor → New query**
3. Copia y ejecuta el contenido de `sql/bwi_tooling_schema.sql`
4. Ve a **Storage → New bucket**, nómbralo `planos`, deja en **privado**
5. Ve a **Settings → API** y copia:
   - **Project URL**
   - **anon public key**

### 2. Configurar el proyecto local

```bash
# Clona o descarga el proyecto
cd bwi-tooling

# Instala las dependencias
npm install

# Copia el archivo de variables de entorno
cp .env.example .env
```

Abre `.env` y pega tus credenciales de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...tu_clave...
```

### 3. Arrancar en local

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### 4. Publicar en Vercel (para tener el link final)

```bash
# Instala Vercel CLI (una sola vez)
npm install -g vercel

# Despliega
vercel

# Sigue las instrucciones. Cuando pregunte por variables de entorno,
# agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
```

O desde la web de Vercel: conecta tu repositorio de GitHub y agrega
las variables de entorno en la configuración del proyecto.

---

## Acceso al sistema

### Superusuario inicial

| Campo        | Valor      |
|--------------|------------|
| No. empleado | `TOOLING01`|
| PIN          | `123456`   |

> ⚠️ Cámbialo en tu primer login. El sistema te lo pedirá automáticamente.

### Cómo funciona el login

| Rol            | Cómo entra                        |
|----------------|-----------------------------------|
| Solicitante    | Solo número de empleado           |
| Técnico        | Solo número de empleado           |
| Administrador  | Número de empleado **+ PIN**      |
| Superadmin     | Número de empleado **+ PIN**      |

### Lo que ve cada rol

| Rol           | Puede hacer                                              |
|---------------|----------------------------------------------------------|
| Superadmin    | Todo. Gestión de usuarios, reportes, configuración.      |
| Administrador | Ver y actualizar todas las órdenes. Captura manual.      |
| Técnico       | Ver órdenes asignadas a él.                              |
| Solicitante   | Crear órdenes y ver el estado de las suyas.              |

---

## Agregar usuarios

### Desde el SQL Editor de Supabase

**Administrador (con PIN):**
```sql
INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento, pin_hash, debe_cambiar_pin)
VALUES (
  '33731', 'Carlos Ponce', 'administrador', 1415, 'Tooling',
  crypt('123456', gen_salt('bf')), TRUE
);
```

**Solicitante o Técnico (sin PIN):**
```sql
INSERT INTO usuarios (no_empleado, nombre_completo, rol, area_codigo, departamento)
VALUES ('33800', 'Juan Pérez', 'solicitante', 1440, 'Ingeniería');
```

### Roles disponibles
- `superadmin`
- `administrador`
- `tecnico`
- `solicitante`

---

## Agregar o modificar catálogos

**Nuevo material:**
```sql
INSERT INTO materiales (nombre) VALUES ('Acero D2');
```

**Nueva área:**
```sql
INSERT INTO areas (codigo, nombre) VALUES (1650, 'Nueva Área');
```

**Desactivar un usuario** (sin borrarlo):
```sql
UPDATE usuarios SET activo = FALSE WHERE no_empleado = '33731';
```

---

## Prioridades

| # | Nombre          | Descripción                                          |
|---|-----------------|------------------------------------------------------|
| 1 | Seguridad       | Fabricación inmediata. No trabajo de largo desarrollo|
| 2 | Queja de cliente| Riesgo a la calidad. Agregar folio de queja          |
| 3 | Máquina parada  | Espontáneo o recurrente. No se pudo prever           |
| 4 | Trabajo rápido  | Menos de 2 horas para fabricarlo                     |
| 5 | Fabricación     | Se envía a proveedor externo. Sin excepción          |

---

## Áreas registradas

| Código | Nombre                              |
|--------|-------------------------------------|
| 1401   | IAMM/FRHC SALARY INDIRECT           |
| 1403   | MRD/MRF SALARY INDIRECT             |
| 1407   | RTA (MR/PASIVE/BMW) SALARY INDIRECT |
| 1410   | BI-STATE SALARY INDIRECT            |
| 1411   | INGENIERIA AMBIENTAL                |
| 1414   | MANTENIMIENTO PLANTA                |
| 1415   | TALLER MÁQUINAS Y HERRAMIENTAS      |
| 1421   | PASIVE TT/BMW SALARY INDIRECT       |
| 1440   | INGENIERÍA                          |
| 1441   | NUEVOS PROYECTOS                    |
| 1601   | RECURSOS HUMANOS                    |

---

## Tecnologías utilizadas

| Componente     | Tecnología              | Costo   |
|----------------|-------------------------|---------|
| Base de datos  | Supabase (PostgreSQL)   | Gratis  |
| Almacenamiento | Supabase Storage        | Gratis  |
| Frontend       | React + Vite            | Gratis  |
| Gráficas       | Recharts                | Gratis  |
| Hosting        | Vercel                  | Gratis  |

---

*BWI — Departamento de Tooling · Sistema v3.0*
