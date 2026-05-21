import bcrypt from 'bcryptjs';
import { findUsuarioById, findUsuarios, findUsuariosByRole, findUsuarioAuthByEmail, findUsuarioAuthByMatricula, createUsuario, updateUsuario, deleteUsuario } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isAllowedRole, normalizeRole } from '../utils/role.js';

const STAFF_ROLES = ['profesor', 'contador', 'cobranza', 'jefe', 'director', 'coordinadora', 'asesor_academico'];

function serializeUser(user) {
  return {
    id: user.id,
    matricula: user.matricula,
    nombre: user.nombre,
    apellido: user.apellido,
    correo_electronico: user.correo_electronico,
    rol: user.rol,
    last_login: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
}

function validateIdParam(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new AppError(400, 'El id proporcionado no es válido.');
  }

  return parsedId;
}

function requireFields(body, fields) {
  const missing = fields.filter((field) => !body[field] || String(body[field]).trim() === '');

  if (missing.length > 0) {
    throw new AppError(400, 'Debes completar todos los campos requeridos.');
  }
}

async function ensureUniqueEmail(correoElectronico, currentUserId = null) {
  const existingUser = await findUsuarioAuthByEmail(correoElectronico);

  if (existingUser && existingUser.id !== currentUserId) {
    throw new AppError(409, 'Ya existe un usuario con ese correo electrónico.');
  }
}

async function ensureUniqueMatricula(matricula, currentUserId = null) {
  const existingUser = await findUsuarioAuthByMatricula(matricula);

  if (existingUser && existingUser.id !== currentUserId) {
    throw new AppError(409, 'Ya existe un usuario con esa matrícula.');
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

export const getUsers = asyncHandler(async (req, res) => {
  const users = await findUsuarios();

  res.json({
    users: users.map(serializeUser)
  });
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  const role = String(req.params.role || '').trim();
  if (!role) {
    throw new AppError(400, 'Debes indicar un rol válido.');
  }

  const users = await findUsuariosByRole(role);

  res.json({
    users: users.map(serializeUser)
  });
});

export const getDocentes = asyncHandler(async (req, res) => {
  const users = await findUsuariosByRole('profesor');

  res.json({
    users: users.map(serializeUser)
  });
});

export const getEstudiantes = asyncHandler(async (req, res) => {
  const users = await findUsuariosByRole('estudiante');

  res.json({
    users: users.map(serializeUser)
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const id = validateIdParam(req.params.id);
  const user = await findUsuarioById(id);

  if (!user) {
    throw new AppError(404, 'Usuario no encontrado.');
  }

  res.json({ user: serializeUser(user) });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await findUsuarioById(req.user.id);

  if (!user) {
    throw new AppError(404, 'Usuario no encontrado.');
  }

  res.json({ user: serializeUser(user) });
});

export const createUser = asyncHandler(async (req, res) => {
  const { nombre, apellido, correo_electronico, contrasena, rol } = req.body;

  // If the requester is asesor_academico, allow creation but only for estudiantes
  const requesterRole = req.user?.rol;

  // Required fields differ depending on requester
  if (requesterRole === 'asesor_academico') {
    requireFields(req.body, ['nombre', 'apellido', 'correo_electronico', 'contrasena']);
  } else {
    requireFields(req.body, ['nombre', 'apellido', 'correo_electronico', 'contrasena', 'rol']);
  }

  const normalizedEmail = String(correo_electronico).trim().toLowerCase();

  // Determine role to create: if asesor_academico forcing 'estudiante', otherwise use provided rol
  let normalizedRole;
  if (requesterRole === 'asesor_academico') {
    normalizedRole = 'estudiante';
  } else {
    normalizedRole = normalizeRole(rol);
    if (!isAllowedRole(normalizedRole)) {
      throw new AppError(400, 'El rol enviado no es válido.');
    }
  }

  await ensureUniqueEmail(normalizedEmail);

  const hashedPassword = await bcrypt.hash(String(contrasena), 10);
  const matricula = normalizedRole === 'estudiante' ? await generateUniqueMatricula() : null;

  if (matricula) {
    await ensureUniqueMatricula(matricula);
  }

  const createdUser = await createUsuario({
    matricula,
    nombre: String(nombre).trim(),
    apellido: String(apellido).trim(),
    correo_electronico: normalizedEmail,
    contrasena: hashedPassword,
    rol: normalizedRole
  });

  res.status(201).json({
    message: 'Usuario creado correctamente.',
    user: serializeUser(createdUser)
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const id = validateIdParam(req.params.id);
  const existingUser = await findUsuarioById(id);

  if (!existingUser) {
    throw new AppError(404, 'Usuario no encontrado.');
  }

  const requesterRole = req.user?.rol;
  if (requesterRole === 'asesor_academico' && existingUser.rol !== 'estudiante') {
    throw new AppError(403, 'Solo puedes modificar usuarios con rol estudiante.');
  }

  const changes = {};

  if (typeof req.body.nombre !== 'undefined') {
    changes.nombre = String(req.body.nombre).trim();
  }

  if (typeof req.body.apellido !== 'undefined') {
    changes.apellido = String(req.body.apellido).trim();
  }

  if (typeof req.body.matricula !== 'undefined') {
    throw new AppError(400, 'La matrícula se genera automáticamente y no puede modificarse.');
  }

  if (typeof req.body.correo_electronico !== 'undefined') {
    const normalizedEmail = String(req.body.correo_electronico).trim().toLowerCase();
    await ensureUniqueEmail(normalizedEmail, id);
    changes.correo_electronico = normalizedEmail;
  }

  if (typeof req.body.contrasena !== 'undefined' && String(req.body.contrasena).trim() !== '') {
    changes.contrasena = await bcrypt.hash(String(req.body.contrasena), 10);
  }

  if (typeof req.body.rol !== 'undefined') {
    if (requesterRole === 'asesor_academico') {
      throw new AppError(403, 'No puedes modificar el rol de un alumno.');
    }

    const normalizedRole = normalizeRole(req.body.rol);

    if (!isAllowedRole(normalizedRole)) {
      throw new AppError(400, 'El rol enviado no es válido.');
    }

    changes.rol = normalizedRole;

    if (normalizedRole === 'estudiante' && !existingUser.matricula) {
      changes.matricula = await generateUniqueMatricula();
      await ensureUniqueMatricula(changes.matricula, id);
    }

    if (STAFF_ROLES.includes(normalizedRole) && existingUser.matricula && existingUser.rol === 'estudiante') {
      changes.matricula = null;
    }
  }

  if (Object.keys(changes).length === 0) {
    throw new AppError(400, 'Debes enviar al menos un campo para actualizar.');
  }

  const updatedUser = await updateUsuario(id, changes);

  res.json({
    message: 'Usuario actualizado correctamente.',
    user: serializeUser(updatedUser)
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const id = validateIdParam(req.params.id);
  const requesterRole = req.user?.rol;
  const existingUser = await findUsuarioById(id);

  if (!existingUser) {
    throw new AppError(404, 'Usuario no encontrado.');
  }

  if (requesterRole === 'asesor_academico' && existingUser.rol !== 'estudiante') {
    throw new AppError(403, 'Solo puedes eliminar usuarios con rol estudiante.');
  }

  const deleted = await deleteUsuario(id);

  if (!deleted) {
    throw new AppError(404, 'Usuario no encontrado.');
  }

  res.json({
    message: 'Usuario eliminado correctamente.'
  });
});