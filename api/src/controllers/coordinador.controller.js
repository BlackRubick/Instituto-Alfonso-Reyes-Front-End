import {
  createHorario,
  findAllHorarios,
  findHorarioById,
  updateHorario,
  deleteHorario,
  assignDocenteToHorario,
  findAsignacionesByHorario,
  findDashboardHorarioRows
} from '../models/horario.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const crearHorario = asyncHandler(async (req, res) => {
  const data = req.body;
  data.creado_por = Number(req.user.id);
  const horario = await createHorario(data);
  res.status(201).json({ horario });
});

export const listarHorarios = asyncHandler(async (req, res) => {
  const horarios = await findAllHorarios();
  res.json({ horarios });
});

export const tableroHorarios = asyncHandler(async (req, res) => {
  const rows = await findDashboardHorarioRows();
  res.json({ rows });
});

export const obtenerHorario = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const horario = await findHorarioById(id);
  if (!horario) return res.status(404).json({ message: 'Horario no encontrado' });
  res.json({ horario });
});

export const actualizarHorario = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const updated = await updateHorario(id, req.body);
  res.json({ horario: updated });
});

export const eliminarHorario = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const ok = await deleteHorario(id);
  res.json({ success: ok });
});

export const asignarDocente = asyncHandler(async (req, res) => {
  const horario_id = Number(req.params.id);
  const { docente_id, dia, hora_inicio, hora_fin, aula } = req.body;
  const asignacion = await assignDocenteToHorario({ horario_id, docente_id, dia, hora_inicio, hora_fin, aula });
  res.status(201).json({ asignacion });
});

export const listarAsignaciones = asyncHandler(async (req, res) => {
  const horario_id = Number(req.params.id);
  const asignaciones = await findAsignacionesByHorario(horario_id);
  res.json({ asignaciones });
});
