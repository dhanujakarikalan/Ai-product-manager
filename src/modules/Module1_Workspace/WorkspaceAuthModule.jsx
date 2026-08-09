import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Briefcase, Users, Shield, Plus, Check, Key, UserCheck, Lock } from 'lucide-react';

export const WorkspaceAuthModule = () => {
  const { data, switchWorkspace } = useApp();
  const [newWsName, setNewWsName] = useState('');
  const [role, setRole] = useState(data.userProfile.role);

  const handleCreateWs = (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    alert(`Workspace "${newWsName}" created successfully! Simulation active.`);
    setNewWsName('');
  };

  // Handler for triggering the workbench webhook
  const handleTriggerWorkbench = async () => {
    try {
      const payload = { event: 'trigger', workspace: data.activeWorkspaceId };
      await api.triggerWorkbench(payload);
      alert('Workbench webhook triggered successfully');
    } catch (err) {
      console.error(err);
      alert(`Error triggering workbench: ${err.message}`);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Module 1: Governance & Access</span>
          <h1 style={{ fontSize: '1.75rem' }}>User Authentication & Workspace Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage multi-tenant product workspaces, granular role-based permissions, and AI API security tokens.
          </p>
        </div>
      </div>

      <div className="module-body">
        <div className="grid-2" style={{ gap: '24px', marginBottom: '28px' }}>
          {/* Active Workspace Selector & Switcher */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Briefcase size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem' }}>Active Product Workspaces</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Each workspace isolates customer tickets, product analytics pipelines, RICE scoring matrices, and PRDs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.workspaces.map(ws => {
                const isActive = ws.id === data.activeWorkspaceId;
                return (
                  <div 
                    key={ws.id}
                    onClick={() => switchWorkspace(ws.id)}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                      background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.94rem', fontWeight: 600 }}>{ws.name}</span>
                        {isActive && <span className="badge badge-primary">Current</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                        Role: <strong>{ws.role}</strong> • {ws.members} Team Collaborators
                      </div>
                    </div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isActive ? 'var(--primary)' : 'transparent', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isActive && <Check size={14} color="#fff" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleCreateWs} style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="New Workspace Name (e.g. Mobile Checkout V3)..."
                value={newWsName}
                onChange={e => setNewWsName(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
                <Plus size={16} />
                <span>Create</span>
              </button>
            </form>
          </div>

          {/* User Profile & Role Simulation */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <UserCheck size={20} color="#34d399" />
              <h3 style={{ fontSize: '1.1rem' }}>User Profile & Role Simulation</h3>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Change your active simulation role to test different permission levels (e.g. RICE approval rights, PRD editing).
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '24px' }}>
              <img src={data.userProfile.avatar} alt="Avatar" style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem' }}>{data.userProfile.name}</h4>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>{data.userProfile.email}</div>
                <span className="badge badge-success" style={{ marginTop: '6px' }}>SOC2 Verified Account</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                Simulated Permission Role
              </label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                <option value="Lead Product Manager">Lead Product Manager (Full Access & RICE Prioritization)</option>
                <option value="VP of Product">VP of Product (Roadmap Approval & Executive Briefing)</option>
                <option value="Senior Engineering Lead">Senior Engineering Lead (Effort Estimation & PRD Review)</option>
                <option value="Guest Stakeholder">Guest Stakeholder (Read-Only Roadmap & Dashboard)</option>
              </select>
            </div>

            <div style={{ marginTop: '24px', padding: '14px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22d3ee', fontWeight: 600, fontSize: '0.84rem' }}>
                <Lock size={16} />
                <span>Enterprise SAML SSO & API Vault</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                All Generative AI requests (Gemini 3.1 Pro) are encrypted with customer-managed keys (CMK) and zero data retention for training.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
        <button className="btn btn-primary" onClick={handleTriggerWorkbench}>
          <span>Trigger Agent SNS Workbench</span>
        </button>
      </div>
    </div>
  );
};
