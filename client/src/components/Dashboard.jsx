// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import ProjectCard from './ProjectCard';

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (currentUser) {
        try {
          const response = await axios.get(`http://localhost:5000/projects/user/${currentUser.id}`);
          console.log(response.data.userProjects);
          setUserProjects(response.data.userProjects); // Update the state with fetched projects
        } catch (error) {
          console.error('Error fetching user projects:', error);
        }
      }
    };
    fetchUserProjects();
  }, [currentUser]); // Ensure the effect runs when currentUser changes

  return (
    <div>
      <h1 className='text-center font-bold text-2xl'>Dashboard Page</h1>
      <p className='text-center text-fuchsia-500 pt-2'>All your projects!</p>
      <div className='p-5 w-auto h-max flex justify-between flex-wrap gap-5 '>
      {userProjects.length >0 ?
          userProjects.map((project,index) => (<>
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
          </>)) : <center><h1>No projects found...</h1></center>}
      </div>
    </div>
  );
};

export default Dashboard;
