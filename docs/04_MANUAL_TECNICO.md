# MANUAL DE USUARIO — TÉCNICO

## BWI TOOLROOM v5.0

> **Rol:** Técnico
> **Alcance:** Visualización de órdenes asignadas, actualización de avance y consulta de métricas propias
> **Documento de referencia:** F-1100.C.03-02 Rev. 06

---

## Índice

1. [Inicio de Sesión](#1-inicio-de-sesión)
2. [Portal del Técnico — Vista General](#2-portal-del-técnico--vista-general)
3. [Mis Órdenes](#3-mis-órdenes)
4. [Detalle de Orden (Modal)](#4-detalle-de-orden-modal)
5. [Mi Rendimiento](#5-mi-rendimiento)
6. [Impresión de Órdenes](#6-impresión-de-órdenes)
7. [Turnos](#7-turnos)
8. [Consejos Importantes](#8-consejos-importantes)

---

## 1. Inicio de Sesión

### 1.1 Acceso al sistema

1. Abra su navegador web (Chrome, Firefox o Edge recomendados).
2. Navegue a la URL del sistema BWI TOOLROOM proporcionada por su supervisor.
3. Se mostrará la pantalla de inicio de sesión con el logo de BWI y los campos de credenciales.

### 1.2 Credenciales de técnico

| Campo            | Formato                            |
|------------------|------------------------------------|
| No. de empleado  | 5 dígitos numéricos                |
| PIN              | Mínimo 4 dígitos numéricos         |

> **Ejemplo:** No. empleado `33731`, PIN `8472`

### 1.3 Proceso de inicio

1. Ingrese su número de empleado de 5 dígitos en el campo **"Número de empleado"**.
2. Haga clic en **"Continuar"** o presione **Enter**.
3. El sistema verificará que su cuenta exista y esté activa.
4. Si su cuenta requiere PIN (los técnicos siempre lo requieren), se mostrará el campo **"PIN"**.
5. Ingrese su PIN de al menos 4 dígitos.
6. Haga clic en **"Entrar"** o presione **Enter**.
7. El sistema validará las credenciales y lo redirigirá al **Portal del Técnico**.

### 1.4 Si olvidó su PIN

- No es posible recuperar el PIN desde esta interfaz.
- Contacte a su **administrador** (supervisor) para que le asigne un nuevo PIN.
- El administrador puede restablecer su PIN desde el Panel de Usuarios del sistema.

### 1.5 Errores comunes de inicio de sesión

| Error | Causa | Solución |
|-------|-------|----------|
| "Credenciales incorrectas" | Número de empleado o PIN incorrecto | Verifique ambos datos y vuelva a intentar |
| "Usuario no encontrado" | El número de empleado no existe en el sistema | Verifique que sea correcto (5 dígitos numéricos) |
| "Cuenta desactivada" | Su cuenta fue desactivada | Contacte a su administrador |
| "El número de empleado debe tener exactamente 5 dígitos" | Se ingresó un número con longitud incorrecta | Ingrese exactamente 5 dígitos |

### 1.6 Sesión activa

- La sesión permanecerá activa mientras el navegador esté abierto y en uso.
- La sesión finalizará automáticamente al hacer clic en el botón **"Salir"** o al cerrar el navegador.
- No hay timeout automático por inactividad, pero se recomienda cerrar sesión al abandonar la estación de trabajo.
- **Si utiliza una computadora compartida, SIEMPRE cierre sesión al terminar** para que otros técnicos puedan usarla con sus propias credenciales.

### 1.7 Cerrar sesión

1. Ubique el botón **"Salir"** en la esquina superior derecha del encabezado.
2. Haga clic en **"Salir"**.
3. El sistema eliminará la sesión y regresará a la pantalla de inicio de sesión.
4. Confirme que ha regresado a la pantalla de login antes de abandonar la estación de trabajo.

---

## 2. Portal del Técnico — Vista General

Al iniciar sesión, se muestra el **Portal del Técnico**, que es la pantalla principal de trabajo. Desde aquí puede ver sus órdenes asignadas, actualizar el avance de cada una y consultar sus propias métricas de desempeño.

> **Diferencia clave:** A diferencia de los administradores, usted **solo** puede ver las órdenes que le han sido asignado**. No tiene acceso a crear órdenes, asignar técnicos, autorizar trabajos ni gestionar usuarios. Su interfaz está simplificada para enfocarse en lo que usted necesita: hacer su trabajo y registrar su avance.

### 2.1 Encabezado (Header)

El encabezado contiene los siguientes elementos de izquierda a derecha:

| Elemento | Descripción |
|----------|-------------|
| Logo BWI | Logotipo de la empresa en el lado izquierdo |
| Título | **"Portal del Técnico — TOOLROOM"** |
| Nombre de usuario | Su nombre completo |
| No. de empleado y turno | Número de empleado y turno asignado (ej: `#33731 · Turno 1° (8 hrs)`) |
| Botón **"Salir"** | Cierra la sesión y regresa a la pantalla de login |

### 2.2 Pestañas de navegación

Debajo del encabezado se encuentran **2 pestañas de navegación**:

| Pestaña | Función |
|---------|---------|
| **Mis Órdenes** | Lista de todas las órdenes asignadas a usted, con KPIs y filtros |
| **Mi Rendimiento** | Sus métricas personales de productividad y gráficas de desempeño |

Haga clic en cualquiera de las pestañas para cambiar de vista. Las transiciones entre pestañas están animadas con efectos de desvanecimiento.

> **Nota importante:** Las pestañas **"Órdenes"** (general), **"Prioridades"**, **"Gráficas"**, **"Técnicos"** y **"Usuarios"** que aparecen en los paneles de administración **no están disponibles** para el rol de técnico. Esta restricción es intencional y forma parte del diseño de seguridad del sistema.

---

## 3. Mis Órdenes

La pestaña **"Mis Órdenes"** es la vista predeterminada al iniciar sesión. Muestra **exclusivamente** las órdenes que le han sido asignado a usted como técnico. No verá órdenes de otros compañeros ni órdenes sin asignar.

### 3.1 Panel de KPIs

En la parte superior se muestran **5 tarjetas KPI** (indicadores clave de desempeño) que resumen su carga de trabajo actual:

| Tarjeta | Descripción | Indicador de color |
|---------|-------------|-------------------|
| **Total órdenes** | Cantidad total de órdenes asignadas a usted (todos los estados) | Sin color especial |
| **En proceso** | Órdenes que está trabajando actualmente | Amarillo |
| **Terminadas** | Órdenes que usted ha completado | Verde |
| **Horas registradas** | Total de horas que ha registrado en todas sus órdenes | Azul |
| **Aprovechamiento mes** | Porcentaje de eficiencia del mes actual (horas trabajadas vs. horas disponibles) | Verde (≥80%), Amarillo (50–79%), Rojo (<50%) |

> **Consejo:** Al iniciar sesión, revise primero estas tarjetas para tener una vista rápida de su situación actual. Si el "Aprovechamiento mes" aparece en rojo, significa que necesita registrar más horas de trabajo.

### 3.2 Filtros

Debajo de las tarjetas KPI se encuentran **5 filtros en forma de pastilla (pill)** que permiten filtrar sus órdenes por estado:

| Filtro | Descripción |
|--------|-------------|
| **Todas** | Muestra todas sus órdenes sin filtro de estado |
| **Nuevas** | Órdenes que le fueron asignadas pero aún no ha comenzado a trabajar |
| **En proceso** | Órdenes en las que ya registró fecha de inicio |
| **Terminadas** | Órdenes que usted completó (fecha de término registrada) |
| **Entregadas** | Órdenes que ya fueron entregadas al solicitante |

Para aplicar un filtro:

1. Haga clic en la pastilla deseada.
2. La pastilla seleccionada se resaltará visualmente con un color.
3. La tabla se actualizará para mostrar solo las órdenes que cumplen con el filtro seleccionado.
4. Haga clic en **"Todas"** para quitar el filtro y ver todas sus órdenes.

### 3.3 Tabla de Órdenes

La tabla principal muestra sus órdenes asignadas con las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| **Folio** | Número de folio único de la orden (ej: #1234) |
| **Fecha** | Fecha de creación de la orden |
| **Pieza** | Nombre o descripción de la pieza |
| **Solicitante** | Nombre de quien solicita la pieza |
| **Prioridad** | Nivel de prioridad con etiqueta de color (ver tabla abajo) |
| **Estado** | Estado actual de la orden (ver tabla abajo) |
| **Inicio** | Fecha en que usted registró el inicio del trabajo |
| **Término** | Fecha en que usted registró la finalización del trabajo |
| **Hrs** | Horas reales que usted registró para esta orden |
| **Acción** | Botón **"Ver detalle"** para abrir el detalle de la orden |

**Indicadores visuales de prioridad:**

| Prioridad | Etiqueta | Color | Significado |
|:---------:|----------|:-----:|-------------|
| 1 | 1·Seguridad | Rojo | Riesgo inmediato de seguridad laboral |
| 2 | 2·Queja | Amarillo | Queja de un cliente externo |
| 3 | 3·Máq.parada | Naranja | Máquina parada sin planificar |
| 4 | 4·Rápido | Azul | Trabajo rápido (< 2 horas) |
| 5 | 5·Fabricación | Gris | Fabricación estándar |

**Indicadores visuales de estado:**

| Estado | Etiqueta | Color |
|--------|----------|:-----:|
| nueva_orden | Nueva | Azul |
| en_proceso | En proceso | Amarillo |
| terminada | Terminada | Verde |
| cancelada | Cancelada | Gris |

**Interacción con la tabla:**

- Haga clic en el botón **"Ver detalle"** de cualquier fila para abrir el **Detalle de Orden** en un modal (ventana emergente).
- Las filas tienen un efecto de resaltado al pasar el cursor sobre ellas.
- Si no hay órdenes con el filtro seleccionado, se mostrará el mensaje "Sin órdenes con ese filtro."

---

## 4. Detalle de Orden (Modal)

Al hacer clic en **"Ver detalle"** de una orden en la tabla, se abre un **modal (ventana emergente)** que muestra el detalle completo de la orden seleccionada. Este modal contiene **3 pestañas internas**:

### 4.1 Pestaña "Información"

Muestra la información general de la orden organizada en una cuadrícula de dos columnas:

| Campo | Descripción |
|-------|-------------|
| **Folio** | Número de folio de la orden (ej: #1234) |
| **Fecha solicitud** | Fecha en que se creó la orden |
| **Pieza** | Nombre de la pieza a trabajar |
| **Solicitante** | Nombre de quien solicitó el trabajo |
| **SETC** | Número SETC de identificación (si existe) |
| **No. plano** | Número de plano asociado (si existe) |
| **No. máquina** | Máquina, fixtura o equipo al que pertenece la pieza |
| **Línea / celda** | Línea de producción o celda de manufactura |
| **Cantidad** | Cantidad de piezas solicitadas |
| **Prioridad** | Nivel de prioridad con etiqueta de color |
| **Estado** | Estado actual de la orden con etiqueta de color |
| **Técnicos** | Nombre del técnico asignado (usted) |
| **Descripción** | Texto libre con la descripción detallada del trabajo a realizar |

**Elementos adicionales:**

- **Vista previa del plano:** Si se adjuntó un archivo plano a la orden, se muestra una vista previa al final de la información. Los archivos PDF se muestran en un visor embebido; las imágenes se muestran con tamaño completo. Puede hacer clic en la imagen para abrirla en tamaño completo.

**Acciones disponibles en esta pestaña:**

| Botón | Acción |
|-------|--------|
| **"🖨 Imprimir"** | Abre una nueva pestaña del navegador con el formato de impresión de la orden (ver [Sección 6](#6-impresión-de-órdenes)) |
| **"✕ Cerrar"** | Cierra el modal de detalle y regresa a la tabla de órdenes |

> **Nota:** Para cerrar el modal también puede presionar la tecla **Escape** o hacer clic fuera del modal.

### 4.2 Pestaña "Mi Avance" (LA MÁS IMPORTANTE)

Esta es la pestaña que usted utilizará con más frecuencia. Desde aquí registra el avance de su trabajo en la orden. Los campos que se muestran dependen del estado actual de la orden.

#### Campos disponibles

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| **Fecha inicio** | Calendario | **Sí** | Fecha en que usted comenzó a trabajar en esta orden. Use el selector de calendario para elegir la fecha. |
| **Fecha término** | Calendario | No | Fecha en que usted terminó de trabajar. **Solo está disponible** si la orden está en estado "En proceso" o "Terminada". Si la orden es "Nueva", este campo aparecerá bloqueado con el mensaje "Disponible al estar en proceso". |
| **Horas reales trabajadas** | Número decimal | No (sí si registra fecha término) | Total de horas que usted invirtió en esta orden. Puede usar decimales (ej: 8.5 para 8 horas y media). Ingrese números positivos. |
| **Material utilizado** | Lista desplegable | No | Seleccione el material que utilizó en el trabajo. Si el material no aparece en la lista, seleccione **"Otro"** y escriba el nombre del material en el campo adicional que aparecerá. |
| **Comentarios** | Texto libre | No | Cualquier nota, observación o detalle sobre el trabajo realizado. Puede escribir varias líneas. |
| **Guardar avance** | Botón | — | Haga clic en este botón para guardar todos los cambios realizados. |

#### Cambios automáticos de estado

El sistema cambia el estado de la orden **de forma automática** cuando usted registra ciertos campos:

| Acción de usted | Cambio automático en la orden |
|-----------------|-------------------------------|
| Registra **Fecha inicio** (y antes no tenía) | Estado cambia de "Nueva" → **"En proceso"** |
| Registra **Fecha término** (y antes no tenía) | Estado cambia de "En proceso" → **"Terminada"** |

> **Esto significa que usted NO necesita cambiar el estado manualmente.** Solo llene las fechas y horas, y el sistema hace el resto.

#### Reglas importantes

1. **La fecha de inicio es obligatoria.** No puede guardar el avance sin haber registrado cuándo comenzó a trabajar.
2. **Para registrar fecha término, la orden debe estar "En proceso".** Si la orden todavía está "Nueva", primero registre la fecha de inicio y guarde. Después podrá registrar la fecha de término.
3. **Al registrar fecha término, debe indicar las horas trabajadas.** El sistema requiere que especifique cuántas horas invirtió en el trabajo.
4. **Los cambios NO se guardan automáticamente.** Si modifica algún campo y cierra el modal sin hacer clic en **"Guardar avance"**, los cambios se perderán.
5. **El modal NO se cierra al guardar.** Después de guardar, el modal permanece abierto para que pueda seguir trabajando en la misma orden si lo necesita.

#### Ejemplo práctico

Imaginemos que recibió una orden para reparar una pieza:

1. Abra el detalle de la orden haciendo clic en **"Ver detalle"**.
2. Vaya a la pestaña **"Mi Avance"**.
3. Seleccione la **Fecha inicio** usando el calendario (ej: hoy).
4. Haga clic en **"Guardar avance"**. → La orden cambiará automáticamente a "En proceso".
5. Trabaje en la reparación.
6. Cuando termine, regrese a la pestaña **"Mi Avance"**.
7. Seleccione la **Fecha término** usando el calendario.
8. Ingrese las **Horas reales trabajadas** (ej: 6.5).
9. Seleccione el **Material utilizado** de la lista.
10. Escriba un **Comentario** si lo desea (ej: "Reparación completada, pieza funcionando correctamente").
11. Haga clic en **"Guardar avance"**. → La orden cambiará automáticamente a "Terminada".

### 4.3 Pestaña "Historial"

Muestra la **línea de tiempo completa** de eventos de la orden. Cada evento se muestra como una tarjeta con la siguiente información:

- **Icono** representativo del tipo de evento
- **Etiqueta del tipo** de evento (ej: "Recepción", "Asignación")
- **Fecha y hora** exacta del evento
- **Texto descriptivo** con los detalles del evento

**Tipos de eventos que puede ver:**

| Icono | Tipo de evento | Descripción |
|-------|----------------|-------------|
| 📥 | Recepción | La orden fue recibida/creada en el sistema |
| 👤 | Asignación | Un técnico fue asignado a la orden (usted) |
| ▶️ | Inicio | El trabajo en la orden fue iniciado (cuando usted puso fecha inicio) |
| 💬 | Comentario | Se agregó un comentario a la orden |
| ✅ | Autorización | La orden fue autorizada (para prioridades 1 y 2) |
| 🔄 | Cambio de estado | El estado de la orden fue modificado |
| 🔧 | Material | Se registró material utilizado |
| 🏁 | Terminado | El trabajo fue completado (cuando usted puso fecha término) |
| 📦 | Entrega | La orden fue entregada al solicitante |

> **Nota:** Los eventos del historial son permanentes y no pueden ser modificados ni eliminados. Esto garantiza un registro completo y confiable de todo lo que ha ocurrido con la orden.

---

## 5. Mi Rendimiento

La pestaña **"Mi Rendimiento"** le permite consultar sus propias métricas de productividad. Es una herramienta para que usted mismo pueda monitorear su desempeño.

### 5.1 KPIs de rendimiento

En la parte superior se muestran **4 tarjetas KPI**:

| Tarjeta | Descripción |
|---------|-------------|
| **Hrs semana** | Horas que usted trabajó esta semana vs. las horas disponibles de su turno (ej: 24.0 / 40) |
| **Hrs mes** | Horas que usted trabajó este mes vs. las horas disponibles de su turno (ej: 120.0 / 160) |
| **Aprovechamiento semana** | Porcentaje de eficiencia de la semana (horas trabajadas ÷ horas disponibles × 100) |
| **Aprovechamiento mes** | Porcentaje de eficiencia del mes (horas trabajadas ÷ horas disponibles × 100) |

**Indicadores de color en los porcentajes:**

| Color | Rango | Significado |
|:-----:|:-----:|-------------|
| Verde | ≥ 80% | Óptimo — Su productividad está en el nivel deseado |
| Amarillo | 50% – 79% | Aceptable — Hay espacio de mejora |
| Rojo | < 50% | Bajo — Revisar la carga de trabajo o el registro de horas |

### 5.2 Gráficas de desempeño

#### Gráfica de barras: Horas trabajadas vs disponibles

- **Tipo de gráfica:** Barras apiladas (Bar Chart)
- **Datos mostrados:** Comparación entre horas trabajadas y horas restantes disponibles
- **Dos barras:** Una para la semana actual y otra para el mes actual
- **Eje X:** Período (Semana / Mes)
- **Eje Y:** Cantidad de horas
- **Leyenda:** Azul = Trabajadas, Gris = Disponibles (restantes)

Pasa el cursor sobre las gráficas para ver los datos exactos.

#### Barras de eficiencia: Aprovechamiento por período

Debajo de la gráfica de barras se muestran **2 barras de progreso** que indican su porcentaje de aprovechamiento:

- **Barra Semana:** Muestra las horas trabajadas de la semana sobre las horas disponibles, con un porcentaje al lado.
- **Barra Mes:** Muestra las horas trabajadas del mes sobre las horas disponibles, con un porcentaje al lado.

Cada barra se colorea automáticamente según su porcentaje:

| Color | Rango | Etiqueta |
|:-----:|:-----:|----------|
| Verde | ≥ 80% | Óptimo |
| Amarillo | 50% – 79% | Aceptable |
| Rojo | < 50% | Bajo |

Debajo de las barras se muestra una leyenda con estos tres niveles.

### 5.3 ¿Cómo se calculan mis métricas?

El sistema toma **todas las órdenes que le están asignadas** y suma las horas reales que usted registró en cada una. Luego compara esas horas contra las horas que debería haber trabajado según su turno:

**Fórmula de aprovechamiento:**

```
Aprovechamiento (%) = (Horas trabajadas / Horas disponibles) × 100
```

| Turno | Horas por día | Horas por semana | Horas por mes |
|:-----:|:------------:|:----------------:|:-------------:|
| **1° Turno** (Matutino) | 8 hrs | 40 hrs | 160 hrs |
| **2° Turno** (Vespertino) | 7.5 hrs | 37.5 hrs | 150 hrs |

> **Nota:** Su turno es configurado por el superadministrador del sistema. Si cree que su turno está configurado incorrectamente, contacte a su administrador.

---

## 6. Impresión de Órdenes

El sistema genera impresiones formales de órdenes de trabajo en el formato estándar de la empresa (F-1100.C.03-02 Rev. 06).

### 6.1 Proceso de impresión

1. Abra el detalle de una orden haciendo clic en **"Ver detalle"** desde la tabla de órdenes.
2. Asegúrese de estar en la pestaña **"Información"** (donde se muestra el detalle completo).
3. Haga clic en el botón **"🖨 Imprimir"** ubicado en la esquina superior derecha del modal.
4. Se abrirá una **nueva pestaña del navegador** con la vista previa de impresión.
5. En la nueva pestaña, haga clic en el botón azul **"🖨 Imprimir"** ubicado en la esquina superior derecha.
6. Se abrirá el **diálogo de impresión del navegador**.
7. Seleccione la impresora deseada.
8. Configure la orientación (recomendado: vertical) y los márgenes.
9. Haga clic en **"Imprimir"** para enviar el documento a la impresora.

### 6.2 Contenido del formato de impresión

El formato de impresión incluye la siguiente información:

| Sección | Contenido |
|---------|-----------|
| **Encabezado** | Logo de BWI, título "ORDEN DE TRABAJO PARA TALLER", número de formato y revisión |
| **Datos del solicitante** | Nombre, número de empleado, área, departamento |
| **Datos generales** | Fecha de solicitud, prioridad |
| **Datos de la pieza** | Nombre, SETC, número de plano, cantidad |
| **Máquina y línea** | Número de máquina/fixtura/equipo, línea/celda |
| **Descripción** | Descripción detallada del trabajo a realizar |
| **Avance del técnico** | Fecha inicio, fecha término, horas totales, nombre del técnico |
| **Material** | Material utilizado |
| **Estado** | Estado actual de la orden |
| **Comentarios** | Observaciones registradas |
| **Líneas de firma** | Espacios para firmas de: Gerente Tool Room + Conformidad del Solicitante |

### 6.3 Guardar como PDF

Si no tiene impresora disponible o desea guardar una copia digital:

1. En el diálogo de impresión del navegador, donde dice "Impresora", seleccione **"Guardar como PDF"**.
2. Haga clic en **"Guardar"**.
3. Elija la ubicación en su computadora donde desea guardar el archivo.
4. El archivo se guardará como un documento PDF con el nombre de la orden.

### 6.4 Notas sobre impresión

- La vista previa de impresión se abre en una **nueva pestaña** del navegador. Puede cerrar esa pestaña después de imprimir.
- El modal del sistema **permanecerá abierto** en la pestaña original después de abrir la impresión.
- El formato de impresión incluye el pie de página con la leyenda: **F-1100.C.03-02 Rev. 06** y **BWI Group — Departamento de TOOLROOM**.
- La fecha de impresión se incluye automáticamente en el pie del documento.

---

## 7. Turnos

El sistema calculate sus métricas de productividad según el turno que tiene configurado. Existen dos turnos:

| Turno | Horas por día | Horas por semana | Horas por mes |
|:-----:|:------------:|:----------------:|:-------------:|
| **Primer turno (1°)** — Matutino | 8 horas | 40 horas | 160 horas |
| **Segundo turno (2°)** — Vespertino | 7.5 horas | 37.5 horas | 150 horas |

### 7.1 ¿Qué turno tengo?

Su turno aparece en el encabezado del Portal del Técnico, junto a su número de empleado:

- Si ve **"Turno 1° (8 hrs)"**, usted está en el primer turno (matutino).
- Si ve **"Turno 2° (7.5 hrs)"**, usted está en el segundo turno (vespertino).

### 7.2 ¿Qué significa para mis métricas?

Las horas disponibles que usa el sistema para calcular su aprovechamiento se basan en su turno:

- **Primer turno:** Se esperan 40 horas semanales y 160 horas mensuales.
- **Segundo turno:** Se esperan 37.5 horas semanales y 150 horas mensuales.

> **Importante:** Si su turno está configurado incorrectamente, sus métricas de aprovechamiento no serán precisas. Si cree que tiene el turno equivocado, contacte a su administrador para que haga la corrección desde el Panel de Usuarios.

---

## 8. Consejos Importantes

### 8.1 Reglas de oro para el registro de avance

1. **SIEMPRE registre la fecha de inicio** cuando comience a trabajar en una orden. Esto cambia el estado de la orden a "En proceso" automáticamente y es necesario para que su tiempo quede registrado correctamente.

2. **SIEMPRE registre la fecha término y las horas** cuando termine de trabajar. Esto cambia el estado de la orden a "Terminada" y es esencial para que sus métricas de rendimiento sean precisas.

3. **SIEMPRE haga clic en "Guardar avance"** después de hacer cambios. Los cambios no se guardan automáticamente; si cierra el modal sin guardar, todo se perderá.

4. **Registre el material utilizado** siempre que sea posible. Esto ayuda al administrador a mantener un inventario preciso del taller.

### 8.2 Su rol en el sistema

| Usted PUEDE hacer | Usted NO PUEDE hacer |
|-------------------|----------------------|
| ✅ Ver sus órdenes asignadas | ❌ Crear órdenes nuevas |
| ✅ Registrar avance de su trabajo | ❌ Asignar técnicos a órdenes |
| ✅ Registrar fechas, horas y material | ❌ Autorizar órdenes urgentes |
| ✅ Ver el historial de sus órdenes | ❌ Confirmar entregas de órdenes |
| ✅ Ver sus métricas de rendimiento | ❌ Cancelar órdenes |
| ✅ Imprimir órdenes | ❌ Eliminar o modificar datos registrados |
| ✅ Agregar comentarios | ❌ Ver órdenes de otros técnicos |
| | ❌ Gestionar usuarios |

### 8.3 Si comete un error

- **Si registró una fecha o hora incorrecta:** Contacte a su administrador. Los técnicos no pueden eliminar ni modificar datos ya registrados. El administrador podrá hacer los ajustes necesarios.
- **Si olvidó registrar el material:** Contacte a su administrador para que agregue la información.
- **Si necesita ver una orden que no aparece en su lista:** Esa orden probablemente no le está asignada. Contacte a su administrador.

### 8.4 Flujo de trabajo recomendado

```
Iniciar sesión
    ↓
Revisar KPIs (Panel de KPIs en "Mis Órdenes")
    ↓
Filtrar por "Nuevas" para ver órdenes pendientes
    ↓
Abrir detalle de una orden (clic en "Ver detalle")
    ↓
Revisar información en pestaña "Información"
    ↓
Ir a pestaña "Mi Avance"
    ↓
Registrar Fecha inicio → Guardar avance
    ↓
Trabajar en la orden
    ↓
Regresar a "Mi Avance"
    ↓
Registrar Fecha término + Horas + Material → Guardar avance
    ↓
(El administrador confirmará la entrega)
    ↓
Revisar "Mi Rendimiento" para verificar métricas
    ↓
Cerrar sesión
```

### 8.5 Problemas comunes y soluciones

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| No puedo iniciar sesión | PIN incorrecto o cuenta desactivada | Verifique sus credenciales; contacte a su administrador |
| No aparecen órdenes en mi lista | No tiene órdenes asignadas | Solicite a su administrador que le asigne órdenes |
| No puedo poner fecha término | La orden es "Nueva" | Primero registre la fecha inicio y guarde; después podrá poner fecha término |
| No puedo guardar el avance | La fecha de inicio está vacía | Seleccione una fecha en el calendario de "Fecha inicio" |
| El modal no se cierra | — | Presione **Escape** o haga clic fuera del modal |
| Las gráficas no muestran datos | No tiene horas registradas | Registre horas en sus órdenes para que aparezcan datos |
| El botón "Guardar avance" está gris | Está guardando o falta la fecha inicio | Espere a que termine la operación o seleccione fecha inicio |
| No puedo imprimir | El navegador bloqueó la ventana emergente | Permita ventanas emergentes para este sitio y vuelva a intentar |
| Mi aprovechamiento aparece en rojo | No ha registrado suficientes horas | Registre horas en sus órdenes para mejorar su porcentaje |

### 8.6 Atajos de teclado

| Acción | Atajo / Método |
|--------|----------------|
| **Abrir detalle de orden** | Clic en el botón "Ver detalle" de la fila correspondiente |
| **Cerrar modal** | Presione **Escape** o haga clic fuera del modal |
| **Cambiar de pestaña** | Clic en la pestaña deseada ("Mis Órdenes" o "Mi Rendimiento") |
| **Navegar filtros** | Clic en las pastillas de filtro (Todas, Nuevas, En proceso, etc.) |
| **Enviar formulario** | Clic en "Guardar avance" |

### 8.7 Indicadores visuales — Resumen rápido

| Indicador | Significado |
|-----------|-------------|
| **Badge azul "Nueva"** | Orden asignada pero no ha comenzado a trabajar |
| **Badge amarillo "En proceso"** | Orden en la que ya registró fecha inicio |
| **Badge verde "Terminada"** | Orden completada por usted |
| **Badge púrpura "Entregada"** | Orden entregada al solicitante por el administrador |
| **Aprovechamiento verde (≥80%)** | Su productividad está en nivel óptimo |
| **Aprovechamiento amarillo (50–79%)** | Su productividad es aceptable pero puede mejorar |
| **Aprovechamiento rojo (<50%)** | Su productividad está baja — revise si está registrando todas sus horas |

---

## Información de contacto

Para soporte técnico, dudas sobre el sistema BWI TOOLROOM v5.0 o solicitudes de ajuste de turno, contacte a su **administrador** o al superadministrador del sistema.

---

*Documento generado para BWI TOOLROOM v5.0 — Rol Técnico*
*Formato de referencia: F-1100.C.03-02 Rev. 06*
