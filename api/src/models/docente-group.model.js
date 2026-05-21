import { pool } from '../config/db.js';

export async function findGruposByDocenteId(docenteId) {
  const [rows] = await pool.execute(
    `
      SELECT
        dg.id,
        dg.docente_id,
        dg.grupo_id,
        dg.materia,
        dg.horario,
        dg.estatus,
        g.clave,
        g.nombre,
        g.periodo,
        g.turno,
        g.carrera,
        g.modalidad,
        g.salon
      FROM docente_grupos dg
      INNER JOIN grupos g ON g.id = dg.grupo_id
      WHERE dg.docente_id = ?
        AND dg.estatus = 'activo'
      ORDER BY g.nombre ASC
    `,
    [docenteId]
  );

  return rows;
}
