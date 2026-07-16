# MANUAL DE USUARIO — ADMINISTRADOR

## BWI TOOLROOM v5.0

> **Rol:** Administrador
> **Alcance:** Gestión operativa completa del taller — sin acceso a gestión de usuarios
> **Documento de referencia:** F-1100.C.03-02 Rev. 06

---

## Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Panel de Administración — Vista General](#2-panel-de-administración--vista-general)
3. [Gestión de Órdenes (Pestaña Órdenes)](#3-gestión-de-órdenes-pestaña-órdenes)
4. [Gestión de Prioridades (Pestaña Prioridades)](#4-gestión-de-prioridades-pestaña-prioridades)
5. [Análisis con Gráficas (Pestaña Gráficas)](#5-análisis-con-gráficas-pestaña-gráficas)
6. [Monitoreo de Técnicos (Pestaña Técnicos)](#6-monitoreo-de-técnicos-pestaña-técnicos)
7. [Exportación de Reportes](#7-exportación-de-reportes)
8. [Impresión de Órdenes](#8-impresión-de-órdenes)
9. [Autorización de Órdenes Urgentes](#9-autorización-de-órdenes-urgentes)
10. [Confirmación de Entrega](#10-confirmación-de-entrega)
11. [Historial y Auditoría](#11-historial-y-auditoría)
12. [Diferencias con Superadmin](#12-diferencias-con-superadmin)
13. [Atajos y Consejos](#13-atajos-y-consejos)

---

## 1. Inicio de Sesión

### 1.1 Acceso al sistema

1. Abra su navegador web (Chrome, Firefox o Edge recomendados).
2. Navegue a la URL del sistema BWI TOOLROOM proporcionada por el administrador de TI.
3. Se mostrará la pantalla de inicio de sesión con el logo de BWI y los campos de credenciales.

### 1.2 Credenciales de administrador

| Campo            | Formato                        |
|------------------|--------------------------------|
| No. de empleado  | 5 dígitos numéricos            |
| PIN              | Mínimo 4 dígitos numéricos     |

> **Ejemplo:** No. empleado `33731`, PIN `8472`

### 1.3 Proceso de inicio

1. Ingrese su número de empleado de 5 dígitos en el campo **"Número de empleado"**.
2. Haga clic en **"Continuar"** o presione **Enter**.
3. El sistema verificará que su cuenta exista y esté activa.
4. Si su cuenta requiere PIN (los administradores siempre lo requieren), se mostrará el campo **"PIN"**.
5. Ingrese su PIN de al menos 4 dígitos.
6. Haga clic en **"Entrar"** o presione **Enter**.
7. El sistema validará las credenciales y lo redirigirá al Panel de Administración.

### 1.4 Si olvidó su PIN

- No es posible recuperar el PIN desde esta interfaz.
- Contacte al superadministrador (TOOLING01) para que le asigne un nuevo PIN desde el Panel de Usuarios.
- El superadmin puede restablecer su PIN utilizando la función **"PIN"** (icono de llave) en la columna de Acciones de la tabla de usuarios.

### 1.5 Errores comunes de inicio de sesión

| Error | Causa | Solución |
|-------|-------|----------|
| "Credenciales incorrectas" | Número de empleado o PIN incorrecto | Verifique ambos datos y vuelva a intentar |
| "Usuario no encontrado" | El número de empleado no existe en el sistema | Verifique que sea correcto (5 dígitos numéricos) |
| "Cuenta desactivada" | Su cuenta fue desactivada | Contacte al superadministrador |
| "El número de empleado debe tener exactamente 5 dígitos" | Se ingresó un número con longitud incorrecta | Ingrese exactamente 5 dígitos |

### 1.6 Sesión activa

- La sesión permanecerá activa mientras el navegador esté abierto y en uso.
- La sesión finalizará automáticamente al hacer clic en el botón **"Salir"** o al cerrar el navegador.
- No hay timeout automático por inactividad, pero se recomienda cerrar sesión al abandonar la estación de trabajo.
- Si utiliza una computadora compartida, **siempre** cierre sesión al terminar.

### 1.7 Cerrar sesión

1. Ubique el botón **"Salir"** en la esquina superior derecha del encabezado.
2. Haga clic en **"Salir"**.
3. El sistema eliminará la sesión y regresará a la pantalla de inicio de sesión.
4. Confirme que ha regresado a la pantalla de login antes de abandonar la estación de trabajo.

---

## 2. Panel de Administración — Vista General

Al iniciar sesión, se muestra el **Panel de Administración**, que es la pantalla principal de trabajo del administrador. Desde aquí puede gestionar todas las operaciones del taller Toolroom.

### 2.1 Encabezado (Header)

El encabezado contiene los siguientes elementos de izquierda a derecha:

| Elemento | Descripción |
|----------|-------------|
| Logo BWI | Logotipo de la empresa en el lado izquierdo |
| Título | **"Panel de administración — TOOLROOM"** |
| Nombre de usuario | Nombre completo del administrador actual |
| Botón **"Exportar"** | Genera reportes en formato Excel (ver [Sección 7](#7-exportación-de-reportes)) |
| Botón **"+ Solicitar orden"** | Crea una nueva orden de trabajo (ver [Sección 3.3](#33-crear-orden)) |
| Botón **"Captura manual"** | Registra una orden manual (ver [Sección 3.4](#34-captura-manual)) |
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

Debajo de las tarjetas KPI se encuentran **4 pestañas de navegación** que permiten acceder a las diferentes secciones del sistema:

| Pestaña | Icono | Función |
|---------|-------|---------|
| **Órdenes** | 📋 | Gestión y consulta de órdenes de trabajo |
| **Prioridades** | 🔴 | Vista organizada por nivel de prioridad |
| **Gráficas** | 📊 | Análisis visual con gráficas estadísticas |
| **Técnicos** | 👷 | Monitoreo de desempeño de técnicos |

> **Nota importante:** La pestaña **"Usuarios"** **no está disponible** para el rol de administrador. Esta funcionalidad es exclusiva del superadministrador. Si necesita gestionar usuarios, crear cuentas, o restablecer PINs, contacte al superadmin.

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
- La columna **S.E.T.C.** muestra un indicador de advertencia si el campo está vacío (etiqueta **"⚠ SIN SETC"** en color rojo).
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
| **Fecha solicitud** | Fecha y hora de creación |
| **Solicitante** | Nombre completo del solicitante |
| **Área / Departamento** | Área del solicitante |
| **Pieza** | Nombre de la pieza |
| **S.E.T.C.** | Número SETC (con indicador de advertencia si está vacío) |
| **No. plano** | Número de plano asociado |
| **No. máquina** | Máquina a la que pertenece la pieza |
| **Línea / Celda** | Línea de producción |
| **Cantidad** | Cantidad solicitada |
| **Prioridad** | Nivel de prioridad con etiqueta de color |
| **Estado** | Estado actual de la orden |
| **Técnico(s)** | Nombre(s) del(s) técnico(s) asignado(s) |
| **Material** | Material registrado |
| **Fecha inicio** | Fecha y hora de inicio del trabajo |
| **Fecha término** | Fecha y hora de finalización |
| **Horas totales** | Horas invertidas en total |

**Elementos adicionales en la pestaña Detalle:**

- **Indicador de SETC:** Si la orden no tiene número SETC válido (vacío, "NA", "N/A", o sin exactamente 8 dígitos numéricos), se muestra un aviso llamativo en color rojo indicando que se requiere asignar un SETC.
- **Estado de autorización:** Si la orden es prioridad 1 o 2, se muestra si ya fue autorizada (con nombre y puesto de quien autorizó) o si está pendiente.
- **Descripción:** Texto libre con la descripción detallada de la solicitud.
- **Vista previa del plano:** Si se adjuntó un archivo plano, se muestra una vista previa inline del documento. Los formatos PDF se muestran en un visor embebido; las imágenes se muestran con tamaño completo.

#### 3.2.2 Pestaña "Seguimiento"

Permite gestionar el seguimiento y avance de la orden. Esta es la pestaña más utilizada en la operación diaria:

**Asignación de técnicos:**
- Sección para asignar uno o más técnicos a la orden.
- Haga clic en **"+ Agregar técnico"** para añadir un técnico adicional.
- Seleccione un técnico de la lista desplegable de técnicos disponibles.
- Puede asignar **múltiples técnicos** a una misma orden (soporte multi-técnico).
- Los técnicos asignados se muestran en una lista con opción de eliminación.
- Haga clic en **"✕ Quitar"** para eliminar un técnico de la lista.

**Para cada técnico asignado se registran:**

| Campo | Descripción | Obligatorio |
|-------|-------------|:-----------:|
| **Técnico** | Selección del técnico del catálogo | Sí |
| **Fecha inicio** | Fecha en que comenzó el trabajo | Sí (para avanzar de estado) |
| **Fecha término** | Fecha en que se completó el trabajo | Si hay fecha inicio |
| **Horas reales** | Horas efectivamente trabajadas | Si hay fecha término |

**Selección de material:**
- Campo para registrar el material utilizado en la reparación/fabricación.
- Seleccione el material de la lista de materiales disponibles en el sistema.
- Si el material no está en la lista, seleccione **"Otro…"** y escriba el nombre del material manualmente.
- La selección de material es **obligatoria** antes de guardar el seguimiento.

**Comentarios:**
- Área de texto para agregar comentarios sobre el avance de la orden.
- Los comentarios quedan registrados en el historial con el tipo "comentario".
- Para enviar un comentario, escriba el texto y presione **Enter** o haga clic en el botón **"Comentar"**.

**Total de horas:**
- Se muestra una línea con el **total acumulado de horas** de todos los técnicos asignados.

> **Nota importante:** Los cambios **no se guardan automáticamente**. Debe hacer clic en **"Guardar seguimiento"** para persistir los cambios. El modal **no se cierra** al guardar, lo que le permite seguir trabajando en la misma orden.

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

> **Nota:** Sin autorización, la orden urgente no podrá avanzar al estado "en proceso". El nombre y puesto de quien autoriza **no son el usuario logueado**, sino la persona que dio la autorización (por ejemplo, un gerente o supervisor).

**Confirmación de entrega:**

Para órdenes con estado **"terminada"**, la pestaña Estado muestra un botón de confirmación de entrega:

1. Haga clic en **"¿Entregado?"**.
2. Se mostrará un diálogo de confirmación con las opciones **✓ (Sí)** y **✕ (No)**.
3. Al confirmar con **✓**, la orden se marcará como `entregada: true` y pasará al estado "entregada".
4. El evento de entrega quedará registrado en el historial con el tipo "entrega".

**Comentarios:**

Desde esta pestaña también puede agregar comentarios a la orden:
1. Escriba el comentario en el campo de texto inferior.
2. Presione **Enter** o haga clic en **"Comentar"**.
3. El comentario quedará registrado en el historial.

#### 3.2.4 Pestaña "Historial"

Muestra la **línea de tiempo completa** de eventos de la orden. Cada evento se muestra con:

- **Icono** representativo del tipo de evento
- **Etiqueta del tipo** de evento
- **Fecha y hora** exacta del evento
- **Texto descriptivo** con los detalles del evento
- **Nombre del actor** que realizó la acción

Los eventos son **inmutables** (solo se agregan, nunca se modifican ni eliminan), lo que garantiza un registro de auditoría completo y confiable.

Para más detalles sobre los tipos de eventos, ver [Sección 11](#11-historial-y-auditoría).

**Actualizar historial:**

Si necesita ver eventos recientes, haga clic en el botón **"🔄 Actualizar"** en la parte superior de la pestaña para recargar la línea de tiempo.

### 3.3 Crear Orden

Para crear una nueva orden de trabajo desde el panel de administración:

1. Haga clic en el botón **"+ Solicitar orden"** ubicado en el encabezado.
2. Se desplegará un formulario de creación de orden con los siguientes campos:

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|:-----------:|
| **Pieza** | Texto | Nombre o descripción de la pieza | Sí |
| **S.E.T.C.** | Texto | Número de identificación SETC (8 dígitos numéricos) | No |
| **Plano** | Texto | Número de plano asociado | No |
| **Máquina** | Texto/Selección | Máquina a la que pertenece | No |
| **Línea** | Texto/Selección | Línea de producción | No |
| **Cantidad** | Numérico | Cantidad de piezas solicitadas | Sí |
| **Descripción** | Texto largo | Descripción detallada de la solicitud | Sí |
| **Prioridad** | Selección | Nivel de prioridad (1 a 5) | Sí |
| **Solicitante** | Texto | Nombre de quien solicita | Sí |
| **Área / Departamento** | Texto/Selección | Área del solicitante | Sí |

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

### 3.5 Flujo de estados de una orden

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
                    │  EN PROCESO  │
                    │ en_proceso   │
                    └──────┬───────┘
                           │
                    Fecha de término
                           │
                           ▼
                    ┌──────────────┐
                    │  TERMINADA   │
                    │ terminada    │
                    └──────┬───────┘
                           │
                    Confirmación admin
                           │
                           ▼
                    ┌──────────────┐
                    │  ENTREGADA   │
                    │ entregada    │
                    └──────────────┘
```

| Transición | Requisitos | Quién puede hacerlo |
|------------|------------|----------------------|
| nueva_orden → en_proceso | Fecha inicio + técnico asignado + material | Administrador (Pestaña Seguimiento) |
| en_proceso → terminada | Fecha término + horas reales trabajadas | Administrador (Pestaña Seguimiento) |
| terminada → entregada | Confirmación de entrega con ✓ | Solo Administrador (Pestaña Estado) |

> **Nota:** Las transiciones de estado son **automáticas** al guardar el seguimiento con los campos requeridos. No es necesario cambiar el estado manualmente.

---

## 4. Gestión de Prioridades (Pestaña Prioridades)

La pestaña **Prioridades** organiza las órdenes según su nivel de urgencia, facilitando la identificación y atención de los casos más críticos.

### 4.1 Sub-pestañas de prioridad

Dentro de la pestaña Prioridades, se muestran **6 sub-pestañas** que filtran las órdenes por nivel de prioridad:

| Sub-pestaña | Nivel | Descripción | Badge |
|-------------|:-----:|-------------|:-----:|
| **Todas** | — | Muestra todas las órdenes independientemente de su prioridad | Total |
| **1·Seguridad** | 1 | Órdenes relacionadas con seguridad laboral | Conteo |
| **2·Queja cliente** | 2 | Órdenes por quejas de clientes externos | Conteo |
| **3·Máq. parada** | 3 | Órdenes por máquina parada sin planificar | Conteo |
| **4·Rápido** | 4 | Órdenes de servicio rápido (< 2 horas) | Conteo |
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

### 4.5 Tiempos de respuesta esperados

| Prioridad | Tiempo máximo de inicio | Tiempo máximo de terminación |
|-----------|:-----------------------:|:---------------------------:|
| 1 - Seguridad | Inmediato | < 4 horas |
| 2 - Queja de cliente | < 2 horas | < 24 horas |
| 3 - Máquina parada | < 1 hora | < 8 horas |
| 4 - Trabajo rápido | < 8 horas | < 48 horas |
| 5 - Fabricación | Según agenda | Según complejidad |

---

## 5. Análisis con Gráficas (Pestaña Gráficas)

La pestaña **Gráficas** proporciona una vista analítica y visual del rendimiento del sistema Toolroom. Contiene **3 gráficas** principales:

### 5.1 Órdenes por mes

- **Tipo de gráfica:** Barras apiladas (Stacked Bar Chart)
- **Datos mostrados:** Cantidad de órdenes por mes del año en curso
- **Categorías apiladas:**
  - **Nuevas** — Color diferenciado (azul)
  - **En proceso** — Color diferenciado (amarillo)
  - **Terminadas** — Color diferenciado (verde)
- **Eje X:** Meses del año (Enero a Diciembre)
- **Eje Y:** Cantidad de órdenes

Esta gráfica permite visualizar la tendencia de carga de trabajo a lo largo del año y comparar la distribución de estados por mes.

### 5.2 Órdenes por prioridad

- **Tipo de gráfica:** Pie chart (Gráfica circular)
- **Datos mostrados:** Distribución de órdenes según su nivel de prioridad
- **Segmentos:**
  - Prioridad 1 — Seguridad (Rojo)
  - Prioridad 2 — Queja de cliente (Naranja)
  - Prioridad 3 — Máquina parada (Amarillo)
  - Prioridad 4 — Rápido (Azul)
  - Prioridad 5 — Fabricación (Verde)

Esta gráfica permite identificar rápidamente qué tipo de solicitudes es más frecuente.

### 5.3 Órdenes por técnico

- **Tipo de gráfica:** Barras horizontales (Horizontal Bar Chart)
- **Datos mostrados:** Cantidad de órdenes asignadas a cada técnico
- **Eje Y:** Nombres de los técnicos
- **Eje X:** Cantidad de órdenes

Esta gráfica permite evaluar la distribución de carga de trabajo entre los técnicos del taller.

> **Nota:** Todas las gráficas se actualizan automáticamente al cambiar los datos del sistema. Puede refrescar la información cambiando a otra pestaña y regresando a Gráficas. Si pasa el cursor sobre las gráficas, se mostrará un tooltip con los datos exactos.

---

## 6. Monitoreo de Técnicos (Pestaña Técnicos)

La pestaña **Técnicos** permite al administrador monitorear el desempeño, la productividad y la eficiencia de cada técnico del taller.

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

### 6.5 Cálculo de productividad

| Turno | Horas/día | Horas/semana | Horas/mes |
|-------|:---------:|:------------:|:---------:|
| 1° Turno | 8 hrs | 40 hrs | 160 hrs |
| 2° Turno | 7.5 hrs | 37.5 hrs | 150 hrs |

**Fórmula de aprovechamiento:**

```
Aprovechamiento (%) = (Horas trabajadas / Horas disponibles) × 100
```

---

## 7. Exportación de Reportes

El sistema permite exportar reportes en formato Excel para análisis externo, presentaciones o archivado.

### 7.1 Generar un reporte

1. Haga clic en el botón **"Exportar"** ubicado en el encabezado.
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

### 7.2 Estructura del reporte de Órdenes de trabajo

El archivo Excel de órdenes de trabajo contiene:

- **Hoja 1 — Resumen:** Estadísticas generales (totales por estado, prioridad, período)
- **Hoja 2 — Detalle:** Tabla con **23 columnas** de datos por orden, incluyendo:
  - Folio, Fecha, Solicitante, Empleado, Área, Departamento, Pieza, S.E.T.C., Plano, Máquina, Línea, Cantidad, Descripción, Prioridad, Estado, Técnico(s), Material, Fecha Inicio, Fecha Término, Horas Reales, Comentarios, Orden Manual, Autorizada, Entregada

### 7.3 Estructura del reporte de Desempeño técnicos

El archivo Excel de desempeño contiene:

- **Hoja 1 — Resumen:** Tabla comparativa de todos los técnicos con sus métricas principales:
  - No. Empleado, Nombre, Departamento, Turno
  - Horas Productivas/Día, Horas Disponibles Semana, Horas Disponibles Mes
  - Total Órdenes, Órdenes Terminadas
  - Horas Trabajadas, Promedio Hrs/Orden
  - Aprovechamiento Mensual (%)
- **Hojas adicionales — Detalle por técnico:** Una hoja por cada técnico con su historial de órdenes, horas trabajadas y eficiencia

### 7.4 Descarga

1. Seleccione el tipo de reporte y el rango de fechas.
2. Haga clic en **"Exportar"** o **"Descargar"**.
3. El archivo se generará automáticamente y se descargará a la carpeta de descargas de su navegador.
4. El nombre del archivo incluirá la fecha de generación para fácil identificación.

---

## 8. Impresión de Órdenes

El sistema genera impresiones formales de órdenes de trabajo en el formato estándar de la empresa.

### 8.1 Imprimir desde el detalle de orden

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
| **Autorización** | Nombre y puesto del autorizador (para prioridades 1 y 2) |
| **Técnico(s)** | Nombre(s) del(s) técnico(s) asignado(s) |
| **Fechas** | Fecha de inicio y fecha de término |
| **Horas** | Horas invertidas |
| **Material** | Material utilizado |
| **Comentarios** | Observaciones registradas |
| **Líneas de firma** | Espacios para firmas de: Gerente Tool Room + Conformidad del Solicitante |

5. En la vista previa, haga clic en el botón **"🖨 Imprimir"**.
6. Se abrirá el **diálogo de impresión del navegador** con las opciones de impresión:
   - Seleccione la impresora deseada.
   - Configure orientación (recomendado: vertical), márgenes y escala.
   - Haga clic en **"Imprimir"** para enviar el documento a la impresora.
7. Alternativamente, puede guardar como PDF seleccionando **"Guardar como PDF"** como impresora.

> **Nota:** La vista previa de impresión se abre en una nueva pestaña del navegador. Puede cerrar esa pestaña después de imprimir. El modal del sistema permanecerá abierto.

### 8.2 Imprimir desde la lista de órdenes

También puede imprimir desde el encabezado principal:

1. Haga clic en el botón **"🖨️ Imprimir"** en el encabezado.
2. Se imprimirá la vista actual de la tabla de órdenes.

### 8.3 Configuración recomendada de impresión

| Campo | Valor |
|-------|-------|
| Formulario | F-1100.C.03-02 Rev. 06 |
| Tamaño | Carta (8.5" x 11") |
| Margen | 10mm |
| Orientación | Vertical (Portrait) |

---

## 9. Autorización de Órdenes Urgentes

Las órdenes con **prioridad 1 (Seguridad)** y **prioridad 2 (Queja de cliente)** requieren una autorización formal antes de poder ser trabajadas. Este es un control de calidad y seguridad crítico.

### 9.1 Cuándo se requiere autorización

| Prioridad | Condición | Folio de queja requerido |
|-----------|-----------|:------------------------:|
| 1 — Seguridad | Riesgo inmediato de seguridad laboral | No |
| 2 — Queja de cliente | Reclamo o queja de un cliente externo | Sí (folio_queja) |

### 9.2 Proceso de autorización

1. Identifique una orden urgente en la tabla (prioridad 1 o 2).
   - Las órdenes pendientes de autorización pueden identificarse porque su estado es "nueva_orden" y tienen prioridad 1 o 2.
2. Haga clic en la fila de la orden para abrir su detalle.
3. Navegue a la pestaña **"Estado"**.
4. Si la orden aún no ha sido autorizada, se mostrará el formulario de autorización.

### 9.3 Formulario de autorización

Complete los siguientes campos, todos obligatorios:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre de quien autoriza** | Nombre completo de la persona que autoriza (NO es el usuario logueado) | "Ing. Carlos Méndez" |
| **Puesto** | Cargo o puesto de quien autoriza | "Gerente de Mantenimiento" |
| **Comentario** | Justificación o comentario de la autorización | "Aprobado para reparación inmediata" |

> **Importante:** El nombre que ingresa en "Nombre de quien autoriza" es la persona que le dio la autorización (gerente, supervisor, etc.), no su propio nombre como administrador.

### 9.4 Acciones de autorización

| Botón | Acción | Resultado |
|-------|--------|-----------|
| **✅ Autorizar** | Aprueba la orden | La orden puede avanzar al estado "en proceso". Se registra evento tipo "autorizacion" en el historial. |
| **❌ Rechazar** | Deniega la autorización | La orden no puede ser trabajada. Aparece campo "Motivo de rechazo". Se registra evento tipo "autorizacion" en el historial con resultado de rechazo. |

### 9.5 Registro en historial

Cada autorización (aprobación o rechazo) queda registrada permanentemente en el historial de la orden con:

- Tipo de evento: `autorizacion`
- Fecha y hora exactas
- Nombre de quien autorizó
- Resultado (autorizado / rechazado)
- Comentario proporcionado
- Nombre del administrador que registró la acción

### 9.6 Visualización del estado de autorización

- **En la pestaña Detalle:** Se muestra un recuadro verde con "✅ Autorizada" (o rojo con "❌ Rechazada") indicando nombre y puesto del autorizador.
- **En la pestaña Estado:** Se muestra el formulario o el resultado de la autorización.
- **En la impresión:** Se incluye en el formato BWI oficial con los datos del autorizador.
- **En el historial:** Se muestra el evento de autorización con todos los datos.

---

## 10. Confirmación de Entrega

Una vez que una orden ha sido completada (estado "terminada"), el administrador puede confirmar su entrega al solicitante.

### 10.1 Cuándo entregar una orden

- Solo se puede entregar una orden en estado **"terminada"**.
- La entrega confirma que la pieza fue devuelta físicamente al solicitante.
- Solo el administrador puede confirmar la entrega.

### 10.2 Proceso de confirmación

1. Localice la orden terminada en la tabla.
2. Haga clic en la fila para abrir su detalle.
3. Navegue a la pestaña **"Estado"**.
4. Verá el botón **"¿Entregado?"** disponible para órdenes con estado "terminada".
5. Haga clic en **"¿Entregado?"**.
6. Se mostrará un diálogo de confirmación con las opciones:
   - **✓** — Confirmar entrega
   - **✕** — Cancelar (no entregar aún)

### 10.3 Resultado de la confirmación

Al confirmar con **✓**:

1. La orden se marcará como `entregada: true`.
2. El estado de la orden cambiará a **"entregada"** (visualizado con un badge púrpura).
3. Se registrará un evento de tipo **"entrega"** en el historial con la fecha y hora exactas.
4. La orden aparecerá en el filtro "Entregadas" y en el KPI correspondiente.
5. El modal se cerrará automáticamente.

### 10.4 Deshacer entrega

> **Nota:** Una vez confirmada la entrega, la acción queda registrada permanentemente en el historial. Si se necesita revertir una entrega por error, contacte al superadministrador o utilice el registro en el historial como referencia para ajustes manuales en la base de datos.

### 10.5 Órdenes ya entregadas

Si una orden ya fue entregada, en la pestaña **"Estado"** se mostrará un mensaje de confirmación:

> **✅ Trabajo entregado**

Este mensaje indica que la entrega ya fue procesada y no requiere acción adicional.

---

## 11. Historial y Auditoría

Cada orden de trabajo en el sistema cuenta con un **registro de historial completo e inmutable** que documenta cada evento desde su creación hasta su entrega.

### 11.1 Tipos de eventos

El sistema registra **9 tipos de eventos**:

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

### 11.2 Detalle de cada evento

Cada registro del historial muestra:

- **Icono** representativo del tipo de evento
- **Etiqueta del tipo** de evento (ej: "Asignación", "Autorización")
- **Fecha y hora** exacta del evento (formato: DD/MM/YYYY HH:MM)
- **Texto descriptivo** con los detalles específicos del evento
- **Nombre del actor** que realizó la acción (ej: nombre del técnico, nombre del admin)

### 11.3 Propiedades del historial

- **Inmutabilidad:** Los eventos son append-only. Una vez registrado, un evento nunca puede ser modificado ni eliminado.
- **Orden cronológico:** Los eventos se muestran en orden cronológico, del más reciente al más antiguo.
- **Registro completo:** Cada interacción con la orden queda documentada.
- **Auditoría:** El historial cumple con los requisitos de trazabilidad y auditoría del sistema de gestión de calidad.

### 11.4 Uso del historial

El historial es útil para:

- **Cumplimiento normativo:** Verificar que se siguieron los procesos establecidos.
- **Resolución de problemas:** Investigar por qué una orden tiene un estado particular.
- **Rendimiento:** Analizar el tiempo entre eventos (ej: tiempo entre asignación e inicio).
- **Responsabilidad:** Identificar quién realizó cada acción y cuándo.
- **Capacitación:** Enseñar a nuevos usuarios el flujo correcto de trabajo.
- **Disputas:** Contar con un registro completo y verificable en caso de discrepancias.

---

## 12. Diferencias con Superadmin

El rol de **Administrador** tiene acceso prácticamente completo al sistema, con una diferencia principal respecto al superadministrador:

### 12.1 Acceso a pestañas

| Pestaña | Superadmin | Administrador |
|---------|:----------:|:-------------:|
| Órdenes | ✅ | ✅ |
| Prioridades | ✅ | ✅ |
| Gráficas | ✅ | ✅ |
| Técnicos | ✅ | ✅ |
| **Usuarios** | ✅ | **❌** |

### 12.2 Funcionalidades restringidas

| Funcionalidad | Superadmin | Administrador |
|---------------|:----------:|:-------------:|
| Crear órdenes | ✅ | ✅ |
| Captura manual | ✅ | ✅ |
| Asignar técnicos | ✅ | ✅ |
| Autorizar órdenes (prioridad 1-2) | ✅ | ✅ |
| Confirmar entrega | ✅ | ✅ |
| Ver historial | ✅ | ✅ |
| Exportar reportes | ✅ | ✅ |
| Imprimir órdenes | ✅ | ✅ |
| Monitorear técnicos | ✅ | ✅ |
| Ver gráficas | ✅ | ✅ |
| **Crear usuarios** | ✅ | **❌** |
| **Editar usuarios** | ✅ | **❌** |
| **Desactivar usuarios** | ✅ | **❌** |
| **Restablecer PINs** | ✅ | **❌** |
| **Acceder al Panel de Usuarios** | ✅ | **❌** |

### 12.3 ¿Qué hacer si necesita una funcionalidad restringida?

Si necesita crear un usuario nuevo, editar un usuario existente, desactivar una cuenta, o restablecer un PIN:

1. Contacte al superadministrador (TOOLING01) directamente.
2. Proporcione la información necesaria (nombre, número de empleado, rol, área, turno).
3. El superadministrador realizará la gestión desde el Panel de Usuarios.

> **Nota:** Esta separación de funciones es intencional y forma parte del diseño de seguridad del sistema. El administrador tiene acceso completo a las operaciones del taller, mientras que la gestión de cuentas de usuario queda reservada para el superadministrador.

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
| **Cambiar de pestaña** | Haga clic en la pestaña deseada (animación de transición) |
| **Navegar filtros** | Haga clic en las pastillas de filtro |
| **Recargar página (limpiar caché)** | **Ctrl + Shift + R** |

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
| **Badge púrpura "Entregada"** | Orden confirmada como entregada al solicitante |
| **Recuadro rojo SETC** | Orden sin número SETC válido — requiere atención |

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

### 13.4 Flujo de trabajo recomendado para el administrador

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

### 13.5 Problemas comunes y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| No puedo iniciar sesión | PIN incorrecto o cuenta desactivada | Verifique credenciales; contacte al superadmin |
| No puedo guardar el seguimiento | Faltan campos obligatorios | Verifique: al menos 1 técnico, material seleccionado, horas si hay fecha término |
| La orden no cambia de estado | No se guardó el seguimiento | Haga clic en "Guardar seguimiento" después de poner fechas |
| El SETC aparece como inválido | No tiene 8 dígitos numéricos | Verifique el formato; si no aplica, deje vacío |
| El plano no se muestra | Formato no soportado o error de carga | Verifique formato (PDF, JPG, PNG); recargue la página |
| No puedo cerrar el modal | — | Presione Escape o haga clic fuera del modal |
| Las gráficas no muestran datos | No hay órdenes en el sistema | Verifique que existan órdenes registradas |
| No puedo exportar reportes | No hay datos en el rango seleccionado | Intente sin filtro de fechas |

---

## Información de contacto

Para soporte técnico o dudas sobre el sistema BWI TOOLROOM v5.0, contacte al superadministrador o al equipo de desarrollo.

---

*Documento generado para BWI TOOLROOM v5.0 — Rol Administrador*
*Formato de referencia: F-1100.C.03-02 Rev. 06*
