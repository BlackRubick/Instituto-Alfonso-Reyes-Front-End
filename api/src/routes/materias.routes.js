import express from 'express';
import { listarMateriasDocente, listarContenido, verContenido } from '../controllers/materia.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Docente can list their materias and view contenido
router.get('/docente', authorizeRoles('profesor'), listarMateriasDocente);
router.get('/:id/contenido', authorizeRoles('profesor', 'coordinadora', 'admin'), listarContenido);
router.get('/contenido/:id', authorizeRoles('profesor', 'coordinadora', 'admin'), verContenido);

export default router;
