import { pool } from '../config/db.js';

export async function createMateria({ clave, nombre, nivel, descripcion, creado_por }) {
  const [result] = await pool.query(
    `INSERT INTO materias (clave, nombre, nivel, descripcion, creado_por) VALUES (?, ?, ?, ?, ?)`,
    [clave || null, nombre, nivel || 'bachillerato', descripcion || null, creado_por || null]
  );
  return { id: result.insertId, clave, nombre, nivel, descripcion, creado_por };
}

export async function findAllMaterias(filter = {}) {
  const params = [];
  let where = '';
  if (filter.nivel) {
    where = 'WHERE nivel = ?';
    params.push(filter.nivel);
  }
  const [rows] = await pool.query(`SELECT * FROM materias ${where} ORDER BY created_at DESC`, params);
  return rows;
}

export async function findMateriaById(id) {
  const [rows] = await pool.query(`SELECT * FROM materias WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function findMateriaByNombreYNivel(nombre, nivel) {
  const [rows] = await pool.query(
    `SELECT * FROM materias WHERE nombre = ? AND nivel = ? LIMIT 1`,
    [nombre, nivel]
  );
  return rows[0] || null;
}

export async function findOrCreateMateria({ nombre, nivel, clave = null, descripcion = null, creado_por = null }) {
  const existing = await findMateriaByNombreYNivel(nombre, nivel);
  if (existing) {
    return existing;
  }

  return createMateria({ nombre, nivel, clave, descripcion, creado_por });
}

export async function assignMateriaToDocente({ materia_id, docente_id, grupo_id }) {
  const [existingRows] = await pool.query(
    `SELECT id FROM materia_docente WHERE materia_id = ? LIMIT 1`,
    [materia_id]
  );

  if (existingRows.length > 0) {
    const materiaDocenteId = existingRows[0].id;
    await pool.query(
      `UPDATE materia_docente SET docente_id = ?, grupo_id = ? WHERE id = ?`,
      [docente_id, grupo_id || null, materiaDocenteId]
    );
    return { id: materiaDocenteId, materia_id, docente_id, grupo_id };
  }

  const [result] = await pool.query(
    `INSERT INTO materia_docente (materia_id, docente_id, grupo_id) VALUES (?, ?, ?)`,
    [materia_id, docente_id, grupo_id || null]
  );
  return { id: result.insertId, materia_id, docente_id, grupo_id };
}

export async function findMateriasByDocente(docente_id) {
  const [rows] = await pool.query(
    `SELECT m.* FROM materias m JOIN materia_docente md ON md.materia_id = m.id WHERE md.docente_id = ? ORDER BY m.created_at DESC`,
    [docente_id]
  );
  return rows;
}

export async function findMateriasWithDocentes(filter = {}) {
  const params = [];
  let where = '';
  if (filter.nivel) {
    where = 'WHERE m.nivel = ?';
    params.push(filter.nivel);
  }
  const query = `
    SELECT 
      m.id, m.clave, m.nombre, m.nivel, m.descripcion, m.created_at,
      u.id as docente_id,
      u.nombre as docente_nombre,
      u.apellido as docente_apellido,
      u.correo_electronico as docente_correo,
      md.id as asignacion_id
    FROM materias m
    LEFT JOIN (
      SELECT md1.*
      FROM materia_docente md1
      INNER JOIN (
        SELECT materia_id, MAX(id) AS max_id
        FROM materia_docente
        GROUP BY materia_id
      ) latest ON latest.max_id = md1.id
    ) md ON m.id = md.materia_id
    LEFT JOIN usuarios u ON md.docente_id = u.id
    ${where}
    ORDER BY m.created_at DESC
  `;
  const [rows] = await pool.query(query, params);
  return rows;
}
