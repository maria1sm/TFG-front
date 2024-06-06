// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { AuthProvider as AppContext } from './AppContext';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Home from './components/Home';
import Callback from './components/Callback';
import './App.css'

function App() {
  return (
    <AppContext>
      <Router>
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




// App.js
/*import React from 'react';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
function App() {
  return (
    <div>
      {isLoggedIn ? (
        <Home />
      ) : (
        <Login />
      )}
    </div>
  );
}
export default App;*/
