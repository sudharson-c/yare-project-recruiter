/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProjectCard = ({
  _id,
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
  return (
    <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
      <div className="p-2 pt-2">
        <div className="mb-8">
          <Link to={`/projects/${_id}`} className="text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 inline-block">
            {project_name}
          </Link>
          <p className="text-gray-700 text-sm">{project_desc}</p>
          <p className="text-sm text-gray-600">Status: {status}</p>
          <p className="text-sm text-gray-600">Stipend: {stipend ? `$${stipend}` : 'None'}</p>
          <p className="text-sm text-gray-600">Benefits: {benefits}</p>
          <p className="text-sm text-gray-600">Members Needed: {members_needed}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <Link to="#">
              <img className="w-10 h-10 rounded-full mr-4" src="default-avatar.png" alt={`Avatar of ${owner}`} />
            </Link>
            <div className="text-sm">
              <Link to="#" className="text-gray-900 font-semibold leading-none hover:text-indigo-600">
                Owner: {owner}
              </Link>
              <p className="text-gray-600">Created at: {new Date(createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <Link to={`/projects/${_id}`}>
            <button className='border border-fuchsia-500 p-2 rounded-md hover:bg-fuchsia-500 hover:text-white'>Join the project</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
