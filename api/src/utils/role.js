const roles = [
  'admin',
  'profesor',
  'estudiante',
  'contador',
  'cobranza',
  'jefe',
  'director',
  'coordinador',
  'coordinadora',
  'asesor_academico'
];

function removeAccents(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function normalizeRole(role = '') {
  const normalized = removeAccents(String(role).trim().toLowerCase()).replace(/[\s-]+/g, '_');
  return normalized === 'coordinador' ? 'coordinadora' : normalized;
}

export function isAllowedRole(role) {
  return roles.includes(normalizeRole(role));
}

export function getRoles() {
  return [...roles];
}