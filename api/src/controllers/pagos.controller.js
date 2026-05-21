import {
  findPagos,
  findPagoById,
  findPagoByFolio,
  createPago,
  updatePago,
  getPagosStats,
  getIngresosMensualesGrafica,
  getLastPagoId,
  checkDuplicatePago
} from '../models/pago.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

/**
 * Obtener todos los pagos con filtros de búsqueda.
 */
export const obtenerPagos = asyncHandler(async (req, res) => {
  const { search, tipo, estado, fechaInicio, fechaFin } = req.query;
  const pagos = await findPagos({ search, tipo, estado, fechaInicio, fechaFin });
  res.json({ pagos });
});

/**
 * Obtener un pago específico por ID.
 */
export const obtenerPagoPorId = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const pago = await findPagoById(id);
  
  if (!pago) {
    throw new AppError(404, 'Pago no encontrado.');
  }

  res.json({ pago });
});

/**
 * Registrar un nuevo pago con folio automático y protección contra duplicados.
 */
export const registrarPago = asyncHandler(async (req, res) => {
  const {
    usuario_id,
    alumno_nombre,
    matricula,
    tipo,
    monto,
    fecha_pago,
    estado,
    metodo_pago,
    observaciones,
    bypass_duplicate
  } = req.body;

  // 1. Validaciones básicas
  if (!alumno_nombre || String(alumno_nombre).trim() === '') {
    throw new AppError(400, 'El nombre del alumno es obligatorio.');
  }

  if (!tipo) {
    throw new AppError(400, 'El tipo de pago es obligatorio.');
  }

  const tiposValidos = ['uniforme', 'examen', 'inscripcion', 'reinscripcion', 'practica', 'credencial', 'periodo'];
  if (!tiposValidos.includes(tipo)) {
    throw new AppError(400, 'El concepto o tipo de pago seleccionado no es válido.');
  }

  const valorMonto = Number(monto);
  if (isNaN(valorMonto) || valorMonto <= 0) {
    throw new AppError(400, 'El monto debe ser un número mayor a cero.');
  }

  if (!fecha_pago) {
    throw new AppError(400, 'La fecha de pago es obligatoria.');
  }

  // 2. Control de duplicados (evitar el mismo cobro accidentalmente en menos de 15 minutos)
  if (!bypass_duplicate) {
    const duplicado = await checkDuplicatePago(String(alumno_nombre).trim(), tipo, valorMonto);
    if (duplicado) {
      return res.status(409).json({
        status: 'fail',
        isDuplicate: true,
        message: `Se detectó un pago reciente idéntico con folio ${duplicado.folio} registrado hace menos de 15 minutos. ¿Deseas guardarlo de todas formas?`,
        duplicado
      });
    }
  }

  // 3. Generación de folio automático y secuencial
  const lastId = await getLastPagoId();
  const nextId = lastId + 1;
  const fechaObj = new Date(fecha_pago);
  const anio = isNaN(fechaObj.getFullYear()) ? new Date().getFullYear() : fechaObj.getFullYear();
  let folio = `IAR-PAG-${anio}-${String(nextId).padStart(5, '0')}`;

  // Doble validación de folio por seguridad extrema
  let existingPagoByFolio = await findPagoByFolio(folio);
  let attempts = 0;
  while (existingPagoByFolio && attempts < 10) {
    attempts += 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    folio = `IAR-PAG-${anio}-${String(nextId + attempts).padStart(5, '0')}-${randomSuffix}`;
    existingPagoByFolio = await findPagoByFolio(folio);
  }

  // 4. Crear el pago
  const nuevoPago = await createPago({
    folio,
    usuario_id: usuario_id ? Number(usuario_id) : null,
    alumno_nombre: String(alumno_nombre).trim(),
    matricula: matricula ? String(matricula).trim() : null,
    tipo,
    monto: valorMonto,
    fecha_pago,
    estado: estado || 'pagado',
    metodo_pago: metodo_pago || 'efectivo',
    observaciones
  });

  res.status(201).json({
    message: 'Pago registrado correctamente.',
    pago: nuevoPago
  });
});

/**
 * Editar un pago existente.
 */
export const editarPago = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const changes = req.body;

  const existingPago = await findPagoById(id);
  if (!existingPago) {
    throw new AppError(404, 'Pago no encontrado.');
  }

  if (changes.monto) {
    const valorMonto = Number(changes.monto);
    if (isNaN(valorMonto) || valorMonto <= 0) {
      throw new AppError(400, 'El monto debe ser un número mayor a cero.');
    }
    changes.monto = valorMonto;
  }

  const pagoActualizado = await updatePago(id, changes);
  
  res.json({
    message: 'Pago actualizado correctamente.',
    pago: pagoActualizado
  });
});

/**
 * Cancelar un pago cambiando su estado a 'cancelado'.
 */
export const cancelarPago = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { observaciones } = req.body;

  const existingPago = await findPagoById(id);
  if (!existingPago) {
    throw new AppError(404, 'Pago no encontrado.');
  }

  const cancelNotes = observaciones 
    ? `${existingPago.observaciones || ''} [Cancelado: ${observaciones}]`
    : `${existingPago.observaciones || ''} [Pago cancelado por el contador]`;

  const pagoCancelado = await updatePago(id, { 
    estado: 'cancelado',
    observaciones: cancelNotes.trim()
  });

  res.json({
    message: 'Pago cancelado correctamente.',
    pago: pagoCancelado
  });
});

/**
 * Obtener estadísticas financieras para el Dashboard.
 */
export const obtenerEstadisticas = asyncHandler(async (req, res) => {
  const stats = await getPagosStats();
  const grafica = await getIngresosMensualesGrafica();

  res.json({
    stats,
    grafica
  });
});
