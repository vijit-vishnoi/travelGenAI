import { useState } from 'react';
import axios from 'axios';
import { Plane, Map, Sparkles } from 'lucide-react'; 
import ItineraryDisplay from './ItineraryDisplay';
import type { Itinerary } from './types';
import './App.css';

function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [month, setMonth] = useState('Anytime');
  const [budget, setBudget] = useState('Medium');
  const [interests, setInterests] = useState<string[]>([]);
  const [travelers, setTravelers] = useState('Couple');
  const [error, setError] = useState('');
  const handleGenerate = async () => {
    if (!destination) return;
    setLoading(true);
    setError('');
    setItinerary(null);
    try {
      const response = await axios.post('http://localhost:4000/api/generate', {
        destination: destination,
        days: parseInt(days.toString()),
        month,
        budget,
        interests,
        travelers
      });
      setItinerary(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate itinerary. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app-container ${!itinerary ? 'centered-mode' : ''}`}>
      <div className="center-stack">
      <header className="hero">
      <div className="logo-container">
        <div className="logo-icon-bg">
          <Map size={28} color="white" strokeWidth={2.5} />
          <Plane size={16} color="white" className="plane-overlay" fill="white" />
        </div>
        <h1>TravelGen <span className="highlight">AI</span></h1>
      </div>
      <p className="subtitle">
        <Sparkles size={16} className="sparkle-icon" />
        Your smart AI travel planner
      </p>
      </header>

      <div className="search-box">
        <input 
          type="text" 
          placeholder="Where to? (e.g., Kyoto, Paris)" 
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} 
        />
        <div className="days-input-group">
            <label>Days:</label>
            <input 
            type="number" 
            min="1" 
            max="14" 
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            />
        </div>
        <button onClick={handleGenerate} disabled={loading}>Go
        </button>
      </div>
      </div>
      {error && <div className="error-msg">{error}</div>}
      
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Designing your perfect trip to <strong>{destination}</strong>...</p>
        </div>
      )}

      {itinerary && (
        <div className="result-fade-in">
            <ItineraryDisplay data={itinerary} />
        </div>
      )}
    </div>
  );
}

export default App;