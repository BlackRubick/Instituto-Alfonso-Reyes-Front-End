import { Card } from '../molecules';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Code } from 'lucide-react';
import { Button } from '../atoms';

export const OfertaEducativaSection = () => {
  const navigate = useNavigate();

  const programs = [
    {
      title: 'Bachillerato Tecnológico en Enfermería General',
      description: 'Prepárate para una carrera en el cuidado de la salud con las más altas estándares de calidad y profesionalismo.',
      icon: <Stethoscope size={32} className="text-accent-gold" />,
      duration: '3 años'
    },
    {
      title: 'Bachillerato Tecnológico en Informática Administrativa',
      description: 'Desarrolla habilidades tecnológicas y administrativas para liderar en el mundo digital moderno.',
      icon: <Code size={32} className="text-accent-gold" />,
      duration: '3 años'
    }
  ];

  return (
    <section className="py-16 px-4 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center mb-12">
          Oferta Educativa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {programs.map((program, index) => (
            <Card
              key={index}
              icon={program.icon}
              title={program.title}
              description={program.description}
              className="md:col-span-1"
            >
              <div className="mt-4 pt-4 border-t border-neutral-medium">
                <p className="text-sm text-neutral-dark/70 font-semibold">
                  Duración: {program.duration}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button variant="primary" onClick={() => navigate('/oferta')}>
            Ver Todos los Programas
          </Button>
        </div>
      </div>
    </section>
  );
};
