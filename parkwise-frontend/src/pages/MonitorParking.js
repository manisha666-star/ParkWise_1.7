import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function MonitorParking() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [monitorTime, setMonitorTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentAvailability, setCurrentAvailability] = useState(null);
  const navigate = useNavigate();

  // Get current time and 24 hours from now
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
  };

  const getMaxDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 24);
    return now.toISOString().slice(0, 16);
  };

  // Set default monitor time to current time
  useEffect(() => {
    setMonitorTime(getCurrentDateTime());
  }, []);

  // Fetch available facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/parking-spots?limit=1000&offset=0`);
      const data = await response.json();
      const facilitiesArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      setFacilities(facilitiesArray);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load parking facilities');
    }
  };

  const handleFacilityChange = async (facilityId) => {
    setSelectedFacility(facilityId);
    setCurrentAvailability(null);
    setError('');
    setSuccess('');

    if (facilityId) {
      // Use the already fetched facilities data instead of making another API call
      const facility = facilities.find(f => f.facilityid === facilityId);
      
      if (facility) {
        setCurrentAvailability(facility.counterfreeplaces || 0);
      } else {
        // Fallback: if facility not found in cached data, try to fetch it
        try {
          const response = await fetch(`${BACKEND_URL}/parking-spots?limit=1000&offset=0`);
          const data = await response.json();
          const facilitiesArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
          const facility = facilitiesArray.find(f => f.facilityid === facilityId);
          
          if (facility) {
            setCurrentAvailability(facility.counterfreeplaces || 0);
          }
        } catch (error) {
          console.error('Error fetching facility availability:', error);
        }
      }
    }
  };

  const handleMonitorAlert = async () => {
    if (!selectedFacility || !monitorTime) {
      setError('Please select a facility and monitoring time');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to set up monitoring alerts');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/monitor-parking-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          facility_id: selectedFacility,
          monitor_for_time: monitorTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create monitoring alert');
      }

      const result = await response.json();
      setSuccess('Monitoring alert created successfully! You will be notified when parking availability changes.');
      
      // Reset form
      setSelectedFacility('');
      setMonitorTime(getCurrentDateTime());
      setCurrentAvailability(null);

    } catch (error) {
      console.error('Error creating monitoring alert:', error);
      setError(error.message || 'Failed to create monitoring alert');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: `url(${process.env.PUBLIC_URL + '/parking-bg.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        zIndex: 1
      }} />
      
      {/* Content */}
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        padding: '20px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '30px',
            borderBottom: '2px solid #e9ecef',
            paddingBottom: '20px'
          }}>
            <h1 style={{ 
              margin: 0, 
              color: '#0d6efd',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              Monitor Parking
            </h1>
            <span style={{ 
              marginLeft: '10px', 
              backgroundColor: '#ff6b35',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Premium Feature
            </span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '30px',
            marginBottom: '30px'
          }}>
            {/* Left Panel - Controls */}
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Monitoring Settings</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#555'
                }}>
                  Select Parking Facility:
                </label>
                <select
                  value={selectedFacility}
                  onChange={(e) => handleFacilityChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="">Choose a parking facility...</option>
                  {facilities.map((facility) => (
                    <option key={facility.facilityid} value={facility.facilityid}>
                      {facility.nom_parking || facility.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#555'
                }}>
                  Monitor Until (Next 24 hours only):
                </label>
                <input
                  type="datetime-local"
                  value={monitorTime}
                  onChange={(e) => setMonitorTime(e.target.value)}
                  min={getCurrentDateTime()}
                  max={getMaxDateTime()}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <small style={{ 
                  color: '#6c757d', 
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  You will be notified when parking availability changes
                </small>
              </div>

              <button
                onClick={handleMonitorAlert}
                disabled={loading || !selectedFacility || !monitorTime}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Creating Alert...' : 'Set Up Monitoring Alert'}
              </button>

              {error && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#f8d7da', 
                  color: '#721c24', 
                  borderRadius: '6px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  borderRadius: '6px',
                  border: '1px solid #c3e6cb'
                }}>
                  {success}
                </div>
              )}
            </div>

            {/* Right Panel - Current Status */}
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Current Status</h3>
              
              {selectedFacility ? (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Selected Facility:</strong> {facilities.find(f => f.facilityid === selectedFacility)?.nom_parking}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Current Available Spots:</strong> 
                    <span style={{ 
                      color: currentAvailability > 10 ? '#28a745' : 
                             currentAvailability > 5 ? '#ffc107' : '#dc3545',
                      fontWeight: '600',
                      marginLeft: '8px'
                    }}>
                      {currentAvailability !== null ? currentAvailability : 'Loading...'}
                    </span>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Monitoring Until:</strong> {formatDateTime(monitorTime)}
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#e3f2fd', 
                    borderRadius: '6px',
                    border: '1px solid #bbdefb'
                  }}>
                    <small style={{ color: '#1976d2' }}>
                      💡 You'll receive notifications when parking availability changes during the monitoring period.
                    </small>
                  </div>
                </div>
              ) : (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  color: '#6c757d',
                  textAlign: 'center'
                }}>
                  Select a facility to see current status
                </div>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>How Monitoring Works</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#0d6efd', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  1
                </span>
                <div>
                  <strong>Select Facility</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                    Choose the parking facility you want to monitor
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#0d6efd', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  2
                </span>
                <div>
                  <strong>Set Monitoring Time</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                    Choose how long to monitor (up to 24 hours)
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ 
                  backgroundColor: '#0d6efd', 
                  color: '#fff', 
                  borderRadius: '50%', 
                  width: '24px', 
                  height: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '12px',
                  flexShrink: 0
                }}>
                  3
                </span>
                <div>
                  <strong>Get Notified</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                    Receive alerts when parking availability changes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonitorParking; 