// eslint-disable-next-line no-unused-vars
import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard Page</h1>
      {console.log(window.localStorage.getItem("user"))}
      <p>All your projects!</p>
    </div>
  );
};

export default Dashboard;
