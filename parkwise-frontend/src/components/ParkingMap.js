import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// Fix default icon issue with Leaflet in React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function ParkingMap({ spots, selectedSpot }) {
  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const defaultCenter = [48.8566, 2.3522]; // Paris center
  const defaultZoom = 13;

  // Defensive: Only use valid spots
  const validSpots = (spots || []).filter(
    spot =>
      spot.latitude !== undefined &&
      spot.longitude !== undefined &&
      !isNaN(Number(spot.latitude)) &&
      !isNaN(Number(spot.longitude))
  );

  const center = validSpots.length > 0
    ? [validSpots[0].latitude, validSpots[0].longitude]
    : defaultCenter;

  useEffect(() => {
    if (
      selectedSpot &&
      selectedSpot.latitude !== undefined &&
      selectedSpot.longitude !== undefined &&
      !isNaN(Number(selectedSpot.latitude)) &&
      !isNaN(Number(selectedSpot.longitude)) &&
      markerRefs.current[selectedSpot.id]
    ) {
      markerRefs.current[selectedSpot.id].openPopup();
      if(mapRef.current){
        mapRef.current.flyTo([selectedSpot.latitude, selectedSpot.longitude], 15);
      }
    }
  }, [selectedSpot]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer 
        ref={mapRef}
        center={center} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validSpots.map(spot => (
          <Marker 
            key={spot.id || spot.facilityid} 
            position={[Number(spot.latitude), Number(spot.longitude)]}
            ref={el => markerRefs.current[spot.id || spot.facilityid] = el}
          >
            <Popup>
              <b>{spot.name || spot.nom_parking}</b>
              <br />
              {spot.rating && <>Rating: {spot.rating}<br /></>}
              {spot.free_places !== undefined && <>Free Spaces: {spot.free_places}<br /></>}
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${spot.latitude},${spot.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', fontWeight: 600, textDecoration: 'underline' }}
              >
                Directions
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
} 