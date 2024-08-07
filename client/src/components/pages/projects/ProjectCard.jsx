/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="border rounded-md p-4 ml-0 md:w-100 border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
      <div className="p-2 pt-2">
        <div className="mb-8">
          <Link to={`/projects/${id}`} className="text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 inline-block">
            {project_name}
          </Link>
          <p className="text-gray-700 text-sm">{project_desc}</p>
          <p className="text-sm text-gray-600">Status: {status}</p>
          <p className="text-sm text-gray-600">Stipend: {stipend ? `$${stipend}` : 'None'}</p>
          <p className="text-sm text-gray-600">Benefits: {benefits}</p>
          <p className="text-sm text-gray-600">Members Needed: {members_needed}</p>
        </div>
        <div className="flex justify-evenly align-content-center gap-2">
          <div className="flex items-center">
            <Link to="#">
              <img className="w-10 h-10 rounded-full mr-4" src={owner.avatar} alt={`Avatar of ${owner.avatar}`} />
            </Link>
            <div className="text-sm">
              <Link to="#" className="text-gray-900 font-semibold leading-none hover:text-indigo-600">
                Owner: {owner.firstName +" "+ owner.lastName}
              </Link>
              <p className="text-gray-600">Created at: {new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Link to={`/projects/${id}`}>
            <button className='border border-fuchsia-500 p-2 rounded-md hover:bg-fuchsia-500 hover:text-white'>{currentUser.primaryEmailAddress.emailAddress !== owner.email ? "Join project" : "View project"}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
