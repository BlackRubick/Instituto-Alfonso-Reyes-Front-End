import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MainLayout } from './components';
import {
  Home,
  Instituto,
  OfertaEducativa,
  Recursos,
  FAQ,
  Contacto,
  Login,
  AvisoPrivacidad
} from './pages';

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
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-neutral-light">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-primary-main mb-4">404</h1>
                        <p className="text-xl text-neutral-dark mb-8">Página no encontrada</p>
                        <a
                          href="/"
                          className="inline-block px-8 py-3 bg-primary-main text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                          Volver al Inicio
                        </a>
                      </div>
                    </div>
                  }
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
