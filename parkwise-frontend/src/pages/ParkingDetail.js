import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';


export default function ParkingDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const spot = location.state?.spot;

  if (!spot) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2>Parking spot not found</h2>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: '#f5f7fa',
        minHeight: '100vh',
        padding: '30px 15px'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '25px'
          }}
        >
          {/* LEFT COLUMN */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
            }}
          >
            <img
              src={spot.image_url || process.env.PUBLIC_URL + '/parking1.jpg'}
              alt={spot.name}
              style={{
                width: '100%',
                height: '350px',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />

            <h2
              style={{
                marginTop: '20px',
                fontWeight: '700'
              }}
            >
              {spot.name}
            </h2>

            <div
              style={{
                display: 'inline-block',
                background: '#d4edda',
                color: '#28a745',
                padding: '8px 14px',
                borderRadius: '20px',
                fontWeight: '600',
                marginTop: '10px'
              }}
            >
              🟢 Open Now
            </div>


            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '25px',
                marginTop: '25px'
              }}
            >
              <h4
                style={{
                  fontWeight: '700',
                  marginBottom: '15px'
                }}
              >
                Vehicle Types
              </h4>

              <div
                style={{
                  color: '#2f6d4f',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontSize: '18px'
                }}
              >
                Maximum Height : 1.9m
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6,1fr)',
                  textAlign: 'center',
                  gap: '15px'
                }}
              >
                <div>
                  <div style={{ fontSize: '42px' }}>🏍️</div>
                  <div>2 Wheels</div>
                </div>

                <div>
                  <div style={{ fontSize: '42px' }}>🚗</div>
                  <div>Small</div>
                </div>

                <div>
                  <div style={{ fontSize: '42px' }}>🚙</div>
                  <div>Medium</div>
                </div>

                <div>
                  <div style={{ fontSize: '42px' }}>🚘</div>
                  <div>Large</div>
                </div>

                <div>
                  <div style={{ fontSize: '42px' }}>🚐</div>
                  <div>High Roof</div>
                </div>

                <div>
                  <div style={{ fontSize: '42px' }}>🚲</div>
                  <div>Bike</div>
                </div>
              </div>
            </div>  
            <div
              style={{
                marginTop: '30px',
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '24px'
              }}
            >
              <h3
                style={{
                  marginBottom: '20px',
                  fontWeight: '700'
                }}
              >
                Features
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2,1fr)',
                  gap: '15px'
                }}
              >
                {[
                  '🚗 Self Parking',
                  '🔒 Secure Parking',
                  '♿ Wheelchair Access',
                  '📹 CCTV Monitoring',
                  '🅿 Covered Parking',
                  '🕒 Open 24/7'
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      background: '#fff',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      fontWeight: '500'
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <h3>About this Parking</h3>

              <p
                style={{
                  color: '#555',
                  lineHeight: '1.8'
                }}
              >
                This parking facility is connected to the ParkWise smart parking network.
                Drivers can view available parking information, navigate directly to the
                facility and discover nearby parking options throughout Paris.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: '20px'
              }}
            >
              <h3>Parking Information</h3>

              <hr />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '10px',
              
                  }}
                >
                  <span
                    style={{
                      color: '#f5b301',
                      fontSize: '24px',
                      letterSpacing: '2.5px'
                    }}
                  >
                    ★★★★★
                  </span>

                  <span
                    style={{
                      marginLeft: '12px',
                      color: '#2f6d4f',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}
                  >
                    79 Reviews
                  </span>
                </div>

                <div>🚗 Available Spaces: N/A</div>

                <div>🕒 Open 24 Hours</div>

                <div>📍 Paris Region</div>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-100 mt-4"
                style={{
                  borderRadius: '10px',
                  fontWeight: '600'
                }}
              >
                Get Directions
              </a>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate(-1)}
                style={{
                  borderRadius: '10px'
                }}
              >
                <FaArrowLeft /> Back
              </button>
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <div
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #eee'
                }}
              >
                <h3 style={{ margin: 0 }}>Location</h3>
              </div>

              <div
                style={{
                  height: '450px'
                }}
              >
                <ParkingMap spots={[spot]} />
              </div>

              <div
                style={{
                  padding: '15px 20px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${spot.latitude},${spot.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#198754',
                    fontWeight: '600'
                  }}
                >
                  📍 View Full Map
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: '#198754',
                    fontWeight: '600'
                  }}
                >
                  🚗 Get Guided There
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}