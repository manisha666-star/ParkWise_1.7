import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free'); // 'free' or 'premium'

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setStep(2);
  };

  const handleSignup = async (subscription) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          subscription
        })
      });
      if (!res.ok) throw new Error('Signup failed');
      // Redirect to login page after signup
      localStorage.setItem('showRegisteredMsg', '1');
      window.location.href = '/login?registered=1';
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleRegister = () => {
    setLoading(true);
    setError('');
    fetch(`${process.env.REACT_APP_BACKEND_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        subscription: selectedPlan
      })
    })
      .then(async res => {
        if (!res.ok) {
          let msg = 'Signup failed';
          try {
            const data = await res.json();
            if (data.detail) msg = data.detail;
          } catch {}
          throw new Error(msg);
        }
        localStorage.setItem('showRegisteredMsg', '1');
        window.location.href = '/login?registered=1';
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={process.env.PUBLIC_URL + '/parkwise-logo.png'} alt="ParkWise Logo" className="signup-logo" />
          <h1 className="signup-title">Get Started with ParkWise</h1>
          <p style={{ fontSize: '14px', color: '#7f8c8d', margin: '0' }}>
            Find the perfect parking spot in Paris
          </p>
        </div>
        {step === 1 && (
          <form onSubmit={handleNext}>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="signup-input"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="signup-input"
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="signup-input"
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="signup-input"
              />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  style={{ marginRight: '10px', marginTop: '2px' }}
                />
                <span style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.4' }}>
                  I agree to the{' '}
                  <span style={{ color: '#1886ff', textDecoration: 'underline', cursor: 'pointer' }}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span style={{ color: '#1886ff', textDecoration: 'underline', cursor: 'pointer' }}>
                    Privacy Policy
                  </span>
                </span>
              </label>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <div className="signup-btn-center">
              <button
                type="submit"
                className="signup-btn"
              >
                Next
              </button>
            </div>
            <div className="signup-bottom">
              <span>
                Already have an account?{' '}
              </span>
              <Link to="/login" className="signup-login-link">
                Log in
              </Link>
            </div>
          </form>
        )}
        {step === 2 && (
          <div>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Choose Your Plan</h2>
            <div className="signup-plan-row">
              <PlanCard
                title="FREE TRIAL"
                price={<span style={{ color: '#222', fontWeight: 700, fontSize: 14 }}>€0 for 7 days</span>}
                color="rgb(55, 144, 44)"
                features={[
                  { text: 'Real-time parking availability', check: true },
                  { text: 'Parking congestion forecasts (limited)', check: true },
                  { text: 'Access 3 zones per day', check: true },
                  { text: 'Event-aware predictions', check: false },
                  { text: 'Alerts or notifications', check: false },
                  { text: 'Multi-modal travel suggestions', check: false },
                ]}
                selected={selectedPlan === 'free'}
                onSelect={() => setSelectedPlan('free')}
              />
              <PlanCard
                title="PREMIUM"
                price={<span style={{ color: '#1976d2', fontWeight: 700, fontSize: 14 }}>€4.99/month or €49.99/year</span>}
                color="#1976d2"
                features={[
                  { text: 'Unlimited real-time parking data', check: true },
                  { text: 'Forecast parking using events (concerts, sports)', check: true },
                  { text: 'Congestion heatmaps + live map overlay', check: true },
                  { text: 'Smart suggestions: Park & Ride, metro switch', check: true },
                  { text: 'Event alerts + notifications', check: true },
                  { text: 'Access all zones', check: true },
                  { text: 'Exportable reports or trip planner', check: true },
                ]}
                selected={selectedPlan === 'premium'}
                onSelect={() => setSelectedPlan('premium')}
              />
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
            <div className="signup-btn-row">
              <button
                className="signup-back-btn"
                onClick={() => setStep(1)}
                aria-label="Back"
                disabled={loading}
              >
                <span style={{ fontSize: 20, marginRight: 6, lineHeight: 1 }}>⟵</span> Back
              </button>
              <button
                className="signup-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ title, price, features, selected, onSelect, color }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`signup-plan-card${selected ? ' selected' : ''}`}
      style={{ borderColor: selected ? color : '#e0e0e0', background: selected ? '#eaf4ff' : '#f8f9fa' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
    >
      <div className="signup-plan-badge" style={{ background: color }}>{title}</div>
      <div className="signup-plan-price">{price}</div>
      <ul className="signup-plan-features">
        {features.map((f, i) => (
          <li key={i} style={{ color: f.check ? '#1886ff' : '#bbb', fontWeight: f.check ? 600 : 400 }}>
            {f.check ? '✔' : '✖'} {f.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Signup; 