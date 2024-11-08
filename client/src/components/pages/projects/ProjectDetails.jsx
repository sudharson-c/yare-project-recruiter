import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import DeleteModal from "../../sub/DeleteModal";
import EditModal from "../../sub/EditModal";
import ApplyModal from "../apply/ApplyModal";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { project_id } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects/${project_id}`);
        const projectData = response.data;
  
        // Check if currentUser is defined before accessing its properties
        const filteredApplications = projectData.application && currentUser
          ? projectData.application.filter(application => application.applier === currentUser.id)
          : [];
  
        setProject({
          ...projectData,
          application: filteredApplications[0] || null, // Set to null if no applications are found
        });
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
  
    // Only fetch project details if currentUser is defined
    if (currentUser) {
      fetchProject();
    }
  }, [project_id, currentUser]);  

  const handleBack = () => {
    window.history.back();
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:5000/projects/${project_id}`);
      window.alert("Deleted successfully");
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      window.alert("Failed to delete the project. Please try again.");
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleApply = () => {
    setApplyModalOpen(true);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setApplyModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  const handleViewApplications = () => {
    navigate(`/projects/${project_id}/applications`, {
      state: { applications: project.application, projectName: project.project_name },
    });
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center">
        <button
          className="border border-fuchsia-500 rounded-md px-4 py-2 mb-4 hover:bg-fuchsia-500 hover:text-white"
          onClick={handleBack}
        >
          Go back
        </button>
        Loading project details...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {applyModalOpen && <ApplyModal project={project} close={handleModalClose} />}
      {editModalOpen && <EditModal project={project} close={handleModalClose} />}
      {deleteModalOpen && (
        <DeleteModal
          project={project}
          close={handleModalClose}
          onDelete={handleDeleteProject}
        />
      )}
      <div className="flex justify-start mb-6">
        <button
          className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white"
          onClick={handleBack}
        >
          Go back
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">{project.project_name}</h2>
        <p className="text-gray-700 text-center mb-4">{project.project_desc}</p>

        <div className="flex flex-col items-center space-y-2">
          <p>
            <b>Github link:</b>{" "}
            <a
              href={project.project_link}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Project
            </a>
          </p>
          <p><strong>Owner:</strong> {project.owner.firstName} {project.owner.lastName}</p>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Stipend:</strong> Rs {project.stipend}</p>
          <p><strong>Benefits:</strong> {project.benefits}</p>
          <p><strong>Members Needed:</strong> {project.members_needed}</p>
        </div>

        <div className="flex justify-center mt-6 gap-4">
          {currentUser.primaryEmailAddress.emailAddress === project.owner.email ? (
            <>
              <button
                className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                onClick={handleViewApplications}
                className="border border-lime-500 rounded-md px-4 py-2 hover:bg-lime-500 hover:text-white"
              >
                View Applications
              </button>
            </>
          ) : project.application ? (
            <strong
              className={
                project.application.status === "ACCEPTED"
                  ? "text-lime-500"
                  : project.application.status === "REJECTED"
                  ? "text-red-500"
                  : ""
              }
            >
              {project.application.status}
            </strong>
          ) : (
            <button
              className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white"
              onClick={handleApply}
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
