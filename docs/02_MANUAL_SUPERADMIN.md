# MANUAL DE USUARIO — SUPERADMIN

## BWI TOOLROOM v5.0

> **Rol:** Superadministrador
> **Alcance:** Acceso total a todas las funcionalidades del sistema
> **Documento de referencia:** F-1100.C.03-02 Rev. 06

---

## Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Panel de Administración — Vista General](#2-panel-de-administración--vista-general)
3. [Gestión de Órdenes (Pestaña Órdenes)](#3-gestión-de-órdenes-pestaña-órdenes)
4. [Gestión de Prioridades (Pestaña Prioridades)](#4-gestión-de-prioridades-pestaña-prioridades)
5. [Análisis con Gráficas (Pestaña Gráficas)](#5-análisis-con-gráficas-pestaña-gráficas)
6. [Monitoreo de Técnicos (Pestaña Técnicos)](#6-monitoreo-de-técnicos-pestaña-técnicos)
7. [Gestión de Usuarios (Pestaña Usuarios)](#7-gestión-de-usuarios-pestaña-usuarios)
8. [Exportación de Reportes](#8-exportación-de-reportes)
9. [Impresión de Órdenes](#9-impresión-de-órdenes)
10. [Autorización de Órdenes Urgentes](#10-autorización-de-órdenes-urgentes)
11. [Confirmación de Entrega](#11-confirmación-de-entrega)
12. [Historial y Auditoría](#12-historial-y-auditoría)
13. [Atajos y Consejos](#13-atajos-y-consejos)

---

## 1. Inicio de Sesión

### 1.1 Acceso al sistema

1. Abra su navegador web (Chrome, Firefox o Edge recomendados).
2. Navegue a la URL del sistema BWI TOOLROOM proporcionada por el administrador de TI.
3. Se mostrará la pantalla de inicio de sesión con el logo de BWI y los campos de credenciales.

### 1.2 Credenciales de superadmin

| Campo            | Valor         |
|------------------|---------------|
| No. de empleado  | `TOOLING01`   |
| PIN              | `123456`      |

### 1.3 Proceso de inicio

1. Ingrese el número de empleado en el campo **"No. de empleado"**.
2. Ingrese su PIN de 6 dígitos en el campo **"PIN"**.
3. Haga clic en el botón **"Iniciar sesión"** o presione **Enter**.
4. El sistema validará las credenciales y lo redirigirá al Panel de Administración.

### 1.4 Primer inicio de sesión

Si es la primera vez que accede al sistema, el sistema le solicitará cambiar su PIN:

1. Se desplegará un formulario de cambio de PIN.
2. Ingrese su PIN actual (`123456`).
3. Ingrese su nuevo PIN (mínimo 4 dígitos, numérico).
4. Confirme el nuevo PIN ingresándolo nuevamente.
5. Haga clic en **"Guardar"**.
6. El sistema validará que ambos campos coincidan y que el PIN cumpla con la longitud mínima.
7. Se completará el inicio de sesión y será redirigido al panel.

### 1.5 Sesión activa

- La sesión permanecerá activa mientras el navegador esté abierto y en uso.
- La sesión finalizará automáticamente al hacer clic en el botón **"Salir"** o al cerrar el navegador.
- No hay timeout automático por inactividad, pero se recomienda cerrar sesión al abandonar la estación de trabajo.

---

## 2. Panel de Administración — Vista General

Al iniciar sesión, se muestra el **Panel de Administración**, que es la pantalla principal de trabajo del superadmin.

### 2.1 Encabezado (Header)

El encabezado contiene los siguientes elementos de izquierda a derecha:

| Elemento | Descripción |
|----------|-------------|
| Logo BWI | Logotipo de la empresa en el lado izquierdo |
| Título | **"Panel de administración — TOOLROOM"** |
| Nombre de usuario | Nombre completo del superadmin actual |
| Botón **"📊 Exportar"** | Genera reportes en formato Excel (ver [Sección 8](#8-exportación-de-reportes)) |
| Botón **"🖨️ Imprimir"** | Imprime la vista actual (ver [Sección 9](#9-impresión-de-órdenes)) |
| Botón **"+ Solicitar orden"** | Crea una nueva orden de trabajo (ver [Sección 3.3](#33-crear-orden)) |
| Botón **"📋 Captura manual"** | Registra una orden manual (ver [Sección 3.4](#34-captura-manual)) |
| Botón **"Salir"** | Cierra la sesión y regresa a la pantalla de login |

### 2.2 Tarjetas KPI

Debajo del encabezado se muestran **7 tarjetas KPI** (Key Performance Indicators) que resumen el estado actual del sistema. Cada tarjeta muestra un número, una etiqueta y un período de referencia. Al pasar el cursor sobre cada tarjeta se muestra un efecto de elevación (hover effect).

| Tarjeta | Descripción | Período |
|---------|-------------|---------|
| **Total órdenes** | Cantidad total de órdenes registradas en el sistema | Este año |
| **Nuevas** | Órdenes creadas que aún no han sido asignadas a un técnico | — |
| **En proceso** | Órdenes que se encuentran actualmente en taller siendo trabajadas | — |
| **Terminadas** | Órdenes que han sido completadas por los técnicos | — |
| **Entregadas** | Órdenes que ya fueron entregadas al solicitante | — |
| **Urgentes** | Órdenes con prioridad 1 (Seguridad) y 2 (Queja de cliente) activas | — |
| **Sin SETC** | Órdenes que no tienen número de SETC asignado (indicador de advertencia) | — |

> **Nota:** Las tarjetas **Urgentes** y **Sin SETC** funcionan como indicadores de alerta. Si su valor es mayor a cero, se recomienda atenderlas de inmediato.

### 2.3 Pestañas de navegación

Debajo de las tarjetas KPI se encuentran **5 pestañas de navegación** que permiten acceder a las diferentes secciones del sistema:

| Pestaña | Icono | Función |
|---------|-------|---------|
| **Órdenes** | 📋 | Gestión y consulta de órdenes de trabajo |
| **Prioridades** | 🔴 | Vista organizada por nivel de prioridad |
| **Gráficas** | 📊 | Análisis visual con gráficas estadísticas |
| **Técnicos** | 👷 | Monitoreo de desempeño de técnicos |
| **Usuarios** | 👥 | Gestión de usuarios del sistema |

> **Nota:** La pestaña **Usuarios** es **exclusiva del superadmin**. Los usuarios con rol de admin no tienen acceso a esta funcionalidad.

Haga clic en cualquiera de las pestañas para cambiar de vista. Las transiciones entre pestañas están animadas con efectos de desvanecimiento.

---

## 3. Gestión de Órdenes (Pestaña Órdenes)

La pestaña **Órdenes** es la vista predeterminada al iniciar sesión y contiene todas las funcionalidades para administrar las órdenes de trabajo.

### 3.1 Búsqueda y Filtros

#### Barra de búsqueda

En la parte superior de la tabla se encuentra la **barra de búsqueda**. Puede buscar órdenes por cualquiera de los siguientes campos:

- **Folio** — Número de folio asignado a la orden
- **Pieza** — Nombre o descripción de la pieza
- **Solicitante** — Nombre de la persona que solicitó la orden
- **Área** — Departamento o área solicitante

Para buscar:
1. Haga clic en la barra de búsqueda.
2. Escriba su término de búsqueda.
3. La tabla se filtrará automáticamente en tiempo real a medida que escribe.
4. Para limpiar la búsqueda, borre el texto del campo.

> **Consejo:** Puede presionar **Enter** para confirmar la búsqueda, aunque el filtrado es automático.

#### Filtros por estado

Debajo de la barra de búsqueda se encuentran **7 filtros en forma de pastilla (pill)** que permiten filtrar las órdenes por estado:

| Filtro | Descripción | Conteo |
|--------|-------------|--------|
| **Todas** | Muestra todas las órdenes sin filtro de estado | Total de órdenes |
| **Nuevas** | Órdenes creadas sin asignar | Conteo de nuevas |
| **En proceso** | Órdenes en taller | Conteo en proceso |
| **Terminadas** | Órdenes completadas | Conteo terminadas |
| **Entregadas** | Órdenes entregadas | Conteo entregadas |
| **Canceladas** | Órdenes canceladas | Conteo canceladas |
| **⚠ Sin SETC** | Órdenes sin número SETC | Conteo sin SETC |

Cada pastilla muestra un **badge con el conteo** de órdenes que cumplen con ese filtro. Para aplicar un filtro:

1. Haga clic en la pastilla deseada.
2. La pastilla seleccionada se resaltará visualmente.
3. La tabla se actualizará para mostrar solo las órdenes que cumplen con el filtro seleccionado.
4. Haga clic en **"Todas"** para quitar el filtro y ver todas las órdenes.

> **Nota:** Los filtros se pueden combinar con la barra de búsqueda. Por ejemplo, puede buscar "Bomba" mientras tiene seleccionado el filtro "Nuevas".

#### Tabla de órdenes

La tabla principal muestra las órdenes con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Folio** | Número de folio único de la orden |
| **Fecha** | Fecha de creación de la orden |
| **Solicitante** | Nombre de quien solicita la pieza |
| **Área** | Departamento o área del solicitante |
| **Pieza** | Nombre o descripción de la pieza solicitada |
| **S.E.T.C.** | Número de SETC asignado (si existe) |
| **Prioridad** | Nivel de prioridad (1-5) con indicador de color |
| **Estado** | Estado actual de la orden (nueva, en proceso, terminada, entregada, cancelada) |
| **Técnico** | Nombre del técnico asignado (si existe) |
| **Hrs** | Horas registradas en la orden |

**Indicadores visuales en la tabla:**

- La columna **Prioridad** muestra etiquetas con colores:
  - Prioridad 1 — Rojo (Seguridad)
  - Prioridad 2 — Naranja (Queja de cliente)
  - Prioridad 3 — Amarillo (Máquina parada)
  - Prioridad 4 — Azul (Rápido)
  - Prioridad 5 — Verde (Fabricación)
- La columna **S.E.T.C.** muestra un indicador de advertencia si el campo está vacío.
- Las filas con órdenes urgentes (prioridad 1 y 2) pueden tener un resaltado especial.

**Interacción con la tabla:**

- Haga clic en cualquier **fila de la tabla** para abrir el **Detalle de Orden** en un modal.
- Las filas tienen un efecto hover al pasar el cursor.
- La tabla es ordenable haciendo clic en los encabezados de columna.

### 3.2 Detalle de Orden (Modal)

Al hacer clic en una fila de la tabla de órdenes, se abre un **modal (ventana emergente)** que muestra el detalle completo de la orden seleccionada. Este modal contiene **4 pestañas internas**:

#### 3.2.1 Pestaña "Detalle"

Muestra la información general de la orden organizada en una cuadrícula:

| Campo | Descripción |
|-------|-------------|
| **Folio** | Número de folio de la orden |
| **Fecha** | Fecha y hora de creación |
| **Solicitante** | Nombre completo del solicitante |
| **Área/Departamento** | Área del solicitante |
| **Pieza** | Nombre de la pieza |
| **S.E.T.C.** | Número SETC (con indicador de advertencia si está vacío) |
| **Plano** | Número de plano asociado |
| **Máquina** | Máquina a la que pertenece la pieza |
| **Línea** | Línea de producción |
| **Cantidad** | Cantidad solicitada |
| **Prioridad** | Nivel de prioridad con etiqueta de color |
| **Estado** | Estado actual de la orden |

**Elementos adicionales en la pestaña Detalle:**

- **Indicador de SETC:** Si la orden no tiene número SETC, se muestra un aviso llamativo en color amarillo/rojo indicando que se requiere asignar un SETC.
- **Estado de autorización:** Si la orden es prioridad 1 o 2, se muestra si ya fue autorizada o si está pendiente.
- **Descripción:** Texto libre con la descripción detallada de la solicitud.
- **Vista previa del plano:** Si se adjuntó un archivo plano, se muestra una vista previa inline del documento. Los formatos soportados son PDF, DWG, DXF, Word y JPG.

#### 3.2.2 Pestaña "Seguimiento"

Permite gestionar el seguimiento y avance de la orden:

**Asignación de técnicos:**
- Sección para asignar uno o más técnicos a la orden.
- Seleccione un técnico de la lista desplegable de técnicos disponibles.
- Puede asignar múltiples técnicos a una misma orden.
- Los técnicos asignados se muestran en una lista con opción de eliminación.

**Selección de material:**
- Campo para registrar el material utilizado en la reparación/fabricación.
- Seleccione el material de la lista de materiales disponibles en el sistema.

**Comentarios:**
- Área de texto para agregar comentarios sobre el avance de la orden.
- Los comentarios quedan registrados en el historial con el tipo "comentario".
- Para enviar un comentario, escriba el texto y presione **Enter** o haga clic en el botón de envío.

**Fechas de seguimiento:**
- **Fecha de inicio:** Fecha y hora en que comenzó el trabajo en la orden.
- **Fecha de término:** Fecha y hora en que se completó el trabajo.
- Estas fechas se actualizan automáticamente al cambiar el estado de la orden, pero pueden ajustarse manualmente.

#### 3.2.3 Pestaña "Estado"

Permite gestionar los cambios de estado y autorizaciones de la orden:

**Para órdenes con prioridad 1 o 2:**

Antes de que pueda iniciarse el trabajo en una orden urgente, se requiere una **autorización formal**. La pestaña Estado muestra un formulario de autorización con los siguientes campos obligatorios:

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| **Nombre de quien autoriza** | Nombre completo de la persona que autoriza la orden | Sí |
| **Puesto** | Cargo o puesto de quien autoriza | Sí |
| **Comentario** | Justificación o comentario de la autorización | Sí |

Una vez completados los campos:
1. Haga clic en el botón **✅ Autorizar** para aprobar la orden.
2. O haga clic en el botón **❌ Rechazar** para denegar la autorización.
3. La autorización quedará registrada en el historial con el tipo "autorizacion".

> **Nota:** Sin autorización, la orden urgente no podrá avanzar al estado "en proceso".

**Confirmación de entrega:**

Para órdenes con estado **"terminada"**, la pestaña Estado muestra un botón de confirmación de entrega:

1. Haga clic en **"¿Entregado?"**.
2. Se mostrará un diálogo de confirmación con las opciones **✓ (Sí)** y **✕ (No)**.
3. Al confirmar con **✓**, la orden se marcará como `entregada: true` y pasará al estado "entregada".
4. El evento de entrega quedará registrado en el historial con el tipo "entrega".

#### 3.2.4 Pestaña "Historial"

Muestra la **línea de tiempo completa** de eventos de la orden. Cada evento se muestra con:

- **Icono** representativo del tipo de evento
- **Etiqueta del tipo** de evento
- **Fecha y hora** exacta del evento
- **Texto descriptivo** con los detalles del evento
- **Nombre del actor** que realizó la acción

Los eventos son **inmutables** (solo se agregan, nunca se modifican ni eliminan), lo que garantiza un registro de auditoría completo y confiable.

Para más detalles sobre los tipos de eventos, ver [Sección 12](#12-historial-y-auditoría).

### 3.3 Crear Orden

Para crear una nueva orden de trabajo:

1. Haga clic en el botón **"+ Solicitar orden"** ubicado en el encabezado.
2. Se desplegará un formulario de creación de orden con los siguientes campos:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **Pieza** | Texto | Nombre o descripción de la pieza | Sí |
| **S.E.T.C.** | Texto | Número de identificación SETC | No |
| **Plano** | Texto | Número de plano asociado | No |
| **Máquina** | Texto/Selección | Máquina a la que pertenece | No |
| **Línea** | Texto/Selección | Línea de producción | No |
| **Cantidad** | Numérico | Cantidad de piezas solicitadas | Sí |
| **Descripción** | Texto largo | Descripción detallada de la solicitud | Sí |
| **Prioridad** | Selección | Nivel de prioridad (1 a 5) | Sí |

3. Complete todos los campos obligatorios.
4. Si desea adjuntar un archivo, haga clic en el área de carga de archivos:
   - **Formatos permitidos:** PDF, DWG, DXF, Word (.doc/.docx), JPG
   - **Tamaño máximo:** 20 MB
   - Arrastre el archivo al área indicada o haga clic para seleccionarlo desde su equipo.
5. Haga clic en el botón **"Crear orden"** o **"Enviar"** para registrar la orden.
6. La orden se creará con el estado **"nueva_orden"** y aparecerá en la tabla principal.
7. Se asignará un **folio automáticamente** de forma secuencial.

> **Nota:** Las órdenes creadas con prioridad 1 o 2 quedarán pendientes de autorización antes de poder ser trabajadas.

### 3.4 Captura Manual

La **Captura manual** permite registrar órdenes que llegaron por medios distintos al sistema (papeleta en papel, solicitud verbal, etc.).

1. Haga clic en el botón **"📋 Captura manual"** ubicado en el encabezado.
2. Se desplegará un formulario de captura manual con los siguientes campos:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **Folio de papeleta** | Texto | Número de folio de la papeleta original en papel | Sí |
| **Fecha original** | Fecha | Fecha en que se recibió la solicitud original | Sí |
| **Solicitante** | Búsqueda/Texto | Nombre del solicitante (búsqueda en base de datos o ingreso manual) | Sí |
| **Pieza** | Texto | Nombre o descripción de la pieza | Sí |
| **Descripción** | Texto largo | Descripción detallada de la solicitud | Sí |
| **Prioridad** | Selección | Nivel de prioridad (1 a 5) | Sí |
| **Área/Departamento** | Texto/Selección | Área del solicitante | Sí |

3. Complete todos los campos obligatorios.
4. Para el campo **Solicitante**, puede:
   - Escribir el nombre y el sistema buscará coincidencias en la base de datos de usuarios registrados.
   - Si el solicitante no está registrado, ingrese el nombre manualmente.
5. Haga clic en **"Crear orden manual"** para registrar la orden.
6. La orden se creará con una bandera especial de `es_orden_manual: true`, indicando que fue capturada fuera del sistema.
7. La orden aparecerá en la tabla principal con su folio asignado.

> **Importante:** Las órdenes manuales siguen el mismo flujo de estados y autorizaciones que las órdenes creadas directamente en el sistema.

---

## 4. Gestión de Prioridades (Pestaña Prioridades)

La pestaña **Prioridades** organiza las órdenes según su nivel de urgencia, facilitando la identificación y atención de los casos más críticos.

### 4.1 Sub-pestañas de prioridad

Dentro de la pestaña Prioridades, se muestran **6 sub-pestañas** que filtran las órdenes por nivel de prioridad:

| Sub-pestaña | Nivel | Descripción | Badge |
|-------------|:-----:|-------------|:-----:|
| **Todas** | — | Muestra todas las órdenes independientemente de su prioridad | Total |
| **1·Seguridad** | 1 | Órdenes relacionadas con seguridad | Conteo |
| **2·Queja cliente** | 2 | Órdenes por quejas de clientes | Conteo |
| **3·Máq. parada** | 3 | Órdenes por máquina parada | Conteo |
| **4·Rápido** | 4 | Órdenes de servicio rápido | Conteo |
| **5·Fabricación** | 5 | Órdenes de fabricación estándar | Conteo |

Cada sub-pestaña muestra un **badge con el conteo** de órdenes de ese nivel de prioridad.

### 4.2 KPIs de prioridad

Al seleccionar una sub-pestaña de prioridad específica (1 a 5), se muestran **indicadores KPI resumen** con los siguientes datos:

| KPI | Descripción |
|-----|-------------|
| **Total** | Cantidad total de órdenes de esa prioridad |
| **Nuevas** | Órdenes sin asignar de esa prioridad |
| **En proceso** | Órdenes en taller de esa prioridad |
| **Terminadas** | Órdenes completadas de esa prioridad |
| **Entregadas** | Órdenes entregadas de esa prioridad |

Estos KPIs permiten ver rápidamente el estado de las órdenes de cada prioridad.

### 4.3 Tabla de prioridades

La tabla muestra las órdenes con las mismas columnas que la pestaña Órdenes, pero **ordenadas de la siguiente manera:**

1. **Primero por prioridad** — Las órdenes de mayor prioridad (1) aparecen primero.
2. **Luego por folio descendente** — Dentro de cada prioridad, las órdenes más recientes aparecen primero.

### 4.4 Autorización de prioridades 1 y 2

Las órdenes con **prioridad 1 (Seguridad)** y **prioridad 2 (Queja de cliente)** requieren una autorización formal antes de que el trabajo pueda iniciarse.

Para autorizar:
1. Abra el detalle de la orden urgente desde la tabla.
2. Navegue a la pestaña **"Estado"**.
3. Complete los campos de autorización: Nombre, Puesto y Comentario.
4. Haga clic en **✅ Autorizar**.
5. La orden quedará autorizada y podrá avanzar al estado "en proceso".

> **Importante:** Si una orden urgente no tiene autorización, no podrá ser trabajada por los técnicos.

---

## 5. Análisis con Gráficas (Pestaña Gráficas)

La pestaña **Gráficas** proporciona una vista analítica y visual del rendimiento del sistema Toolroom. Contiene **3 gráficas** principales:

### 5.1 Órdenes por mes

- **Tipo de gráfica:** Barras apiladas (Stacked Bar Chart)
- **Datos mostrados:** Cantidad de órdenes por mes del año en curso
- **Categorías apiladas:**
  - **Nuevas** — Color diferenciado
  - **En proceso** — Color diferenciado
  - **Terminadas** — Color diferenciado
- **Eje X:** Meses del año (Enero a Diciembre)
- **Eje Y:** Cantidad de órdenes

Esta gráfica permite visualizar la tendencia de carga de trabajo a lo largo del año y comparar la distribución de estados por mes.

### 5.2 Órdenes por prioridad

- **Tipo de gráfica:** Pie chart (Gráfica circular)
- **Datos mostrados:** Distribución de órdenes según su nivel de prioridad
- **Segmentos:**
  - Prioridad 1 — Seguridad
  - Prioridad 2 — Queja de cliente
  - Prioridad 3 — Máquina parada
  - Prioridad 4 — Rápido
  - Prioridad 5 — Fabricación

Esta gráfica permite identificar rápidamente qué tipo de solicitudes es más frecuente.

### 5.3 Órdenes por técnico

- **Tipo de gráfica:** Barras horizontales (Horizontal Bar Chart)
- **Datos mostrados:** Cantidad de órdenes asignadas a cada técnico
- **Eje Y:** Nombres de los técnicos
- **Eje X:** Cantidad de órdenes

Esta gráfica permite evaluar la distribución de carga de trabajo entre los técnicos del taller.

> **Nota:** Todas las gráficas se actualizan automáticamente al cambiar los datos del sistema. Puede refrescar la información cambiando a otra pestaña y regresando a Gráficas.

---

## 6. Monitoreo de Técnicos (Pestaña Técnicos)

La pestaña **Técnicos** permite al superadmin monitorear el desempeño, la productividad y la eficiencia de cada técnico del taller.

### 6.1 Selector de período

En la parte superior se encuentra un **selector de período** con 3 opciones:

| Opción | Descripción |
|--------|-------------|
| **Esta semana** | Muestra métricas de la semana en curso |
| **Este mes** | Muestra métricas del mes en curso |
| **Total** | Muestra métricas acumuladas desde el inicio |

Seleccione el período deseado haciendo clic en la opción correspondiente. Los datos y gráficas se actualizarán automáticamente.

### 6.2 Tabla de métricas por técnico

La tabla principal muestra las métricas de productividad para cada técnico:

| Columna | Descripción |
|---------|-------------|
| **Técnico** | Nombre completo del técnico |
| **Turno** | Turno asignado (matutino, vespertino, etc.) |
| **Hrs disponibles** | Total de horas laborables en el período seleccionado |
| **Hrs trabajadas** | Horas efectivamente trabajadas en órdenes |
| **Aprovechamiento** | Porcentaje de horas trabajadas vs. disponibles (barra de progreso visual) |
| **Órdenes** | Cantidad total de órdenes asignadas |
| **Terminadas** | Cantidad de órdenes completadas |

**Barra de aprovechamiento:**
- Se muestra como una barra de progreso visual con porcentaje.
- Verde: Aprovechamiento alto (mayor al 80%)
- Amarillo: Aprovechamiento medio (60% - 80%)
- Rojo: Aprovechamiento bajo (menor al 60%)

### 6.3 Gráficas de desempeño

Debajo de la tabla se muestran **3 gráficas** de desempeño:

#### Gráfica de comparación de horas
- **Tipo:** Barras comparativas
- **Muestra:** Horas disponibles vs. horas trabajadas por técnico
- Permite identificar técnicos con alta y baja productividad

#### Gráfica de eficiencia
- **Tipo:** Barras de progreso
- **Muestra:** Porcentaje de aprovechamiento por técnico
- Indicadores visuales de color según el nivel de eficiencia

#### Gráfica de tendencia a 6 meses
- **Tipo:** Gráfica de líneas
- **Muestra:** Evolución del desempeño de cada técnico en los últimos 6 meses
- Permite identificar tendencias de mejora o deterioro en la productividad

### 6.4 Historial individual de técnico

Cada fila de la tabla de métricas incluye un botón **"Ver historial"** que permite acceder al detalle individual de cada técnico:

1. Haga clic en **"Ver historial"** en la fila del técnico deseado.
2. Se abrirá un **modal** con la información detallada del técnico:
   - **Métricas individuales:** Horas trabajadas, órdenes completadas, eficiencia
   - **Lista de órdenes:** Todas las órdenes asignadas al técnico en el período seleccionado
   - Cada orden en la lista muestra: folio, fecha, pieza, estado, horas invertidas

---

## 7. Gestión de Usuarios (Pestaña Usuarios)

> **IMPORTANTE:** Esta pestaña es **EXCLUSIVA del rol Superadmin**. Los usuarios con rol de Admin no tienen acceso a esta funcionalidad.

La pestaña **Usuarios** permite administrar todas las cuentas de usuario del sistema, incluyendo la creación, edición, activación/desactivación y gestión de PINs.

### 7.1 KPIs de usuarios

En la parte superior se muestran **5 tarjetas KPI** con el resumen de usuarios:

| KPI | Descripción |
|-----|-------------|
| **Total usuarios** | Cantidad total de usuarios registrados en el sistema |
| **Activos** | Usuarios con estado activo (pueden iniciar sesión) |
| **Admins** | Usuarios con rol de administrador |
| **Técnicos** | Usuarios con rol de técnico |
| **Solicitantes** | Usuarios con rol de solicitante |

### 7.2 Búsqueda y filtros

#### Barra de búsqueda

La barra de búsqueda permite localizar usuarios por:

- **Nombre** — Nombre completo del usuario
- **No. de empleado** — Número de empleado
- **Área/Departamento** — Área o departamento al que pertenece

Escriba su término de búsqueda y la tabla se filtrará automáticamente.

#### Filtros por rol

**5 filtros en forma de pastilla** permiten filtrar usuarios por rol:

| Filtro | Descripción |
|--------|-------------|
| **Todos** | Muestra todos los usuarios |
| **Superadmin** | Solo usuarios con rol de superadmin |
| **Admins** | Solo usuarios con rol de administrador |
| **Técnicos** | Solo usuarios con rol de técnico |
| **Solicitantes** | Solo usuarios con rol de solicitante |

Haga clic en el filtro deseado. La pastilla seleccionada se resaltará y la tabla se actualizará.

### 7.3 Tabla de usuarios

La tabla muestra la información de todos los usuarios con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **No. Emp.** | Número de empleado (identificador único) |
| **Nombre** | Nombre completo del usuario |
| **Rol** | Rol del usuario (Superadmin, Admin, Técnico, Solicitante) con badge de color |
| **Área/Depto** | Área o departamento asignado |
| **Turno** | Turno de trabajo |
| **Último acceso** | Fecha y hora del último inicio de sesión |
| **Estado** | Activo / Inactivo con indicador visual |
| **Acciones** | Botones de acción disponibles |

**Indicadores visuales:**

- El campo **Rol** se muestra con un badge de color diferenciado:
  - Superadmin — Color distintivo
  - Admin — Color diferenciado
  - Técnico — Color diferenciado
  - Solicitante — Color diferenciado
- El campo **Estado** muestra un indicador verde (activo) o gris (inactivo).

### 7.4 Crear Usuario

Para crear un nuevo usuario:

1. Haga clic en el botón **"+ Nuevo usuario"** en la parte superior de la tabla.
2. Se desplegará un formulario de creación con los siguientes campos:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **No. empleado** | Texto | Número único de empleado | Sí |
| **Nombre** | Texto | Nombre completo del usuario | Sí |
| **Rol** | Selección | Rol del usuario (Superadmin, Admin, Técnico, Solicitante) | Sí |
| **Área** | Texto/Selección | Área asignada | Sí |
| **Departamento** | Texto/Selección | Departamento asignado | Sí |
| **Turno** | Selección | Turno de trabajo | Sí |

**Sección de PIN** (visible solo si el rol es Admin, Técnico o Superadmin):

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **PIN inicial** | Numérico | PIN de acceso (mínimo 4 dígitos) | Sí |
| **Confirmar PIN** | Numérico | Confirmación del PIN | Sí |

3. Complete todos los campos obligatorios.
4. **Validaciones:**
   - El **No. de empleado** debe ser único en el sistema. Si ya existe, se mostrará un error.
   - El **PIN** debe tener un mínimo de 4 dígitos numéricos.
   - Los campos de PIN deben coincidir.
5. Haga clic en **"Crear usuario"** para registrar al usuario.
6. El nuevo usuario aparecerá en la tabla y podrá iniciar sesión inmediatamente.

> **Nota:** Los usuarios con rol de **Solicitante** no requieren PIN, ya que no acceden al sistema directamente.

### 7.5 Editar Usuario

Para editar la información de un usuario existente:

1. Localice al usuario en la tabla.
2. Haga clic en el botón **"Editar"** (icono de lápiz) en la columna de Acciones.
3. Se desplegará el formulario de edición con los campos prellenados con la información actual.
4. Modifique los campos deseados:
   - Nombre
   - Rol
   - Área
   - Departamento
   - Turno
5. **El campo "No. empleado" está bloqueado** y no puede modificarse, ya que es el identificador único del usuario.
6. Haga clic en **"Guardar cambios"** para aplicar las modificaciones.
7. Los cambios se reflejarán inmediatamente en la tabla.

> **Nota:** La edición de usuario **no permite cambiar el PIN**. Para cambiar el PIN, utilice la función específica de reseteo de PIN (ver [Sección 7.6](#76-resetear-pin)).

### 7.6 Resetear PIN

Para restablecer el PIN de un usuario con rol de Admin, Técnico o Superadmin:

1. Localice al usuario en la tabla.
2. Haga clic en el botón **"PIN"** (icono de llave) en la columna de Acciones.
3. Se abrirá un diálogo con los siguientes campos:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **Nuevo PIN** | Numérico | Nuevo PIN de acceso (mínimo 4 dígitos) | Sí |
| **Confirmar PIN** | Numérico | Confirmación del nuevo PIN | Sí |

4. Ingrese el nuevo PIN y confírmelo.
5. Haga clic en **"Guardar"** para aplicar el cambio.
6. El sistema ejecutará la función RPC `cambiar_pin()` para actualizar el PIN en la base de datos.
7. El usuario deberá usar el nuevo PIN en su próximo inicio de sesión.

> **Seguridad:** El PIN anterior se sobrescribe directamente. No hay opción de recuperación del PIN anterior. Asegúrese de comunicar el nuevo PIN al usuario de forma segura.

### 7.7 Activar / Desactivar

Para cambiar el estado de activación de un usuario:

1. Localice al usuario en la tabla.
2. Haga clic en el botón **"Desactivar"** (o **"Activar"** si el usuario ya está inactivo) en la columna de Acciones.
3. Se mostrará un diálogo de confirmación:
   - **Desactivar:** "¿Está seguro de desactivar a [Nombre]? Este usuario no podrá iniciar sesión."
   - **Activar:** "¿Está seguro de activar a [Nombre]? Este usuario podrá iniciar sesión."
4. Confirme la acción.
5. El estado del usuario cambiará inmediatamente:
   - **Inactivo:** El usuario no podrá iniciar sesión en el sistema. Su fila en la tabla se mostrará con un indicador gris.
   - **Activo:** El usuario podrá iniciar sesión normalmente.

> **Nota:** No es posible desactivar su propia cuenta de superadmin desde la interfaz de usuarios. Si necesita desactivar una cuenta de superadmin, contacte al soporte técnico.

---

## 8. Exportación de Reportes

El sistema permite exportar reportes en formato Excel para análisis externo, presentaciones o archivado.

### 8.1 Generar un reporte

1. Haga clic en el botón **"📊 Exportar"** ubicado en el encabezado.
2. Se desplegará un diálogo de exportación con las siguientes opciones:

#### Tipo de reporte

| Reporte | Contenido | Archivo generado |
|---------|-----------|------------------|
| **Órdenes de trabajo** | Reporte completo de órdenes con 23 columnas de datos + hoja de resumen | `BWI_TOOLROOM_Ordenes_{fecha}.xlsx` |
| **Desempeño técnicos** | Resumen de métricas + detalle individual por técnico | `BWI_TOOLROOM_Tecnicos_{fecha}.xlsx` |

#### Rango de fechas

- Seleccione el rango de fechas para el reporte.
- **Valor predeterminado:** Mes en curso (desde el primer día del mes hasta la fecha actual).
- Puede ajustar las fechas de inicio y fin según sus necesidades.
- El selector de fecha muestra un calendario para facilitar la selección.

### 8.2 Estructura del reporte de Órdenes de trabajo

El archivo Excel de órdenes de trabajo contiene:

- **Hoja 1 — Resumen:** Estadísticas generales (totales por estado, prioridad, período)
- **Hoja 2 — Detalle:** Tabla con **23 columnas** de datos por orden, incluyendo:
  - Folio, Fecha, Solicitante, Área, Pieza, SETC, Plano, Máquina, Línea, Cantidad, Descripción, Prioridad, Estado, Técnico(s), Horas, Fecha inicio, Fecha término, Autorización, Comentarios, etc.

### 8.3 Estructura del reporte de Desempeño técnicos

El archivo Excel de desempeño contiene:

- **Hoja 1 — Resumen:** Tabla comparativa de todos los técnicos con sus métricas principales
- **Hojas adicionales — Detalle por técnico:** Una hoja por cada técnico con su historial de órdenes, horas trabajadas y eficiencia

### 8.4 Descarga

1. Seleccione el tipo de reporte y el rango de fechas.
2. Haga clic en **"Exportar"** o **"Descargar"**.
3. El archivo se generará automáticamente y se descargará a la carpeta de descargas de su navegador.
4. El nombre del archivo incluirá la fecha de generación para fácil identificación.

---

## 9. Impresión de Órdenes

El sistema genera impresiones formales de órdenes de trabajo en el formato estándar de la empresa.

### 9.1 Imprimir desde el detalle de orden

1. Abra el detalle de una orden haciendo clic en su fila de la tabla.
2. En el modal de detalle, haga clic en el botón **"🖨️ Imprimir"**.
3. Se abrirá una **vista previa de impresión** en una nueva pestaña del navegador.
4. La vista previa muestra el **formato F-1100.C.03-02 Rev. 06** que incluye:

**Contenido del formato de impresión:**

| Sección | Contenido |
|---------|-----------|
| **Encabezado** | Logo de BWI, número de formato, revisión |
| **Datos de la orden** | Folio, fecha, solicitante, área, pieza, SETC, plano, máquina, línea, cantidad, descripción |
| **Prioridad** | Nivel de prioridad asignado |
| **Estado** | Estado actual de la orden |
| **Autorización** | Estado de autorización (para prioridades 1 y 2) |
| **Técnico(s)** | Nombre(s) del(s) técnico(s) asignado(s) |
| **Fechas** | Fecha de inicio y fecha de término |
| **Horas** | Horas invertidas |
| **Líneas de firma** | Espacios para firmas de: Solicitante, Técnico, Supervisor, Autorización |

5. En la vista previa, haga clic en el botón **"🖨 Imprimir"**.
6. Se abrirá el **diálogo de impresión del navegador** con las opciones de impresión:
   - Seleccione la impresora deseada.
   - Configure orientación (recomendado: vertical), márgenes y escala.
   - Haga clic en **"Imprimir"** para enviar el documento a la impresora.
7. Alternativamente, puede guardar como PDF seleccionando **"Guardar como PDF"** como impresora.

> **Nota:** La vista previa de impresión se abre en una nueva pestaña del navegador. Puede cerrar esa pestaña después de imprimir.

### 9.2 Imprimir desde la lista de órdenes

También puede imprimir desde el encabezado principal:

1. Haga clic en el botón **"🖨️ Imprimir"** en el encabezado.
2. Se imprimirá la vista actual de la tabla de órdenes.

---

## 10. Autorización de Órdenes Urgentes

Las órdenes con **prioridad 1 (Seguridad)** y **prioridad 2 (Queja de cliente)** requieren una autorización formal antes de poder ser trabajadas. Este es un control de calidad y seguridad crítico.

### 10.1 Proceso de autorización

1. Identifique una orden urgente en la tabla (prioridad 1 o 2).
   - Las órdenes pendientes de autorización pueden identificarse porque su estado es "nueva_orden" y tienen prioridad 1 o 2.
2. Haga clic en la fila de la orden para abrir su detalle.
3. Navegue a la pestaña **"Estado"**.
4. Si la orden aún no ha sido autorizada, se mostrará el formulario de autorización.

### 10.2 Formulario de autorización

Complete los siguientes campos, todos obligatorios:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre de quien autoriza** | Nombre completo de la persona que autoriza | "Juan Pérez García" |
| **Puesto** | Cargo o puesto de quien autoriza | "Supervisor de Mantenimiento" |
| **Comentario** | Justificación o comentario de la autorización | "Aprobado para reparación inmediata" |

### 10.3 Acciones de autorización

| Botón | Acción | Resultado |
|-------|--------|-----------|
| **✅ Autorizar** | Aprueba la orden | La orden puede avanzar al estado "en proceso". Se registra evento tipo "autorizacion" en el historial. |
| **❌ Rechazar** | Deniega la autorización | La orden no puede ser trabajada. Se registra evento tipo "autorizacion" en el historial con resultado de rechazo. |

### 10.4 Registro en historial

Cada autorización (aprobación o rechazo) queda registrada permanentemente en el historial de la orden con:

- Tipo de evento: `autorizacion`
- Fecha y hora exactas
- Nombre de quien autorizó
- Resultado (autorizado / rechazado)
- Comentario proporcionado

---

## 11. Confirmación de Entrega

Una vez que una orden ha sido completada (estado "terminada"), el superadmin puede confirmar su entrega al solicitante.

### 11.1 Proceso de confirmación

1. Localice la orden terminada en la tabla.
2. Haga clic en la fila para abrir su detalle.
3. Navegue a la pestaña **"Estado"**.
4. Verá el botón **"¿Entregado?"** disponible para órdenes con estado "terminada".
5. Haga clic en **"¿Entregado?"**.
6. Se mostrará un diálogo de confirmación con las opciones:
   - **✓** — Confirmar entrega
   - **✕** — Cancelar (no entregar aún)

### 11.2 Resultado de la confirmación

Al confirmar con **✓**:

1. La orden se marcará como `entregada: true`.
2. El estado de la orden cambiará a **"entregada"**.
3. Se registrará un evento de tipo **"entrega"** en el historial con la fecha y hora exactas.
4. La orden aparecerá en el filtro "Entregadas" y en el KPI correspondiente.

### 11.3 Deshacer entrega

> **Nota:** Una vez confirmada la entrega, la acción queda registrada permanentemente en el historial. Si se necesita revertir una entrega por error, contacte al soporte técnico o utilice el registro en el historial como referencia para ajustes manuales en la base de datos.

---

## 12. Historial y Auditoría

Cada orden de trabajo en el sistema cuenta con un **registro de historial completo e inmutable** que documenta cada evento desde su creación hasta su entrega.

### 12.1 Tipos de eventos

El sistema registra **9 tipos de eventos**不同的:

| Icono | Tipo de evento | Descripción |
|-------|----------------|-------------|
| 📥 | **recepcion** | La orden fue recibida/creada en el sistema |
| 👤 | **asignacion** | Un técnico fue asignado a la orden |
| ▶️ | **inicio** | El trabajo en la orden fue iniciado |
| 💬 | **comentario** | Se agregó un comentario a la orden |
| ✅ | **autorizacion** | La orden fue autorizada (o rechazada) |
| 🔄 | **cambio_estado** | El estado de la orden fue modificado |
| 🔧 | **material** | Se registró material utilizado |
| ✔️ | **terminado** | El trabajo fue completado |
| 📦 | **entrega** | La orden fue entregada al solicitante |

### 12.2 Detalle de cada evento

Cada registro del historial muestra:

- **Icono** representativo del tipo de evento
- **Etiqueta del tipo** de evento (ej: "Asignación", "Autorización")
- **Fecha y hora** exacta del evento (formato: DD/MM/YYYY HH:MM)
- **Texto descriptivo** con los detalles específicos del evento
- **Nombre del actor** que realizó la acción (ej: nombre del técnico, nombre del admin)

### 12.3 Propiedades del historial

- **Inmutabilidad:** Los eventos son append-only. Una vez registrado, un evento nunca puede ser modificado ni eliminado.
- **Orden cronológico:** Los eventos se muestran en orden cronológico, del más reciente al más antiguo.
- **Registro completo:** Cada interacción con la orden queda documentada.
- **Auditoría:** El historial cumple con los requisitos de trazabilidad y auditoría del sistema de gestión de calidad.

### 12.4 Uso del historial

El historial es útil para:

- **Cumplimiento normativo:** Verificar que se siguieron los procesos establecidos.
- **Resolución de problemas:** Investigar por qué una orden tiene un estado particular.
- **Rendimiento:** Analizar el tiempo entre eventos (ej: tiempo entre asignación e inicio).
- **Responsabilidad:** Identificar quién realizó cada acción y cuándo.
- **Capacitación:** Enseñar a nuevos usuarios el flujo correcto de trabajo.

---

## 13. Atajos y Consejos

### 13.1 Atajos de teclado y ratón

| Acción | Atajo / Método |
|--------|----------------|
| **Abrir detalle de orden** | Haga clic en cualquier fila de la tabla |
| **Buscar órdenes** | Haga clic en la barra de búsqueda y escriba |
| **Confirmar búsqueda** | Presione **Enter** en la barra de búsqueda |
| **Enviar comentario** | Presione **Enter** en el área de comentarios del modal |
| **Cerrar modal** | Haga clic fuera del modal o presione **Escape** |
| **Cambiar de pestaña** | Haga clic en la pestaña deseada (动画 animación de transición) |
| **Navegar filtros** | Haga clic en las pastillas de filtro |

### 13.2 Indicadores visuales

| Indicador | Significado |
|-----------|-------------|
| **Badge numérico en filtros** | Cantidad de órdenes que cumplen con ese filtro |
| **Hover en tarjetas KPI** | Efecto de elevación al pasar el cursor |
| **Colores de prioridad** | Rojo (1), Naranja (2), Amarillo (3), Azul (4), Verde (5) |
| **Barra de progreso verde** | Aprovechamiento alto (>80%) |
| **Barra de progreso amarilla** | Aprovechamiento medio (60-80%) |
| **Barra de progreso roja** | Aprovechamiento bajo (<60%) |
| **Indicador SETC vacío** | Advertencia de que falta número SETC |
| **Estado activo/inactivo** | Verde activo, Gris inactivo |

### 13.3 Consejos de uso

1. **Revise los KPIs al iniciar sesión** para tener una vista rápida del estado del taller.
2. **Atienda primero las órdenes urgentes** (prioridad 1 y 2) marcadas en la tarjeta de KPI.
3. **Asigne SETC a todas las órdenes** para evitar la acumulación de órdenes sin SETC.
4. **Use la pestaña Prioridades** para organizar el trabajo según la urgencia.
5. **Exporte reportes periódicamente** para mantener registros fuera del sistema.
6. **Revise la pestaña Técnicos** regularmente para monitorear la productividad.
7. **Autorice órdenes urgentes rápidamente** para no retrasar el trabajo en taller.
8. **Confirme entregas** inmediatamente al entregar la pieza al solicitante.
9. **Revise el historial** de órdenes problemáticas para identificar cuellos de botella.
10. **Capture manualmente** las órdenes que llegan por otros medios para mantener el sistema actualizado.

### 13.4 Flujo de trabajo recomendado para el superadmin

```
Inicio de sesión
    ↓
Revisar KPIs del panel
    ↓
Verificar órdenes urgentes (Tarjeta "Urgentes")
    ↓
Autorizar órdenes pendientes (Pestaña Prioridades → 1·Seguridad / 2·Queja cliente)
    ↓
Revisar órdenes nuevas sin asignar
    ↓
Asignar técnicos y materiales
    ↓
Monitorear avance (Pestaña Técnicos)
    ↓
Confirmar entregas de órdenes terminadas
    ↓
Exportar reportes al cierre del día/semana
    ↓
Cerrar sesión
```

---

## Información de contacto

Para soporte técnico o dudas sobre el sistema BWI TOOLROOM v5.0, contacte al equipo de desarrollo o al administrador del sistema.

---

*Documento generado para BWI TOOLROOM v5.0 — Rol Superadministrador*
*Formato de referencia: F-1100.C.03-02 Rev. 06*
