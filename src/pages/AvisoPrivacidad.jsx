import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, Mail, FileText, Users, Globe, Lock, AlertCircle, BookOpen, Eye } from 'lucide-react';

const sections = [
  {
    id: 'finalidades',
    icon: <BookOpen size={18} />,
    title: '¿Por qué fines recabamos y utilizamos sus datos personales?',
    subsections: [
      {
        subtitle: 'Alumnos – Candidatos',
        content: `La información que nos proporciona es utilizada por nuestro Departamento de Servicios Escolares, Coordinación Académica y Relaciones Públicas para ofrecerle nuestros servicios educativos, dar seguimiento a solicitudes de información y generar su expediente académico. Esto incluye evaluación del desempeño, constancias académicas, inscripción a programas de vinculación, prácticas educativas y servicio social. También se podrá usar para reportes académicos, informarle de eventos, reconocimientos, acceso a instalaciones, credenciales de identificación, Seguro de Gastos Médicos, otorgamiento de becas y mantenimiento de contacto posterior a su egreso.`,
      },
      {
        subtitle: 'Empleados – Candidatos',
        content: `Nuestro Departamento de Recursos Humanos identificará aspirantes a vacantes, conocerá su afinidad con el puesto y generará una base de datos de reclutamiento. Incluye formación de expediente, correo institucional, pago de sueldo, prestaciones, recibos de nómina, constancias y documentos relacionados con su estancia. Adicionalmente, sus datos pueden usarse para: dar seguimiento a solicitudes de información sobre servicios educativos, realizar cotizaciones, enviar avisos importantes, proveer información sobre el estado de la institución y envío de promociones por correo electrónico.`,
      },
    ],
    note: 'Instituto Alfonso Reyes mantendrá sus datos personales en nuestros registros durante 30 días a partir de la fecha en que nos los proporcionó. Después procederemos a eliminar su información si no se llega a ninguna transacción comercial o vínculo laboral.',
  },
  {
    id: 'datos',
    icon: <FileText size={18} />,
    title: '¿Qué datos personales obtenemos y de dónde?',
    subsections: [
      {
        subtitle: 'Datos recabados de forma directa',
        content: `Recabamos sus datos personales cuando usted mismo nos los proporciona por diversos medios, como cuando participa en nuestras promociones o nos da información para que le prestemos un servicio. Sus datos serán recopilados a través de nuestra oficina de Servicios Escolares al momento de inscribirse y matricularse. En el caso de aspirar a una vacante, el departamento de Recursos Humanos será el encargado de recopilar y almacenar sus datos.`,
      },
      {
        subtitle: 'Uso de cookies y análisis de datos',
        content: `Las cookies son archivos de texto descargados automáticamente y almacenados en el disco duro del usuario al navegar en Internet, que permiten recordar algunos datos sobre él. Usamos cookies y aplicaciones de análisis para obtener: Dirección IP, Navegador de Internet, Sistema Operativo, País de Origen y Sitio Web de Origen. Puede aprender a desactivar las cookies para mejorar la privacidad de su equipo de cómputo.`,
      },
      {
        subtitle: 'Datos recabados por internet',
        content: `En nuestro sitio web encontrará un formulario de contacto con los siguientes campos: Nombre, Apellido, Teléfono, Correo electrónico y Mensaje. Estos son los únicos datos personales que recopilamos mediante nuestro sitio web.`,
      },
      {
        subtitle: 'Datos obtenidos a través de otras fuentes',
        content: `Podemos obtener información de otras fuentes permitidas por la ley, como directorios telefónicos o laborales, y a través de stands en exposiciones donde informamos de nuestra oferta académica. Los datos obtenidos por estos medios pueden ser: domicilio, teléfono, correo electrónico y licenciatura de interés.`,
      },
    ],
  },
  {
    id: 'terceros',
    icon: <Users size={18} />,
    title: 'Compartir datos con terceros',
    content: `Sus datos pueden ser compartidos con Grupo IPE (Instituto Profesional de Emprendedores). Adicionalmente, sus datos personales pueden ser transferidos y tratados dentro y fuera de nuestra institución por personas responsables de los trámites y servicios ante la Secretaría de Educación Pública. Su información puede ser compartida con el Departamento de Servicios Escolares para realizar los trámites correspondientes.`,
  },
  {
    id: 'modificaciones',
    icon: <AlertCircle size={18} />,
    title: 'Modificaciones al aviso de privacidad',
    content: `Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas, políticas internas o nuevos requerimientos. Las modificaciones estarán disponibles mediante: (i) Anuncios visibles en nuestros establecimientos; (ii) trípticos o folletos disponibles en nuestra institución; (iii) en nuestra página de Internet (sección aviso de privacidad); (iv) o se las haremos llegar al último correo electrónico que nos haya proporcionado.`,
  },
  {
    id: 'arco',
    icon: <Lock size={18} />,
    title: 'Derechos ARCO',
    content: `Para ejercer sus derechos ARCO, debe enviar una petición vía correo electrónico a instituto_alfonsoreyes@hotmail.com. La petición deberá contener: Nombre completo del titular, Domicilio, Teléfono, Correo electrónico usado en este sitio web, Copia de una identificación oficial adjunta y Asunto «Derechos ARCO». En un plazo máximo de 20 días atenderemos su petición y le informaremos sobre la procedencia de la misma. Usted podrá en cualquier momento revocar el consentimiento otorgado para el tratamiento de sus datos personales o limitar el uso o divulgación de los mismos.`,
    cta: { label: 'Enviar solicitud ARCO', email: 'instituto_alfonsoreyes@hotmail.com' },
  },
  {
    id: 'quejas',
    icon: <Eye size={18} />,
    title: '¿Ante quién puede presentar sus quejas?',
    content: `Si usted considera que su derecho de protección de datos personales ha sido lesionado por alguna conducta de nuestros empleados o de nuestras actuaciones, puede presentar la queja o denuncia correspondiente ante el IFAI. Para mayor información visite www.ifai.org.mx`,
  },
];

const SectionAccordion = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-neutral-light transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-accent-orange">{section.icon}</span>
          <span className="font-semibold text-primary-main text-sm leading-snug">{section.title}</span>
        </div>
        <span className="flex-shrink-0 text-neutral-dark/30 group-hover:text-neutral-dark/60 transition-colors">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-5 py-5 bg-white space-y-5">
          {section.subsections && section.subsections.map((sub, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold text-primary-main uppercase tracking-wide mb-2">{sub.subtitle}</h4>
              <p className="text-sm text-neutral-dark/75 leading-relaxed">{sub.content}</p>
            </div>
          ))}

          {section.content && (
            <p className="text-sm text-neutral-dark/75 leading-relaxed">{section.content}</p>
          )}

          {section.note && (
            <div className="flex items-start gap-3 bg-neutral-light rounded-lg px-4 py-3 border-l-4 border-accent-gold">
              <AlertCircle size={15} className="text-accent-gold flex-shrink-0 mt-0.5" />
              <p className="text-xs text-neutral-dark/70 leading-relaxed">{section.note}</p>
            </div>
          )}

          {section.cta && (
            <a
              href={`mailto:${section.cta.email}`}
              className="inline-flex items-center gap-2 bg-accent-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition-colors"
            >
              <Mail size={15} />
              {section.cta.label}
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export const AvisoPrivacidad = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-16 px-4 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border-[40px] border-white/5" />
        <div className="absolute bottom-0 left-8 w-32 h-32 rounded-full border-[20px] border-accent-gold/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-accent-gold/20 border border-accent-gold/40 text-accent-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
            <Shield size={13} />
            Transparencia y privacidad
          </span>
          <h1 className="text-4xl font-bold mb-4">Aviso de Privacidad</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">
            Conoce cómo el Instituto Alfonso Reyes protege y utiliza tus datos personales conforme a la Ley Federal de Protección de Datos Personales.
          </p>
        </div>
      </section>

      {/* Intro card */}
      <section className="bg-neutral-light px-4 pt-10 pb-2">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary-main/10 rounded-xl p-3 flex-shrink-0">
                <Shield size={22} className="text-primary-main" />
              </div>
              <div>
                <h2 className="font-bold text-primary-main text-base mb-2">Responsable del tratamiento de datos</h2>
                <p className="text-sm text-neutral-dark/75 leading-relaxed mb-3">
                  El presente Aviso de Privacidad es emitido por el <strong className="text-neutral-dark">Instituto Superior de Estudios Profesionales Alfonso Reyes</strong>, con nombre comercial <strong className="text-neutral-dark">Instituto Alfonso Reyes</strong>, en cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs text-neutral-dark/60 bg-neutral-light rounded-lg px-3 py-2">
                    <Globe size={12} className="text-accent-orange" />
                    Periférico Sur Poniente No. 1952 col. Penipak, C.P 29060, Tuxtla Gutiérrez, Chiapas
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-dark/60 bg-neutral-light rounded-lg px-3 py-2">
                    <Mail size={12} className="text-accent-orange" />
                    instituto_alfonsoreyes@hotmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principios highlight */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {['Licitud', 'Calidad', 'Finalidad', 'Responsabilidad'].map((p) => (
              <div key={p} className="bg-white rounded-xl border border-neutral-100 px-3 py-3 text-center">
                <span className="text-accent-gold font-bold text-lg block">✓</span>
                <span className="text-xs font-semibold text-primary-main">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections accordion */}
      <section className="bg-neutral-light px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-3">
          {sections.map((section) => (
            <SectionAccordion key={section.id} section={section} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary-main to-primary-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-48 h-48 rounded-full border-[30px] border-white" />
          <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full border-[20px] border-accent-gold" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-bold mb-3">¿Tienes preguntas sobre tus datos?</h2>
          <p className="text-base opacity-75 mb-6 max-w-xl mx-auto">
            Puedes ejercer tus derechos ARCO o presentar cualquier duda escribiéndonos directamente.
          </p>
          <a
            href="mailto:instituto_alfonsoreyes@hotmail.com"
            className="inline-flex items-center gap-2 bg-accent-orange text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-orange-600 transition-colors"
          >
            <Mail size={16} />
            Contactar al responsable
          </a>
        </div>
      </section>
    </div>
  );
};

export default AvisoPrivacidad;