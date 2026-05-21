import bcrypt from 'bcryptjs';
import { validateEnv } from '../src/config/env.js';
import { ensureDatabaseReady, pool } from '../src/config/db.js';
import { findUsuarioAuthByEmail, createUsuario, updateUsuario } from '../src/models/user.model.js';
import { normalizeRole } from '../src/utils/role.js';

const ADMIN_EMAIL = 'blackrubick14@gmail.com';
const ADMIN_PASSWORD = 'Cuco2024**';
const ADMIN_NAME = 'Cesar';
const ADMIN_LASTNAME = 'Gomez Aguilera';
const ADMIN_ROLE = normalizeRole('Admin');

async function main() {
  validateEnv();
  await ensureDatabaseReady();

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existingUser = await findUsuarioAuthByEmail(ADMIN_EMAIL);

  if (existingUser) {
    await updateUsuario(existingUser.id, {
      nombre: ADMIN_NAME,
      apellido: ADMIN_LASTNAME,
      correo_electronico: ADMIN_EMAIL,
      contrasena: hashedPassword,
      rol: ADMIN_ROLE
    });

    console.log(`Admin actualizado: ${ADMIN_EMAIL}`);
  } else {
    await createUsuario({
      nombre: ADMIN_NAME,
      apellido: ADMIN_LASTNAME,
      correo_electronico: ADMIN_EMAIL,
      contrasena: hashedPassword,
      rol: ADMIN_ROLE
    });

    console.log(`Admin creado: ${ADMIN_EMAIL}`);
  }
}

main()
  .catch((error) => {
    console.error('No fue posible crear el admin.');
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
