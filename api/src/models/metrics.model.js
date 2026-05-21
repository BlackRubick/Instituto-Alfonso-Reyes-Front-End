import { pool } from '../config/db.js';

export async function getJefeMetrics() {
  // Aggregate non-cancelled payments: total_periodos, uniformes, examenes, inscripciones, reinscripciones, practicas, credenciales
  const [rows] = await pool.query(`
    SELECT
      SUM(CASE WHEN tipo = 'periodo' THEN monto ELSE 0 END) AS total_periodos,
      SUM(CASE WHEN tipo = 'uniforme' THEN monto ELSE 0 END) AS uniformes,
      SUM(CASE WHEN tipo = 'examen' THEN monto ELSE 0 END) AS examenes,
      SUM(CASE WHEN tipo = 'inscripcion' THEN monto ELSE 0 END) AS inscripciones,
      SUM(CASE WHEN tipo = 'reinscripcion' THEN monto ELSE 0 END) AS reinscripciones,
      SUM(CASE WHEN tipo = 'practica' THEN monto ELSE 0 END) AS practicas,
      SUM(CASE WHEN tipo = 'credencial' THEN monto ELSE 0 END) AS credenciales
    FROM pagos
    WHERE estado != 'cancelado'
  `);
  return rows[0] || {};
}

export async function getDirectorMetrics() {
  // Aggregate non-cancelled payments for Director metrics
  const [rows] = await pool.query(`
    SELECT
      SUM(CASE WHEN tipo = 'periodo' THEN monto ELSE 0 END) AS total_periodos,
      SUM(CASE WHEN tipo = 'uniforme' THEN monto ELSE 0 END) AS uniformes,
      SUM(CASE WHEN tipo = 'examen' THEN monto ELSE 0 END) AS examenes,
      SUM(CASE WHEN tipo = 'inscripcion' THEN monto ELSE 0 END) AS inscripciones,
      SUM(CASE WHEN tipo = 'reinscripcion' THEN monto ELSE 0 END) AS reinscripciones,
      SUM(CASE WHEN tipo = 'practica' THEN monto ELSE 0 END) AS practicas,
      SUM(CASE WHEN tipo = 'credencial' THEN monto ELSE 0 END) AS credenciales
    FROM pagos
    WHERE estado != 'cancelado'
  `);
  return rows[0] || {};
}

