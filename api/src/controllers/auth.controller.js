import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUsuarioAuthByEmail, findUsuarioAuthByMatricula, createUsuario, updateUsuarioLastLogin } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isAllowedRole, normalizeRole } from '../utils/role.js';

const STAFF_ROLES = ['admin', 'profesor', 'contador', 'cobranza', 'jefe', 'director', 'coordinadora', 'asesor_academico'];

function serializeUser(user) {
  return {
    id: user.id,
    matricula: user.matricula,
    nombre: user.nombre,
    apellido: user.apellido,
    correo_electronico: user.correo_electronico,
    rol: normalizeRole(user.rol),
    last_login: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

function validateRequiredFields(fields) {
  const missing = fields.filter((field) => !field || String(field).trim() === '');

  if (missing.length > 0) {
    throw new AppError(400, 'Debes completar todos los campos requeridos.');
  }
}

async function generateUniqueMatricula() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const matricula = String(Math.floor(100000 + Math.random() * 900000));
    const existingUser = await findUsuarioAuthByMatricula(matricula);

    if (!existingUser) {
      return matricula;
    }
  }

  throw new AppError(500, 'No fue posible generar una matrícula única.');
}

async function createStudentPayload({ nombre, apellido, correo_electronico, contrasena, rol }) {
  const matricula = await generateUniqueMatricula();
  const hashedPassword = await bcrypt.hash(String(contrasena), 10);

  return createUsuario({
    matricula,
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    correo_electronico: String(correo_electronico).trim().toLowerCase(),
    contrasena: hashedPassword,
    rol
  });
}

async function createStaffPayload({ nombre, apellido, correo_electronico, contrasena, rol }) {
  const hashedPassword = await bcrypt.hash(String(contrasena), 10);

  return createUsuario({
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    correo_electronico: String(correo_electronico).trim().toLowerCase(),
    contrasena: hashedPassword,
    rol
  });
}

function createToken(user) {
  return jwt.sign(
    {
      nombre: user.nombre,
      apellido: user.apellido,
      correo_electronico: user.correo_electronico,
      matricula: user.matricula,
      rol: normalizeRole(user.rol)
    },
    env.jwtSecret,
    {
      subject: String(user.id),
      expiresIn: env.jwtExpiresIn
    }
  );
}

async function authenticateByCredential({ credential, contrasena, allowedRoles, lookup }) {
  validateRequiredFields([credential, contrasena]);

  const normalizedCredential = String(credential).trim().toLowerCase();
  const user = await lookup(normalizedCredential);

  if (!user) {
    throw new AppError(401, 'Credenciales inválidas.');
  }

  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  if (!normalizedAllowedRoles.includes(normalizeRole(user.rol))) {
    throw new AppError(403, 'Este acceso no corresponde a tu rol.');
  }

  const isPasswordValid = await bcrypt.compare(String(contrasena), user.contrasena);

  if (!isPasswordValid) {
    throw new AppError(401, 'Credenciales inválidas.');
  }

  const token = createToken(user);
  await updateUsuarioLastLogin(user.id);

  return {
    message: 'Inicio de sesión exitoso.',
    token,
    user: serializeUser(user)
  };
}

export const register = asyncHandler(async (req, res) => {
  const { nombre, apellido, correo_electronico, contrasena, rol = 'estudiante' } = req.body;

  validateRequiredFields([nombre, apellido, correo_electronico, contrasena]);

  const normalizedEmail = String(correo_electronico).trim().toLowerCase();
  const normalizedRole = normalizeRole(rol);

  if (!isAllowedRole(normalizedRole)) {
    throw new AppError(400, 'El rol enviado no es válido.');
  }

  const existingUser = await findUsuarioAuthByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(409, 'Ya existe un usuario con ese correo electrónico.');
  }

  const createdUser = normalizedRole === 'estudiante'
    ? await createStudentPayload({ nombre, apellido, correo_electronico: normalizedEmail, contrasena, rol: normalizedRole })
    : await createStaffPayload({ nombre, apellido, correo_electronico: normalizedEmail, contrasena, rol: normalizedRole });

  res.status(201).json({
    message: 'Usuario registrado correctamente.',
    user: serializeUser(createdUser)
  });
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { matricula, contrasena } = req.body;

  const payload = await authenticateByCredential({
    credential: matricula,
    contrasena,
    allowedRoles: ['estudiante'],
    lookup: findUsuarioAuthByMatricula
  });

  res.json(payload);
});

export const loginStaff = asyncHandler(async (req, res) => {
  const { correo_electronico, contrasena } = req.body;

  const payload = await authenticateByCredential({
    credential: correo_electronico,
    contrasena,
    allowedRoles: STAFF_ROLES,
    lookup: findUsuarioAuthByEmail
  });

  res.json(payload);
});

export const login = asyncHandler(async (req, res) => {
  const { correo_electronico, matricula, contrasena } = req.body;

  if (typeof matricula !== 'undefined' && String(matricula).trim() !== '') {
    const payload = await authenticateByCredential({
      credential: matricula,
      contrasena,
      allowedRoles: ['estudiante'],
      lookup: findUsuarioAuthByMatricula
    });

    return res.json(payload);
  }

  const payload = await authenticateByCredential({
    credential: correo_electronico,
    contrasena,
    allowedRoles: STAFF_ROLES,
    lookup: findUsuarioAuthByEmail
  });

  return res.json(payload);
});