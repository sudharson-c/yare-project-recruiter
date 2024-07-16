// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';


const Projects = () => {
  const {isSignedIn} = useUser()
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://localhost:5000/projects')
      .then((response) => {
        console.log(response.data);
        setProjects([...projects,JSON.parse(response.data)]);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  }, []);
  if (!isSignedIn) {
    navigate('/');
    return null; 
  }

  return (
    <div className="max-w-screen-xl mx-auto p-3 sm:p-7 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            id={project._id}
            project_name={project.project_name}
            project_desc={project.project_desc}
            project_link={project.project_link}
            owner={project.owner}
            collaborators={project.collaborators}
            status={project.status}
            stipend={project.stipend}
            benefits={project.benefits}
            members_needed={project.members_needed}
            createdAt={project.createdAt}
            updatedAt={project.updatedAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
