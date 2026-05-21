import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, Clock3, LogOut, School, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getAuthHeaders() {
  const token = localStorage.getItem('iar_token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export const Docentes = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null);
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('iar_user') || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    loadGroups();
    loadMaterias();
  }, []);

  async function loadGroups() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/docentes/grupos`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        navigate('/no-encontrada', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible cargar los grupos.');
      }

      setGroups(data.groups || []);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No fue posible cargar tus grupos',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadMaterias() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/materias/docente`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible cargar tus materias.');
      setMaterias(data.materias || []);
    } catch (error) {
      console.error('Error cargando materias:', error);
    }
  }

  async function loadContenidos(materiaId) {
    try {
      setSelectedMateriaId(materiaId);
      const response = await fetch(`${API_BASE_URL}/api/materias/${materiaId}/contenido`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No fue posible cargar contenidos.');
      setContenidos(data.contenidos || []);
    } catch (error) {
      console.error('Error cargando contenidos:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white px-4 py-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/55 font-semibold mb-2">Portal docente</p>
            <h1 className="text-3xl font-bold">Mis grupos asignados</h1>
            <p className="text-white/70 mt-2 text-sm">
              {currentUser ? `Bienvenido, ${currentUser.nombre} ${currentUser.apellido}.` : 'Consulta tus grupos activos por periodo.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-accent-orange hover:bg-orange-600 px-4 py-3 text-sm font-semibold transition-colors"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-dark/60">
            Cargando grupos...
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center">
            <Users size={34} className="mx-auto text-primary-main/50 mb-3" />
            <h2 className="text-xl font-bold text-neutral-dark">No tienes grupos asignados</h2>
            <p className="text-neutral-dark/60 mt-2">Cuando administración te asigne grupos, aparecerán aquí en tarjetas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {groups.map((group) => (
              <article key={group.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary-main/70 font-semibold">{group.clave}</p>
                    <h3 className="text-lg font-bold text-neutral-dark leading-tight mt-1">{group.nombre}</h3>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-primary-main/10 text-primary-main text-xs font-semibold uppercase tracking-wide">
                    {group.estatus}
                  </span>
                </div>

                <div className="space-y-2.5 text-sm text-neutral-dark/80">
                  <p className="flex items-center gap-2">
                    <BookOpen size={14} className="text-primary-main" />
                    <span><strong>Materia:</strong> {group.materia || 'Sin materia definida'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-primary-main" />
                    <span><strong>Periodo:</strong> {group.periodo || 'No definido'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 size={14} className="text-primary-main" />
                    <span><strong>Horario:</strong> {group.horario || 'No definido'}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <School size={14} className="text-primary-main" />
                    <span><strong>Aula:</strong> {group.salon || 'No definida'} • <strong>Turno:</strong> {group.turno || 'No definido'}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Mis materias</h2>
          {materias.length === 0 ? (
            <p className="text-neutral-dark/60">No tienes materias asignadas.</p>
          ) : (
            <div className="space-y-3">
              {materias.map(m => (
                <div key={m.id} className="p-4 border rounded flex justify-between items-start">
                  <div>
                    <div className="font-bold">{m.nombre} <span className="text-sm text-neutral-dark/60">{m.nivel}</span></div>
                    <div className="text-sm text-neutral-dark/60">{m.descripcion}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button className="px-3 py-1 bg-primary-main text-white rounded" onClick={()=>loadContenidos(m.id)}>Ver contenidos</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedMateriaId && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Contenidos</h3>
              {contenidos.length === 0 ? (
                <p className="text-neutral-dark/60">No hay contenidos para esta materia.</p>
              ) : (
                <ul className="space-y-3">
                  {contenidos.map(c => (
                    <li key={c.id} className="p-3 border rounded">
                      <div className="font-bold">{c.titulo}</div>
                      <div className="text-sm text-neutral-dark/60">{c.descripcion}</div>
                      <div className="text-xs text-neutral-dark/50 mt-2">Creado: {new Date(c.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
