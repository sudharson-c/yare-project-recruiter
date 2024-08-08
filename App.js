// src/App.js
import React from 'react';
import UserProfile from './UserProfile';
import './index.css'; // Ensure this is imported

function App() {
  return (
    <div className="App bg-gray-100 min-h-screen flex items-center justify-center">
      <UserProfile />
    </div>
  );
}

export default App;
