import React from 'react';
import { useNavigate } from 'react-router-dom';

const CurrentLocationButton = () => {
  const navigate = useNavigate();

  const handleLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Latitude:', position);
        navigate(`/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      }, (error) => {
        console.error('Error obtaining location', error);
        alert('Error obtaining location. Please ensure location services are enabled.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <button onClick={handleLocation}>Use Current Location</button>
  );
};

export default CurrentLocationButton;