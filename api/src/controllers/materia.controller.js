import {
  createMateria,
  findAllMaterias,
  findMateriaById,
  findOrCreateMateria,
  assignMateriaToDocente,
  findMateriasByDocente,
  findMateriasWithDocentes
} from '../models/materia.model.js';
import { createContenido, findContenidoByMateria, findContenidoById } from '../models/materia-contenido.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const crearMateria = asyncHandler(async (req, res) => {
  const data = req.body;
  data.creado_por = Number(req.user.id);
  const materia = await createMateria(data);
  res.status(201).json({ materia });
});

export const listarMaterias = asyncHandler(async (req, res) => {
  const { nivel } = req.query;
  const materias = await findAllMaterias({ nivel });
  res.json({ materias });
});

export const listarMateriasWithDocentes = asyncHandler(async (req, res) => {
  const { nivel } = req.query;
  const materias = await findMateriasWithDocentes({ nivel });
  res.json({ materias });
});

export const asignarMateria = asyncHandler(async (req, res) => {
  const materiaIdParam = Number(req.params.id);
  const { docente_id, grupo_id, nombre, nivel, descripcion } = req.body;

  const materia = Number.isFinite(materiaIdParam) && materiaIdParam > 0
    ? await findMateriaById(materiaIdParam)
    : await findOrCreateMateria({
        nombre,
        nivel,
        descripcion,
        creado_por: Number(req.user.id)
      });

  if (!materia) {
    throw new Error('No fue posible resolver la materia para asignación.');
  }

  const asignacion = await assignMateriaToDocente({
    materia_id: materia.id,
    docente_id: Number(docente_id),
    grupo_id: grupo_id ? Number(grupo_id) : null
  });
  res.status(201).json({ asignacion });
});

export const crearContenido = asyncHandler(async (req, res) => {
  const materia_id = Number(req.params.id);
  const data = req.body;
  data.materia_id = materia_id;
  data.creado_por = Number(req.user.id);
  const contenido = await createContenido(data);
  res.status(201).json({ contenido });
});

export const listarContenido = asyncHandler(async (req, res) => {
  const materia_id = Number(req.params.id);
  const contenidos = await findContenidoByMateria(materia_id);
  res.json({ contenidos });
});

export const verContenido = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const contenido = await findContenidoById(id);
  if (!contenido) return res.status(404).json({ message: 'Contenido no encontrado' });
  res.json({ contenido });
});

export const listarMateriasDocente = asyncHandler(async (req, res) => {
  const docenteId = Number(req.user.id);
  const materias = await findMateriasByDocente(docenteId);
  res.json({ materias });
});
