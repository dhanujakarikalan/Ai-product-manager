import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Search, Sparkles, LogOut, MessageSquare } from 'lucide-react';

export const Header = () => {
  const { data, notifications, setNotifications, setActiveModule, logout } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(13, 14, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 9
    }}>
      {/* Left: Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search customer feedback, PRDs, or reports..." 
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 12px 8px 38px',
              color: 'var(--text-main)',
              fontSize: '0.84rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Right: Quick AI chat, Notifications, User & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => setActiveModule('chat')}
          className="btn btn-primary btn-sm"
          style={{ gap: '6px' }}
        >
          <MessageSquare size={14} />
          <span>AI Chat Interface</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Bell size={17} color="var(--text-main)" />
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#f43f5e'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="glass-panel animate-fade-in" style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              width: '320px',
              padding: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>System Notifications</h4>
                <span onClick={() => setNotifications([])} style={{ fontSize: '0.72rem', color: 'var(--primary)', cursor: 'pointer' }}>Clear all</span>
              </div>
              {notifications.length === 0 ? (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No new notifications</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: n.type === 'urgent' ? '3px solid #f43f5e' : '3px solid #6366f1' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '4px', lineHeight: 1.3 }}>{n.text}</p>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div 
          onClick={() => setActiveModule('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 12px 4px 6px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer'
          }}
          title="Click to view user profile & settings"
        >
          <img 
            src={data.userProfile.avatar} 
            alt={data.userProfile.name} 
            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1 }}>{data.userProfile.name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '2px' }}>{data.userProfile.role}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          title="Sign out to Login Page"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
