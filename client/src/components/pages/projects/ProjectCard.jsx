/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';

// eslint-disable-next-line react/prop-types

const ProjectCard = ({
  id,
  project_name,
  project_desc,
  project_link,
  owner,
  collaborators,
  status,
  stipend,
  benefits,
  members_needed,
  createdAt,
  updatedAt
}) => {
  const {currentUser} = useContext(UserContext);
  const navigate= useNavigate();
  const handleViewProject = (projectId)=>{
    navigate(`/projects/${projectId}`)
  }
  return (
    <div className="border rounded-lg shadow-md p-6 w-full max-w-sm bg-white flex flex-col justify-between space-y-4 transition-transform transform hover:scale-105 hover:border-fuchsia-400">
      <div>
        <Link to={`/projects/${id}`} className="text-gray-900 font-bold text-xl hover:text-indigo-600">
          {project_name}
        </Link>
        <p className="text-gray-700 text-base mt-2 mb-4">{project_desc}</p>
        <p className="text-gray-600 text-sm">Status: {status}</p>
      </div>
      
      <div className="flex items-center mt-4">
        <img className="w-10 h-10 rounded-full mr-3" src={owner.avatar} alt="Owner Avatar" />
        <div>
          <Link to="#" className="text-gray-900 font-semibold hover:text-indigo-600">
            {owner.firstName} {owner.lastName}
          </Link>
          <p className="text-gray-500 text-xs">Created on: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-6">
        <Link to={`/projects/${id}`} className="flex-1">
          <button className="w-full border border-fuchsia-500 text-fuchsia-500 font-semibold py-2 rounded-lg hover:bg-fuchsia-500 hover:text-white transition">
            {currentUser.primaryEmailAddress.emailAddress !== owner.email ? "Join project" : "View project"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
