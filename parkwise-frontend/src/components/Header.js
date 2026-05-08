import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    // Try to get user_email from localStorage first
    const email = localStorage.getItem('user_email');
    const subscription = localStorage.getItem('subscription');
    if (email) {
      setUser({ email, subscription });
    } else {
      const token = localStorage.getItem('access_token');
      if (token) {
        fetch(`${BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data && data.email) setUser({ email: data.email, subscription: data.subscription || 'free' });
          });
      }
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('subscription');
    setUser(null);
    navigate('/login');
  };

  const handleUpgradeToPremium = () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${BACKEND_URL}/upgrade-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.ok) {
          localStorage.setItem('subscription', 'premium');
          setUser(prev => ({ ...prev, subscription: 'premium' }));
          alert('Your account has been upgraded to Premium!');
          setDropdownOpen(false);
          return res.json();
        } else {
          throw new Error('Failed to upgrade subscription');
        }
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold">
        <img src={process.env.PUBLIC_URL + '/parkwise-logo.png'} alt="ParkWise Logo" style={{ height: '51px', width: '122px', marginRight: '10px' }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/all-parking" className="fw-semibold mx-2">FIND PARKING</Nav.Link>
            {user && user.subscription === 'premium' && (
              <>
                <Nav.Link as={Link} to="/forecast" className="fw-semibold mx-2">FORECAST</Nav.Link>
                <Nav.Link as={Link} to="/monitor-parking" className="fw-semibold mx-2">MONITOR PARKING</Nav.Link>
              </>
            )}
            <Nav.Link as={Link} to="#" className="fw-semibold mx-2">ABOUT</Nav.Link>
            {user ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={dropdownRef}>
               
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#d1d1d1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#888',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                  onClick={() => setDropdownOpen(v => !v)}
                >
                  {user.email ? user.email[0].toUpperCase() : 'U'}
                </div>
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 48,
                    right: 0,
                    minWidth: 280,
                    background: '#ffffff',
                    color: '#333',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    padding: 0,
                    zIndex: 1000,
                    border: '1px solid #e1e5e9'
                  }}>
                    <div style={{ 
                      padding: '20px 24px 16px 24px', 
                      borderBottom: '1px solid #f0f0f0',
                      background: 'linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(75 162 122) 100%)',
                      color: '#fff',
                      borderRadius: '12px 12px 0 0'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Welcome Back</div>
                      <div style={{ fontSize: 14, opacity: 0.9 }}>{user.email}</div>
                    </div>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, color: '#666' }}>Current Plan</span>
                        <span style={{ 
                          fontSize: 14, 
                          fontWeight: 600,
                          color: user.subscription === 'premium' ? '#ff6b35' : '#1886ff',
                          background: user.subscription === 'premium' ? '#fff3e0' : '#e3f2fd',
                          padding: '4px 12px',
                          borderRadius: 20,
                          border: `1px solid ${user.subscription === 'premium' ? '#ffcc80' : '#bbdefb'}`
                        }}>
                          {user.subscription === 'premium' ? 'Premium' : 'Free'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Send Parking Alert - only for premium users */}
                    {/* {user.subscription === 'premium' && (
                      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ 
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          borderRadius: 6
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        onClick={() => navigate('/send-alert')}>
                          <span style={{ fontWeight: 500, color: '#333', fontSize: 14 }}>Send Parking Alert</span>
                        </div>
                      </div>
                    )} */}
                    {user.subscription !== 'premium' && (
                      <div style={{ padding: '12px 24px', borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ 
                          padding: '12px 16px',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                          borderRadius: 6,
                          background: 'linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%)',
                          color: '#fff'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff5722 0%, #ff7043 100%)'}
                        onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ff6b35 0%, #ff8a50 100%)'}
                        onClick={handleUpgradeToPremium}>
                          <span style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>Upgrade to Premium</span>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '16px 24px 16px 24px' }}>
                      <div style={{ 
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        borderRadius: 6
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      onClick={handleLogout}>
                        <span style={{ fontWeight: 500, color: '#333', fontSize: 14 }}>Sign Out</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button as={Link} to="/login" className="px-4 fw-semibold mx-2" variant="primary">LOGIN</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header; 