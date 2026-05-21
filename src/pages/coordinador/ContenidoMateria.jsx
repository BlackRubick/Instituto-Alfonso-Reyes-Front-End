import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SECCIONES = [
  { key: 'denominacion',             label: 'Denominación de la asignatura o unidad de aprendizaje', tipo: 'input',    placeholder: 'Nombre oficial de la asignatura' },
  { key: 'ciclo_escolar',            label: 'Ciclo escolar',                                          tipo: 'input',    placeholder: 'Ej. 2024-2025' },
  { key: 'clave_asignatura',         label: 'Clave de la asignatura',                                 tipo: 'input',    placeholder: 'Ej. MAT-101' },
  { key: 'fines_aprendizaje',        label: 'Fines de aprendizaje o formación',                       tipo: 'textarea', placeholder: 'Describe los fines formativos...' },
  { key: 'contenido_tematico',       label: 'Contenido temático',                                     tipo: 'textarea', placeholder: 'Lista los temas y subtemas...' },
  { key: 'actividades_conduccion',   label: 'Actividades de aprendizaje bajo conducción de un académico', tipo: 'textarea', placeholder: 'Actividades guiadas por el docente...' },
  { key: 'actividades_independientes', label: 'Actividades de aprendizaje independientes',            tipo: 'textarea', placeholder: 'Actividades autónomas del alumno...' },
  { key: 'criterios_evaluacion',     label: 'Criterios de evaluación',                                tipo: 'textarea', placeholder: 'Describe los criterios y porcentajes...' },
  { key: 'modalidades_tecnologicas', label: 'Modalidades tecnológicas e informáticas',                tipo: 'textarea', placeholder: 'Herramientas, plataformas y recursos digitales...' },
];

const FORM_INICIAL = SECCIONES.reduce((acc, s) => ({ ...acc, [s.key]: '' }), { titulo: '' });

// Grupos para organizar el formulario en secciones visuales
const GRUPOS = [
  {
    titulo: 'Identificación',
    icon: '🎓',
    keys: ['denominacion', 'ciclo_escolar', 'clave_asignatura'],
  },
  {
    titulo: 'Estructura académica',
    icon: '📚',
    keys: ['fines_aprendizaje', 'contenido_tematico'],
  },
  {
    titulo: 'Actividades',
    icon: '✏️',
    keys: ['actividades_conduccion', 'actividades_independientes'],
  },
  {
    titulo: 'Evaluación y tecnología',
    icon: '📊',
    keys: ['criterios_evaluacion', 'modalidades_tecnologicas'],
  },
];

function parsearContenido(descripcion) {
  if (!descripcion) return {};
  const resultado = {};
  SECCIONES.forEach(s => {
    const regex = new RegExp(`\\[${s.label.toUpperCase()}\\]\\n([\\s\\S]*?)(?=\\n\\[|$)`, 'i');
    const match = descripcion.match(regex);
    resultado[s.key] = match ? match[1].trim() : '';
  });
  return resultado;
}

export default function ContenidoMateria() {
  const [materias, setMaterias]             = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [form, setForm]                     = useState(FORM_INICIAL);
  const [contenidos, setContenidos]         = useState([]);
  const [expandido, setExpandido]           = useState(null);
  const token = localStorage.getItem('iar_token');

  useEffect(() => { fetchMaterias(); }, []);

  async function fetchMaterias() {
    const res  = await fetch(`${API_BASE_URL}/api/coordinador/materias`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setMaterias(data.materias || []);
  }

  async function fetchContenidos(materiaId) {
    const res  = await fetch(`${API_BASE_URL}/api/coordinador/materias/${materiaId}/contenido`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setContenidos(data.contenidos || []);
  }

  async function handleCreate(e) {
    e.preventDefault();
    const descripcion = SECCIONES
      .map(s => `[${s.label.toUpperCase()}]\n${form[s.key]}`)
      .join('\n\n');
    try {
      const res  = await fetch(`${API_BASE_URL}/api/coordinador/materias/${selectedMateria}/contenido`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titulo: form.titulo, descripcion, recursos: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error creando contenido');
      Swal.fire('Creado', 'Contenido creado correctamente', 'success');
      setForm(FORM_INICIAL);
      fetchContenidos(selectedMateria);
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  }

  const seccionMap = Object.fromEntries(SECCIONES.map(s => [s.key, s]));

  return (
    <div className="max-w-3xl mx-auto py-6 px-2">

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Contenido de materias</h2>
        <p className="text-sm text-neutral-500 mt-1">Registra el programa académico completo de cada asignatura.</p>
      </div>

      {/* Card principal del formulario */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm mb-8">

        {/* Selector de materia — header del card */}
        <div className="bg-orange-50 border-b border-orange-100 px-6 py-4">
          <label className="block text-xs font-semibold uppercase tracking-widest text-orange-700 mb-2">
            Materia
          </label>
          <select
            className="w-full bg-white border border-orange-200 rounded-lg px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            value={selectedMateria}
            onChange={e => { setSelectedMateria(e.target.value); fetchContenidos(e.target.value); }}
          >
            <option value="">— Selecciona una materia —</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nombre} — {m.nivel}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleCreate} className="px-6 py-5 space-y-6">

          {/* Título del contenido */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
              Título del contenido <span className="text-orange-500 normal-case font-normal tracking-normal text-xs">(identificador)</span>
            </label>
            <input
              className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              placeholder="Ej. Programa primer semestre 2025"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              required
            />
          </div>

          {/* Secciones agrupadas */}
          {GRUPOS.map(grupo => (
            <div key={grupo.titulo}>
              {/* Separador de grupo */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{grupo.icon}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{grupo.titulo}</span>
                <div className="flex-1 border-t border-neutral-100" />
              </div>

              <div className="space-y-3">
                {grupo.keys.map(key => {
                  const s = seccionMap[key];
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">{s.label}</label>
                      {s.tipo === 'input' ? (
                        <input
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                          placeholder={s.placeholder}
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        />
                      ) : (
                        <textarea
                          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-y"
                          placeholder={s.placeholder}
                          rows={3}
                          value={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Botón */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!selectedMateria}
              className="w-full bg-accent-orange hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
            >
              Crear contenido
            </button>
          </div>
        </form>
      </div>

      {/* Lista de contenidos */}
      {contenidos.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-neutral-700 mb-3 flex items-center gap-2">
            <span>Contenidos registrados</span>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{contenidos.length}</span>
          </h3>

          <div className="space-y-2">
            {contenidos.map(c => {
              const campos = parsearContenido(c.descripcion);
              const abierto = expandido === c.id;
              return (
                <div key={c.id} className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandido(abierto ? null : c.id)}
                    className="w-full text-left px-5 py-4 flex items-start justify-between hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-neutral-800 text-sm leading-snug truncate">{c.titulo}</div>
                      {campos.denominacion && (
                        <div className="text-sm text-neutral-500 mt-0.5 truncate">{campos.denominacion}</div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        {campos.ciclo_escolar && (
                          <span className="bg-orange-50 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-md border border-orange-100">
                            {campos.ciclo_escolar}
                          </span>
                        )}
                        {campos.clave_asignatura && (
                          <span className="bg-neutral-100 text-neutral-600 text-xs font-mono px-2 py-0.5 rounded-md">
                            {campos.clave_asignatura}
                          </span>
                        )}
                        <span className="text-xs text-neutral-400 ml-auto">
                          {new Date(c.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className={`ml-4 mt-0.5 text-neutral-400 text-xs transition-transform ${abierto ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {abierto && (
                    <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50 space-y-4">
                      {SECCIONES.filter(s => !['denominacion','ciclo_escolar','clave_asignatura'].includes(s.key)).map(s =>
                        campos[s.key] ? (
                          <div key={s.key}>
                            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">{s.label}</div>
                            <div className="text-sm text-neutral-700 whitespace-pre-line leading-relaxed">{campos[s.key]}</div>
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {contenidos.length === 0 && selectedMateria && (
        <div className="text-center py-12 text-neutral-400">
          <div className="text-4xl mb-3">📄</div>
          <div className="text-sm">No hay contenidos registrados para esta materia.</div>
        </div>
      )}
    </div>
  );
}