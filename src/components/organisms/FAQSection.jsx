import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b-2 border-neutral-medium last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 px-6 flex items-center justify-between hover:bg-neutral-light transition-colors"
      >
        <h3 className="text-left text-lg font-semibold text-neutral-dark">
          {question}
        </h3>
        <ChevronDown
          size={24}
          className={`text-primary-main transition-transform duration-300 flex-shrink-0 ml-4 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-neutral-dark/70 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: '¿La escuela es nueva?',
      answer: 'No, somos una Institución Educativa, que se formó en el mes de septiembre del año 1993.'
    },
    {
      question: '¿Esta institución es pública o privada?',
      answer: 'Es privada.'
    },
    {
      question: '¿Se encuentran incorporados a la secretaria de educación?',
      answer: 'Sí, nuestra clave es MSP07101.15 (Clave del centro de trabajo 07PCT0028L). Además estamos incorporados a la Dirección General de Educación Tecnológica Industrial (DGETI), que nos proporciona el Reconocimiento de Validez Oficial de Estudios (RVOE).'
    },
    {
      question: '¿Se necesita presentar examen de admisión?',
      answer: 'No se necesita examen de admisión para inscribirte con nosotros.'
    },
    {
      question: '¿Se necesita un promedio mínimo para ingresar?',
      answer: 'No es necesario.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-center mb-12">
          Preguntas Frecuentes
        </h2>
        <div className="bg-neutral-light rounded-xl overflow-hidden shadow-soft">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
