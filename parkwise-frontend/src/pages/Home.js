import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCrosshairs, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';

const vehicleTypes = ['STANDARD', 'ELECTRIC_CAR', 'MOTOR_BIKE', 'DISABLED'];

function formatVehicleTypeForDisplay(type) {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function Home() {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [arriving, setArriving] = useState(new Date());
  const [leaving, setLeaving] = useState(new Date(Date.now() + 2 * 60 * 60 * 1000)); // 2 hours later
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });
  const [locationError, setLocationError] = useState('');
  const datePickerRef = useRef(null);
  const now = new Date();
  const navigate = useNavigate();
  const [selectedVehicleType, setSelectedVehicleType] = useState('STANDARD'); // Default value
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // { name, lat, lon }
  const [popularSpots, setPopularSpots] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/parking-spots?limit=6`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPopularSpots(data);
        } else if (Array.isArray(data.data)) {
          setPopularSpots(data.data);
        } else {
          setPopularSpots([]);
        }
      });
  }, []);

  // REMOVED useEffect to fetch vehicle types from API

  // Helper for minTime logic
  function getMinTime(date) {
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return now;
    }
    return new Date(date.setHours(0, 0, 0, 0));
  }

  function getLeavingMinTime() {
    if (!arriving || !leaving) return now;
    const isSameDay = arriving.toDateString() === leaving.toDateString();
    if (isSameDay) return arriving;
    // Clone leaving before setHours
    const leavingClone = new Date(leaving);
    leavingClone.setHours(0, 0, 0, 0);
    return leavingClone;
  }

  // Helper to get max leaving time (24 hours after arriving)
  function getLeavingMaxTime() {
    if (!arriving || !leaving) return new Date(arriving.getTime() + 24 * 60 * 60 * 1000);
    const maxLeaving = new Date(arriving.getTime() + 24 * 60 * 60 * 1000);
    const isSameDay = leaving.toDateString() === maxLeaving.toDateString();
    if (isSameDay) return maxLeaving;
    // Clone leaving before setHours
    const leavingClone = new Date(leaving);
    leavingClone.setHours(23, 59, 59, 999);
    return leavingClone;
  }

  // Helper for Arriving maxTime (end of day, clone first)
  function getArrivingMaxTime() {
    const clone = new Date(arriving);
    clone.setHours(23, 59, 59, 999);
    return clone;
  }

  // Auto-update leaving if arriving is after leaving
  React.useEffect(() => {
    if (leaving <= arriving) {
      setLeaving(new Date(arriving.getTime() + 15 * 60 * 1000)); // 15 min after arriving
    }
  }, [arriving]);

  // Helper to determine if a place is selected
  const isPlaceSelected = !!selectedPlace || (search === 'Your Location' && currentLocation.lat && currentLocation.lng);

  const MAPBOX_TOKEN = "pk.eyJ1IjoicGZhenppbm8iLCJhIjoiY2o1cnJ6enRuMHcxOTJxbm1panB1ZWtmMCJ9.puITqvSCjjxOs2FtBnmYzw";

  // Fetch place suggestions from Mapbox
  const fetchPlaceSuggestions = async (query) => {
    if (!query) {
      setPlaceSuggestions([]);
      return;
    }
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&language=en&limit=5&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      // Filter for results only in France
      const filtered = (data.features || []).filter(feature => {
        if (!feature.context) return false;
        return feature.context.some(c => c.id.startsWith('country.') && c.text.toLowerCase() === 'france');
      });
      setPlaceSuggestions(filtered);
    }
  };

  // Update search handler to fetch suggestions
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowDropdown(true);
    setSelectedPlace(null);
    fetchPlaceSuggestions(e.target.value);
  };

  // Handler for selecting a place suggestion (Mapbox)
  const handleSelectPlace = (place) => {
    setSearch(place.place_name);
    setSelectedPlace({
      name: place.place_name,
      lat: place.center[1], // latitude
      lng: place.center[0], // longitude
    });
    setShowDropdown(false);
    setPlaceSuggestions([]);
  };

  // Handler for getting current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError('');
          setSearch('Your Location');
          setShowDropdown(false);
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleFindParking = () => {
    let lat, lng, name;
    if (selectedPlace) {
      lat = selectedPlace.lat;
      lng = selectedPlace.lng;
      name = selectedPlace.name;
    } else if (currentLocation.lat && currentLocation.lng) {
      lat = currentLocation.lat;
      lng = currentLocation.lng;
      name = 'Your Location';
    } else {
      lat = 48.8566;
      lng = 2.3522;
      name = search || 'Paris';
    }
    console.log('Navigating to /parking-list with:', { lat, lng, vehicleType: selectedVehicleType, name });
    navigate('/parking-list', { 
      state: { 
        lat, 
        lng, 
        vehicleType: selectedVehicleType,
        name
      } 
    });
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  // Remove reverse geocoding effect

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero + Search Section */}
      <section
        className="d-flex flex-column align-items-center justify-content-center text-center"
        style={{
          minHeight: '60vh',
          background: `url('${process.env.PUBLIC_URL}/parking-bg.jpg') center center/cover no-repeat`,
          position: 'relative',
        }}
      >
        {/* Overlay for readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.75)',
            zIndex: 1,
          }}
        />
        <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '0', position: 'relative', zIndex: 2, maxWidth: 1200 }}>
          <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#222', textShadow: '0 2px 8px rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Smart Event Aware Parking Prediction System
          </h1>
          <p className="lead mb-4" style={{ color: '#222', fontWeight: 500, fontSize: '1.15rem', textShadow: '0 2px 8px rgba(255,255,255,0.5)' }}>
            Predict future parking availability near you based on real-time data and city events
          </p>

          {/* Search Field */}
          <div className="mb-4 position-relative" style={{ maxWidth: 540, margin: '0 auto' }}>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Where are you going?"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(true)}
                style={{ fontSize: "15px", borderLeft: 0, color: search === 'Your Location' ? '#1976d2' : undefined, fontWeight: search === 'Your Location' ? 600 : undefined }}
                autoComplete="off"
              />
              {search && (
                <button
                  className="btn btn-link px-2"
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 11, color: '#888' }}
                  tabIndex={-1}
                  onClick={() => { setSearch(''); setShowDropdown(false); setPlaceSuggestions([]); setSelectedPlace(null); }}
                >
                  &times;
                </button>
              )}
            </div>
            {showDropdown && (
              <div ref={datePickerRef} className="shadow rounded position-absolute w-100 bg-white border mt-1" style={{ zIndex: 10, padding: '0.5rem 0.5rem 0.5rem 0.5rem', left: 0, top: '110%' }}>
                {/* Use Current Location always shown */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <button
                    className="dropdown-item d-flex align-items-center py-2 mb-0"
                    style={{ fontWeight: 600, color: '#1976d2', background: 'transparent', border: 'none', outline: 'none', paddingLeft: 0 }}
                    onMouseDown={handleUseCurrentLocation}
                  >
                    <FaCrosshairs className="me-2 text-primary" />
                    <span>Use Current Location</span>
                  </button>
                </div>
                {/* Place suggestions from Nominatim (Paris only) */}
                {placeSuggestions.length > 0 && (
                  <>
                    <div className="px-3 pt-2 pb-1 text-secondary text-start" style={{ fontSize: '1rem', fontWeight: 500 }}>Places in Paris</div>
                    <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                      {placeSuggestions.map((place, idx) => (
                        <button
                          key={place.id || idx}
                          className="dropdown-item d-flex align-items-center py-2"
                          style={{ fontWeight: 400, color: '#222', background: 'transparent', border: 'none', outline: 'none', paddingLeft: 0 }}
                          onMouseDown={() => handleSelectPlace(place)}
                          title={place.place_name}
                        >
                          <FaMapMarkerAlt className="me-2" style={{ color: '#1976d2', marginTop: 2 }} />
                          <span>{place.place_name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <div className="px-3 pt-2 text-end" style={{ fontSize: '0.9rem', color: '#888' }}>
                  powered by <span style={{ color: '#4285F4', fontWeight: 700 }}>G</span><span style={{ color: '#EA4335', fontWeight: 700 }}>o</span><span style={{ color: '#FBBC05', fontWeight: 700 }}>o</span><span style={{ color: '#4285F4', fontWeight: 700 }}>g</span><span style={{ color: '#34A853', fontWeight: 700 }}>l</span><span style={{ color: '#EA4335', fontWeight: 700 }}>e</span>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Type Dropdown, Arriving and Leaving Pickers - ONLY VISIBLE IF PLACE SELECTED */}
          {isPlaceSelected && (
            <div className="mb-3 mx-auto" style={{ maxWidth: 540 }}>
              <label className="form-label text-dark fw-semibold mb-1" style={{ fontSize: '1.1rem', marginLeft: '0.25rem' }}>Vehicle Type</label>
              <div className="input-group input-group-lg shadow rounded bg-white" style={{ border: '1px solid #ced4da', width: '100%' }}>
                <select 
                  className="form-select form-select-lg border-0 bg-white" 
                  style={{ fontSize: '15px', padding: '0.75rem 1rem' }}
                  value={selectedVehicleType} 
                  onChange={(e) => setSelectedVehicleType(e.target.value)}
                >
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{formatVehicleTypeForDisplay(type)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Arriving and Leaving Pickers - always reserve space, fade in/out */}
          <div style={{ minHeight: 220, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div
              style={{
                width: '100%',
                maxWidth: 540,
                opacity: isPlaceSelected ? 1 : 0,
                pointerEvents: isPlaceSelected ? 'auto' : 'none',
                transition: 'opacity 0.3s',
                position: 'relative',
              }}
            >
              {isPlaceSelected && (
                <>
                  <div className="d-flex flex-column flex-md-row gap-2 justify-content-center align-items-stretch" style={{ marginBottom: '2.5rem' }}>
                    {/* Arriving */}
                    <div className="flex-fill bg-white rounded shadow-sm p-3 d-flex flex-column align-items-center" style={{ minWidth: 220 }}>
                      <div className="text-muted mb-2" style={{ fontWeight: 500 }}>Arriving</div>
                      <DatePicker
                        selected={arriving}
                        onChange={date => setArriving(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd h:mm aa"
                        className="form-control text-center"
                        calendarClassName="w-100"
                        minDate={now}
                        minTime={getMinTime(arriving)}
                        maxTime={getArrivingMaxTime()}
                      />
                    </div>
                    {/* Leaving */}
                    <div className="flex-fill bg-white rounded shadow-sm p-3 d-flex flex-column align-items-center" style={{ minWidth: 220 }}>
                      <div className="text-muted mb-2" style={{ fontWeight: 500 }}>Leaving</div>
                      <DatePicker
                        selected={leaving}
                        onChange={date => setLeaving(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd h:mm aa"
                        className="form-control text-center"
                        calendarClassName="w-100"
                        minDate={arriving || now}
                        minTime={getLeavingMinTime()}
                        maxTime={getLeavingMaxTime()}
                        maxDate={new Date(arriving.getTime() + 24 * 60 * 60 * 1000)}
                      />
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg w-100 rounded-pill fw-semibold" style={{ fontSize: '1.25rem' }}
                    onClick={handleFindParking}
                  >
                    Find Parking Spots
                  </button>
                  {/* Show event warning if any */}
                  {/* Show parking results */}
                  {/* No current location display below */}
                  {locationError && (
                    <div className="alert alert-danger mt-3 text-center">{locationError}</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="fw-bold mb-4" style={{ fontSize: '2.3rem', textAlign: 'center' }}>How ParkWise Works</h2>
          <div className="row text-center gy-5 gx-4 justify-content-center">
            <div className="col-12 col-md-4 d-flex flex-column align-items-center">
              {/* Clock Icon SVG */}
              <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: 70 }}>
                <span style={{ background: '#1976d2', borderRadius: '50%', padding: 18, display: 'inline-flex' }}>
                  <svg width="34" height="34" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 6v6l4 2" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </div>
              <h5 className="fw-bold mb-2">Save Time, Reduce Stress</h5>
              <div className="text-secondary" style={{ fontSize: '1.05rem' }}>Reduce parking availability while commuting.</div>
            </div>
            <div className="col-12 col-md-4 d-flex flex-column align-items-center">
              {/* Calendar Icon SVG */}
              <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: 70 }}>
                <span style={{ background: '#1976d2', borderRadius: '50%', padding: 18, display: 'inline-flex' }}>
                  <svg width="34" height="34" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><rect x="7" y="9" width="10" height="7" rx="2" stroke="#1976d2" strokeWidth="2"/><path d="M8 7v2M16 7v2" stroke="#1976d2" strokeWidth="2" strokeLinecap="round"/></svg>
                </span>
              </div>
              <h5 className="fw-bold mb-2">Event-Aware Forecasting</h5>
              <div className="text-secondary" style={{ fontSize: '1.05rem' }}>Rapidly push alerts anytime to relevant on-horizon time event automatically.</div>
            </div>
            <div className="col-12 col-md-4 d-flex flex-column align-items-center">
              {/* City Icon SVG */}
              <div className="mb-3 d-flex align-items-center justify-content-center" style={{ height: 70 }}>
                <span style={{ background: '#1976d2', borderRadius: '50%', padding: 18, display: 'inline-flex' }}>
                  <svg width="34" height="34" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><rect x="7" y="13" width="3" height="4" fill="#1976d2"/><rect x="14" y="10" width="3" height="7" fill="#1976d2"/><rect x="11" y="7" width="2" height="10" fill="#1976d2"/></svg>
                </span>
              </div>
              <h5 className="fw-bold mb-2">Sustainable City Mobility</h5>
              <div className="text-secondary" style={{ fontSize: '1.05rem' }}>Strick smarter, lastmile unneeding spotlight ahead.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Parking Spots section */}
      <section className="py-5" style={{ background: '#f6f6f6' }}>
        <div className="w-100 px-0">
          <div className="row g-0 bg-white rounded-4 shadow-sm align-items-center overflow-hidden mx-0" style={{ minHeight: 320, padding: '39px' }}>
            {/* Image on the left */}
            <div className="col-12 col-md-5 d-flex justify-content-center align-items-center p-0" style={{ background: '#f3f3f3' }}>
              <img src={process.env.PUBLIC_URL + '/eiffel.jpg'} alt="Eiffel Tower Paris" style={{ width: '100%', height: '100%', maxHeight: 400, objectFit: 'cover' }} />
            </div>
            {/* Text and parking list on the right */}
            <div className="col-12 col-md-7 p-4 p-md-5">
              <h2 className="fw-bold mb-2" style={{ fontSize: '2rimage.pngem', color: '#222' }}>Popular Parking Spots</h2>
              <div className="mb-3" style={{ fontSize: '1.15rem', color: '#444' }}>
                Enjoy the convenience of booking a parking spot at the venue ahead of time, ensuring you have a space when you arrive for games, concerts, and more.
              </div>
              <div className="mb-4" style={{ maxWidth: 400 }}>
                {(Array.isArray(popularSpots) ? popularSpots : []).map(spot => (
                  <div key={spot.facilityid || spot.id}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${spot.latitude},${spot.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block mb-3 fw-semibold text-primary"
                      style={{ fontSize: '1.15rem', textDecoration: 'underline' }}
                    >
                      {spot.nom_parking || spot.name}
                    </a>
                  </div>
                ))}
              </div>
              <Link to="/all-parking" className="btn btn-primary btn-lg rounded-pill fw-semibold px-5" style={{ fontSize: '1.15rem' }}>
                View All Parking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add the map here */}
      <div style={{
        width: '100%',
        // maxWidth: 1200,
        margin: '32px auto',
        background: '#e9f5ff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: 0
      }}>
        <div style={{ width: '100%', height: 400 }}>
          <ParkingMap spots={Array.isArray(popularSpots) ? popularSpots.filter(
            spot => spot.latitude !== undefined && spot.longitude !== undefined &&
                    !isNaN(Number(spot.latitude)) && !isNaN(Number(spot.longitude))
          ) : []} />
        </div>
      </div>
      {/* No current location display below */}
      {locationError && (
        <div className="alert alert-danger mt-3 text-center">{locationError}</div>
      )}
    </div>
  );
}

export default Home; 


