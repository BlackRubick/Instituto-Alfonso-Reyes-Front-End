export const FAQ = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-main to-primary-dark py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl opacity-90">Resuelve tus dudas sobre nuestros programas y servicios</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="prose max-w-none">
            <p>
              Te damos la cordial bienvenida a esta sección creada con el objetivo de brindarte un mejor servicio y agilizar el flujo de información entre nosotros. Si tienes otras preguntas referentes al instituto y no están contestadas aquí no dudes en contactarnos, estamos para servirte.
            </p>

            <ol className="mt-6 space-y-4">
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">1.- ¿La escuela es nueva?</summary>
                  <p className="mt-2">No, somos una Institución Educativa, que se formó en el mes de septiembre del año 1993.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">2.- ¿Esta institución es pública o privada?</summary>
                  <p className="mt-2">Es privada.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">3.- ¿Se encuentran incorporados a la secretaria de educación?</summary>
                  <p className="mt-2">Sí, nuestra clave es MSP07101.15 (Clave del centro de trabajo 07PCT0028L). Además estamos incorporados a la Dirección General de Educación Tecnológica Industrial (DGETI), que nos proporciona el Reconocimiento de Validez Oficial de Estudios (RVOE).</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">4.- ¿Se necesita presentar examen de admisión?</summary>
                  <p className="mt-2">No se necesita examen de admisión para inscribirte con nosotros.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">5.- ¿Se necesita un promedio mínimo para ingresar?</summary>
                  <p className="mt-2">No es necesario.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">6.- ¿Que turnos están disponibles?</summary>
                  <p className="mt-2">Lunes a viernes: Matutino y Vespertino. Fin de semana: Sábados (matutino) y Domingo (matutino).</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">7.- ¿Que carreras tiene el Instituto?</summary>
                  <p className="mt-2">Técnico en Enfermería General (RVOE DGETI2001545) y Técnico en Informática Administrativa (RVOE DGETI2001546).</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">8.- ¿En cuanto tiempo termino mi carrera técnica?</summary>
                  <p className="mt-2">En 3 años.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">9.- ¿Si ya tengo la preparatoria, es necesario cursar las materias de tronco común?</summary>
                  <p className="mt-2">No, existe la posibilidad de revalidar materias; cursarías únicamente las materias que no llevaste en la prepa, enfocándote a las materias de especialidad.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">10.- ¿Hacen prácticas clínicas y hospitalarias?</summary>
                  <p className="mt-2">Contamos con planes y programas de estudios que exigen la práctica de los alumnos; tenemos convenios con Instituciones de Salud para la realización de prácticas y servicio social.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">11.- ¿Cuándo realizo el servicio social?</summary>
                  <p className="mt-2">Al concluir el 6to Semestre, obteniendo el 100% de créditos.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">12.- ¿Cuánto tiempo dura el Servicio social?</summary>
                  <p className="mt-2">El servicio social consta de un año.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">13.- ¿Donde puedo realizar mi servicio social?</summary>
                  <p className="mt-2">En dependencias oficiales de salud o en asociaciones civiles.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">14.- ¿Tienen convenios con la Secretaria de Salud?</summary>
                  <p className="mt-2">Sí, contamos con convenios.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">15.- ¿Cuáles son las opciones para titulación?</summary>
                  <p className="mt-2">Automática si tienes un promedio académico de 8.0; por proyecto de tesis; cursando un diplomado en la especialidad (3 meses); o por examen de conocimientos generales.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">16.- ¿En cuanto tiempo me entregan mi titulo y cedula?</summary>
                  <p className="mt-2">El periodo lo determina la Dirección General de Profesiones; aproximadamente la duración es de 8 meses a 1 año.</p>
                </details>
              </li>
              <li>
                <details className="bg-neutral-light p-4 rounded-lg">
                  <summary className="font-semibold">17.- Si estoy por concluir mi secundaria, pero aun no me han entregado mi certificado de estudios ¿Puedo inscribirme?</summary>
                  <p className="mt-2">Con una constancia de estudios que mencione que estás cursando el tercer grado de forma regular puedes inscribirte.</p>
                </details>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Additional Contact CTA */}
      <section className="py-16 px-4 bg-neutral-light">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-neutral-dark mb-4">
            ¿No encontraste la respuesta?
          </h2>
          <p className="text-neutral-dark/70 mb-8">
            Estamos aquí para ayudarte. Contáctanos directamente y uno de nuestros representantes te atenderá lo antes posible.
          </p>
          <a
            href={`https://wa.me/9611726687?text=${encodeURIComponent('Hola, tengo una pregunta sobre el Instituto Alfonso Reyes.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-accent-orange text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Enviar Mensaje
          </a>
        </div>
      </section>
    </div>
  );
};
