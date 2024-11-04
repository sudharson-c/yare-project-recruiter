// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Applications = () => {
  const { id } = useParams(); // Get project ID from route params
  const [applications, setApplications] = useState([]);
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/projects/project-application/${id}`);
        setApplications(response.data.projectApplications); // Set applications data from response
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
      const response = await axios.put(`http://localhost:5000/projects/project-application/accept/${id}`, { applierId: applier });
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.applier === applier ? { ...application, status: "ACCEPTED" } : application
        )
      );
      window.alert(response.data)
    } catch (error) {
      console.error("Error accepting application:", error.message);
    }
  };

  const handleReject = async (applier) => {
    try {
      const response = await axios.put(`http://localhost:5000/projects/project-application/reject/${id}`, { applierId: applier });
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.applier === applier ? { ...application, status: "REJECTED" } : application
        )
      );
      window.alert(response.data)
    } catch (error) {
      console.error("Error rejecting application:", error.message);
    }
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button
        className="bg-fuchsia-500 text-white hover:bg-white hover:text-black hover:border-fuchsia-500 p-3 rounded-md"
        onClick={handleBack}
      >
        Back
      </button>
      <h2 className="text-center text-3xl font-extrabold">
        Applications for Project {project.project_name}
      </h2>
      {applications.length > 0 ? (
        <ul className="grid grid-cols-3 sm:grid-cols-1 ">
          {applications.map((application) => (
            <li key={application._id} className="border p-4 my-2 flex justify-between">
              <div>
                <p><strong>Applier Name:</strong> {application.userDetails.firstName + " " + application.userDetails.lastName}</p>
                <p><strong>Applier Email:</strong> {application.userDetails.email}</p>
                <p><strong>Applier Phone:</strong> {application.userDetails.phone || "Not available"}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Message:</strong> {application.message}</p>
                <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col justify-around gap-2">
                <button className="p-3 border rounded-md hover:text-white hover:bg-indigo-500 border-indigo-500" onClick={() => handleProfile(application.applier)}>
                  View Profile
                </button>
                { application.status === "APPLIED" ? (<>
                  <button className="p-3 border rounded-md hover:text-white hover:bg-lime-500 border-lime-500" onClick={() => handleAccept(application.applier)}>
                  Accept
                </button>
                <button className="p-3 border rounded-md hover:text-white hover:bg-red-500 border-red-500" onClick={() => handleReject(application.applier)}>
                  Reject
                </button>
                </>) : application.status === "ACCEPTED" ? <h1 className='text-lime-500'>ACCEPTED</h1> 
                : application.status === "REJECTED" ? <h1 className='text-red-500'>REJECTED</h1> : <h1>PROJECT FILLED RECRUITMENT</h1>
                }
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found for this project.</p>
      )}
    </div>
  );
};

export default Applications;
