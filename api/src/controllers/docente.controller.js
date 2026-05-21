import { findGruposByDocenteId } from '../models/docente-group.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyAssignedGroups = asyncHandler(async (req, res) => {
  const docenteId = Number(req.user.id);
  const groups = await findGruposByDocenteId(docenteId);

  res.json({
    groups
  });
});
