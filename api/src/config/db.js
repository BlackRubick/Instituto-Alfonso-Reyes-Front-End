import mysql from 'mysql2/promise';
import { env } from './env.js';

const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS \`${env.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    matricula VARCHAR(6) DEFAULT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_electronico VARCHAR(150) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM(
      'admin',
      'profesor',
      'estudiante',
      'contador',
      'cobranza',
      'jefe',
      'director',
      'coordinadora',
      'asesor_academico'
    ) NOT NULL DEFAULT 'estudiante',
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_usuarios_matricula (matricula),
    UNIQUE KEY uk_usuarios_correo (correo_electronico)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createGroupsTableSql = `
  CREATE TABLE IF NOT EXISTS grupos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    clave VARCHAR(30) NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    periodo VARCHAR(40) DEFAULT NULL,
    turno VARCHAR(40) DEFAULT NULL,
    carrera VARCHAR(120) DEFAULT NULL,
    modalidad VARCHAR(60) DEFAULT NULL,
    salon VARCHAR(60) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_grupos_clave (clave)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createDocenteGroupsTableSql = `
  CREATE TABLE IF NOT EXISTS docente_grupos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    docente_id INT UNSIGNED NOT NULL,
    grupo_id INT UNSIGNED NOT NULL,
    materia VARCHAR(120) DEFAULT NULL,
    horario VARCHAR(120) DEFAULT NULL,
    estatus ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_docente_grupo_materia (docente_id, grupo_id, materia),
    KEY idx_docente_grupos_docente (docente_id),
    KEY idx_docente_grupos_grupo (grupo_id),
    CONSTRAINT fk_docente_grupos_docente FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_docente_grupos_grupo FOREIGN KEY (grupo_id) REFERENCES grupos (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createHorariosTableSql = `
  CREATE TABLE IF NOT EXISTS horarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    periodo VARCHAR(80) DEFAULT NULL,
    nivel ENUM('bachillerato', 'licenciatura') NOT NULL DEFAULT 'licenciatura',
    creado_por INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_horarios_creado_por (creado_por),
    CONSTRAINT fk_horarios_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createHorarioDocenteTableSql = `
  CREATE TABLE IF NOT EXISTS horario_docente (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    horario_id INT UNSIGNED NOT NULL,
    docente_id INT UNSIGNED NOT NULL,
    dia ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') DEFAULT NULL,
    hora_inicio TIME DEFAULT NULL,
    hora_fin TIME DEFAULT NULL,
    aula VARCHAR(80) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_horario_docente_horario (horario_id),
    KEY idx_horario_docente_docente (docente_id),
    CONSTRAINT fk_horario_docente_horario FOREIGN KEY (horario_id) REFERENCES horarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_horario_docente_docente FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createHorarioBloquesTableSql = `
  CREATE TABLE IF NOT EXISTS horario_bloques (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    horario_id INT UNSIGNED NOT NULL,
    dia ENUM('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo') NOT NULL,
    hora VARCHAR(10) NOT NULL,
    materia_id INT UNSIGNED DEFAULT NULL,
    docente_id INT UNSIGNED DEFAULT NULL,
    aula VARCHAR(80) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_horario_bloque (horario_id, dia, hora),
    KEY idx_horario_bloques_horario (horario_id),
    KEY idx_horario_bloques_materia (materia_id),
    KEY idx_horario_bloques_docente (docente_id),
    CONSTRAINT fk_horario_bloques_horario FOREIGN KEY (horario_id) REFERENCES horarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_horario_bloques_materia FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE SET NULL,
    CONSTRAINT fk_horario_bloques_docente FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createMateriasTableSql = `
  CREATE TABLE IF NOT EXISTS materias (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    clave VARCHAR(80) DEFAULT NULL,
    nombre VARCHAR(150) NOT NULL,
    nivel ENUM('bachillerato','licenciatura') NOT NULL DEFAULT 'bachillerato',
    descripcion TEXT DEFAULT NULL,
    creado_por INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_materias_creado_por (creado_por),
    CONSTRAINT fk_materias_creado_por FOREIGN KEY (creado_por) REFERENCES usuarios (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createMateriaDocenteTableSql = `
  CREATE TABLE IF NOT EXISTS materia_docente (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    materia_id INT UNSIGNED NOT NULL,
    docente_id INT UNSIGNED NOT NULL,
    grupo_id INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_materia_docente_materia (materia_id),
    KEY idx_materia_docente_docente (docente_id),
    CONSTRAINT fk_materia_docente_materia FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE,
    CONSTRAINT fk_materia_docente_docente FOREIGN KEY (docente_id) REFERENCES usuarios (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createMateriaContenidoTableSql = `
  CREATE TABLE IF NOT EXISTS materia_contenido (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    materia_id INT UNSIGNED NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    recursos JSON DEFAULT NULL,
    creado_por INT UNSIGNED DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_materia_contenido_materia (materia_id),
    CONSTRAINT fk_materia_contenido_materia FOREIGN KEY (materia_id) REFERENCES materias (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;

const createPagosTableSql = `
  CREATE TABLE IF NOT EXISTS pagos (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    folio VARCHAR(50) NOT NULL,
    usuario_id INT UNSIGNED DEFAULT NULL,
    alumno_nombre VARCHAR(150) NOT NULL,
    matricula VARCHAR(20) DEFAULT NULL,
    tipo ENUM('uniforme', 'examen', 'inscripcion', 'reinscripcion', 'practica', 'credencial', 'periodo') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    estado ENUM('pendiente', 'parcial', 'pagado', 'cancelado') NOT NULL DEFAULT 'pagado',
    metodo_pago ENUM('efectivo', 'transferencia', 'tarjeta') NOT NULL DEFAULT 'efectivo',
    observaciones TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_pagos_folio (folio),
    KEY idx_pagos_usuario (usuario_id),
    CONSTRAINT fk_pagos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`;
async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.execute(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [env.dbName, tableName, columnName]
  );

  return rows[0].total > 0;
}

async function indexExists(connection, tableName, indexName) {
  const [rows] = await connection.execute(
    `
      SELECT COUNT(*) AS total
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
    `,
    [env.dbName, tableName, indexName]
  );

  return rows[0].total > 0;
}

export async function ensureDatabaseReady() {
  const connection = await mysql.createConnection({
    host: env.dbHost,
    port: env.dbPort,
    user: env.dbUser,
    password: env.dbPassword,
    multipleStatements: true
  });

  try {
    await connection.query(createDatabaseSql);
    await connection.query(`USE \`${env.dbName}\``);
    await connection.query(createUsersTableSql);
    await connection.query(createGroupsTableSql);
    await connection.query(createDocenteGroupsTableSql);
    await connection.query(createHorariosTableSql);
    await connection.query(createHorarioDocenteTableSql);
    await connection.query(createHorarioBloquesTableSql);
    await connection.query(createMateriasTableSql);
    await connection.query(createMateriaDocenteTableSql);
    await connection.query(createMateriaContenidoTableSql);
    await connection.query(createPagosTableSql);

    const matriculaExists = await columnExists(connection, 'usuarios', 'matricula');
    if (!matriculaExists) {
      await connection.query('ALTER TABLE usuarios ADD COLUMN matricula VARCHAR(6) DEFAULT NULL AFTER id');
    }

    const matriculaIndexExists = await indexExists(connection, 'usuarios', 'uk_usuarios_matricula');
    if (!matriculaIndexExists) {
      await connection.query('ALTER TABLE usuarios ADD UNIQUE KEY uk_usuarios_matricula (matricula)');
    }

    const lastLoginExists = await columnExists(connection, 'usuarios', 'last_login');
    if (!lastLoginExists) {
      await connection.query('ALTER TABLE usuarios ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL AFTER rol');
    }

    const estatusExists = await columnExists(connection, 'docente_grupos', 'estatus');
    if (!estatusExists) {
      await connection.query("ALTER TABLE docente_grupos ADD COLUMN estatus ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo' AFTER horario");
    }

    const nivelExists = await columnExists(connection, 'horarios', 'nivel');
    if (!nivelExists) {
      await connection.query("ALTER TABLE horarios ADD COLUMN nivel ENUM('bachillerato', 'licenciatura') NOT NULL DEFAULT 'licenciatura' AFTER periodo");
    }
  } finally {
    await connection.end();
  }
}

export const pool = mysql.createPool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z'
});

export async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}