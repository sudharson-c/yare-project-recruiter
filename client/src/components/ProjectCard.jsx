/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProjectCard = ({ id,imgSrc , membersOnly, title, description, authorImg, authorName, date }) => {
  return (
    <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
      <img src={imgSrc} className="w-full mb-3" alt="project" />
      <div className="p-2 pt-2">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="fill-current text-gray-500 w-3 h-3 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z"></path>
            </svg>
            {membersOnly}
          </p>
          <Link to={`/projects/${id}`} className="text-gray-900 font-bold text-lg mb-2 hover:text-indigo-600 inline-block">{title}</Link>
          <p className="text-gray-700 text-sm">{description}</p>
        </div>
        <div className="flex justify-between ">
        <div className="flex items-center">
          <Link to="#">
            <img className="w-10 h-10 rounded-full mr-4" src={authorImg} alt={`Avatar of ${authorName}`} />
          </Link>
          <div className="text-sm">
            <Link to="#" className="text-gray-900 font-semibold leading-none hover:text-indigo-600">{authorName}</Link>
            <p className="text-gray-600">{date}</p>
          </div>
        </div>
        <Link to={`/projects/${id}`}>
        <button className='border border-fuchsia-500 p-2 rounded-md hover:bg-fuchsia-500 hover:text-white'>Join the project</button>
        </Link>
        </div>
        
      </div>
    </div>
  );
};

export default ProjectCard;
