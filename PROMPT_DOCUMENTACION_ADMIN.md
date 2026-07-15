# PROMPT PARA GENERAR DOCUMENTACIÓN ADMINISTRATIVA — BWI TOOLROOM

Copia todo el contenido de este archivo y pégalo en ChatGPT, Claude o cualquier IA para generar el documento administrativo completo en PDF o Markdown formateado.

---

Eres un documentador técnico profesional. Tu tarea es crear un **Manual de Procedimientos Administrativos** para superadmins y administradores del sistema **BWI TOOLROOM**.

Este documento es un complemento al Manual de Usuario. Mientras el Manual de Usuario cubre todas las funcionalidades para todos los roles, este documento se enfoca en **procedimientos operativos detallados** para los roles de **Superadmin** y **Administrador**, con instrucciones paso a paso, comandos SQL de mantenimiento, y políticas de uso.

El manual debe estar en **español**, con formato profesional, numerado, con tabla de contenido, y listo para convertirse en PDF.

---

## FORMATO DEL DOCUMENTO

1. **Portada:** Título "Manual de Procedimientos Administrativos — BWI TOOLROOM", subtítulo "Guía para Superadministradores y Administradores", versión 1.0, fecha, BW Group logo textual
2. **Tabla de contenido** numerada
3. **Introducción:** audiencia del documento, prerequisitos, acceso a herramientas
4. **Cada sección** numerada con subtítulos, pasos con numeración, capturas de pantalla referenciadas (indicar "Insertar captura de: [descripción]"), notas importantes, advertencias SQL
5. **Anexos** al final con comandos de referencia
6. **Formato:** 16:9 o A4, tipografía Arial/Calibri, tamaño 11-12 para cuerpo, negritas para comandos

---

## ESTRUCTURA DEL DOCUMENTO

### CAPÍTULO 1 — INTRODUCCIÓN

**1.1 Propósito del documento**
- Este manual es para Superadmins y Administradores de BWI TOOLROOM
- Cubre procedimientos de gestión, mantenimiento de usuarios, control de acceso, y operaciones avanzadas
- No sustituye al Manual de Usuario general, lo complementa

**1.2 Audiencia**
- Superadmin: control total del sistema, gestión de usuarios, migraciones SQL
- Administrador: gestión operativa diaria, creación de órdenes, seguimiento, autorización, entrega

**1.3 Herramientas necesarias**
- Navegador web moderno (Chrome o Edge recomendado)
- Acceso a Supabase Dashboard (solo Superadmin)
- Acceso al repositorio en GitHub (solo Superadmin)
- Herramienta de línea de comandos Git (solo Superadmin)

---

### CAPÍTULO 2 — GESTIÓN DE USUARIOS (Superadmin)

**2.1 Acceder al Panel de Usuarios**
- Paso 1: Iniciar sesión con TOOLING01 (sin PIN)
- Paso 2: Hacer clic en el tab "Usuarios" en el dashboard
- Paso 3: Se muestra la lista completa de usuarios

**2.2 Crear un nuevo usuario**
- Paso 1: Hacer clic en "Nuevo Usuario"
- Paso 2: Completar campos obligatorios:
  - **Número de empleado:** 5 dígitos, único en el sistema
  - **Nombre completo:** nombre y apellido del usuario
  - **Email:** correo institucional (opcional pero recomendado)
  - **Contraseña:** obligatorio para roles administrador y superadmin
  - **PIN:** 4 dígitos, obligatorio para roles técnico y solicitante
  - **Rol:** seleccionar de la lista (ver tabla de roles más abajo)
  - **Departamento:** área de trabajo
  - **Turno:** 1° Turno (8 hrs) o 2° Turno (7.5 hrs)
- Paso 3: Hacer clic en "Guardar"
- Nota: La contraseña y PIN se guardan encriptados con bcrypt

**Tabla de roles y permisos:**

| Rol | Descripción | Login | PIN | Contraseña | Acceso principal |
|---|---|---|---|---|---|
| superadmin | Control total | TOOLING01 | No | No | Todo + gestión de usuarios + SQL |
| administrador | Gestión operativa | N° empleado | No | Sí | Órdenes, seguimiento, reportes |
| tecnico | Portal de trabajo | N° empleado | Sí (4 dígitos) | No | Sus órdenes, avance, rendimiento |
| solicitante | Crear solicitudes | N° empleado | Sí (4 dígitos) | No | Crear órdenes, ver sus órdenes |

**2.3 Editar un usuario existente**
- Paso 1: En la lista, hacer clic en el ícono de lápiz (Editar)
- Paso 2: Modificar campos necesarios
- Paso 3: Hacer clic en "Guardar cambios"
- Campos editables: nombre, email, departamento, turno, activo
- Campos NO editables directamente: número de empleado, rol
- Para cambiar el rol: crear un nuevo usuario con el rol deseado y desactivar el anterior

**2.4 Activar / Desactivar un usuario**
- Paso 1: En la lista, ubicar el toggle de estado (activo/inactivo)
- Paso 2: Hacer clic para cambiar el estado
- Consecuencias:
  - Usuario desactivado: no puede iniciar sesión
  - Usuario activo: puede iniciar sesión normalmente
- Advertencia: No desactivar usuarios que tengan órdenes activas sin antes reasignarlas

**2.5 Gestionar PINs de técnicos y solicitantes**
- Ver PIN: en la lista, cada usuario muestra si tiene PIN asignado
- Reset PIN: hacer clic en "Reset PIN" junto al usuario → se borra el PIN actual
- Asignar nuevo PIN: editar el usuario → campo "PIN" → ingresar 4 dígitos → guardar
- Nota: Los PINs se muestran en texto plano en el panel de administración

**2.6 Gestionar contraseñas de administradores**
- Ver si tiene contraseña: en la lista se indica si tiene contraseña
- Reset contraseña: editar el usuario → campo "Nueva contraseña" → ingresar nueva → guardar
- El usuario deberá usar la nueva contraseña para iniciar sesión

**2.7 Políticas de acceso recomendadas**
- Contraseñas: mínimo 8 caracteres, combinar letras y números
- PINs: 4 dígitos, no usar secuencias obvias (1234, 0000)
- No compartir credenciales entre usuarios
- Cambiar contraseñas cada 90 días (recomendado)
- Desactivar usuarios que ya no trabajen en el departamento

---

### CAPÍTULO 3 — CREACIÓN DE ÓRDENES DE TRABAJO

**3.1 Tipos de creación de órdenes**

| Método | Quién lo usa | Cuándo usarlo |
|---|---|---|
| Portal del Solicitante | Solicitante | Creación normal desde el portal |
| Captura Manual | Administrador | Digitalizar órdenes de papel existentes |
| Panel de Órdenes | Administrador | Crear órdenes para otros solicitantes |

**3.2 Crear orden desde el Panel de Órdenes (Admin)**
- Paso 1: En el dashboard, localizar el formulario de creación
- Paso 2: Completar campos obligatorios:
  - **Nombre de la pieza** (obligatorio)
  - **Descripción del trabajo** (obligatorio, mínimo 10 caracteres)
  - **Prioridad** (obligatorio, 1-5)
  - **Solicitante** (obligatorio, nombre de quien pide)
  - **No. de empleado del solicitante** (obligatorio, 5 dígitos)
  - **Área / Departamento** (obligatorio)
- Paso 3: Completar campos opcionales:
  - **S.E.T.C.:** 8 dígitos numéricos (si no aplica, dejar vacío)
  - **No. de plano:** número de plano de la pieza
  - **No. de máquina:** número de identificación de la máquina
  - **Línea / Celda:** línea de producción o celda de manufactura
  - **Cantidad:** número de piezas a trabajar
- Paso 4: Adjuntar plano (opcional)
  - Formatos aceptados: PDF, JPG, PNG
  - Tamaño máximo recomendado: 10 MB
- Paso 5: Hacer clic en "Crear orden"
- Resultado: Se crea la orden en estado "nueva_orden" con folio automático

**3.3 Crear orden con Captura Manual (Admin)**
- Paso 1: Hacer clic en el tab "Captura manual"
- Paso 2: Ingresar número de folio personalizado
  - Si se deja vacío, el sistema genera uno automático
  - Si se ingresa uno, debe ser único
- Paso 3: Completar todos los campos igual que una orden normal
- Paso 4: La orden se marca como "es_orden_manual = true"
- Paso 5: Guardar
- Nota: La captura manual es para digitalizar órdenes de papel que ya existen

**3.4 Clasificación de prioridades**

| Nivel | Nombre | Color | Cuándo usar | Tiempo de respuesta esperado |
|---|---|---|---|---|
| 1 | Seguridad | 🔴 Rojo | Riesgo de seguridad laboral | Inmediato |
| 2 | Queja de cliente | 🟠 Naranja | Reclamo externo | < 24 horas |
| 3 | Máquina parada | 🟡 Amarillo | Producción detenida | < 8 horas |
| 4 | Trabajo rápido | 🔵 Azul | Tarea sencilla | < 48 horas |
| 5 | Fabricación | ⚪ Blanco | Trabajo programado | Según agenda |

**3.5 Validación de S.E.T.C.**
- El sistema valida automáticamente el número S.E.T.C.
- Si no tiene exactamente 8 dígitos numéricos → se marca como "SIN NUMERO S.E.T.C."
- Aparece con badge rojo en la tabla y como KPI dedicado
- Filtro "Sin SETC" permite ver todas las órdenes sin número válido
- Si no aplica S.E.T.C., dejar el campo vacío (no poner NA, N/A, ni otros textos)

---

### CAPÍTULO 4 — SEGUIMIENTO Y ACTUALIZACIÓN DE ÓRDENES

**4.1 Acceder al seguimiento de una orden**
- Paso 1: En la tabla de órdenes, hacer clic en "Ver detalle"
- Paso 2: En el modal, hacer clic en la pestaña "Seguimiento"

**4.2 Asignar técnicos**
- Sección "Técnicos asignados"
- Hacer clic en "Agregar técnico" → seleccionar del dropdown
- Puede agregar múltiples técnicos (multi-técnico)
- Hacer clic en "✕" junto a un técnico para quitarlo
- Obligatorio: al menos 1 técnico antes de guardar

**4.3 Seleccionar material**
- Dropdown "Material utilizado" con catálogo predefinido
- Opción "Otro" para escribir material personalizado
- Obligatorio antes de guardar
- Se registra en historial solo si el material cambió

**4.4 Registrar fecha de inicio**
- Campo "Fecha inicio" con selector de fecha
- **Efecto automático:** Al guardar con fecha de inicio, el estado cambia de "nueva_orden" a "en_proceso"
- Eventos registrados automáticamente:
  - "Asignación" (si se asignaron técnicos)
  - "Inicio" (con la fecha de inicio)
  - "Cambio de estado" (nueva_orden → en_proceso)

**4.5 Registrar fecha de término y horas**
- Campo "Fecha término" con selector de fecha
- Campo "Horas reales trabajadas" (solo obligatorio si hay fecha de término)
- **Efecto automático:** Al guardar con fecha de término + horas, el estado cambia de "en_proceso" a "terminada"
- Eventos registrados automáticamente:
  - "Terminado" (con fecha de término y horas)
  - "Cambio de estado" (en_proceso → terminada)

**4.6 Agregar comentarios**
- Campo de texto libre en la pestaña Seguimiento
- Solo se registra en historial si el texto del comentario cambió
- No se registran comentarios vacíos ni duplicados
- Los comentarios son visibles en la pestaña "Historial"

**4.7 Guardar cambios en seguimiento**
- Hacer clic en "Guardar seguimiento"
- Validaciones automáticas:
  - Al menos 1 técnico asignado
  - Material seleccionado
  - Si hay fecha de término, horas reales son obligatorias
- Si todo es correcto, se guarda y se actualiza la información
- **El modal NO se cierra** — se puede seguir trabajando

**4.8 Flujo automático de estados**
```
nueva_orden → en_proceso → terminada
     ↑             ↑            ↑
  (creación)    (automático)  (automático)
```

| Transición | Requisitos | Quién puede hacerlo |
|---|---|---|
| nueva_orden → en_proceso | Fecha inicio + técnico + material | Admin (Seguimiento) o Técnico (Mi avance) |
| en_proceso → terminada | Fecha término + horas reales | Admin (Seguimiento) o Técnico (Mi avance) |
| terminada → entregada | Confirmar entrega con ✓ | Solo Admin (Estado) |

---

### CAPÍTULO 5 — CONFIRMACIÓN DE ENTREGA

**5.1 Cuándo entregar una orden**
- Solo se puede entregar una orden en estado "terminada"
- La entrega confirma que la pieza fue devuelta al solicitante

**5.2 Proceso de entrega**
- Paso 1: Abrir la orden → pestaña "Estado"
- Paso 2: Verificar que la orden esté en estado "terminada"
- Paso 3: Hacer clic en "✅ Confirmar entrega"
- Paso 4: El sistema registra el evento "Entrega" en el historial
- Paso 5: La orden permanece en estado "terminada" + entregada=true

**5.3 Si la entrega no está lista**
- Hacer clic en "✕ Pendiente"
- La orden se mantiene en estado "terminada" sin entregar
- Se puede volver a intentar la entrega después

**5.4 Notas de entrega**
- Campo de comentarios para notas de entrega
- Opcional: documentar a quién se entregó, condiciones, etc.
- Se registra en el historial

---

### CAPÍTULO 6 — AUTORIZACIÓN DE URGENCIAS (Prioridades 1-2)

**6.1 Cuándo se requiere autorización**
- Solo para órdenes con prioridad 1 (Seguridad) o 2 (Queja de cliente)
- La autorización es un proceso manual obligatorio

**6.2 Proceso de autorización**
- Paso 1: Abrir la orden → pestaña "Seguimiento"
- Paso 2: Sección "Autorización de urgencia"
- Paso 3: Ingresar **Comentario de autorización** (obligatorio)
- Paso 4: Ingresar **Nombre de quien autoriza** (obligatorio)
  - Esta es la persona que dio la autorización (NO es el usuario logueado)
  - Ejemplo: "Gerente de Planta", "Supervisor de Producción"
- Paso 5: Ingresar **Puesto de quien autoriza** (obligatorio)
  - Ejemplo: "Gerente", "Supervisor", "Jefe de Departamento"
- Paso 6: Hacer clic en "✅ Autorizar"

**6.3 Si se rechaza la autorización**
- Hacer clic en "❌ Rechazar"
- Aparece campo "Motivo de rechazo" (obligatorio)
- La orden se mantiene en su estado actual
- Se registra el evento "Autorización" con resultado "rechazada"

**6.4 Visualización de autorización**
- En la pestaña "Detalle": se muestra nombre y puesto del autorizador
- En la pestaña "Estado": se muestra la información de autorización
- En la impresión: se incluye en el formato BWI oficial
- En el historial: se muestra el evento de autorización con todos los datos

---

### CAPÍTULO 7 — HISTORIAL Y TRAZABILIDAD

**7.1 Tipos de eventos registrados**

| Evento | Icono | Cuándo se registra | Datos adicionales |
|---|---|---|---|
| Recepción | 📥 | Al crear la orden | — |
| Asignación | 👤 | Al asignar técnico con fecha inicio | Nombre del técnico |
| Inicio | ▶️ | Al poner fecha de inicio | Fecha de inicio |
| Comentario | 💬 | Al agregar/modificar comentario | Texto del comentario |
| Autorización | ✅ | Al autorizar/rechazar urgencia | Nombre, puesto, resultado |
| Cambio de estado | 🔄 | En cada transición automática | Estado anterior y nuevo |
| Material | 🔧 | Al cambiar material utilizado | Nombre del material |
| Terminado | 🏁 | Al poner fecha de término | Fecha término, horas |
| Entrega | 📦 | Al confirmar entrega | — |

**7.2 Ver historial de una orden**
- Abrir la orden → pestaña "Historial"
- Cada evento muestra:
  - Icono según tipo
  - Color distintivo
  - Nombre de quien lo registró
  - Fecha y hora (en zona horaria local, UTC-6)
  - Descripción del evento
  - Datos adicionales si aplican

**7.3 Importancia del historial**
- Trazabilidad completa del ciclo de vida de la orden
- Cumplimiento de auditorías internas
- Resolución de disputas sobre tiempos de respuesta
- Métricas de productividad basadas en eventos reales

---

### CAPÍTULO 8 — IMPRESIÓN DE ÓRDENES

**8.1 Imprimir desde el detalle de orden**
- En el modal de detalle, hacer clic en "🖨 Imprimir" (esquina superior derecha)
- Se abre una **nueva pestaña** con la vista previa

**8.2 Formato de impresión BWI**
- Formulario oficial: F-1100.C.03-02 Rev. 06
- Tamaño: Carta (8.5" x 11")
- Margen: 10mm
- Contenido:
  - Encabezado: Logo BWI + "ORDEN DE TRABAJO PARA TALLER"
  - Datos del solicitante (nombre, empleado, área, departamento)
  - Datos de la pieza (nombre, SETC, plano, máquina, línea, cantidad)
  - Autorización (nombre y puesto del autorizador, si aplica)
  - Descripción del trabajo
  - Datos del taller (fechas, horas, técnico, material, estado)
  - Comentarios
  - Firmas: Gerente Tool Room + Conformidad del Solicitante
  - Leyendas de prioridades

**8.3 Imprimir**
- En la nueva pestaña, hacer clic en el botón azul "🖨 Imprimir" (fijo arriba a la derecha)
- Se abre el diálogo de impresión del navegador
- Seleccionar impresora, formato (carta/OFICIO), orientación
- Hacer clic en "Imprimir"

**8.4 Cerrar la vista previa**
- Cerrar la pestaña de impresión
- Volver a la pestaña del sistema — el modal sigue abierto

---

### CAPÍTULO 9 — EXPORTACIÓN DE REPORTES

**9.1 Acceder a la exportación**
- Botón "Exportar" en la esquina superior derecha del dashboard
- Se abre un modal con opciones

**9.2 Tipo de reporte: Órdenes de trabajo**
- Incluye 23 columnas de detalle por orden
- Columnas: Folio, Fecha, Solicitante, Empleado, Área, Departamento, Pieza, SETC, Plano, Máquina, Línea, Cantidad, Descripción, Prioridad, Estado, Técnico, Material, Fecha Inicio, Fecha Término, Horas Reales, Comentarios, Orden Manual, Autorizada, Entregada
- Hoja adicional "Resumen" con totales por estado y prioridad

**9.3 Tipo de reporte: Desempeño de técnicos**
- Hoja 1 "Resumen Técnicos":
  - No. Empleado, Nombre, Departamento, Turno
  - Hrs Productivas/Día, Hrs Disponibles Semana, Hrs Disponibles Mes
  - Total Órdenes, Órdenes Terminadas
  - Horas Trabajadas, Promedio Hrs/Orden
  - Aprovechamiento Mensual %
- Hoja 2 "Detalle por Técnico":
  - Técnico, No. Orden, Pieza, Prioridad, Estado
  - Fecha Solicitud, Fecha Inicio, Fecha Término, Horas Reales

**9.4 Filtro de fechas**
- Checkbox "Filtrar por fechas"
- Campo "Desde" y "Hasta"
- Filtra por fecha de solicitud de la orden
- Si no se filtra, se exportan todos los registros

**9.5 Descargar**
- Hacer clic en "Descargar Excel"
- Se genera un archivo .xlsx inmediatamente
- Nombre del archivo: BWI_TOOLROOM_Ordenes_[fecha].xlsx o BWI_TOOLROOM_Tecnicos_[fecha].xlsx

---

### CAPÍTULO 10 — GRÁFICAS Y MÉTRICAS

**10.1 Acceder al tab "Gráficas"**
- Hacer clic en el tab "Gráficas" en el dashboard principal

**10.2 Gráfica de actividad mensual**
- Muestra órdenes creadas por mes (últimos 6 meses)
- Tipo: barras
- Permite ver tendencia de carga de trabajo

**10.3 Gráfica de distribución por prioridad**
- Muestra distribución de órdenes por nivel de prioridad
- Tipo: pie (circular)
- Permite ver qué prioridades predominan

**10.4 Gráfica de carga por técnico**
- Muestra horas trabajadas por técnico
- Tipo: barras horizontales
- Permite identificar carga de trabajo desbalanceada

**10.5 Panel de técnicos (tab "Técnicos")**
- Muestra TODOS los técnicos del sistema
- Para cada técnico:
  - Nombre, número de empleado, turno
  - Horas trabajadas (semana y mes)
  - Porcentaje de aprovechamiento
  - Código de color: ≥80% 🟢 Óptimo, 50-79% 🟡 Aceptable, <50% 🔴 Bajo

---

### CAPÍTULO 11 — MANTENIMIENTO DE BASE DE DATOS (Superadmin)

**11.1 Acceso a Supabase Dashboard**
- URL: https://supabase.com/dashboard
- Seleccionar el proyecto de BWI TOOLROOM
- Ir a "SQL Editor" para ejecutar comandos

**11.2 Consultas de diagnóstico comunes**

```sql
-- Ver todos los usuarios activos
SELECT num_empleado, nombre_completo, rol, departamento, turno, activo
FROM usuarios
WHERE activo = true
ORDER BY rol, nombre_completo;

-- Contar órdenes por estado
SELECT estado, COUNT(*) as total
FROM ordenes_trabajo
GROUP BY estado
ORDER BY total DESC;

-- Ver órdenes sin técnico asignado
SELECT o.folio, o.pieza_nombre, o.estado, o.fecha_solicitud
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.id = s.orden_id
WHERE s.id IS NULL
ORDER BY o.fecha_solicitud;

-- Ver técnicos con más carga de trabajo
SELECT u.nombre_completo, u.num_empleado,
       COUNT(s.orden_id) as ordenes_asignadas,
       SUM(s.tiempo_real_hrs) as horas_totales
FROM usuarios u
JOIN seguimiento_orden s ON u.id = s.tecnico_id
WHERE u.rol = 'tecnico' AND u.activo = true
GROUP BY u.id, u.nombre_completo, u.num_empleado
ORDER BY ordenes_asignadas DESC;

-- Ver órdenes con S.E.T.C. inválido
SELECT folio, pieza_nombre, setc_numero, estado
FROM ordenes_trabajo
WHERE setc_numero IS NULL
   OR setc_numero = ''
   OR setc_numero = 'NA'
   OR setc_numero = 'N/A'
   OR LENGTH(setc_numero) != 8
   OR setc_numero !~ '^[0-9]+$';

-- Verificar historial de una orden específica
SELECT h.tipo_evento, h.descripcion, h.creado_por,
       h.metadata, h.created_at
FROM historial_orden h
JOIN ordenes_trabajo o ON h.orden_id = o.id
WHERE o.folio = 'FOLIO_AQUI'
ORDER BY h.created_at;
```

**11.3 Respaldos recomendados**
- Antes de cualquier migración SQL, crear un branch de respaldo en Git
- Commando: `git checkout -b backup-[descripción]`
- Guardar el SHA del commit actual antes de migrar
- Si algo falla: `git checkout [branch-anterior]`

**11.4 Migraciones SQL comunes**

```sql
-- Agregar columna a ordenes_trabajo
ALTER TABLE ordenes_trabajo ADD COLUMN nueva_columna TIPO_DATO;

-- Actualizar vista (requiere DROP previo)
DROP VIEW IF EXISTS vista_ordenes;
CREATE VIEW vista_ordenes AS
SELECT ...;

-- Crear índice para mejorar rendimiento
CREATE INDEX idx_ordenes_estado ON ordenes_trabajo(estado);

-- Verificar integridad de datos
SELECT COUNT(*) FROM ordenes_trabajo WHERE tecnico_id IS NULL;
SELECT COUNT(*) FROM seguimiento_orden WHERE orden_id NOT IN (SELECT id FROM ordenes_trabajo);
```

---

### CAPÍTULO 12 — SOLUCIÓN DE PROBLEMAS COMUNES

**12.1 El usuario no puede iniciar sesión**
- Verificar que el número de empleado sea correcto (5 dígitos)
- Verificar que la cuenta esté activa (toggle activo/inactivo)
- Para administradores: verificar que tenga contraseña asignada
- Para técnicos/solicitantes: verificar que tenga PIN asignado
- Si nada funciona: contactar al superadmin

**12.2 La orden no cambia de estado automáticamente**
- Verificar que se haya dado clic en "Guardar" después de poner las fechas
- Verificar que la fecha de inicio esté completa (año-mes-día)
- Verificar que se haya asignado al menos un técnico
- Verificar que se haya seleccionado material
- Verificar conexión a internet

**12.3 El S.E.T.C. aparece como inválido**
- Verificar que tenga exactamente 8 dígitos numéricos
- No usar espacios, guiones, ni caracteres especiales
- Si no aplica, dejar el campo vacío

**12.4 No puedo exportar el reporte de técnicos**
- Verificar que haya técnicos registrados en el sistema
- Verificar que haya órdenes con seguimiento en el rango de fechas
- Intentar sin filtro de fechas para verificar si hay datos

**12.5 El plano no se muestra**
- Verificar que el archivo se haya subido correctamente
- Formatos soportados: PDF, JPG, PNG
- Intentar recargar la página (Ctrl+Shift+R)
- Verificar el tamaño del archivo (máximo 10 MB recomendado)

**12.6 No puedo cerrar el modal de detalle**
- Presionar la tecla Escape
- Hacer clic en "✕ Cerrar" en la parte superior derecha
- Hacer clic fuera del modal (en el fondo oscuro)
- Si nada funciona, recargar la página

**12.7 El historial no muestra eventos**
- Verificar que la orden tenga al menos un evento de recepción
- Verificar que se haya guardado al menos un cambio en el seguimiento
- Recargar la página (Ctrl+Shift+R)

**12.8 La gráfica no muestra datos**
- Verificar que haya órdenes en el sistema
- Verificar que haya técnicos con horas registradas
- Los datos se actualizan al recargar la página

---

### CAPÍTULO 13 — POLÍTICAS Y BUENAS PRÁCTICAS

**13.1 Flujo de vida de una orden**
1. Recepción → Se crea la orden (automático o manual)
2. Asignación → Se asignan técnicos y material
3. Inicio → Se registra fecha de inicio (automático a "en_proceso")
4. Trabajo → Se actualiza avance, comentarios, material
5. Terminación → Se registra fecha de término y horas (automático a "terminada")
6. Entrega → Se confirma entrega (manual a "entregada")

**13.2 Responsabilidades por rol**

| Responsabilidad | Solicitante | Técnico | Admin | Superadmin |
|---|---|---|---|---|
| Crear órdenes | ✅ propias | ❌ | ✅ por otros | ✅ |
| Asignar técnicos | ❌ | ❌ | ✅ | ✅ |
| Registrar avance | ❌ | ✅ su portal | ✅ tab Seguimiento | ✅ |
| Autorizar urgencias | ❌ | ❌ | ✅ | ✅ |
| Confirmar entrega | ❌ | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |
| Ejecutar SQL | ❌ | ❌ | ❌ | ✅ |
| Exportar reportes | ❌ | ❌ | ✅ | ✅ |
| Imprimir órdenes | ❌ | ✅ su portal | ✅ | ✅ |

**13.3 Tiempos de respuesta esperados**

| Prioridad | Tiempo máximo de inicio | Tiempo máximo de terminación |
|---|---|---|
| 1 - Seguridad | Inmediato | < 4 horas |
| 2 - Queja cliente | < 2 horas | < 24 horas |
| 3 - Máquina parada | < 1 hora | < 8 horas |
| 4 - Trabajo rápido | < 8 horas | < 48 horas |
| 5 - Fabricación | Según agenda | Según complejidad |

**13.4 Cálculo de horas productivas**

| Turno | Horas/día | Horas/semana | Horas/mes |
|---|---|---|---|
| 1° Turno | 8 hrs | 40 hrs | 160 hrs |
| 2° Turno | 7.5 hrs | 37.5 hrs | 150 hrs |

Fórmula: Aprovechamiento = (Horas trabajadas / Horas disponibles) × 100

**13.5 Recomendaciones de uso**
- Actualizar el seguimiento diariamente para órdenes en proceso
- Completar la fecha de término tan pronto como la orden se termine
- Confirmar entrega el mismo día que la pieza se devuelva
- Revisar el panel de técnicos semanalmente para identificar carga desbalanceada
- Exportar reportes mensualmente para métricas de productividad
- Revisar KPIs al inicio de cada jornada

---

### CAPÍTULO 14 — GLOSARIO

| Término | Definición |
|---|---|
| BWI TOOLROOM | Nombre del sistema de gestión de órdenes |
| Tooling | Departamento de Taller de Máquinas y Herramientas |
| SETC | Número de identificación de pieza (8 dígitos) |
| KPI | Key Performance Indicator — Indicador clave de desempeño |
| Seguimiento | Registro de avance de una orden por técnico |
| Historial | Audit trail completo de eventos de una orden |
| Multi-técnico | Una orden puede tener varios técnicos asignados |
| PIN | Personal Identification Number — Número de identificación personal (4 dígitos) |
| bcrypt | Algoritmo de hash para contraseñas y PINs |
| RLS | Row Level Security — Seguridad a nivel de fila en PostgreSQL |
| RPC | Remote Procedure Call — Funciones ejecutables en PostgreSQL |
| Supabase | Plataforma de backend con PostgreSQL, Storage y funciones RPC |
| Vercel | Plataforma de hosting para aplicaciones frontend |
| Recharts | Librería de gráficas para React |
| SheetJS | Librería para generar archivos Excel |
| 1° Turno | Turno de 8 horas (8h/día, 40h/sem, 160h/mes) |
| 2° Turno | Turno de 7.5 horas (7.5h/día, 37.5h/sem, 150h/mes) |
| Aprovechamiento | Porcentaje de horas trabajadas vs horas disponibles |
| Entregada | Estado de confirmación de entrega de la orden |
| Autorización | Proceso de aprobación para prioridades 1-2 |
| Folio | Número único de identificación de la orden |
| Captura Manual | Digitalización de órdenes de papel existentes |

---

### CAPÍTULO 15 — ANEXOS

**Anotexo A: Comandos SQL de referencia rápida**

```sql
-- Listar todos los usuarios con su rol
SELECT num_empleado, nombre_completo, rol, activo FROM usuarios ORDER BY rol;

-- Contar órdenes por técnico
SELECT u.nombre_completo, COUNT(*) as total
FROM seguimiento_orden s
JOIN usuarios u ON s.tecnico_id = u.id
GROUP BY u.id, u.nombre_completo;

-- Órdenes pendientes (sin asignar)
SELECT o.folio, o.pieza_nombre, o.fecha_solicitud
FROM ordenes_trabajo o
LEFT JOIN seguimiento_orden s ON o.id = s.orden_id
WHERE s.id IS NULL;

-- Productividad por técnico (horas trabajadas vs disponibles)
SELECT u.nombre_completo, u.turno,
       COALESCE(SUM(s.tiempo_real_hrs), 0) as horas_trabajadas
FROM usuarios u
LEFT JOIN seguimiento_orden s ON u.id = s.tecnico_id
WHERE u.rol = 'tecnico' AND u.activo = true
GROUP BY u.id, u.nombre_completo, u.turno;
```

**Anexo B: Atajos de teclado**

| Atajo | Acción |
|---|---|
| Ctrl+Shift+R | Recargar página (limpiar caché) |
| Escape | Cerrar modal abierto |
| Enter | Enviar formulario de login |

**Anexo C: Colores del sistema**

| Color | Hex | Uso |
|---|---|---|
| Accent Blue | #3B82F6 | Botones principales, links, acentos |
| Success Green | #22C55E | Estados exitosos, KPIs positivos |
| Danger Red | #EF4444 | Errores, alertas, prioridad 1 |
| Warn Amber | #F59E0B | Advertencias, prioridad 3 |
| Purple | #8B5CF6 | Estado entregada |
| Background | #0F1117 | Fondo principal (dark theme) |
| Surface | #181C25 | Superficies de tarjetas |
| Border | #242935 | Bordes y separadores |
| Text | #F1F5F9 | Texto principal |
| Muted | #6B7280 | Texto secundario |

**Anexo D: Formato de impresión BWI**

| Campo | Valor |
|---|---|
| Formulario | F-1100.C.03-02 Rev. 06 |
| Tamaño | Carta (8.5" x 11") |
| Margen | 10mm |
| Encabezado | Logo BWI + "ORDEN DE TRABAJO PARA TALLER" |
| Firmas | Gerente Tool Room + Conformidad del Solicitante |

**Anexo E: Versiones del sistema**

| Componente | Versión |
|---|---|
| Schema | v5.0 |
| Cliente Supabase | v5.0 |
| Frontend | React 18 + Vite 5 |
| Hosting | Vercel |
| Repositorio | github.com/danysan97/bwi-tooling |

---

Genera el documento completo en formato Markdown estructurado, listo para copiarse a un editor de texto o convertirse a PDF. Incluye todas las secciones, tablas, comandos SQL, diagramas de flujo, y notas. Cada capítulo numerado. Incluye indicadores de dónde insertar capturas de pantalla ["📸 Insertar captura: [descripción de lo que se ve]"].
