import express from 'express';
import {
  crearHorario,
  listarHorarios,
  tableroHorarios,
  obtenerHorario,
  actualizarHorario,
  eliminarHorario,
  asignarDocente,
  listarAsignaciones
} from '../controllers/coordinador.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
  crearMateria,
  listarMaterias,
  asignarMateria,
  crearContenido,
  listarContenido,
  listarMateriasWithDocentes
} from '../controllers/materia.controller.js';
import {
  asignarHorarioMateriasDocente,
  obtenerHorariosMateriasDocente,
  eliminarHorariosMateriasDocente
} from '../controllers/materia-docente-horario.controller.js';
import { getDocentes } from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticateToken);

// Only coordinadora and admin can manage horarios
router.get('/horarios', authorizeRoles('coordinadora', 'admin'), listarHorarios);
router.get('/tablero-horarios', authorizeRoles('coordinadora', 'admin'), tableroHorarios);
router.post('/horarios', authorizeRoles('coordinadora', 'admin'), crearHorario);
router.get('/horarios/:id', authorizeRoles('coordinadora', 'admin'), obtenerHorario);
router.put('/horarios/:id', authorizeRoles('coordinadora', 'admin'), actualizarHorario);
router.delete('/horarios/:id', authorizeRoles('coordinadora', 'admin'), eliminarHorario);

// Assignments
router.post('/horarios/:id/asignar', authorizeRoles('coordinadora', 'admin'), asignarDocente);
router.get('/horarios/:id/asignaciones', authorizeRoles('coordinadora', 'admin'), listarAsignaciones);

router.get('/materias', authorizeRoles('coordinadora', 'admin'), listarMaterias);
router.get('/materias-asignadas', authorizeRoles('coordinadora', 'admin'), listarMateriasWithDocentes);
router.post('/materias', authorizeRoles('coordinadora', 'admin'), crearMateria);
router.post('/materias/:id/asignar', authorizeRoles('coordinadora', 'admin'), asignarMateria);

router.post('/materias/:id/contenido', authorizeRoles('coordinadora', 'admin'), crearContenido);
router.get('/materias/:id/contenido', authorizeRoles('coordinadora', 'admin'), listarContenido);

router.get('/docentes', authorizeRoles('coordinadora', 'admin'), getDocentes);

// Materia-Docente Horarios
router.post('/materia-docente/horario', authorizeRoles('coordinadora', 'admin'), asignarHorarioMateriasDocente);
router.get('/materia-docente/horarios', authorizeRoles('coordinadora', 'admin'), obtenerHorariosMateriasDocente);
router.delete('/materia-docente/horario', authorizeRoles('coordinadora', 'admin'), eliminarHorariosMateriasDocente);

export default router;
