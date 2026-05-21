import { Router } from 'express';
import {
  obtenerPagos,
  obtenerPagoPorId,
  registrarPago,
  editarPago,
  cancelarPago,
  obtenerEstadisticas
} from '../controllers/pagos.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = Router();

// Todos los endpoints de pagos requieren token válido
router.use(authenticateToken);

// Permitir que roles de gestión financiera y dirección puedan acceder
router.get('/', authorizeRoles('contador', 'admin', 'jefe', 'director'), obtenerPagos);
router.get('/stats', authorizeRoles('contador', 'admin', 'jefe', 'director'), obtenerEstadisticas);
router.post('/', authorizeRoles('contador', 'admin', 'jefe', 'director'), registrarPago);
router.get('/:id', authorizeRoles('contador', 'admin', 'jefe', 'director'), obtenerPagoPorId);
router.put('/:id', authorizeRoles('contador', 'admin', 'jefe', 'director'), editarPago);
router.put('/:id/cancelar', authorizeRoles('contador', 'admin', 'jefe', 'director'), cancelarPago);

export default router;
