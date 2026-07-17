// ============================================================
//  BWI TOOLING — Cliente Supabase  v5.0
//  src/lib/supabase.js
// ============================================================

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Faltan las variables de entorno de Supabase. Revisa tu archivo .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export const ROLES_CON_PIN = ['administrador', 'superadmin', 'tecnico']

// ── Detecta si el empleado necesita PIN ──────────────────────
export async function necesitaPin(no_empleado) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('no_empleado', no_empleado.trim())
    .eq('activo', true)
    .maybeSingle()

  if (error || !data) return null
  return ROLES_CON_PIN.includes(data.rol)
}

// ============================================================
//  AUTH
// ============================================================

export async function loginSinPin(no_empleado) {
  const { data, error } = await supabase
    .rpc('registro_automatico', { p_no_empleado: no_empleado.trim() })

  if (error) {
    console.error('registro_automatico error:', error)
    return { usuario: null, error: 'Error de conexión.' }
  }
  if (!data || !data.length) return { usuario: null, error: 'No se pudo registrar.' }

  const usuario = {
    id:              data[0].id,
    no_empleado:     data[0].no_empleado,
    nombre_completo: data[0].nombre_completo,
    rol:             data[0].rol,
    area_codigo:     data[0].area_codigo,
    departamento:    data[0].departamento,
  }

  if (ROLES_CON_PIN.includes(usuario.rol)) {
    return { usuario: null, error: 'Este acceso es solo para administradores. Usa tu PIN.' }
  }

  sessionStorage.setItem('bwi_usuario', JSON.stringify(usuario))
  return { usuario, error: null }
}

export async function loginConPin(no_empleado, pin) {
  const { data, error } = await supabase
    .rpc('verificar_login', {
      p_no_empleado: no_empleado.trim(),
      p_pin:         pin.trim(),
    })

  if (error) {
    console.error('verificar_login error:', error)
    return { usuario: null, error: 'Error de conexión.' }
  }
  if (!data || !data.length) return { usuario: null, error: 'Número de empleado o PIN incorrecto.' }

  const usuario = data[0]
  sessionStorage.setItem('bwi_usuario', JSON.stringify(usuario))
  return { usuario, error: null }
}

export async function cambiarPin(usuario_id, pin_nuevo) {
  if (pin_nuevo.length < 4)     return { ok: false, error: 'El PIN debe tener al menos 4 dígitos.' }
  if (!/^\d+$/.test(pin_nuevo)) return { ok: false, error: 'El PIN solo puede contener números.' }

  const { error } = await supabase
    .rpc('cambiar_pin', { p_usuario_id: usuario_id, p_pin_nuevo: pin_nuevo })

  if (error) return { ok: false, error: 'No se pudo cambiar el PIN.' }

  const sesion = obtenerSesion()
  if (sesion) sessionStorage.setItem('bwi_usuario', JSON.stringify({ ...sesion, debe_cambiar_pin: false }))
  return { ok: true, error: null }
}

export function obtenerSesion() {
  try { return JSON.parse(sessionStorage.getItem('bwi_usuario')) } catch { return null }
}

export function cerrarSesion() {
  sessionStorage.removeItem('bwi_usuario')
}

// ============================================================
//  USUARIOS
// ============================================================

export async function listarUsuarios() {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, no_empleado, nombre_completo, rol, departamento, activo, creado_en, ultimo_acceso, areas(codigo, nombre)')
    .order('nombre_completo')
  return { data: data ?? [], error }
}

export async function crearUsuario({ no_empleado, nombre_completo, rol, area_codigo, departamento, pin }) {
  const necesita = ROLES_CON_PIN.includes(rol)
  const payload = {
    no_empleado:      no_empleado.trim(),
    nombre_completo:  nombre_completo.trim(),
    rol,
    area_codigo:      area_codigo || null,
    departamento:     departamento?.trim() || null,
    debe_cambiar_pin: necesita,
  }
  if (necesita) {
    if (!pin || pin.length < 4) return { error: 'Este rol requiere un PIN de al menos 4 dígitos.' }
    const { data, error } = await supabase.rpc('crear_usuario_admin', {
      p_no_empleado:     payload.no_empleado,
      p_nombre_completo: payload.nombre_completo,
      p_rol:             rol,
      p_area_codigo:     payload.area_codigo,
      p_departamento:    payload.departamento,
      p_pin:             pin,
    })
    return { data, error }
  }
  const { data, error } = await supabase.from('usuarios').insert(payload).select().single()
  return { data, error }
}

export async function toggleUsuario(id, activo) {
  const { error } = await supabase.from('usuarios').update({ activo }).eq('id', id)
  return { error }
}

// ============================================================
//  ÓRDENES DE TRABAJO
// ============================================================

export async function crearOrden(datos, archivo = null) {
  let archivo_url = null, archivo_nombre = null

  if (archivo) {
    const ext  = archivo.name.split('.').pop()
    const ruta = `ordenes/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error: errStorage } = await supabase.storage.from('planos').upload(ruta, archivo)
    if (errStorage) return { data: null, error: 'No se pudo subir el archivo.' }
    const { data: urlData } = supabase.storage.from('planos').getPublicUrl(ruta)
    archivo_url    = urlData?.publicUrl ?? null
    archivo_nombre = archivo.name
  }

  const payload = {
    solicitante_id:   datos.solicitante_id,
    nombre_pieza:     datos.nombre_pieza,
    setc_numero:      datos.setc_numero    || null,
    no_plano:         datos.no_plano       || null,
    no_maquina:       datos.no_maquina     || null,
    linea_celda:      datos.linea_celda    || null,
    cantidad:         Number(datos.cantidad),
    descripcion:      datos.descripcion,
    prioridad:        datos.prioridad,
    es_orden_manual:  datos.es_orden_manual  ?? false,
    capturado_por_id: datos.capturado_por_id ?? null,
    archivo_url,
    archivo_nombre,
  }

  if (datos.folio_manual) {
    payload.no_orden = Number(datos.folio_manual)
  }

  const { data, error } = await supabase
    .from('ordenes_trabajo')
    .insert(payload)
    .select()
    .single()

  if (!error && data) {
    await registrarEvento(data.no_orden, 'recepcion', null, datos.capturado_por_id || datos.solicitante_id)
  }

  return { data, error }
}

export async function obtenerOrdenes(filtros = {}) {
  let q = supabase.from('vista_ordenes').select('*').order('fecha_solicitud', { ascending: false })
  if (filtros.estado)    q = q.eq('estado', filtros.estado)
  if (filtros.prioridad) q = q.eq('prioridad', filtros.prioridad)
  if (filtros.busqueda) {
    const n = parseInt(filtros.busqueda)
    q = q.or(`nombre_pieza.ilike.%${filtros.busqueda}%,solicitante_nombre.ilike.%${filtros.busqueda}%${!isNaN(n) ? `,no_orden.eq.${n}` : ''}`)
  }
  const { data, error } = await q
  return { data: data ?? [], error }
}

export async function obtenerMisOrdenes(solicitante_id) {
  const { data, error } = await supabase
    .from('vista_ordenes')
    .select('*')
    .eq('solicitante_id', solicitante_id)
    .order('fecha_solicitud', { ascending: false })
  return { data: data ?? [], error }
}

// ── Órdenes asignadas a un técnico ──────────────────────────
export async function obtenerOrdenesTecnico(tecnico_id) {
  const { data, error } = await supabase
    .from('seguimiento_orden')
    .select('id, fecha_inicio, fecha_termino, tiempo_real_hrs, material_id, material_otro, comentarios, orden_id, ordenes_trabajo(*, solicitante:usuarios!solicitante_id(nombre_completo, no_empleado, departamento, area_codigo))')
    .eq('tecnico_id', tecnico_id)
    .order('fecha_registro', { ascending: false })
  return { data: data ?? [], error }
}

export async function obtenerPerfilTecnico(tecnico_id) {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, no_empleado, nombre_completo, departamento, turno')
    .eq('id', tecnico_id)
    .single()
  return { data, error }
}

export async function actualizarSeguimientoTecnico(seguimiento_id, campos) {
  const { error } = await supabase
    .from('seguimiento_orden')
    .update(campos)
    .eq('id', seguimiento_id)
  return { error }
}

export async function actualizarEstado(no_orden, estado_nuevo, cambiado_por_id, comentario = null) {
  const { data: actual } = await supabase
    .from('ordenes_trabajo').select('estado').eq('no_orden', no_orden).single()

  const { error } = await supabase
    .from('ordenes_trabajo').update({ estado: estado_nuevo }).eq('no_orden', no_orden)

  if (!error) {
    let detalle = null
    if (estado_nuevo === 'terminada')     detalle = 'Trabajo finalizado.'
    else if (estado_nuevo === 'cancelada') detalle = 'Orden cancelada.'
    else if (estado_nuevo === 'en_proceso') detalle = 'Iniciando trabajo.'
    else if (comentario) detalle = comentario

    await registrarEvento(no_orden, 'cambio_estado', detalle, cambiado_por_id, {
      estado_anterior: actual?.estado ?? null,
      estado_nuevo,
    })
  }
  return { error }
}

export async function cargarSeguimiento(no_orden) {
  const { data, error } = await supabase
    .from('seguimiento_orden')
    .select('id, fecha_inicio, fecha_termino, tiempo_real_hrs, tecnico_id, material_id, material_otro, comentarios')
    .eq('orden_id', no_orden)
    .order('fecha_registro')
  return { data: data ?? [], error }
}

export async function guardarSeguimiento(no_orden, tecnicos, comentarios, material_id, material_otro, actualizado_por_id) {
  const { data: existentes } = await supabase
    .from('seguimiento_orden').select('id, tecnico_id, fecha_inicio, fecha_termino, material_id, material_otro, comentarios').eq('orden_id', no_orden)

  const existentesIds = (existentes ?? []).map(e => e.id)
  const incomingIds   = tecnicos.filter(t => t.id).map(t => t.id)

  const idsAEliminar = existentesIds.filter(id => !incomingIds.includes(id))
  if (idsAEliminar.length) {
    await supabase.from('seguimiento_orden').delete().in('id', idsAEliminar)
  }

  let error = null

  const normMat = (v) => (!v || v === '0' || v === 0) ? '' : String(v)
  const curMat  = normMat(material_id)
  const curOtro = material_otro || ''

  for (const tech of tecnicos) {
    const payload = {
      orden_id:        no_orden,
      fecha_inicio:    tech.fecha_inicio    || null,
      fecha_termino:   tech.fecha_termino   || null,
      ...(tech.tiempo_real_hrs != null && tech.tiempo_real_hrs !== "" && { tiempo_real_hrs: Number(tech.tiempo_real_hrs) }),
      tecnico_id:      tech.tecnico_id      || null,
      material_id:     material_id          || null,
      material_otro:   material_otro        || null,
      comentarios:     comentarios           || null,
      actualizado_por: actualizado_por_id,
    }

    if (tech.id) {
      const { error: e } = await supabase.from('seguimiento_orden').update(payload).eq('id', tech.id)
      if (e) error = e

      const existente = (existentes ?? []).find(ex => ex.id === tech.id)
      if (existente) {
        if (!existente.fecha_inicio && tech.fecha_inicio) {
          const nombre = (await supabase.from('usuarios').select('nombre_completo').eq('id', tech.tecnico_id).maybeSingle()).data?.nombre_completo ?? 'Técnico'
          await registrarEvento(no_orden, 'inicio', `${nombre} inició el trabajo.`, actualizado_por_id)
        }
        if (!existente.fecha_termino && tech.fecha_termino) {
          const nombre = (await supabase.from('usuarios').select('nombre_completo').eq('id', tech.tecnico_id).maybeSingle()).data?.nombre_completo ?? 'Técnico'
          await registrarEvento(no_orden, 'terminado', `${nombre} finalizó el trabajo.`, actualizado_por_id)
        }
      }
    } else {
      const { data, error: e } = await supabase.from('seguimiento_orden').insert(payload).select('id').single()
      if (e) error = e
      else {
        tech.id = data.id
        if (tech.tecnico_id) {
          const nombre = (await supabase.from('usuarios').select('nombre_completo').eq('id', tech.tecnico_id).maybeSingle()).data?.nombre_completo ?? 'Técnico'
          await registrarEvento(no_orden, 'asignacion', `Técnico asignado: ${nombre}.`, actualizado_por_id)
        }
      }
    }
  }

  const prevMatValues = (existentes ?? []).map(e => normMat(e.material_id)).filter(Boolean)
  const prevOtroValues = (existentes ?? []).map(e => e.material_otro || '').filter(Boolean)
  const matYaRegistrado = (curMat && prevMatValues.includes(curMat)) || (curOtro && prevOtroValues.includes(curOtro))
  const sinMaterial = !curMat && !curOtro && prevMatValues.length === 0 && prevOtroValues.length === 0
  const matCambio = !matYaRegistrado && !sinMaterial

  const prevComent = existentes?.[0]?.comentarios ?? null

  if (matCambio && (curMat || curOtro)) {
    const nombreMat = curOtro || (((await supabase.from('materiales').select('nombre').eq('id', material_id).maybeSingle()).data?.nombre) ?? material_id)
    await registrarEvento(no_orden, 'material', `Material registrado: ${nombreMat}.`, actualizado_por_id)
  }

  if (comentarios && String(comentarios) !== String(prevComent ?? '')) {
    await registrarEvento(no_orden, 'comentario', comentarios, actualizado_por_id)
  }

  return { error }
}

export async function obtenerUrlPlano(archivo_url) {
  const path = archivo_url?.split('/planos/')[1]
  if (!path) return { url: null, error: 'Archivo no encontrado.' }
  const { data, error } = await supabase.storage.from('planos').createSignedUrl(path, 3600)
  return { url: data?.signedUrl ?? null, error }
}

export async function actualizarPlano(orden_id, archivo) {
  const ext = archivo.name.split('.').pop()
  const ruta = `ordenes/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error: errStorage } = await supabase.storage.from('planos').upload(ruta, archivo)
  if (errStorage) return { error: 'No se pudo subir el archivo.' }
  const { data: urlData } = supabase.storage.from('planos').getPublicUrl(ruta)
  const archivo_url = urlData?.publicUrl ?? null
  const { error: errUpdate } = await supabase
    .from('ordenes_trabajo')
    .update({ archivo_url, archivo_nombre: archivo.name })
    .eq('no_orden', orden_id)
  if (errUpdate) return { error: 'Archivo subido pero no se pudo guardar.' }
  return { error: null, archivo_url, archivo_nombre: archivo.name }
}

// ============================================================
//  REGISTRO DE HORAS POR SESIÓN
// ============================================================

export async function agregarRegistroHoras(orden_id, tecnico_id, fecha, horas, comentario, creado_por) {
  const { data, error } = await supabase
    .from('registro_horas')
    .insert({ orden_id, tecnico_id, fecha, horas, comentario: comentario || null, creado_por })
    .select('id')
    .single()
  if (error) return { data: null, error }
  await actualizarTotalHoras(orden_id, tecnico_id)
  return { data, error: null }
}

export async function eliminarRegistroHoras(registroId, orden_id, tecnico_id) {
  const { error } = await supabase.from('registro_horas').delete().eq('id', registroId)
  if (error) return { error }
  await actualizarTotalHoras(orden_id, tecnico_id)
  return { error: null }
}

export async function obtenerRegistrosHoras(orden_id) {
  const { data, error } = await supabase
    .from('registro_horas')
    .select('id, fecha, horas, comentario, tecnico_id, creado_en')
    .eq('orden_id', orden_id)
    .order('fecha', { ascending: true })
  return { data: data ?? [], error }
}

export async function actualizarTotalHoras(orden_id, tecnico_id) {
  const { data } = await supabase
    .from('registro_horas')
    .select('horas')
    .eq('orden_id', orden_id)
    .eq('tecnico_id', tecnico_id)
  const total = (data ?? []).reduce((sum, r) => sum + Number(r.horas), 0)
  await supabase
    .from('seguimiento_orden')
    .update({ tiempo_real_hrs: total || null })
    .eq('orden_id', orden_id)
    .eq('tecnico_id', tecnico_id)
}

// ============================================================
//  GRÁFICAS
// ============================================================

export async function datosGraficaMes() {
  const { data } = await supabase.from('grafica_ordenes_por_mes').select('*')
  return data ?? []
}
export async function datosGraficaTecnicos() {
  const { data } = await supabase.from('grafica_carga_tecnico').select('*')
  return data ?? []
}
export async function datosGraficaPrioridades() {
  const { data } = await supabase.from('grafica_prioridades').select('*')
  return data ?? []
}

// ============================================================
//  CATÁLOGOS
// ============================================================

export async function obtenerMateriales() {
  const { data } = await supabase.from('materiales').select('*').eq('activo', true).order('nombre')
  return data ?? []
}
export async function obtenerAreas() {
  const { data } = await supabase.from('areas').select('*').eq('activo', true).order('codigo')
  return data ?? []
}
export async function obtenerTecnicos() {
  const { data } = await supabase
    .from('usuarios')
    .select('id, nombre_completo, no_empleado')
    .in('rol', ['tecnico', 'administrador', 'superadmin'])
    .eq('activo', true)
    .order('nombre_completo')
  return data ?? []
}

// ============================================================
//  HISTORIAL DE ORDEN
// ============================================================

export function parseFechaUTC(fechaStr) {
  if (!fechaStr) return new Date();
  const str = fechaStr.includes("Z") || fechaStr.includes("+") ? fechaStr : fechaStr + "Z";
  return new Date(str);
}

export async function registrarEvento(orden_id, evento_tipo, detalle = null, creado_por = null, extras = {}) {
  const payload = {
    orden_id,
    evento_tipo,
    detalle,
    creado_por,
    estado_anterior: extras.estado_anterior ?? null,
    estado_nuevo:    extras.estado_nuevo    ?? null,
  }
  const { error } = await supabase.from('historial_orden').insert(payload)
  if (error) console.error('registrarEvento error:', error)
  return { error }
}

export async function agregarComentarioHistorial(orden_id, detalle, creado_por) {
  return registrarEvento(orden_id, 'comentario', detalle, creado_por)
}

export async function cargarHistorial(orden_id) {
  const { data, error } = await supabase
    .from('historial_orden')
    .select('id, evento_tipo, estado_anterior, estado_nuevo, detalle, fecha_evento, creado_por, usuarios(nombre_completo)')
    .eq('orden_id', orden_id)
    .order('fecha_evento', { ascending: true })
  return { data: data ?? [], error }
}

let _logoCache = null
export async function obtenerLogoBase64() {
  if (_logoCache) return _logoCache
  try {
    const res = await fetch('/logo-bwi.png')
    const blob = await res.blob()
    const b64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
    _logoCache = b64
    return b64
  } catch { return null }
}
