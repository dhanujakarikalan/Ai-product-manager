import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Sparkles, Plus, Search, Filter, CheckCircle2, Clock, ArrowRight, Download, Tag, BookOpen } from 'lucide-react';

export const UserStoriesView = () => {
  const { data } = useApp();
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initial user stories data
  const [stories, setStories] = useState([
    {
      id: 'us-1',
      role: 'Product Manager',
      action: 'click export on a 50,000 row dataset',
      benefit: 'my PDF download starts instantly without freezing the browser',
      status: 'Done',
      priority: 'High',
      feature: 'Automated Report Export Engine',
      workStream: 'Development',
      estimate: '5 pts',
      acceptanceCriteria: [
        { id: 'ac-1', text: 'Given user clicks Export on >50k rows', done: true },
        { id: 'ac-2', text: 'When background worker queues job', done: true },
        { id: 'ac-3', text: 'Then progress bar displays instantly without blocking UI', done: true }
      ]
    },
    {
      id: 'us-2',
      role: 'Executive Stakeholder',
      action: 'open quarterly summary reports on mobile devices',
      benefit: 'I can view clear, formatted charts immediately without layout errors',
      status: 'In Review',
      priority: 'Medium',
      feature: 'Mobile Responsive Dashboard',
      workStream: 'Design',
      estimate: '3 pts',
      acceptanceCriteria: [
        { id: 'ac-4', text: 'Given executive logs in via mobile browser', done: true },
        { id: 'ac-5', text: 'When viewing executive summary page', done: false },
        { id: 'ac-6', text: 'Then charts resize dynamically to fit screen width', done: false }
      ]
    },
    {
      id: 'us-3',
      role: 'Data Analyst',
      action: 'download raw CSV logs in the background',
      benefit: 'I can continue navigating the dashboard while the file prepares',
      status: 'To Do',
      priority: 'High',
      feature: 'Async Worker Queue',
      workStream: 'Data',
      estimate: '8 pts',
      acceptanceCriteria: [
        { id: 'ac-7', text: 'Given analyst requests 100k row CSV export', done: false },
        { id: 'ac-8', text: 'When file generation finishes', done: false },
        { id: 'ac-9', text: 'Then toast notification triggers with direct download link', done: false }
      ]
    },
    {
      id: 'us-4',
      role: 'NovaPhone User',
      action: 'enable system-wide pure black dark mode',
      benefit: 'battery life is preserved on OLED screens during night usage',
      status: 'In Progress',
      priority: 'Medium',
      feature: 'OLED Dark Theme',
      workStream: 'QA/Validation',
      estimate: '2 pts',
      acceptanceCriteria: [
        { id: 'ac-10', text: 'Given user toggles dark mode switch', done: true },
        { id: 'ac-11', text: 'When dark theme activates', done: true },
        { id: 'ac-12', text: 'Then background hex color switches to pure black (#000000)', done: false }
      ]
    },
    {
      id: 'us-5',
      role: 'Security Admin',
      action: 'configure Okta SAML SSO authentication',
      benefit: 'enterprise employees can log in with single sign-on security',
      status: 'In Progress',
      priority: 'Critical',
      feature: 'Enterprise SAML SSO',
      workStream: 'Support',
      estimate: '5 pts',
      acceptanceCriteria: [
        { id: 'ac-13', text: 'Given enterprise admin enters IDP metadata URL', done: true },
        { id: 'ac-14', text: 'When user attempts SSO login', done: true },
        { id: 'ac-15', text: 'Then token is validated against enterprise directory', done: false }
      ]
    }
  ]);

  // New story form state
  const [newRole, setNewRole] = useState('Product Manager');
  const [newAction, setNewAction] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newFeature, setNewFeature] = useState('General Requirement');

  const handleCreateStory = (e) => {
    e.preventDefault();
    if (!newAction.trim() || !newBenefit.trim()) return;

    const created = {
      id: `us-${Date.now()}`,
      role: newRole,
      action: newAction,
      benefit: newBenefit,
      status: 'To Do',
      priority: 'High',
      feature: newFeature,
      acceptanceCriteria: [
        `Given user is logged in as ${newRole}`,
        `When ${newAction}`,
        `Then ${newBenefit}`
      ]
    };

    setStories([created, ...stories]);
    setNewAction('');
    setNewBenefit('');
    setShowCreateModal(false);
  };

  const filteredStories = stories.filter(s => {
    const matchesRole = roleFilter === 'ALL' || s.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch = 
      s.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="module-header">
        <div>
          <span className="badge badge-primary" style={{ marginBottom: '8px' }}>Agile Requirements Studio</span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>User Stories</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
            Structured Agile user stories formatted as <em>"As a [Role], I want to [Action], so that [Benefit]"</em>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary" style={{ gap: '6px' }}>
            <Plus size={16} />
            <span>New User Story</span>
          </button>
          <button onClick={() => alert('Exported User Stories to Jira & Linear format!')} className="btn btn-secondary" style={{ gap: '6px' }}>
            <Download size={16} />
            <span>Export to Jira</span>
          </button>
        </div>
      </div>

      <div className="module-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Summary Cards */}
        <div className="grid-4" style={{ gap: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Total Stories</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{stories.length}</div>
          </div>
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>To Do / In Review</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>
              {stories.filter(s => s.status === 'To Do' || s.status === 'In Review').length}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>In Development</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>
              {stories.filter(s => s.status === 'In Progress').length}
            </div>
          </div>
          <div className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Completed (Done)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>
              {stories.filter(s => s.status === 'Done').length}
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Search user stories..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', height: '38px', fontSize: '0.82rem' }}
              />
            </div>

            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field" style={{ width: '170px', height: '38px', fontSize: '0.82rem' }}>
              <option value="ALL">All Roles</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Executive Stakeholder">Executive Stakeholder</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="NovaPhone User">NovaPhone User</option>
              <option value="Security Admin">Security Admin</option>
            </select>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field" style={{ width: '160px', height: '38px', fontSize: '0.82rem' }}>
              <option value="ALL">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            Showing <strong>{filteredStories.length}</strong> of {stories.length} stories
          </div>
        </div>

        {/* User Stories Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredStories.map((story) => {
            const isDone = story.status === 'Done';
            const isInProgress = story.status === 'In Progress';

            return (
              <div 
                key={story.id} 
                className="glass-panel" 
                style={{ 
                  padding: '20px 24px', 
                  borderLeft: isDone ? '4px solid #10b981' : isInProgress ? '4px solid #38bdf8' : '4px solid #f59e0b',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Top Badge Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <UserCheck size={13} />
                      <span>{story.role}</span>
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Feature: <strong>{story.feature}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${isDone ? 'badge-success' : isInProgress ? 'badge-info' : 'badge-warning'}`}>
                      {story.status}
                    </span>
                  </div>
                </div>

                {/* Main Story Sentence */}
                <div style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)', marginBottom: '14px' }}>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>As a </span>
                  <strong>{story.role}</strong>,{' '}
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>I want to </span>
                  <strong>{story.action}</strong>,{' '}
                  <span style={{ color: '#34d399', fontWeight: 700 }}>so that </span>
                  <span style={{ color: 'var(--text-muted)' }}>{story.benefit}</span>.
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Creating New User Story */}
        {showCreateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}>
            <div className="glass-panel animate-fade-in" style={{ width: '560px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Create New User Story</h3>
                <button onClick={() => setShowCreateModal(false)} className="btn btn-secondary btn-sm">Close</button>
              </div>

              <form onSubmit={handleCreateStory} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>As a (Role / Persona):</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value)} className="input-field">
                    <option value="Product Manager">Product Manager</option>
                    <option value="Executive Stakeholder">Executive Stakeholder</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="NovaPhone User">NovaPhone User</option>
                    <option value="Security Admin">Security Admin</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>I want to (Action / Feature):</label>
                  <input 
                    type="text" 
                    placeholder="e.g. receive real-time push alerts when latency spikes" 
                    value={newAction} 
                    onChange={e => setNewAction(e.target.value)} 
                    className="input-field" 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>So that (Value / Benefit):</label>
                  <input 
                    type="text" 
                    placeholder="e.g. I can address server issues before customers complain" 
                    value={newBenefit} 
                    onChange={e => setNewBenefit(e.target.value)} 
                    className="input-field" 
                    required 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Linked Feature Name:</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Real-Time Alerting System" 
                    value={newFeature} 
                    onChange={e => setNewFeature(e.target.value)} 
                    className="input-field" 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Create User Story</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
