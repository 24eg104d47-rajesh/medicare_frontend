import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Pill, LogIn, AlertCircle, User, Shield, Stethoscope, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect param from URL
  const query = new URLSearchParams(location.search);
  const redirect = query.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password });
      handlePostLoginRedirect(res.role);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const res = await login({ email: demoEmail, password: demoPassword });
      handlePostLoginRedirect(res.role);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to authenticate demo user.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostLoginRedirect = (role) => {
    if (redirect) {
      navigate(redirect);
      return;
    }
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'PHARMACY_ADMIN') {
      navigate('/pharmacy-admin/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f8fafc 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="card" style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.15)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Logo & Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(2, 132, 199, 0.25)'
            }}>
              <Pill size={28} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.25rem' }}>
              Welcome to MediCare AI
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
              Sign in to manage prescriptions, orders & health records
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#991b1b',
              fontSize: '0.85rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.4rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155', margin: 0 }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', borderRadius: '12px' }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Login Quick-Fill Buttons */}
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <span style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              textAlign: 'center',
              marginBottom: '0.85rem'
            }}>
              ⚡ Quick Demo 1-Click Access
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoLogin('customer@medicare.ai', 'Customer@123')}
                disabled={loading}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#1e293b',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                  <User size={16} color="#0284c7" /> Customer Demo
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>customer@medicare.ai</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('pharmacist@medicare.ai', 'Pharma@123')}
                disabled={loading}
                style={{
                  background: '#f0fdfa',
                  border: '1px solid #ccfbf1',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#0f766e',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                  <Stethoscope size={16} color="#0d9488" /> Pharmacist Demo
                </span>
                <span style={{ fontSize: '0.75rem', color: '#0d9488' }}>pharmacist@medicare.ai</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin@medicare.ai', 'Admin@123')}
                disabled={loading}
                style={{
                  background: '#f5f3ff',
                  border: '1px solid #ede9fe',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#6d28d9',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                  <Shield size={16} color="#7c3aed" /> System Admin Demo
                </span>
                <span style={{ fontSize: '0.75rem', color: '#7c3aed' }}>admin@medicare.ai</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0284c7', fontWeight: '700', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
