/* eslint-disable no-unused-vars */
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const {isSignedIn}= useUser()
  return (
    <div className="flex flex-col mx-16 items-center gap-2">
      <h2 className="font-bold text-2xl text-center">
        Welcome to <span className="text-fuchsia-500">Yare</span>!
      </h2>
      <p className="text-center w-[450px] max-sm:w-full text-slate-500">
        Discover a seamless way to recruit and collaborate with talented
        individuals on your projects. Join Yare today and turn
        your project ideas into reality with the perfect team by your side.
      </p>
      <img src="/hero.svg" className="w-[50%]"/>
        {!isSignedIn ? <Link to={"/login"}>
        <button className="block px-8 py-3 text-sm font-medium text-black transition focus:outline-none border rounded-lg border-fuchsia-500 hover: bg-fuchsia-500 hover: text-white">
        Get started with Yare
        </button>
        </Link> : <Link to="/projects">
        <button className="block px-8 py-3 text-sm font-medium text-black transition focus:outline-none border rounded-lg border-fuchsia-500 hover: bg-fuchsia-500 hover: text-white">
        Join the crew!
        </button>
        </Link>}
    </div>
  );
};

export default Hero;
