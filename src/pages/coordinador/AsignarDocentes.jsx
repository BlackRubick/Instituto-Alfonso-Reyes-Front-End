import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import { BookOpen, GraduationCap, Clock, MapPin, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const LEVELS = {
  bachillerato: {
    label: 'Bachillerato',
    icon: GraduationCap
  },
  licenciatura: {
    label: 'Licenciatura',
    icon: BookOpen
  }
};

function AssignedCard({ materia, docente, onCardClick }) {
  const LevelIcon = LEVELS[materia.nivel]?.icon || BookOpen;

  return (
    <button
      type="button"
      onClick={() => onCardClick({ materia, docente })}
      className="group text-left bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-main/30 transition-all p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <LevelIcon size={14} className="text-primary-main/70" />
            <p className="text-[10px] uppercase tracking-[0.22em] text-primary-main/70 font-semibold">
              {LEVELS[materia.nivel]?.label}
            </p>
          </div>
          <h3 className="text-base font-bold text-neutral-dark leading-snug group-hover:text-primary-main transition-colors">
            {materia.nombre}
          </h3>
          <p className="text-sm text-neutral-dark/60 mt-1">
            {docente.nombre} {docente.apellido}
          </p>
        </div>
        <span className="inline-flex items-center justify-center rounded-full bg-primary-main/10 text-primary-main w-9 h-9 flex-shrink-0">
          <Calendar size={16} />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-neutral-dark/50">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1">
          <Clock size={12} />
          Asignar horario
        </span>
        <span className="font-medium">Click para asignar</span>
      </div>
    </button>
  );
}

function HorarioModal({ open, selectedItem, loading, onClose, onAssign }) {
  const [dias, setDias] = useState(['Lunes']);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('09:00');
  const [aula, setAula] = useState('');

  if (!open || !selectedItem) return null;

  const { materia, docente } = selectedItem;

  async function handleSubmit(e) {
    e.preventDefault();
    await onAssign({
      materia_id: materia.id,
      docente_id: docente.id,
      dias,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      aula
    });
    setDias(['Lunes']);
    setHoraInicio('08:00');
    setHoraFin('09:00');
    setAula('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden">
        <div className="bg-gradient-to-br from-primary-main to-primary-dark px-6 py-5 text-white">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-semibold">Asignar horario</p>
          <h3 className="text-2xl font-bold mt-1">{materia.nombre}</h3>
          <p className="text-sm text-white/75 mt-1">
            {docente.nombre} {docente.apellido} · {LEVELS[materia.nivel]?.label}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Días */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-3">Días de la semana</label>
            <div className="grid grid-cols-5 gap-2">
              {DIAS.map((dia) => (
                <label
                  key={dia}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border border-neutral-200 hover:border-primary-main/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={dias.includes(dia)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDias([...dias, dia]);
                      } else {
                        setDias(dias.filter((d) => d !== dia));
                      }
                    }}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-neutral-dark">{dia}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Horas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Hora de inicio</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-primary-main"
              >
                {HORAS.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">Hora de fin</label>
              <select
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-primary-main"
              >
                {HORAS.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Aula */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">Aula / Salón</label>
            <input
              type="text"
              value={aula}
              onChange={(e) => setAula(e.target.value)}
              placeholder="Ej: A101, Laboratorio 1"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-primary-main"
            />
          </div>

          {/* Resumen */}
          <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-neutral-dark/45 font-semibold mb-2">Resumen</p>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-neutral-dark">{materia.nombre}</p>
              <p className="text-neutral-dark/60">{docente.nombre} {docente.apellido}</p>
              <p className="text-neutral-dark/60">
                {dias.join(', ')} • {horaInicio} - {horaFin} {aula ? `• ${aula}` : ''}
              </p>
            </div>
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
              type="submit"
              disabled={!aula || dias.length === 0 || loading}
              className="px-4 py-2.5 rounded-xl bg-accent-orange text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Asignando...' : 'Asignar horario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AsignarDocentes() {
  const [level, setLevel] = useState('bachillerato');
  const [materiasAsignadas, setMateriasAsignadas] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('iar_token');

  const filteredMaterias = useMemo(() => {
    return materiasAsignadas.filter((item) => item.nivel === level && item.docente_id);
  }, [materiasAsignadas, level]);

  useEffect(() => {
    loadMateriasAsignadas();
  }, [level]);

  async function loadMateriasAsignadas() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/coordinador/materias-asignadas?nivel=${level}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No fue posible cargar las asignaciones.');
      }
      // Agrupar por materia y docente
      const grouped = data.materias || [];
      setMateriasAsignadas(grouped);
    } catch (error) {
      console.error('Error loading assigned materias:', error);
      setMateriasAsignadas([]);
    }
  }

  async function handleAssignHorario(horarioData) {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/coordinador/materia-docente/horario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(horarioData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo asignar el horario.');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Horario asignado',
        text: `Horario asignado correctamente a ${horarioData.dias.join(', ')}`
      });

      setSelectedItem(null);
      loadMateriasAsignadas();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al asignar horario',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  const currentLevel = LEVELS[level];
  const LevelIcon = currentLevel.icon;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-dark">Asignar horarios a docentes</h2>
          <p className="text-sm text-neutral-dark/55 mt-1">
            Selecciona una materia asignada para configurar el horario y días de clase.
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

      <section className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-primary-main to-primary-dark px-6 py-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/50 font-semibold mb-1">Materias asignadas</p>
          <h3 className="text-2xl font-bold leading-tight">{currentLevel.label}</h3>
          <p className="text-sm text-white/75 mt-1">
            {filteredMaterias.length} materia{filteredMaterias.length !== 1 ? 's' : ''} con docente{filteredMaterias.length !== 1 ? 's' : ''} asignado{filteredMaterias.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="p-6">
          {filteredMaterias.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMaterias.map((item, idx) => (
                <AssignedCard
                  key={`${item.id}-${item.docente_id}-${idx}`}
                  materia={{
                    id: item.id,
                    nombre: item.nombre,
                    nivel: item.nivel,
                    descripcion: item.descripcion
                  }}
                  docente={{
                    id: item.docente_id,
                    nombre: item.docente_nombre,
                    apellido: item.docente_apellido
                  }}
                  onCardClick={setSelectedItem}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-dark/50">No hay materias asignadas en este nivel aún.</p>
            </div>
          )}
        </div>
      </section>

      <HorarioModal
        open={Boolean(selectedItem)}
        selectedItem={selectedItem}
        loading={loading}
        onClose={() => setSelectedItem(null)}
        onAssign={handleAssignHorario}
      />
    </div>
  );
}
