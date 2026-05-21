import { pool } from '../config/db.js';

export async function createContenido({ materia_id, titulo, descripcion, recursos, creado_por }) {
  const [result] = await pool.query(
    `INSERT INTO materia_contenido (materia_id, titulo, descripcion, recursos, creado_por) VALUES (?, ?, ?, ?, ?)`,
    [materia_id, titulo, descripcion || null, recursos ? JSON.stringify(recursos) : null, creado_por || null]
  );
  return { id: result.insertId, materia_id, titulo, descripcion, recursos, creado_por };
}

export async function findContenidoByMateria(materia_id) {
  const [rows] = await pool.query(`SELECT * FROM materia_contenido WHERE materia_id = ? ORDER BY created_at DESC`, [materia_id]);
  // parse recursos
  return rows.map(r => ({ ...r, recursos: r.recursos ? JSON.parse(r.recursos) : null }));
}

export async function findContenidoById(id) {
  const [rows] = await pool.query(`SELECT * FROM materia_contenido WHERE id = ? LIMIT 1`, [id]);
  if (!rows[0]) return null;
  const row = rows[0];
  row.recursos = row.recursos ? JSON.parse(row.recursos) : null;
  return row;
}
