import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import AdminModal from '@/components/AdminModal.jsx';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Reflect the login session in the menu (Login -> Profile, plus Admin for admins)
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((response) => response.json())
      .then((result) => {
        if (!active) return;
        const admin = Boolean(result.authenticated && result.user?.isAdmin);
        setSignedIn(Boolean(result.authenticated));
        setIsAdmin(admin);
        // Right after admin login the site opens the admin popup automatically
        if (admin && location.state?.openAdmin) {
          setAdminOpen(true);
          navigate(location.pathname, { replace: true, state: null });
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nav = [
    ['Home', '/'],
    ['About', '/about'],
    ['Courses', '/courses'],
    ['Contact', '/contact'],
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" aria-label="ISATS home" className="flex items-center shrink-0">
          <img src="/isats-logo.jpeg" alt="ISATS - International School of Aesthetic & Trichology Science" className="h-11 w-auto" />
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap justify-end gap-2 sm:gap-6 items-center">
          {nav.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              {label}
            </NavLink>
          ))}
          {isAdmin && (
            <button type="button" className="isats-login-nav" onClick={() => setAdminOpen(true)}>Admin</button>
          )}
          {signedIn ? (
            <NavLink to="/profile" className={({ isActive }) => `isats-login-nav ${isActive ? 'is-active' : ''}`}>Profile</NavLink>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `isats-login-nav ${isActive ? 'is-active' : ''}`}>Login</NavLink>
          )}
        </nav>
      </div>
      <AdminModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </header>
  );
}
