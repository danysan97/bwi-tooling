# PROMPT PARA GENERAR DOCUMENTACIÓN DEL TÉCNICO — BWI TOOLROOM

Copia todo el contenido de este archivo y pégalo en ChatGPT, Claude o cualquier IA para generar el manual del técnico completo en PDF o Markdown formateado.

---

Eres un documentador técnico profesional. Tu tarea es crear un **Manual de Usuario — Portal del Técnico** para el sistema **BWI TOOLROOM**.

Este documento está dirigido exclusivamente a los **técnicos del departamento de Tooling** (Taller de Máquinas y Herramientas) de BWI Group. Cubre todo lo que un técnico necesita saber para usar su portal dedicado: iniciar sesión, ver sus órdenes asignadas, registrar avance, imprimir órdenes, y revisar su rendimiento.

El manual debe estar en **español**, con formato profesional, numerado, con tabla de contenido, y listo para convertirse en PDF. El lenguaje debe ser claro, directo, y accesible para personal de planta sin conocimientos técnicos avanzados.

---

## FORMATO DEL DOCUMENTO

1. **Portada:** Título "Manual del Técnico — BWI TOOLROOM", subtítulo "Portal del Técnico — Departamento de Tooling", versión 1.0, fecha, BW Group logo textual
2. **Tabla de contenido** numerada
3. **Introducción:** para qué sirve el portal, qué puede hacer el técnico, qué necesita para empezar
4. **Cada sección** numerada con subtítulos, pasos con numeración, capturas de pantalla referenciadas (indicar "Insertar captura de: [descripción]"), notas importantes y consejos prácticos
5. **Glosario** al final
6. **Formato:** 16:9 o A4, tipografía Arial/Calibri, tamaño 11-12 para cuerpo, negritas para comandos

---

## ESTRUCTURA DEL DOCUMENTO

### CAPÍTULO 1 — INTRODUCCIÓN

**1.1 ¿Qué es el Portal del Técnico?**
- Es una aplicación web diseñada específicamente para técnicos del departamento de Tooling
- Permite ver las órdenes de trabajo asignadas, registrar avance, y revisar tu productividad
- Desde aquí puedes: ver tus órdenes, actualizar fechas de inicio y término, registrar material utilizado, agregar comentarios, imprimir órdenes, y ver tus métricas de rendimiento
- No necesitas conocimientos de computación avanzados — solo saber usar un navegador web

**1.2 ¿Qué necesitas para empezar?**
- Un navegador web (Chrome, Edge, Firefox o Safari)
- Conexión a internet
- Tu número de empleado (5 dígitos) — lo puedes encontrar en tu credencial de BWI
- Tu PIN de 4 dígitos — lo asigna tu superadmin o administrador

**1.3 ¿Qué puedes hacer en el portal?**

| Función | Descripción |
|---|---|
| Ver mis órdenes | Lista de todas las órdenes asignadas a ti |
| Registrar avance | Poner fecha de inicio, fecha de término, horas, material, comentarios |
| Ver historial | Timeline de eventos de cada orden |
| Imprimir órdenes | Generar vista previa para imprimir en formato BWI |
| Ver mi rendimiento | Gráficas y métricas de tu productividad |

---

### CAPÍTULO 2 — INICIAR SESIÓN

**2.1 Abrir el portal**
- Paso 1: Abrir el navegador (Chrome o Edge recomendado)
- Paso 2: Ingresar la URL del sistema (la que te proporcionó tu administrador)
- Paso 3: Se muestra la pantalla de login

**2.2 Ingresar tus credenciales**
- Paso 1: En el campo "Número de empleado", ingresar tu número de 5 dígitos
  - Ejemplo: 31292
- Paso 2: El sistema detecta que eres técnico y te solicita el PIN
- Paso 3: En el campo "PIN", ingresar tu PIN de 4 dígitos
  - Ejemplo: 8472
- Paso 4: Hacer clic en "Entrar" o presionar Enter

**2.3 Si olvidaste tu PIN**
- No puedes recuperarlo tú mismo
- Contacta a tu administrador o superadmin
- El administrador puede:
  - Ver tu PIN actual desde el Panel de Usuarios
  - Resetear tu PIN para asignar uno nuevo

**2.4 Errores comunes de login**

| Error | Causa | Solución |
|---|---|---|
| "Credenciales incorrectas" | Número de empleado o PIN incorrecto | Verificar ambos datos |
| "Usuario no encontrado" | El número de empleado no existe | Verificar que sea correcto (5 dígitos) |
| "Cuenta desactivada" | Tu cuenta está desactivada | Contactar al administrador |
| "PIN requerido" | El sistema espera tu PIN | Ingresar tu PIN de 4 dígitos |

**2.5 Cerrar sesión**
- Ubicar el botón "Salir" en la esquina superior derecha de la pantalla
- Hacer clic en "Salir"
- Confirmar que regresaste a la pantalla de login
- IMPORTANTE: Siempre cierra sesión al terminar tu turno, especialmente en computadoras compartidas

---

### CAPÍTULO 3 — ESTRUCTURA DEL PORTAL

**3.1 Pantalla principal**
- Encabezado: "BWI — TOOLROOM / Portal del Técnico"
- Se muestra tu nombre completo y tu turno (1° Turno o 2° Turno)
- Dos pantallas principales:
  - **Mis Órdenes** — lista y detalle de tus órdenes
  - **Mi Rendimiento** — métricas y gráficas de productividad
- Botón "Salir" para cerrar sesión

**3.2 Navegar entre pantallas**
- Hacer clic en "Mis Órdenes" para ver la lista de órdenes
- Hacer clic en "Mi Rendimiento" para ver tus métricas
- El sistema recuerda en qué pantalla estabas

---

### CAPÍTULO 4 — MIS ÓRDENES: KPIs

**4.1 Tarjetas de indicadores**
- En la parte superior de "Mis Órdenes" se muestran 5 tarjetas:
  - **Total:** número total de órdenes asignadas a ti
  - **En proceso:** órdenes donde ya started but not finished
  - **Terminadas:** órdenes completadas
  - **Horas:** total de horas trabajadas en tus órdenes
  - **Aprovechamiento:** porcentaje de horas trabajadas vs horas disponibles según tu turno

**4.2 Entender el aprovechamiento**
- El sistema calcula tu productividad según tu turno:
  - 1° Turno: 8 horas/día × 5 días = 40 horas/semana = 160 horas/mes
  - 2° Turno: 7.5 horas/día × 5 días = 37.5 horas/semana = 150 horas/mes
- Fórmula: Aprovechamiento = (Horas trabajadas / Horas disponibles) × 100
- Colores:
  - 🟢 Verde: ≥80% (Óptimo)
  - 🟡 Amarillo: 50-79% (Aceptable)
  - 🔴 Rojo: <50% (Bajo)

---

### CAPÍTULO 5 — MIS ÓRDENES: FILTROS

**5.1 Filtrar por estado**
- Botones de filtro debajo de los KPIs:
  - **Todas** — muestra todas tus órdenes
  - **Nuevas** — órdenes que aún no has comenzado
  - **En proceso** — órdenes donde ya pusiste fecha de inicio
  - **Terminadas** — órdenes completadas
  - **Entregadas** — órdenes confirmadas como entregadas
- Cada botón muestra el conteo de órdenes en ese estado
- Hacer clic en un filtro muestra solo esas órdenes

**5.2 Consejo práctico**
- Al inicio de tu turno, revisa "Nuevas" para ver qué órdenes tienes pendientes
- Al finalizar una orden, cámbiala a "En proceso" o "Terminada" según corresponda
- Usa "Todas" para ver tu carga completa de trabajo

---

### CAPÍTULO 6 — MIS ÓRDENES: TABLA

**6.1 Columnas de la tabla**

| Columna | Descripción |
|---|---|
| Folio | Número único de la orden (ej. BWI-2025-00123) |
| Fecha | Fecha de solicitud de la orden |
| Pieza | Nombre de la pieza a trabajar |
| Solicitante | Quién pidió la orden |
| Prioridad | Nivel de urgencia (1-5 con color) |
| Estado | Estado actual de la orden |
| Inicio | Fecha de inicio registrada |
| Término | Fecha de término registrada |
| Hrs | Horas reales trabajadas |
| Ver detalle | Botón para abrir el detalle completo |

**6.2 Colores de prioridad**

| Prioridad | Color | Significado |
|---|---|---|
| 1 | 🔴 Rojo | Seguridad — riesgo laboral |
| 2 | 🟠 Naranja | Queja de cliente |
| 3 | 🟡 Amarillo | Máquina parada |
| 4 | 🔵 Azul | Trabajo rápido |
| 5 | ⚪ Blanco | Fabricación normal |

**6.3 Colores de estado**

| Estado | Color | Significado |
|---|---|---|
| nueva_orden | 🔵 Azul | Recién creada, sin asignar |
| en_proceso | 🟡 Amarillo | Ya empezaste a trabajar |
| terminada | 🟢 Verde | Trabajo completado |
| entregada | 🟣 Púrpura | Pieza devuelta al solicitante |

**6.4 Abrir el detalle de una orden**
- Hacer clic en "Ver detalle" en la columna de acción
- Se abre un modal (ventana emergente) con toda la información
- Desde aquí puedes ver información, registrar avance, y ver historial

---

### CAPÍTULO 7 — DETALLE DE ORDEN: PESTAÑA INFORMACIÓN

**7.1 Datos de la orden**
- Se muestra un grid de 2 columnas con toda la información:
  - Folio, Fecha de solicitud, Pieza, Solicitante
  - SETC (número de identificación), No. plano, No. máquina, Línea/celda
  - Cantidad, Prioridad, Estado, Técnicos asignados

**7.2 Descripción del trabajo**
- Sección dedicada con la descripción completa del trabajo a realizar
- Lee esta sección cuidadosamente antes de empezar

**7.3 Vista previa del plano**
- Si se adjuntó un archivo (plano), se muestra directamente en esta pestaña
- PDFs se muestran en un visor embebido (puedes hacer zoom y desplazar)
- Imágenes se muestran con tamaño completo
- Si no hay plano adjunto, no se muestra esta sección

**7.4 Consejo práctico**
- Lee la descripción completa antes de empezar a trabajar
- Si tienes dudas sobre el trabajo, consulta a tu administrador
- Revisa el plano si está disponible — te ayudará a entender qué se necesita

---

### CAPÍTULO 8 — DETALLE DE ORDEN: PESTAÑA MI AVANCE

**8.1 ¿Qué es "Mi avance"?**
- Es la pestaña más importante para ti como técnico
- Aquí registras todo el avance de tu trabajo: fechas, horas, material, comentarios
- Los cambios se guardan en el sistema y se reflejan inmediatamente

**8.2 Registrar fecha de inicio**
- Campo "Fecha inicio" con selector de fecha
- Selecciona la fecha en que empezaste a trabajar en esta orden
- **IMPORTANTE:** Al guardar con fecha de inicio, el estado cambia automáticamente de "Nueva orden" a "En proceso"
- No puedes poner fecha de inicio si no hay técnico asignado (ya deberías estar asignado)

**8.3 Registrar fecha de término**
- Campo "Fecha término" con selector de fecha
- Selecciona la fecha en que terminaste de trabajar
- **IMPORTANTE:** Al guardar con fecha de término, el estado cambia automáticamente de "En proceso" a "Terminada"

**8.4 Registrar horas reales trabajadas**
- Campo "Horas reales trabajadas"
- Ingresa el número de horas que trabajaste realmente en esta orden
- **OBLIGATORIO:** Si pones fecha de término, las horas son obligatorias
- Ejemplo: Si trabajaste 3.5 horas, ingresa 3.5

**8.5 Seleccionar material utilizado**
- Dropdown "Material utilizado" con catálogo de materiales
- Selecciona el material que usaste para esta orden
- Si tu material no está en la lista, selecciona "Otro" y escribe el nombre
- **OBLIGATORIO:** Debes seleccionar material antes de guardar

**8.6 Agregar comentarios**
- Campo de texto libre para observaciones
- Puedes escribir cualquier información relevante sobre tu trabajo
- Ejemplos:
  - "Se verificó dimensiones con calibrador — OK"
  - "Pieza requirió ajuste adicional en el torno"
  - "Material suministrado por el solicitante"
- Los comentarios se registran en el historial solo si el texto cambió

**8.7 Guardar tu avance**
- Hacer clic en "Guardar avance"
- El sistema valida:
  - Que tengas fecha de inicio
  - Que hayas seleccionado material
  - Si pones fecha de término, que las horas estén ingresadas
- Si todo es correcto, se guarda y se actualiza la información
- **El modal NO se cierra** — puedes seguir trabajando en la misma orden

**8.8 Flujo típico de una orden**

| Paso | Acción | Resultado |
|---|---|---|
| 1 | Abrir orden → Mi avance | Ves los campos vacíos |
| 2 | Poner fecha de inicio | Al guardar → estado cambia a "En proceso" |
| 3 | Trabajar en la orden | (fuente del sistema) |
| 4 | Poner fecha término + horas | Al guardar → estado cambia a "Terminada" |
| 5 | Seleccionar material | Se guarda en la orden |
| 6 | Agregar comentario (opcional) | Se registra en historial |
| 7 | Guardar | Todo se actualiza |

**8.9 Errores comunes al guardar**

| Error | Causa | Solución |
|---|---|---|
| "Selecciona al menos un material" | No seleccionaste material | Seleccionar material del dropdown |
| "Las horas son obligatorias si hay fecha de término" | Pusiste fecha término sin horas | Ingresar horas trabajadas |
| "La fecha de inicio es obligatoria" | No pusiste fecha de inicio | Seleccionar fecha de inicio |

---

### CAPÍTULO 9 — DETALLE DE ORDEN: PESTAÑA HISTORIAL

**9.1 ¿Qué es el historial?**
- Es un registro cronológico de todos los eventos de la orden
- Te permite ver qué ha pasado con la orden desde que se creó
- Cada evento muestra: icono, nombre de quien lo registró, fecha/hora, y descripción

**9.2 Tipos de eventos**

| Evento | Icono | Qué significa |
|---|---|---|
| Recepción | 📥 | La orden fue creada |
| Asignación | 👤 | Se asignaron técnicos |
| Inicio | ▶️ | Se registró fecha de inicio |
| Comentario | 💬 | Se agregó o modificó un comentario |
| Autorización | ✅ | Se autorizó una urgencia (prioridad 1-2) |
| Cambio de estado | 🔄 | La orden cambió de estado |
| Material | 🔧 | Se cambió el material utilizado |
| Terminado | 🏁 | Se registró fecha de término |
| Entrega | 📦 | Se confirmó la entrega |

**9.3 Leer el historial**
- Los eventos se muestran de más reciente a más antiguo
- Cada evento tiene un color distintivo según su tipo
- La fecha y hora están en tu zona horaria local
- Los metadatos adicionales muestran detalles extra si aplican

**9.4 Consejo práctico**
- Revisa el historial para saber cuándo se asignó la orden
- Si necesitas saber quién autorizó una urgencia, revisa el historial
- El historial es permanente — no se puede editar ni borrar

---

### CAPÍTULO 10 — IMPRIMIR UNA ORDEN

**10.1 Abrir la impresión**
- En el detalle de la orden, hacer clic en "🖨 Imprimir" (esquina superior derecha del modal)
- Se abre una **nueva pestaña** del navegador con la vista previa de la orden

**10.2 Vista previa de impresión**
- Muestra la orden en formato BWI oficial (F-1100.C.03-02 Rev. 06)
- Contiene:
  - Encabezado: Logo BWI + "ORDEN DE TRABAJO PARA TALLER"
  - Datos del solicitante (nombre, empleado, área, departamento)
  - Datos de la pieza (nombre, SETC, plano, máquina, línea, cantidad)
  - Autorización (si aplica, con nombre y puesto del autorizador)
  - Descripción del trabajo
  - Datos del taller (fechas, horas, técnico, material, estado)
  - Comentarios
  - Firmas: Gerente Tool Room + Conformidad del Solicitante
  - Leyendas de prioridades

**10.3 Imprimir**
- En la nueva pestaña, hacer clic en el botón azul "🖨 Imprimir" (fijo arriba a la derecha)
- Se abre el diálogo de impresión del navegador
- Seleccionar impresora
- Seleccionar formato: Carta (8.5" x 11")
- Seleccionar orientación: Vertical (Portrait)
- Hacer clic en "Imprimir"

**10.4 Cerrar la vista previa**
- Cerrar la pestaña de impresión
- Volver a la pestaña del sistema — el modal sigue abierto
- Puedes seguir trabajando en la orden

**10.5 Consejo práctico**
- Imprime la orden cuando la termines — es tu comprobante de entrega
- Guarda una copia impresa por si hay disputas posteriores
- Si la impresión sale mal, verifica la configuración de la impresora

---

### CAPÍTULO 11 — MI RENDIMIENTO: KPIs

**11.1 Acceder a Mi Rendimiento**
- Hacer clic en "Mi Rendimiento" en la parte superior del portal
- Se muestra tu panel personal de productividad

**11.2 Tarjetas de indicadores**
- 4 tarjetas con tus métricas:
  - **Horas semana:** horas trabajadas esta semana vs horas disponibles
  - **Horas mes:** horas trabajadas este mes vs horas disponibles
  - **Aprovechamiento semana:** porcentaje de eficiencia semanal
  - **Aprovechamiento mes:** porcentaje de eficiencia mensual

**11.3 Entender tus números**

| Turno | Horas/día | Horas/semana | Horas/mes |
|---|---|---|---|
| 1° Turno | 8 hrs | 40 hrs | 160 hrs |
| 2° Turno | 7.5 hrs | 37.5 hrs | 150 hrs |

Ejemplo (1° Turno):
- Si trabajaste 32 horas esta semana → 32/40 = 80% aprovechamiento
- Si trabajaste 120 horas este mes → 120/160 = 75% aprovechamiento

---

### CAPÍTULO 12 — MI RENDIMIENTO: GRÁFICAS

**12.1 Gráfica de barras**
- Muestra Horas Trabajadas vs Horas Disponibles
- 2 barras: Semana y Mes
- Te permite comparar visualmente tu rendimiento
- La barra de horas disponibles es el máximo que puedes trabajar
- La barra de horas trabajadas es lo que realmente trabajaste

**12.2 Barras de eficiencia**
- 2 barras de progreso: Semana y Mes
- Colores según tu porcentaje:
  - 🟢 Verde: ≥80% (Óptimo — buen desempeño)
  - 🟡 Amarillo: 50-79% (Aceptable — hay espacio de mejora)
  - 🔴 Rojo: <50% (Bajo — revisar carga de trabajo)

**12.3 Interpretar tu rendimiento**
- Si estás en verde: ¡buen trabajo! Mantén el ritmo
- Si estás en amarillo: estás bien, pero puedes mejorar
- Si estás en rojo: puede que tengas pocas órdenes asignadas o que no estés registrando tu avance correctamente
- Habla con tu administrador si crees que tus métricas no son correctas

**12.4 Consejos para mejorar tu rendimiento**
- Registra tu avance el mismo día que trabajes en la orden
- No dejes órdenes sin actualizar por varios días
- Si terminaste una orden, pon fecha de término inmediatamente
- Si trabajaste 3 horas en una orden, registra 3 horas exactas
- Actualiza el material utilizado cuando cambies de material

---

### CAPÍTULO 13 — CERRAR SESIÓN

**13.1 ¿Cuándo cerrar sesión?**
- Al finalizar tu turno
- Cuando vayas a usar otra computadora
- Cuando alguien más va a usar la misma computadora
- Si te vas a ausentar por un tiempo prolongado

**13.2 Cómo cerrar sesión**
- Ubicar el botón "Salir" en la esquina superior derecha
- Hacer clic en "Salir"
- Confirmar que regresaste a la pantalla de login

**13.3 ¿Por qué es importante cerrar sesión?**
- Si no cierras sesión, otro usuario podría ver tus órdenes
- En computadoras compartidas, esto es especialmente importante
- Cerrar sesión protege tu información y la del sistema

---

### CAPÍTULO 14 — PROBLEMAS COMUNES Y SOLUCIONES

**14.1 No puedo iniciar sesión**
- Verificar que tu número de empleado sea correcto (5 dígitos)
- Verificar que tu PIN sea correcto (4 dígitos)
- Si no recuerdas tu PIN, contacta a tu administrador
- Si tu cuenta está desactivada, contacta a tu administrador

**14.2 No puedo guardar mi avance**
- Verificar que tengas fecha de inicio
- Verificar que hayas seleccionado material
- Si pones fecha de término, verificar que las horas estén ingresadas
- Verificar conexión a internet
- Intentar recargar la página (Ctrl+Shift+R)

**14.3 La orden no cambia de estado automáticamente**
- Verificar que hayas dado clic en "Guardar" después de poner las fechas
- Verificar que la fecha de inicio esté completa (año-mes-día)
- Verificar que hayas seleccionado material
- Verificar que las horas estén ingresadas si pusiste fecha de término
- Si nada funciona, recargar la página e intentar de nuevo

**14.4 El plano no se muestra**
- Verificar que el archivo se haya subido correctamente
- Formatos soportados: PDF, JPG, PNG
- Intentar recargar la página (Ctrl+Shift+R)
- Si el problema persiste, contacta a tu administrador

**14.5 No puedo cerrar el modal de detalle**
- Presionar la tecla Escape
- Hacer clic en "✕ Cerrar" en la parte superior derecha
- Hacer clic fuera del modal (en el fondo oscuro)
- Si nada funciona, recargar la página

**14.6 La gráfica de rendimiento no muestra datos**
- Verificar que tengas órdenes con horas registradas
- Verificar que las horas estén en el rango de la semana o mes actual
- Los datos se actualizan al recargar la página

**14.7 No puedo imprimir la orden**
- Verificar que se abrió una nueva pestaña
- Verificar que tu impresora esté encendida y conectada
- Verificar que el navegador permita ventanas emergentes
- Intentar con otro navegador (Chrome o Edge)

**14.8 La página se ve extraña o no carga bien**
- Presionar Ctrl+Shift+R para recargar limpiando caché
- Verificar conexión a internet
- Intentar con otro navegador
- Si el problema persiste, contactar al administrador

---

### CAPÍTULO 15 — CONSEJOS PARA UN BUEN DESEMPEÑO

**15.1 Al inicio de tu turno**
1. Iniciar sesión en el portal
2. Revisar la sección "Nuevas" para ver órdenes pendientes
3. Priorizar órdenes por prioridad (1 es más urgente que 5)
4. Revisar la descripción y el plano de cada orden antes de empezar

**15.2 Durante tu trabajo**
1. Registrar fecha de inicio cuando empieces a trabajar
2. Actualizar material si cambias de material
3. Agregar comentarios sobre tu progreso
4. Si tienes dudas, consulta a tu administrador

**15.3 Al terminar una orden**
1. Registrar fecha de término
2. Ingresar horas reales trabajadas
3. Verificar que el material sea correcto
4. Guardar los cambios
5. Imprimir la orden si es necesario

**15.4 Al finalizar tu turno**
1. Verificar que todas tus órdenes tengan avance actualizado
2. Revisar tu rendimiento en "Mi Rendimiento"
3. Cerrar sesión
4. Si usaste computadora compartida, verificar que cerraste sesión

**15.5 Errores frecuentes que debes evitar**
- No registrar avance sin haber trabajado realmente
- No poner horas diferentes a las reales
- No olvidar seleccionar material
- No dejar órdenes sin actualizar por varios días
- No compartir tu PIN con otros empleados

---

### CAPÍTULO 16 — GLOSARIO

| Término | Definición |
|---|---|
| BWI TOOLROOM | Nombre del sistema de gestión de órdenes |
| Tooling | Departamento de Taller de Máquinas y Herramientas |
| Portal del Técnico | Aplicación web dedicada para técnicos |
| PIN | Personal Identification Number — Número de identificación personal (4 dígitos) |
| Folio | Número único de identificación de la orden (ej. BWI-2025-00123) |
| SETC | Número de identificación de pieza (8 dígitos) |
| KPI | Key Performance Indicator — Indicador clave de desempeño |
| Avance | Registro de progreso en una orden (fechas, horas, material, comentarios) |
| Historial | Timeline cronológica de eventos de una orden |
| Prioridad | Nivel de urgencia de la orden (1-5) |
| Seguimiento | Registro continuo del avance de una orden |
| Multi-técnico | Una orden puede tener varios técnicos asignados |
| 1° Turno | Turno de 8 horas (8h/día, 40h/sem, 160h/mes) |
| 2° Turno | Turno de 7.5 horas (7.5h/día, 37.5h/sem, 150h/mes) |
| Aprovechamiento | Porcentaje de horas trabajadas vs horas disponibles |
| Material | Insumo utilizado para trabajar en la pieza |
| Plano | Documento técnico con especificaciones de la pieza |
| Modal | Ventana emergente que se abre sobre la página principal |

---

### CAPÍTULO 17 — APÉNDICE

**17.1 Atajos de teclado**

| Atajo | Acción |
|---|---|
| Ctrl+Shift+R | Recargar página (limpiar caché) |
| Escape | Cerrar modal abierto |
| Enter | Enviar formulario de login |

**17.2 Formato de impresión BWI**

| Campo | Valor |
|---|---|
| Formulario | F-1100.C.03-02 Rev. 06 |
| Tamaño | Carta (8.5" x 11") |
| Margen | 10mm |
| Encabezado | Logo BWI + "ORDEN DE TRABAJO PARA TALLER" |
| Firmas | Gerente Tool Room + Conformidad del Solicitante |

**17.3 Colores del sistema**

| Color | Hex | Significado |
|---|---|---|
| Accent Blue | #3B82F6 | Botones principales, links |
| Success Green | #22C55E | Estados exitosos, KPIs positivos |
| Danger Red | #EF4444 | Errores, alertas, prioridad 1 |
| Warn Amber | #F59E0B | Advertencias, prioridad 3 |
| Purple | #8B5CF6 | Estado entregada |
| Background | #0F1117 | Fondo principal (dark theme) |
| Surface | #181C25 | Superficies de tarjetas |
| Text | #F1F5F9 | Texto principal |
| Muted | #6B7280 | Texto secundario |

**17.4 Contacto de soporte**
- Si tienes problemas con el sistema, contacta a tu administrador
- Si no tienes PIN o tu cuenta está desactivada, contacta a tu administrador
- Si necesitas capacitación adicional, solicítala a tu supervisor

---

Genera el manual completo en formato Markdown estructurado, listo para copiarse a un editor de texto o convertirse a PDF. Incluye todas las secciones, tablas, diagramas de flujo, y notas. Cada capítulo numerado. Incluye indicadores de dónde insertar capturas de pantalla ["📸 Insertar captura: [descripción de lo que se ve]"].
