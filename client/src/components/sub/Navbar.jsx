import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { UserContext } from "../../../context/UserContext";
import ProfileButton from "../pages/profile/ProfileButton";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);
  const person = currentUser
    ? {
        userId: currentUser.id,
        userAvatar: currentUser.imageUrl,
        userName: currentUser.firstName + currentUser.lastName,
      }
    : null;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAddProjectClick = () => {
    navigate("/add-project");
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "text-fuchsia-500 font-bold border border-fuchsia-600 p-3 rounded-full"
      : "text-fuchsia-500";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const Buttons = () => (
    <div className="flex gap-2 sm:flex-row sm:items-center max-sm:flex-col max-sm:mt-8">
      {!currentUser ? (
        <>
          <Link to="/login">
            <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black w-full sm:w-auto">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="bg-white border border-fuchsia-600 text-fuchsia-600 px-4 py-2 rounded-md hover:bg-fuchsia-600 hover:text-white w-full sm:w-auto">
              Sign Up
            </button>
          </Link>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <NavLink to="/projects" className={getNavLinkClass}>
            All Projects
          </NavLink>
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>
          <button
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black"
            onClick={handleAddProjectClick}
          >
            Add your Project
          </button>
          {/* <UserButton /> */}
          <ProfileButton person={person} />
          <SignOutButton />
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="relative flex items-center justify-between p-5 bg-white shadow-sm">
        {/* Logo Section */}
        <Logo />

        {/* Hamburger Icon for mobile */}
        <button
          onClick={toggleMenu}
          className="block sm:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-between">
            <span className="block h-1 bg-fuchsia-600"></span>
            <span className="block h-1 bg-fuchsia-600"></span>
            <span className="block h-1 bg-fuchsia-600"></span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center">
          <Buttons />
        </div>
      </nav>
      {isMenuOpen && (
        <div className="top-full left-0 w-full bg-white shadow-md sm:block p-5 md:hidden">
          <br />
          <Buttons />
        </div>
      )}
    </>
  );
};

const Logo = () => (
  <div className="flex items-center">
    <Link to="/" className="flex items-center">
      <img src="logo.png" alt="Logo" className="h-10 w-10 rounded-md" />
      <span className="ml-2 text-xl font-bold text-fuchsia-600">Yare</span>
    </Link>
  </div>
);

export default Navbar;
