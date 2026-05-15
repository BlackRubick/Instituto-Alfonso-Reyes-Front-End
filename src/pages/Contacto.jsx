import { ContactPreview } from '../components';
import { MessageCircle, Clock, Shield, Zap, MapPin, Mail, Phone, Sun, Moon } from 'lucide-react';

const WHATSAPP_NUMBER = '529611726687';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const features = [
  {
    icon: <Zap size={20} />,
    title: 'Respuesta rápida',
    desc: 'Te respondemos en minutos durante horario de atención.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Atención personalizada',
    desc: 'Habla directamente con nuestro equipo de admisiones.',
  },
  {
    icon: <Clock size={20} />,
    title: 'Sin esperas',
    desc: 'Sin formularios ni correos. Un mensaje y listo.',
  },
];

const suggestions = [
  '¿Cuáles son los requisitos de admisión?',
  '¿Qué carreras técnicas ofrecen?',
  'Quiero información sobre costos y becas',
  '¿Cuándo inicia el próximo ciclo?',
];

export const Contacto = () => {
  return (
    <div>
      {/* Hero Section — sin tocar */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="sr-only">Contacto</h1>
          <p className="text-xl opacity-90">¡Nos encantaría escucharte! Envíanos un mensaje</p>
        </div>
      </section>

      {/* WhatsApp Section — reemplaza al formulario */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">

          <h2 className="section-title text-center mb-4">Escríbenos por WhatsApp</h2>
          <p className="text-center text-neutral-dark/70 mb-12 max-w-2xl mx-auto">
            La forma más rápida de comunicarte con nosotros. Nuestro equipo está listo para resolver tus dudas.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* Left — CTA card */}
            <div className="bg-gradient-to-br from-primary-dark to-primary-main rounded-2xl p-8 flex flex-col justify-between text-white shadow-lg">
              {/* Top */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center">
                    <MessageCircle size={24} className="text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base leading-tight">Instituto Alfonso Reyes</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block" />
                      <span className="text-xs text-white/60">En línea</span>
                    </div>
                  </div>
                </div>

                {/* Bubble simulada */}
                <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3 mb-6 max-w-xs">
                  <p className="text-sm text-white/90 leading-relaxed">
                    ¡Hola! 👋 Bienvenido al Instituto Alfonso Reyes. ¿En qué podemos ayudarte hoy?
                  </p>
                  <p className="text-[10px] text-white/40 mt-1.5 text-right">Ahora</p>
                </div>

                {/* Sugerencias de mensaje */}
                <p className="text-xs text-white/50 uppercase tracking-widest mb-3 font-semibold">Preguntas frecuentes</p>
                <div className="flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <a
                      key={s}
                      href={`${WHATSAPP_URL}?text=${encodeURIComponent(s)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-white/8 hover:bg-[#25D366]/20 border border-white/15 hover:border-[#25D366]/40 text-white/75 hover:text-white rounded-lg px-3 py-2 transition-all duration-200 text-left"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bc5a] text-white font-semibold text-sm py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <MessageCircle size={18} />
                Abrir WhatsApp
              </a>
            </div>

            {/* Right — features + info */}
            <div className="flex flex-col gap-5">
              {/* Features */}
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4 bg-neutral-light rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center text-accent-gold flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-primary-dark text-sm mb-0.5">{f.title}</p>
                    <p className="text-neutral-dark/60 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}

              {/* Número directo */}
              <div className="bg-neutral-light rounded-xl p-5 border border-neutral-medium/50 flex items-center justify-between gap-4 mt-auto">
                <div>
                  <p className="text-xs text-neutral-dark/50 uppercase tracking-widest font-semibold mb-1">Número directo</p>
                  <p className="text-xl font-bold text-primary-dark tracking-wide">961 172 6687</p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 bg-[#25D366] hover:bg-[#20bc5a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
                >
                  Escribir
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Info — mejorado */}
      <section className="py-20 px-4 bg-neutral-light relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent-gold/6 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary-main/6 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Información de Contacto</h2>
            <p className="text-neutral-dark/60 text-sm max-w-md mx-auto">
              Todos los canales por los que puedes comunicarte con nosotros.
            </p>
          </div>
          <ContactPreview />
        </div>
      </section>

      {/* Location Section — iframe intacto, layout mejorado */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Ubicación</h2>
            <p className="text-neutral-dark/60 text-sm max-w-md mx-auto">
              Encuéntranos en el sur de Tuxtla Gutiérrez, Chiapas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* Dirección lateral */}
            <div className="bg-gradient-to-br from-primary-dark to-primary-main rounded-2xl p-7 text-white flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-accent-gold/20 border border-accent-gold/30 flex items-center justify-center mb-5">
                  <MapPin size={20} className="text-accent-gold" />
                </div>
                <h3 className="font-bold text-white text-base mb-1">Dirección</h3>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-4 font-semibold">Sede principal</p>
                <address className="not-italic text-white/80 text-sm leading-relaxed">
                  Periférico Sur Poniente No. 1952<br />
                  Col. Penipak, C.P 29060<br />
                  Tuxtla Gutiérrez, Chiapas
                </address>
              </div>

              <a
                href="https://maps.google.com/?q=Instituto+Alfonso+Reyes,+Perif.+Sur+Pte.+1952,+Penipak,+29060+Tuxtla+Gutiérrez,+Chis."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all duration-200"
              >
                <MapPin size={14} />
                Abrir en Google Maps
              </a>
            </div>

            {/* Iframe — sin modificar su src ni atributos */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-medium h-80 lg:h-auto bg-neutral-medium ring-1 ring-neutral-medium/40">
              <iframe
                title="Ubicación Instituto Alfonso Reyes"
                src="https://www.google.com/maps?q=Instituto%20Alfonso%20Reyes%2C%20Perif.%20Sur%20Pte.%201952%2C%20Penipak%2C%2029060%20Tuxtla%20Guti%C3%A9rrez%2C%20Chis.%2C%20M%C3%A9xico&z=18&hl=es-419&gl=MX&output=embed&iwloc=A"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Office Hours — mejorado */}
      <section className="py-20 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Horario de Atención</h2>
            <p className="text-neutral-dark/60 text-sm max-w-md mx-auto">
              Estamos disponibles para atenderte en los siguientes horarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Horario */}
            <div className="bg-white rounded-2xl p-7 shadow-soft ring-1 ring-neutral-medium/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center">
                  <Clock size={18} className="text-accent-gold" />
                </div>
                <h3 className="text-base font-bold text-primary-dark">Horario</h3>
              </div>

              <div className="space-y-3">
                {[
                  { day: 'Lunes a jueves', hours: '8 a.m. – 7 p.m.', full: true },
                  { day: 'Viernes', hours: '8 a.m. – 5 p.m.', full: true },
                  { day: 'Sábado y domingo', hours: '8 a.m. – 2 p.m.', full: false },
                ].map(({ day, hours, full }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between py-2.5 border-b border-neutral-light last:border-0"
                  >
                    <span className="text-sm text-neutral-dark/80 font-medium">{day}</span>
                    <span className={`text-sm font-semibold ${full ? 'text-primary-main' : 'text-accent-orange'}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 bg-accent-gold/8 border border-accent-gold/20 rounded-xl px-4 py-2.5">
                <Sun size={14} className="text-accent-gold flex-shrink-0" />
                <p className="text-xs text-neutral-dark/70">
                  Horario sujeto a cambio en días festivos.
                </p>
              </div>
            </div>

            {/* Contacto rápido */}
            <div className="bg-white rounded-2xl p-7 shadow-soft ring-1 ring-neutral-medium/30 flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary-main/10 border border-primary-main/20 flex items-center justify-center">
                  <Phone size={18} className="text-primary-main" />
                </div>
                <h3 className="text-base font-bold text-primary-dark">Contacto Rápido</h3>
              </div>

              <div className="flex flex-col gap-4">
                <a
                  href="mailto:instituto_alfonsoreyes@hotmail.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-light border border-neutral-medium/40 flex items-center justify-center flex-shrink-0 group-hover:border-accent-orange/40 transition-colors">
                    <Mail size={15} className="text-neutral-dark/50 group-hover:text-accent-orange transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-dark/40 uppercase tracking-widest font-semibold mb-0.5">Email</p>
                    <p className="text-sm text-accent-orange group-hover:underline break-all leading-snug">
                      instituto_alfonsoreyes@hotmail.com
                    </p>
                  </div>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-neutral-light border border-neutral-medium/40 flex items-center justify-center flex-shrink-0 group-hover:border-[#25D366]/40 transition-colors">
                    <MessageCircle size={15} className="text-neutral-dark/50 group-hover:text-[#25D366] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-dark/40 uppercase tracking-widest font-semibold mb-0.5">WhatsApp</p>
                    <p className="text-sm text-accent-orange group-hover:underline">+52 961-172-6687</p>
                  </div>
                </a>
              </div>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bc5a] text-white text-sm font-semibold py-3 px-5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <MessageCircle size={16} />
                Escribir ahora
              </a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};