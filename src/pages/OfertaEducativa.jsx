import { useState } from 'react';
import { Stethoscope, Clock, Users, Target, ChevronDown, ChevronUp, FileText, Calendar, CheckCircle2, BookOpen, Award, User, MapPin } from 'lucide-react';

const TABS = [
  { key: 'programa', label: 'Programa' },
  { key: 'requisitos', label: 'Requisitos' },
  { key: 'perfil', label: 'Perfil y competencias' },
  { key: 'plan', label: 'Plan de estudios' },
];

const SemAccordion = ({ sem }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
      >
        <span className="font-semibold text-primary-main text-sm">{sem.semestre}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-dark/50 font-normal">{sem.materias.length} asignaturas</span>
          {open
            ? <ChevronUp size={16} className="text-neutral-dark/40" />
            : <ChevronDown size={16} className="text-neutral-dark/40" />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-3 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {sem.materias.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-neutral-dark/80 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold flex-shrink-0" />
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgramCard = ({ program, index }) => {
  const [activeTab, setActiveTab] = useState('programa');

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft border border-neutral-100 hover:shadow-medium transition-shadow duration-300">

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-main to-primary-dark px-6 pt-6 pb-8 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full border-[24px] border-white/5" />
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-[12px] border-accent-gold/10" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
              index === 0
                ? 'bg-accent-gold/20 text-accent-gold'
                : 'bg-white/15 text-white/90'
            }`}>
              {index === 0 ? 'Bachillerato Tecnológico' : 'Licenciatura'}
            </span>
            <h2 className="text-xl font-bold text-white leading-tight mb-2">
              {program.title}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              {program.description}
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 rounded-xl p-3 text-center min-w-[72px]">
            <span className="text-3xl font-bold text-white block">{program.seats}</span>
            <span className="text-white/60 text-xs leading-tight">cupos</span>
          </div>
        </div>

        {/* Meta pills */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-5">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-white/90 text-xs">
            <Clock size={12} />
            {program.duration}
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-white/90 text-xs">
            <Calendar size={12} />
            {program.schedule}
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-white/90 text-xs">
            <Stethoscope size={12} />
            Ciencias de la salud
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-100 bg-neutral-light overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 whitespace-nowrap px-3 py-3 text-xs font-semibold transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'text-primary-main border-accent-orange bg-white'
                : 'text-neutral-dark/50 border-transparent hover:text-neutral-dark hover:bg-white/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6">

        {/* PROGRAMA */}
        {activeTab === 'programa' && (
          <div>
            <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-4">Contenido del programa</p>
            <ul className="space-y-3 mb-6">
              {program.details.map((d, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-accent-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-dark/80 leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              {program.applyLink ? (
                <a
                  href={program.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block text-center bg-accent-orange text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition-colors"
                >
                  INSCRÍBETE EN LÍNEA
                </a>
              ) : null}
            </div>
          </div>
        )}

        {/* REQUISITOS */}
        {activeTab === 'requisitos' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Documentos necesarios</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {program.requisitos.map((r, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-neutral-light rounded-lg px-3 py-2.5">
                    <FileText size={14} className="text-accent-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-dark/80 leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {program.turnos && program.turnos.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Turnos disponibles</p>
                <div className="grid grid-cols-2 gap-2">
                  {program.turnos.map((t, i) => (
                    <div key={i} className="border border-neutral-200 rounded-lg px-3 py-2.5">
                      <span className="text-xs font-bold text-primary-main block mb-0.5">{t.label}</span>
                      <span className="text-xs text-neutral-dark/60">{t.times}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Horarios de atención</p>
              <ul className="space-y-2">
                {program.horariosAtencion.map((h, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-dark/80">
                    <Clock size={13} className="text-primary-main flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PERFIL */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Perfil del egresado</p>
              <div className="border-l-4 border-primary-main bg-neutral-light rounded-r-xl px-4 py-3">
                <p className="text-sm text-neutral-dark/80 leading-relaxed">{program.perfil}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-3">Competencias del egresado</p>
              <ul className="space-y-3">
                {program.competencias.map((c, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Award size={15} className="text-accent-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-dark/80 leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* PLAN */}
        {activeTab === 'plan' && (
          <div>
            <p className="text-xs font-semibold text-neutral-dark/40 uppercase tracking-wide mb-4">Plan de estudios</p>
            <div className="space-y-2">
              {program.plan.map((sem, i) => (
                <SemAccordion key={i} sem={sem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OfertaEducativa = () => {
  const programs = [
    {
      title: 'Bachillerato Tecnológico en Enfermería General',
      description: 'Prepárate para una carrera en el cuidado de la salud con los más altos estándares de calidad y profesionalismo.',
      duration: '3 años',
      schedule: 'Matutino y Vespertino',
      seats: 40,
      applyLink: 'https://docs.google.com/forms/d/e/1FAIpQLSddMdGS52y9dYtqvsogG0nLh3s2st-c4Ss2XOA5Qcq6PIbQ_g/viewform',
      details: [
        'Formación integral en cuidados de enfermería',
        'Práctica clínica en hospitales y centros de salud',
        'Preparación para certificaciones profesionales',
        'Desarrollo de habilidades de comunicación y liderazgo',
      ],
      requisitos: [
        'Certificado de secundaria',
        'Acta de nacimiento',
        'CURP',
        'Trámite de equivalencia de estudios (Semestres Avanzados)',
      ],
      turnos: [
        { label: 'Matutino', times: '07:20 a 14:00 Hrs.' },
        { label: 'Vespertino', times: '15:00 a 21:00 Hrs.' },
        { label: 'Sábados', times: '07:00 a 15:00 Hrs.' },
        { label: 'Domingos', times: '07:00 a 15:00 Hrs.' },
      ],
      horariosAtencion: [
        'Lunes a viernes: 08:00 a 19:00 hrs.',
        'Sábados: 08:00 a 15:00 Hrs.',
        'Domingos: 08:00 a 15:00 Hrs.',
      ],
      perfil:
        'Es un alumno capaz de colaborar con los miembros del equipo de área médica y enfermería general, en la solución de necesidades y problemas de salud que confrontan los individuos, su familia y la comunidad, con un alto sentido de responsabilidad social y formación académica de un técnico.',
      competencias: [
        'Será capaz de realizar procedimientos generales de enfermería al paciente hospitalizado.',
        'Participa en el tratamiento individual o colectivo de personas en situaciones críticas, de urgencia, con riesgo o en crisis vital, en el ámbito hospitalario o domiciliario.',
        'Podrá participar en la atención de enfermería en el individuo, familia y comunidad.',
        'Aplica normas de seguridad e higiene en los escenarios reales de atención a la salud.',
      ],
      plan: [
        {
          semestre: 'SEMESTRE I',
          materias: [
            'Matemáticas I', 'Taller de Lectura de Redacción I', 'Química I',
            'Lengua Adicional al Español I', 'Actividades Curriculares I',
            'Salud Pública', 'Anatomía y Fisiología Humana', 'Fundamentos de Enfermería',
          ],
        },
        {
          semestre: 'SEMESTRE II',
          materias: [
            'Matemáticas II', 'Taller de Lectura y Redacción II', 'Química II',
            'Lengua Adicional al español II', 'Biología I', 'Actividades Curriculares II',
            'Fundamentos de Enfermería II', 'Microbiología y Parasitología',
          ],
        },
        {
          semestre: 'SEMESTRE III',
          materias: [
            'Matemáticas III', 'Física I', 'Métodos de Investigación I', 'Computación',
            'Química III', 'Biología II', 'Patología I', 'Clínicas de Enfermería I',
          ],
        },
        {
          semestre: 'SEMESTRE IV',
          materias: [
            'Matemáticas IV', 'Física II', 'Introducción a las Ciencias Sociales',
            'Métodos de Investigación II', 'Desarrollo Motivacional', 'Farmacología',
            'Patología II', 'Enfermería Médico Quirúrgica', 'Clínicas de Enfermería II',
          ],
        },
        {
          semestre: 'SEMESTRE V',
          materias: [
            'Matemáticas V', 'Física III', 'Historia de México', 'Filosofía',
            'Desarrollo Organizacional', 'Ética en Enfermería', 'Psicología',
            'Gineco-Obstetricia', 'Clínicas de Enfermería III',
          ],
        },
        {
          semestre: 'SEMESTRE VI',
          materias: [
            'Estructura Socioeconómica de México', 'Pediatría', 'Enfermería Pediátrica',
            'Fisioterapia', 'Psiquiatría y Enfermería Psiquiátrica',
            'Administración de los Servicios de Enfermería',
            'Enfermería Materno Infantil', 'Clínicas de Enfermería IV',
          ],
        },
      ],
    },
    {
      title: 'Licenciatura en Enfermería',
      description:
        'Formación profesional en Enfermería con enfoque en atención primaria, docencia, investigación y gestión de servicios de salud.',
      duration: '4 años (12 cuatrimestres)',
      schedule: 'Diurno y Nocturno según asignaturas',
      seats: 30,
      details: [
        'Enfoque en atención primaria a la salud en todos los niveles',
        'Formación como educador, investigador, promotor y administrador',
        'Práctica clínica en los cuatro niveles asistenciales',
        'Desarrollo de investigación basada en evidencias en enfermería',
      ],
      requisitos: [
        'Acta de nacimiento',
        'CURP',
        'Certificado de bachillerato',
        'Carta de buena conducta',
        'Certificado médico con tipo de sangre',
      ],
      turnos: [],
      horariosAtencion: [
        'Lunes a viernes: 08:00 a 19:00 hrs.',
        'Sábados: 08:00 a 15:00 Hrs.',
        'Domingos: 08:00 a 15:00 Hrs.',
      ],
      perfil: `El egresado estará preparado para realizar funciones técnicas y asistenciales, docentes, administrativas y de investigación, dando prioridad a la Atención Primaria a la Salud en los diferentes niveles de atención, con un enfoque integral en el cuidado enfermero.`,
      competencias: [
        'Educador: Diseñando, implementando y evaluando programas educativos, y desempeñando labores docentes.',
        'Investigador: Involucrando la utilización del método científico, basado en evidencias en enfermería.',
        'Proveedor de cuidados: Contribuyendo en la atención integral que se proporciona a la persona para satisfacer las necesidades básicas de la vida cotidiana.',
        'Promotor: Orientando a las personas en ambientes comunitarios, clínicos, laborales y domiciliarios sobre el fomento a la salud.',
        'Administrador: Realizando acciones de planeación, organización, dirección y control de la gestión en enfermería y sistemas de salud.',
      ],
      plan: [
        { semestre: 'CUATRIMESTRE I', materias: ['Anatomía y Fisiología I', 'Fundamentos de enfermería I', 'Comunicación oral y escrita', 'Terminología grecolatina', 'Bioquímica', 'Educación para la salud'] },
        { semestre: 'CUATRIMESTRE II', materias: ['Anatomía y Fisiología II', 'Fundamentos de enfermería II', 'Epistemología en enfermería', 'Modelos y teorías aplicadas al cuidado', 'Microbiología y parasitología', 'Enfermería comunitaria'] },
        { semestre: 'CUATRIMESTRE III', materias: ['Proceso enfermero', 'Salud pública', 'Psicología', 'Patología I', 'Bioestadística', 'Nutrición'] },
        { semestre: 'CUATRIMESTRE IV', materias: ['Bioética aplicada a la enfermería', 'Enfermería médico-quirúrgica', 'Patología II', 'Práctica de atención primaria a la salud y fundamentos de enfermería'] },
        { semestre: 'CUATRIMESTRE V', materias: ['Epidemiología', 'Docencia y didáctica en enfermería', 'Farmacología aplicada a la enfermería I', 'Práctica de enfermería médico quirúrgica'] },
        { semestre: 'CUATRIMESTRE VI', materias: ['Enfermería materno-infantil', 'Ginecología y obstetricia', 'Farmacología aplicada a la enfermería II', 'Práctica quirúrgica'] },
        { semestre: 'CUATRIMESTRE VII', materias: ['Pediatría', 'Cuidado integral al adulto', 'Enfermería pediátrica', 'Práctica en gineco obstetricia'] },
        { semestre: 'CUATRIMESTRE VIII', materias: ['Lengua regional', 'Cuidado integral al adulto mayor', 'Legislación en enfermería', 'Práctica de enfermería del niño y adolescente'] },
        { semestre: 'CUATRIMESTRE IX', materias: ['Interculturalidad y enfermería', 'Fisioterapia y rehabilitación', 'Salud mental', 'Práctica del cuidado del adulto mayor'] },
        { semestre: 'CUATRIMESTRE X', materias: ['Metodología de la investigación', 'Administración de los servicios de enfermería', 'Tanatología y enfermería', 'Práctica en salud mental y psiquiatría'] },
        { semestre: 'CUATRIMESTRE XI', materias: ['Investigación en enfermería', 'Administración de los servicios de salud', 'Enfermería en atención al paciente crítico', 'Práctica en gestión de los servicios de salud'] },
        { semestre: 'CUATRIMESTRE XII', materias: ['Seminario de titulación', 'Enfermería industrial', 'Tecnologías en la comunicación para enfermería', 'Práctica en urgencia y desastre'] },
      ],
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-16 px-4 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[40px] border-white/5" />
        <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full border-[20px] border-accent-gold/10" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            Instituto Alfonso Reyes
          </span>
          <h1 className="text-5xl font-bold mb-4">Oferta Educativa</h1>
          <p className="text-xl opacity-80 max-w-xl mx-auto">
            Descubre nuestros programas académicos de excelencia en ciencias de la salud
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto space-y-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} program={program} index={index} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-main to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-48 h-48 rounded-full border-[30px] border-white" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full border-[20px] border-accent-gold" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">¿Listo para transformar tu futuro?</h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad educativa y comienza tu camino hacia el éxito profesional.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://wa.me/9611726687?text=${encodeURIComponent('Hola, quisiera pedir información sobre el Instituto Alfonso Reyes. Me interesa conocer la oferta educativa, costos e inscripciones. Gracias.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors inline-block text-center"
            >
              Solicitar Información
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};