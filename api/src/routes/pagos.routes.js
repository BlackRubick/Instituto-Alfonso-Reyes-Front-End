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

// Solo el rol de 'contador' o 'admin' pueden gestionar los pagos
router.get('/', authorizeRoles('contador', 'admin'), obtenerPagos);
router.get('/stats', authorizeRoles('contador', 'admin'), obtenerEstadisticas);
router.post('/', authorizeRoles('contador', 'admin'), registrarPago);
router.get('/:id', authorizeRoles('contador', 'admin'), obtenerPagoPorId);
router.put('/:id', authorizeRoles('contador', 'admin'), editarPago);
router.put('/:id/cancelar', authorizeRoles('contador', 'admin'), cancelarPago);

export default router;
