import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Lock, Mail, ArrowRight, User, UserPlus, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const LoginPage = ({ onBackToLanding }) => {
  const { login } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('admin@ai-copilot.com');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Product Manager');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isRegisterMode) {
        await api.register({
          username: username || email.split('@')[0],
          email,
          password
        });
        setSuccessMsg('Registration successful! Please sign in with your credentials.');
        setIsRegisterMode(false);
      } else {
        const authRes = await api.login({ email, password });

        if (!authRes?.access_token) {
          throw new Error('Authentication server returned no access token.');
        }

        login({
          email,
          role,
          token: authRes.access_token,
          username: username || email.split('@')[0]
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        padding: '38px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative'
      }}>
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        )}
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {isRegisterMode ? 'Create Account' : 'Sign In'}
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            AI Product Manager Copilot
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.15)', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', fontSize: '0.84rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.84rem', marginBottom: '18px' }}>
            {successMsg}
          </div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {isRegisterMode && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <UserPlus size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="input-field"
                  style={{ paddingLeft: '42px', height: '44px', fontSize: '0.94rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="input-field"
                style={{ paddingLeft: '42px', height: '44px', fontSize: '0.94rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                style={{ paddingLeft: '42px', height: '44px', fontSize: '0.94rem' }}
              />
            </div>
          </div>

          {!isRegisterMode && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
                Role
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: '42px', height: '44px', fontSize: '0.94rem', backgroundColor: 'var(--bg-card)', cursor: 'pointer' }}
                >
                  <option value="Product Manager">Product Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              height: '46px',
              fontSize: '1rem',
              fontWeight: 600,
              marginTop: '6px',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
            }}
          >
            <span>{loading ? (isRegisterMode ? 'Registering...' : 'Signing In...') : (isRegisterMode ? 'Create Account' : 'Sign In')}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError(null);
              setSuccessMsg(null);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.86rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegisterMode ? 'Already have an account? Sign In' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
