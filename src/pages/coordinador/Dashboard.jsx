import { useEffect, useMemo, useState } from 'react';
import { GraduationCap, BookMarked } from 'lucide-react';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const HORAS = [
  '7:00', '8:00', '9:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00'
];

const MATERIA_COLORS = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-violet-100 text-violet-800 border-violet-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-800 border-rose-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-pink-100 text-pink-800 border-pink-200'
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function createEmptyGrid() {
  return HORAS.reduce((grid, hora) => {
    grid[hora] = DIAS.reduce((dias, dia) => {
      dias[dia] = null;
      return dias;
    }, {});
    return grid;
  }, {});
}

function buildColorMap(horario) {
  const map = {};
  let idx = 0;
  Object.values(horario).forEach((row) => {
    Object.values(row).forEach((cell) => {
      if (cell && !map[cell.materia]) {
        map[cell.materia] = MATERIA_COLORS[idx % MATERIA_COLORS.length];
        idx += 1;
      }
    });
  });
  return map;
}

function buildGridFromRows(rows, nivel) {
  const grid = createEmptyGrid();

  rows
    .filter((row) => row.nivel === nivel && row.dia && row.hora)
    .forEach((row) => {
      if (!grid[row.hora]) return;
      grid[row.hora][row.dia] = row.materia
        ? {
            materia: row.materia,
            docente: row.docente || 'Sin docente',
            aula: row.aula || null
          }
        : null;
    });

  return grid;
}

function TablaHorario({ horario, colorMap }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-primary-main text-white">
            <th className="w-20 px-4 py-3 text-left text-xs font-bold uppercase tracking-widest opacity-80">Hora</th>
            {DIAS.map((dia) => (
              <th key={dia} className="px-3 py-3 text-center text-xs font-bold uppercase tracking-widest min-w-[120px]">
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HORAS.map((hora, hi) => (
            <tr key={hora} className={hi % 2 === 0 ? 'bg-white' : 'bg-neutral-50/60'}>
              <td className="px-4 py-2 border-r border-neutral-100">
                <span className="inline-flex items-center justify-center w-16 rounded-lg border border-neutral-200 bg-white py-1.5 text-xs font-bold text-neutral-dark shadow-sm">
                  {hora}
                </span>
              </td>
              {DIAS.map((dia) => {
                const cell = horario[hora]?.[dia];
                const color = cell ? colorMap[cell.materia] : '';
                return (
                  <td key={dia} className="px-2 py-2 border-r border-neutral-100 last:border-r-0">
                    {cell ? (
                      <div className={`rounded-xl border px-2.5 py-2 ${color}`}>
                        <p className="font-semibold text-xs leading-tight">{cell.materia}</p>
                        <p className="text-[10px] opacity-70 mt-0.5 truncate">{cell.docente}</p>
                      </div>
                    ) : (
                      <div className="h-10 rounded-xl bg-neutral-100/60" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Leyenda({ colorMap }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.entries(colorMap).map(([materia, color]) => (
        <span key={materia} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
          {materia}
        </span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState('licenciatura');
  const [rows, setRows] = useState([]);

  const colorLic = useMemo(() => buildColorMap(buildGridFromRows(rows, 'licenciatura')), [rows]);
  const colorBach = useMemo(() => buildColorMap(buildGridFromRows(rows, 'bachillerato')), [rows]);

  useEffect(() => {
    const token = localStorage.getItem('iar_token');

    async function loadRows() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/coordinador/tablero-horarios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          setRows(Array.isArray(data.rows) ? data.rows : []);
        }
      } catch (error) {
        console.error('Error cargando tablero de horarios', error);
      }
    }

    loadRows();
  }, []);

  const horarioLicenciatura = buildGridFromRows(rows, 'licenciatura');
  const horarioBachillerato = buildGridFromRows(rows, 'bachillerato');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-dark">Mis horarios</h2>
          <p className="text-sm text-neutral-dark/50 mt-0.5">Vista general para coordinadora</p>
        </div>

        <div className="inline-flex rounded-2xl border border-neutral-200 bg-neutral-100/60 p-1 gap-1">
          <button
            type="button"
            onClick={() => setTab('licenciatura')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'licenciatura'
                ? 'bg-white text-primary-main shadow-sm border border-neutral-200'
                : 'text-neutral-dark/50 hover:text-neutral-dark'
            }`}
          >
            <GraduationCap size={15} />
            Licenciatura
          </button>
          <button
            type="button"
            onClick={() => setTab('bachillerato')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              tab === 'bachillerato'
                ? 'bg-white text-primary-main shadow-sm border border-neutral-200'
                : 'text-neutral-dark/50 hover:text-neutral-dark'
            }`}
          >
            <BookMarked size={15} />
            Bachillerato
          </button>
        </div>
      </div>

      {tab === 'licenciatura' ? (
        <div>
          <TablaHorario horario={horarioLicenciatura} colorMap={colorLic} />
          <Leyenda colorMap={colorLic} />
        </div>
      ) : (
        <div>
          <TablaHorario horario={horarioBachillerato} colorMap={colorBach} />
          <Leyenda colorMap={colorBach} />
        </div>
      )}
    </div>
  );
}
