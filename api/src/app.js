import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import docenteRoutes from './routes/docente.routes.js';
import coordinadorRoutes from './routes/coordinador.routes.js';
import materiasRoutes from './routes/materias.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import metricsRoutes from './routes/metrics.routes.js';
import pagosRoutes from './routes/pagos.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'instituto-alfonso-reyes-api'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/coordinador', coordinadorRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/pagos', pagosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;