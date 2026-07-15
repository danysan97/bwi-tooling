# PROMPT PARA GENERAR MANUAL DE USUARIO — BWI TOOLROOM

Copia todo el contenido de este archivo y pégalo en ChatGPT, Claude o cualquier IA para generar el manual completo en PDF o Markdown formateado.

---

Eres un documentador técnico profesional. Tu tarea es crear un **Manual de Usuario Completo** para el sistema **BWI TOOLROOM**, un sistema web de gestión de órdenes de trabajo para un departamento de Tooling (Taller de Máquinas y Herramientas) de una planta manufacturing.

El manual debe estar en **español**, con formato profesional, numerado, con tabla de contenido, y listo para convertirse en PDF. Debe cubrir **todos los niveles de usuario** y **todas las funcionalidades** del sistema.

---

## FORMATO DEL DOCUMENTO

1. **Portada:** Título "Manual de Usuario — BWI TOOLROOM", subtítulo "Departamento de Toolroom — Taller Máquinas y Herramientas", versión 1.0, fecha,BW Group logo textual
2. **Tabla de contenido** numerada
3. **Introducción:** qué es el sistema, para quién es, cómo está estructurado el manual
4. **Cada sección** numerada con subtítulos, pasos con numeración, capturas de pantalla referenciadas (indicar "Insertar captura de: [descripción]"), y notas importantes
5. **Glosario** al final
6. **Formato:** 16:9 o A4, tipografía Arial/Calibri, tamaño 11-12 para cuerpo, negritas para comandos

---

## ESTRUCTURA DEL MANUAL

### CAPÍTULO 1 — INTRODUCCIÓN

**1.1 ¿Qué es BWI TOOLROOM?**
- Sistema web de gestión de órdenes de trabajo
- Departamento de Toolroom (Taller de Máquinas y Herramientas) de BWI Group
- Propósito: automatizar el ciclo de vida de órdenes de trabajo, dar trazabilidad, generar métricas de productividad

**1.2 Requisitos del sistema**
- Navegador web moderno (Chrome, Edge, Firefox, Safari)
- Conexión a internet
- Resolución mínima: 1280x720

**1.3 Acceso al sistema**
- URL de producción (Vercel)
- Instrucciones para acceder desde navegador

---

### CAPÍTULO 2 — AUTENTICACIÓN Y ROLES

**2.1 Tipos de usuario**

| Rol | Descripción | Login | Acceso |
|---|---|---|---|
| Superadmin | Control total del sistema | Usuario (TOOLING01) sin PIN | Todo + gestión de usuarios |
| Administrador | Gestión operativa diaria | Usuario + contraseña | Órdenes, seguimiento, reportes |
| Técnico | Portal dedicado de trabajo | Empleado + PIN de 4 dígitos | Sus órdenes, avance, rendimiento |
| Solicitante | Crear y dar seguimiento | Empleado + PIN | Sus órdenes, crear solicitudes |

**2.2 Cómo iniciar sesión**
- Paso 1: Abrir navegador e ingresar la URL
- Paso 2: Ingresar número de empleado (5 dígitos)
- Paso 3: Si el sistema pide contraseña → ingresar contraseña
- Paso 4: Si el sistema pide PIN → ingresar PIN de 4 dígitos
- Paso 5: Presionar "Entrar" o Enter
- Nota: El sistema redirige automáticamente según el rol

**2.3 Cerrar sesión**
- Ubicar el botón "Salir" en la esquina superior derecha
- Hacer clic
- Confirmar que se回到了 la pantalla de login

**2.4 Errores comunes de login**
- "Credenciales incorrectas": verificar número de empleado y contraseña/PIN
- "Usuario no encontrado": verificar que el número sea correcto (5 dígitos)
- "Cuenta desactivada": contactar al administrador

---

### CAPÍTULO 3 — SUPERADMIN: GESTIÓN DE USUARIOS

**3.1 Acceder al Panel de Usuarios**
- Desde el dashboard principal, hacer clic en el tab "Usuarios"
- Se muestra la lista completa de usuarios del sistema

**3.2 Crear un nuevo usuario**
- Paso 1: Hacer clic en "Nuevo Usuario" o "Agregar"
- Paso 2: Completar campos:
  - **Número de empleado** (obligatorio, 5 dígitos, único)
  - **Nombre completo** (obligatorio)
  - **Email** (opcional)
  - **Contraseña** (obligatorio para admin/superadmin)
  - **PIN** (obligatorio para técnico/solicitante, 4 dígitos)
  - **Rol** (obligatorio: superadmin, administrador, técnico, solicitante)
  - **Departamento** (obligatorio)
  - **Turno** (obligatorio: 1° Turno o 2° Turno)
- Paso 3: Hacer clic en "Guardar"
- Nota: La contraseña y PIN se guardan encriptados (bcrypt)

**3.3 Editar un usuario**
- En la lista de usuarios, hacer clic en "Editar" (ícono de lápiz)
- Modificar los campos necesarios
- Hacer clic en "Guardar cambios"
- Campos editables: nombre, email, departamento, turno, activo
- Campos NO editables: número de empleado, rol (requiere crear nuevo)

**3.4 Activar / Desactivar un usuario**
- En la lista, ubicar el toggle de estado (activo/inactivo)
- Hacer clic para cambiar el estado
- Un usuario desactivado no puede iniciar sesión
- IMPORTANTE: No desactivar usuarios que tengan órdenes activas

**3.5 Ver PINs y contraseñas**
- En la lista de usuarios, se muestra si cada usuario tiene PIN o contraseña asignado
- Para ver el PIN: hacer clic en "Ver PIN" (solo visible para superadmin)
- Los PINs se muestran en texto plano en el panel (recordatorio: son de 4 dígitos)

**3.6 Reset de PIN**
- En la lista, hacer clic en "Reset PIN" junto al usuario
- Se borra el PIN actual
- El usuario deberá usar su contraseña para iniciar sesión
- O asignar un nuevo PIN desde el panel

**3.7 Cambiar contraseña de un usuario**
- Solo accesible para superadmin desde el panel
- Hacer clic en "Editar" → campo "Nueva contraseña"
- Ingresar la nueva contraseña
- Guardar cambios

**3.8 Roles y permisos detallados**

| Acción | Solicitante | Técnico | Admin | Superadmin |
|---|---|---|---|---|
| Crear órdenes | ✅ propias | ❌ | ✅ por otros | ✅ |
| Ver órdenes | ✅ propias | ✅ asignadas | ✅ todas | ✅ todas |
| Ver historial | ✅ sus órdenes | ✅ sus órdenes | ✅ todas | ✅ todas |
| Actualizar avance | ❌ | ✅ su portal | ✅ tab Seguimiento | ✅ |
| Autorizar urgencias | ❌ | ❌ | ✅ | ✅ |
| Confirmar entrega | ❌ | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |
| Exportar Excel | ❌ | ❌ | ✅ | ✅ |
| Imprimir órdenes | ❌ | ✅ su portal | ✅ | ✅ |
| Captura manual | ❌ | ❌ | ✅ | ✅ |
| Ver gráficas | ❌ | ✅ personal | ✅ todas | ✅ |

---

### CAPÍTULO 4 — ADMINISTRADOR: DASHBOARD PRINCIPAL

**4.1 Vista general del dashboard**
- Header: BWI — TOOLROOM / nombre del usuario / botón Salir
- 4 tabs principales: Órdenes, Gráficas, Técnicos, Usuarios (+ Exportar)

**4.2 KPIs del dashboard**
- Tarjetas con indicadores clave:
  - Total órdenes (conteo general)
  - Pendientes/Nuevas (estado nueva_orden)
  - En proceso (estado en_proceso)
  - Terminadas (estado terminada)
  - Entregadas (entregada=true)
  - Sin S.E.T.C. (setc_numero inválido)
  - Prioridad 1 activa (urgencias abiertas)
- Hacer clic en un KPI puede filtrar la tabla automáticamente

**4.3 Tabla de órdenes**
- Columnas: Folio, Fecha, Pieza, Solicitante, SETC, Prioridad, Estado, Avance, Acción
- Prioridad se muestra con badge de color:
  - 🔴 1 — Seguridad
  - 🟠 2 — Queja de cliente
  - 🟡 3 — Máquina parada
  - 🔵 4 — Trabajo rápido
  - ⚪ 5 — Fabricación
- Estado se muestra con badge de color:
  - 🔵 Nueva orden
  - 🟡 En proceso
  - 🟢 Terminada
  - 🔴 Cancelada
  - 🟣 Entregada
- Columna "Avance": barra visual que muestra progreso del seguimiento

**4.4 Filtros de la tabla**
- Botones de filtro: Todas, Nuevas, En proceso, Terminadas, Entregadas, Sin SETC
- Cada botón muestra conteo de órdenes en ese estado
- Hacer clic en un filtro muestra solo esas órdenes

**4.5 Búsqueda**
- Campo de búsqueda en la parte superior
- Busca por: número de folio, nombre de pieza, nombre del solicitante
- Búsqueda en tiempo real (se filtra mientras se escribe)

**4.6 Ordenar columnas**
- Hacer clic en el encabezado de una columna ordena alfabéticamente
- Hacer clic de nuevo invierte el orden

---

### CAPÍTULO 5 — ADMINISTRADOR: DETALLE DE UNA ORDEN

**5.1 Abrir una orden**
- En la tabla, hacer clic en "Ver detalle" en la columna Acción
- Se abre un modal (ventana emergente) con toda la información de la orden

**5.2 Pestaña "Información" (Detalle)**
- Muestra todos los datos de la orden en grid de 2 columnas:
  - Folio, Fecha de solicitud, Pieza, Solicitante
  - SETC, No. plano, No. máquina, Línea/celda
  - Cantidad, Prioridad, Estado, Técnicos
- Sección de Descripción del trabajo a realizar
- **Vista previa del plano:** Si se adjuntó un archivo, se muestra directamente:
  - PDFs se muestran en un visor embebido (iframe)
  - Imágenes se muestran con tamaño completo
  - Se puede hacer zoom y desplazar

**5.3 Pestaña "Seguimiento" (Edición de avance)**
- Esta es la pestaña más importante para la operación diaria

**5.3.1 Asignar técnicos**
- Sección "Técnicos asignados"
- Hacer clic en "Agregar técnico" para añadir un técnico
- Seleccionar del dropdown de técnicos disponibles
- Puede agregar múltiples técnicos
- Hacer clic en "✕" junto a un técnico para quitarlo

**5.3.2 Seleccionar material**
- Dropdown "Material utilizado" con catálogo de materiales
- Opción "Otro" para escribir material personalizado
- Obligatorio antes de guardar

**5.3.3 Fecha de inicio**
- Campo "Fecha inicio" con selector de fecha
- **IMPORTANTE:** Al guardar con fecha de inicio, el estado cambia automáticamente de "Nueva orden" a "En proceso"
- Se registran automáticamente los eventos "Asignación", "Inicio" y "Cambio de estado" en el historial

**5.3.4 Fecha de término y horas**
- Campo "Fecha término" con selector de fecha
- Campo "Horas reales trabajadas" (solo obligatorio si hay fecha de término)
- **IMPORTANTE:** Al guardar con fecha de término y horas, el estado cambia automáticamente de "En proceso" a "Terminada"
- Se registran automáticamente los eventos "Terminado" y "Cambio de estado"

**5.3.5 Comentarios**
- Campo de texto libre para observaciones del taller
- Solo se registra en historial si el texto cambió

**5.3.6 Autorización de urgencia (solo prioridades 1-2)**
- Si la orden es prioridad 1 (Seguridad) o 2 (Queja de cliente), aparece una sección adicional
- **Campo "Comentario de autorización":** obligatorio antes de autorizar
- **Campos "Nombre autoriza" y "Puesto autoriza":** capturar quién autorizó (NO es el usuario logueado, es la persona que dio la autorización)
- Botones: ✅ Autorizar / ❌ Rechazar
- Si rechaza: aparece campo "Motivo de rechazo"

**5.3.7 Guardar cambios**
- Hacer clic en "Guardar seguimiento"
- El sistema valida:
  - Al menos 1 técnico asignado
  - Material seleccionado
  - Si hay fecha de término, horas son obligatorias
- Si todo es correcto, se guarda y se refresca la información
- **El modal NO se cierra** — se puede seguir trabajando

**5.4 Pestaña "Estado" (Confirmación de entrega)**
- Solo visible cuando la orden está en estado "Terminada"
- Botón "✅ Confirmar entrega" — marca la orden como entregada
  - Se registra evento "Entrega" en historial
  - La orden permanece en estado "Terminada" + entregada=true
- Botón "✕ Pendiente" — mantiene la orden sin entregar
- Campo de comentarios para notas de entrega

**5.5 Pestaña "Historial" (Timeline)**
- Muestra todos los eventos registrados de la orden
- Cada evento tiene:
  - Icono según tipo: 📥 Recepción, 👤 Asignación, ▶️ Inicio, 💬 Comentario, ✅ Autorización, 🔄 Cambio de estado, 🔧 Material, 🏁 Terminado, 📦 Entrega
  - Color distintivo por tipo
  - Nombre de quien lo registró
  - Fecha y hora (en zona horaria local)
  - Descripción del evento
  - Datos adicionales (metadatos) si aplican

---

### CAPÍTULO 6 — ADMINISTRADOR: CAPTURA MANUAL

**6.1 ¿Qué es la captura manual?**
- Para digitalizar órdenes de papel que ya existen
- Permite asignar un número de folio personalizado
- La orden se marca como "es_orden_manual = true"

**6.2 Acceder**
- Tab "Captura manual" en el dashboard principal

**6.3 Proceso de captura**
- Paso 1: Ingresar número de folio personalizado (o dejar que el sistema genere uno)
- Paso 2: Completar todos los campos igual que una orden normal
- Paso 3: Adjuntar plano si existe
- Paso 4: Asignar técnicos
- Paso 5: Guardar

---

### CAPÍTULO 7 — ADMINISTRADOR: GRÁFICAS

**7.1 Acceder al tab "Gráficas"**
- Hacer clic en el tab "Gráficas" en el dashboard principal

**7.2 Gráfica de actividad mensual**
- Muestra órdenes creadas por mes (últimos 6 meses)
- Tipo: barras
- Permite ver tendencia de carga de trabajo

**7.3 Gráfica de distribución por prioridad**
- Muestra distribución de órdenes por nivel de prioridad
- Tipo: pie (circular)
- Permite ver qué prioridades predominan

**7.4 Gráfica de carga por técnico**
- Muestra horas trabajadas por técnico
- Tipo: barras horizontales
- Permite identificar carga de trabajo desbalanceada

---

### CAPÍTULO 8 — ADMINISTRADOR: PANEL DE TÉCNICOS

**8.1 Acceder al tab "Técnicos"**
- Hacer clic en el tab "Técnicos" en el dashboard principal

**8.2 Vista consolidada**
- Muestra TODOS los técnicos del sistema
- Para cada técnico:
  - Nombre, número de empleado, turno
  - Horas trabajadas (semana y mes)
  - Porcentaje de aprovechamiento
  - Código de color: ≥80% 🟢 Óptimo, 50-79% 🟡 Aceptable, <50% 🔴 Bajo

**8.3 Métricas disponibles**
- Horas productivas según turno:
  - 1° Turno: 8 hrs/día → 40 hrs/semana → 160 hrs/mes
  - 2° Turno: 7.5 hrs/día → 37.5 hrs/semana → 150 hrs/mes
- Porcentaje de aprovechamiento = (Horas trabajadas / Horas disponibles) × 100

---

### CAPÍTULO 9 — ADMINISTRADOR: EXPORTAR REPORTES

**9.1 Acceder al botón "Exportar"**
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

### CAPÍTULO 10 — ADMINISTRADOR: IMPRESIÓN

**10.1 Imprimir desde el detalle de orden**
- En el modal de detalle, hacer clic en "🖨 Imprimir" (esquina superior derecha)
- Se abre una **nueva pestaña** con la vista previa de la orden

**10.2 Vista previa de impresión**
- Muestra la orden en formato BWI oficial (F-1100.C.03-02 Rev. 06)
- Contiene: encabezado BWI, datos del solicitante, datos de la pieza, SETC, autorización (con nombre y puesto si aplica), descripción, datos del taller (fechas, horas, técnico, material, estado), comentarios, firmas, leyendas de prioridades

**10.3 Imprimir**
- En la nueva pestaña, hacer clic en el botón azul "🖨 Imprimir" (fijo arriba a la derecha)
- Se abre el diálogo de impresión del navegador
- Seleccionar impresora, formato (carta/OFICIO), orientación
- Hacer clic en "Imprimir"

**10.4 Cerrar la vista previa**
- Cerrar la pestaña de impresión
- Volver a la pestaña del sistema — el modal sigue abierto

---

### CAPÍTULO 11 — TÉCNICO: PORTAL DEL TÉCNICO

**11.1 Iniciar sesión como técnico**
- Ir a la URL del sistema
- Ingresar número de empleado (5 dígitos)
- Ingresar PIN de 4 dígitos
- Hacer clic en "Entrar"
- Se abre el Portal del Técnico

**11.2 Estructura del portal**
- Header: BWI — TOOLROOM / Portal del Técnico / nombre + turno
- 2 pantallas: "Mis Órdenes" y "Mi Rendimiento"
- Botón "Salir" para cerrar sesión

**11.3 Mis Órdenes — KPIs**
- 5 tarjetas con indicadores:
  - Total órdenes asignadas
  - En proceso
  - Terminadas
  - Horas registradas
  - Aprovechamiento mes %

**11.4 Mis Órdenes — Filtros**
- Botones: Todas, Nuevas, En proceso, Terminadas, Entregadas
- Muestra solo las órdenes asignadas al técnico

**11.5 Mis Órdenes — Tabla**
- Columnas: Folio, Fecha, Pieza, Solicitante, Prioridad, Estado, Inicio, Término, Hrs, Ver detalle
- Hacer clic en "Ver detalle" abre el modal de la orden

**11.6 Detalle de orden (vista del técnico)**
- 3 pestañas: Información, Mi avance, Historial
- **Información:** mismos campos que la vista admin + preview de plano inline
- **Mi avance:** campos editables:
  - Fecha inicio (obligatoria)
  - Fecha término
  - Horas reales (obligatorias si hay fecha término)
  - Material utilizado
  - Comentarios
  - Botón "Guardar avance"
  - **IMPORTANTE:** Al poner fecha término y guardar, el estado cambia automáticamente a "Terminada"
- **Historial:** timeline de eventos de la orden
- Botón "🖨 Imprimir" → abre nueva pestaña con vista previa
- Botón "✕ Cerrar" → cierra el modal

**11.7 Mi Rendimiento — KPIs**
- 4 tarjetas:
  - Horas semana trabajadas (vs disponibles según turno)
  - Horas mes trabajadas (vs disponibles según turno)
  - Aprovechamiento semana %
  - Aprovechamiento mes %

**11.8 Mi Rendimiento — Gráfica de barras**
- Muestra Horas Trabajadas vs Horas Disponibles
- 2 barras: Semana y Mes
- Permite comparar visualmente el rendimiento

**11.9 Mi Rendimiento — Barras de eficiencia**
- 2 barras de progreso: Semana y Mes
- Colores:
  - ≥80% Verde (Óptimo)
  - 50-79% Amarillo (Aceptable)
  - <50% Rojo (Bajo)

**11.10 Cálculo de productividad**
- Fórmula: Aprovechamiento = (Horas trabajadas / Horas disponibles) × 100
- Horas disponibles según turno:
  - 1° Turno: 8 hrs/día × 5 días = 40 hrs/semana = 160 hrs/mes
  - 2° Turno: 7.5 hrs/día × 5 días = 37.5 hrs/semana = 150 hrs/mes

---

### CAPÍTULO 12 — SOLICITANTE: PORTAL DEL SOLICITANTE

**12.1 Iniciar sesión como solicitante**
- Ir a la URL del sistema
- Ingresar número de empleado (5 dígitos)
- Ingresar PIN de 4 dígitos
- Hacer clic en "Entrar"

**12.2 Crear una nueva orden**
- Hacer clic en "Nueva orden" o "Crear solicitud"
- Completar campos:
  - Nombre de la pieza (obligatorio)
  - S.E.T.C. (8 dígitos o dejar vacío)
  - No. de plano
  - No. de máquina
  - Línea / Celda
  - Cantidad
  - Descripción del trabajo (obligatorio)
  - Prioridad (obligatorio: 1-5)
- Adjuntar plano (opcional: PDF o imagen)
- Hacer clic en "Enviar solicitud"
- Se crea la orden en estado "nueva_orden"

**12.3 Ver mis órdenes**
- Se muestra la lista de todas las órdenes creadas por el solicitante
- Cada orden muestra: folio, pieza, prioridad, estado, fecha

**12.4 Ver detalle de una orden**
- Hacer clic en "Ver detalle"
- Se muestra la información completa de la orden
- Se puede ver el historial de eventos (timeline)

**12.5 Ver historial**
- Tab "Historial" en el detalle
- Muestra todos los eventos: recepción, asignación, inicio, etc.
- Permite saber en qué etapa está la orden

---

### CAPÍTULO 13 — VALIDACIÓN S.E.T.C.

**13.1 ¿Qué es el S.E.T.C.?**
- Número de identificación de la pieza en el sistema de tooling
- Debe tener exactamente 8 dígitos numéricos

**13.2 Validación automática**
- Si el número no tiene 8 dígitos → se marca como "SIN NUMERO S.E.T.C. — NO ESTA DADA DE ALTA"
- Aparece con badge rojo en la tabla de órdenes
- Aparece como KPI dedicado en el dashboard
- Existe filtro "Sin SETC" para ver todas las órdenes sin número válido
- Banner de alerta en el detalle de la orden

**13.3 Valores considerados inválidos**
- Vacío (NULL o "")
- "NA" o "N/A"
- Cualquier longitud diferente a 8 caracteres
- Caracteres no numéricos

---

### CAPÍTULO 14 — FLUJO DE ESTADOS

**14.1 Diagrama de estados**
```
nueva_orden → en_proceso → terminada → entregada
     ↑              ↑            ↑
  (creación)    (automático)  (automático)  (manual)
```

**14.2 Transiciones automáticas**

| Transición | Trigger | Quién puede hacerlo |
|---|---|---|
| nueva_orden → en_proceso | Guardar seguimiento con fecha inicio + técnico + material | Admin (tab Seguimiento) o Técnico (Mi avance) |
| en_proceso → terminada | Guardar seguimiento con fecha término + horas reales | Admin (tab Seguimiento) o Técnico (Mi avance) |
| terminada → entregada | Confirmar entrega con ✓ | Solo Admin |

**14.3 Eventos registrados automáticamente**

| Evento | Cuando se registra |
|---|---|
| 📥 Recepción | Al crear la orden |
| 👤 Asignación | Al asignar técnico con fecha inicio |
| ▶️ Inicio | Al poner fecha de inicio |
| 💬 Comentario | Al agregar/modificar comentario |
| ✅ Autorización | Al autorizar urgencia (prioridad 1-2) |
| 🔄 Cambio de estado | En cada transición automática |
| 🔧 Material | Al cambiar el material utilizado |
| 🏁 Terminado | Al poner fecha de término |
| 📦 Entrega | Al confirmar entrega |

---

### CAPÍTULO 15 — PROBLEMAS COMUNES Y SOLUCIONES

**15.1 No puedo iniciar sesión**
- Verificar número de empleado (5 dígitos)
- Verificar contraseña o PIN
- Si es la primera vez, puede que no tenga PIN asignado → contactar admin
- Si la cuenta está desactivada → contactar superadmin

**15.2 No puedo guardar el seguimiento**
- Verificar que haya al menos 1 técnico asignado
- Verificar que se haya seleccionado material
- Si se puso fecha de término, verificar que las horas reales estén ingresadas
- Verificar conexión a internet

**15.3 La orden no cambia de estado automáticamente**
- Verificar que se haya dado clic en "Guardar" después de poner las fechas
- Verificar que la fecha de inicio esté completa (año-mes-día)
- Verificar que se haya asignado al menos un técnico
- Verificar que se haya seleccionado material

**15.4 El S.E.T.C. aparece como inválido**
- Verificar que tenga exactamente 8 dígitos numéricos
- Si no aplica, dejar el campo vacío (se marcará como "Sin SETC")

**15.5 No puedo exportar el reporte de técnicos**
- Verificar que haya técnicos registrados en el sistema
- Verificar que haya órdenes con seguimiento en el rango de fechas seleccionado
- Intentar sin filtro de fechas para verificar si hay datos

**15.6 El plano no se muestra**
- Verificar que el archivo se haya subido correctamente
- Formatos soportados: PDF, JPG, PNG
- Intentar recargar la página (Ctrl+Shift+R)

**15.7 No puedo cerrar el modal de detalle**
- Presionar la tecla Escape
- Hacer clic en "✕ Cerrar" en la parte superior derecha
- Hacer clic fuera del modal (en el fondo oscuro)
- Si nada funciona, recargar la página

---

### CAPÍTULO 16 — GLOSARIO

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

---

### CAPÍTULO 17 — APÉNDICE

**17.1 Resumen de shortcuts y atajos**
- Ctrl+Shift+R: Recargar página (limpiar caché)
- Escape: Cerrar modal abierto

**17.2 Formato de impresión BWI**
- Formulario: F-1100.C.03-02 Rev. 06
- Tamaño: Carta (8.5" x 11")
- Margen: 10mm
- Encabezado: Logo BWI + "ORDEN DE TRABAJO PARA TALLER"
- Pie: Firma Gerente Tool Room + Firma Conformidad del Solicitante

**17.3 Colores del sistema**

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

**17.4 Versiones del sistema**
- Schema: v5.0
- Cliente Supabase: v5.0
- Frontend: React 18 + Vite 5
- Hosting: Vercel
- Repositorio: github.com/danysan97/bwi-tooling

---

Genera el manual completo en formato Markdown estructurado, listo para copiarse a un editor de texto o convertirse a PDF. Incluye todas las secciones, tablas, diagramas de flujo, y notas. Cada capítulo numerado. Incluye indicadores de dónde insertar capturas de pantalla ["📸 Insertar captura: [descripción de lo que se ve]"].
