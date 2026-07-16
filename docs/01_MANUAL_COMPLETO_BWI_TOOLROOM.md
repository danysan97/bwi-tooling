# MANUAL COMPLETO — SISTEMA BWI TOOLROOM

**Departamento de Tooling / Mantenimiento**
**Revisión:** 5.0 (Backend) / 1.0.2 (Package)
**Fecha de emisión:** 15 de julio de 2026
**Clasificación:** Documento interno — Uso exclusivo del equipo de Tooling BWI

---

## Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Roles del Sistema](#2-roles-del-sistema)
3. [Flujo de Autenticación](#3-flujo-de-autenticación)
4. [Ciclo de Vida de una Orden de Trabajo](#4-ciclo-de-vida-de-una-orden-de-trabajo)
5. [Base de Datos — Esquema Completo](#5-base-de-datos--esquema-completo)
   - 5.1 [Tablas](#51-tablas)
   - 5.2 [Enums](#52-enums)
   - 5.3 [Vistas](#53-vistas)
   - 5.4 [Funciones RPC](#54-funciones-rpc)
   - 5.5 [Triggers](#55-triggers)
6. [API Backend (supabase.js)](#6-api-backend-supabasejs)
   - 6.1 [Autenticación](#61-autenticación)
   - 6.2 [Gestión de Usuarios](#62-gestión-de-usuarios)
   - 6.3 [Gestión de Órdenes](#63-gestión-de-órdenes)
   - 6.4 [Archivos y Documentos](#64-archivos-y-documentos)
   - 6.5 [Historial y Auditoría](#65-historial-y-auditoría)
   - 6.6 [Gráficas y Reportes](#66-gráficas-y-reportes)
   - 6.7 [Catálogos](#67-catálogos)
7. [Sistema de Prioridades](#7-sistema-de-prioridades)
8. [Historial y Trazabilidad (Auditoría)](#8-historial-y-trazabilidad-auditoría)
9. [Gestión de Documentos](#9-gestión-de-documentos)
10. [Exportación de Reportes](#10-exportación-de-reportes)
11. [Impresión de Órdenes](#11-impresión-de-órdenes)
12. [Métricas de Técnicos](#12-métricas-de-técnicos)
13. [Diseño de Interfaz (UI/UX)](#13-diseño-de-interfaz-uiux)
14. [Seguridad](#14-seguridad)
15. [Despliegue y Mantenimiento](#15-despliegue-y-mantenimiento)
16. [Troubleshooting / Solución de Problemas](#16-troubleshooting--solución-de-problemas)
17. [Glosario](#17-glosario)

---

## 1. Introducción

El **Sistema BWI Toolroom** es una plataforma web integral diseñada para la gestión de ordenes de trabajo dentro del departamento de Tooling y Mantenimiento de BWI. El sistema reemplaza procesos manuales en papel y hojas de cálculo, proporcionando trazabilidad completa desde la recepción de una solicitud hasta la entrega final del trabajo realizado.

### 1.1 Propósito

- Centralizar la creación, seguimiento y cierre de ordenes de trabajo.
- Asignar técnicos y controlar la carga de trabajo por turnos.
- Registrar autorizaciones obligatorias para trabajos de seguridad y quejas de cliente.
- Generar reportes de desempeño por técnico y métricas de productividad.
- Mantener un historial inmutable de auditoría para cada orden.
- Gestionar documentos técnicos (planos, especificaciones) vinculados a cada trabajo.

### 1.2 Versión del Sistema

| Componente     | Versión |
|----------------|---------|
| Backend (DB)   | 5.0     |
| Package (App)  | 1.0.2   |

### 1.3 Stack Tecnológico

| Capa            | Tecnología                                      |
|-----------------|-------------------------------------------------|
| Frontend        | React 18, Vite 5, React Router v6               |
| Backend         | Supabase (PostgreSQL, Auth, Storage, Edge Funcs) |
| Gráficas        | Recharts                                        |
| Animaciones     | Framer Motion                                   |
| Exportación     | SheetJS (xlsx)                                  |
| Despliegue FE   | Vercel / Netlify (estático, CDN global)         |
| Despliegue BE   | Supabase Cloud (PostgreSQL administrado)        |
| Control fuentes | GitHub — `danysan97/bwi-tooling`                |

---

## 2. Roles del Sistema

El sistema define **cuatro roles** con niveles de acceso diferenciados:

| Rol             | PIN Requerido | Descripción                                                                 |
|-----------------|:-------------:|-----------------------------------------------------------------------------|
| `superadmin`    | Sí            | Acceso total al sistema. Solo el usuario TOOLING01 tiene este rol.          |
| `administrador` | Sí            | Gestión de órdenes, supervisión de técnicos, reportes. Sin acceso a Usuarios. |
| `tecnico`       | Sí            | Visualiza órdenes asignadas, actualiza avance, consulta métricas propias.   |
| `solicitante`   | No            | Crea ordenes, consulta historial propio. Acceso de solo lectura.            |

### 2.1 Permisos por Rol

| Funcionalidad                     | superadmin | administrador | tecnico | solicitante |
|-----------------------------------|:----------:|:-------------:|:-------:|:-----------:|
| Iniciar sesión                    | ✅          | ✅             | ✅       | ✅           |
| Crear ordenes                     | ✅          | ✅             | ❌       | ✅           |
| Asignar técnicos                  | ✅          | ✅             | ❌       | ❌           |
| Autorizar órdenes (prioridad 1-2) | ✅          | ✅             | ❌       | ❌           |
| Actualizar avance técnico         | ✅          | ✅             | ✅       | ❌           |
| Marcar orden entregada            | ✅          | ✅             | ❌       | ❌           |
| Cancelar ordenes                  | ✅          | ✅             | ❌       | ❌           |
| Ver métricas de técnicos          | ✅          | ✅             | ✅*      | ❌           |
| Exportar reportes Excel           | ✅          | ✅             | ❌       | ❌           |
| Gestionar usuarios (CRUD)         | ✅          | ❌             | ❌       | ❌           |
| Cambiar PIN                       | ✅          | ✅             | ✅       | ❌           |
| Ver historial completo            | ✅          | ✅             | ✅*      | ❌           |
| Subir documentos / planos         | ✅          | ✅             | ✅       | ❌           |
| Imprimir orden                    | ✅          | ✅             | ✅       | ✅**         |

\* El técnico solo ve sus propias métricas e historial.
\** El solicitante solo puede imprimir órdenes propias.

### 2.2 Usuario Superadmin

El usuario **TOOLING01** (número de empleado `TOOLING01`) es el único usuario con rol `superadmin`. Este usuario:

- Tiene acceso irrestricto a todas las funcionalidades del sistema.
- Puede gestionar usuarios (crear, activar/desactivar).
- Se autentica con PIN al igual que administradores y técnicos.
- No puede ser desactivado por otro usuario.
- Es creado en la migración inicial de la base de datos.

---

## 3. Flujo de Autenticación

### 3.1 Diagrama de Flujo de Login

```
┌─────────────────┐
│  Página de Login │
│  (Portal)        │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│  Ingresar número    │
│  de empleado        │
│  (5 caracteres)     │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────┐     No existe / Inactivo
│  Buscar en tabla usuarios   │──────────────────────────► [Error: Usuario no encontrado]
│  (num_empleado, activo)     │
└────────┬────────────────────┘
         │ Existe y activo
         ▼
┌─────────────────────────────┐
│  ¿Requiere PIN?             │
│  (rol != solicitante)       │
└────┬───────────────┬────────┘
     │ Sí            │ No
     ▼               ▼
┌──────────────┐  ┌──────────────────┐
│  Ingresar   │  │  Login directo    │
│  PIN (≥4d)  │  │  (sin PIN)       │
└──────┬──────┘  └────────┬─────────┘
       │                  │
       ▼                  ▼
┌──────────────────────────────────┐
│  Verificar PIN con bcrypt       │
│  login_con_pin / login_sin_pin  │
└──────┬───────────────────────────┘
       │ Válido
       ▼
┌──────────────────────────────────┐
│  Guardar sesión en sessionStorage│
│  Key: bwi_usuario               │
│  Value: { id, num_empleado,     │
│           nombre, rol }          │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Redirigir según rol:    │
│  - admin/super → Inicio  │
│  - tecnico     → Órdenes │
│  - solicitante → Portal  │
└──────────────────────────┘
```

### 3.2 Detalles de Implementación

| Aspecto                   | Detalle                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| Almacenamiento de sesión  | `sessionStorage` (se borra al cerrar el navegador)                      |
| Key de sesión             | `bwi_usuario`                                                           |
| Formato del PIN           | Numérico, mínimo 4 dígitos                                              |
| Hash del PIN              | bcrypt                                                                  |
| Funciones RPC de login    | `login_sin_pin`, `login_con_pin`, `registro_automatico`, `verificar_login` |
| Usuario TOOLING01         | Se registra automáticamente con `registro_automatico` al primer login   |
| Cierre de sesión          | Elimina `bwi_usuario` de `sessionStorage` y redirige al login          |

### 3.3 Bypass de Superadmin

El usuario `TOOLING01` no tiene restricciones de acceso. Su rol `superadmin` le permite:

- Acceder a todos los módulos incluyendo gestión de usuarios.
- Visualizar y modificar cualquier orden sin restricciones de propiedad.
- Ejecutar todas las funciones del sistema.

### 3.4 Roles que Requieren PIN

| Rol            | Requiere PIN | Notas                                         |
|----------------|:------------:|-----------------------------------------------|
| `superadmin`   | Sí           | Mínimo 4 dígitos numéricos                    |
| `administrador`| Sí           | Mínimo 4 dígitos numéricos                    |
| `tecnico`      | Sí           | Mínimo 4 dígitos numéricos                    |
| `solicitante`  | No           | Login directo con número de empleado          |

---

## 4. Ciclo de Vida de una Orden de Trabajo

### 4.1 Estados Posibles

| Estado        | Código          | Descripción                                              |
|---------------|-----------------|----------------------------------------------------------|
| Nueva         | `nueva_orden`   | Orden recién creada, pendiente de asignación             |
| En Proceso    | `en_proceso`    | Técnico asignado, trabajo iniciado                       |
| Terminada     | `terminada`     | Trabajo completado por el técnico                        |
| Entregada     | `entregada`     | Administrador confirma entrega final                     |
| Cancelada     | `cancelada`     | Orden cancelada por el administrador                     |

### 4.2 Diagrama de Estados

```
                    ┌──────────────┐
                    │  CREADA      │
                    │ nueva_orden  │
                    └──────┬───────┘
                           │
                    Asignación de técnico
                           │
                           ▼
                    ┌──────────────┐
              ┌─────│  EN PROCESO  │─────┐
              │     │ en_proceso   │     │
              │     └──────┬───────┘     │
              │            │             │
              │     fecha_inicio set     │
              │            │             │
              │            ▼             │
              │     ┌──────────────┐     │
              │     │  TRABAJO EN  │     │
              │     │  CURSO       │     │
              │     │ (material,   │     │
              │     │  comentarios,│     │
              │     │  horas)      │     │
              │     └──────┬───────┘     │
              │            │             │
              │     fecha_termino set    │
              │            │             │
              │            ▼             │
              │     ┌──────────────┐     │
              │     │  TERMINADA   │     │
              │     │ terminada    │     │
              │     └──────┬───────┘     │
              │            │             │
              │     Confirmación admin   │
              │            │             │
              │            ▼             │
              │     ┌──────────────┐     │
              │     │  ENTREGADA   │     │
              │     │ entregada    │     │
              │     └──────────────┘     │
              │                          │
              └──────────────────────────┘
                       │
              Cualquier momento
                       │
                       ▼
                ┌──────────────┐
                │  CANCELADA   │
                │ cancelada    │
                └──────────────┘
```

### 4.3 Detalle por Fase

#### 4.3.1 Creación (`nueva_orden`)

Una orden puede ser creada por tres vías:

| Vía                         | Rol              | Descripción                                                        |
|-----------------------------|------------------|--------------------------------------------------------------------|
| Portal del solicitante      | `solicitante`    | Formulario público: área, máquina, descripción, prioridad.         |
| Formulario del administrador| `administrador`  | Formulario interno con campos adicionales (técnico, fecha, etc.).  |
| Captura manual del admin    | `administrador`  | Entrada rápida desde la vista de órdenes.                          |

**Campos obligatorios en creación:**

- `area` (área de trabajo)
- `maquina` (nombre de máquina o equipo)
- `descripcion` (descripción del problema o trabajo solicitado)
- `prioridad` (nivel de prioridad, 1–5)

**Campos opcionales en creación:**

- `tecnico_asignado` (se puede asignar después)
- `numero_orden` (generado automáticamente si no se especifica)
- `papeleta` (número de papeleta de producción)
- `plano` (documento técnico adjunto)

#### 4.3.2 Asignación

El administrador asigna uno o más técnicos a la orden desde la pestaña de **Seguimiento**. La asignación:

- Registra un evento de tipo `asignacion` en el historial.
- Actualiza el campo `tecnico_asignado` en la tabla `ordenes_trabajo`.
- Puede realizarse en cualquier momento desde la creación hasta antes de la entrega.

#### 4.3.3 Inicio (`en_proceso`)

El estado cambia automáticamente a `en_proceso` cuando el técnico establece la `fecha_inicio` en el formulario de seguimiento. No requiere acción explícita del administrador.

**Requisitos para el inicio:**

- La orden debe estar en estado `nueva_orden`.
- Debe existir un técnico asignado.
- El técnico ingresa la fecha y hora de inicio.

**Evento registrado:** `inicio` en `historial_orden`.

#### 4.3.4 Autorización

Aplicable **exclusivamente** a ordenes con prioridad 1 (`1_seguridad`) o prioridad 2 (`2_queja_cliente`).

**Requisitos de autorización:**

| Campo               | Descripción                                     |
|----------------------|-------------------------------------------------|
| `nombre_autoriza`   | Nombre completo de quien autoriza               |
| `puesto_autoriza`   | Puesto o cargo de quien autoriza                |
| `folio_queja`       | Número de folio de queja (solo prioridad 2)     |

La autorización se registra en el formulario de seguimiento del administrador. La orden puede avanzar en su ciclo sin autorización, pero el sistema marca visualmente si falta la autorización y genera un evento de tipo `autorizacion` en el historial.

#### 4.3.5 Trabajo en Curso

Durante esta fase, el técnico y el administrador registran:

| Dato                | Campo                   | Descripción                                              |
|---------------------|-------------------------|----------------------------------------------------------|
| Materiales          | `material`              | Materiales consumidos durante el trabajo                  |
| Comentarios         | `comentario`            | Observaciones, notas de avance                           |
| Horas trabajadas    | `horas_trabajado`       | Tiempo dedicado al trabajo                                |
| Documentos          | `plano` (archivo)       | Planos o especificaciones técnicas                        |

Cada actualización genera eventos correspondientes en el historial.

#### 4.3.6 Finalización (`terminada`)

El estado cambia automáticamente a `terminada` cuando el técnico establece la `fecha_termino` y las `horas_trabajado` en el formulario de seguimiento.

**Requisitos para la finalización:**

- La orden debe estar en estado `en_proceso`.
- Deben proporcionarse `fecha_termino` y `horas_trabajado`.
- Se calcula la duración total del trabajo.

**Evento registrado:** `terminado` en `historial_orden`.

#### 4.3.7 Entrega (`entregada`)

El administrador confirma la entrega física del trabajo al solicitante. Este paso:

- Cambia el estado a `entregada`.
- Registra un evento de tipo `entrega` en el historial.
- Marca la orden como completada en el sistema.
- Se activa el checkmark de confirmación en la interfaz.

**Evento registrado:** `entrega` en `historial_orden`.

#### 4.3.8 Cancelación (`cancelada`)

El administrador puede cancelar una orden en cualquier momento antes de la entrega. La cancelación:

- Cambia el estado a `cancelada`.
- Registra un evento de tipo `cambio_estado` en el historial.
- La orden queda marcada como cancelada permanentemente.
- No se puede "reabrir" una orden cancelada.

---

## 5. Base de Datos — Esquema Completo

### 5.1 Tablas

#### 5.1.1 `areas`

Catálogo de áreas de trabajo / producción.

| Columna    | Tipo         | Constraints                          | Descripción                       |
|------------|--------------|--------------------------------------|-----------------------------------|
| `id`       | `uuid`       | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único del área |
| `nombre`   | `text`       | NOT NULL                             | Nombre del área (ej: "Línea 1")  |
| `creado_en`| `timestamptz`| DEFAULT `now()`                      | Fecha de creación                 |

**Relaciones:** Referenciada por `ordenes_trabajo.area`.

#### 5.1.2 `materiales`

Catálogo de materiales disponibles para asignar a órdenes.

| Columna    | Tipo         | Constraints                          | Descripción                       |
|------------|--------------|--------------------------------------|-----------------------------------|
| `id`       | `uuid`       | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único del material |
| `nombre`   | `text`       | NOT NULL                             | Nombre del material               |
| `unidad`   | `text`       | DEFAULT `'pieza'`                    | Unidad de medida (pieza, litro, kg, etc.) |
| `creado_en`| `timestamptz`| DEFAULT `now()`                      | Fecha de creación                 |

**Relaciones:** Referenciada por `seguimiento_orden.material`.

#### 5.1.3 `usuarios`

Registro de todos los usuarios del sistema.

| Columna        | Tipo         | Constraints                          | Descripción                          |
|----------------|--------------|--------------------------------------|--------------------------------------|
| `id`           | `uuid`       | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único del usuario |
| `num_empleado` | `text`       | NOT NULL, UNIQUE                     | Número de empleado (5 caracteres para empleados regulares, "TOOLING01" para superadmin) |
| `nombre`       | `text`       | NOT NULL                             | Nombre completo del usuario          |
| `rol`          | `rol_usuario`| NOT NULL, DEFAULT `'solicitante'`    | Rol del usuario en el sistema        |
| `pin_hash`     | `text`       | NULLABLE                             | Hash bcrypt del PIN (NULL para solicitantes) |
| `activo`       | `boolean`    | DEFAULT `true`                       | Si el usuario está activo en el sistema |
| `turno`        | `integer`    | DEFAULT `1`                          | Turno de trabajo (1 = matutino, 2 = vespertino) |
| `creado_en`    | `timestamptz`| DEFAULT `now()`                      | Fecha de creación                    |
| `actualizado_en`| `timestamptz`| DEFAULT `now()`                     | Fecha de última actualización        |

**Relaciones:**
- Referenciada por `ordenes_trabajo.tecnico_asignado` (FK a `usuarios.id`)
- Referenciada por `seguimiento_orden.creado_por` (FK a `usuarios.id`)
- Referenciada por `historial_orden.creado_por` (FK a `usuarios.id`)

**Índices:**
- UNIQUE en `num_empleado`

#### 5.1.4 `ordenes_trabajo`

Tabla principal del sistema. Almacena todas las órdenes de trabajo.

| Columna             | Tipo              | Constraints                          | Descripción                          |
|---------------------|-------------------|--------------------------------------|--------------------------------------|
| `id`                | `uuid`            | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único de la orden |
| `numero_orden`      | `text`            | UNIQUE                               | Número de orden (formato: correlativo) |
| `area`              | `uuid`            | NOT NULL, FK → `areas.id`            | Área de trabajo                      |
| `maquina`           | `text`            | NOT NULL                             | Nombre de máquina o equipo           |
| `descripcion`       | `text`            | NOT NULL                             | Descripción del problema o trabajo    |
| `prioridad`         | `prioridad_orden` | NOT NULL, DEFAULT `'4_trabajo_rapido'` | Nivel de prioridad (1–5)          |
| `estado`            | `estado_orden`    | NOT NULL, DEFAULT `'nueva_orden'`    | Estado actual de la orden            |
| `tecnico_asignado`  | `uuid`            | NULLABLE, FK → `usuarios.id`         | Técnico asignado (puede ser NULL)    |
| `papeleta`          | `text`            | NULLABLE                             | Número de papeleta de producción      |
| `numero_equipo`     | `text`            | NULLABLE                             | Número de equipo                     |
| `folio_queja`       | `text`            | NULLABLE                             | Folio de queja de cliente (prioridad 2) |
| `nombre_autoriza`   | `text`            | NULLABLE                             | Nombre de quien autoriza             |
| `puesto_autoriza`   | `text`            | NULLABLE                             | Puesto de quien autoriza             |
| `fecha_inicio`      | `timestamptz`     | NULLABLE                             | Fecha y hora de inicio del trabajo   |
| `fecha_termino`     | `timestamptz`     | NULLABLE                             | Fecha y hora de finalización          |
| `horas_trabajado`   | `numeric(5,1)`    | NULLABLE                             | Horas trabajadas                     |
| `creado_por`        | `uuid`            | NULLABLE, FK → `usuarios.id`         | Usuario que creó la orden            |
| `creado_en`         | `timestamptz`     | DEFAULT `now()`                      | Fecha de creación                    |
| `actualizado_en`    | `timestamptz`     | DEFAULT `now()`                      | Última actualización                 |
| `entregada_en`      | `timestamptz`     | NULLABLE                             | Fecha de entrega confirmada          |
| `cancelada_en`      | `timestamptz`     | NULLABLE                             | Fecha de cancelación                 |

**Relaciones:**
- `area` → `areas.id`
- `tecnico_asignado` → `usuarios.id`
- `creado_por` → `usuarios.id`

**Índices:**
- UNIQUE en `numero_orden`
- Índice en `estado`
- Índice en `tecnico_asignado`
- Índice en `prioridad`
- Índice en `creado_en`

#### 5.1.5 `seguimiento_orden`

Registro de actualizaciones y avances en cada orden de trabajo.

| Columna         | Tipo              | Constraints                          | Descripción                          |
|-----------------|-------------------|--------------------------------------|--------------------------------------|
| `id`            | `uuid`            | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único del seguimiento |
| `orden_id`      | `uuid`            | NOT NULL, FK → `ordenes_trabajo.id`  | Orden de trabajo asociada            |
| `comentario`    | `text`            | NULLABLE                             | Comentario u observación             |
| `material`      | `text`            | NULLABLE                             | Material utilizado                   |
| `horas`         | `numeric(5,1)`    | NULLABLE                             | Horas registradas en este seguimiento |
| `creado_por`    | `uuid`            | NOT NULL, FK → `usuarios.id`         | Usuario que creó el registro         |
| `creado_en`     | `timestamptz`     | DEFAULT `now()`                      | Fecha y hora del registro            |

**Relaciones:**
- `orden_id` → `ordenes_trabajo.id` (ON DELETE CASCADE)
- `creado_por` → `usuarios.id`

**Índices:**
- Índice en `orden_id`

#### 5.1.6 `historial_orden`

Registro inmutable de auditoría para cada evento significativo en el ciclo de vida de una orden.

| Columna         | Tipo                  | Constraints                          | Descripción                          |
|-----------------|-----------------------|--------------------------------------|--------------------------------------|
| `id`            | `uuid`                | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Identificador único del evento  |
| `orden_id`      | `uuid`                | NOT NULL, FK → `ordenes_trabajo.id`  | Orden de trabajo asociada            |
| `tipo`          | `tipo_evento_orden`   | NOT NULL                             | Tipo de evento                       |
| `detalle`       | `text`                | NULLABLE                             | Descripción detallada del evento     |
| `fecha_evento`  | `timestamptz`         | DEFAULT `now()`                      | Fecha y hora del evento              |
| `creado_por`    | `uuid`                | NULLABLE, FK → `usuarios.id`         | Usuario que originó el evento        |

**Relaciones:**
- `orden_id` → `ordenes_trabajo.id` (ON DELETE CASCADE)
- `creado_por` → `usuarios.id`

**Índices:**
- Índice en `orden_id`
- Índice en `tipo`

### 5.2 Enums

#### 5.2.1 `rol_usuario`

Define los roles disponibles en el sistema.

| Valor           | Descripción                                         |
|-----------------|-----------------------------------------------------|
| `superadmin`    | Superadministrador con acceso total (solo TOOLING01)|
| `administrador` | Administrador del departamento de Tooling            |
| `tecnico`       | Técnico de mantenimiento / tooling                   |
| `solicitante`   | Solicitante de trabajos (personal de producción)     |

#### 5.2.2 `prioridad_orden`

Define los niveles de prioridad de las órdenes de trabajo.

| Valor                  | Código | Descripción                     | Color    | Autorización requerida |
|------------------------|:------:|---------------------------------|----------|:----------------------:|
| `1_seguridad`          | 1      | Riesgo inmediato de seguridad   | Rojo     | Sí                     |
| `2_queja_cliente`      | 2      | Queja de cliente externo        | Amarillo | Sí (con folio_queja)   |
| `3_maquina_parada`     | 3      | Máquina detenida sin planificar | Naranja  | No                     |
| `4_trabajo_rapido`     | 4      | Trabajo rápido (< 2 horas)      | Azul     | No                     |
| `5_fabricacion`        | 5      | Fabricación con proveedor externo| Gris    | No                     |

#### 5.2.3 `estado_orden`

Define los estados del ciclo de vida de una orden.

| Valor         | Descripción                              |
|---------------|------------------------------------------|
| `nueva_orden` | Orden recién creada, pendiente           |
| `en_proceso`  | Trabajo iniciado y en avance             |
| `terminada`   | Trabajo completado por el técnico        |
| `cancelada`   | Orden cancelada                          |
| `entregada`   | Entrega confirmada por administrador     |

#### 5.2.4 `tipo_evento_orden`

Define los tipos de eventos que se registran en el historial de auditoría.

| Valor             | Descripción                                    | Trigger                               |
|-------------------|------------------------------------------------|-----------------------------------------|
| `recepcion`       | Orden recibida / creada                        | Creación de la orden                    |
| `asignacion`      | Técnico asignado a la orden                    | Asignación desde admin                  |
| `inicio`          | Trabajo iniciado                               | Technician sets `fecha_inicio`          |
| `comentario`      | Comentario u observación agregada              | Nuevo comentario en seguimiento         |
| `autorizacion`    | Autorización registrada (prioridad 1-2)        | Admin ingresa nombre + puesto autoriza  |
| `cambio_estado`   | Cambio de estado de la orden                   | Cualquier cambio de `estado`            |
| `material`        | Material registrado                            | Se registra material en seguimiento     |
| `terminado`       | Trabajo finalizado                             | Technician sets `fecha_termino`         |
| `entrega`         | Orden entregada al solicitante                 | Admin marca como entregada              |

### 5.3 Vistas

#### 5.3.1 `vista_ordenes`

Vista completa que combina datos de `ordenes_trabajo`, `usuarios`, y `areas` para presentar una vista denormalizada de todas las órdenes.

**Columnas de la vista:**

| Columna             | Tipo              | Descripción                                      |
|---------------------|-------------------|--------------------------------------------------|
| `id`                | `uuid`            | ID de la orden                                   |
| `numero_orden`      | `text`            | Número correlativo                               |
| `area_nombre`       | `text`            | Nombre del área (JOIN con `areas`)               |
| `maquina`           | `text`            | Nombre de máquina                                |
| `descripcion`       | `text`            | Descripción del trabajo                           |
| `prioridad`         | `prioridad_orden` | Nivel de prioridad                               |
| `estado`            | `estado_orden`    | Estado actual                                    |
| `tecnico_nombre`    | `text`            | Nombre del técnico asignado (JOIN con `usuarios`)|
| `tecnico_id`        | `uuid`            | ID del técnico asignado                          |
| `papeleta`          | `text`            | Número de papeleta                               |
| `numero_equipo`     | `text`            | Número de equipo                                 |
| `folio_queja`       | `text`            | Folio de queja                                   |
| `nombre_autoriza`   | `text`            | Nombre del autorizante                           |
| `puesto_autoriza`   | `text`            | Puesto del autorizante                           |
| `fecha_inicio`      | `timestamptz`     | Fecha de inicio                                  |
| `fecha_termino`     | `timestamptz`     | Fecha de término                                 |
| `horas_trabajado`   | `numeric`         | Horas trabajadas                                 |
| `creado_por_nombre` | `text`            | Nombre de quien creó la orden (JOIN)             |
| `creado_en`         | `timestamptz`     | Fecha de creación                                |
| `actualizado_en`    | `timestamptz`     | Última actualización                             |
| `entregada_en`      | `timestamptz`     | Fecha de entrega                                 |
| `cancelada_en`      | `timestamptz`     | Fecha de cancelación                             |

**Uso:** Esta vista es consultada por las funciones del backend para listar órdenes en la interfaz.

#### 5.3.2 `grafica_ordenes_por_mes`

Vista que agrupa las órdenes por mes para la gráfica de tendencia.

| Columna  | Tipo         | Descripción                        |
|----------|--------------|------------------------------------|
| `mes`    | `text`       | Año-Mes (formato: "2026-07")       |
| `total`  | `bigint`     | Cantidad total de órdenes en el mes |
| `estado` | `estado_orden`| Estado de la orden                 |

**Uso:** Gráfica de barras apiladas mostrando órdenes por mes desglosadas por estado.

#### 5.3.3 `grafica_carga_tecnico`

Vista que muestra la carga de trabajo asignada a cada técnico.

| Columna           | Tipo     | Descripción                              |
|-------------------|----------|------------------------------------------|
| `tecnico_nombre`  | `text`   | Nombre del técnico                       |
| `total_ordenes`   | `bigint` | Cantidad de órdenes asignadas            |
| `en_proceso`      | `bigint` | Órdenes en proceso                       |
| `terminadas`      | `bigint` | Órdenes terminadas                       |

**Uso:** Gráfica de carga de trabajo por técnico.

#### 5.3.4 `grafica_prioridades`

Vista que agrupa las órdenes por nivel de prioridad.

| Columna    | Tipo              | Descripción                          |
|------------|-------------------|--------------------------------------|
| `prioridad`| `prioridad_orden` | Nivel de prioridad                   |
| `total`    | `bigint`          | Cantidad de órdenes                  |
| `estado`   | `estado_orden`    | Estado de la orden                   |

**Uso:** Gráfica de distribución de prioridades.

### 5.4 Funciones RPC

Funciones de PostgreSQL invocadas desde el frontend vía `supabase.rpc()`.

#### 5.4.1 `login_sin_pin`

Autentica usuarios que no requieren PIN (solicitantes).

**Parámetros:**

| Parámetro       | Tipo   | Descripción              |
|-----------------|--------|--------------------------|
| `p_num_empleado`| `text` | Número de empleado       |

**Retorna:**

| Campo    | Tipo   | Descripción                                      |
|----------|--------|--------------------------------------------------|
| `id`     | `uuid` | ID del usuario                                   |
| `nombre` | `text` | Nombre completo                                  |
| `rol`    | `text` | Rol del usuario                                  |
| `turno`  | `integer`| Turno de trabajo                               |

**Comportamiento:**
- Busca el usuario por `num_empleado` y `activo = true`.
- Verifica que el rol sea `solicitante` (no requiere PIN).
- Retorna los datos del usuario o error.

#### 5.4.2 `registro_automatico`

Registra automáticamente al usuario TOOLING01 en el primer acceso.

**Parámetros:**

| Parámetro       | Tipo   | Descripción              |
|-----------------|--------|--------------------------|
| `p_num_empleado`| `text` | Número de empleado       |
| `p_pin`         | `text` | PIN numérico             |

**Retorna:** Datos del usuario registrado.

**Comportamiento:**
- Crea el registro en `usuarios` con rol `superadmin`.
- Hashea el PIN con bcrypt.
- Solo funciona si el usuario no existe previamente.

#### 5.4.3 `login_con_pin`

Autentica usuarios que requieren PIN (admin, superadmin, técnico).

**Parámetros:**

| Parámetro       | Tipo   | Descripción              |
|-----------------|--------|--------------------------|
| `p_num_empleado`| `text` | Número de empleado       |
| `p_pin`         | `text` | PIN numérico             |

**Retorna:**

| Campo    | Tipo   | Descripción                                      |
|----------|--------|--------------------------------------------------|
| `id`     | `uuid` | ID del usuario                                   |
| `nombre` | `text` | Nombre completo                                  |
| `rol`    | `text` | Rol del usuario                                  |
| `turno`  | `integer`| Turno de trabajo                               |

**Comportamiento:**
- Busca el usuario por `num_empleado` y `activo = true`.
- Verifica el PIN contra `pin_hash` usando bcrypt.
- Retorna los datos del usuario o error de credenciales.

#### 5.4.4 `verificar_login`

Función auxiliar que verifica si un usuario existe y está activo.

**Parámetros:**

| Parámetro       | Tipo   | Descripción              |
|-----------------|--------|--------------------------|
| `p_num_empleado`| `text` | Número de empleado       |

**Retorna:** `boolean` — `true` si el usuario existe y está activo.

#### 5.4.5 `cambiar_pin`

Permite a un usuario cambiar su PIN.

**Parámetros:**

| Parámetro        | Tipo   | Descripción              |
|------------------|--------|--------------------------|
| `p_usuario_id`   | `uuid` | ID del usuario           |
| `p_pin_actual`   | `text` | PIN actual (verificación)|
| `p_pin_nuevo`    | `text` | Nuevo PIN                |

**Retorna:** `boolean` — `true` si el cambio fue exitoso.

**Comportamiento:**
- Verifica que `p_pin_actual` coincida con el `pin_hash` almacenado.
- Hashea `p_pin_nuevo` con bcrypt.
- Actualiza el registro en `usuarios`.

#### 5.4.6 `crear_usuario_admin`

Crea un nuevo usuario con privilegios de administrador. Solo accesible para `superadmin`.

**Parámetros:**

| Parámetro        | Tipo             | Descripción              |
|------------------|------------------|--------------------------|
| `p_num_empleado` | `text`           | Número de empleado       |
| `p_nombre`       | `text`           | Nombre completo          |
| `p_rol`          | `rol_usuario`    | Rol a asignar            |
| `p_pin`          | `text`           | PIN numérico             |
| `p_turno`        | `integer`        | Turno (1 o 2)            |

**Retorna:** Datos del usuario creado.

### 5.5 Triggers

#### 5.5.1 `trg_ordenes_actualizado`

Trigger que actualiza automáticamente el campo `actualizado_en` cada vez que se modifica un registro en `ordenes_trabajo`.

| Aspecto        | Detalle                                               |
|----------------|-------------------------------------------------------|
| Tabla          | `ordenes_trabajo`                                     |
| Evento         | `BEFORE UPDATE`                                       |
| Acción         | `NEW.actualizado_en = now()`                          |
| Función        | `trigger_set_timestamp()`                             |
| Fila afectada  | Cada fila modificada                                  |

**Propósito:** Mantener un registro preciso de cuándo fue modificada por última vez cada orden, sin depender de la aplicación para establecer este valor.

---

## 6. API Backend (supabase.js)

El archivo `supabase.js` encapsula todas las llamadas a Supabase (RPC, Storage, Auth). Cada función es exportada y utilizada por los componentes React del frontend.

### 6.1 Autenticación

#### `necesitaPin(numEmpleado)`

Verifica si un número de empleado corresponde a un usuario que requiere PIN para autenticarse.

**Parámetros:**

| Parámetro    | Tipo   | Descripción              |
|--------------|--------|--------------------------|
| `numEmpleado`| `string`| Número de empleado      |

**Retorna:** `boolean` — `true` si el usuario requiere PIN (rol != solicitante).

**Uso en UI:** Determina si mostrar el campo de PIN en el formulario de login.

---

#### `loginSinPin(numEmpleado)`

Realiza login sin PIN para solicitantes.

**Parámetros:**

| Parámetro    | Tipo   | Descripción              |
|--------------|--------|--------------------------|
| `numEmpleado`| `string`| Número de empleado      |

**Retorna:** Objeto con `{ id, nombre, rol, turno }` o `null` en caso de error.

---

#### `loginConPin(numEmpleado, pin)`

Realiza login con PIN para administradores, superadmin y técnicos.

**Parámetros:**

| Parámetro    | Tipo   | Descripción              |
|--------------|--------|--------------------------|
| `numEmpleado`| `string`| Número de empleado      |
| `pin`        | `string`| PIN numérico (≥4 dígitos)|

**Retorna:** Objeto con `{ id, nombre, rol, turno }` o `null` en caso de error.

---

#### `cambiarPin(usuarioId, pinActual, pinNuevo)`

Cambia el PIN de un usuario autenticado.

**Parámetros:**

| Parámetro     | Tipo   | Descripción              |
|---------------|--------|--------------------------|
| `usuarioId`   | `string`| UUID del usuario        |
| `pinActual`   | `string`| PIN actual              |
| `pinNuevo`    | `string`| Nuevo PIN               |

**Retorna:** `boolean` — `true` si el cambio fue exitoso.

---

#### `obtenerSesion()`

Obtiene la sesión actual del usuario desde `sessionStorage`.

**Parámetros:** Ninguno.

**Retorna:** Objeto de sesión o `null` si no hay sesión activa.

**Almacenamiento:** `sessionStorage.getItem('bwi_usuario')`.

---

#### `cerrarSesion()`

Cierra la sesión del usuario actual.

**Parámetros:** Ninguno.

**Acciones:**
- Elimina `bwi_usuario` de `sessionStorage`.
- Redirige al usuario a la página de login.

### 6.2 Gestión de Usuarios

#### `listarUsuarios()`

Obtiene la lista de todos los usuarios del sistema.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos usuario con `{ id, num_empleado, nombre, rol, activo, turno, creado_en }`.

**Orden:** Por `nombre` ascendente.

---

#### `crearUsuario(datos)`

Crea un nuevo usuario en el sistema.

**Parámetros:**

| Parámetro | Tipo     | Descripción                              |
|-----------|----------|------------------------------------------|
| `datos`   | `object` | `{ num_empleado, nombre, rol, pin, turno }` |

**Retorna:** Objeto del usuario creado o `null` en caso de error.

---

#### `toggleUsuario(usuarioId, activo)`

Activa o desactiva un usuario.

**Parámetros:**

| Parámetro    | Tipo      | Descripción                  |
|--------------|-----------|------------------------------|
| `usuarioId`  | `string`  | UUID del usuario             |
| `activo`     | `boolean` | Nuevo estado (true/false)    |

**Retorna:** `boolean` — `true` si la operación fue exitosa.

### 6.3 Gestión de Órdenes

#### `crearOrden(datos)`

Crea una nueva orden de trabajo.

**Parámetros:**

| Parámetro | Tipo     | Descripción                                        |
|-----------|----------|----------------------------------------------------|
| `datos`   | `object` | `{ area, maquina, descripcion, prioridad, papeleta, numero_equipo, tecnico_asignado, creado_por }` |

**Retorna:** Objeto de la orden creada.

**Efectos secundarios:**
- Genera número de orden correlativo.
- Registra evento `recepcion` en `historial_orden`.

---

#### `obtenerOrdenes(filtros?)`

Obtiene todas las órdenes (vista administrador).

**Parámetros:**

| Parámetro | Tipo     | Descripción                                              |
|-----------|----------|----------------------------------------------------------|
| `filtros` | `object` | Opcional: `{ estado, prioridad, area, fecha_inicio, fecha_fin }` |

**Retorna:** Array de órdenes completas con datos de área y técnico.

---

#### `obtenerMisOrdenes(usuarioId)`

Obtiene las órdenes creadas por un usuario específico (vista solicitante).

**Parámetros:**

| Parámetro   | Tipo     | Descripción                  |
|-------------|----------|------------------------------|
| `usuarioId` | `string` | UUID del solicitante         |

**Retorna:** Array de órdenes donde `creado_por = usuarioId`.

---

#### `obtenerOrdenesTecnico(tecnicoId)`

Obtiene las órdenes asignadas a un técnico específico.

**Parámetros:**

| Parámetro    | Tipo     | Descripción                  |
|--------------|----------|------------------------------|
| `tecnicoId`  | `string` | UUID del técnico             |

**Retorna:** Array de órdenes donde `tecnico_asignado = tecnicoId`.

---

#### `obtenerPerfilTecnico(tecnicoId)`

Obtiene el perfil completo de un técnico incluyendo métricas de desempeño.

**Parámetros:**

| Parámetro    | Tipo     | Descripción                  |
|--------------|----------|------------------------------|
| `tecnicoId`  | `string` | UUID del técnico             |

**Retorna:** Objeto con datos del técnico y métricas calculadas.

---

#### `actualizarSeguimientoTecnico(ordenId, datos)`

Permite al técnico actualizar el avance de una orden.

**Parámetros:**

| Parámetro  | Tipo     | Descripción                                            |
|------------|----------|--------------------------------------------------------|
| `ordenId`  | `string` | UUID de la orden                                       |
| `datos`    | `object` | `{ fecha_inicio, fecha_termino, horas_trabajado, comentario, material }` |

**Retorna:** Objeto actualizado o `null`.

**Efectos secundarios:**
- Si `fecha_inicio` se establece y el estado es `nueva_orden` → cambia a `en_proceso`.
- Si `fecha_termino` y `horas_trabajado` se establecen → cambia a `terminada`.
- Registra eventos correspondientes en `historial_orden`.

---

#### `actualizarEstado(ordenId, nuevoEstado, datos?)`

Cambia el estado de una orden (función de administrador).

**Parámetros:**

| Parámetro     | Tipo     | Descripción                                     |
|---------------|----------|-------------------------------------------------|
| `ordenId`     | `string` | UUID de la orden                                |
| `nuevoEstado` | `string` | Nuevo estado (`entregada`, `cancelada`, etc.)   |
| `datos`       | `object` | Opcional: `{ nombre_autoriza, puesto_autoriza, folio_queja }` |

**Retorna:** Objeto actualizado o `null`.

**Efectos secundarios:**
- Si el estado es `entregada` → establece `entregada_en`.
- Si el estado es `cancelada` → establece `cancelada_en`.
- Registra evento `cambio_estado` o `entrega` en `historial_orden`.

---

#### `cargarSeguimiento(ordenId)`

Carga todos los registros de seguimiento para una orden específica.

**Parámetros:**

| Parámetro  | Tipo     | Descripción                  |
|------------|----------|------------------------------|
| `ordenId`  | `string` | UUID de la orden             |

**Retorna:** Array de registros de seguimiento ordenados por `creado_en` descendente.

---

#### `guardarSeguimiento(ordenId, datos)`

Guarda un nuevo registro de seguimiento para una orden.

**Parámetros:**

| Parámetro  | Tipo     | Descripción                                        |
|------------|----------|----------------------------------------------------|
| `ordenId`  | `string` | UUID de la orden                                   |
| `datos`    | `object` | `{ comentario, material, horas, creado_por }`      |

**Retorna:** Objeto del registro creado.

**Efectos secundarios:**
- Si se registra `material` → evento `material` en historial.
- Si se registra `comentario` → evento `comentario` en historial.

### 6.4 Archivos y Documentos

#### `obtenerUrlPlano(ordenId)`

Obtiene una URL firmada para acceder al archivo/plano asociado a una orden.

**Parámetros:**

| Parámetro  | Tipo     | Descripción                  |
|------------|----------|------------------------------|
| `ordenId`  | `string` | UUID de la orden             |

**Retorna:** `string` — URL firmada con expiración de 1 hora.

**Bucket:** `planos`

---

#### `obtenerLogoBase64()`

Obtiene el logo de BWI en formato Base64 para incluirlo en impresiones y reportes.

**Parámetros:** Ninguno.

**Retorna:** `string` — Imagen en Base64 (`data:image/png;base64,...`).

**Fuente:** Archivo `logo-bwi.png` en el directorio `public/`.

### 6.5 Historial y Auditoría

#### `registrarEvento(ordenId, tipo, detalle?)`

Registra un evento en el historial de auditoría de una orden.

**Parámetros:**

| Parámetro  | Tipo             | Descripción                    |
|------------|------------------|--------------------------------|
| `ordenId`  | `string`         | UUID de la orden               |
| `tipo`     | `tipo_evento_orden` | Tipo de evento (ver 5.2.4) |
| `detalle`  | `string`         | Opcional: descripción detallada|

**Retorna:** Objeto del evento registrado.

**Propiedad clave:** Los eventos son **append-only** (solo inserción, nunca se eliminan ni modifican).

---

#### `agregarComentarioHistorial(ordenId, comentario, usuarioId)`

Registra un evento de tipo `comentario` en el historial.

**Parámetros:**

| Parámetro   | Tipo     | Descripción                    |
|-------------|----------|--------------------------------|
| `ordenId`   | `string` | UUID de la orden               |
| `comentario`| `string` | Texto del comentario           |
| `usuarioId` | `string` | UUID del usuario que comenta   |

**Retorna:** Objeto del evento registrado.

---

#### `cargarHistorial(ordenId)`

Carga todo el historial de eventos para una orden específica.

**Parámetros:**

| Parámetro  | Tipo     | Descripción                  |
|------------|----------|------------------------------|
| `ordenId`  | `string` | UUID de la orden             |

**Retorna:** Array de eventos ordenados por `fecha_evento` descendente, con el nombre del usuario que creó cada evento (JOIN con `usuarios`).

### 6.6 Gráficas y Reportes

#### `datosGraficaMes()`

Obtiene datos para la gráfica de órdenes por mes.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ mes, total, estado }` agrupados por mes y estado.

**Vista subyacente:** `grafica_ordenes_por_mes`.

---

#### `datosGraficaTecnicos()`

Obtiene datos para la gráfica de carga de trabajo por técnico.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ tecnico_nombre, total_ordenes, en_proceso, terminadas }`.

**Vista subyacente:** `grafica_carga_tecnico`.

---

#### `datosGraficaPrioridades()`

Obtiene datos para la gráfica de distribución por prioridad.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ prioridad, total, estado }`.

**Vista subyacente:** `grafica_prioridades`.

### 6.7 Catálogos

#### `obtenerMateriales()`

Obtiene la lista de materiales disponibles.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ id, nombre, unidad }`.

---

#### `obtenerAreas()`

Obtiene la lista de áreas de trabajo.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ id, nombre }`.

---

#### `obtenerTecnicos()`

Obtiene la lista de técnicos activos.

**Parámetros:** Ninguno.

**Retorna:** Array de objetos `{ id, nombre, turno }` filtrado por `rol = 'tecnico'` y `activo = true`.

---

## 7. Sistema de Prioridades

Las prioridades determinan la urgencia de una orden de trabajo y, en algunos casos, activan requisitos de autorización obligatoria.

### 7.1 Definición de Prioridades

| Prioridad | Valor Enum           | Etiqueta              | Descripción                                           | Color    | Autorización |
|:---------:|----------------------|-----------------------|-------------------------------------------------------|----------|:------------:|
| 1         | `1_seguridad`        | Seguridad             | Riesgo inmediato de seguridad personal o del equipo. | `#EF4444`| Obligatoria  |
| 2         | `2_queja_cliente`    | Queja de Cliente      | Queja formal de un cliente externo.                   | `#F59E0B`| Obligatoria  |
| 3         | `3_maquina_parada`   | Máquina Parada        | Máquina o equipo detenido sin planificación.          | `#F97316`| No requerida |
| 4         | `4_trabajo_rapido`   | Trabajo Rápido        | Trabajo de corta duración (< 2 horas).                | `#3B82F6`| No requerida |
| 5         | `5_fabricacion`      | Fabricación           | Fabricación de componente con proveedor externo.      | `#6B7280`| No requerida |

### 7.2 Requisitos de Autorización

Las prioridades 1 y 2 requieren que un administrador o superadmin registre la autorización antes de que la orden pueda avanzar. La autorización se captura en el formulario de seguimiento con los siguientes campos:

| Campo               | Tipo   | Requerido para | Descripción                            |
|----------------------|--------|----------------|----------------------------------------|
| `nombre_autoriza`    | `text` | Prioridad 1 y 2| Nombre completo del autorizante        |
| `puesto_autoriza`    | `text` | Prioridad 1 y 2| Puesto o cargo del autorizante         |
| `folio_queja`        | `text` | Solo prioridad 2| Número de folio de la queja del cliente|

### 7.3 Comportamiento Visual

| Prioridad | Color CSS    | Indicador visual en la UI                     |
|-----------|--------------|-----------------------------------------------|
| 1         | `#EF4444`    | Badge rojo, borde rojo en tarjeta, icono ⚠️    |
| 2         | `#F59E0B`    | Badge amarillo, borde amarillo                 |
| 3         | `#F97316`    | Badge naranja, borde naranja                   |
| 4         | `#3B82F6`    | Badge azul, borde azul                         |
| 5         | `#6B7280`    | Badge gris, borde gris                         |

---

## 8. Historial y Trazabilidad (Auditoría)

### 8.1 Propósito

El sistema de historial proporciona un **registro inmutable y completo** de todas las acciones realizadas sobre cada orden de trabajo. Este registro cumple con los requisitos de auditoría interna y trazabilidad de procesos.

### 8.2 Tabla `historial_orden`

Cada registro en esta tabla contiene:

| Campo          | Tipo                  | Descripción                                        |
|----------------|-----------------------|----------------------------------------------------|
| `id`           | `uuid`                | Identificador único del evento                     |
| `orden_id`     | `uuid`                | Orden de trabajo asociada                          |
| `tipo`         | `tipo_evento_orden`   | Tipo de evento (ver sección 5.2.4)                 |
| `detalle`      | `text`                | Descripción detallada del evento                   |
| `fecha_evento` | `timestamptz`         | Fecha y hora en que ocurrió el evento              |
| `creado_por`   | `uuid`                | Usuario que originó el evento                      |

### 8.3 Tipos de Eventos y Triggers

| #  | Tipo Evento       | Cuándo se Registra                                    | Detalle Típico                                              |
|----|-------------------|--------------------------------------------------------|-------------------------------------------------------------|
| 1  | `recepcion`       | Creación de la orden                                   | "Orden creada por [nombre]"                                 |
| 2  | `asignacion`      | Asignación de técnico desde admin                      | "Técnico [nombre] asignado"                                 |
| 3  | `inicio`          | Technician establece `fecha_inicio`                     | "Trabajo iniciado el [fecha]"                               |
| 4  | `comentario`      | Nuevo comentario en seguimiento                         | Texto del comentario                                        |
| 5  | `autorizacion`    | Admin registra nombre + puesto de autorización          | "Autorizado por [nombre], [puesto]"                        |
| 6  | `cambio_estado`   | Cualquier cambio de estado de la orden                 | "Estado cambiado de [anterior] a [nuevo]"                   |
| 7  | `material`        | Registro de material en seguimiento                     | "Material: [nombre], [cantidad]"                            |
| 8  | `terminado`       | Technician establece `fecha_termino` + `horas`          | "Trabajo terminado, [horas] horas"                          |
| 9  | `entrega`         | Admin marca orden como entregada                       | "Orden entregada al solicitante"                            |

### 8.4 Propiedades del Historial

- **Append-only:** Los eventos solo se insertan. Nunca se eliminan ni modifican.
- **Timestamp automático:** `fecha_evento` se establece con `now()` al momento de la inserción.
- **Trazabilidad completa:** Cada evento incluye el usuario que lo originó (`creado_por`).
- **Consulta ascendente:** El historial se presenta en orden cronológico (más reciente primero).
- **Relación con orden:** Cada evento está vinculado a una orden específica vía `orden_id`.
- **Integridad referencial:** Si una orden se elimina, sus eventos se eliminan en cascada (`ON DELETE CASCADE`).

---

## 9. Gestión de Documentos

### 9.1 Storage Bucket

Los documentos se almacenan en el bucket de Supabase Storage llamado **`planos`**.

| Aspecto          | Detalle                                                  |
|------------------|----------------------------------------------------------|
| Bucket           | `planos`                                                 |
| Path convention   | `{orden_id}/{filename}`                                  |
| Acceso           | URLs firmadas (signed URLs)                              |
| Expiración URL   | 1 hora (3600 segundos)                                   |

### 9.2 Formatos Soportados

| Formato | Extensión   | Uso típico                                    |
|---------|-------------|-----------------------------------------------|
| PDF     | `.pdf`      | Planos, especificaciones, documentos técnicos |
| DWG     | `.dwg`      | Archivos de AutoCAD                           |
| DXF     | `.dxf`      | Archivos de intercambio CAD                   |
| DOC     | `.doc`      | Documentos Word (legado)                      |
| DOCX    | `.docx`     | Documentos Word                               |
| PNG     | `.png`      | Imágenes, capturas de pantalla                |
| JPG     | `.jpg`      | Fotografías de máquinas, problemas            |
| WEBP    | `.webp`     | Imágenes optimizadas                          |

### 9.3 Restricciones

| Restricción        | Valor                                        |
|--------------------|----------------------------------------------|
| Tamaño máximo      | **20 MB** por archivo                        |
| Nombre del bucket  | `planos`                                     |
| Acceso             | Solo usuarios autenticados vía signed URL     |
| Políticas RLS      | Configuradas en Supabase Storage              |

### 9.4 Previsualización en Línea

El sistema ofrece previsualización inline de documentos según su tipo:

| Tipo de archivo | Método de previsualización                                     |
|-----------------|----------------------------------------------------------------|
| PDF             | `<iframe>` con URL firmada                                    |
| Imágenes (PNG, JPG, WEBP) | `<img>` con URL firmada                          |
| DWG, DXF        | Sin previsualización (solo descarga)                           |
| DOC, DOCX       | Sin previsualización (solo descarga o apertura externa)       |

### 9.5 Flujo de Subida

1. El usuario selecciona un archivo desde la interfaz.
2. El frontend valida el tamaño (≤ 20 MB) y el formato.
3. Se genera la ruta de almacenamiento: `{orden_id}/{nombre_archivo}`.
4. Se sube el archivo al bucket `planos` vía `supabase.storage.from('planos').upload(...)`.
5. Se genera una URL firmada de 1 hora para acceso inmediato.
6. Se actualiza la orden con la referencia al archivo subido.

---

## 10. Exportación de Reportes

### 10.1 Motor de Exportación

La exportación utiliza **SheetJS (xlsx)** para generar archivos Excel (.xlsx) desde el navegador.

### 10.2 Tipos de Reporte

#### 10.2.1 Reporte de Órdenes de Trabajo

| Aspecto         | Detalle                                                    |
|-----------------|------------------------------------------------------------|
| Nombre archivo  | `BWI_TOOLROOM_Ordenes_{fecha}.xlsx`                       |
| Hojas           | 1–2 (Resumen + Detalle)                                   |
| Filtros         | Rango de fechas, estado, prioridad, área                   |
| Columnas        | Número orden, área, máquina, descripción, prioridad, estado, técnico, fecha creación, horas |

#### 10.2.2 Reporte de Desempeño de Técnicos

| Aspecto         | Detalle                                                    |
|-----------------|------------------------------------------------------------|
| Nombre archivo  | `BWI_TOOLROOM_Desempeno_{fecha}.xlsx`                     |
| Hojas           | 1–2 (Resumen + Detalle por técnico)                       |
| Filtros         | Rango de fechas                                            |
| Columnas        | Técnico, órdenes completadas, horas trabajadas, utilización, órdenes por prioridad |

### 10.3 Estructura del Archivo Excel

#### Hoja: Resumen

| Columna               | Tipo    | Descripción                              |
|-----------------------|---------|------------------------------------------|
| Período               | Texto   | Rango de fechas del reporte              |
| Total Órdenes         | Número  | Cantidad total de órdenes                |
| Órdenes Completadas   | Número  | Órdenes en estado `entregada`            |
| Órdenes Pendientes    | Número  | Órdenes en otros estados                 |
| Horas Totales         | Número  | Suma de horas trabajadas                 |

#### Hoja: Detalle

| Columna          | Tipo    | Descripción                              |
|------------------|---------|------------------------------------------|
| N° Orden         | Texto   | Número correlativo                       |
| Área             | Texto   | Área de trabajo                          |
| Máquina          | Texto   | Nombre de máquina                        |
| Descripción      | Texto   | Descripción del trabajo                  |
| Prioridad        | Texto   | Nivel de prioridad                       |
| Estado           | Texto   | Estado actual                            |
| Técnico          | Texto   | Nombre del técnico asignado              |
| Fecha Creación   | Fecha   | Fecha de creación                        |
| Fecha Entrega    | Fecha   | Fecha de entrega (si aplica)             |
| Horas            | Número  | Horas trabajadas                         |

### 10.4 Formato del Nombre de Archivo

```
BWI_TOOLROOM_{TipoReporte}_{YYYY-MM-DD}.xlsx
```

**Ejemplo:**
```
BWI_TOOLROOM_Ordenes_2026-07-15.xlsx
BWI_TOOLROOM_Desempeno_2026-07-15.xlsx
```

---

## 11. Impresión de Órdenes

### 11.1 Formulario Estándar

El sistema genera impresiones que siguen el formato del formulario **F-1100.C.03-02 Rev. 06** (26 de agosto de 2024), un documento estándar del departamento de Tooling de BWI.

### 11.2 Rutas de Impresión

| Método                  | Archivo                          | Descripción                                              |
|-------------------------|----------------------------------|----------------------------------------------------------|
| Componente React        | `ImprimirOrden.jsx`              | Renderizado completo vía React con estilos CSS dedicados |
| Función inline          | `abrirImpresion()`               | Genera HTML en una nueva ventana del navegador           |

### 11.3 Especificaciones de Impresión

| Aspecto          | Detalle                                                    |
|------------------|------------------------------------------------------------|
| Tamaño de papel  | Carta (Letter) — 8.5" × 11"                               |
| Márgenes         | 10 mm por lado                                              |
| Orientación      | Vertical (Portrait)                                         |
| CSS Print        | `@media print` con reglas específicas                      |
| Logo             | `logo-bwi.png` incluido en el encabezado                   |

### 11.4 Contenido del Documento Impreso

| Sección               | Contenido                                                    |
|-----------------------|--------------------------------------------------------------|
| Encabezado            | Logo BWI, número de orden, fecha de emisión                  |
| Datos de la Orden     | Área, máquina, descripción, prioridad, papeleta              |
| Información Técnica   | Técnico asignado, fecha inicio, fecha término, horas         |
| Autorización          | Nombre y puesto del autorizante (si aplica)                  |
| Materiales            | Lista de materiales utilizados                               |
| Comentarios           | Observaciones y notas de avance                              |
| Firmas                | Espacios para firma del técnico, administrador y solicitante |

### 11.5 Consideraciones de Implementación

- Se abre una nueva ventana del navegador (`window.open`) para la impresión.
- Se requiere que el navegador permita pop-ups para el dominio del sistema.
- El logo `logo-bwi.png` debe estar presente en el directorio `public/` de la aplicación.
- Los estilos `@media print` ocultan elementos de navegación y botones de la UI.

---

## 12. Métricas de Técnicos

### 12.1 Horas Disponibles por Turno

| Turno           | Horas/Día | Semana | Mes (4 semanas) | Descripción               |
|-----------------|:---------:|:------:|:---------------:|---------------------------|
| 1 (Matutino)    | 8.0       | 40.0   | 160.0           | Turno estándar de 8 horas |
| 2 (Vespertino)  | 7.5       | 37.5   | 150.0           | Turno de 7.5 horas        |

### 12.2 Cálculo de Utilización

La utilización se calcula como la proporción entre las horas efectivamente trabajadas y las horas disponibles:

```
Utilización = (Horas Trabajadas / Horas Disponibles) × 100
```

**Horas trabajadas:** Suma de `horas_trabajado` de todas las órdenes asignadas al técnico en el período.
**Horas disponibles:** Según el turno del técnico (ver tabla 12.1).

### 12.3 Umbrales de Color

| Utilización         | Color  | Significado                           |
|---------------------|--------|---------------------------------------|
| ≥ 80%               | Verde  | Alta productividad                    |
| 50% – 79%           | Amarillo|productividad moderada                |
| < 50%               | Rojo   | Baja productividad, revisar carga     |

### 12.4 Tipos de Gráficas de Métricas

| Gráfica                       | Tipo         | Período         | Descripción                                     |
|-------------------------------|--------------|-----------------|--------------------------------------------------|
| Semanal / Mensual             | Barras       | Semana/Mes      | Horas trabajadas vs. disponibles por técnico     |
| Progreso de Eficiencia        | Barras horiz.| Actual          | Utilización por técnico con umbral de color       |
| Tendencia de 6 meses          | Línea        | 6 meses         | Evolución de la utilización por técnico           |

### 12.5 Datos para Gráficas

Las gráficas se alimentan de:

- **`obtenerPerfilTecnico()`**: Datos del técnico y métricas calculadas.
- **`obtenerOrdenesTecnico()`**: Órdenes asignadas al técnico para calcular horas.
- **Datos de turno**: Campo `turno` en la tabla `usuarios` determina las horas disponibles.

---

## 13. Diseño de Interfaz (UI/UX)

### 13.1 Tema Visual: Dark Premium

El sistema utiliza un tema oscuro de alta calidad con los siguientes colores base:

| Elemento          | Color         | Código HEX    | Uso                                              |
|-------------------|---------------|---------------|--------------------------------------------------|
| Fondo principal   | Negro profundo| `#0F1117`     | Background general de la aplicación               |
| Superficies       | Gris oscuro   | `#181C25`     | Tarjetas, paneles, modales                        |
| Texto principal   | Blanco        | `#FFFFFF`     | Títulos, contenido primario                       |
| Texto secundario  | Gris claro    | `#9CA3AF`     | Descripciones, etiquetas, texto auxiliar           |
| Bordes            | Gris sutil    | `#2D3142`     | Separadores, bordes de tarjetas                   |

### 13.2 Efecto Glassmorphism

El sistema emplea efectos de **glassmorphism** para crear sensación de profundidad:

```css
/* Ejemplo de estilo glassmorphism */
background: rgba(24, 28, 37, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.05);
border-radius: 12px;
```

**Elementos con glassmorphism:**
- Paneles de navegación
- Tarjetas de información
- Modales y diálogos
- Tooltips

### 13.3 Sistema de Colores de Acento

| Color        | Código HEX    | Uso                                                  |
|--------------|---------------|------------------------------------------------------|
| Azul acento  | `#3B82F6`     | Botones principales, enlaces, elementos interactivos |
| Verde éxito  | `#10B981`     | Estados positivos, confirmaciones, éxito             |
| Ámbar alerta | `#F59E0B`     | Advertencias, alertas, estados pendientes            |
| Rojo error   | `#EF4444`     | Errores, eliminaciones, estados críticos             |
| Púrpura      | `#8B5CF6`     | Elementos especiales, badges premium                 |

### 13.4 Animaciones (Framer Motion)

El sistema utiliza **Framer Motion** para animaciones fluidas y naturales:

| Tipo de Animación | Uso                                              | Configuración típica                   |
|--------------------|--------------------------------------------------|----------------------------------------|
| `fade`             | Aparición/desaparición de elementos              | `initial: { opacity: 0 }`             |
| `scale`            | Botones, tarjetas al interactuar                 | `whileHover: { scale: 1.02 }`         |
| `hover`            | Interacción con elementos interactivos           | `whileHover: { y: -2 }`               |
| `stagger`          | Listas y secuencias de elementos                 | `staggerChildren: 0.05`               |
| `layout`           | Reorganización de elementos                      | `layout` prop en componentes           |

### 13.5 Diseño Responsivo

| Breakpoint | Ancho        | Comportamiento                                    |
|------------|--------------|---------------------------------------------------|
| Mobile     | < 640px      | Layout de una columna, menú colapsado             |
| Tablet     | 640–1024px   | Layout de dos columnas, menú lateral colapsado    |
| Desktop    | > 1024px     | Layout completo, menú lateral fijo                |

### 13.6 Componentes Principales

| Componente        | Descripción                                                 |
|-------------------|-------------------------------------------------------------|
| `Sidebar`         | Navegación lateral con iconos y etiquetas                    |
| `Header`          | Barra superior con información del usuario y acciones       |
| `Card`            | Tarjeta de contenido con glassmorphism                       |
| `Modal`           | Diálogo modal con animación de entrada/salida                |
| `Badge`           | Etiqueta de estado/prioridad con color dinámico             |
| `Button`          | Botón con variantes (primary, secondary, danger, ghost)     |
| `Input`           | Campo de entrada con estilo oscuro y focus ring              |
| `Select`          | Selector desplegable con estilos consistentes                |
| `Table`           | Tabla de datos con sorting y paginación                      |
| `Spinner`         | Indicador de carga animado                                   |
| `Toast`           | Notificación emergente de éxito/error/info                   |

---

## 14. Seguridad

### 14.1 Hashing de Contraseñas

Los PINs se almacenan hasheados con **bcrypt**, un algoritmo de hashing adaptativo y resistente a ataques de fuerza bruta.

| Aspecto          | Detalle                                              |
|------------------|------------------------------------------------------|
| Algoritmo        | bcrypt                                               |
| Cost factor      | Configurado en Supabase (por defecto: 10)            |
| Salt             | Generado automáticamente por bcrypt                  |
| Almacenamiento   | Campo `pin_hash` en tabla `usuarios`                 |
| Verificación     | Función RPC `login_con_pin` compara con `bcrypt.compare`|

### 14.2 Funciones SECURITY DEFINER

Las funciones RPC de autenticación (`login_sin_pin`, `login_con_pin`, `registro_automatico`, `verificar_login`, `cambiar_pin`, `crear_usuario_admin`) están definidas con `SECURITY DEFINER`.

| Aspecto              | Detalle                                                    |
|----------------------|------------------------------------------------------------|
| Definición           | `CREATE OR REPLACE FUNCTION ... SECURITY DEFINER`          |
| Comportamiento       | La función se ejecuta con los privilegios del propriétaire (supabase_admin) |
| Propósito            | Permitir que usuarios con permisos limitados ejecuten operaciones de autenticación |
| Riesgo mitigado      | Las funciones validan parámetros y retornan solo datos necesarios |

### 14.3 URLs Firmadas (Signed URLs)

Los documentos almacenados en Supabase Storage se acceden mediante **URLs firmadas**:

| Aspecto          | Detalle                                              |
|------------------|------------------------------------------------------|
| Método           | `supabase.storage.from('planos').createSignedUrl()`  |
| Expiración       | 1 hora (3600 segundos)                               |
| Token            | Firma criptográfica incluida en la URL               |
| Acceso           | Solo accesible con token válido                      |
| Renovación       | Se genera una nueva URL cada vez que se solicita      |

### 14.4 Sesiones y Almacenamiento

| Aspecto              | Detalle                                                    |
|----------------------|------------------------------------------------------------|
| Mecanismo            | `sessionStorage` del navegador                             |
| Key                  | `bwi_usuario`                                              |
| Contenido            | `{ id, num_empleado, nombre, rol, turno }`                 |
| Duración             | Se borra al cerrar el navegador (no persiste)              |
| Visibilidad          | Solo accesible desde la misma pestaña/origen               |
| Cookies              | No se utilizan cookies para sesión                         |

### 14.5 Control de Acceso Basado en Roles (RBAC)

El sistema implementa RBAC en la capa de presentación:

| Capa              | Implementación                                              |
|-------------------|-------------------------------------------------------------|
| Frontend (UI)     | Condiciones en JSX que renderizan/ocultan elementos según `rol` |
| Backend (RPC)     | Validación de permisos en funciones PostgreSQL              |
| Storage           | Políticas de bucket en Supabase Storage                     |

### 14.6 Limitaciones de Seguridad

| Limitación                        | Descripción                                                    |
|-----------------------------------|----------------------------------------------------------------|
| Sin RLS policy definida           | Las tablas no tienen Row-Level Security policies configuradas; la seguridad depende de SECURITY DEFINER |
| Sesión en sessionStorage          | Se pierde al cerrar el navegador; no hay persistencia         |
| Sin refresh token                 | La sesión no se renueva automáticamente                       |
| Sin rate limiting en login        | No hay protección contra brute force en el endpoint de login   |
| PINs numéricos simples            | Los PINs son solo numéricos (4+ dígitos), susceptible a fuerza bruta si el cost factor es bajo |

---

## 15. Despliegue y Mantenimiento

### 15.1 Arquitectura de Despliegue

```
┌──────────────────────────────────────────────────────────┐
│                    INTERNET                               │
│                                                          │
│  ┌──────────────┐           ┌────────────────────────┐   │
│  │   CDN/Vercel │           │    Supabase Cloud       │   │
│  │   /Netlify   │           │                         │   │
│  │              │    API    │  ┌──────────────────┐   │   │
│  │  Frontend    │◄─────────►│  │   PostgreSQL      │   │   │
│  │  (estático)  │   HTTPS   │  │   (base datos)    │   │   │
│  │              │           │  └──────────────────┘   │   │
│  │  React + Vite│           │  ┌──────────────────┐   │   │
│  │  (SPA)       │           │  │   Auth            │   │   │
│  └──────────────┘           │  │   (autenticación) │   │   │
│                             │  └──────────────────┘   │   │
│                             │  ┌──────────────────┐   │   │
│                             │  │   Storage         │   │   │
│                             │  │   (planos/docs)   │   │   │
│                             │  └──────────────────┘   │   │
│                             │  ┌──────────────────┐   │   │
│                             │  │   Edge Functions  │   │   │
│                             │  │   (RPC functions) │   │   │
│                             │  └──────────────────┘   │   │
│                             └────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 15.2 Frontend

| Aspecto            | Detalle                                                    |
|--------------------|------------------------------------------------------------|
| Framework          | React 18                                                    |
| Bundler            | Vite 5                                                     |
| Comando build      | `npm run build` (o `yarn build`)                          |
| Salida             | Directorio `dist/` (HTML, CSS, JS estáticos)              |
| Despliegue         | Vercel / Netlify (auto-deploy desde GitHub)               |
| Variables de entorno | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`           |
| Dominio            | Configurado en el proveedor de hosting                     |

### 15.3 Backend (Supabase Cloud)

| Aspecto            | Detalle                                                    |
|--------------------|------------------------------------------------------------|
| Proveedor          | Supabase (supabase.com)                                   |
| Base de datos      | PostgreSQL administrado                                    |
| Auth               | Supabase Auth (custom claims, bcrypt)                     |
| Storage            | Supabase Storage (bucket: `planos`)                       |
| Edge Functions     | Supabase Edge Functions (Deno)                             |
| Dashboard          | https://app.supabase.com                                  |
| Tier               | Free / Pro (según uso)                                    |

### 15.4 Backup de Base de Datos

| Aspecto            | Detalle                                                    |
|--------------------|------------------------------------------------------------|
| Método             | Supabase Dashboard → Database → Backups                   |
| Backups automáticos| Diarios (retención según plan)                             |
| Backup manual      | Descarga de dump SQL desde el dashboard                    |
| Restauración       | Desde el dashboard de Supabase                             |

### 15.5 Archivos de Migración

Los scripts SQL de migración se encuentran en la raíz del proyecto:

| Archivo                 | Contenido                                                  |
|-------------------------|------------------------------------------------------------|
| `00_create_tables.sql`  | Creación de tablas, enums, relaciones                       |
| `01_create_functions.sql`| Creación de funciones RPC                                  |
| `02_create_views.sql`   | Creación de vistas                                         |
| `03_create_triggers.sql`| Creación de triggers                                       |
| `04_seed_data.sql`      | Datos iniciales (usuarios, áreas, materiales)              |

### 15.6 Control de Versiones

| Aspecto            | Detalle                                                    |
|--------------------|------------------------------------------------------------|
| Repositorio        | GitHub: `danysan97/bwi-tooling`                           |
| Ramas              | `main` (producción), `develop` (desarrollo)               |
| Commits            | Mensajes descriptivos en español                           |
| Tags               | Formato `v{major}.{minor}.{patch}` (ej: `v1.0.2`)        |

---

## 16. Troubleshooting / Solución de Problemas

### 16.1 Problemas de Autenticación

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| "Usuario no encontrado"         | Número de empleado incorrecto o inactivo          | Verificar el número (5 caracteres). Verificar que el usuario esté activo en `usuarios`. |
| "PIN incorrecto"                | PIN digitado erróneamente                         | Verificar PIN. Si se olvidó, el superadmin puede restablecerlo. |
| Login no carga después de credenciales | Error de red o CORS                           | Verificar conexión a internet. Revisar consola del navegador (F12). |
| Sesión se pierde inesperadamente| Cierre de navegador o pestaña                     | `sessionStorage` se borra al cerrar. Volver a iniciar sesión. |
| TOOLING01 no puede acceder      | Usuario no registrado en la BD                    | Ejecutar `registro_automatico` o insertar manualmente en `usuarios`. |

### 16.2 Problemas con Órdenes

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| Órdenes no aparecen en la lista | Filtros activos o vista mal configurada           | Limpiar filtros. Verificar que `vista_ordenes` exista.    |
| No se puede cambiar estado       | Orden en estado incorrecto o campos requeridos faltantes | Verificar requisitos del estado destino (ver 4.3).        |
| Autorización no se guarda        | Campos `nombre_autoriza` y `puesto_autoriza` vacíos| Completar ambos campos antes de guardar.                   |
| Técnico no puede actualizar      | Orden no asignada al técnico                      | Verificar `tecnico_asignado` en la orden.                 |
| Número de orden duplicado        | Error en generación correlativo                   | Verificar secuencia de `numero_orden` en la BD.           |

### 16.3 Problemas con Archivos

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| No se puede subir archivo        | Archivo mayor a 20 MB                             | Comprimir o dividir el archivo.                           |
| Formato no soportado             | Extensión no permitida                             | Convertir a PDF, PNG, JPG u otro formato soportado.       |
| URL firmada expirada             | Pasaron más de 60 minutos desde la generación     | Solicitar una nueva URL firmada.                          |
| Bucket "planos" no existe        | Bucket no creado en Supabase Storage              | Crear el bucket "planos" desde el dashboard de Supabase.  |
| Previsualización no carga        | Error de CORS o URL inválida                       | Verificar que la URL firmada sea válida y no haya expirado.|

### 16.4 Problemas de Estado

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| Estado no cambia a `en_proceso`  | `fecha_inicio` no establecida                     | El técnico debe registrar `fecha_inicio` en seguimiento.  |
| Estado no cambia a `terminada`   | `fecha_termino` o `horas_trabajado` faltan        | Ambos campos son requeridos para la finalización.          |
| No se puede cancelar             | Orden ya entregada                                | Solo se pueden cancelar órdenes no entregadas.            |
| Autorización faltante (prioridad 1-2) | No se completaron campos de autorización  | Completar `nombre_autoriza` y `puesto_autoriza`.          |

### 16.5 Problemas de Impresión

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| Ventana de impresión no abre     | Bloqueador de pop-ups activo                      | Permitir pop-ups para el dominio del sistema.             |
| Logo no aparece                  | Archivo `logo-bwi.png` no está en `public/`      | Verificar que el archivo exista en el directorio `public/`.|
| Formato desalineado              | Estilos CSS no cargan correctamente               | Usar Chrome o Edge para mejor compatibilidad de `@media print`. |
| Impresión en blanco              | Contenido no se renderiza a tiempo                | Esperar a que el contenido se cargue completamente antes de imprimir. |

### 16.6 Problemas de Rendimiento

| Problema                         | Causa probable                                    | Solución                                                  |
|----------------------------------|---------------------------------------------------|-----------------------------------------------------------|
| Carga lenta de órdenes          | Muchos registros sin índice                        | Verificar índices en `ordenes_trabajo`. Optimizar queries. |
| Gráficas lentas                 | Datos históricos extensos                          | Filtrar por rango de fechas recientes.                    |
| Navegación lenta                 | Demasiados re-renders en React                     | Revisar uso de `useMemo` y `useCallback`.                 |

---

## 17. Glosario

| Término              | Definición                                                              |
|----------------------|-------------------------------------------------------------------------|
| **BWI**              | Empresa propietaria del sistema. Busneses Wrigley International.        |
| **Toolroom**         | Departamento de herramientas y troqueles de la planta.                  |
| **SETC**             | Sistema de Entrada de Trabajo de Campo. Nombre interno del sistema BWI Toolroom. |
| **Orden de Trabajo** | Registro formal de un trabajo de mantenimiento o reparación solicitado y ejecutado. |
| **Papeleta**         | Número de control de producción asociado a una orden de trabajo.         |
| **Folio**            | Número correlativo único asignado a cada orden de trabajo.              |
| **Folio de Queja**   | Número de registro de una queja formal de un cliente externo (requerido para prioridad 2). |
| **Prioridad**        | Nivel de urgencia asignado a una orden de trabajo (1 = más urgente, 5 = menos urgente). |
| **Técnico**          | Personal especializado del departamento de Tooling que ejecuta los trabajos. |
| **Solicitante**      | Personal de producción o áreas que solicita un trabajo de mantenimiento. |
| **Administrador**    | Persona encargada de gestionar órdenes, asignar técnicos y supervisar el departamento. |
| **Superadmin**       | Administrador con acceso total al sistema (usuario TOOLING01).          |
| **Autorización**     | Aprobación formal requerida para órdenes de prioridad 1 (seguridad) y 2 (queja de cliente). |
| **PIN**              | Número de identificación personal (Personal Identification Number) para autenticación. |
| **Supabase**         | Plataforma de backend-as-a-service que provee PostgreSQL, Auth, Storage y Edge Functions. |
| **SECURITY DEFINER**| Propiedad de funciones PostgreSQL que hace que se ejecuten con los privilegios del usuario que las creó (owner). |
| **bcrypt**           | Algoritmo de hashing de contraseñas adaptativo y resistente a ataques. |
| **Signed URL**       | URL con token criptográfico que expira después de un tiempo determinado, usada para acceso seguro a archivos. |
| **sessionStorage**   | API del navegador para almacenar datos de sesión que se borran al cerrar la pestaña/navegador. |
| **RPC**              | Remote Procedure Call. Llamada a funciones del lado del servidor invocada desde el cliente. |
| **RLS**              | Row-Level Security. Política de PostgreSQL que controla acceso a filas específicas. |
| **Vite**             | Herramienta de build y desarrollo para aplicaciones frontend modernas. |
| **Recharts**         | Librería de gráficas para React.                                        |
| **Framer Motion**    | Librería de animaciones para React.                                     |
| **SheetJS**          | Librería para lectura y escritura de archivos Excel (xlsx) en JavaScript. |
| **Glassmorphism**    | Estilo visual de diseño que simula vidrio esmerilado con transparencia y blur. |
| **Turno**            | Jornada laboral del técnico: Turno 1 (matutino, 8h) o Turno 2 (vespertino, 7.5h). |
| **Utilización**      | Porcentaje de horas trabajadas vs. horas disponibles en un período.    |
| **Correlativo**      | Número secuencial autoincremental asignado a cada orden de trabajo.    |
| **Plano**            | Documento técnico (PDF, DWG, DXF) que describe especificaciones de un componente. |
| **Máquina Parada**   | Equipo o línea de producción detenida de forma no planificada que requiere atención inmediata. |
| **Papeleta**         | Documento de control de producción que identifica un lote o trabajo en fábrica. |

---

## Apéndice A: Referencia Rápida de Funciones Backend

| Función                    | Línea aprox. | Parámetros principales                          | Retorno                      |
|----------------------------|:------------:|-------------------------------------------------|------------------------------|
| `necesitaPin`              | —            | `numEmpleado`                                   | `boolean`                    |
| `loginSinPin`              | —            | `numEmpleado`                                   | `{ id, nombre, rol, turno }` |
| `loginConPin`              | —            | `numEmpleado, pin`                              | `{ id, nombre, rol, turno }` |
| `cambiarPin`               | —            | `usuarioId, pinActual, pinNuevo`                | `boolean`                    |
| `obtenerSesion`            | —            | —                                               | `object` o `null`            |
| `cerrarSesion`             | —            | —                                               | `void`                       |
| `listarUsuarios`           | —            | —                                               | `array`                      |
| `crearUsuario`             | —            | `{ num_empleado, nombre, rol, pin, turno }`     | `object`                     |
| `toggleUsuario`            | —            | `usuarioId, activo`                             | `boolean`                    |
| `crearOrden`               | —            | `{ area, maquina, descripcion, prioridad, ... }`| `object`                     |
| `obtenerOrdenes`           | —            | `filtros?`                                      | `array`                      |
| `obtenerMisOrdenes`        | —            | `usuarioId`                                     | `array`                      |
| `obtenerOrdenesTecnico`    | —            | `tecnicoId`                                     | `array`                      |
| `obtenerPerfilTecnico`     | —            | `tecnicoId`                                     | `object`                     |
| `actualizarSeguimientoTecnico`| —          | `ordenId, datos`                                | `object`                     |
| `actualizarEstado`         | —            | `ordenId, nuevoEstado, datos?`                  | `object`                     |
| `cargarSeguimiento`        | —            | `ordenId`                                       | `array`                      |
| `guardarSeguimiento`       | —            | `ordenId, datos`                                | `object`                     |
| `obtenerUrlPlano`          | —            | `ordenId`                                       | `string` (URL)               |
| `obtenerLogoBase64`        | —            | —                                               | `string` (Base64)            |
| `registrarEvento`          | —            | `ordenId, tipo, detalle?`                       | `object`                     |
| `agregarComentarioHistorial`| —           | `ordenId, comentario, usuarioId`                | `object`                     |
| `cargarHistorial`          | —            | `ordenId`                                       | `array`                      |
| `datosGraficaMes`          | —            | —                                               | `array`                      |
| `datosGraficaTecnicos`     | —            | —                                               | `array`                      |
| `datosGraficaPrioridades`  | —            | —                                               | `array`                      |
| `obtenerMateriales`        | —            | —                                               | `array`                      |
| `obtenerAreas`             | —            | —                                               | `array`                      |
| `obtenerTecnicos`          | —            | —                                               | `array`                      |

---

## Apéndice B: Configuración de Variables de Entorno

| Variable                  | Descripción                        | Ejemplo de valor                          |
|---------------------------|------------------------------------|-------------------------------------------|
| `VITE_SUPABASE_URL`      | URL del proyecto Supabase          | `https://xxxxx.supabase.co`              |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima (anon key) de Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6...`       |

Estas variables se definen en el archivo `.env` en la raíz del proyecto (no se commitean al repositorio).

---

## Apéndice C: Convenciones de Código

| Aspecto                | Convención                                                |
|------------------------|-----------------------------------------------------------|
| Naming (variables)     | `camelCase` en JavaScript                                |
| Naming (archivos)      | `PascalCase.jsx` para componentes, `camelCase.js` para utilidades |
| Naming (tablas BD)     | `snake_case` en PostgreSQL                               |
| Naming (columnas BD)   | `snake_case` en PostgreSQL                               |
| CSS                    | Tailwind CSS utility-first classes                       |
| Formateo               | Prettier (configuración en `.prettierrc`)                |
| Linting                | ESLint (configuración en `.eslintrc.js`)                 |
| Idioma del código      | Comentarios y variables en español                        |
| Idioma de la UI        | Español (México)                                         |

---

**Fin del documento.**

*Este manual es propiedad del departamento de Tooling de BWI. Distribución restringida al personal autorizado.*
