import { Router } from 'express';
import { login, loginStaff, loginStudent, register } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login-student', loginStudent);
router.post('/login-staff', loginStaff);

export default router;