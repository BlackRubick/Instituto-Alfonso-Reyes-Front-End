import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CalendarDays, UserCheck, BookOpen, FileText } from 'lucide-react';
import Horarios from './coordinador/Horarios';
import AsignarDocentes from './coordinador/AsignarDocentes';
import Materias from './coordinador/Materias';
import ContenidoMateria from './coordinador/ContenidoMateria';
import Dashboard from './coordinador/Dashboard';

const NAV_ITEMS = [
  {
    to: 'horarios',
    label: 'Crear horarios',
    icon: CalendarDays,
    description: 'Gestiona los horarios del ciclo'
  },
  {
    to: 'asignar',
    label: 'Asignar docentes',
    icon: UserCheck,
    description: 'Vincula profesores a materias'
  },
  {
    to: 'materias',
    label: 'Materias',
    icon: BookOpen,
    description: 'Administra el catálogo de materias'
  },
  {
    to: 'contenido',
    label: 'Contenido',
    icon: FileText,
    description: 'Gestiona el contenido por materia'
  }
];

export default function Coordinador() {
  const { pathname } = useLocation();

  // only coordinadora should see this panel
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('iar_user') || 'null');
  } catch {}

  if (!currentUser || currentUser.rol !== 'coordinadora') {
    return <Navigate to="/no-encontrada" replace />;
  }

  // Detecta cuál tab está activo
  const active = NAV_ITEMS.find((item) => pathname.endsWith(item.to))?.to ?? 'horarios';

  return (
    <div className="min-h-screen bg-neutral-light">

      {/* ── HEADER ─────────────────────────────────── */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-semibold mb-1">
            Panel de coordinación
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">Coordinadora</h1>
          <p className="text-sm text-white/60 mt-1">
            Gestiona horarios, docentes, materias y contenido académico.
          </p>
        </div>
      </header>

      {/* ── NAV TABS ────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto" aria-label="Secciones del panel">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
              const isActive = active === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    inline-flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap
                    border-b-2 transition-colors
                    ${isActive
                      ? 'border-primary-main text-primary-main'
                      : 'border-transparent text-neutral-dark/50 hover:text-neutral-dark hover:border-neutral-300'
                    }
                  `}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── CONTENIDO ───────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/"         element={<Dashboard />} />
          <Route path="horarios"  element={<Horarios />} />
          <Route path="asignar"   element={<AsignarDocentes />} />
          <Route path="materias"  element={<Materias />} />
          <Route path="contenido" element={<ContenidoMateria />} />
        </Routes>
      </main>
    </div>
  );
}