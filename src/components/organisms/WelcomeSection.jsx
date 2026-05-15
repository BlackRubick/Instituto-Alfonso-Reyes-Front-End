export const WelcomeSection = () => {
  const paragraphs = [
    'Es un honor para mí darles la más cálida bienvenida a la página web del Instituto Superior de Estudios Profesionales Alfonso Reyes. Este espacio virtual se concibe como una herramienta de información y comunicación que nos permite brindar un servicio de calidad a estudiantes, docentes, personal administrativo y al público en general, ofreciendo en él toda la información relevante sobre nuestra institución.',
    'En el Instituto Superior de Estudios Profesionales Alfonso Reyes, nos enorgullece contar con una oferta académica que incluye Bachillerato Tecnológico y Licenciatura. Nuestro compromiso indiscutible radica en fortalecer la calidad educativa, formando profesionales de excelencia, dotados de habilidades y actitudes fundamentales, con una visión integradora y competitiva. Contamos con la infraestructura y el equipamiento necesarios para facilitar las actividades académicas de nuestros estudiantes.',
    'La educación, concebida como un proceso social y dinámico, ha experimentado significativas transformaciones a lo largo de la historia de la sociedad. Es por ello que nos empeñamos en crear las condiciones ideales para alcanzar los objetivos individuales y sociales de la comunidad mexicana.',
    'El Instituto Superior de Estudios Profesionales Alfonso Reyes representa para todos ustedes una valiosa oportunidad de crecimiento y desarrollo de sus capacidades. Los invito cordialmente a formar parte de nuestra comunidad educativa y descubrir todo lo que tenemos para ofrecer.',
    '¡Vengan y conózcanos!',
  ];

  return (
    <section style={{
      background: '#f7f8f8',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative teal bar left */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '5px',
        background: 'linear-gradient(180deg, #1A9E96, #0D6B65)',
      }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #1A9E96, #0D6B65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <p style={{
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#1A9E96', marginBottom: '4px',
            }}>Bienvenida Institucional</p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: '800',
              color: '#0E2F2E', lineHeight: '1.2', margin: 0,
            }}>
              Estimados Visitantes:
            </h2>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: 'clamp(28px, 5vw, 56px)',
          boxShadow: '0 4px 32px rgba(13,107,101,0.08)',
          border: '1px solid rgba(26,158,150,0.1)',
          position: 'relative',
        }}>
          {/* Opening quote mark */}
          <div style={{
            position: 'absolute', top: '24px', right: '32px',
            fontSize: '120px', lineHeight: 1, color: 'rgba(26,158,150,0.06)',
            fontFamily: 'Georgia, serif', fontWeight: '900', userSelect: 'none',
            pointerEvents: 'none',
          }}>"</div>

          {/* Paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {paragraphs.map((p, i) => (
              <p key={i} style={{
                fontSize: '1.05rem', lineHeight: '1.85',
                color: i === 0 ? '#0E2F2E' : '#4a5568',
                fontWeight: i === 0 ? '500' : '400',
                margin: 0,
              }}>
                {p}
              </p>
            ))}
          </div>

          {/* Divider */}
          <div style={{
            margin: '36px 0 28px',
            height: '1px',
            background: 'linear-gradient(90deg, #1A9E96, rgba(26,158,150,0.1))',
          }} />

          {/* Signature */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar placeholder */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A9E96, #0D6B65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: '22px', fontWeight: '700', color: '#fff',
            }}>
              LN
            </div>
            <div>
              <p style={{
                fontSize: '1.05rem', fontWeight: '800', color: '#0D6B65',
                margin: '0 0 2px',
              }}>
                Dr. Limber Nájera Hidalgo
              </p>
              <p style={{
                fontSize: '0.9rem', color: '#1A9E96', fontWeight: '600',
                margin: '0 0 2px',
              }}>
                Director
              </p>
              <p style={{
                fontSize: '0.82rem', color: '#888', margin: 0,
              }}>
                Instituto Alfonso Reyes · Tuxtla Gutiérrez, Chiapas
              </p>
            </div>
            {/* Gold accent */}
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(232,168,0,0.12)', border: '1px solid rgba(232,168,0,0.3)',
                borderRadius: '100px', padding: '5px 14px',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E8A800' }} />
                <span style={{ fontSize: '12px', color: '#b37d00', fontWeight: '700' }}>
                  30 años de excelencia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};