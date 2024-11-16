import './App.css';


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const stateCodes = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
    "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
    "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
    "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
    "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
    "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
    "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
    "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY"
  };

const getStateCode = (stateName) => stateCodes[stateName] || stateName;

function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const [isInputFocused, setIsInputFocused] = useState(false);

  const API_KEY = process.env.REACT_APP_API_KEY; 

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 150); 
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=8&appid=${API_KEY}`;
    console.log('Fetching city names:', apiUrl);

    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const formattedSuggestions = data.map(item => ({
          name: item.name,
          state: item.state,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
          displayName: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`
        }));
        setSuggestions(formattedSuggestions);
      })
      .catch(err => console.error("Error fetching city names:", err));
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchInput('');
    setSuggestions([]);

    const stateCode = getStateCode(suggestion.state);

    const locationQuery = suggestion.state
        ? `${suggestion.name},${stateCode},${suggestion.country}`
        : `${suggestion.name},${suggestion.country}`;

    if (typeof onSearch === 'function') {
        onSearch({
            ...suggestion,
            state: stateCode
        });
    } else {
        const query = `q=${encodeURIComponent(locationQuery)}&appid=${API_KEY}`;
        console.log('Navigating with query:', query);
        navigate(`/weather?${query}`);
    }
};

  return (
    <div className="search-container">
      <input
        type="text"
        value={searchInput}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Enter a city"
        autoComplete="off"
      />
      {isInputFocused && suggestions.length > 0 && (
        <ul className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelectSuggestion(suggestion)} >
              {suggestion.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;