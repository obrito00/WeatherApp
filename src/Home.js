import React from 'react';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import CurrentLocationButton from './CurrentLocationButton';

function Home() {
    const navigate = useNavigate();
  
    const handleCitySearch = (suggestion) => {

      const queryParts = [
        suggestion.name,
        suggestion.state,
        suggestion.country
      ].filter(Boolean).map(encodeURIComponent).join(',');
      navigate(`/weather?q=${queryParts}`);
      console.log('Checking the suggestion:', suggestion);
      
    };
  
    return (
      <div className="center-paragraph">
        <h1>Daily Weather</h1>
        <div className="search-bar-container">
        <SearchBar onSearch={handleCitySearch} isInHeader={false} />
      </div>
        <div className="current-location-button-container">
        <CurrentLocationButton />
      </div>
      </div>
    );
  }

export default Home;