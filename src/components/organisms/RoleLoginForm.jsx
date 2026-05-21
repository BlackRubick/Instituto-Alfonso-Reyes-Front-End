import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, Phone, ArrowRight, Shield, BookOpen, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { Input, Label } from '../atoms';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const RoleLoginForm = ({ mode = 'student' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ credential: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const allowedRoles = mode === 'student'
    ? ['estudiante']
    : ['admin', 'profesor', 'contador', 'cobranza', 'jefe', 'director', 'coordinadora', 'asesor_academico'];

  const credentialLabel = mode === 'student' ? 'Matrícula' : 'Correo electrónico';
  const credentialPlaceholder = mode === 'student' ? 'Ingresa tu matrícula' : 'Ingresa tu correo';
  const loginEndpoint = mode === 'student' ? '/api/auth/login-student' : '/api/auth/login-staff';

  const roleText = mode === 'student'
    ? 'Acceso exclusivo para alumnos'
    : 'Acceso para personal docente, administrativo e institucional';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}${loginEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(mode === 'student'
            ? { matricula: formData.credential }
            : { correo_electronico: formData.credential }),
          contrasena: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No fue posible iniciar sesión.');
      }

      if (!allowedRoles.includes(data.user.rol)) {
        throw new Error(
          mode === 'student'
            ? 'Este acceso es exclusivo para alumnos.'
            : 'Este acceso es exclusivo para personal docente e institucional.'
        );
      }

      localStorage.setItem('iar_token', data.token);
      localStorage.setItem('iar_user', JSON.stringify(data.user));

const targetRoute =
  data.user.rol === 'admin'
    ? '/admin'
    : data.user.rol === 'profesor'
      ? '/docentes'
      : data.user.rol === 'coordinadora'
        ? '/coordinador'
        : data.user.rol === 'contador'
          ? '/contador'
          : data.user.rol === 'jefe'
            ? '/metrics/jefe'
            : data.user.rol === 'director'
              ? '/metrics/director'
              : data.user.rol === 'asesor_academico'
                ? '/asesor'
              : '/';

      await Swal.fire({
        icon: 'success',
        title: 'Acceso autorizado',
        text: 'Redirigiendo...'
      });
      navigate(targetRoute);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'No fue posible iniciar sesión',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-main via-primary-dark to-primary-bg flex items-center px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[60px] border-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full border-[40px] border-accent-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border-[24px] border-white/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
        <section className="text-white space-y-8 lg:pr-6">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-medium flex-shrink-0">
              <img
                src="/images/logo2.png"
                alt="Instituto Alfonso Reyes"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 font-semibold mb-1">{roleText}</p>
              <h1 className="text-xl font-bold leading-tight">Instituto Alfonso Reyes</h1>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              {mode === 'student' ? 'Portal' : 'Panel'}<br />
              <span className="text-accent-gold">académico</span><br />
              {mode === 'student' ? 'para alumnos.' : 'del personal.'}
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              {mode === 'student'
                ? 'Accede a tu información académica con tu correo y contraseña institucional.'
                : 'Ingresa con tu correo institucional y contraseña para acceder a las herramientas de tu rol.'}
            </p>
          </div>

          <div className="space-y-3 max-w-sm">
            {(
              mode === 'student'
                ? [
                    { icon: <Shield size={16} />, title: 'Acceso seguro', desc: 'Ingresa con tu correo institucional y contraseña.' },
                    { icon: <BookOpen size={16} />, title: 'Información académica', desc: 'Consulta tu información escolar y servicios disponibles.' },
                    { icon: <GraduationCap size={16} />, title: 'Perfil de alumno', desc: 'Acceso exclusivo para estudiantes inscritos.' }
                  ]
                : [
                    { icon: <Shield size={16} />, title: 'Acceso seguro', desc: 'Validación por correo institucional y contraseña.' },
                    { icon: <BookOpen size={16} />, title: 'Gestión interna', desc: 'Herramientas para seguimiento académico y administrativo.' },
                    { icon: <GraduationCap size={16} />, title: 'Roles permitidos', desc: 'Admin, profesor, contador, cobranza, jefe, director, coordinadora y asesor académico.' }
                  ]
            ).map((item) => (
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

        <section className="bg-white rounded-3xl shadow-medium overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent-gold via-accent-orange to-accent-gold" />

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <span className="inline-block bg-primary-main/8 text-primary-main text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                {mode === 'student' ? 'Alumno' : 'Personal académico'}
              </span>
              <h2 className="text-2xl font-bold text-neutral-dark mb-1">
                {mode === 'student' ? 'Acceder al sistema de alumnos' : 'Acceder al portal docente'}
              </h2>
              <p className="text-sm text-neutral-dark/55">Introduce tus credenciales institucionales para continuar.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="credential" className="text-sm font-semibold text-neutral-dark mb-1.5 block">
                  {credentialLabel}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-main/50" size={16} />
                  <Input
                    id="credential"
                    name="credential"
                    type={mode === 'student' ? 'text' : 'email'}
                    value={formData.credential}
                    onChange={handleChange}
                    placeholder={credentialPlaceholder}
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
                disabled={loading}
                className="w-full mt-2 bg-accent-orange hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-bold text-base py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                {loading ? 'Validando...' : 'Ingresar'}
                <ArrowRight size={17} />
              </button>
            </form>

            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs text-neutral-dark/30 font-medium">¿Necesitas ayuda?</span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

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