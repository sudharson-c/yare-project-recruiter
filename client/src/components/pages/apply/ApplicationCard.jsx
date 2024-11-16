import { useState } from "react";
import Loading from "../../sub/Loading";
import { useNavigate } from "react-router-dom";

const ApplicationCard = (applicationDetail) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleViewProject = (projectId)=>{
    navigate(`/projects/${projectId}`)
  }
  const application = applicationDetail.application;
  return (
    <>
      {loading ? (
        <center>
          <Loading />
        </center>
      ) : (
        <div className="px-10 flex justify-around border border-black rounded-md p-4 w-[80%] ">
          <div className="flex flex-col w-1/3">
            <h3 className="font-bold text-lg">Application Details</h3>
            <p>
              <strong>Applied At:</strong>{" "}
              {new Date(application.appliedAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {application.status}
            </p>
            <p>
              <strong>Message:</strong> {application.message}
            </p>
          </div>
          <div className="flex justify-between w-2/3 items-center">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">
                Project Name: {application.project.project_name}
              </h3>
              <p>
                <strong>Stipend:</strong> {application.project.stipend}
              </p>
              <p>
                <strong>Benefits:</strong> {application.project.benefits}
              </p>
              <p>
                <strong>Github Link:</strong>{" "}
                <a
                  href={application.project.project_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {application.project.project_link}
                </a>
              </p>
            </div>
            <div className="m-auto flex items-center">
              <button className="bg-fuchsia-500 border border-fuchsia-500 hover:bg-white hover:text-black text-white p-3 rounded-lg" onClick={()=>handleViewProject(application.projectId)}>
                View Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationCard;
