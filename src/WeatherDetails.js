import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function WeatherDetails() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  const API_KEY = process.env.REACT_APP_API_KEY; 
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const lat = query.get('lat');
  const lon = query.get('lon');
  const q = query.get('q'); 

  useEffect(() => {
    // Fetch weather data using city name, state, and country code
    const fetchData = async () => {
      try {
        let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=imperial`;
        if (q) {
          apiUrl += `&q=${q}`;
        } else if (lat && lon) {
          apiUrl += `&lat=${lat}&lon=${lon}`;
        } else {
          throw new Error('No location information provided');
        }
  
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.cod !== 200) {
          throw new Error(`Error from API: ${data.message}`);
        }
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setError(error.toString());
      }
    };
  
    fetchData();
  }, [q, lat, lon, API_KEY]);

  
  if (error) {
    return (
      <div className='center-paragraph'>
        <h2>Location Not Found</h2>
        <p>The requested location could not be found. Please try searching again.</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  if (!weather) {
    return <div>Loading...</div>;
  }

  const visibilityInMiles = (weather.visibility * 0.000621371).toFixed(0);

  const pressureInInHg = (weather.main.pressure * 0.02953).toFixed(0);

  const temp = weather.main.temp.toFixed(0);
  


  return (
    <div className='weather-container'>
      <h2 style={{ fontSize: '6rem', color: 'white', textAlign: 'center' }}>{weather.name}</h2>
      <p style={{ fontSize: '6rem', marginTop: '-8rem', color: 'white' }}>{temp}°F</p>
      <p style={{ fontSize: '2.5rem', marginTop: '-8rem', color: 'white' }}>{weather.weather[0].description}</p>
      <div className="weather-icon" style={{ position: 'absolute', right: '27%', top: '30%', transform: 'translateY(-50%)' }}>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt="Current Weather Icon"
        style={{ width: '220px', height: '220px' }}
      />
    </div>

      <hr style={{ width: '80%', margin: '2rem auto', borderColor: 'white' }} />

      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '6rem' }}>
        <div>
          <p style={{ fontSize: '4rem', marginBottom: '0', color: 'white' }}>{weather.main.humidity}%</p>
          <p style={{ fontSize: '4rem', marginTop: '-0.5rem', color: 'white' }}>Humidity</p>
        </div>
        <div>
          <p style={{ fontSize: '4rem', marginBottom: '0', color: 'white' }}>{visibilityInMiles} MI</p>
          <p style={{ fontSize: '4rem', marginTop: '-0.5rem', color: 'white' }}>Visibility</p>
        </div>
        <div>
          <p style={{ fontSize: '4rem', marginBottom: '0', color: 'white' }}>{weather.wind.speed} Mph</p>
          <p style={{ fontSize: '4rem', marginTop: '-0.5rem', color: 'white' }}>Wind Speed</p>
        </div>
        <div>
          <p style={{ fontSize: '4rem', marginBottom: '0', color: 'white' }}>{pressureInInHg} inHg</p>
          <p style={{ fontSize: '4rem', marginTop: '-0.5rem', color: 'white' }}>Pressure</p>
        </div>
      </div>
      <button className='forecast-button'
        onClick={() => navigate(`/forecast?lat=${weather.coord.lat}&lon=${weather.coord.lon}&city=${weather.name}`)}>
        5 Day Forecast
      </button>
    </div>
  );
}

export default WeatherDetails;