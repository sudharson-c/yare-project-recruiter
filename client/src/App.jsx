// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignInPage from './routes/SignInPage';
import SignUpPage from './routes/SignUpPage';
import Footer from './components/Footer';
import Projects from './components/Projects';
import Dashboard from './components/Dashboard';
import AddProject from './components/AddProject';
import ProjectDetails from './components/ProjectDetails';
import { UserProvider } from '../context/UserContext';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <UserProvider>
      <Router>
        <div>
          <Navbar />
          <div className="pt-6">
            <Routes>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              
              {isSignedIn ? (
                <>
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-project" element={<AddProject />} />
                  <Route path="/projects/:project_id" element={<ProjectDetails />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" replace />} />
              )}

              <Route
                path="/"
                element={
                  isLoaded ? (
                    isSignedIn ? (
                      <Navigate to="/projects" replace />
                    ) : (
                      <Hero />
                    )
                  ) : (
                    <div>Loading...</div>
                  )
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
