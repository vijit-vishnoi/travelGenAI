import type { Itinerary } from './types';
import { MapPin, Clock, Wallet, Shield, CloudSun, Briefcase, Utensils } from 'lucide-react'; 
import TripMap from './TripMap'; // <--- Import the Map

interface Props {
  data: Itinerary;
}

export default function ItineraryDisplay({ data }: Props) {
  const { meta_info } = data;

  return (
    <div className="itinerary-container">
      
      {/* Header */}
      <div className="trip-header">
        <h2 className="trip-title">{data.trip_title}</h2>
        <div className="trip-badges">
           <span className="badge dest">📍 {data.destination}</span>
           <span className="badge time">📅 {data.duration} Days</span>
           <span className="badge cost">💰 {data.total_price}</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* ... (Keep your existing cards: Safety, Weather, Packing, Culture) ... */}
        <div className="info-card safety">
          <div className="card-title"><Shield size={18}/> Safety & Emergency</div>
          <div className="card-content">
            <p><strong>📞 Help:</strong> {meta_info.safety_info.indian_embassy}</p>
            <p><strong>🚑 Emergency:</strong> {meta_info.safety_info.emergency_numbers}</p>
          </div>
        </div>

        <div className="info-card weather">
          <div className="card-title"><CloudSun size={18}/> Need to Know</div>
          <div className="card-content">
             <p><strong>Forecast:</strong> {meta_info.weather_summary}</p>
             <p><strong>Currency:</strong> {meta_info.currency_rate}</p>
          </div>
        </div>

        <div className="info-card packing">
          <div className="card-title"><Briefcase size={18}/> Packing List</div>
          <ul className="compact-list">
            {meta_info.packing_list.slice(0, 5).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="info-card culture">
          <div className="card-title"><Utensils size={18}/> Local Gems</div>
          <div className="card-content">
             <p><strong>Must Eat:</strong> {meta_info.must_try_food.slice(0,3).join(", ")}</p>
             <div className="lang-chips">
               {Object.entries(meta_info.language_tips || {}).slice(0,3).map(([key, val]) => (
                 <span key={key} className="lang-chip">{key}: <i>{val}</i></span>
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="map-section">
        <h3 className="section-title">🗺️ Trip Route</h3>
        <TripMap days={data.days} />
      </div>

      <div className="days-timeline">
        {data.days.map((day) => (
          <div key={day.day_number} className="day-card">
            <div className="day-header">
              <span className="day-num">Day {day.day_number}</span> 
              <span className="day-date">{day.date}</span>
            </div>
            <div className="day-theme">{day.theme}</div>
            
            <div className="activities-list">
              {day.activities.map((activity, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-header">
                    <div className="time-badge"><Clock size={14} /> {activity.time}</div>
                    <div className="price-badge"><Wallet size={14} /> {activity.price}</div>
                  </div>
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-desc">{activity.description}</p>
                  <div className="location-row"><MapPin size={16} /> {activity.location}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}