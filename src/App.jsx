import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from './components';
import {
  Home,
  Instituto,
  OfertaEducativa,
  Recursos,
  FAQ,
  Contacto,
  Login,
  LoginDocentes,
  Docentes,
  Coordinador,
  AvisoPrivacidad,
  AdminUsuarios,
  JefeMetrics,
  DirectorMetrics,
  Contador
} from './pages';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-main mb-4">404</h1>
        <p className="text-xl text-neutral-dark mb-8">Pagina no encontrada</p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-primary-main text-white rounded-xl hover:bg-primary-dark transition-colors"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  );
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('iar_user') || 'null');
  } catch {
    return null;
  }
}

function normalizeRole(role = '') {
  return String(role).trim().toLowerCase().replace(/[\s-]+/g, '_') === 'coordinador'
    ? 'coordinadora'
    : String(role).trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function ProtectedRoute({ allowedRoles = [], children }) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login_docentes" replace />;
  }

  const normalizedAllowedRoles = allowedRoles.map((role) => normalizeRole(role));

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizeRole(currentUser.rol))) {
    return <Navigate to="/no-encontrada" replace />;
  }

  return children;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login_docentes" element={<LoginDocentes />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/instituto" element={<Instituto />} />
                <Route path="/oferta" element={<OfertaEducativa />} />
                <Route path="/recursos" element={<Recursos />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsuarios /></ProtectedRoute>} />
                <Route path="/docentes" element={<ProtectedRoute allowedRoles={['profesor']}><Docentes /></ProtectedRoute>} />
                <Route path="/coordinador/*" element={<ProtectedRoute allowedRoles={['coordinadora']}><Coordinador /></ProtectedRoute>} />
                <Route path="/contador/*" element={<ProtectedRoute allowedRoles={['contador']}><Contador /></ProtectedRoute>} />
                <Route path="/metrics/jefe" element={<ProtectedRoute allowedRoles={['admin','jefe','director']}><JefeMetrics /></ProtectedRoute>} />
                <Route path="/metrics/director" element={<ProtectedRoute allowedRoles={['admin','director']}><DirectorMetrics /></ProtectedRoute>} />
                <Route path="/no-encontrada" element={<NotFoundPage />} />
                <Route
                  path="*"
                  element={<NotFoundPage />}
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
