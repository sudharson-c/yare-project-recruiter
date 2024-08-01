// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import Loading from './Loading';

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (currentUser) {
        try {
          axios.get("http://localhost:5000/projects").then((response)=>console.log(response.data))
          const response = await axios.get(`http://localhost:5000/projects/user/${currentUser.id}`);
          setUserProjects(response.data.userProjects); // Update the state with fetched projects
          setLoading(false)
        } catch (error) {
          console.error('Error fetching user projects:', error);
        }
      }
    };
    fetchUserProjects();
  }, [currentUser]); // Ensure the effect runs when currentUser changes

  const renderProjects = (status)=>{
      const filteredProjects = userProjects.filter((project)=>project.status==status)

      if (filteredProjects.length ===0)
        return <h1>No projects currently available...</h1>;
      return filteredProjects.map((project,index) =>
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
            />)
          }

  return (
    <div>
      {loading ? (
        <center><Loading /></center>
      ) : (<>
      <h1 className='text-center font-bold text-2xl'>Dashboard Page</h1>
      <p className='text-center text-fuchsia-500 pt-2'>All your projects!</p>
      <p className='text-center text-black-500 pt-2'>New projects:</p>
      <div className='p-5 w-auto h-max flex justify-evenly flex-wrap gap-5 '>
      {renderProjects('NEW')}
      </div>
      <p className='text-center text-blue-500 pt-2'>In Progress:</p>
      <div className='p-5 w-auto h-max flex justify-evenly flex-wrap gap-5 '>
      {renderProjects("IN PROGRESS")}
      </div>
      <p className='text-center text-green-500 pt-2'>Completed:</p>
      <div className='p-5 w-auto h-max flex justify-evenly flex-wrap gap-5 '>
      {renderProjects("COMPLETED")}
      </div>
      </>
    )}

    </div>
  );
};

export default Dashboard;
