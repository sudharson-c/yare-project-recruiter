import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';
import axios from 'axios';
import ProjectCard from '../projects/ProjectCard';
import Loading from '../../sub/Loading';
import { Link } from 'react-router-dom';
import ApplicationCard from '../apply/ApplicationCard';

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userApplications, setUserApp] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (currentUser) {
        try {
          // Fetch all projects created by the user
          const projectsResponse = await axios.get(`http://localhost:5000/projects/user/${currentUser.id}`);
          setUserProjects(projectsResponse.data.userProjects);

          // Fetch all applications made by the user
          const applicationsResponse = await axios.get(`http://localhost:5000/projects/applications/${currentUser.id}`);
          const userApplications = applicationsResponse.data.userApplications;
          const projectsAppliedTo = applicationsResponse.data.projectsAppliedTo;
          
          // Combine applications with the corresponding project data
          const userApplicationsWithProject = userApplications.map((application) => {
            const project = projectsAppliedTo.find((proj) => proj.id === application.project);
            return { ...application, project };
          });
    
          // Update state with combined application and project data
          setUserApp(userApplicationsWithProject);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user projects:', error);
          setError('Error loading data. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    fetchUserProjects();
  }, [currentUser]);

  const renderProjects = (status) => {
    const filteredProjects = userProjects.filter((project) => project.status === status);
    if (filteredProjects.length === 0) return <h1>No projects currently available...</h1>;
    
    return filteredProjects.map((project) => (
      <ProjectCard
        key={project.id}
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
    ));
  };

  const renderApplications = () => {
    if (userApplications.length === 0) {
      return (
        <p className="text-center text-black-500 pt-2">
          Apply to projects <Link to="/projects" className="text-fuchsia-500">Click here</Link>
        </p>
      );
    }
    return userApplications.map((application, index) => (
      <div key={index} className="pt-2 flex justify-center">
        <ApplicationCard application={application} projectId={application.project?.id || ''} />
      </div>
    ));
  };

  return (
    <div>
      {loading ? (
        <center><Loading /></center>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <h1 className="text-center font-bold text-2xl">Dashboard Page</h1>
          <p className="text-center text-fuchsia-500 pt-2 font-bold">All your projects!</p>
          <p className="text-center text-black-500 pt-2">New projects:</p>
          <div className="p-5 w-auto h-max flex justify-evenly flex-wrap gap-5">
            {renderProjects('NEW')}
          </div>
          <p className="text-center text-blue-500 pt-2">In Progress:</p>
          <div className="p-5 w-auto h-max flex justify-evenly flex-wrap gap-5">
            {renderProjects("IN PROGRESS")}
          </div>
          <p className="text-center text-green-500 pt-2">Completed:</p>
          <div className="p-5 w-auto h-max flex justify-evenly flex-wrap gap-5">
            {renderProjects("COMPLETED")}
          </div>
          <p className="text-center text-fuchsia-500 pt-2 font-bold">Your Applications!</p>
          {renderApplications()}
        </>
      )}
    </div>
  );
};

export default Dashboard;
