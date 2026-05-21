import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { createUser, deleteUser, getDocentes, getEstudiantes, getProfile, getUserById, getUsers, updateUser } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/me', getProfile);
router.get('/', authorizeRoles('admin', 'jefe', 'director'), getUsers);
router.get('/docentes', authorizeRoles('coordinadora', 'admin'), getDocentes);
router.get('/estudiantes', authorizeRoles('contador', 'coordinadora', 'admin', 'jefe', 'director', 'asesor_academico'), getEstudiantes);
router.get('/:id', authorizeRoles('admin', 'jefe', 'director'), getUserById);
router.post('/', authorizeRoles('admin', 'jefe', 'director', 'asesor_academico'), createUser);
router.put('/:id', authorizeRoles('admin', 'jefe', 'director', 'asesor_academico'), updateUser);
router.delete('/:id', authorizeRoles('admin', 'jefe', 'director', 'asesor_academico'), deleteUser);

export default router;