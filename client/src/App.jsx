// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInPage from './routes/SignInPage';
import SignUpPage from './routes/SignUpPage';
import Footer from './components/Footer';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route
            path="/"
            element={
              isLoaded && !isSignedIn ? (
                <Hero />
              ) : isLoaded && isSignedIn ? (
                <h1>Signed in</h1>
              ) : (
                <div>Loading...</div>
              )
            }
          />
        </Routes>
          <Footer />
      </div>
    </Router>
  );
}

export default App;
