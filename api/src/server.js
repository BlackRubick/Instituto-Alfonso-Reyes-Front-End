import app from './app.js';
import { env, validateEnv } from './config/env.js';
import { ensureDatabaseReady, testDatabaseConnection } from './config/db.js';

async function startServer() {
  validateEnv();
  await ensureDatabaseReady();
  await testDatabaseConnection();

  app.listen(env.port, () => {
    console.log(`API lista en http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('No fue posible iniciar la API.');
  console.error(error);
  process.exit(1);
});