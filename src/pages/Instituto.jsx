import { Text } from '../components';
import { Award, Eye, Heart, BookOpen } from 'lucide-react';

export const Instituto = () => {
  return (
    <div className="text-justify">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-24 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest opacity-60 mb-3">ISEP · Tuxtla Gutiérrez</p>
          <h1 className="text-5xl font-bold mb-4">El Instituto Alfonso Reyes</h1>
          <div className="w-16 h-1 bg-accent-gold mx-auto mb-4 rounded-full" />
          <p className="text-xl opacity-90">Conoce nuestra historia, misión y visión</p>
        </div>
      </section>

      {/* History */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={22} className="text-primary-main" />
            <h2 className="section-title">Nuestra Historia</h2>
          </div>
          <div className="border-l-4 border-primary-main pl-6 space-y-4">
            <Text className="text-lg leading-relaxed">
              El Instituto Superior de Estudios Profesionales Alfonso Reyes fue fundado con la visión de proporcionar educación de calidad accesible a la comunidad de Tuxtla Gutiérrez y sus alrededores. A lo largo de los años, hemos consolidado nuestra reputación como una institución educativa comprometida con la excelencia académica.
            </Text>
            <Text className="text-lg leading-relaxed">
              Nuestro compromiso ha sido formar profesionales preparados, no solo con conocimientos teóricos sólidos, sino también con habilidades prácticas y valores éticos que les permitan contribuir significativamente al desarrollo de la sociedad.
            </Text>
            <Text className="text-lg leading-relaxed">
              Hoy en día, contamos con programas innovadores, un cuerpo docente altamente capacitado y unas instalaciones modernas equipadas con tecnología de punta para garantizar una educación de calidad.
            </Text>
          </div>
        </div>
      </section>

      {/* Mission, Vision */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Misión */}
            <div className="bg-white rounded-xl p-8 shadow-soft flex flex-col">
              <div className="flex justify-center mb-5">
                <div className="bg-neutral-light rounded-full p-4">
                  <Heart size={36} className="text-accent-gold" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-primary-main mb-1">
                Nuestra Misión
              </h2>
              <div className="w-8 h-0.5 bg-accent-gold mx-auto mb-5" />
              <Text className="leading-relaxed text-neutral-dark">
                Ser la mejor Institución en brindar educación de calidad, garantizando el aprendizaje a todos los alumnos con deseos de superarse; para desarrollar en ellos actitudes y aptitudes. Siendo parte integral, el cuerpo académico, el equipo técnico, así como su infraestructura, para lograr con éxito el desarrollo de cada uno de sus alumnos en el ámbito laboral.
              </Text>
            </div>

            {/* Visión */}
            <div className="bg-white rounded-xl p-8 shadow-soft flex flex-col">
              <div className="flex justify-center mb-5">
                <div className="bg-neutral-light rounded-full p-4">
                  <Eye size={36} className="text-accent-orange" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-primary-main mb-1">
                Nuestra Visión
              </h2>
              <div className="w-8 h-0.5 bg-accent-orange mx-auto mb-5" />
              <Text className="leading-relaxed text-neutral-dark">
                Ofrecer una adecuada infraestructura, implementada con todos los avances tecnológicos y además docentes capacitados en innovaciones pedagógicas y profesionalmente aptos, comprometidos con la realidad a fin de mejorar, para un servicio educativo de calidad.
              </Text>
            </div>

          </div>
        </div>
      </section>

      {/* Origen del Nombre */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-light rounded-xl p-8 shadow-soft">
            <div className="flex justify-center mb-5">
              <div className="bg-white rounded-full p-4 shadow-soft">
                <Award size={36} className="text-primary-main" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center text-primary-main mb-1">
              Origen del Nombre
            </h2>
            <div className="w-12 h-0.5 bg-primary-main mx-auto mb-8" />

            {/* Content with image */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {/* Image */}
              <div className="md:col-span-1 flex flex-col items-center md:items-start mt-6 md:mt-10">
                <img
                  src="/images/alfonsoreyes.jpg"
                  alt="Alfonso Reyes"
                  className="w-full rounded-xl shadow-medium object-cover h-80"
                />
                <div className="mt-4 text-center md:text-left">
                  <p className="font-bold text-primary-main">Alfonso Reyes</p>
                  <p className="text-neutral-dark opacity-70 whitespace-nowrap text-[10px]">{"Monterrey\u00A01889\u00A0·\u00A0Ciudad\u00A0de\u00A0México\u00A01959"}</p>
                </div>
              </div>

              {/* Text */}
              <div className="md:col-span-2 space-y-4 leading-relaxed text-neutral-dark">
                <Text>
                  Nació en Monterrey, Nuevo León, el 17 de mayo de 1889 y murió el 27 de diciembre de 1959 en la ciudad de México. Fue fundador del Ateneo de la Juventud. Fue varias veces candidato al Premio Nobel. Escribió libros sobre temas clásicos, así como temas sobre problemas mexicanos y americanos. Sus ensayos lo convirtieron en el paradigma de la ensayística latinoamericana.
                </Text>
                <Text>
                  Ensayista, crítico, poeta y narrador mexicano, relacionado con la mejor tradición literaria occidental, desde la antigüedad grecolatina hasta las creaciones de Mallarmé y la estética simbolista. Ejerció un notable magisterio en la cultura de su tiempo, promovió la fundación de sólidas instituciones dedicadas a la difusión del conocimiento, y marcó la obra de casi todos los escritores mexicanos posteriores a él, como Octavio Paz y Carlos Fuentes.
                </Text>
                <Text>
                  Siendo aún muy joven concluyó la carrera de leyes y partió a Europa. Como miembro del servicio exterior mexicano se afincó en París en 1914, y allí publicó su volumen Cuestiones estéticas.
                </Text>
                <Text>
                  Miembro de la Academia Mexicana de la Lengua y del Colegio Nacional, fue fundador del Instituto Francés de América Latina y de El Colegio de México, uno de los centros académicos de alto nivel más prestigiosos del país.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};