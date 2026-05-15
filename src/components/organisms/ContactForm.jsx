import { useState } from 'react';
import { FormField } from '../molecules';
import { Button } from '../atoms';

export const ContactForm = ({ onSubmit = null }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    if (!formData.mensaje.trim()) newErrors.mensaje = 'El mensaje es requerido';
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        setSubmitted(true);
        setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
        setTimeout(() => setSubmitted(false), 3000);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <FormField
        label="Nombre Completo"
        id="nombre"
        name="nombre"
        type="text"
        placeholder="Tu nombre completo"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />

      <FormField
        label="Teléfono"
        id="telefono"
        name="telefono"
        type="tel"
        placeholder="Tu número de teléfono"
        value={formData.telefono}
        onChange={handleChange}
        error={errors.telefono}
      />

      <FormField
        label="Correo Electrónico"
        id="correo"
        name="correo"
        type="email"
        placeholder="tu.correo@ejemplo.com"
        value={formData.correo}
        onChange={handleChange}
        error={errors.correo}
      />

      <div className="mb-4">
        <label htmlFor="mensaje" className="block text-sm font-semibold text-neutral-dark mb-2">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          placeholder="Tu mensaje..."
          value={formData.mensaje}
          onChange={handleChange}
          className={`
            w-full px-4 py-3 border-2 ${errors.mensaje ? 'border-red-500' : 'border-neutral-medium'}
            rounded-xl focus:border-primary-main focus:outline-none transition-colors
            bg-neutral-white text-neutral-dark placeholder:text-neutral-dark/50
            resize-none h-32
          `}
        />
        {errors.mensaje && <p className="text-red-500 text-sm mt-1">{errors.mensaje}</p>}
      </div>

      {submitted && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800">
          ¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.
        </div>
      )}

      <Button type="submit" variant="secondary" className="w-full">
        Enviar
      </Button>
    </form>
  );
};
