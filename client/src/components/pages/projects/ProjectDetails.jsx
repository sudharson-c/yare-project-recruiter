import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import DeleteModal from "../../sub/DeleteModal";
import EditModal from "../../sub/EditModal";
import ApplyModal from "../apply/ApplyModal";
import ProfileButton from "../profile/ProfileButton";

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
        const response = await axios.get(
          `${process.env.API_URL}/projects/${project_id}`
        );
        const projectData = response.data;
        const filteredApplications =
          projectData.application && currentUser
            ? projectData.application.filter(
                (application) => application.userId === currentUser.id
              )
            : [];
        setProject({
          ...projectData,
          application: filteredApplications[0] || null,
        });
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (currentUser) fetchProject();
  }, [project_id, currentUser]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`${process.env.API_URL}/projects/${project_id}`);
      window.alert("Deleted successfully");
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      window.alert("Failed to delete the project. Please try again.");
    }
  };

  const handleEdit = () => setEditModalOpen(true);
  const handleApply = () => setApplyModalOpen(true);
  const handleDelete = () => setDeleteModalOpen(true);
  const handleModalClose = () => {
    setApplyModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  const handleViewApplications = () => {
    navigate(`/projects/${project_id}/applications`, {
      state: {
        applications: project.application,
        projectName: project.name,
      },
    });
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center py-20">
        <button
          className="border border-fuchsia-500 rounded-md px-4 py-2 mb-6 hover:bg-fuchsia-500 hover:text-white transition"
          onClick={handleBack}
        >
          Go back
        </button>
        <p>Loading project details...</p>
      </div>
    );
  }
  const handleRemoveCollab = (collaboratorId) => {
    axios.delete(
      `${process.env.API_URL}/projects/collaborators/${collaboratorId}`
    );
    setProject({
      ...project,
      collaborators: project.collaborators.filter(
        (collaborator) => collaborator.id !== collaboratorId
      ),
    });
  };

  return (
    <div className="container mx-auto p-6">
      {applyModalOpen && (
        <ApplyModal project={project} close={handleModalClose} />
      )}
      {editModalOpen && (
        <EditModal project={project} close={handleModalClose} />
      )}
      {deleteModalOpen && (
        <DeleteModal
          project={project}
          close={handleModalClose}
          onDelete={handleDeleteProject}
        />
      )}

      <div className="flex justify-start mb-6">
        <button
          className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white transition"
          onClick={handleBack}
        >
          Go back
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-fuchsia-600 mb-6">
          {project.name}
        </h2>
        <p className="text-gray-600 text-center mb-6">{project.description}</p>

        <div className="flex flex-col items-center space-y-4">
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
          <p>
            <strong>Owner:</strong> {project.owner.firstName}{" "}
            {project.owner.lastName}
          </p>
          <p>
            <strong>Status:</strong> {project.project_status}
          </p>
          <p>
            <strong>Stipend:</strong> Rs {project.stipend}
          </p>
          <p>
            <strong>Benefits:</strong> {project.benefits}
          </p>
          <p>
            <strong>Members Needed:</strong> {project.members_needed}
          </p>
        </div>
        <ul>
          <strong className="text-center px-3 flex justify-center pt-2">
            Collaborators:
          </strong>
          <br />
          <div className="flex flex-col gap-2 justify-center mt-2 mx-auto">
            {project.collaborators.length > 0 ? (
              project.collaborators.map((person, index) => (
                <li
                  key={index}
                  className="flex items-center justify-around gap-2"
                >
                  <ProfileButton
                    person={{
                      userId: person.id,
                      userAvatar: person.avatar,
                      userName: person.firstName + person.lastName,
                    }}
                  />
                  <div>
                    <button
                      className="btn border border-red-500 p-2 rounded-lg hover:bg-rose-500 hover:text-white"
                      onClick={() => handleRemoveCollab(person)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center -mt-8">No collaborators yet</p>
            )}
          </div>
        </ul>

        <div className="flex justify-center mt-6 gap-4">
          {currentUser.primaryEmailAddress.emailAddress ===
          project.owner.email ? (
            <>
              <button
                className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white transition"
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-500 rounded-md px-4 py-2 hover:bg-red-600 transition"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                onClick={handleViewApplications}
                className="border border-lime-500 rounded-md px-4 py-2 hover:bg-lime-500 hover:text-white transition"
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
                  : "text-gray-600"
              }
            >
              {project.application.status == "NEW"
                ? "APPLIED"
                : project.application.status}
            </strong>
          ) : project.members_needed > 0 ? (
            <button
              className="border border-fuchsia-500 rounded-md px-4 py-2 hover:bg-fuchsia-500 hover:text-white transition"
              onClick={handleApply}
            >
              Apply
            </button>
          ) : (
            <p className="text-xl text-center">Recruitment filled!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
