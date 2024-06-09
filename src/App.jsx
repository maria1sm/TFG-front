// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { AuthProvider as AppContext } from './AppContext';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Home from './components/Home';
import Callback from './components/Callback';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AppContext>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/callback" element={<Callback />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AppContext>
  );
}

export default App;
