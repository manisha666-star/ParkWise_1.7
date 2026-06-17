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

            <p
              style={{
                marginTop: '15px',
                color: '#666'
              }}
            >
              Facility ID: {spot.facilityid}
            </p>

            <p>
              📍 Latitude: {spot.latitude}
              <br />
              📍 Longitude: {spot.longitude}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '15px'
              }}
            >


              <span className="badge bg-primary p-2">
                ⭐ 4.6 Rating
              </span>

              <span className="badge bg-dark p-2">
                🅿️ ID {spot.facilityid}
              </span>
            </div>

            <div
              style={{
                marginTop: '25px',
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '20px'
              }}
            >
              <h4>Features</h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '12px',
                  marginTop: '20px'
                }}
              >
                {[
                  '🚗 Self Parking',
                  '🔒 Secure Parking',
                  '🌙 Open 24/7',
                  '♿ Wheelchair Accessible',
                  '📷 CCTV Monitoring',
                  '🅿️ Covered Parking'
                ].map((feature) => (
                  <div
                    key={feature}
                    style={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '14px',
                      fontWeight: 500,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '25px' }}>
              <h4>About this Parking</h4>

              <p style={{ color: '#666' }}>
                This parking facility is part of the ParkWise smart parking
                network. View real-time parking information, locate nearby
                facilities, and get directions instantly.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: '20px'
              }}
            >
              <h4>Parking Information</h4>

              <hr />

              <p>⭐ 4.6 / 5</p>

              <p>🚗 Available Spaces: N/A</p>

              <p>🕒 Open 24 Hours</p>

              <p>📍 Paris Region</p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success w-100"
              >
                Get Directions
              </a>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft /> Back
              </button>
            </div>

            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
              }}
            >
              <h4 style={{ marginBottom: '15px' }}>📍 Parking Location</h4>

              <ParkingMap spots={[spot]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}