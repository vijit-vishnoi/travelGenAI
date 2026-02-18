import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { DayPlan } from './types';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  days: DayPlan[];
}

export default function TripMap({ days }: Props) {
 
  const allPoints = days.flatMap(day => 
    day.activities
      .filter(act => act.geo && act.geo.lat !== 0 && act.geo.lng !== 0)
      .map(act => ({
        ...act,
        day: day.day_number,
        position: [act.geo.lat, act.geo.lng] as [number, number]
      }))
  );

  if (allPoints.length === 0) return null;

  const center = allPoints[0].position;

  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {allPoints.map((point, idx) => (
          <Marker key={idx} position={point.position}>
            <Popup>
              <strong>Day {point.day}: {point.title}</strong><br/>
              {point.location}
            </Popup>
          </Marker>
        ))}

        <Polyline positions={allPoints.map(p => p.position)} color="#4f46e5" weight={4} opacity={0.7} />
      </MapContainer>
    </div>
  );
}