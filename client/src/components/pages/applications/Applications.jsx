// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Applications = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/projects/project-application/${id}`
        );
        setApplications(response.data.projectApplications);
        setProject(response.data.projectDetails);
        setLoading(false);
      } catch (err) {
        setError("No applications found or server error");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleBack = () => {
    navigate(`/projects/${id}`);
  };

  const handleProfile = (applier) => {
    navigate(`/users/${applier}`);
  };

  const handleAccept = async (applier) => {
    try {
      const response = await axios.put(
        `${process.env.API_URL}/projects/project-application/accept/${id}`,
        { applierId: applier }
      );
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.applier === applier
            ? { ...application, status: "ACCEPTED" }
            : application
        )
      );
      window.alert(response.data);
    } catch (error) {
      console.error("Error accepting application:", error.message);
    }
  };

  const handleReject = async (applier) => {
    try {
      const response = await axios.put(
        `${process.env.API_URL}/projects/project-application/reject/${id}`,
        { applierId: applier }
      );
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.applier === applier
            ? { ...application, status: "REJECTED" }
            : application
        )
      );
      window.alert(response.data);
    } catch (error) {
      console.error("Error rejecting application:", error.message);
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <button
        className="bg-fuchsia-500 text-white hover:bg-white hover:text-black hover:border-fuchsia-500 px-4 py-2 mb-6 rounded-lg transition-all"
        onClick={handleBack}
      >
        Back
      </button>
      <h2 className="text-center text-3xl font-extrabold mb-8">
        Applications for Project {project.project_name}
      </h2>
      {applications.length > 0 ? (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <li
              key={application._id}
              className="border p-6 rounded-lg shadow-md bg-white flex flex-col justify-between"
            >
              <div className="mb-4">
                <p>
                  <strong>Applier Name:</strong>{" "}
                  {application.userDetails.firstName}{" "}
                  {application.userDetails.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {application.userDetails.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {application.userDetails.phone || "Not available"}
                </p>
                <p>
                  <strong>Status:</strong> {application.status}
                </p>
                <p>
                  <strong>Message:</strong> {application.message}
                </p>
                <p>
                  <strong>Applied At:</strong>{" "}
                  {new Date(application.appliedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Resume Link:</strong>
                  <a
                    href={application.resume}
                    className="hover:text-blue-500"
                    target="_blank"
                  >
                    {application.resume}
                  </a>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  className="bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition-all"
                  onClick={() => handleProfile(application.applier)}
                >
                  View Profile
                </button>
                {application.status === "APPLIED" ? (
                  <>
                    <button
                      className="bg-lime-500 text-white py-2 rounded-md hover:bg-lime-600 transition-all"
                      onClick={() => handleAccept(application.applier)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-all"
                      onClick={() => handleReject(application.applier)}
                    >
                      Reject
                    </button>
                  </>
                ) : application.status === "ACCEPTED" ? (
                  <p className="text-lime-600 font-semibold text-center">
                    ACCEPTED
                  </p>
                ) : application.status === "REJECTED" ? (
                  <p className="text-red-600 font-semibold text-center">
                    REJECTED
                  </p>
                ) : (
                  <p className="text-gray-500 text-center">
                    PROJECT FILLED RECRUITMENT
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">
          No applications found for this project.
        </p>
      )}
    </div>
  );
};

export default Applications;
