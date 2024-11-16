import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import './App.css';

function Header({ onSearch }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; 

  return (
    <header className="header">
  <div className="logo-container">
    <h1><a href="/">DW</a></h1>
  </div>

  <div className="search-container-center">
  {!isHomePage && <SearchBar onSearch={onSearch} isInHeader={true} />}
  </div>
  
</header>
  );
}

export default Header;