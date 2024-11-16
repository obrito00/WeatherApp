import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import WeatherDetails from './WeatherDetails';
import ForecastDetails from './ForecastDetails';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
      <Header /> 
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<WeatherDetails />} />
          <Route path="/forecast" element={<ForecastDetails />} />
        </Routes>
        </main>

        <Footer />
      </Router>
    </div>
  ); 
}

export default App;
