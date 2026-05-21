import { getJefeMetrics, getDirectorMetrics } from '../models/metrics.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const jefeMetrics = asyncHandler(async (req, res) => {
  // Only jefe, director, admin
  const metrics = await getJefeMetrics();
  res.json({ metrics });
});

export const directorMetrics = asyncHandler(async (req, res) => {
  // Only director, admin
  const metrics = await getDirectorMetrics();
  res.json({ metrics });
});
