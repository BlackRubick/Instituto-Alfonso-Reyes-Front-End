import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';
import { createUser, deleteUser, getDocentes, getProfile, getUserById, getUsers, updateUser } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticateToken);

router.get('/me', getProfile);
router.get('/', authorizeRoles('admin'), getUsers);
router.get('/docentes', authorizeRoles('coordinadora', 'admin'), getDocentes);
router.get('/:id', authorizeRoles('admin'), getUserById);
router.post('/', authorizeRoles('admin'), createUser);
router.put('/:id', authorizeRoles('admin'), updateUser);
router.delete('/:id', authorizeRoles('admin'), deleteUser);

export default router;