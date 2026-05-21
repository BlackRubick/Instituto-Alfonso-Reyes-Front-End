import { pool } from '../config/db.js';

// Create table if it doesn't exist
export async function initializeTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS materia_docente_horario (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      materia_docente_id INT UNSIGNED NOT NULL,
      dia VARCHAR(50) NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      aula VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (materia_docente_id) REFERENCES materia_docente(id) ON DELETE CASCADE,
      INDEX idx_materia_docente_id (materia_docente_id),
      INDEX idx_dia (dia)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('materia_docente_horario table initialized');
  } catch (error) {
    console.error('Error initializing table:', error);
  }
}

export async function assignHorarioToMateriasDocente({
  materia_id,
  docente_id,
  dias,
  hora_inicio,
  hora_fin,
  aula
}) {
  // First find or get the materia_docente id
  const [mdRows] = await pool.query(
    `SELECT id FROM materia_docente WHERE materia_id = ? AND docente_id = ? LIMIT 1`,
    [materia_id, docente_id]
  );

  if (!mdRows.length) {
    throw new Error('Asignación de materia a docente no encontrada');
  }

  const materia_docente_id = mdRows[0].id;

  // Delete existing horarios for this assignment
  await pool.query(`DELETE FROM materia_docente_horario WHERE materia_docente_id = ?`, [materia_docente_id]);

  // Insert new horarios
  const results = [];
  for (const dia of dias) {
    const [result] = await pool.query(
      `INSERT INTO materia_docente_horario (materia_docente_id, dia, hora_inicio, hora_fin, aula) 
       VALUES (?, ?, ?, ?, ?)`,
      [materia_docente_id, dia, hora_inicio, hora_fin, aula || null]
    );
    results.push({ id: result.insertId, dia, hora_inicio, hora_fin, aula });
  }

  return results;
}

export async function getHorariosByMateriasDocente(materia_id, docente_id) {
  const [rows] = await pool.query(
    `SELECT mdh.* FROM materia_docente_horario mdh
     JOIN materia_docente md ON mdh.materia_docente_id = md.id
     WHERE md.materia_id = ? AND md.docente_id = ?
     ORDER BY FIELD(mdh.dia, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'), mdh.hora_inicio`,
    [materia_id, docente_id]
  );
  return rows;
}

export async function getHorariosByDocente(docente_id) {
  const [rows] = await pool.query(
    `SELECT m.*, u.nombre, u.apellido, mdh.dia, mdh.hora_inicio, mdh.hora_fin, mdh.aula
     FROM materia_docente_horario mdh
     JOIN materia_docente md ON mdh.materia_docente_id = md.id
     JOIN materias m ON md.materia_id = m.id
     JOIN usuarios u ON md.docente_id = u.id
     WHERE md.docente_id = ?
     ORDER BY FIELD(mdh.dia, 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'), mdh.hora_inicio`,
    [docente_id]
  );
  return rows;
}

export async function deleteHorariosByMateriasDocente(materia_id, docente_id) {
  const [mdRows] = await pool.query(
    `SELECT id FROM materia_docente WHERE materia_id = ? AND docente_id = ? LIMIT 1`,
    [materia_id, docente_id]
  );

  if (!mdRows.length) return;

  const materia_docente_id = mdRows[0].id;
  await pool.query(`DELETE FROM materia_docente_horario WHERE materia_docente_id = ?`, [materia_docente_id]);
}
