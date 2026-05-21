import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { BookOpen, GraduationCap, UserRound, ChevronRight, Check } from 'lucide-react';
import { PLAN_BACHILLERATO, PLAN_LICENCIATURA } from '../../data/planEstudio';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LEVELS = {
  bachillerato: {
    label: 'Bachillerato',
    icon: GraduationCap,
    plan: PLAN_BACHILLERATO,
    subtitle: 'Selecciona una materia del plan de bachillerato para asignarla a un docente.'
  },
  licenciatura: {
    label: 'Licenciatura',
    icon: BookOpen,
    plan: PLAN_LICENCIATURA,
    subtitle: 'Selecciona una materia del plan de licenciatura para asignarla a un docente.'
  }
};

function flattenPlan(plan) {
  return plan.flatMap((sem) => sem.materias.map((materia, index) => ({
    id: `${sem.semestre}-${index}-${materia}`,
    materia,
    semestre: sem.semestre
  })));
}

function CardGrid({ items, onCardClick, materiasAsignadas, docentes }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((item) => {
        const asignacion = materiasAsignadas.find(
          (ma) => ma.nombre.toLowerCase() === item.materia.toLowerCase()
        );
        const docente = asignacion
          ? docentes.find((d) => d.id === asignacion.docente_id)
          : null;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onCardClick(item)}
            className={`group text-left rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 ${
              asignacion
                ? 'bg-red-50 border-red-200 hover:border-red-300'
                : 'bg-white border-neutral-200 hover:border-primary-main/30'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary-main/70 font-semibold mb-2">
                  {item.semestre}
                </p>
                <h3 className={`text-base font-bold leading-snug group-hover:text-primary-main transition-colors ${
                  asignacion ? 'text-neutral-dark' : 'text-neutral-dark'
                }`}>
                  {item.materia}
                </h3>
              </div>
              <span className={`inline-flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0 ${
                asignacion
                  ? 'bg-red-100 text-red-600'
                  : 'bg-primary-main/10 text-primary-main'
              }`}>
                {asignacion ? <Check size={16} /> : <ChevronRight size={16} />}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs">
              {asignacion && docente ? (
                <div className="flex-1 rounded-full bg-red-100 px-2.5 py-1 flex items-center gap-1.5">
                  <UserRound size={12} className="text-red-600" />
                  <span className="text-red-700 font-semibold">
                    {docente.nombre} {docente.apellido}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1">
                  <UserRound size={12} />
                  Asignar docente
                </span>
              )}
              <span className="font-medium text-neutral-dark/50">
                {asignacion ? 'Modificar' : 'Ver'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AssignModal({ open, materia, levelLabel, docentes, loading, onClose, onAssign, isModifying = false }) {
  const [docenteId, setDocenteId] = useState('');

  useEffect(() => {
    if (open) {
      setDocenteId('');
    }
  }, [open, materia]);

  if (!open || !materia) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        <div className={`px-6 py-5 text-white ${
          isModifying
            ? 'bg-gradient-to-br from-red-500 to-red-700'
            : 'bg-gradient-to-br from-primary-main to-primary-dark'
        }`}>
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">
            {isModifying ? 'Modificar asignación' : 'Asignar materia'}
          </p>
          <h3 className="text-2xl font-bold mt-1">{materia.materia}</h3>
          <p className="text-sm text-white/75 mt-1">{levelLabel} · {materia.semestre}</p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Docente</label>
            <select
              value={docenteId}
              onChange={(e) => setDocenteId(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-primary-main"
            >
              <option value="">Selecciona un docente</option>
              {docentes.map((docente) => (
                <option key={docente.id} value={docente.id}>
                  {docente.nombre} {docente.apellido} · {docente.correo_electronico}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-dark/45 font-semibold mb-2">Materia seleccionada</p>
            <p className="font-semibold text-neutral-dark">{materia.materia}</p>
            <p className="text-sm text-neutral-dark/60 mt-1">{materia.semestre}</p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-sm font-semibold text-neutral-dark hover:bg-neutral-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!docenteId || loading}
              onClick={() => onAssign(docenteId)}
              className={`px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${
                isModifying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-accent-orange hover:bg-orange-600'
              }`}
            >
              {loading ? (isModifying ? 'Actualizando...' : 'Asignando...') : (isModifying ? 'Actualizar asignación' : 'Asignar docente')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Materias() {
  const [level, setLevel] = useState('bachillerato');
  const [period, setPeriod] = useState('SEMESTRE I');
  const [docentes, setDocentes] = useState([]);
  const [materiasAsignadas, setMateriasAsignadas] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const token = localStorage.getItem('iar_token');

  const currentLevel = LEVELS[level];
  const periods = useMemo(() => currentLevel.plan.map((sem) => sem.semestre), [currentLevel.plan]);
  const cards = useMemo(() => {
    const activeSemester = currentLevel.plan.find((sem) => sem.semestre === period) || currentLevel.plan[0];
    return activeSemester ? flattenPlan([activeSemester]) : [];
  }, [currentLevel.plan, period]);

  useEffect(() => {
    setPeriod(currentLevel.plan[0]?.semestre || '');
  }, [level]);

  useEffect(() => {
    loadDocentes();
    loadMateriasAsignadas();
  }, [level]);

  async function loadDocentes() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/docentes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No fue posible cargar los docentes.');
      }
      setDocentes(data.users || []);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
  }

  async function loadMateriasAsignadas() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/coordinador/materias-asignadas?nivel=${level}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No fue posible cargar las asignaciones.');
      }
      setMateriasAsignadas(data.materias || []);
    } catch (error) {
      console.error('Error loading assigned materias:', error);
      setMateriasAsignadas([]);
    }
  }

  async function handleAssign(docenteId) {
    if (!selectedMateria) return;

    try {
      setAssignLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/coordinador/materias/${encodeURIComponent(selectedMateria.id)}/asignar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: selectedMateria.materia,
          nivel: level,
          descripcion: selectedMateria.semestre,
          docente_id: Number(docenteId)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo asignar la materia.');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Materia asignada',
        text: `${selectedMateria.materia} se asignó correctamente.`
      });

      setSelectedMateria(null);
      loadMateriasAsignadas();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al asignar',
        text: error.message
      });
    } finally {
      setAssignLoading(false);
    }
  }

  const asignacionActual = selectedMateria
    ? materiasAsignadas.find(
        (ma) => ma.nombre.toLowerCase() === selectedMateria.materia.toLowerCase()
      )
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark">Materias por nivel</h2>
          <p className="text-sm text-neutral-dark/55 mt-1">
            Da click en una card para asignar esa materia a un docente o modificar la asignación actual.
          </p>
        </div>

        <div className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-100/70 p-1 gap-1 self-start lg:self-auto">
          {Object.entries(LEVELS).map(([key, info]) => {
            const Icon = info.icon;
            const active = level === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setLevel(key)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-white text-primary-main shadow-sm border border-neutral-200'
                    : 'text-neutral-dark/55 hover:text-neutral-dark'
                }`}
              >
                <Icon size={15} />
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-dark/45 font-semibold">{level === 'bachillerato' ? 'Semestres' : 'Cuatrimestres'}</p>
            <p className="text-sm text-neutral-dark/55 mt-1">Selecciona un {level === 'bachillerato' ? 'semestre' : 'cuatrimestre'} para ver solo esas materias.</p>
          </div>
          <div className="text-sm text-neutral-dark/50 font-medium">{cards.length} materias visibles</div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {periods.map((item) => {
            const active = period === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                  active
                    ? 'bg-primary-main text-white border-primary-main'
                    : 'bg-white text-neutral-dark/60 border-neutral-200 hover:border-primary-main/30 hover:text-primary-main'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-primary-main to-primary-dark px-6 py-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/50 font-semibold mb-1">Plan de estudio</p>
          <h3 className="text-2xl font-bold leading-tight">{currentLevel.label} · {period}</h3>
          <p className="text-sm text-white/75 mt-1 max-w-2xl">{currentLevel.subtitle}</p>
        </div>

        <div className="p-6">
          <CardGrid
            items={cards}
            onCardClick={setSelectedMateria}
            materiasAsignadas={materiasAsignadas}
            docentes={docentes}
          />
        </div>
      </section>

      <AssignModal
        open={Boolean(selectedMateria)}
        materia={selectedMateria}
        levelLabel={currentLevel.label}
        docentes={docentes}
        loading={assignLoading}
        onClose={() => setSelectedMateria(null)}
        onAssign={handleAssign}
        isModifying={Boolean(asignacionActual)}
      />
    </div>
  );
}
