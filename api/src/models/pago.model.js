import { pool } from '../config/db.js';

/**
 * Busca y lista pagos con filtros avanzados de búsqueda y orden descendente.
 */
export async function findPagos(filters = {}) {
  const { search, tipo, estado, fechaInicio, fechaFin } = filters;
  const conditions = [];
  const values = [];

  if (search && search.trim() !== '') {
    conditions.push('(alumno_nombre LIKE ? OR matricula LIKE ? OR folio LIKE ?)');
    const searchTerm = `%${search.trim()}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  if (tipo && tipo.trim() !== '') {
    conditions.push('tipo = ?');
    values.push(tipo);
  }

  if (estado && estado.trim() !== '') {
    conditions.push('estado = ?');
    values.push(estado);
  }

  if (fechaInicio) {
    conditions.push('fecha_pago >= ?');
    values.push(fechaInicio);
  }

  if (fechaFin) {
    conditions.push('fecha_pago <= ?');
    values.push(fechaFin);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, folio, usuario_id, alumno_nombre, matricula, tipo, monto, fecha_pago, estado, metodo_pago, observaciones, created_at
    FROM pagos
    ${whereClause}
    ORDER BY id DESC
  `;

  const [rows] = await pool.query(query, values);
  return rows;
}

/**
 * Obtiene un pago por su ID.
 */
export async function findPagoById(id) {
  const [rows] = await pool.execute(
    'SELECT * FROM pagos WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

/**
 * Obtiene un pago por su Folio.
 */
export async function findPagoByFolio(folio) {
  const [rows] = await pool.execute(
    'SELECT * FROM pagos WHERE folio = ? LIMIT 1',
    [folio]
  );
  return rows[0] || null;
}

/**
 * Obtiene el último ID de la tabla para generación secuencial de folios.
 */
export async function getLastPagoId() {
  const [rows] = await pool.query('SELECT MAX(id) as lastId FROM pagos');
  return rows[0]?.lastId || 0;
}

/**
 * Verifica si existe un pago duplicado reciente (mismo alumno, tipo y monto hoy).
 */
export async function checkDuplicatePago(alumnoNombre, tipo, monto) {
  const [rows] = await pool.execute(
    `SELECT id, folio FROM pagos 
     WHERE alumno_nombre = ? AND tipo = ? AND monto = ? AND estado != 'cancelado' 
     AND created_at >= NOW() - INTERVAL 15 MINUTE LIMIT 1`,
    [alumnoNombre, tipo, monto]
  );
  return rows[0] || null;
}

/**
 * Registra un nuevo pago en la base de datos.
 */
export async function createPago({
  folio,
  usuario_id = null,
  alumno_nombre,
  matricula = null,
  tipo,
  monto,
  fecha_pago,
  estado = 'pagado',
  metodo_pago = 'efectivo',
  observaciones = null
}) {
  const [result] = await pool.execute(
    `INSERT INTO pagos (folio, usuario_id, alumno_nombre, matricula, tipo, monto, fecha_pago, estado, metodo_pago, observaciones) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [folio, usuario_id, alumno_nombre, matricula, tipo, monto, fecha_pago, estado, metodo_pago, observaciones]
  );

  return findPagoById(result.insertId);
}

/**
 * Modifica la información de un pago existente.
 */
export async function updatePago(id, changes) {
  const fields = [];
  const values = [];

  const allowedFields = [
    'alumno_nombre',
    'matricula',
    'usuario_id',
    'tipo',
    'monto',
    'fecha_pago',
    'estado',
    'metodo_pago',
    'observaciones'
  ];

  for (const field of allowedFields) {
    if (typeof changes[field] !== 'undefined') {
      fields.push(`${field} = ?`);
      values.push(changes[field]);
    }
  }

  if (fields.length === 0) {
    return findPagoById(id);
  }

  values.push(id);

  const [result] = await pool.execute(
    `UPDATE pagos SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return findPagoById(id);
}

/**
 * Obtiene el resumen de estadísticas financieras para el dashboard.
 */
export async function getPagosStats() {
  // 1. Total del día (excluyendo cancelados)
  const [todayRows] = await pool.query(
    `SELECT SUM(monto) as total FROM pagos 
     WHERE fecha_pago = CURDATE() AND estado != 'cancelado'`
  );
  const totalDia = Number(todayRows[0]?.total || 0);

  // 2. Total semanal (excluyendo cancelados)
  const [weekRows] = await pool.query(
    `SELECT SUM(monto) as total FROM pagos 
     WHERE fecha_pago >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND estado != 'cancelado'`
  );
  const totalSemana = Number(weekRows[0]?.total || 0);

  // 3. Total mensual (excluyendo cancelados)
  const [monthRows] = await pool.query(
    `SELECT SUM(monto) as total FROM pagos 
     WHERE MONTH(fecha_pago) = MONTH(CURDATE()) AND YEAR(fecha_pago) = YEAR(CURDATE()) AND estado != 'cancelado'`
  );
  const totalMes = Number(monthRows[0]?.total || 0);

  // 4. Pagos pendientes (suma de montos pendientes o parciales)
  const [pendingRows] = await pool.query(
    `SELECT SUM(monto) as total FROM pagos 
     WHERE estado = 'pendiente' OR estado = 'parcial'`
  );
  const totalPendiente = Number(pendingRows[0]?.total || 0);

  // 5. Alumnos con adeudos (conteo de alumnos únicos con pagos pendientes/parciales)
  const [debtCountRows] = await pool.query(
    `SELECT COUNT(DISTINCT alumno_nombre) as total FROM pagos 
     WHERE estado = 'pendiente' OR estado = 'parcial'`
  );
  const alumnosAdeudo = Number(debtCountRows[0]?.total || 0);

  // 6. Últimos 5 pagos registrados
  const [ultimosPagos] = await pool.query(
    `SELECT id, folio, alumno_nombre, matricula, tipo, monto, fecha_pago, estado, metodo_pago 
     FROM pagos ORDER BY id DESC LIMIT 5`
  );

  return {
    totalDia,
    totalSemana,
    totalMes,
    totalPendiente,
    alumnosAdeudo,
    ultimosPagos
  };
}

/**
 * Obtiene el reporte acumulado mensual de ingresos para graficar en Recharts.
 */
export async function getIngresosMensualesGrafica() {
  const query = `
    SELECT 
      DATE_FORMAT(fecha_pago, '%Y-%m') as mes_clave,
      CASE MONTH(fecha_pago)
        WHEN 1 THEN 'Ene'
        WHEN 2 THEN 'Feb'
        WHEN 3 THEN 'Mar'
        WHEN 4 THEN 'Abr'
        WHEN 5 THEN 'May'
        WHEN 6 THEN 'Jun'
        WHEN 7 THEN 'Jul'
        WHEN 8 THEN 'Ago'
        WHEN 9 THEN 'Sep'
        WHEN 10 THEN 'Oct'
        WHEN 11 THEN 'Nov'
        WHEN 12 THEN 'Dic'
      END as mes,
      SUM(CASE WHEN estado != 'cancelado' THEN monto ELSE 0 END) as ingresos,
      SUM(CASE WHEN estado = 'pendiente' OR estado = 'parcial' THEN monto ELSE 0 END) as pendientes
    FROM pagos
    WHERE fecha_pago >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY mes_clave, mes
    ORDER BY mes_clave ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
}
