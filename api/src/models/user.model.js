import { pool } from '../config/db.js';

const publicFields = 'id, matricula, nombre, apellido, correo_electronico, rol, last_login, created_at, updated_at';
const authFields = 'id, matricula, nombre, apellido, correo_electronico, contrasena, rol, last_login, created_at, updated_at';

export async function findUsuarios() {
  const [rows] = await pool.query(`SELECT ${publicFields} FROM usuarios ORDER BY id DESC`);
  return rows;
}

export async function findUsuariosByRole(role) {
  const [rows] = await pool.query(
    `SELECT ${publicFields} FROM usuarios WHERE rol = ? ORDER BY nombre ASC, apellido ASC`,
    [role]
  );
  return rows;
}

export async function findUsuarioById(id) {
  const [rows] = await pool.execute(
    `SELECT ${publicFields} FROM usuarios WHERE id = ? LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

export async function findUsuarioAuthByEmail(correoElectronico) {
  const [rows] = await pool.execute(
    `SELECT ${authFields} FROM usuarios WHERE correo_electronico = ? LIMIT 1`,
    [correoElectronico]
  );

  return rows[0] || null;
}

export async function findUsuarioAuthByMatricula(matricula) {
  const [rows] = await pool.execute(
    `SELECT ${authFields} FROM usuarios WHERE matricula = ? LIMIT 1`,
    [matricula]
  );

  return rows[0] || null;
}

export async function createUsuario({ matricula = null, nombre, apellido, correo_electronico, contrasena, rol }) {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (matricula, nombre, apellido, correo_electronico, contrasena, rol) VALUES (?, ?, ?, ?, ?, ?)',
    [matricula, nombre, apellido, correo_electronico, contrasena, rol]
  );

  return findUsuarioById(result.insertId);
}

export async function updateUsuario(id, changes) {
  const fields = [];
  const values = [];

  if (typeof changes.nombre !== 'undefined') {
    fields.push('nombre = ?');
    values.push(changes.nombre);
  }

  if (typeof changes.apellido !== 'undefined') {
    fields.push('apellido = ?');
    values.push(changes.apellido);
  }

  if (typeof changes.matricula !== 'undefined') {
    fields.push('matricula = ?');
    values.push(changes.matricula);
  }

  if (typeof changes.correo_electronico !== 'undefined') {
    fields.push('correo_electronico = ?');
    values.push(changes.correo_electronico);
  }

  if (typeof changes.contrasena !== 'undefined') {
    fields.push('contrasena = ?');
    values.push(changes.contrasena);
  }

  if (typeof changes.rol !== 'undefined') {
    fields.push('rol = ?');
    values.push(changes.rol);
  }

  if (fields.length === 0) {
    return findUsuarioById(id);
  }

  values.push(id);

  const [result] = await pool.execute(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findUsuarioById(id);
}

export async function updateUsuarioLastLogin(id) {
  await pool.execute('UPDATE usuarios SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  return findUsuarioById(id);
}

export async function deleteUsuario(id) {
  const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  return result.affectedRows > 0;
}