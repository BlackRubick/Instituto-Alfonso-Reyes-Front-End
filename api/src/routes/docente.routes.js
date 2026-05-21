import { Router } from 'express';
import { getMyAssignedGroups } from '../controllers/docente.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);
router.use(authorizeRoles('profesor'));

router.get('/grupos', getMyAssignedGroups);

export default router;
