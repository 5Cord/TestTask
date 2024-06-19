import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CarDetailPage from './pages/CarDetail';
import CarList from './features/CarList';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CarList />} />
        <Route path="/car/:id" element={<CarDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
