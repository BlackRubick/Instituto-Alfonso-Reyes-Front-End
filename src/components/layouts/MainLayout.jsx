import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Footer, InternalNavbar } from '../organisms';

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

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('iar_user') || 'null');
  } catch {
    return null;
  }
}

const PUBLIC_PATHS = new Set(["/", "/instituto", "/oferta", "/recursos", "/faq", "/contacto", "/aviso-privacidad"]);
const INTERNAL_NAV_ROLES = new Set(['admin', 'jefe', 'director']);

export const MainLayout = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasValidSession());
  const currentUser = getCurrentUser();
  const normalizedRole = String(currentUser?.rol || '').trim().toLowerCase().replace(/[\s-]+/g, '_');

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
  const showInternalNavbar = !PUBLIC_PATHS.has(location.pathname) && isAuthenticated && INTERNAL_NAV_ROLES.has(normalizedRole);

  return (
    <div className="flex flex-col min-h-screen">
      {showPublicNavbar && <Navbar />}
      {showInternalNavbar && <InternalNavbar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};
