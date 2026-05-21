import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Footer } from '../organisms';

function hasValidSession() {
  const token = localStorage.getItem('iar_token');
  if (!token) return false;
  try {
    const user = JSON.parse(localStorage.getItem('iar_user') || 'null');
    return !!user && typeof user === 'object' && Boolean(user.rol);
  } catch {
    return false;
  }
}

const PUBLIC_PATHS = new Set(["/", "/instituto", "/oferta", "/recursos", "/faq", "/contacto", "/aviso-privacidad"]);

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasValidSession());

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(hasValidSession());
    };

    syncAuthState();
    window.addEventListener('storage', syncAuthState);

    return () => {
      window.removeEventListener('storage', syncAuthState);
    };
  }, []);

  const showPublicNavbar = PUBLIC_PATHS.has(location.pathname) || !isAuthenticated;

  return (
    <div className="flex flex-col min-h-screen">
      {showPublicNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
