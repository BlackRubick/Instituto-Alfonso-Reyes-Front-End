import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Label, Text } from '../components';
import { GraduationCap, Lock, Mail, Phone, ArrowRight, Shield, BookOpen, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const [formData, setFormData] = useState({ matricula: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-main via-primary-dark to-primary-bg flex items-center px-4 py-10 relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full border-[40px] border-accent-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border-[24px] border-white/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">

        {/* Left — branding */}
        <section className="text-white space-y-8 lg:pr-6">

          {/* Logo + name */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-medium flex-shrink-0">
              <img
                src="/images/logo2.png"
                alt="Instituto Alfonso Reyes"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-1">Acceso institucional</p>
              <h1 className="text-xl font-bold leading-tight">Instituto Alfonso Reyes</h1>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Tu portal<br />
              <span className="text-accent-gold">académico</span><br />
              te espera.
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Accede a tu expediente, calificaciones y servicios institucionales con tu matrícula y contraseña.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 max-w-sm">
            {[
              { icon: <Shield size={16} />, title: 'Acceso seguro', desc: 'Conexión protegida desde cualquier dispositivo.' },
              { icon: <BookOpen size={16} />, title: 'Información académica', desc: 'Calificaciones, constancias y más en un solo lugar.' },
              { icon: <GraduationCap size={16} />, title: 'Servicios institucionales', desc: 'Trámites y seguimiento de tu proceso escolar.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-accent-gold mt-0.5 flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/55 leading-snug mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right — form card */}
        <section className="bg-white rounded-3xl shadow-medium overflow-hidden">

          {/* Card top accent */}
          <div className="h-1 bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold" />

          <div className="p-8 md:p-10">

            {/* Card header */}
            <div className="mb-8">
              <span className="inline-block bg-primary-main/8 text-primary-main text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                Bienvenido
              </span>
              <h2 className="text-2xl font-bold text-neutral-dark mb-1">Acceder al sistema</h2>
              <p className="text-sm text-neutral-dark/55">Introduce tus credenciales institucionales para continuar.</p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="matricula" className="text-sm font-semibold text-neutral-dark mb-1.5 block">
                  Matrícula
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-main/50" size={16} />
                  <Input
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    placeholder="Ingresa tu matrícula"
                    className="pl-11 w-full"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="password" className="text-sm font-semibold text-neutral-dark">
                    Contraseña
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-main/50" size={16} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                    className="pl-11 pr-11 w-full"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark/30 hover:text-primary-main transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-accent-orange hover:bg-orange-600 active:scale-[0.98] transition-all text-white font-bold text-base py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                Ingresar
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-dark/30 font-medium">¿Necesitas ayuda?</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            {/* Support block */}
            <div className="bg-neutral-light rounded-2xl p-5 border border-neutral-200">
              <h3 className="text-sm font-bold text-primary-main mb-1">¿Problemas para acceder?</h3>
              <p className="text-xs text-neutral-dark/60 leading-relaxed mb-4">
                Contacta al equipo de soporte para recibir ayuda con tus credenciales.
              </p>
              <div className="space-y-2.5">
                <a
                  href="mailto:instituto_alfonsoreyes@hotmail.com"
                  className="flex items-center gap-2.5 text-xs text-primary-dark hover:text-accent-orange transition-colors group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 group-hover:border-accent-orange/30 group-hover:bg-accent-orange/5 transition-all">
                    <Mail size={13} className="text-accent-orange" />
                  </span>
                  instituto_alfonsoreyes@hotmail.com
                </a>
                <a
                  href="https://wa.me/9616121115"
                  className="flex items-center gap-2.5 text-xs text-primary-dark hover:text-accent-orange transition-colors group"
                >
                  <span className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 group-hover:border-accent-orange/30 group-hover:bg-accent-orange/5 transition-all">
                    <Phone size={13} className="text-accent-orange" />
                  </span>
                  +52 961-612-1115
                </a>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-neutral-dark/40 hover:text-primary-main transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};