import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, ExternalLink, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/instituto', label: 'El Instituto' },
    { to: '/oferta', label: 'Oferta Educativa' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/aviso-privacidad', label: 'Aviso de Privacidad' },
  ];

  const socials = [
    { icon: <Facebook size={16} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={16} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={16} />, href: '#', label: 'Instagram' },
    { icon: <Linkedin size={16} />, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-primary-dark text-white">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand block */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center flex-shrink-0">
                <span className="text-accent-gold font-bold text-sm">AR</span>
              </div>
              <div>
                <p className="font-bold text-white leading-tight text-sm">Instituto Alfonso Reyes</p>
                <p className="text-white/40 text-xs tracking-wide">Educación Profesional</p>
              </div>
            </div>

            <p className="text-white/55 text-sm leading-relaxed">
              Formamos profesionales competentes y éticos con los más altos estándares de calidad educativa en ciencias de la salud.
            </p>

            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center text-white/50 hover:text-accent-gold hover:bg-white/12 hover:border-accent-gold/30 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-semibold text-accent-gold/70 uppercase tracking-[0.15em] mb-5">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-gold/40 group-hover:bg-accent-gold transition-colors duration-150" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/images/ReglamentoISEPAR.pdf"
                  download
                  className="text-white/60 hover:text-white text-sm transition-colors duration-150 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-gold/40 group-hover:bg-accent-gold transition-colors duration-150" />
                  Reglamento
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-semibold text-accent-gold/70 uppercase tracking-[0.15em] mb-5">
              Contacto
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={14} className="text-accent-gold/60 flex-shrink-0" />
                961-612-1115
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm">
                <Phone size={14} className="text-accent-gold/60 flex-shrink-0" />
                961-118-1358
              </li>
              <li className="flex items-start gap-3 text-sm">
                <Mail size={14} className="text-accent-gold/60 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:instituto_alfonsoreyes@hotmail.com"
                  className="text-white/60 hover:text-white transition-colors duration-150 break-all"
                >
                  instituto_alfonsoreyes@hotmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold text-accent-gold/70 uppercase tracking-[0.15em] mb-5">
              Ubicación
            </h4>
            <div className="flex items-start gap-3">
              <MapPin size={14} className="text-accent-gold/60 flex-shrink-0 mt-0.5" />
              <address className="text-sm text-white/55 leading-relaxed not-italic">
                Periférico Sur Poniente No. 1952<br />
                Col. Penipak, C.P 29060<br />
                Tuxtla Gutiérrez, Chiapas
              </address>
            </div>
          </div>
        </div>

        {/* Divider + bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            &copy; {currentYear} Instituto Alfonso Reyes. Todos los derechos reservados.
          </p>
          <Link
            to="/aviso-privacidad"
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors duration-150"
          >
            Aviso de Privacidad
            <ExternalLink size={11} />
          </Link>
        </div>
      </div>
    </footer>
  );
};