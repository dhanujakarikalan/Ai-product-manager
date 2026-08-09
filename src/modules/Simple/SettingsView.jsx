import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, UserCheck, ShieldCheck, Users, FileText, Lock, Cpu, Database, Sun, Moon, Sliders } from 'lucide-react';

export const SettingsView = () => {
  const { data, hasPermission, theme, toggleTheme } = useApp();
  const [usersList, setUsersList] = useState([
    { id: 'u-1', name: 'Alex Rivera', role: 'Product Manager', email: 'pm@enterprise-ai.io' },
    { id: 'u-2', name: 'System Administrator', role: 'Admin', email: 'admin@enterprise-ai.io' },
    { id: 'u-3', name: 'Elena Vance', role: 'Analyst', email: 'analyst@enterprise-ai.io' }
  ]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Analyst');

  const role = data.userProfile.role || 'Product Manager';

  if (role === 'Analyst' || !hasPermission('manage_settings')) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ maxWidth: '500px', margin: '0 auto', padding: '36px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Lock size={28} color="#f43f5e" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Access Restricted</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Your role (**{role}**) cannot access System Settings or Manage Users as per enterprise RBAC policies.
          </p>
        </div>
      </div>
    );
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!hasPermission('manage_users')) {
      alert('Access Denied: Only Admin can manage users.');
      return;
    }
    if (!newUserEmail.trim()) return;
    setUsersList([...usersList, { id: `u-${Date.now()}`, name: newUserEmail.split('@')[0], role: newUserRole, email: newUserEmail }]);
    setNewUserEmail('');
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '6px' }}>Role Permissions: {role}</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>System Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Manage your personal profile preferences and application theme.
          </p>
        </div>
      </div>

      <div className="module-body">
        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Left Column: User Profile & Theme Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <UserCheck size={20} color="#34d399" />
                <h3 style={{ fontSize: '1.1rem' }}>Active User Profile</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <img src={data.userProfile.avatar} alt="User" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
                <div>
                  <h4 style={{ fontSize: '1.05rem' }}>{data.userProfile.name}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{data.userProfile.email}</div>
                  <span className="badge badge-success" style={{ marginTop: '6px' }}>{role}</span>
                </div>
              </div>
            </div>

            {/* Appearance & Theme Selector Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Sun size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem' }}>Appearance & Theme</h3>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select your preferred visual mode across all dashboards and reports.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                {[
                  { id: 'dark', name: 'Dark Theme', desc: 'Deep Obsidian Dark', color: '#6366f1', icon: Moon },
                  { id: 'medium', name: 'Medium Theme', desc: 'Slate Grey Dim', color: '#38bdf8', icon: Sliders },
                  { id: 'light', name: 'Light Theme', desc: 'Crisp Slate White', color: '#2563eb', icon: Sun }
                ].map(t => {
                  const IconComponent = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTheme(t.id)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px 12px',
                        borderRadius: '12px',
                        background: isActive ? 'var(--primary-light)' : 'rgba(255, 255, 255, 0.03)',
                        border: '2px solid',
                        borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center'
                      }}
                    >
                      <IconComponent size={22} color={isActive ? 'var(--primary)' : 'var(--text-dim)'} />
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{t.desc}</div>
                      {isActive && <span className="badge badge-primary" style={{ marginTop: '4px', fontSize: '0.68rem' }}>Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Admin User Management & Audit Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {hasPermission('manage_users') ? (
              <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f43f5e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Users size={20} color="#fb7185" />
                  <h3 style={{ fontSize: '1.1rem' }}>👨‍💼 Admin Only: Manage Users</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', maxHeight: '180px', overflowY: 'auto' }}>
                  {usersList.map(u => (
                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{u.email}</div>
                      </div>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{u.role}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="email" 
                    placeholder="User email..." 
                    value={newUserEmail} 
                    onChange={e => setNewUserEmail(e.target.value)} 
                    className="input-field" 
                    style={{ flex: 1, fontSize: '0.82rem' }}
                  />
                  <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="input-field" style={{ width: '130px', fontSize: '0.82rem' }}>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </form>
              </div>
            ) : null}

            {hasPermission('view_logs') && (
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #f43f5e' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <FileText size={18} color="#fb7185" />
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 600 }}>👨‍💼 System Audit Logs (Admin View)</h4>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>[16:08:12] ADMIN_LOGIN: System Administrator accessed root vault.</div>
                  <div>[15:44:03] ROLE_UPDATE: User RBAC permissions verified.</div>
                  <div>[14:12:55] RAG_QUERY: Embeddings indexed across 142 support tickets.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
