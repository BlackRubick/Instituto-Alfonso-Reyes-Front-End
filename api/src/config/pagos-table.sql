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
