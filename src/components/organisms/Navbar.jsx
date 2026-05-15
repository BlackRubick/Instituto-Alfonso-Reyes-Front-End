import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavbarItem } from '../molecules';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/instituto', label: 'El Instituto' },
    { path: '/oferta', label: 'Oferta Educativa' },
    { path: '/recursos', label: 'Recursos' },
    { path: '/faq', label: 'Preguntas Frecuentes' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center -ml-20">
            <img
              src="/images/navbar.png"
              alt="Instituto Alfonso Reyes Virtual"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavbarItem
                key={link.path}
                to={link.path}
                label={link.label}
                active={location.pathname === link.path}
              />
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link
              to="/login"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Acceder
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-light transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-neutral-medium">
            <div className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => (
                <NavbarItem
                  key={link.path}
                  to={link.path}
                  label={link.label}
                  active={location.pathname === link.path}
                  onClick={() => setIsOpen(false)}
                />
              ))}
              <div className="mt-4 pt-4 border-t border-neutral-medium">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary inline-flex w-full items-center justify-center"
                >
                  Acceder
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
