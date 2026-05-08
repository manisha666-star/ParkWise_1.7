import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function Forecast() {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [startDate, setStartDate] = useState('');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plotUrl, setPlotUrl] = useState('');
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

  // Set default start date to current time
  useEffect(() => {
    setStartDate(getCurrentDateTime());
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

  const handleForecast = async () => {
    if (!selectedFacility || !startDate) {
      setError('Please select a facility and date');
      return;
    }

    setLoading(true);
    setError('');
    setForecastData(null);
    setPlotUrl('');

    try {
      // Format startDate to YYYY-MM-DD for backend
      const formattedStartDate = startDate.split('T')[0];
      // Get forecast data
      const forecastResponse = await fetch(
        `${BACKEND_URL}/forecast?facility_id=${selectedFacility}&start_date=${formattedStartDate}`
      );
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);

      // Get forecast plot
      const plotResponse = await fetch(
        `${BACKEND_URL}/forecast-parking?facilityid=${selectedFacility}&start_date=${formattedStartDate}`
      );
      
      if (plotResponse.ok) {
        const blob = await plotResponse.blob();
        const plotUrl = URL.createObjectURL(blob);
        setPlotUrl(plotUrl);
      }

    } catch (error) {
      console.error('Error fetching forecast:', error);
      setError('Failed to load forecast data');
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
               Parking Forecast
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
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Forecast Settings</h3>
              
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
                  onChange={(e) => setSelectedFacility(e.target.value)}
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
                  Start Date (Next 24 hours only):
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                  Predictions available from current time to next 24 hours
                </small>
              </div>

              <button
                onClick={handleForecast}
                disabled={loading || !selectedFacility || !startDate}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: loading ? '#6c757d' : '#0d6efd',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {loading ? 'Loading Forecast...' : 'Generate Forecast'}
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
            </div>

            {/* Right Panel - Current Status */}
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>Current Status</h3>
              
              {forecastData ? (
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Facility:</strong> {facilities.find(f => f.facilityid === selectedFacility)?.nom_parking}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong>Current Available Spots:</strong> 
                    <span style={{ 
                      color: forecastData.current_available_spots > 10 ? '#28a745' : 
                             forecastData.current_available_spots > 5 ? '#ffc107' : '#dc3545',
                      fontWeight: '600',
                      marginLeft: '8px'
                    }}>
                      {forecastData.current_available_spots}
                    </span>
                  </div>
                  <div>
                    <strong>Forecast Period:</strong> Next 24 hours
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
                  Select a facility and date to generate forecast
                </div>
              )}
            </div>
          </div>

          {/* Forecast Results */}
          {forecastData && (
            <div>
              <h3 style={{ marginBottom: '20px', color: '#333' }}>24-Hour Forecast</h3>
              
              {/* Forecast Plot */}
              {plotUrl && (
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                  <img 
                    src={plotUrl} 
                    alt="Forecast Plot" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}

              {/* Forecast Table */}
              <div style={{ 
                backgroundColor: '#fff', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '15px 20px',
                  borderBottom: '1px solid #e9ecef',
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Hourly Predictions
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {forecastData.forecast_next_24h.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 20px',
                      borderBottom: '1px solid #f1f3f4',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}>
                      <span style={{ fontWeight: '500' }}>
                        {formatDateTime(item.datetime)}
                      </span>
                      <span style={{ 
                        fontWeight: '600',
                        color: item.predicted_available_spots > 10 ? '#28a745' : 
                               item.predicted_available_spots > 5 ? '#ffc107' : '#dc3545'
                      }}>
                        {item.predicted_available_spots} spots
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forecast; 