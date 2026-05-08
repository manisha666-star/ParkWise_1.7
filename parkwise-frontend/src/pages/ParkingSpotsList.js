import React, { useCallback, useEffect, useRef, useState } from 'react';
import ParkingMap from '../components/ParkingMap';

const fallbackImages = [
  process.env.PUBLIC_URL + '/parking1.jpg',
  process.env.PUBLIC_URL + '/parking2.jpg',
  process.env.PUBLIC_URL + '/parking3.jpg',
  process.env.PUBLIC_URL + '/parking4.jpg'
];

const PAGE_SIZE = 5;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Utility to normalize strings (remove accents, lowercase)
function normalizeString(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function ParkingSpotsList() {
  const [spots, setSpots] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [search, setSearch] = useState('');
  const [noResults, setNoResults] = useState(false);
  const loader = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render

  // Debug: Log search value changes
  useEffect(() => {
    console.log('Search value changed:', search);
  }, [search]);

  // Debug: Log spots state changes
  useEffect(() => {
    console.log('Spots state changed:', spots.length, 'spots:', spots.map(s => s.nom_parking));
  }, [spots]);

  // Fetch spots with pagination
  const fetchSpots = useCallback(async () => {
    setLoading(true);
    const offset = page * PAGE_SIZE;
    const res = await fetch(`${BACKEND_URL}/parking-spots?limit=${PAGE_SIZE}&offset=${offset}`);
    const data = await res.json();
    const spotsArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
    if (spotsArray.length < PAGE_SIZE) setHasMore(false);
    setSpots(prev => [...prev, ...spotsArray]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    if (!isSearching) {
      fetchSpots();
    }
    // eslint-disable-next-line
  }, [page, isSearching]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading || isSearching) return;
    const observer = new window.IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [hasMore, loading, isSearching]);

  // Search functionality
  const handleSearch = async () => {
    console.log('handleSearch called with search term:', search);
    
    if (!search.trim()) {
      console.log('Empty search, resetting to normal view');
      setPage(0);
      setSpots([]);
      setHasMore(true);
      setIsSearching(false);
      setNoResults(false);
      fetchSpots();
      return;
    }
    
    setLoading(true);
    setIsSearching(true);
    setNoResults(false);
    
    try {
      // Fetch all spots (or a large enough set)
      const res = await fetch(`${BACKEND_URL}/parking-spots?limit=1000&offset=0`);
      if (!res.ok) {
        throw new Error('Failed to fetch parking spots');
      }
      
      const data = await res.json();
      console.log('Raw API response length:', Array.isArray(data) ? data.length : 'not array');
      
      const spotsArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      console.log('Processed spots array length:', spotsArray.length);
      
      if (spotsArray.length === 0) {
        console.log('No spots found in API response');
        setSpots([]);
        setNoResults(true);
        return;
      }
      
      // Log first few spots to see structure
      console.log('First 3 spots:', spotsArray.slice(0, 3).map(s => ({ 
        facilityid: s.facilityid, 
        nom_parking: s.nom_parking 
      })));
      
      const searchNorm = normalizeString(search.trim());
      console.log('Search term (normalized):', searchNorm);
      
      const filtered = spotsArray.filter(spot => {
        const name = spot.nom_parking || spot.name || spot.facility_name || spot.nom || spot.title || '';
        const address = spot.address || spot.adresse || spot.location || '';
        const description = spot.description || spot.desc || '';
        
        // Create searchable text from all fields
        const searchableText = `${name} ${address} ${description}`.toLowerCase();
        const normalizedSearchableText = normalizeString(searchableText);
        
        console.log(`Checking: "${name}" | Searchable: "${searchableText}" | Normalized: "${normalizedSearchableText}" | Includes "${searchNorm}": ${normalizedSearchableText.includes(searchNorm)}`);
        
        return normalizedSearchableText.includes(searchNorm);
      });
      
      console.log('Filtered spots count:', filtered.length, 'out of', spotsArray.length);
      console.log('Filtered spots names:', filtered.map(s => s.nom_parking));
      
      // Force a state update by creating a new array
      setSpots([...filtered]);
      setNoResults(filtered.length === 0);
      setForceUpdate(prev => prev + 1); // Force re-render
    } catch (error) {
      console.error('Search error:', error);
      setNoResults(true);
    } finally {
      setLoading(false);
      setHasMore(false); // Disable infinite scroll during search
    }
  };

  // Remove real-time search for now - only search when button is clicked
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (search.trim()) {
  //       handleSearch();
  //     } else if (isSearching) {
  //       // If search is cleared, reset to normal view
  //       setPage(0);
  //       setSpots([]);
  //       setHasMore(true);
  //       setIsSearching(false);
  //       setNoResults(false);
  //       fetchSpots();
  //     }
  //   }, 500); // Debounce search by 500ms

  //   return () => clearTimeout(timeoutId);
  // }, [search]);

  const handleClearSearch = () => {
    setSearch('');
    setNoResults(false);
    setPage(0);
    setSpots([]);
    setHasMore(true);
    setIsSearching(false);
    fetchSpots();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Left Panel: List of Parking Spots */}
      <div style={{ width: '40%', overflowY: 'auto', padding: '20px' }}>
        <h4 style={{ marginBottom: '20px', fontWeight: 700 ,color: '#0d6efd',textTransform: 'uppercase'}}>All Parking Spots</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search parking spots by name, address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              borderColor: '#ccc'
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleClearSearch}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Clear
          </button>
        </div>
        {console.log('Rendering spots:', spots.length, 'loading:', loading, 'noResults:', noResults)}
        {Array.isArray(spots) && spots.length === 0 && !loading && noResults ? (
          <div style={{ color: '#888', textAlign: 'center', margin: 32 }}>No parking found</div>
        ) : (
          spots.map((spot, idx) => (
            <div
              key={`${spot.facilityid || spot.id}-${idx}`}
              className="card mb-3 shadow-sm"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                borderRadius: 12,
                boxShadow: hovered === (spot.facilityid || spot.id)
                  ? '0 4px 16px rgba(24, 134, 255, 0.18)' : '0 2px 8px rgba(0,0,0,0.07)',
                border: hovered === (spot.facilityid || spot.id)
                  ? '2px solid #1886ff' : '1px solid #eee',
                transition: 'box-shadow 0.2s, border 0.2s',
                background: '#fff',
                cursor: 'pointer',
                minHeight: 120
              }}
              onMouseEnter={() => setHovered(spot.facilityid || spot.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <img
                src={
                  spot.image_url && spot.image_url.trim() !== ""
                    ? `${BACKEND_URL}/parking-spots/image?url=${encodeURIComponent(spot.image_url)}`
                    : fallbackImages[idx % fallbackImages.length]
                }
                alt={spot.nom_parking || spot.name}
                style={{ width: 110, height: 90, objectFit: 'cover', borderRadius: 8, marginRight: 24, flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <h5 style={{ margin: 0, marginBottom: 8 , color: 'rgb(97 107 98)'}}>{spot.nom_parking || spot.name}</h5>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${spot.latitude},${spot.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    marginTop: 4,
                    background: '#28a745',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  Directions
                </a>
              </div>
            </div>
          ))
        )}
        {loading && <div style={{ textAlign: 'center', margin: 16 }}>Loading...</div>}
        <div ref={loader} style={{ height: 1 }} />
        {spots.length > 0 && !hasMore && (
          <div style={{ textAlign: 'center', color: '#888', margin: 16 }}>No more parking spots.</div>
        )}
      </div>
      {/* Right Panel: Map */}
      <div style={{ width: '60%', height: '100%' }}>
        <ParkingMap spots={spots} />
      </div>
    </div>
  );
}

export default ParkingSpotsList; 