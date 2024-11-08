/* eslint-disable no-unused-vars */
import { useUser } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { isSignedIn } = useUser();
  return (
    <div className="flex flex-col items-center mx-8 md:mx-16 my-10 space-y-8 mt-3">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="font-bold text-2xl md:text-4xl text-center mb-4">
          Welcome to <span className="text-fuchsia-500">Yare</span>!
        </h1>
        <p className="text-center w-[90%] md:w-[600px] mx-auto text-slate-600 text-xl font-semibold ">
          Discover a seamless way to recruit and collaborate with talented individuals. 
          Join Yare today and bring your project ideas to life with the perfect team by your side.
        </p>
      </section>

      <img src="/hero.svg" className="w-[80%] md:w-[50%] max-w-md my-3" alt="Collaboration illustration" />

      {/* CTA Button */}
      <div>
        {!isSignedIn ? (
          <Link to={"/login"}>
            <button className="px-8 py-3 text-sm font-medium text-black border border-fuchsia-500 rounded-lg transition hover:bg-fuchsia-500 hover:text-white text-xl">
              Get started with Yare
            </button>
          </Link>
        ) : (
          <Link to="/projects">
            <button className="px-8 py-3 text-sm font-medium text-black border border-fuchsia-500 rounded-lg transition hover:bg-fuchsia-500 hover:text-white">
              Join the crew!
            </button>
          </Link>
        )}
      </div>

      {/* Features Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <img src="/idea.jpg" alt="Post Projects" className="h-48 w-48 rounded-md" />
          <h3 className="font-semibold text-xl text-fuchsia-500">Post Projects</h3>
          <p className="text-slate-500 text-base md:w-4/5">
            Anyone can post their project ideas with details to attract collaborators.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <img src="/recruit.png" alt="Recruit Students" className="h-48 w-48 rounded-md object-cover" />
          <h3 className="font-semibold text-xl text-fuchsia-500">Recruit Team</h3>
          <p className="text-slate-500 text-base md:w-4/5">
            Find and recruit people interested in joining your project based on their skills and interests.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <img src="/collab.png" alt="Collaborate Easily" className="h-48 w-48 rounded-md " />
          <h3 className="font-semibold text-xl text-fuchsia-500">Collaborate Easily</h3>
          <p className="text-slate-500 text-base md:w-4/5">
            Collaborate seamlessly with your team, sharing updates, files, and feedback in one place.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-16 text-center w-full bg-fuchsia-50 py-10 rounded-lg shadow-sm">
        <h3 className="text-2xl font-semibold mb-6 text-fuchsia-500">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-slate-600">
              "Yare has been a game-changer for me! I found an amazing team to bring my project to life. Highly recommend!"
            </p>
            {/* <p className="font-semibold mt-4">- Alex J.</p> */}
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-slate-600">
              "The recruitment feature on Yare helped me join projects that matched my interests and skills perfectly."
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-slate-600">
              "Collaborating has never been easier! Yare’s platform made managing project tasks and communication a breeze."
            </p>
            {/* <p className="font-semibold mt-4">- Michael T.</p> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
