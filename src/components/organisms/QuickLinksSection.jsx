import { useNavigate } from 'react-router-dom';
import { BookOpen, UserCheck, HelpCircle, Briefcase } from 'lucide-react';

const links = [
  {
    title: 'El Instituto',
    description: 'Conoce nuestra historia, misión y visión institucional.',
    icon: BookOpen,
    path: '/instituto',
    accent: '#1A9E96',
    bg: 'rgba(26,158,150,0.08)',
    number: '01',
  },
  {
    title: 'Inscripciones',
    description: 'Únete a nuestra comunidad educativa este ciclo.',
    icon: UserCheck,
    path: '/contacto',
    accent: '#E07B00',
    bg: 'rgba(224,123,0,0.08)',
    number: '02',
  },
  {
    title: 'Preguntas Frecuentes',
    description: 'Resuelve tus dudas sobre nuestros programas.',
    icon: HelpCircle,
    path: '/faq',
    accent: '#0D6B65',
    bg: 'rgba(13,107,101,0.08)',
    number: '03',
  },
  {
    title: 'Oferta Educativa',
    description: 'Explora nuestros programas académicos con RVOE.',
    icon: Briefcase,
    path: '/oferta',
    accent: '#E8A800',
    bg: 'rgba(232,168,0,0.08)',
    number: '04',
  },
];

export const QuickLinksSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#ffffff',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle bg pattern */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(26,158,150,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            fontSize: '12px', fontWeight: '700', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#1A9E96', marginBottom: '10px',
          }}>¿Qué estás buscando?</p>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '800',
            color: '#0E2F2E', margin: '0 auto 14px', lineHeight: '1.2',
          }}>Accesos Rápidos</h2>
          <div style={{
            width: '48px', height: '4px', borderRadius: '2px',
            background: 'linear-gradient(90deg, #1A9E96, #E8A800)',
            margin: '0 auto',
          }} />
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          {links.map((link) => (
            <QuickCard key={link.number} link={link} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
};

const QuickCard = ({ link, navigate }) => {
  const Icon = link.icon;

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-6px)';
    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.1)`;
    e.currentTarget.querySelector('.card-bar').style.width = '100%';
    e.currentTarget.querySelector('.card-arrow').style.opacity = '1';
    e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(0)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
    e.currentTarget.querySelector('.card-bar').style.width = '0%';
    e.currentTarget.querySelector('.card-arrow').style.opacity = '0';
    e.currentTarget.querySelector('.card-arrow').style.transform = 'translateX(-8px)';
  };

  return (
    <div
      onClick={() => navigate(link.path)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: '#fff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '16px',
        padding: '32px 28px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top color bar on hover */}
      <div className="card-bar" style={{
        position: 'absolute', top: 0, left: 0, height: '3px',
        width: '0%', background: link.accent,
        transition: 'width 0.3s ease', borderRadius: '0',
      }} />

      {/* Number watermark */}
      <span style={{
        position: 'absolute', top: '16px', right: '20px',
        fontSize: '48px', fontWeight: '900', color: 'rgba(0,0,0,0.04)',
        lineHeight: 1, userSelect: 'none', fontVariantNumeric: 'tabular-nums',
      }}>{link.number}</span>

      {/* Icon */}
      <div style={{
        width: '52px', height: '52px', borderRadius: '12px',
        background: link.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={26} color={link.accent} strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '1.05rem', fontWeight: '700', color: '#0E2F2E',
          margin: '0 0 8px', lineHeight: '1.3',
        }}>{link.title}</h3>
        <p style={{
          fontSize: '0.9rem', color: '#6b7280', lineHeight: '1.6', margin: 0,
        }}>{link.description}</p>
      </div>

      {/* CTA row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
        <span style={{
          fontSize: '0.85rem', fontWeight: '700', color: link.accent,
        }}>Ver más</span>
        <span className="card-arrow" style={{
          opacity: 0, transform: 'translateX(-8px)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          display: 'flex', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke={link.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};