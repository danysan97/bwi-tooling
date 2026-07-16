# MANUAL DE USUARIO — SOLICITANTE

## BWI TOOLROOM v5.0

> **Rol:** Solicitante
> **Alcance:** Creación de órdenes de trabajo y consulta del estado de las propias órdenes
> **Documento de referencia:** F-1100.C.03-02 Rev. 06

---

## Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Portal de Órdenes — Mis Órdenes](#2-portal-de-órdenes--mis-órdenes)
3. [Detalle de Orden (Modal)](#3-detalle-de-orden-modal)
4. [Crear Nueva Orden](#4-crear-nueva-orden)
5. [Primer Uso — Actualizar Perfil](#5-primer-uso--actualizar-perfil)
6. [Entender los Estados](#6-entender-los-estados)
7. [Entender las Prioridades](#7-entender-las-prioridades)
8. [Impresión de Órdenes](#8-impresión-de-órdenes)
9. [Preguntas Frecuentes](#9-preguntas-frecuentes)
10. [Problemas Comunes y Soluciones](#10-problemas-comunes-y-soluciones)

---

## 1. Inicio de Sesión

### 1.1 Acceso al sistema

1. Abra su navegador web (Chrome, Firefox o Edge recomendados).
2. Navegue a la URL del sistema BWI TOOLROOM proporcionada por el departamento de Toolroom.
3. Se mostrará la pantalla de inicio de sesión con el logo de BWI y el campo de credenciales.

### 1.2 Credenciales de solicitante

| Campo            | Formato                  |
|------------------|--------------------------|
| No. de empleado  | 5 dígitos numéricos      |

> **Importante:** Los solicitantes **NO requieren PIN** de acceso. Solo necesita su número de empleado de 5 dígitos.

> **Ejemplo:** No. empleado `33731`

### 1.3 Proceso de inicio

1. Ingrese su número de empleado de 5 dígitos en el campo **"Número de empleado"**.
2. Haga clic en **"Continuar"** o presione **Enter**.
3. El sistema verificará que su cuenta exista y esté activa.
4. Como solicitante, el sistema **no le solicitará PIN**. Será redirigido directamente al **Portal de Órdenes**.

### 1.4 Si su número de empleado no es reconocido

Si el sistema muestra el mensaje **"No se pudo registrar"** o **"Usuario no encontrado":

- Verifique que está ingresando exactamente **5 dígitos numéricos**.
- Confirme que su número de empleado es correcto (consulte con su supervisor o Recursos Humanos).
- Si el número es correcto pero no funciona, contacte al **departamento de Toolroom** para que verifiquen que su empleado está registrado en el sistema.

### 1.5 Errores comunes de inicio de sesión

| Error | Causa | Solución |
|-------|-------|----------|
| "No se pudo registrar" | El número de empleado no existe en el sistema | Verifique que sea correcto (5 dígitos numéricos). Contacte a Toolroom si persiste. |
| "El número de empleado debe tener exactamente 5 dígitos" | Se ingresó un número con longitud incorrecta | Ingrese exactamente 5 dígitos numéricos |
| "Error de conexión" | Problema de red o del servidor | Verifique su conexión a internet e intente de nuevo |

### 1.6 Sesión activa

- La sesión permanecerá activa mientras el navegador esté abierto y en uso.
- La sesión finalizará automáticamente al hacer clic en el botón **"Salir"** o al cerrar el navegador.
- No hay timeout automático por inactividad, pero se recomienda cerrar sesión al abandonar la estación de trabajo.
- **Si utiliza una computadora compartida, SIEMPRE cierre sesión al terminar** para que otros usuarios puedan usarla con sus propias credenciales.

### 1.7 Cerrar sesión

1. Ubique el botón **"Salir"** en la esquina superior derecha del encabezado.
2. Haga clic en **"Salir"**.
3. El sistema eliminará la sesión y regresará a la pantalla de inicio de sesión.
4. Confirme que ha regresado a la pantalla de login antes de abandonar la estación de trabajo.

---

## 2. Portal de Órdenes — Mis Órdenes

Al iniciar sesión, se muestra el **Portal de Órdenes**, que es la pantalla principal del solicitante. Desde aquí puede ver todas las órdenes de trabajo que usted ha creado y crear nuevas solicitudes.

> **Su rol en el sistema:** Como solicitante, usted puede **crear órdenes de trabajo** y **ver el estado de sus propias órdenes**. No tiene acceso a asignar técnicos, autorizar trabajos, gestionar usuarios ni otras funciones administrativas. Su interfaz está diseñada para ser simple y directa: solicitar y dar seguimiento.

### 2.1 Encabezado (Header)

El encabezado contiene los siguientes elementos de izquierda a derecha:

| Elemento | Descripción |
|----------|-------------|
| Logo BWI | Logotipo de la empresa en el lado izquierdo |
| Título | **"Portal de Órdenes"** |
| Subtítulo | **"Solicitante — TOOLROOM"** |
| Nombre de usuario | Su nombre completo junto con su número de empleado (ej: `Juan Pérez · 33731`) |
| Botón **🔄 Actualizar** | Recarga la lista de órdenes para mostrar información actualizada |
| Botón **"+ Nueva orden"** | Abre el formulario para crear una nueva orden de trabajo (ver [Sección 4](#4-crear-nueva-orden)) |
| Botón **"Salir"** | Cierra la sesión y regresa a la pantalla de login |

### 2.2 Lista de órdenes — Vista de tarjetas

Debajo del encabezado se muestra la sección **"Mis órdenes"**, que presenta todas las órdenes de trabajo que usted ha creado, organizadas en **tarjetas individuales** (no en tabla). Las órdenes se muestran ordenadas de la más reciente a la más antigua.

**Cuando no tiene órdenes:**

Se mostrará el mensaje: *"Aún no tienes órdenes. ¡Crea la primera!"*

### 2.3 Contenido de cada tarjeta

Cada tarjeta de orden muestra la siguiente información:

| Elemento | Descripción |
|----------|-------------|
| **Folio** | Número de folio único de la orden, en color azul (ej: `#1234`) |
| **Badge de prioridad** | Etiqueta con color que indica el nivel de prioridad (ver [Sección 7](#7-entender-las-prioridades)) |
| **Nombre de la pieza** | Nombre o descripción de la pieza solicitada, en texto blanco y negrita |
| **Fecha** | Fecha de creación de la orden (formato: YYYY-MM-DD) |
| **Técnico asignado** | Nombre del técnico asignado, o el texto **"Pendiente"** si aún no se ha asignado |
| **Badge de estado** | Etiqueta con color que indica el estado actual de la orden (ver [Sección 6](#6-entender-los-estados)) |

### 2.4 Interacción con las tarjetas

- **Haga clic en cualquier tarjeta** para abrir el **Detalle de Orden** en un modal (ventana emergente) con toda la información completa.
- Al pasar el cursor sobre una tarjeta, el borde se resaltará en color azul para indicar que es seleccionable.

### 2.5 Actualizar la lista

Si ha creado una orden recientemente o desea verificar el estado más actualizado:

1. Haga clic en el botón **🔄 Actualizar** en el encabezado.
2. La lista se recargará con la información más reciente del sistema.

> **Consejo:** Si acaba de enviar una orden y no aparece inmediatamente, haga clic en **Actualizar** para refrescar la vista.

---

## 3. Detalle de Orden (Modal)

Al hacer clic en una tarjeta de orden, se abre un **modal (ventana emergente)** que muestra el detalle completo de la orden seleccionada. Este modal contiene toda la información de su solicitud, incluyendo su historial de eventos.

### 3.1 Encabezado del modal

En la parte superior del modal se muestra:

- **Número de folio** (ej: `ORDEN #1234`)
- **Nombre de la pieza** en texto grande y negrita
- Botón **"✕"** para cerrar el modal

### 3.2 Badges de estado y prioridad

Inmediatamente debajo del encabezado se muestran dos badges:

| Badge | Descripción |
|-------|-------------|
| **Estado** | Indica el estado actual de la orden (Nueva, En proceso, Terminada, Entregada o Cancelada) |
| **Prioridad** | Indica el nivel de prioridad asignado (Seguridad, Queja, Máq. parada, Rápido o Fabricación) |

### 3.3 Botón de impresión

| Botón | Acción |
|-------|--------|
| **"🖨️ Imprimir"** | Abre una nueva pestaña del navegador con la vista previa de impresión de la orden (ver [Sección 8](#8-impresión-de-órdenes)) |

### 3.4 Cuadrícula de información

El detalle de la orden se presenta en una **cuadrícula de dos columnas** con los siguientes campos:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Fecha solicitud** | Fecha en que se creó la orden | 2026-07-15 |
| **Técnico** | Nombre del técnico asignado, o **"Sin asignar"** si aún no se ha asignado | Carlos Méndez |
| **Área** | Área del solicitante (si fue registrada) | 1414 · MANTENIMIENTO PLANTA |
| **Departamento** | Departamento del solicitante | Producción |
| **Línea / Celda** | Línea de producción o celda de manufactura (si fue indicada) | Línea 3 |
| **S.E.T.C. #** | Número de identificación SETC de la pieza (si fue proporcionado) | 30407982 |
| **No. plano** | Número de plano asociado a la pieza (si fue proporcionado) | M-0015-12-D07 |
| **No. máquina** | Número de máquina, fixtura o equipo al que pertenece la pieza | MB0137 |
| **Cantidad** | Cantidad de piezas solicitadas | 2 |
| **Material** | Material registrado por el técnico (si ya fue trabajada) | Acero 4140 |
| **Fecha inicio** | Fecha en que el técnico comenzó a trabajar (si fue registrada) | 2026-07-15 |
| **Fecha término** | Fecha en que el técnico finalizó el trabajo (si fue registrada) | 2026-07-16 |
| **Tiempo real** | Horas totales invertidas en el trabajo (si fueron registradas) | 6.5 hrs |

**Campo de descripción:**

Debajo de la cuadrícula se muestra el campo **"Descripción"** a ancho completo, con el texto detallado del trabajo que usted solicitó.

### 3.5 Vista previa del plano

Si usted adjuntó un archivo plano u otro documento al crear la orden, se muestra una **vista previa** del archivo al final de la información:

- **Archivos PDF:** Se muestran en un visor embebido dentro del modal.
- **Imágenes (JPG):** Se muestran con tamaño completo.
- Puede hacer clic en la imagen para abrirla en tamaño completo en una nueva pestaña.

### 3.6 Historial de eventos (Línea de tiempo)

En la parte inferior del modal se muestra la sección **"Historial"**, que presenta una **línea de tiempo cronológica** de todos los eventos que han ocurrido con su orden desde su creación hasta el momento actual.

Cada evento se muestra como una tarjeta con:

- **Icono** representativo del tipo de evento
- **Etiqueta** del tipo de evento (ej: "Recepción", "Asignación")
- **Fecha y hora** exacta del evento
- **Texto descriptivo** con los detalles del evento

**Tipos de eventos que puede ver:**

| Icono | Tipo de evento | Descripción |
|-------|----------------|-------------|
| 📥 | Recepción | Su orden fue recibida y registrada en el sistema |
| 👤 | Asignación | Un técnico fue asignado a su orden |
| 🔧 | Inicio | El técnico comenzó a trabajar en su orden |
| 💬 | Comentario | Se agregó un comentario a la orden |
| 📋 | Autorización | Su orden fue autorizada (para prioridades 1 y 2) |
| 🔄 | Cambio de estado | El estado de la orden fue modificado |
| 🔩 | Material | Se registró el material utilizado en el trabajo |
| ✅ | Terminado | El técnico finalizó el trabajo |
| 📦 | Entrega | Su orden fue marcada como entregada |

> **Nota:** Si no hay eventos registrados, se muestra el mensaje: *"Sin eventos registrados."*

> **Importante:** Los eventos del historial son permanentes y no pueden ser modificados ni eliminados. Esto garantiza un registro completo y confiable de todo lo que ha ocurrido con su orden.

### 3.7 Cerrar el modal

Para cerrar el detalle de la orden:

- Haga clic en el botón **"✕"** en la esquina superior derecha del modal.
- O presione la tecla **Escape** en su teclado.
- O haga clic en cualquier área fuera del modal (en el fondo oscuro).

---

## 4. Crear Nueva Orden

### 4.1 Acceso

Para crear una nueva orden de trabajo:

1. Haga clic en el botón **"+ Nueva orden"** ubicado en el encabezado del Portal de Órdenes.
2. Se mostrará el formulario de creación de orden con el título **"Nueva Orden de Trabajo"**.

También puede regresar al formulario en cualquier momento haciendo clic en el botón **"← Volver"**.

### 4.2 Estructura del formulario

El formulario está organizado en **4 secciones** principales. Complete todas las secciones antes de enviar.

---

### 4.3 Sección: Tus Datos

Esta sección contiene su información personal y de ubicación. Algunos campos se completan automáticamente con los datos de su cuenta registrada.

#### Campos de esta sección:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| **Nombre completo** | Texto | **Sí** | Su nombre completo. Se precarga con el nombre registrado en el sistema. Si es la primera vez que usa el sistema y su nombre aparece como "Empleado" seguido de un número, deberá ingresarlo manualmente (ver [Sección 5](#5-primer-uso--actualizar-perfil)). |
| **No. empleado** | Texto (bloqueado) | — | Su número de empleado. Se muestra automáticamente y **no es editable**. |
| **Área** | Lista desplegable | No | Seleccione su área de trabajo de la lista. Si no selecciona un área, el sistema registrará la orden igualmente. |
| **Departamento** | Texto | **Sí** | Nombre de su departamento (ej: "Producción", "Calidad", "Mantenimiento"). |
| **Línea / Celda** | Texto | No | Línea de producción o celda de manufactura donde trabaja (ej: "Línea 3", "Celda 10", "Shooter"). Es opcional pero ayuda al taller a ubicar la pieza. |

#### Áreas disponibles en el sistema:

| Código | Nombre del área |
|:------:|-----------------|
| 1401 | IAMM/FRHC SALARY INDIRECT |
| 1403 | MRD/MRF SALARY INDIRECT |
| 1407 | RTA (MR/PASIVE/BMW) SALARY INDIRECT |
| 1410 | BI-STATE SALARY INDIRECT |
| 1411 | INGENIERIA AMBIENTAL |
| 1414 | MANTENIMIENTO PLANTA |
| 1415 | TALLER MÁQUINAS Y HERRAMIENTAS |
| 1421 | PASIVE TT/BMW SALARY INDIRECT |
| 1440 | INGENIERÍA |
| 1441 | NUEVOS PROYECTOS |
| 1601 | RECURSOS HUMANOS |

> **Consejo:** Si su área no aparece en la lista, contacte al administrador del sistema para que la agregue.

---

### 4.4 Sección: Datos de la Pieza

Esta sección contiene la información técnica de la pieza que necesita.

#### Campos de esta sección:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| **Nombre completo de la pieza** | Texto | **Sí** | Nombre o descripción de la pieza. **Sea lo más específico posible.** Ejemplo: "Engrane de sección A para prensa #3" en lugar de solo "Engrane". |
| **S.E.T.C. #** | Texto | No | Número de identificación SETC de la pieza (formato: 8 dígitos numéricos, ej: `30407982`). Si no lo tiene, puede dejarlo vacío; la orden se procesará igualmente pero se mostrará una advertencia. |
| **Cantidad** | Numérico | **Sí** | Cantidad de piezas que necesita. Debe ser un número entero mayor a 0. |
| **No. plano** | Texto | No | Número de plano asociado a la pieza (ej: `M-0015-12-D07`). Si no lo tiene, puede dejarlo vacío. |
| **No. máquina / Fixtura / Equipment** | Texto | No | Número de máquina, fixtura o equipo al que pertenece la pieza (ej: `MB0137`). Ayuda al taller a identificar el contexto de la pieza. |

> **Consejo sobre el nombre de la pieza:** Un nombre descriptivo y específico ayuda al taller a entender rápidamente qué necesita. Incluya la sección, el tipo de pieza y la máquina o equipo de ser posible.
>
> - **Bueno:** "Buje de mesa para celda 5 — sección de prensado"
> - **Bueno:** "Perno de sujeción M12 x 80mm para fixtura FT-201"
> - **No ideal:** "Buje"
> - **No ideal:** "Perno"

---

### 4.5 Sección: Descripción del Trabajo

Esta sección es donde usted explica detalladamente qué necesita.

#### Campos de esta sección:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| **Descripción detallada** | Texto largo | **Sí** | Explique con todo el detalle posible qué trabajo necesita realizarse. Incluya dimensiones, tolerancias, materiales específicos, acabados, referencias y cualquier otra información relevante. |
| **Plano / Archivo adjunto** | Archivo | No | Arrastre un archivo al área indicada o haga clic para seleccionarlo desde su equipo. |

#### Sobre la descripción detallada

Esta es una de las partes más importantes de su solicitud. Cuanta más proporcione, mejor podrá el taller atender su necesidad. Incluya:

- **Qué se necesita hacer:** Fabricación, reparación, modificación, ajuste, etc.
- **Dimensiones y especificaciones:** Medidas, tolerancias, acabados superficiales.
- **Material requerido:** Si conoce el tipo de material específico, mencionelo.
- **Referencias técnicas:** Números de plano, normas aplicables, especificaciones del cliente.
- **Urgencia o contexto:** Si la pieza es para una máquina parada, una línea específica, un cliente determinado, etc.

> **Ejemplo de buena descripción:**
>
> *"Se requiere fabricar un buje de acero 4140, diámetro exterior 50mm, diámetro interior 30mm, largo 80mm, con acabado mecanizado a tolerancia de ±0.02mm. La pieza es de reemplazo para la prensa MB0137 de la Línea 3. Se requiere 2 unidades. El plano de referencia es M-0015-12-D07."*

#### Sobre el archivo adjunto

| Característica | Detalle |
|----------------|---------|
| **Formatos aceptados** | PDF, DWG, DXF, Word (.doc, .docx), JPG |
| **Tamaño máximo** | 20 MB |
| **Método de carga** | Arrastre el archivo al área punteada, o haga clic en el área para seleccionarlo desde su equipo |

**Proceso para adjuntar un archivo:**

1. Haga clic en el área que dice **"Adjuntar plano o documento"** (o arrastre el archivo directamente).
2. Seleccione el archivo desde su computadora.
3. El nombre del archivo aparecerá en verde con un icono de confirmación (✅).
4. Si desea cambiar el archivo, haga clic en el nombre del archivo actual y seleccione uno nuevo.

> **Consejo:** Adjuntar planos, esquemas o fotografías ayuda enormemente al taller a entender sus requisitos. Si tiene un documento técnico que describe la pieza, adjúntelo.

---

### 4.6 Sección: Prioridad

Seleccione **una sola** prioridad para su orden. La prioridad indica la urgencia y el tipo de solicitud.

#### Opciones de prioridad:

| Prioridad | Etiqueta | Color | Descripción | ¿Requiere autorización? |
|:---------:|----------|:-----:|-------------|:------------------------:|
| **1** | 1 — Seguridad | 🔴 Rojo | Riesgo inmediato de seguridad laboral. Requiere acción inmediata. **Debe incluir justificación.** | **Sí** |
| **2** | 2 — Queja de cliente | 🟡 Amarillo | Queja o reclamo de un cliente externo. Riesgo a la calidad. **Debe incluir justificación.** | **Sí** |
| **3** | 3 — Máquina parada | 🟠 Naranja | Máquina detenida sin planificar, producción detenida. | No |
| **4** | 4 — Trabajo rápido | 🔵 Azul | Trabajo de corta duración (menos de 2 horas estimadas). | No |
| **5** | 5 — Fabricación | ⚪ Gris | Fabricación estándar sin urgencia particular. Se enviará a proveedor externo. | No |

**Para seleccionar una prioridad:**

1. Haga clic en la opción deseada.
2. La opción seleccionada se resaltará con su color correspondiente y mostrará un punto de selección.
3. Si selecciona prioridad **1 (Seguridad)** o **2 (Queja de cliente)**, aparecerá un aviso amarillo indicando que la orden requiere autorización de Gerencia de Mantenimiento antes de poder ser trabajada.

> **Aviso importante para prioridades 1 y 2:** Las órdenes con estas prioridades requieren una **autorización formal** de un gerente o supervisor antes de que el taller pueda iniciar el trabajo. Asegúrese de incluir una justificación clara en la descripción del trabajo.

---

### 4.7 Envío de la orden

Una vez que haya completado todos los campos obligatorios:

1. Haga clic en el botón **"Enviar orden de trabajo →"**.
2. El sistema validará que todos los campos obligatorios estén completos.
3. Si faltan campos obligatorios, se resaltarán en rojo los campos que deben completarse.
4. Si todo está correcto, la orden se enviará y verá una pantalla de confirmación.

**Mientras se envía:**

- El botón mostrará el texto **"Enviando…"** y quedará deshabilitado para evitar envíos duplicados.
- Espere a que el proceso termine; no cierre ni navegue fuera de la página.

### 4.8 Pantalla de confirmación

Al enviar exitosamente su orden, se mostrará una pantalla de confirmación con:

- Un icono de confirmación (✅)
- El mensaje **"¡Orden enviada!"**
- La leyenda **"Tu orden fue registrada en BWI TOOLROOM."**
- Su **número de folio asignado** en tamaño grande y color azul (ej: `#1234`)
- Un botón **"Ver mis órdenes"** para regresar a la lista de sus órdenes

> **Guarde su número de folio.** Lo necesitará para dar seguimiento a su solicitud y para comunicarse con el departamento de Toolroom.

### 4.9 Después del envío

Una vez enviada, su orden entrará al sistema con el estado **"Nueva"** y quedará en la cola de trabajo del taller. El flujo típico es:

```
Usted envía la orden (estado: Nueva)
    ↓
El taller asigna un técnico
    ↓
El técnico comienza a trabajar (estado: En proceso)
    ↓
El técnico finaliza el trabajo (estado: Terminada)
    ↓
El taller entrega la pieza (estado: Entregada)
```

Usted puede verificar el estado de su orden en cualquier momento desde la vista **"Mis Órdenes"**.

---

## 5. Primer Uso — Actualizar Perfil

Si esta es la **primera vez** que usa el sistema y su nombre aparece como **"Empleado"** seguido de un número (por ejemplo, "Empleado 33731"), significa que su perfil aún no está completo.

### 5.1 Prompt de primera vez

Al abrir el formulario de nueva orden, se mostrará un aviso azul:

> 👋 **Primera orden — completa tu nombre y área antes de continuar.**

### 5.2 Campos a completar

| Campo | Acción |
|-------|--------|
| **Nombre completo** | Ingrese su nombre completo real (ej: "Juan Pérez López"). Este campo estará habilitado para edición solo la primera vez. |
| **Área** | Seleccione su área de trabajo de la lista desplegable. |
| **Departamento** | Ingrese el nombre de su departamento. |

### 5.3 Guardado automático

Una vez que ingrese su nombre completo y envíe la orden, el sistema **actualizará automáticamente** su perfil con la información proporcionada. Esta acción solo se realiza **una vez**. En futuras órdenes, su nombre ya aparecerá correctamente y el campo no será editable.

> **Nota:** Si necesita cambiar su nombre o área después de haber completado el perfil, contacte al administrador del sistema.

---

## 6. Entender los Estados

Cada orden de trabajo pasa por diferentes estados a lo largo de su ciclo de vida. Los estados se indican con **badges de color** que le permiten identificar rápidamente la situación de su orden.

### 6.1 Estados disponibles

| Estado | Badge | Color | Significado |
|--------|:-----:|:-----:|-------------|
| **Nueva** | `Nueva` | 🔵 Azul | Su orden fue recibida por el sistema y está esperando ser asignada a un técnico. Es el estado inicial de toda orden. |
| **En proceso** | `En proceso` | 🟡 Amarillo | Un técnico ya fue asignado y está trabajando activamente en su solicitud. |
| **Terminada** | `Terminada` | 🟢 Verde | El técnico ha finalizado el trabajo. La pieza está lista para ser entregada. |
| **Entregada** | `Entregada` | 🟣 Púrpura | La pieza le fue entregada físicamente. El ciclo de la orden está completo. |
| **Cancelada** | `Cancelada` | ⚪ Gris | La orden fue cancelada y no será procesada. |

### 6.2 Flujo de estados

```
┌──────────┐     Asignación de técnico     ┌──────────────┐
│  NUEVA   │ ────────────────────────────► │  EN PROCESO  │
│ (Azul)   │                               │  (Amarillo)  │
└──────────┘                               └──────┬───────┘
                                                  │
                                          Trabajo finalizado
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │  TERMINADA   │
                                           │   (Verde)    │
                                           └──────┬───────┘
                                                  │
                                          Entrega física
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │  ENTREGADA   │
                                           │  (Púrpura)   │
                                           └──────────────┘
```

### 6.3 ¿Quién cambia el estado?

| Transición | Quién la realiza |
|------------|------------------|
| Nueva → En proceso | El taller (al asignar un técnico y registrar fecha de inicio) |
| En proceso → Terminada | El técnico (al registrar fecha de término y horas trabajadas) |
| Terminada → Entregada | El taller (al confirmar la entrega física de la pieza) |
| Cualquier estado → Cancelada | El taller (en caso de cancelación) |

> **Nota:** Usted **no tiene control directo** sobre los cambios de estado. Los estados se actualizan automáticamente a medida que el taller procesa su solicitud. Para consultas sobre el avance, contacte al departamento de Toolroom.

---

## 7. Entender las Prioridades

La prioridad que usted asigna al crear una orden determina la **urgencia** y el **orden de atención** en el taller. Elija la prioridad con responsabilidad.

### 7.1 Tabla de prioridades

| Prioridad | Nombre | Color | Cuándo usarla | Requiere autorización |
|:---------:|--------|:-----:|---------------|:---------------------:|
| **1** | Seguridad | 🔴 Rojo | Existe un riesgo inmediato de seguridad laboral que requiere atención urgente. Ejemplo: pieza dañada que puede causar accidente. | **Sí** |
| **2** | Queja de cliente | 🟡 Amarillo | Un cliente externo ha presentado una queja o reclamo relacionado con la calidad de una pieza. Ejemplo: pieza que no cumple especificaciones y el cliente exige corrección inmediata. | **Sí** |
| **3** | Máquina parada | 🟠 Naranja | Una máquina o equipo está detenido por falta de una pieza, deteniendo la producción. Ejemplo: prensa parada porque se rompió un buje. | No |
| **4** | Trabajo rápido | 🔵 Azul | Es un trabajo sencillo que el taller puede resolver en menos de 2 horas. Ejemplo: fabricar un perno estándar, ajustar una medida simple. | No |
| **5** | Fabricación | ⚪ Gris | Es una solicitud estándar de fabricación o reparación sin urgencia particular. Se puede programar según la carga de trabajo del taller. | No |

### 7.2 Recomendaciones para elegir prioridad

- **Prioridad 1:** Úsela **solo** para situaciones de seguridad genuina. El uso excesivo de prioridad 1 desvía recursos de otros trabajos importantes.
- **Prioridad 2:** Úsela cuando exista una queja documentada de un cliente. Incluya el número de queja en la descripción si lo tiene.
- **Prioridad 3:** Es la opción más apropiada cuando una máquina está detenida y necesita atención rápida.
- **Prioridad 4:** Úsela para trabajos que sabe que son rápidos y sencillos.
- **Prioridad 5:** Es la opción predeterminada para la mayoría de las solicitudes de fabricación y reparación programada.

### 7.3 Sobre la autorización para prioridades 1 y 2

Si selecciona prioridad 1 o 2:

1. Aparecerá un aviso amarillo en el formulario indicando que se requiere autorización.
2. Su orden quedará registrada en el sistema con estado **"Nueva"**.
3. **Antes de que el taller pueda iniciar el trabajo**, un administrador deberá autorizar la orden formalmente.
4. La autorización incluye el nombre y puesto de la persona que autoriza (gerente, supervisor, etc.).
5. Si la orden es rechazada, recibirá notificación a través del estado de la orden.

> **Nota:** La autorización es un control de calidad y seguridad. No es un obstáculo; es una garantía de que las situaciones críticas se atienden con la aprobación correspondiente.

---

## 8. Impresión de Órdenes

El sistema le permite imprimir una copia formal de cualquier orden de trabajo que haya creado.

### 8.1 Proceso de impresión

1. Abra el detalle de una orden haciendo clic en su tarjeta desde **"Mis Órdenes"**.
2. Haga clic en el botón **"🖨️ Imprimir"** ubicado en la parte superior del modal.
3. Se abrirá una **nueva pestaña del navegador** con la vista previa de impresión.
4. En la nueva pestaña, haga clic en el botón **"🖨 Imprimir"**.
5. Se abrirá el **diálogo de impresión del navegador**.
6. Seleccione la impresora deseada.
7. Configure la orientación (recomendado: vertical) y los márgenes.
8. Haga clic en **"Imprimir"** para enviar el documento a la impresora.

### 8.2 Contenido del formato de impresión

El formato de impresión incluye:

| Sección | Contenido |
|---------|-----------|
| **Encabezado** | Logo de BWI, título "ORDEN DE TRABAJO PARA TALLER", número de formato y revisión |
| **Datos del solicitante** | Su nombre, número de empleado, área, departamento |
| **Datos generales** | Fecha de solicitud, prioridad |
| **Datos de la pieza** | Nombre, SETC, número de plano, cantidad |
| **Máquina y línea** | Número de máquina/fixtura/equipo, línea/celda |
| **Descripción** | Descripción detallada del trabajo solicitado |
| **Avance del técnico** | Fecha inicio, fecha término, horas totales, nombre del técnico |
| **Material** | Material utilizado (si ya fue trabajada) |
| **Estado** | Estado actual de la orden |
| **Comentarios** | Observaciones registradas |
| **Líneas de firma** | Espacios para firmas de: Gerente Tool Room + Conformidad del Solicitante |

### 8.3 Guardar como PDF

Si no tiene impresora disponible o desea guardar una copia digital:

1. En el diálogo de impresión del navegador, donde dice "Impresora", seleccione **"Guardar como PDF"**.
2. Haga clic en **"Guardar"**.
3. Elija la ubicación en su computadora donde desea guardar el archivo.

### 8.4 Notas sobre impresión

- La vista previa de impresión se abre en una **nueva pestaña** del navegador. Puede cerrar esa pestaña después de imprimir.
- El modal del sistema **permanecerá abierto** en la pestaña original.
- El formato de impresión incluye el pie de página con la leyenda: **F-1100.C.03-02 Rev. 06** y **BWI Group — Departamento de TOOLROOM**.

---

## 9. Preguntas Frecuentes

### Q: ¿Puedo editar mi orden después de enviarla?

**A:** No. Una vez enviada, la orden queda registrada permanentemente en el sistema y no puede ser editada desde esta interfaz. Si necesita hacer cambios (corregir un nombre, ajustar la cantidad, modificar la descripción, etc.), contacte directamente al departamento de Toolroom para que realicen la modificación correspondiente.

### Q: ¿Cómo sé cuándo mi orden está lista?

**A:** Revise el estado de su orden en la vista **"Mis Órdenes"**. Cuando el estado cambie a **"Terminada"** (badge verde), significa que el trabajo ha sido completado y la pieza está lista para ser entregada. También puede abrir el detalle de la orden para ver más información, incluyendo el técnico asignado, las horas trabajadas y el material utilizado.

### Q: ¿Qué hago si no tengo el número SETC?

**A:** No se preocupe. El campo SETC es **opcional**. Puede enviar su orden sin número SETC y el sistema la procesará normalmente. Sin embargo, se mostrará una advertencia al taller indicando que falta el SETC. Si posteriormente obtiene el número, contacte a Toolroom para que lo agreguen a la orden.

### Q: ¿Cuánto tiempo tarda en procesarse una orden?

**A:** El tiempo depende de varios factores: la prioridad asignada, la carga de trabajo actual del taller, la disponibilidad de materiales y la complejidad del trabajo. Las órdenes de prioridad alta se atienden primero. Para una estimación específica, consulte directamente con el supervisor del departamento de Toolroom.

### Q: ¿Puedo cancelar mi orden?

**A:** No. Las cancelaciones deben ser realizadas por el departamento de Toolroom o por un administrador del sistema. Si necesita cancelar una orden, contacte al Toolroom y proporcione el número de folio de la orden que desea cancelar.

### Q: ¿Qué hago si subí el archivo equivocado?

**A:** No puede modificar el archivo adjunto después de enviar la orden. Contacte al departamento de Toolroom, proporcione el número de folio y solicite que se reemplace el archivo adjunto con la versión correcta.

### Q: ¿Puedo crear órdenes para otra persona?

**A:** Sí. Si usted está solicitando una pieza para otro departamento o persona, ingrese los datos correspondientes en la sección "Tus Datos". La orden quedará registrada a su nombre como solicitante. Si necesita que aparezca el nombre de otra persona, contacte al Toolroom para que realicen el ajuste.

### Q: ¿Puedo ver las órdenes de otros solicitantes?

**A:** No. Por diseño de seguridad, usted solo puede ver las órdenes que **usted mismo ha creado**. No tiene acceso a las órdenes de otros compañeros ni a la lista completa del taller.

### Q: ¿Puedo adjuntar más de un archivo?

**A:** Actualmente el sistema permite adjuntar **un solo archivo** por orden. Si necesita enviar múltiples documentos, puede combinarlos en un solo archivo PDF antes de adjuntarlo, o contacte al Toolroom para que registren los archivos adicionales.

### Q: ¿Qué formatos de archivo puedo adjuntar?

**A:** Los formatos aceptados son: **PDF, DWG, DXF, Word (.doc, .docx) y JPG**. El tamaño máximo es de **20 MB** por archivo.

### Q: ¿Puedo crear una orden desde mi teléfono móvil?

**A:** Sí. El sistema BWI TOOLROOM es responsivo y funciona desde cualquier dispositivo con navegador web (computadora, tableta o teléfono celular). Sin embargo, para adjuntar archivos técnicos (como planos DWG o DXF), se recomienda usar una computadora de escritorio.

---

## 10. Problemas Comunes y Soluciones

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| No puedo iniciar sesión | Número de empleado incorrecto o no registrado | Verifique que sea correcto (5 dígitos numéricos). Contacte a Toolroom si persiste. |
| Mi nombre aparece como "Empleado" | Es su primera vez en el sistema | Complete su nombre y área en el formulario de nueva orden (ver [Sección 5](#5-primer-uso--actualizar-perfil)) |
| No aparecen órdenes en mi lista | No ha creado órdenes aún | Haga clic en "+ Nueva orden" para crear su primera solicitud |
| El formulario no se envía | Faltan campos obligatorios | Verifique que los campos marcados con asterisco (*) estén completos: Nombre, Departamento, Nombre de pieza, Cantidad, Descripción y Prioridad |
| No puedo adjuntar un archivo | El archivo excede 20 MB o tiene un formato no soportado | Comprima el archivo, convierta a PDF, o divida en partes. Use solo formatos: PDF, DWG, DXF, Word, JPG |
| La prioridad 1 o 2 muestra un aviso amarillo | Es normal. Indica que se requiere autorización | Su orden se registrará y será atendida una vez autorizada por Gerencia de Mantenimiento |
| Cerré el modal sin querer | Accidentalmente hizo clic fuera del modal | Simplemente vuelva a hacer clic en la tarjeta de la orden que deseaba ver |
| No puedo imprimir | El navegador bloqueó la ventana emergente | Permita ventanas emergentes para este sitio web y vuelva a intentar |
| No veo el botón "Actualizar" | Está en la pantalla de detalle o de creación | Regrese a "Mis Órdenes" haciendo clic en "← Volver" |

---

## Resumen de capacidades del solicitante

| Usted PUEDE hacer | Usted NO PUEDE hacer |
|-------------------|----------------------|
| ✅ Crear órdenes de trabajo | ❌ Editar órdenes después de enviarlas |
| ✅ Ver sus propias órdenes | ❌ Ver órdenes de otros solicitantes |
| ✅ Ver el detalle completo de sus órdenes | ❌ Asignar técnicos a sus órdenes |
| ✅ Ver el historial de eventos de sus órdenes | ❌ Cambiar el estado de sus órdenes |
| ✅ Imprimir sus órdenes | ❌ Cancelar órdenes |
| ✅ Adjuntar planos y documentos | ❌ Gestionar usuarios del sistema |
| ✅ Seleccionar prioridad | ❌ Autorizar órdenes urgentes |

---

## Flujo de trabajo recomendado

```
Iniciar sesión con su número de empleado
    ↓
Revisar "Mis Órdenes" para verificar órdenes anteriores
    ↓
Hacer clic en "+ Nueva orden"
    ↓
Completar sección "Tus Datos" (nombre, área, departamento)
    ↓
Completar sección "Datos de la Pieza" (nombre, SETC, cantidad)
    ↓
Completar sección "Descripción del Trabajo" (descripción detallada + plano)
    ↓
Seleccionar una prioridad
    ↓
Hacer clic en "Enviar orden de trabajo"
    ↓
Anotar el número de folio asignado
    ↓
Verificar periódicamente el estado en "Mis Órdenes"
    ↓
Cuando el estado sea "Terminada", coordinar la entrega con Toolroom
    ↓
Cerrar sesión
```

---

## Información de contacto

Para soporte técnico, dudas sobre el sistema BWI TOOLROOM v5.0, o cualquier solicitud relacionada con sus órdenes de trabajo, contacte al **departamento de Toolroom**.

---

*Documento generado para BWI TOOLROOM v5.0 — Rol Solicitante*
*Formato de referencia: F-1100.C.03-02 Rev. 06*
