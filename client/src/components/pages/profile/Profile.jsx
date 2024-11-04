// eslint-disable-next-line no-unused-vars
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
        console.log(id);
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        console.log(response.data);
        setUserProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <p>Loading profile...</p>;
  const handleBack =()=>{
    window.history.back();
  }
  return (
    <>
      <button className='bg-fuchsia-500 text-white hover:bg-white hover:text-black hover:border-fuchsia-500 p-3 rounded-md' onClick={handleBack}>Back</button>
    <div className="flex items-center justify-center">
        <div className="container flex justify-between gap-10 items-center border border-black rounded-lg w-max h-max py-4 px-7">
      <div>
        {userProfile.avatar && <img src={userProfile.avatar} alt={`${userProfile.firstName}'s avatar` } height={350} width={350} className="mt-10 "/>}
        </div>
            <div className="text-xl flex flex-col justify-around">
                <div className="flex gap-5">
                <strong>Name:</strong>
                <p>{userProfile.firstName} {userProfile.lastName}</p>
                </div>
                <div className="flex gap-5">
                <strong>Email:</strong>
                <p>{userProfile.email}</p>
                </div>
                <div className="flex gap-5">
                <strong>Role:</strong>
                <p>{userProfile.role}</p>
                </div>
                <div className="flex gap-5">
                <strong>Created at:</strong>
                <p>{new Date(userProfile.createdAt).toDateString()}</p>
                </div>
                <div className="flex gap-5">
                <strong>Contact:</strong>
                <p className={userProfile.phone?"":"text-red-500"}>{userProfile.phone ? userProfile.phone : "Not Available"}</p>
                </div>

            </div>
      
      {/* <h3>Projects Involved:</h3>
      {userProfile.projectIds.length > 0 ? (
        <ul>
        {userProfile.projectIds.map((project) => (
            <li key={project._id}>
            <h4>{project.project_name}</h4>
            <p>{project.project_desc}</p>
            </li>
            ))}
            </ul>
            ) : (
                <p>No projects yet.</p>
                )} */}
      </div>
                </div>
                </>
  );
};

export default Profile;
