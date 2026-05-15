import { Button } from '../atoms';

export const Hero = () => {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #0D6B65 0%, #1A9E96 50%, #0E4A46 100%)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Geometric background pattern */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* Large circle top-right */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '420px', height: '420px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.06)',
        }} />
        {/* Gold accent bar bottom-left */}
        <div style={{
          position: 'absolute', bottom: '0', left: '0',
          width: '320px', height: '4px',
          background: 'linear-gradient(90deg, #E8A800, transparent)',
        }} />
        {/* Diagonal gold stripe */}
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '260px', height: '260px', borderRadius: '50%',
          border: '2px solid rgba(232,168,0,0.15)',
        }} />
        {/* Floating dots grid */}
        <svg style={{ position: 'absolute', bottom: '60px', right: '80px', opacity: 0.12 }}
          width="160" height="160" viewBox="0 0 160 160">
          {[0,1,2,3,4,5,6,7].map(row =>
            [0,1,2,3,4,5,6,7].map(col => (
              <circle key={`${row}-${col}`}
                cx={col * 20 + 10} cy={row * 20 + 10} r="2" fill="white" />
            ))
          )}
        </svg>
      </div>

      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '80px 24px',
        position: 'relative', zIndex: 1, width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px',
        alignItems: 'center',
      }}
        className="hero-grid"
      >
        {/* Left: Text content */}
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(232,168,0,0.18)', border: '1px solid rgba(232,168,0,0.4)',
            borderRadius: '100px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#E8A800',
            }} />
            <span style={{
              color: '#E8A800', fontSize: '13px', fontWeight: '600',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              30 años sirviendo a la sociedad
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: '800', color: '#ffffff',
            lineHeight: '1.1', marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}>
            Instituto Superior<br />
            <span style={{ color: '#E8A800' }}>Alfonso Reyes</span>
          </h1>

          <p style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.82)',
            lineHeight: '1.7', marginBottom: '12px', maxWidth: '480px',
          }}>
            Bachillerato Tecnológico en{' '}
            <strong style={{ color: '#fff' }}>Enfermería General</strong>{' '}
            y Licenciatura en{' '}
            <strong style={{ color: '#fff' }}>Enfermería</strong>.
          </p>
          <p style={{
            fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px', fontStyle: 'italic',
          }}>
            ¡Educar, para servir a la sociedad!
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#oferta" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#E07B00', color: '#fff',
              padding: '14px 32px', borderRadius: '8px',
              fontWeight: '700', fontSize: '1rem', textDecoration: 'none',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(224,123,0,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(224,123,0,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(224,123,0,0.4)'; }}
            >
              Ver oferta educativa
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#contacto" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'transparent', color: '#fff',
              padding: '14px 32px', borderRadius: '8px',
              fontWeight: '600', fontSize: '1rem', textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.35)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Inscripciones
            </a>
          </div>
        </div>

        {/* Right: Info card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '36px 32px',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          {/* RVOE badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <InfoCard
              label="Bachillerato Tecnológico"
              title="Enfermería General"
              code="RVOE DGETI2001545"
              icon=""
            />
            <InfoCard
              label="Licenciatura"
              title="Enfermería"
              code="RVOE FEDERAL 20232561"
              icon=""
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }} />

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ContactRow icon="📍" text="Periférico Sur Poniente No. 1952, Col. Penipak, Tuxtla Gtz. Chiapas" />
            <ContactRow icon="📞" text="961 172 6687 · 961 612 1115" />
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 60px 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

const InfoCard = ({ label, title, code, icon }) => (
  <div style={{
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '16px 20px',
    display: 'flex', alignItems: 'flex-start', gap: '14px',
  }}>
    <span style={{ fontSize: '24px', lineHeight: 1 }}>{icon}</span>
    <div>
      <span style={{
        display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.55)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px',
      }}>{label}</span>
      <span style={{
        display: 'block', fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '4px',
      }}>{title}</span>
      <span style={{
        display: 'inline-block', fontSize: '11px', color: '#E8A800',
        background: 'rgba(232,168,0,0.15)', borderRadius: '4px',
        padding: '2px 8px', fontWeight: '600',
      }}>{code}</span>
    </div>
  </div>
);

const ContactRow = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
    <span style={{ fontSize: '16px', marginTop: '1px', flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>{text}</span>
  </div>
);