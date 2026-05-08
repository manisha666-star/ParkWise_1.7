import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Check for success message in query params
  const params = new URLSearchParams(location.search);
  const showSuccess = params.get('success') === '1';

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_email', data.user_email);
        localStorage.setItem('subscription', data.subscription);
        window.location = '/';
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: 32,
        width: 350,
        maxWidth: '90%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={process.env.PUBLIC_URL + '/parkwise-logo.png'} alt="ParkWise" style={{ height: 60, marginBottom: 8 }} />
          <h2 style={{ fontWeight: 700, margin: 0 }}>Welcome Back</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {showSuccess && (
            <div style={{ color: 'green', marginBottom: 12 }}>
              Registration successful! Please log in.
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 18 }}>
            <a href="#" style={{ color: '#1976d2', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px 0',
              background: '#1886ff',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 18,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            disabled={loading}
          >
            Log In
          </button>
          <div style={{ textAlign: 'center', fontSize: 15, color: '#888' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  margin: '8px 0',
  borderRadius: 8,
  border: '1px solid #ddd',
  fontSize: 16,
  outline: 'none'
}; 