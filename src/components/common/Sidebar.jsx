import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Inbox,
  BarChart3,
  Layers,
  Lightbulb,
  Sliders,
  FileText,
  Map,
  Bot,
  Settings,
  Sparkles,
  Lock,
  BookOpen
} from 'lucide-react';

export const Sidebar = () => {
  const { activeModule, setActiveModule, data, hasPermission } = useApp();
  const role = data.userProfile.role || 'Product Manager';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiredPermission: null },
    { id: 'upload', label: 'Feedback Workspace', icon: Inbox, requiredPermission: null },
    { id: 'themes', label: 'Product Insights', icon: BarChart3, requiredPermission: null },
    { id: 'prd', label: 'PRD Generator', icon: FileText, requiredPermission: null },
    { id: 'stories', label: 'User Stories', icon: BookOpen, requiredPermission: null },
    { id: 'prioritization', label: 'Feature Prioritization', icon: Sliders, requiredPermission: null },
    { id: 'roadmap', label: 'Roadmap', icon: Map, requiredPermission: null },
    { id: 'chat', label: 'Product Assistant', icon: Bot, requiredPermission: null },
    { id: 'settings', label: 'Settings', icon: Settings, requiredPermission: 'manage_settings' }
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      zIndex: 10
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '22px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
        }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>AI Copilot</h3>
          <span style={{ fontSize: '0.72rem', color: role === 'Admin' ? '#fb7185' : role === 'Analyst' ? '#34d399' : '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>
            {role}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ padding: '20px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', padding: '0 10px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Menu
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const allowed = !item.requiredPermission || hasPermission(item.requiredPermission);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!allowed) {
                    alert(`Access Restricted: Your role (${role}) cannot access or modify System Settings.`);
                  } else {
                    setActiveModule(item.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(99, 102, 241, 0.45)' : 'transparent',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                  color: !allowed ? 'var(--text-dim)' : isActive ? '#818cf8' : 'var(--text-muted)',
                  cursor: !allowed ? 'not-allowed' : 'pointer',
                  opacity: !allowed ? 0.55 : 1,
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={!allowed ? 'var(--text-dim)' : isActive ? '#818cf8' : 'var(--text-dim)'} />
                  <span>{item.label}</span>
                </div>
                {!allowed && <Lock size={14} color="#f43f5e" title="Restricted for this role" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Simple Status Footer */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#34d399' }}>Role: {role}</span>
        </div>
      </div>
    </aside>
  );
};
