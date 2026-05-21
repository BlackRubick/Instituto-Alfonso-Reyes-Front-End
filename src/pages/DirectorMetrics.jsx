import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TrendingUp, RefreshCw, LogOut } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CATEGORIAS = [
  { key: 'uniformes',          label: 'Uniformes',        icon: '👕' },
  { key: 'examenes',           label: 'Exámenes',         icon: '📝' },
  { key: 'inscripciones',      label: 'Inscripciones',    icon: '✍️' },
  { key: 'reinscripciones',    label: 'Reinscripciones',  icon: '🔄' },
  { key: 'practicas',          label: 'Prác. clínicas',   icon: '🩺' },
  { key: 'credenciales',       label: 'Credenciales',     icon: '🪪' },
];

// Paleta usando los colores del proyecto
const COLORS = ['#f97316', '#d97706', '#1e3a5f', '#2d5282', '#f59e0b', '#92400e'];

const fmt   = v => v != null ? `$${Number(v).toLocaleString('es-MX')}` : '$0';
const fmtSh = v => {
  if (v == null) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-primary-dark border border-accent-gold/30 rounded-xl px-4 py-2.5 shadow-lg">
      <p className="text-xs font-bold text-accent-gold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold text-white">{fmt(p.value)}</p>
      ))}
    </div>
  );
};

export default function DirectorMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('iar_token');
  const navigate = useNavigate();

  useEffect(() => { fetchMetrics(); }, []);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE_URL}/api/metrics/director`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error cargando métricas');
      setMetrics(data.metrics);
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  const safeVal = (k) => {
    const v = metrics && typeof metrics[k] !== 'undefined' ? metrics[k] : 0;
    return Number(v) || 0;
  };

  const total = metrics ? CATEGORIAS.reduce((s, c) => s + safeVal(c.key), 0) : 0;

  const barData = metrics ? CATEGORIAS.map(c => ({
    name: c.label,
    value: safeVal(c.key),
  })) : [];

  const pieData = metrics ? CATEGORIAS
    .map((c, i) => ({ name: c.label, value: safeVal(c.key), color: COLORS[i] }))
    .filter(d => d.value > 0) : [];

  const pct = v => total > 0 ? ((Number(v) / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-neutral-light">

      {/* ── HEADER ─────────────────────────────────── */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">
              Dirección General
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">Director / Reportes Globales</h1>
            <p className="text-sm text-white/60 mt-1">
              Métricas financieras globales y distribución de ingresos de la institución.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchMetrics}
              disabled={loading}
              className="p-2.5 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Sincronizar datos"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-3 transition-colors"
            >
              <LogOut size={15} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* ── NAV TABS ────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Secciones del panel">
            <button
              className="inline-flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 border-primary-main text-primary-main whitespace-nowrap"
            >
              <TrendingUp size={15} />
              Métricas Globales
            </button>
          </nav>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-primary-main/20 border-t-accent-orange animate-spin mx-auto" />
              <p className="text-sm text-neutral-dark/50">Cargando métricas...</p>
            </div>
          </div>
        ) : !metrics ? (
          <div className="text-center py-12">
            <p className="text-neutral-dark/50">No se pudieron cargar las métricas.</p>
          </div>
        ) : (
          <>
            {/* KPI hero — total general + periodos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total */}
              <div className="md:col-span-2 bg-gradient-to-br from-primary-main via-primary-dark to-primary-bg rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border-[30px] border-white/5 pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full border-[16px] border-accent-gold/10 pointer-events-none" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">Total general</p>
                <p className="text-4xl font-bold text-white leading-none mb-1">{fmtSh(total)}</p>
                <p className="text-sm text-white/60">Suma de todos los conceptos</p>
                <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold/30" />
              </div>

              {/* Periodos */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col justify-between shadow-soft">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-neutral-dark/40 mb-1">Total periodos</p>
                  <p className="text-2xl font-bold text-neutral-dark">{fmt(metrics.total_periodos)}</p>
                </div>
                <div className="h-1 rounded-full bg-accent-gold/30 mt-4">
                  <div className="h-full rounded-full bg-accent-gold w-full" />
                </div>
              </div>
            </div>

            {/* KPI cards por concepto */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIAS.map((c, i) => {
                const val = metrics[c.key] || 0;
                const p   = parseFloat(pct(val));
                return (
                  <div key={c.key} className="bg-white border border-neutral-200 rounded-2xl p-4 hover:border-accent-orange/30 hover:shadow-sm transition-all flex flex-col justify-between shadow-soft">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg">{c.icon}</span>
                        <span className="text-xs font-bold text-neutral-dark/30">{p}%</span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-dark/50 uppercase tracking-wide mb-1 break-words">{c.label}</p>
                      <p className="text-xl font-bold text-neutral-dark">{fmtSh(val)}</p>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-accent-orange transition-all"
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar chart */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-dark/40 mb-4">Comparativa por concepto</p>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 4, right: 8, bottom: 24, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 600 }}
                        axisLine={false} tickLine={false}
                        angle={-35} textAnchor="end" interval={0}
                      />
                      <YAxis
                        tickFormatter={fmtSh}
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false} tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f97316', fillOpacity: 0.05 }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie chart */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-dark/40 mb-4">Distribución porcentual</p>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={v => (
                          <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{v}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tabla detallada */}
            <div className="bg-white border border-neutral-200 rounded-2xl shadow-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-dark/40">Desglose completo</p>
                <span className="text-xs font-bold text-accent-orange bg-accent-orange/10 px-2.5 py-1 rounded-full">
                  {CATEGORIAS.length} conceptos
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-neutral-light">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold text-neutral-dark/40 uppercase tracking-wide">Concepto</th>
                      <th className="px-5 py-3 text-right text-xs font-bold text-neutral-dark/40 uppercase tracking-wide">Monto</th>
                      <th className="px-5 py-3 text-right text-xs font-bold text-neutral-dark/40 uppercase tracking-wide">%</th>
                      <th className="px-5 py-3 text-left text-xs font-bold text-neutral-dark/40 uppercase tracking-wide w-32">Proporción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {CATEGORIAS.map((c, i) => {
                      const val = metrics[c.key] || 0;
                      const p   = parseFloat(pct(val));
                      return (
                        <tr key={c.key} className="hover:bg-neutral-light/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                                style={{ background: COLORS[i] + '18' }}
                              >
                                {c.icon}
                              </span>
                              <span className="text-sm font-semibold text-neutral-dark">{c.label}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-sm font-bold text-neutral-dark">{fmt(val)}</span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="text-xs font-bold text-neutral-dark/50">{p}%</span>
                          </td>
                          <td className="px-5 py-3.5 pr-8">
                            <div className="h-1.5 rounded-full bg-neutral-100 w-full">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${p}%`, background: COLORS[i] }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-neutral-200 bg-neutral-light font-bold">
                      <td className="px-5 py-3.5 text-sm text-neutral-dark">Total general</td>
                      <td className="px-5 py-3.5 text-right text-sm text-accent-orange">{fmt(total)}</td>
                      <td className="px-5 py-3.5 text-right text-xs text-neutral-dark/50">100%</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

