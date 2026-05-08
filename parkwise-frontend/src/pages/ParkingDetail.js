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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Parking spot not found.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ marginRight: 8 }} /> Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: 900, background: '#fff', borderRadius: 18, padding: '40px 32px', margin: '48px auto 0 auto', boxSizing: 'border-box' }}>
        <h2 className="fw-bold mb-4" style={{ fontSize: '2.1rem', textAlign: 'center', letterSpacing: 1 }}>Parking Spot Details</h2>
        {/* Header Section */}
        <img
          src={spot.image_url || process.env.PUBLIC_URL + '/parking1.jpg'}
          alt={spot.name}
          style={{ width: '100%', maxHeight: 340, objectFit: 'cover', borderRadius: 12, marginBottom: 32 }}
        />
        <h1 className="fw-bold" style={{ fontSize: '2.3rem', marginBottom: 0 }}>{spot.name}</h1>
        <div style={{ color: '#2ecc40', fontWeight: 600, fontSize: 20, margin: '12px 0 0 0' }}>Free Spaces: {spot.free_places}</div>
        <div style={{ color: '#222', fontSize: 17, margin: '8px 0' }}>
          {/* <FaWalking style={{ marginRight: 6, color: '#1976d2' }} /> */}
          <span style={{ marginRight: 6, color: '#1976d2' }}>🚶</span>
          {spot.distance_km ? `${Math.round(spot.distance_km * 60)} min (${spot.distance_km.toFixed(2)} km)` : 'N/A'}
        </div>
        <div style={{ color: '#666', fontSize: 15, marginBottom: 18 }}>
          <strong>Location:</strong> Latitude: {spot.latitude}, Longitude: {spot.longitude}
        </div>
        <div style={{ borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <ParkingMap spots={[spot]} />
        </div>

        {/* Info Sections */}
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">Things You Should Know</h4>
          <ul style={{ fontSize: 16, color: '#444', marginBottom: 0 }}>
            <li>Depending on parking occupancy, this facility may become a valet and you may be asked to leave your keys with the attendant.</li>
          </ul>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">Amenities</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: 8 }}></span> Self Park</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: 8 }}></span> Valet</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={{fontSize:22,marginRight:8}}></span> Lot - Uncovered</div>
            <div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: 8 }}></span> Wheelchair Accessible</div>
          </div>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">Access Hours</h4>
          <div style={{ fontSize: 16 }}>Mon – Fri <span style={{ marginLeft: 16 }}>5:00am – 8:00pm</span></div>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">How to Redeem</h4>
          <ol style={{ fontSize: 16 }}>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>Print out this Parking Pass before going to park. <span style={{ marginLeft: 8 }}></span></li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>When you arrive at the facility, place your Parking Pass in your dashboard so it’s clearly visible. <span style={{ marginLeft: 8 }}></span></li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>You may park anywhere that doesn’t say “Reserved”. <span style={{ marginLeft: 8 }}></span></li>
            <li style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>Simply leave when you’re ready to go! <span style={{fontSize:22,marginLeft:8}}></span></li>
          </ol>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">Getting There</h4>
          <div style={{ fontSize: 16 }}>
            Enter this location at 50 Harrison St. This is the LM Auburn parking lot, operated by Little Man Parking. It is located on the northwest/right-hand side of Harrison St. (a one-way street) between Observer Hwy. and Newark St. The entrance is marked by multiple yellow arrows on the pavement.
          </div>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <h4 className="fw-bold mb-2">Facility Reviews</h4>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, marginBottom: 8 }}>
            4.6/5 <span style={{ color: '#FFD700', fontSize: 22, marginLeft: 8 }}>★★★★★</span> <span style={{ marginLeft: 8 }}>Excellent</span>
          </div>
          <div style={{ color: '#888', fontSize: 14 }}>Based on 20 reviews from ParkWise customers.</div>
        </section>
        <hr />
        <section style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Free Cancellation Policy:</strong> Cancel up to 24 hours before your reservation for a full refund.<br />
            <strong>365–Day Customer Support:</strong> Our support team is available 24/7 to help you with any issues or questions.<br />
            <strong>Guaranteed Parking by ParkWise:</strong> 4.8/5 App Store Rating (iOS), 300+ Cities in the U.S. and Canada, 75+ Million Cars Parked
          </div>
        </section>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${spot.latitude},${spot.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary fw-semibold"
          >
            Get Directions
          </a>
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            <FaArrowLeft style={{ marginRight: 6 }} /> Back
          </button>
        </div>
      </div>
    </div>
  );
} 