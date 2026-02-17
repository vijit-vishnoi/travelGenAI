import type{ Itinerary } from './types';
import { MapPin, Clock } from 'lucide-react'; 

interface Props {
  data: Itinerary;
}

export default function ItineraryDisplay({ data }: Props) {
  return (
    <div className="itinerary-container">
      <h2 className="trip-title">{data.trip_title}</h2>
      <div className="trip-meta">
        <span>📍 {data.destination}</span>
        <span>📅 {data.duration} Days</span>
        <span>💰 {data.budget_tag}</span>
      </div>

      <div className="days-grid">
        {data.days.map((day) => (
          <div key={day.day_number} className="day-card">
            <h3 className="day-header">
              Day {day.day_number}: {day.theme}
            </h3>
            
            <div className="activities-list">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="time-badge">
                    <Clock size={14} /> {activity.time}
                  </div>
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-desc">{activity.description}</p>
                  <div className="location-tag">
                    <MapPin size={14} /> {activity.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}