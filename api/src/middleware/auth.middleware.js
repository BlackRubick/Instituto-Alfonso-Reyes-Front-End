import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { normalizeRole } from '../utils/role.js';

export function authenticateToken(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'No se proporcionó un token válido.'));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      correo_electronico: payload.correo_electronico,
      rol: normalizeRole(payload.rol),
      nombre: payload.nombre,
      apellido: payload.apellido
    };
    next();
  } catch {
    next(new AppError(401, 'Token inválido o expirado.'));
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (allowedRoles.length === 0) {
      return next();
    }

    if (!req.user) {
      return next(new AppError(401, 'No autenticado.'));
    }

    const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

    if (!normalizedAllowedRoles.includes(normalizeRole(req.user.rol))) {
      return next(new AppError(403, 'No tienes permisos para realizar esta acción.'));
    }

    return next();
  };
}