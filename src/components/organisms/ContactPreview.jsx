import { ContactItem } from '../molecules';
import { MapPin, Phone, Mail } from 'lucide-react';

export const ContactPreview = () => {
  return (
    <section className="py-16 px-4 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center mb-12">
          <span className="sr-only">Contacto</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactItem
            icon="MapPin"
            label="Dirección"
            value="Periférico Sur Poniente No. 1952 col. Penipak, Tuxtla Gutiérrez, Chis."
          />
          <div className="flex flex-col gap-4">
            <ContactItem
              icon="Phone"
              label="Teléfono"
              value="961-612-1115"
            />
            <ContactItem
              icon="Phone"
              label="Teléfono"
              value="961-118-1358"
            />
          </div>
          <ContactItem
            icon="Mail"
            label="Email"
            value="instituto_alfonsoreyes@hotmail.com"
            link="mailto:instituto_alfonsoreyes@hotmail.com"
          />
        </div>
      </div>
    </section>
  );
};
