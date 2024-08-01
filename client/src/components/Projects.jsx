// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Loading from './Loading';

const Projects = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/projects')
      .then((response) => {
        setProjects(response.data.projectData); // Set all projects
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  if (!currentUser) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-screen-xl mx-auto p-3 sm:p-7 md:p-10">
      {loading ? (
        <center><Loading /></center>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <ProjectCard
                key={index}
                id={project.id}
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
            ))
          ) : (
            <center><h1>No projects found...</h1></center>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
