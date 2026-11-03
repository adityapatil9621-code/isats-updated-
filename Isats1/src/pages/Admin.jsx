import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const fmt = (value) =>
  value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users', { credentials: 'include' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load users.');
        if (active) setUsers(result.users || []);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.fullName, u.email, u.phone, u.preferredCourse].some((v) => (v || '').toLowerCase().includes(q)),
    );
  }, [users, query]);

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const stats = [
    ['Total students', users.length],
    ['Signed in now', users.filter((u) => u.activeSessions > 0).length],
    ['Profiles completed', users.filter((u) => u.profileCompleted).length],
    ['Joined last 7 days', users.filter((u) => new Date(u.createdAt).getTime() >= weekAgo).length],
  ];

  return (
    <>
      {error && <p className="auth-message auth-error">{error}</p>}

      <div className="admin-stats">
        {stats.map(([label, value]) => (
          <div key={label} className="profile-panel admin-stat">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="profile-panel">
        <div className="profile-panel-heading">
          <h2 style={{ margin: 0 }}>Registered users ({filtered.length})</h2>
          <input
            type="search"
            className="admin-search"
            placeholder="Search name, email, phone or course"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="auth-loading">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="auth-loading">No users found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th><th>Interested course</th>
                  <th>Login method</th><th>Status</th><th>Last login</th><th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.fullName || '—'}</td>
                    <td>{u.email}{u.emailVerified && <span className="admin-pill ok">verified</span>}</td>
                    <td>{u.phone || '—'}</td>
                    <td>{u.preferredCourse || '—'}</td>
                    <td>{u.providers.join(', ') || '—'}</td>
                    <td>
                      <span className={`admin-pill ${u.accountStatus === 'active' ? 'ok' : 'warn'}`}>{u.accountStatus}</span>
                      {u.activeSessions > 0 && <span className="admin-pill ok">online</span>}
                    </td>
                    <td>{fmt(u.lastLogin)}</td>
                    <td>{fmt(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export default function Admin() {
  const navigate = useNavigate();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    navigate('/login', { replace: true });
  }

  return (
    <main className="profile-page">
      <div className="profile-shell admin-shell">
        <header className="profile-header">
          <Link to="/" className="auth-brand">ISATS</Link>
          <div>
            <p className="auth-eyebrow">ADMIN</p>
            <h1>Student accounts</h1>
          </div>
          <button type="button" className="auth-secondary" onClick={logout}>Sign out</button>
        </header>
        <AdminPanel />
      </div>
    </main>
  );
}
