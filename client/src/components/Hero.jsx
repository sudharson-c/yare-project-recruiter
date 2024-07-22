/* eslint-disable no-unused-vars */
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-col mx-16 items-center gap-2">
      <h2 className="font-bold text-2xl text-center">
        Welcome to <span className="text-fuchsia-500">Yare</span>!
      </h2>
      <p className="text-center w-[450px] max-sm:w-full text-slate-500">
        Discover a seamless way to recruit and collaborate with talented
        individuals on your projects. Join Yare today and turn your project
        ideas into reality with the perfect team by your side.
      </p>
      <img src="/hero.svg" className="w-[50%]" />
      {!isSignedIn ? (
        <Link to={"/login"}>
          <button className="block px-8 py-3 text-sm font-medium text-black transition focus:outline-none border rounded-lg border-fuchsia-500 hover: bg-fuchsia-500 hover: text-white">
            Get started with Yare
          </button>
        </Link>
      ) : (
        <Link to="/projects">
          <button className="block px-8 py-3 text-sm font-medium text-black transition focus:outline-none border rounded-lg border-fuchsia-500 hover: bg-fuchsia-500 hover: text-white">
            Join the crew!
          </button>
        </Link>
      )}
      <div className="features mt-8 flex justify-between ">
        <div className="feature-item flex flex-col items-center gap-4 flex-wrap">
          <img
            src="/feature.png"
            className="feature-image w-[45%]"
            alt="Post Projects"
          />
          <p className="feature-text w-[45%] text-slate-500">
            Students can post their project ideas and provide details to attract
            interested collaborators.
          </p>
        </div>
        <div className="feature-item flex flex-col items-center gap-4 flex-wrap">
          <img src="/feature.png" className="feature-image w-[45%] order-1 md:order-2" alt="Recruit Students" />
          <p className="feature-text w-[45%] text-slate-500 order-2 md:order-1">
            Find and recruit students who are interested in joining your project
            based on their skills and interests.
          </p>
        </div>
        <div className="feature-item flex flex-col items-center gap-4 flex-wrap">
          <img
            src="/feature.png"
            className="feature-image w-[45%]"
            alt="Collaborate Easily"
          />
          <p className="feature-text w-[45%] text-slate-500">
            Collaborate seamlessly with your team, sharing updates, files, and
            feedback in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
