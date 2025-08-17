import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Repo from './Components/Repo';

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      <Route path="/repo/:repoid" element={<Repo />} />
      </Routes>
  
  );
};

export default App;