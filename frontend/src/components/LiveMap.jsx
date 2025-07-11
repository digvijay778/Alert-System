// frontend/src/components/LiveMap.jsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- THE FIX IS HERE ---
// 1. Import the icon assets using modern ES Module 'import' statements.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// 2. Fix the default marker icon by assigning the imported assets.
// This replaces the broken 'require()' calls.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


const LiveMap = ({ alerts }) => {
  const defaultPosition = [20.5937, 78.9629]; // Default center for the map

  return (
    <div className="relative z-0 h-96 w-full rounded-lg shadow-md">
      <MapContainer 
        center={defaultPosition} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {alerts.map((alert) => (
          alert.location && alert.status === 'pending' && (
            <Marker 
              key={alert._id} 
              position={[alert.location.latitude, alert.location.longitude]}
            >
              <Popup>
                <strong>Message:</strong> {alert.message}<br />
                <strong>Status:</strong> {alert.status}<br />
                <strong>Time:</strong> {new Date(alert.timestamp).toLocaleTimeString()}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
