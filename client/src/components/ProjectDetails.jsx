/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { useUser } from "@clerk/clerk-react";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const { project_id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const storedProject = window.sessionStorage.getItem(project_id);
      if (storedProject) {
        setProject(JSON.parse(storedProject));
      } else {
        try {
          const response = await axios.get(`http://localhost:5000/projects/${project_id}`);
          setProject(response.data);
          window.sessionStorage.setItem(project_id, JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching project details:", error);
        }
      }
    };

    fetchProject();
  }, [project_id]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDeleteProject = async () => {
    const confirmation = window.prompt(`Enter Yes to delete project ${project.project_name}`).toLowerCase();
    if (confirmation === 'yes') {
      try {
        await axios.delete(`http://localhost:5000/projects/${project_id}`);
        window.alert('Deleted successfully');
        navigate('/projects'); // Redirect to the projects list after deletion
      } catch (error) {
        console.error('Error deleting project:', error);
        window.alert('Failed to delete the project. Please try again.');
      }
    }
  };

  if (!project) {
    return (
      <div>
        <button className="border border-fuchsia-500 rounded-md p-3" onClick={handleBack}>
          Go back
        </button>
        Loading project details...
      </div>
    );
  }

  return (
    <div>
      <button className="border border-fuchsia-500 rounded-md p-3" onClick={handleBack}>
        Go back
      </button>
      <div>
        <h2 className="text-xl font-bold">{project.project_name}</h2>
        <p className="mt-2">{project.project_desc}</p>
        <a href={project.project_link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
          View Project
        </a>
        <div className="mt-4">
          <h3 className="font-semibold">Owner:</h3>
          <p>{project.owner.name} ({project.owner.username})</p>
          <h3 className="font-semibold">Status:</h3>
          <p>{project.status}</p>
          <h3 className="font-semibold">Stipend:</h3>
          <p>${project.stipend}</p>
          <h3 className="font-semibold">Benefits:</h3>
          <p>{project.benefits}</p>
          <h3 className="font-semibold">Members Needed:</h3>
          <p>{project.members_needed}</p>
        </div>
        <button className="border border-fuchsia-500 rounded-md p-1">
          {currentUser.primaryEmailAddress.emailAddress === project.owner.email ? "Edit" : "Apply"}
        </button>
        {currentUser.primaryEmailAddress.emailAddress === project.owner.email && (
          <button className="text-white bg-red-500 rounded-md p-2" onClick={handleDeleteProject}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
