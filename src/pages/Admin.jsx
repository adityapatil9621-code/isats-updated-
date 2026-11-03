import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const fmt = (value) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
const STATUS_LABELS = { new: 'New', contacted: 'Contacted', follow_up: 'Follow-up', converted: 'Converted', closed: 'Closed' };

export function AdminPanel() {
  const [enquiries, setEnquiries] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  async function loadEnquiries() {
    setError('');
    const response = await fetch('/api/admin/enquiries', { credentials: 'include' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not load course enquiries.');
    setEnquiries(result.enquiries || []);
  }

  useEffect(() => {
    let active = true;
    fetch('/api/admin/enquiries', { credentials: 'include' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load course enquiries.');
        if (active) setEnquiries(result.enquiries || []);
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      const matchesQuery = !q || [item.fullName, item.phone, item.interestedCourse].some((v) => (v || '').toLowerCase().includes(q));
      return matchesQuery && (statusFilter === 'all' || item.status === statusFilter);
    });
  }, [enquiries, query, statusFilter]);

  async function updateStatus(id, status) {
    setUpdatingId(id); setError('');
    try {
      const response = await fetch(`/api/admin/enquiries/${id}/status`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update status.');
      setEnquiries((current) => current.map((item) => item.id === id ? { ...item, status: result.enquiry.status } : item));
    } catch (err) { setError(err.message); }
    finally { setUpdatingId(''); }
  }

  const counts = {
    total: enquiries.length,
    new: enquiries.filter((item) => item.status === 'new').length,
    followUp: enquiries.filter((item) => item.status === 'follow_up').length,
    converted: enquiries.filter((item) => item.status === 'converted').length,
  };

  return (
    <>
      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      <div className="admin-stats">
        {[["Total enquiries", counts.total], ["New", counts.new], ["Follow-up", counts.followUp], ["Converted", counts.converted]].map(([label, value]) => (
          <div key={label} className="profile-panel admin-stat"><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>
      <section className="profile-panel">
        <div className="profile-panel-heading" style={{ flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Course enquiries ({filtered.length})</h2>
          <div className="flex flex-wrap gap-2">
            <input type="search" className="admin-search" placeholder="Search name, phone or course" value={query} onChange={(e) => setQuery(e.target.value)} />
            <select className="admin-search" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="button" className="auth-secondary" onClick={() => { setLoading(true); loadEnquiries().catch((err) => setError(err.message)).finally(() => setLoading(false)); }}>Refresh</button>
          </div>
        </div>
        {loading ? <p className="auth-loading">Loading enquiries…</p> : filtered.length === 0 ? <p className="auth-loading">No enquiries found.</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Phone</th><th>Interested course</th><th>Received</th><th>Status</th><th>Contact</th></tr></thead>
              <tbody>{filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.fullName}</td>
                  <td className="whitespace-nowrap">{item.phone}</td>
                  <td>{item.interestedCourse}</td>
                  <td className="whitespace-nowrap">{fmt(item.createdAt)}</td>
                  <td>
                    <select aria-label={`Status for ${item.fullName}`} disabled={updatingId === item.id} value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)} className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm">
                      {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td><a className="text-green-700 font-medium hover:underline" href={`https://wa.me/${item.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp</a></td>
                </tr>
              ))}</tbody>
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
    navigate('/admin/login', { replace: true });
  }
  return (
    <main className="profile-page">
      <div className="profile-shell admin-shell">
        <header className="profile-header">
          <Link to="/" className="auth-brand">ISATS</Link>
          <div><p className="auth-eyebrow">ADMIN</p><h1>Course enquiries</h1></div>
          <button type="button" className="auth-secondary" onClick={logout}>Sign out</button>
        </header>
        <AdminPanel />
      </div>
    </main>
  );
}
