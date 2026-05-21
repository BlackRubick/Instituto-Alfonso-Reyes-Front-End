import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, BarChart3, Menu, X, Users, GraduationCap,
  DollarSign, LogOut, ClipboardList, ChevronDown
} from 'lucide-react';

const INTERNAL_LINKS = [
  { path: '/metrics/jefe',     label: 'Métricas Jefe',    icon: BarChart3      },
  { path: '/metrics/director', label: 'Métricas Director', icon: BarChart3     },
  { path: '/admin',            label: 'Usuarios',          icon: Users         },
  { path: '/docentes',         label: 'Docentes',          icon: GraduationCap },
  { path: '/coordinador',      label: 'Coordinación',      icon: ClipboardList },
  { path: '/contador',         label: 'Contador',          icon: DollarSign    },
  { path: '/asesor',           label: 'Asesor',            icon: BookOpen      },
];

function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('iar_user') || 'null'); }
  catch { return null; }
}

function getInitials(nombre = '', apellido = '') {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || '??';
}

export function InternalNavbar() {
  const [isOpen,      setIsOpen]      = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location    = useLocation();
  const navigate    = useNavigate();
  const currentUser = getCurrentUser();
  const role        = normalizeRole(currentUser?.rol);

  function handleLogout() {
    localStorage.removeItem('iar_token');
    localStorage.removeItem('iar_user');
    navigate('/login_docentes', { replace: true });
  }

  function activePath(path) {
    if (path === '/coordinador') return location.pathname === '/coordinador' || location.pathname.startsWith('/coordinador/');
    if (path === '/contador')    return location.pathname === '/contador'    || location.pathname.startsWith('/contador/');
    return location.pathname === path;
  }

  const activeLink = INTERNAL_LINKS.find(l => activePath(l.path));

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2">

          {/* ── Logo ── */}
          <Link
            to={role === 'director' ? '/metrics/director' : '/metrics/jefe'}
            className="flex items-center gap-2.5 flex-shrink-0 group mr-2"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center shadow-soft flex-shrink-0">
              <BarChart3 size={16} className="text-white" />
            </div>
            {/* Solo visible en pantallas grandes */}
            <div className="hidden xl:block leading-tight">
              <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">Instituto Alfonso Reyes</p>
              <p className="text-xs font-bold text-neutral-dark group-hover:text-primary-main transition-colors">Panel Interno</p>
            </div>
          </Link>

          {/* ── Links desktop: visibles desde 1280px (xl) ── */}
          <div className="hidden xl:flex items-center gap-0.5 flex-1">
            {INTERNAL_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                    ${isActive
                      ? 'text-primary-main bg-primary-main/8'
                      : 'text-neutral-dark/60 hover:text-neutral-dark hover:bg-neutral-50'
                    }
                  `}
                >
                  <Icon size={13} />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-main" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Links compactos: visibles entre lg (1024px) y xl (1280px) ── */}
          <div className="hidden lg:flex xl:hidden items-center gap-0.5 flex-1">
            {INTERNAL_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  title={link.label}
                  className={`
                    relative p-2.5 rounded-xl transition-all
                    ${isActive
                      ? 'text-primary-main bg-primary-main/8'
                      : 'text-neutral-dark/50 hover:text-neutral-dark hover:bg-neutral-50'
                    }
                  `}
                >
                  <Icon size={15} />
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary-main" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Spacer para empujar el avatar a la derecha cuando no hay flex-1 */}
          <div className="flex-1 lg:hidden" />

          {/* ── Badge de sección activa (solo xl) ── */}
          {activeLink && (
            <div className="hidden xl:flex items-center flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-main/8 border border-primary-main/15 px-3 py-1 text-[10px] font-bold text-primary-main uppercase tracking-widest whitespace-nowrap">
                <activeLink.icon size={10} />
                {activeLink.label}
              </span>
            </div>
          )}

          {/* ── Avatar + dropdown (visible desde lg) ── */}
          <div className="hidden lg:flex items-center flex-shrink-0 relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(v => !v)}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 pl-1.5 pr-2.5 py-1.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {currentUser ? getInitials(currentUser.nombre, currentUser.apellido) : '??'}
              </div>
              <span className="hidden xl:block text-xs font-semibold text-neutral-dark max-w-[90px] truncate">
                {currentUser?.nombre || 'Usuario'}
              </span>
              <ChevronDown size={12} className={`text-neutral-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-neutral-100 shadow-medium overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/60">
                  <p className="text-xs font-bold text-neutral-dark truncate">
                    {currentUser?.nombre} {currentUser?.apellido}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5 truncate">{currentUser?.correo_electronico}</p>
                  <span className="inline-block mt-1.5 rounded-full bg-primary-main/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-main">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full inline-flex items-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-3 py-2.5 transition-colors"
                  >
                    <LogOut size={13} />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Hamburger: solo en mobile (< lg) ── */}
          <button
            onClick={() => { setIsOpen(!isOpen); setUserMenuOpen(false); }}
            className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-dark/60 flex-shrink-0"
            aria-label="Menú"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>
      </div>

      {/* ── Menú mobile (< lg) ── */}
      {isOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

            {/* Info del usuario */}
            <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {currentUser ? getInitials(currentUser.nombre, currentUser.apellido) : '??'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-neutral-dark truncate">
                  {currentUser?.nombre} {currentUser?.apellido}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">{currentUser?.correo_electronico}</p>
                <span className="inline-block mt-1 rounded-full bg-primary-main/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-main">
                  {role.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Links */}
            {INTERNAL_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                    ${isActive
                      ? 'bg-primary-main text-white'
                      : 'text-neutral-dark/70 hover:bg-neutral-50 hover:text-primary-main'
                    }
                  `}
                >
                  <Icon size={15} />
                  {link.label}
                  {isActive && (
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest opacity-60">activo</span>
                  )}
                </Link>
              );
            })}

            {/* Logout */}
            <div className="pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-4 py-3 transition-colors"
              >
                <LogOut size={15} />
                Cerrar sesión
              </button>
            </div>

          </div>
        </div>
      )}

      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </nav>
  );
}