import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="h-[38rem] flex flex-col items-center py-10">
      <button
        className="bg-fuchsia-500 text-white hover:bg-white hover:text-black hover:border hover:border-fuchsia-500 px-5 py-2 mb-5 rounded-lg transition-all"
        onClick={handleBack}
      >
        Back
      </button>
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 bg-white shadow-lg rounded-lg p-8 max-w-4xl">
        {userProfile.avatar && (
          <img
            src={userProfile.avatar}
            alt={`${userProfile.firstName}'s avatar`}
            className="w-48 h-48 rounded-full shadow-md"
          />
        )}
        <div className="flex flex-col text-lg space-y-4">
          <div className="flex gap-3">
            <strong className="text-gray-700">Name:</strong>
            <p>{userProfile.firstName} {userProfile.lastName}</p>
          </div>
          <div className="flex gap-3">
            <strong className="text-gray-700">Email:</strong>
            <p>{userProfile.email}</p>
          </div>
          <div className="flex gap-3">
            <strong className="text-gray-700">Role:</strong>
            <p>{userProfile.role}</p>
          </div>
          <div className="flex gap-3">
            <strong className="text-gray-700">Created At:</strong>
            <p>{new Date(userProfile.createdAt).toDateString()}</p>
          </div>
          <div className="flex gap-3">
            <strong className="text-gray-700">Contact:</strong>
            <p className={userProfile.phone ? "" : "text-red-500"}>
              {userProfile.phone ? userProfile.phone : "Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
