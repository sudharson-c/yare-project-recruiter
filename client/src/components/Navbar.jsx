// eslint-disable-next-line no-unused-vars
import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isLoaded, isSignedIn } = useUser();

  const Buttons = () => {
    return (
      <div className="flex gap-2 max-sm:flex-col max-sm:mt-8 max-sm:w-[60%]">
        {!isSignedIn ? (
          <>
            <Link to="/login">
              <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black">
                Sign In
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="bg-white border border-fuchsia-600 text-fuchsia-600 px-4 py-2 rounded-md hover:bg-fuchsia-600 hover:text-white">
                Sign Up
              </button>
            </Link>
          </>
        ) : (<>
          <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:text-black">
            Add your Project
          </button>
          <UserButton />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex m-5 max-sm:mt-9 mx-8 items-center justify-between max-sm:flex-col shadow-sm p-[5px]">
      <Logo />
      {isLoaded ? <Buttons /> : <p>Loading...</p>}
    </div>
  );
};

const Logo = () => {
  return (
    <div className="flex gap-2 items-center">
      <img src="/logo.png" alt="Logo" className="p-[6px] rounded-md" />
      <div className="flex gap-1 text-[19px]">
        <span className="font-bold text-fuchsia-600 text-xl"><Link to="/">Yare</Link></span>
      </div>
    </div>
  );
};

export default Navbar;
