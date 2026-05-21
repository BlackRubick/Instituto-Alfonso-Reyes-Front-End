import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LogOut, UserPlus, Search, X, Pencil, Trash2, Users, UserCheck, CalendarPlus } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getAuthHeaders() {
  const token = localStorage.getItem('iar_token');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

function getInitials(nombre = '', apellido = '') {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

// Paleta de avatares usando los colores del sistema (emerald, blue, amber, teal, etc.)
const AVATAR_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-blue-100',    text: 'text-blue-700'    },
  { bg: 'bg-amber-100',   text: 'text-amber-700'   },
  { bg: 'bg-teal-100',    text: 'text-teal-700'    },
  { bg: 'bg-yellow-100',  text: 'text-yellow-700'  },
  { bg: 'bg-cyan-100',    text: 'text-cyan-700'    },
];

function avatarColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length];
}

function StudentModal({ open, onClose, student, onSaved }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', correo_electronico: '', contrasena: '' });
  const isEditing = Boolean(student);

  useEffect(() => {
    if (!open) return;
    setForm({
      nombre: student?.nombre || '',
      apellido: student?.apellido || '',
      correo_electronico: student?.correo_electronico || '',
      contrasena: ''
    });
  }, [open, student]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = isEditing
        ? {
            nombre: form.nombre,
            apellido: form.apellido,
            correo_electronico: form.correo_electronico,
            ...(form.contrasena.trim() ? { contrasena: form.contrasena } : {})
          }
        : { ...form, rol: 'estudiante' };

      const response = await fetch(
        isEditing ? `${API_BASE_URL}/api/users/${student.id}` : `${API_BASE_URL}/api/users`,
        { method: isEditing ? 'PUT' : 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload) }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || (isEditing ? 'No fue posible actualizar el alumno.' : 'No fue posible crear el alumno.'));

      await Swal.fire({
        icon: 'success',
        title: isEditing ? 'Alumno actualizado' : 'Alumno creado',
        text: data.user?.matricula ? `Matrícula: ${data.user.matricula}` : ''
      });
      onSaved();
      onClose();
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-medium" role="dialog" aria-modal="true">

        {/* Header del modal — igual que en Contador.jsx */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-100">
          <div>
            <p className="text-[9px] uppercase tracking-widest font-bold text-primary-main">
              {isEditing ? 'Editar Alumno' : 'Registrar Alumno'}
            </p>
            <h3 className="text-base font-bold text-neutral-dark mt-0.5">
              {isEditing ? `${student?.nombre} ${student?.apellido}` : 'Nuevo estudiante'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-600">Nombre</label>
              <input
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-600">Apellido</label>
              <input
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-600">Correo electrónico</label>
            <input
              name="correo_electronico"
              type="email"
              required
              value={form.correo_electronico}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-600">Contraseña</label>
            <input
              name="contrasena"
              type="password"
              required={!isEditing}
              value={form.contrasena}
              onChange={handleChange}
              placeholder={isEditing ? 'Dejar vacío para no cambiar' : ''}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 px-3.5 py-2.5 text-xs outline-none focus:border-primary-main/60 focus:ring-2 focus:ring-primary-main/10 transition-all"
            />
          </div>

          <div className="flex gap-2.5 pt-4 border-t border-neutral-100">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary-main hover:bg-primary-dark text-white font-bold text-xs py-3 active:scale-[0.98] transition-all"
            >
              {isEditing ? 'Guardar cambios' : 'Crear alumno'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-semibold text-xs px-5 py-3 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Asesor() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadAlumnos(); }, []);

  async function loadAlumnos() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/estudiantes`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible cargar los alumnos.');
      setAlumnos(data.users || []);
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error al cargar alumnos', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  function openCreate() { setEditingAlumno(null); setModalOpen(true); }
  function openEdit(alumno) { setEditingAlumno(alumno); setModalOpen(true); }

  async function handleDelete(alumno) {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Eliminar alumno',
      text: `¿Eliminar a ${alumno.nombre} ${alumno.apellido}? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    });
    if (!result.isConfirmed) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${alumno.id}`, { method: 'DELETE', headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible eliminar el alumno.');
      await loadAlumnos();
      await Swal.fire({ icon: 'success', title: 'Alumno eliminado', text: 'El alumno fue eliminado correctamente.' });
    } catch (error) {
      await Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    }
  }

  const filteredAlumnos = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return alumnos;
    return alumnos.filter((a) =>
      `${a.nombre} ${a.apellido}`.toLowerCase().includes(q) ||
      a.correo_electronico?.toLowerCase().includes(q) ||
      a.matricula?.toLowerCase().includes(q)
    );
  }, [alumnos, search]);

  return (
    <div className="min-h-screen bg-neutral-light">

      {/* Header — mismo patrón que Contador.jsx */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">
              Asesor académico
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">Gestión de Alumnos</h1>
            <p className="text-sm text-white/60 mt-1">
              Registro y administración de estudiantes del instituto.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={loadAlumnos}
              disabled={loading}
              className="p-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Sincronizar"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-bold text-xs px-4 py-3 shadow-soft active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <UserPlus size={15} />
              Registrar alumno
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-3 transition-colors"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Tarjetas de estadísticas dentro del header — igual que Contador */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Total alumnos',      value: alumnos.length, icon: <Users size={16} />,       color: 'bg-white/15 text-white' },
              { title: 'Activos',            value: alumnos.length, icon: <UserCheck size={16} />,   color: 'bg-emerald-400/20 text-emerald-200' },
              { title: 'Registrados hoy',    value: 0,              icon: <CalendarPlus size={16} />, color: 'bg-accent-orange/20 text-orange-200' },
            ].map((card, i) => (
              <div key={i} className="bg-white/10 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/50">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1 leading-none">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden">

          {/* Toolbar de la tabla */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-neutral-dark">Alumnos registrados</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {filteredAlumnos.length} {filteredAlumnos.length === 1 ? 'resultado' : 'resultados'}
                {search && ` para "${search}"`}
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                placeholder="Buscar alumno por nombre, matrícula o correo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 pl-9 pr-9 py-3 text-xs outline-none focus:border-primary-main/50 focus:ring-2 focus:ring-primary-main/10 transition-all placeholder:text-neutral-300"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-left">
                  {['Alumno', 'Matrícula', 'Correo electrónico', 'Acciones'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-neutral-400">
                      <RefreshCw size={20} className="animate-spin text-primary-main mx-auto mb-2" />
                      Cargando alumnos…
                    </td>
                  </tr>
                ) : filteredAlumnos.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-neutral-400">
                      {search
                        ? `No se encontraron resultados para "${search}"`
                        : 'No hay alumnos registrados aún.'}
                    </td>
                  </tr>
                ) : (
                  filteredAlumnos.map((alumno) => {
                    const color = avatarColor(alumno.id);
                    return (
                      <tr key={alumno.id} className="hover:bg-neutral-50/60 transition-colors group">

                        {/* Alumno con avatar */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${color.bg} ${color.text}`}>
                              {getInitials(alumno.nombre, alumno.apellido)}
                            </div>
                            <p className="font-semibold text-xs text-neutral-dark">
                              {alumno.nombre} {alumno.apellido}
                            </p>
                          </div>
                        </td>

                        {/* Matrícula */}
                        <td className="px-6 py-3.5">
                          <span className="inline-block font-mono text-[10px] font-bold bg-primary-main/10 text-primary-main px-2.5 py-1 rounded-lg">
                            {alumno.matricula || '—'}
                          </span>
                        </td>

                        {/* Correo */}
                        <td className="px-6 py-3.5">
                          <span className="text-xs text-neutral-400">{alumno.correo_electronico}</span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(alumno)}
                              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-600 hover:border-primary-main hover:text-primary-main hover:bg-primary-main/5 transition-all"
                            >
                              <Pencil size={11} />
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(alumno)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-2.5 py-1.5 text-[10px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-all"
                            >
                              <Trash2 size={11} />
                              Eliminar
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          {!loading && filteredAlumnos.length > 0 && (
            <div className="px-6 py-3.5 border-t border-neutral-100 bg-neutral-50/40 flex items-center justify-between text-xs text-neutral-400">
              <p>Mostrando {filteredAlumnos.length} de {alumnos.length} alumno{alumnos.length !== 1 ? 's' : ''}</p>
            </div>
          )}

        </div>
      </main>

      <StudentModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingAlumno(null); }}
        student={editingAlumno}
        onSaved={loadAlumnos}
      />
    </div>
  );
}