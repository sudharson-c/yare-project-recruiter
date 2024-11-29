// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || id === "undefined") {
      navigate("/");
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/users/${id}`);
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
    navigate(-1);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-gray-100">
      <button
        className="bg-fuchsia-500 text-white hover:bg-fuchsia-600 px-5 py-2 mb-5 rounded-lg transition-all shadow-md"
        onClick={handleBack}
      >
        Back
      </button>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {userProfile.avatar && (
          <img
            src={userProfile.avatar}
            alt={`${userProfile.firstName}'s avatar`}
            className="w-48 h-48 rounded-full shadow-md border-4 border-fuchsia-500"
          />
        )}
        <div className="flex flex-col text-lg space-y-4 w-full">
          <div className="flex gap-3 items-center">
            <strong className="text-gray-600">Name:</strong>
            <p className="text-gray-800">
              {userProfile.firstName} {userProfile.lastName}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-gray-600">Email:</strong>
            <p className="text-gray-800">{userProfile.email}</p>
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-gray-600">Role:</strong>
            <p className="text-gray-800">{userProfile.role}</p>
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-gray-600">Created At:</strong>
            <p className="text-gray-800">
              {new Date(userProfile.createdAt).toDateString()}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <strong className="text-gray-600">Contact:</strong>
            <p className={userProfile.phone ? "text-gray-800" : "text-red-500"}>
              {userProfile.phone ? userProfile.phone : "Not Available"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
