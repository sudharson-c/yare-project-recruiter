// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { UserContext, UserProvider } from '../context/UserContext';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import SignInPage from './routes/SignInPage';
import SignUpPage from './routes/SignUpPage';
import Footer from './components/Footer';
import Projects from './components/Projects';
import Dashboard from './components/Dashboard';
import AddProject from './components/AddProject';
import ProjectDetails from './components/ProjectDetails';
import axios from 'axios';
// import { fireDb } from '../../backend/config/firebase';

const App = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  // const { login } = useContext(UserContext);
  // const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && user) {
      console.log("User is signed in", user); // Debugging log

      const userDetails = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.imageUrl,
        phone: user.primaryPhoneNumber,
        username: user.username,
        createdAt: new Date().toISOString(),
        projectIds : [],
      };

      const sendUserDetails = async () => {
        try {
          await axios.post("http://localhost:5000/users", userDetails).then((response)=>{
            console.log("Succes"+response.data)
          });

        } catch (error) {
          console.error('Error sending user details to server:', error.message);
        }
      };
      sendUserDetails();
    }
  }, [isSignedIn, user]);

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
};

export default App;
