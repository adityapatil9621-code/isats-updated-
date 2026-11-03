
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import AdminModal from '@/components/AdminModal.jsx';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const shouldOpenAdmin = location.state?.openAdmin === true;

  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        const result = await response.json();

        if (!active) return;

        const authenticated = Boolean(result.authenticated);
        const admin = Boolean(authenticated && result.user?.isAdmin);

        setIsAuthenticated(authenticated);
        setIsAdmin(admin);

        if (admin && shouldOpenAdmin) {
          setAdminOpen(true);

          navigate(location.pathname, {
            replace: true,
            state: null
          });
        }
      } catch {
        if (!active) return;

        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [location.pathname, shouldOpenAdmin, navigate]);

  const nav = [
    ['Home', '/'],
    ['About', '/about'],
    ['Courses', '/courses'],
    ['Contact', '/contact']
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4">

        <Link
          to="/"
          aria-label="ISATS home"
          className="flex items-center shrink-0"
        >
          <img
            src="/isats-logo.jpeg"
            alt="ISATS - International School of Aesthetic & Trichology Science"
            className="h-11 w-auto"
          />
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap justify-end gap-2 sm:gap-6 items-center"
        >
          {nav.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `isats-login-nav ${isActive ? 'is-active' : ''}`
                }
              >
                Login
              </NavLink>

              <Link
                to="/register"
                className="isats-login-nav"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && !isAdmin && (
            <Link
              to="/profile"
              className="isats-login-nav"
            >
              My Profile
            </Link>
          )}

          {isAdmin && (
            <button
              type="button"
              className="isats-login-nav"
              onClick={() => setAdminOpen(true)}
            >
              Admin
            </button>
          )}

          {!isAdmin && (
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                `isats-login-nav ${isActive ? 'is-active' : ''}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
      </div>

      <AdminModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </header>
  );
}
