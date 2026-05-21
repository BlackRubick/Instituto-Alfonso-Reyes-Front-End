CREATE DATABASE IF NOT EXISTS instituto_alfonso_reyes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE instituto_alfonso_reyes;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE IF NOT EXISTS pagos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED DEFAULT NULL,
  tipo ENUM('periodo','uniforme','examen','inscripcion','reinscripcion','practica','credencial') NOT NULL,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago DATE DEFAULT NULL,
  periodo VARCHAR(80) DEFAULT NULL,
  observaciones TEXT DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pagos_usuario (usuario_id),
  CONSTRAINT fk_pagos_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
