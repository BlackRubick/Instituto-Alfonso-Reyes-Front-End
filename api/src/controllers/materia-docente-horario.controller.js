import {
  assignHorarioToMateriasDocente,
  getHorariosByMateriasDocente,
  getHorariosByDocente,
  deleteHorariosByMateriasDocente,
  initializeTable
} from '../models/materia-docente-horario.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Initialize table on app startup
initializeTable().catch(console.error);

export const asignarHorarioMateriasDocente = asyncHandler(async (req, res) => {
  const { materia_id, docente_id, dias, hora_inicio, hora_fin, aula } = req.body;

  if (!materia_id || !docente_id || !dias || !Array.isArray(dias) || dias.length === 0) {
    return res.status(400).json({ 
      message: 'Datos incompletos: se requieren materia_id, docente_id, dias (array), hora_inicio, hora_fin' 
    });
  }

  const horarios = await assignHorarioToMateriasDocente({
    materia_id: Number(materia_id),
    docente_id: Number(docente_id),
    dias,
    hora_inicio,
    hora_fin,
    aula
  });

  res.status(201).json({ horarios });
});

export const obtenerHorariosMateriasDocente = asyncHandler(async (req, res) => {
  const { materia_id, docente_id } = req.query;

  if (!materia_id || !docente_id) {
    return res.status(400).json({ message: 'Se requieren materia_id y docente_id' });
  }

  const horarios = await getHorariosByMateriasDocente(
    Number(materia_id),
    Number(docente_id)
  );

  res.json({ horarios });
});

export const obtenerHorariosDocente = asyncHandler(async (req, res) => {
  const docente_id = Number(req.user.id);
  const horarios = await getHorariosByDocente(docente_id);
  res.json({ horarios });
});

export const eliminarHorariosMateriasDocente = asyncHandler(async (req, res) => {
  const { materia_id, docente_id } = req.body;

  if (!materia_id || !docente_id) {
    return res.status(400).json({ message: 'Se requieren materia_id y docente_id' });
  }

  await deleteHorariosByMateriasDocente(
    Number(materia_id),
    Number(docente_id)
  );

  res.json({ message: 'Horarios eliminados correctamente' });
});
