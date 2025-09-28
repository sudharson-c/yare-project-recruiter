// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";
import Loading from "../../sub/Loading";
import ProjectCard from "./ProjectCard";

const API_BASE = import.meta?.env?.VITE_API_URL ?? process.env.API_URL ?? "";

const Projects = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/projects`)
      .then((response) => {
        if (!cancelled) setProjects(response.data.projectData ?? []);
      })
      .catch((e) => {
        if (!cancelled) console.error("Error fetching projects:", e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  id={project.id}
                  project_name={project.name}
                  project_desc={project.description}
                  project_link={project.project_link}
                  owner={project.owner}
                  collaborators={project.collaborators_id}
                  status={project.project_status}
                  stipend={project.stipend}
                  benefits={project.benefits}
                  members_needed={project.members_needed}
                  createdAt={project.createdAt}
                  updatedAt={project.updatedAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <h1 className="text-3xl font-semibold text-gray-700 mb-4 text-center">
                Oops! No projects found...
              </h1>
              <button
                onClick={() => navigate("/add-project")}
                className="mt-2 px-6 py-3 text-lg font-medium text-fuchsia-500 border border-fuchsia-500 rounded-md hover:bg-fuchsia-500 hover:text-white transition duration-200"
              >
                Add New Project!
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;
