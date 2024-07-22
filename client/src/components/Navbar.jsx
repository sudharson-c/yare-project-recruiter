// Navbar.js
// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { UserContext } from '../../context/UserContext';

const Navbar = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAddProjectClick = () => {
    navigate("/add-project");
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "text-fuchsia-500 font-bold border border-fuchsia-600 p-3 rounded-full" : "text-fuchsia-500";
  };

  const Buttons = () => {
    return (
      <div className="flex gap-2 max-sm:flex-col max-sm:mt-8 max-sm:w-[80%]">
        {!currentUser ? (
          <>
            <Link to="/login">
              <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black max-sm:w-full">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="bg-white border border-fuchsia-600 text-fuchsia-600 px-4 py-2 rounded-md hover:bg-fuchsia-600 hover:text-white max-sm:w-full">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink to="/projects" className={getNavLinkClass}>
              All Projects
            </NavLink>
            <NavLink to="/dashboard" className={getNavLinkClass}>
              Dashboard
            </NavLink>
            <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black" onClick={handleAddProjectClick}>
              Add your Project
            </button>
            <UserButton />
            <p>{currentUser.fullName}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex m-5 max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col shadow-sm p-[5px] bg-white z-10">
      <Logo />
      <Buttons />
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex gap-2 items-center">
      <Link to="/" className="flex items-center">
        <img src="logo.png" alt="Logo" className="p-[6px] rounded-md h-[50px] w-[50px]" />
        <div className="flex gap-1 text-[19px]">
          <span className="font-bold text-fuchsia-600 text-xl">Yare</span>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;
