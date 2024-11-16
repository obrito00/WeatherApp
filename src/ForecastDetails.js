import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

function ForecastDetails() {
  const [forecastData, setForecastData] = useState([]);
  const [cityInfo, setCityInfo] = useState(null); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_KEY = process.env.REACT_APP_API_KEY; 

  const query = new URLSearchParams(location.search);
  const lat = query.get('lat');
  const lon = query.get('lon');

  useEffect(() => {
    if (lat && lon) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
      console.log('Checking the apiUrl:', apiUrl);
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (!data.list) {
            setError('Forecast data not found');
            return;
          }
          setCityInfo(data.city); 

          // finding the min and max temperature for each day
          const tempByDay = data.list.reduce((acc, item) => {
            const date = item.dt_txt.split(' ')[0];
            if (!acc[date]) {
              acc[date] = { minTemp: item.main.temp_min, maxTemp: item.main.temp_max, icon: item.weather[0].icon, dt_txt: item.dt_txt };
            } else {
              acc[date].minTemp = Math.min(acc[date].minTemp, item.main.temp_min);
              acc[date].maxTemp = Math.max(acc[date].maxTemp, item.main.temp_max);
              
              if (acc[date].maxTemp === item.main.temp_max) {
                acc[date].icon = item.weather[0].icon;
                acc[date].dt_txt = item.dt_txt; 
              }
            }
            return acc;
          }, {});

          const processedData = Object.keys(tempByDay)
            .map(date => ({
              ...tempByDay[date],
              date: new Date(tempByDay[date].dt_txt).toISOString() 
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)) 
            .slice(0, 5); 

          setForecastData(processedData);
        })
        .catch(error => setError(error.toString()));
    }
  }, [lat, lon, API_KEY]);

  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    return dayOfWeek;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!cityInfo || forecastData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', marginTop: '1rem' }}>
      <h2 style={{ fontSize: '6rem', marginTop: '1rem' }}>{cityInfo.name}'s</h2>
      <h3 style={{ fontSize: '6rem' }}>5 Day Forecast</h3>
      <button className="back-button" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faAngleLeft} />  </button>

      <div className="forecast-container">
        {forecastData.map((forecast, index) => {
          return (
            <div key={index} className="forecast-day">
              <div style={{ fontSize: '3.5rem' }}>{getDayOfWeek(forecast.dt_txt)}</div>
              <img
                src={`https://openweathermap.org/img/wn/${forecast.icon}.png`}
                alt="Weather icon"
                style={{ width: '140px', height: '140px' }} 
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                <div style={{ fontSize: '43px' }}>High: {forecast.maxTemp.toFixed(0)}°F</div>
                <div style={{ marginLeft: '10px', fontSize: '43px' }}>Low: {forecast.minTemp.toFixed(0)}°F</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ForecastDetails;