import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetMoreDetails = () => {
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const LabelInputContainer = ({ children, className }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-up");
    }
  }, [isSignedIn, user]);

  const handleSubmit = () => {
    if (isSignedIn && user) {
      const userDetails = {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.imageUrl,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: role,
      };

      const sendUserDetails = async () => {
        try {
          await axios.post(`${process.env.API_URL}/users`, userDetails);
          navigate("/projects");
        } catch (error) {
          console.error("Error sending user details to server:", error.message);
        }
      };
      sendUserDetails();
    }
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white p-5 text-2xl">
      <h2 className="font-bold text-3xl pt-10 text-center">
        Welcome to <span className="font-serif">Yare!</span>
      </h2>

      <p className="text-center p-3 text-lg">Enter few more details...</p>
      <div className="p-5">
        <label htmlFor="role" className="">
          Role:
        </label>
        <input
          type="text"
          name="role"
          id="role"
          placeholder="Enter your role..."
          className="w-full p-3 rounded-md border border-gray-400"
          onChange={(e) => setRole(e.target.value)}
        />
        <center>
          <button
            onClick={handleSubmit}
            className="border rounded-lg border-black py-1 px-3 mt-5 hover:bg-black hover:text-white text-xl"
          >
            Proceed
          </button>
        </center>
      </div>
    </div>
  );
};

export default GetMoreDetails;
