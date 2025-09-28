// Navbar.jsx (updated UI, same color theme)
import React, { useState, useContext, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";
import { UserContext } from "../../../context/UserContext";
import ProfileButton from "../pages/profile/ProfileButton";

const Navbar = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const person = currentUser
    ? {
        userId: currentUser.id,
        userAvatar: currentUser.imageUrl,
        userName: `${currentUser.firstName ?? ""} ${
          currentUser.lastName ?? ""
        }`.trim(),
      }
    : null;

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Close on route change or Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  const handleAddProjectClick = () => navigate("/add-project");

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? "text-fuchsia-600 font-semibold border border-fuchsia-600 px-3 py-2 rounded-full bg-white shadow-sm"
      : "text-fuchsia-600 hover:text-fuchsia-700 px-3 py-2 rounded-full transition";

  const Buttons = () => (
    <div className="flex items-center gap-2">
      {!currentUser ? (
        <>
          <Link to="/login" onClick={closeMenu}>
            <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black focus:outline-none focus:ring-2 focus:ring-fuchsia-300">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up" onClick={closeMenu}>
            <button className="bg-white border border-fuchsia-600 text-fuchsia-600 px-4 py-2 rounded-md hover:bg-fuchsia-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-300">
              Sign Up
            </button>
          </Link>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <NavLink
            to="/projects"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            All Projects
          </NavLink>
          <NavLink
            to="/dashboard"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/kanban-board"
            className={getNavLinkClass}
            onClick={closeMenu}
          >
            Kanban Board
          </NavLink>
          <button
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
            onClick={() => {
              closeMenu();
              handleAddProjectClick();
            }}
          >
            Add your Project
          </button>
          <div className="flex items-center gap-2">
            <ProfileButton person={person} />
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop */}
            <div className="hidden sm:flex items-center">
              <Buttons />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={toggleMenu}
              className="sm:hidden inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-between">
                <span className="block h-0.5 bg-fuchsia-600"></span>
                <span className="block h-0.5 bg-fuchsia-600"></span>
                <span className="block h-0.5 bg-fuchsia-600"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`sm:hidden transition-[max-height] duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-3 py-3 border-t bg-white">
            <Buttons />
          </div>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <button
          aria-label="Close menu"
          onClick={closeMenu}
          className="fixed inset-0 z-20 bg-black/20 sm:hidden"
        />
      )}
    </>
  );
};

const Logo = () => (
  <div className="flex items-center">
    <Link
      to="/"
      className="flex items-center focus:outline-none focus:ring-2 focus:ring-fuchsia-300 rounded-md"
    >
      <img src="logo.png" alt="Logo" className="h-10 w-10 rounded-md" />
      <span className="ml-2 text-xl font-bold text-fuchsia-600">Yare</span>
    </Link>
  </div>
);

export default Navbar;
