import { useState } from 'react';
import axios from 'axios';
import { Plane, Map, Sparkles, Calendar, Plus, X } from 'lucide-react'; 
import ItineraryDisplay from './ItineraryDisplay';
import type { Itinerary } from './types';
import './App.css';

function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState('');

  const [budget, setBudget] = useState('Moderate');
  const [travelers, setTravelers] = useState('Couple');
  
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const removeInterest = (toRemove: string) => {
    setInterests(interests.filter(i => i !== toRemove));
  };

  const handleGenerate = async () => {
    if (!destination || !startDate || !endDate) {
      setError('Please fill in destination and dates.');
      return;
    }
    
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await axios.post('http://localhost:4000/api/generate', {
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        travelers,
        interests
      });
      setItinerary(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to generate itinerary. Is the backend running?');
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
              <Map size={32} color="white" strokeWidth={2.5} />
              <Plane size={18} color="white" className="plane-overlay" fill="white" />
            </div>
            <h1>TravelGen <span className="highlight">AI</span></h1>
          </div>
          <p className="subtitle"><Sparkles size={16} className="sparkle-icon" /> Your smart AI travel planner</p>
        </header>

        <div className="search-card">
          <div className="input-group full-width">
            <label>Destination</label>
            <input 
              type="text" 
              placeholder="e.g. Kyoto, Paris" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div className="date-row">
            <div className="input-group">
              <label><Calendar size={16}/> Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="input-group">
              <label><Calendar size={16}/> End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="options-row">
            <div className="input-group">
              <label>Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="Low">Low (Backpacker)</option>
                <option value="Moderate">Moderate</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="input-group">
              <label>Travelers</label>
              <select value={travelers} onChange={(e) => setTravelers(e.target.value)}>
                <option value="Solo">Solo</option>
                <option value="Couple">Couple</option>
                <option value="Family">Family</option>
                <option value="Friends">Friends</option>
              </select>
            </div>
          </div>

          <div className="interests-section">
            <label>Specific Interests</label>
            <div className="interest-input-wrapper">
              <input 
                type="text" 
                placeholder="✨ Add interests like Hiking, Anime, Vegan"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addInterest()}
              />
              <button className="add-btn" onClick={addInterest}>
                <Plus size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="tags-container">
              {interests.map(int => (
                <span key={int} className="interest-tag">
                  {int}
                  <button onClick={() => removeInterest(int)}><X size={12}/></button>
                </span>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={handleGenerate} disabled={loading}>
            {loading ? 'Designing Your Trip...' : 'Plan My Itinerary ✈️'}
          </button>
        </div>
      </div>
      
      {error && <div className="error-msg">{error}</div>}
      
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Planning you perfect trip to <strong>{destination}</strong>...</p>
        </div>
      )}

      {itinerary && <div className="result-fade-in"><ItineraryDisplay data={itinerary} /></div>}
    </div>
  );
}

export default App;