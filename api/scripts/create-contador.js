import bcrypt from 'bcryptjs';
import { validateEnv } from '../src/config/env.js';
import { ensureDatabaseReady, pool } from '../src/config/db.js';
import { findUsuarioAuthByEmail, createUsuario, updateUsuario } from '../src/models/user.model.js';
import { normalizeRole } from '../src/utils/role.js';

const CONTADOR_EMAIL = 'contador@iar.edu';
const CONTADOR_PASSWORD = 'Cuco2024**';
const CONTADOR_NAME = 'Ana';
const CONTADOR_LASTNAME = 'Lopez Contraloria';
const CONTADOR_ROLE = normalizeRole('Contador');

async function main() {
  validateEnv();
  await ensureDatabaseReady();

  const hashedPassword = await bcrypt.hash(CONTADOR_PASSWORD, 10);
  const existingUser = await findUsuarioAuthByEmail(CONTADOR_EMAIL);

  if (existingUser) {
    await updateUsuario(existingUser.id, {
      nombre: CONTADOR_NAME,
      apellido: CONTADOR_LASTNAME,
      correo_electronico: CONTADOR_EMAIL,
      contrasena: hashedPassword,
      rol: CONTADOR_ROLE
    });

    console.log(`Contador actualizado: ${CONTADOR_EMAIL}`);
  } else {
    await createUsuario({
      nombre: CONTADOR_NAME,
      apellido: CONTADOR_LASTNAME,
      correo_electronico: CONTADOR_EMAIL,
      contrasena: hashedPassword,
      rol: CONTADOR_ROLE
    });

    console.log(`Contador creado: ${CONTADOR_EMAIL}`);
  }
}

main()
  .catch((error) => {
    console.error('No fue posible crear el contador.');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
