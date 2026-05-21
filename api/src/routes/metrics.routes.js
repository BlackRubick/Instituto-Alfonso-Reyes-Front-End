import express from 'express';
import { jefeMetrics, directorMetrics } from '../controllers/metrics.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/jefe', authorizeRoles('admin', 'jefe', 'director'), jefeMetrics);
router.get('/director', authorizeRoles('admin', 'director'), directorMetrics);

export default router;
