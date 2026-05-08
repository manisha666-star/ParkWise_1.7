import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Forecast from './pages/Forecast';
import Home from './pages/Home';
import Login from './pages/Login';
import MonitorParking from './pages/MonitorParking';
import ParkingDetail from './pages/ParkingDetail';
import ParkingList from './pages/ParkingList';
import ParkingSpotsList from './pages/ParkingSpotsList';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/parking-list" element={<ParkingList />} />
            <Route path="/all-parking" element={<ParkingSpotsList />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/monitor-parking" element={<MonitorParking />} />
            <Route path="/parking-detail/:id" element={<ParkingDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
