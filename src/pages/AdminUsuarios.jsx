import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BadgeCheck, Clock3, LogOut, RefreshCw, Shield,
  Trash2, Users, X, UserPlus, Pencil, Search
} from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EMPTY_FORM = {
  nombre: '',
  apellido: '',
  correo_electronico: '',
  contrasena: '',
  rol: 'estudiante'
};

const ROLE_OPTIONS = [
  { value: 'admin',            label: 'Admin' },
  { value: 'profesor',         label: 'Profesor' },
  { value: 'estudiante',       label: 'Estudiante' },
  { value: 'contador',         label: 'Contador' },
  { value: 'cobranza',         label: 'Cobranza' },
  { value: 'jefe',             label: 'Jefe' },
  { value: 'director',         label: 'Director' },
  { value: 'coordinadora',     label: 'Coordinadora' },
  { value: 'asesor_academico', label: 'Asesor académico' }
];

const ROL_STYLES = {
  admin:            'bg-red-100 text-red-700 border-red-200',
  profesor:         'bg-blue-100 text-blue-700 border-blue-200',
  estudiante:       'bg-emerald-100 text-emerald-700 border-emerald-200',
  contador:         'bg-yellow-100 text-yellow-700 border-yellow-200',
  cobranza:         'bg-orange-100 text-orange-700 border-orange-200',
  jefe:             'bg-purple-100 text-purple-700 border-purple-200',
  director:         'bg-indigo-100 text-indigo-700 border-indigo-200',
  coordinadora:     'bg-pink-100 text-pink-700 border-pink-200',
  asesor_academico: 'bg-teal-100 text-teal-700 border-teal-200',
};

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function getAuthHeaders() {
  const token = localStorage.getItem('iar_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function Avatar({ nombre, apellido }) {
  const initials = `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-primary-main/15 text-primary-main flex items-center justify-center text-xs font-bold flex-shrink-0 select-none">
      {initials || '?'}
    </div>
  );
}

function RolBadge({ rol }) {
  const cls = ROL_STYLES[rol] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${cls}`}>
      {rol.replace('_', ' ')}
    </span>
  );
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function UserModal({ open, onClose, editingUser, onSaved }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (editingUser) {
      setFormData({
        nombre: editingUser.nombre || '',
        apellido: editingUser.apellido || '',
        correo_electronico: editingUser.correo_electronico || '',
        contrasena: '',
        rol: editingUser.rol || 'estudiante'
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [open, editingUser]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo_electronico: formData.correo_electronico,
        rol: formData.rol
      };
      if (!editingUser || formData.contrasena.trim() !== '') {
        payload.contrasena = formData.contrasena;
      }
      const url = editingUser
        ? `${API_BASE_URL}/api/users/${editingUser.id}`
        : `${API_BASE_URL}/api/users`;
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible guardar el usuario.');
      onClose();
      await onSaved();
      await Swal.fire({
        icon: 'success',
        title: editingUser ? 'Usuario actualizado' : 'Usuario creado',
        text: editingUser
          ? 'Los cambios se guardaron correctamente.'
          : `Usuario creado.${data.user?.matricula ? ` Matrícula: ${data.user.matricula}.` : ''}`
      });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'No fue posible guardar', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-main">
              {editingUser ? 'Editar usuario' : 'Nuevo usuario'}
            </p>
            <h2 className="text-lg font-bold text-neutral-dark mt-0.5">
              {editingUser
                ? `${editingUser.nombre} ${editingUser.apellido}`
                : 'Registrar usuario'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-nombre">
                Nombre
              </label>
              <input
                id="modal-nombre" name="nombre" required
                value={formData.nombre} onChange={handleChange}
                placeholder="Ej. María"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-sm text-neutral-dark outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-apellido">
                Apellido
              </label>
              <input
                id="modal-apellido" name="apellido" required
                value={formData.apellido} onChange={handleChange}
                placeholder="Ej. García"
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-sm text-neutral-dark outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-correo">
              Correo electrónico
            </label>
            <input
              id="modal-correo" name="correo_electronico" type="email" required
              value={formData.correo_electronico} onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-sm text-neutral-dark outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-pass">
              Contraseña{' '}
              {editingUser && (
                <span className="font-normal text-neutral-400">(dejar vacío para no cambiar)</span>
              )}
            </label>
            <input
              id="modal-pass" name="contrasena" type="password"
              required={!editingUser}
              value={formData.contrasena} onChange={handleChange}
              placeholder={editingUser ? '••••••••' : 'Mínimo 8 caracteres'}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-sm text-neutral-dark outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-600" htmlFor="modal-rol">
              Rol
            </label>
            <select
              id="modal-rol" name="rol"
              value={formData.rol} onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-sm text-neutral-dark outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {formData.rol === 'estudiante' && !editingUser && (
              <p className="text-[11px] text-neutral-400 mt-1">
                La matrícula se asignará automáticamente al guardar.
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-neutral-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-primary-main hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 px-5 py-2.5 text-sm text-white font-semibold transition-all"
            >
              {saving ? 'Guardando…' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 hover:bg-neutral-50 px-5 py-2.5 text-sm text-neutral-600 font-semibold transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────────
export const AdminUsuarios = () => {
  const navigate = useNavigate();
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deletingId, setDeletingId]   = useState(null);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch]           = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/users`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'No fue posible cargar los usuarios.');
      setUsers(data.users || []);
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Error al cargar usuarios', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(user) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar usuario',
      text: `¿Eliminar a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });
    if (!result.isConfirmed) return;
    setDeletingId(user.id);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'DELETE', headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'No fue posible eliminar.');
      await loadUsers();
      await Swal.fire({ icon: 'success', title: 'Eliminado', text: 'El usuario fue eliminado.' });
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setDeletingId(null);
    }
  }

  function openCreate() { setEditingUser(null);  setModalOpen(true); }
  function openEdit(u)  { setEditingUser(u);      setModalOpen(true); }

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  const stats = useMemo(() => ({
    total:     users.length,
    admins:    users.filter((u) => u.rol === 'admin').length,
    students:  users.filter((u) => u.rol === 'estudiante').length,
    connected: users.filter((u) => Boolean(u.last_login)).length
  }), [users]);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        `${u.nombre} ${u.apellido}`.toLowerCase().includes(q) ||
        u.correo_electronico?.toLowerCase().includes(q) ||
        u.rol?.toLowerCase().includes(q) ||
        u.matricula?.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <>
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editingUser={editingUser}
        onSaved={loadUsers}
      />

      <div className="min-h-screen bg-neutral-light">

        {/* HEADER */}
        <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">
                Panel administrativo
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">Gestión de usuarios</h1>
              <p className="text-sm text-white/60 mt-1">
                Administra cuentas, roles y accesos del sistema.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
            
              <button
                type="button" onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-accent-orange hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold transition-colors"
              >
                <LogOut size={15} />
                Salir
              </button>
            </div>
          </div>
        </header>

        {/* BODY */}
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* STATS */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { icon: <Users size={17} />,      label: 'Usuarios totales',    value: stats.total },
              { icon: <Shield size={17} />,     label: 'Admins',              value: stats.admins },
              { icon: <BadgeCheck size={17} />, label: 'Estudiantes',         value: stats.students },
              { icon: <Clock3 size={17} />,     label: 'Con última conexión', value: stats.connected }
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl border border-neutral-200 px-5 py-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-main/10 text-primary-main flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-dark/40 font-semibold truncate">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-neutral-dark leading-none mt-0.5">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* TABLA */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">

            {/* Toolbar */}
            <div className="px-6 py-5 border-b border-neutral-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-bold text-neutral-dark">Usuarios registrados</h2>
                <p className="text-xs text-neutral-dark/40 mt-0.5">
                  {loading ? 'Cargando…' : `${filteredUsers.length} de ${users.length} usuarios`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  />
                  <input
                    type="search"
                    placeholder="Buscar usuario…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-48 rounded-xl border border-neutral-200 bg-neutral-50 pl-8 pr-3 py-2 text-sm outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary-main hover:bg-primary-dark active:scale-[0.98] px-4 py-2 text-sm text-white font-semibold transition-all whitespace-nowrap"
                >
                  <UserPlus size={15} />
                  Registrar usuario
                </button>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/80 text-left">
                    {['Usuario', 'Matrícula', 'Rol', 'Última conexión', ''].map((col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-dark/35"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-sm text-neutral-400">
                        <RefreshCw size={18} className="inline-block animate-spin mb-2 opacity-40" />
                        <br />Cargando usuarios…
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-sm text-neutral-400">
                        {search ? `Sin resultados para "${search}"` : 'Aún no hay usuarios registrados.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors group">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar nombre={user.nombre} apellido={user.apellido} />
                            <div className="min-w-0">
                              <p className="font-semibold text-neutral-dark text-sm truncate">
                                {user.nombre} {user.apellido}
                              </p>
                              <p className="text-xs text-neutral-400 truncate">
                                {user.correo_electronico}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-mono text-xs text-neutral-500 bg-neutral-100 rounded-lg px-2 py-1">
                            {user.matricula || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <RolBadge rol={user.rol} />
                        </td>
                        <td className="px-6 py-3.5 text-xs text-neutral-400 whitespace-nowrap">
                          {formatDate(user.last_login)}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => openEdit(user)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 hover:border-primary-main hover:text-primary-main px-3 py-1.5 text-xs font-semibold transition-colors"
                            >
                              <Pencil size={12} />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={deletingId === user.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={12} />
                              {deletingId === user.id ? 'Eliminando…' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && users.length > 0 && (
              <div className="px-6 py-3 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  {users.length} {users.length === 1 ? 'usuario registrado' : 'usuarios registrados'}
                </p>

              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};