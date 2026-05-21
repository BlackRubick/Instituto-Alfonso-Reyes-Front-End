import { pool } from '../config/db.js';

export async function createHorario({ titulo, descripcion, periodo, nivel, creado_por }) {
  const [result] = await pool.query(
    `INSERT INTO horarios (titulo, descripcion, periodo, nivel, creado_por) VALUES (?, ?, ?, ?, ?)`,
    [titulo, descripcion || null, periodo || null, nivel || 'licenciatura', creado_por || null]
  );
  return { id: result.insertId, titulo, descripcion, periodo, nivel, creado_por };
}

export async function findAllHorarios() {
  const [rows] = await pool.query(`SELECT * FROM horarios ORDER BY created_at DESC`);
  return rows;
}

export async function findHorarioById(id) {
  const [rows] = await pool.query(`SELECT * FROM horarios WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function updateHorario(id, { titulo, descripcion, periodo, nivel }) {
  await pool.query(
    `UPDATE horarios SET titulo = ?, descripcion = ?, periodo = ?, nivel = ? WHERE id = ?`,
    [titulo, descripcion || null, periodo || null, nivel || 'licenciatura', id]
  );
  return findHorarioById(id);
}

export async function deleteHorario(id) {
  const [result] = await pool.query(`DELETE FROM horarios WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

export async function assignDocenteToHorario({ horario_id, docente_id, dia, hora_inicio, hora_fin, aula }) {
  const [result] = await pool.query(
    `INSERT INTO horario_docente (horario_id, docente_id, dia, hora_inicio, hora_fin, aula) VALUES (?, ?, ?, ?, ?, ?)`,
    [horario_id, docente_id, dia || null, hora_inicio || null, hora_fin || null, aula || null]
  );
  return { id: result.insertId, horario_id, docente_id, dia, hora_inicio, hora_fin, aula };
}

export async function findAsignacionesByHorario(horario_id) {
  const [rows] = await pool.query(
    `SELECT hd.*, u.nombre, u.apellido, u.correo_electronico FROM horario_docente hd JOIN usuarios u ON u.id = hd.docente_id WHERE hd.horario_id = ?`,
    [horario_id]
  );
  return rows;
}

export async function findHorariosByDocente(docente_id) {
  const [rows] = await pool.query(
    `SELECT h.* FROM horarios h JOIN horario_docente hd ON hd.horario_id = h.id WHERE hd.docente_id = ?`,
    [docente_id]
  );
  return rows;
}

export async function findDashboardHorarioRows() {
  const [rows] = await pool.query(
    `SELECT
      h.id AS horario_id,
      h.titulo,
      h.descripcion,
      h.periodo,
      h.nivel,
      hb.dia,
      hb.hora,
      hb.aula,
      m.nombre AS materia,
      CONCAT_WS(' ', u.nombre, u.apellido) AS docente
    FROM horarios h
    LEFT JOIN horario_bloques hb ON hb.horario_id = h.id
    LEFT JOIN materias m ON m.id = hb.materia_id
    LEFT JOIN usuarios u ON u.id = hb.docente_id
    ORDER BY h.nivel ASC, h.created_at DESC, hb.hora ASC`
  );

  return rows;
}
