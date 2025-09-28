// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./components/sub/Navbar";
import Hero from "./components/sub/Hero";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignUpPage from "./routes/SignUpPage";
import SignInPage from "./routes/SignInPage";
import { UserProvider } from "../context/UserContext";
import Projects from "./components/pages/projects/Projects";
import AddProject from "./components/pages/add-project/AddProject";
import Dashboard from "./components/pages/dashboard/Dashboard";
import ProjectDetails from "./components/pages/projects/ProjectDetails";
import Footer from "./components/sub/Footer";
import Applications from "./components/pages/applications/Applications";
import Profile from "./components/pages/profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import GetMoreDetails from "./routes/GetMoreDetails";
import KanbanBoard from "./components/pages/kanban/KanbanBoard";

const App = () => {
  const { isSignedIn, user } = useUser();

  return (
    <UserProvider>
      <Router>
        <div className="min-h-[95vh]">
          <Navbar />
          <div className="w-full text-center text-gray-400 bg-gray-100">
            This is a beta version✨
          </div>
          <div className="pt-6">
            <Routes>
              <Route path="/login" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/" element={<Hero />} />
              <Route path="/get-more-details" element={<GetMoreDetails />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/projects" element={<Projects />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/add-project" element={<AddProject />} />
                <Route
                  path="/projects/:project_id"
                  element={<ProjectDetails />}
                />
                <Route path="/kanban-board" element={<KanbanBoard />} />
                <Route
                  path="/projects/:id/applications"
                  element={<Applications />}
                />
                <Route path="/users/:id" element={<Profile />} />
              </Route>

              {/* Catch-all route for unknown paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
