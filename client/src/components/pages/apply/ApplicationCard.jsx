import { useState } from "react";
import Loading from "../../sub/Loading";
import axios from "axios";

const ApplicationCard = async ({ application, projectId }) => {
  const [loading, setLoading] = useState(false);
  const project = projectId ? await (await axios.get(`http://localhost:5000/projects/${projectId}`)).data : setLoading(true)
  return (
    <>
      {loading ? (
        <center>
          <Loading />
        </center>
      ) : (
        <div className="px-10 flex flex-row justify-between border border-black rounded-md p-4">
          <div className="flex flex-col justify-start">
            <h3 className="font-bold text-lg">Project Name: {project.project_name}</h3>
            <p><strong>Project Description:</strong> {project.project_desc}</p>
            <p><strong>Stipend:</strong> {project.stipend}</p>
            <p><strong>Benefits:</strong> {project.benefits}</p>
            <p><strong>Project Link:</strong> <a href={project.project_link} target="_blank" rel="noreferrer">{project.project_link}</a></p>
          </div>
          <div className="flex flex-col justify-start">
            <h3 className="font-bold text-lg">Application Details</h3>
            <p><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Message:</strong> {application.message}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationCard;
