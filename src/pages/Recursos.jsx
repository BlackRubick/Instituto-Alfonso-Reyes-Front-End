import { Card, Button, Text } from '../components';
import { BookOpen, FileText, Video, ExternalLink } from 'lucide-react';

export const Recursos = () => {
  const resources = [
    {
      category: 'Materiales de Estudio',
      icon: <BookOpen size={32} className="text-primary-main" />,
      items: [
        'Apuntes de clase actualizados',
        'Guías de estudio por módulo',
        'Ejercicios prácticos resueltos',
        'Evaluaciones simuladas'
      ]
    },
    {
      category: 'Documentos Académicos',
      icon: <FileText size={32} className="text-accent-gold" />,
      items: [
        'Reglamentos institucionales',
        'Programas de asignaturas',
        'Códigos de conducta',
        'Políticas de evaluación'
      ]
    },
    {
      category: 'Contenido Multimedia',
      icon: <Video size={32} className="text-accent-orange" />,
      items: [
        'Videos educativos',
        'Tutoriales de software',
        'Conferencias grabadas',
        'Webinars con expertos'
      ]
    }
  ];

  const platforms = [
    {
      name: 'Plataforma Virtual de Aprendizaje',
      description: 'Accede a todos tus cursos, tareas y calificaciones en un mismo lugar. Disponible 24/7 desde cualquier dispositivo.',
      icon: '🌐'
    },
    {
      name: 'Biblioteca Digital',
      description: 'Acceso a libros electrónicos, revistas académicas y bases de datos especializadas en nuestras áreas de estudio.',
      icon: '📚'
    },
    {
      name: 'Portal de Estudiantes',
      description: 'Gestiona tu información académica, solicita documentos y comunícate con la administración.',
      icon: '👤'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Recursos Educativos</h1>
          <p className="text-xl opacity-90">Herramientas y materiales para apoyar tu proceso de aprendizaje</p>
        </div>
      </section>

      {/* Resources Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="section-title text-center mb-12">Materiales Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <Card
                key={index}
                icon={resource.icon}
                title={resource.category}
              >
                <ul className="space-y-2 mt-4">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-dark/70">
                      <span className="text-primary-main font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-12">Plataformas de Aprendizaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-soft hover:shadow-medium transition-all text-center"
              >
                <div className="text-6xl mb-4">{platform.icon}</div>
                <h3 className="text-2xl font-bold text-primary-main mb-3">
                  {platform.name}
                </h3>
                <p className="text-neutral-dark/70 mb-6">
                  {platform.description}
                </p>
                <Button variant="primary" size="sm">
                  Acceder <ExternalLink size={16} className="inline-block ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Support */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">Soporte Técnico</h2>
          <div className="bg-primary-main/10 rounded-xl p-8 border-l-4 border-primary-main">
            <h3 className="text-2xl font-bold text-primary-main mb-4">¿Necesitas ayuda?</h3>
            <Text className="mb-6">
              Nuestro equipo de soporte técnico está disponible para ayudarte con problemas de acceso a plataformas, descargas de materiales o cualquier duda relacionada con nuestros recursos digitales.
            </Text>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary">
                Contactar Soporte
              </Button>
              <Button variant="outline">
                FAQ Técnico
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
