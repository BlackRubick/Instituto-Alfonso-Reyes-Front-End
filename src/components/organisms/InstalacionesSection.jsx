export const InstalacionesSection = () => {
  const images = [
    {
      id: 1,
      src: '/images/instala4.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 1'
    },
    {
      id: 2,
      src: '/images/instala1.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 2'
    },
    {
      id: 3,
      src: '/images/instala2.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 3'
    },
    {
      id: 4,
      src: '/images/instala3.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 4'
    },
    {
      id: 5,
      src: '/images/instala5.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 5'
    },
    {
      id: 6,
      src: '/images/instala6.jpeg',
      alt: 'Instalación del Instituto Alfonso Reyes 6'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center mb-12">
          Conoce nuestras instalaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="rounded-xl h-64 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 overflow-hidden bg-neutral-light"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
