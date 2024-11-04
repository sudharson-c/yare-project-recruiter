// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/sub/Navbar';
import Hero from './components/sub/Hero';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUpPage from './routes/SignUpPage'
import SignInPage from './routes/SignInPage'
import axios from 'axios';
import { UserProvider } from '../context/UserContext';
import Projects from './components/pages/projects/Projects';
import AddProject from './components/pages/add-project/AddProject';
import Dashboard from './components/pages/dashboard/Dashboard'
import ProjectDetails from './components/pages/projects/ProjectDetails';
import Footer from './components/sub/Footer'
import Applications from './components/pages/applications/Applications';
import Profile from './components/pages/profile/Profile';
import ProtectedRoute from './ProtectedRoute';
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
            console.log("Success"+response.data)
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
        <div className='min-h-screen'>
          <Navbar />
          <div className="pt-6">
            <Routes>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route element={<ProtectedRoute />}>
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/add-project" element={<AddProject />} />
                  <Route path="/projects/:project_id" element={<ProjectDetails />} />
                  <Route path='/projects/:id/applications' element={<Applications />} />
                  <Route path='/users/:id' element={<Profile />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />

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
