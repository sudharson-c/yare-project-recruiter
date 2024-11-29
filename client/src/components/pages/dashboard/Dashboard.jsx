// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import ProjectCard from "../projects/ProjectCard";
import Loading from "../../sub/Loading";
import { Link } from "react-router-dom";
import ApplicationCard from "../apply/ApplicationCard";

const Dashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userApplications, setUserApp] = useState([]);

  useEffect(() => {
    const fetchUserProjects = async () => {
      console.log(process.env.API_URL);
      if (currentUser) {
        try {
          const projectsResponse = await axios.get(
            `${import.meta.env.API_URL}/projects/user/${currentUser.id}`
          );
          setUserProjects(projectsResponse.data.userProjects);
          const applicationsResponse = await axios.get(
            `${process.env.API_URL}/projects/applications/${currentUser.id}`
          );
          const userApplications = applicationsResponse.data.userApplications;
          const projectsAppliedTo = applicationsResponse.data.projectsAppliedTo;

          const userApplicationsWithProject = userApplications.map(
            (application) => {
              const project = projectsAppliedTo.find(
                (proj) => proj.id === application.project
              );
              return { ...application, project };
            }
          );

          setUserApp(userApplicationsWithProject);
          setUserProjects(projectsResponse.data.userProjects);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user projects:", error);
          setError("Error loading data. Please try again later.");
          setLoading(false);
        }
      }
    };

    fetchUserProjects();
  }, [currentUser]);

  const renderProjects = (status) => {
    const filteredProjects = userProjects.filter(
      (project) => project.status === status
    );
    if (filteredProjects.length === 0)
      return (
        <p className="text-center text-gray-500">
          No projects currently available...
        </p>
      );

    return filteredProjects.map((project) => (
      <ProjectCard
        key={project.id}
        id={project.id}
        project_name={project.project_name}
        project_desc={project.project_desc}
        owner={project.owner}
        status={project.status}
        createdAt={project.createdAt}
      />
    ));
  };

  const renderApplications = () => {
    if (userApplications.length === 0) {
      return (
        <p className="text-center text-gray-500 pt-4">
          Apply to projects{" "}
          <Link to="/projects" className="text-fuchsia-500 font-semibold">
            Click here
          </Link>
        </p>
      );
    }
    return userApplications.map((application, index) => (
      <div key={index} className="pt-4 flex justify-center">
        <ApplicationCard application={application} />
      </div>
    ));
  };

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          <h1 className="text-center font-bold text-3xl text-gray-800 mb-6">
            Dashboard
          </h1>

          {/* User Projects */}
          <div className="mb-8">
            <h2 className="text-center text-fuchsia-600 font-semibold text-xl mb-2">
              All Your Projects
            </h2>
            <div className="flex flex-col space-y-8">
              <section>
                <h3 className="text-center text-gray-700 font-semibold mb-4">
                  New Projects
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {renderProjects("NEW")}
                </div>
              </section>

              <section>
                <h3 className="text-center text-blue-500 font-semibold mb-4">
                  In Progress
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {renderProjects("IN PROGRESS")}
                </div>
              </section>

              <section>
                <h3 className="text-center text-green-500 font-semibold mb-4">
                  Completed
                </h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {renderProjects("COMPLETED")}
                </div>
              </section>
            </div>
          </div>

          {/* User Applications */}
          <div className="flex flex-col mt-10">
            <h2 className="text-center text-fuchsia-600 font-semibold text-xl mb-2">
              Your Applications
            </h2>
            <div className="flex flex-col space-y-6 ">
              {renderApplications()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
