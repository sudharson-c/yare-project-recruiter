// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/UserContext";

const AddProject = () => {
  const { currentUser } = useContext(UserContext);

  const [projectDetails, setProjectDetails] = useState({
    project_name: "",
    project_desc: "",
    project_link: "",
    owner: currentUser && currentUser.id,
    members_needed: "",
    stipend: 0,
    status: "NEW",
    benefits: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validate = () => {
    return Object.values(projectDetails).every(value => value !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setError("Please fill all the required fields");
      return;
    } 

    try {
      await axios.post("http://localhost:5000/projects", projectDetails);
      window.alert("Project added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding project:", error);
      window.alert("Failed to add the project. Please try again.");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>
      <h1 className="text-center font-extrabold text-3xl">Add project</h1>
      <div id="form" className="container mx-auto px-10">
        {error && <p className="text-red-500 text-center text-xl">{error}</p>}
        <form className="p-4 md:p-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="project_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Project Name:
              </label>
              <input
                type="text"
                name="project_name"
                id="project_name"
                value={projectDetails.project_name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="project_desc"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Project Description:
              </label>
              <input
                type="text"
                name="project_desc"
                id="project_desc"
                value={projectDetails.project_desc}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="project_link"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Project Link:
              </label>
              <input
                type="text"
                name="project_link"
                id="project_link"
                value={projectDetails.project_link}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="members_needed"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Members Needed:
              </label>
              <input
                type="number"
                name="members_needed"
                id="members_needed"
                value={projectDetails.members_needed}
                onChange={handleChange}
                min={1}
                max={10}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="stipend"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Stipend (in Rs):
              </label>
              <input
                type="number"
                name="stipend"
                id="stipend"
                min={0}
                value={projectDetails.stipend}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            <div className="col-span-2">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Enter the status
              </label>
              <select
                id="status"
                name="status"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={projectDetails.status}
                onChange={handleChange}
                required
              >
                <option value="NEW">NEW</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <div className="col-span-2">
              <label
                htmlFor="benefits"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Benefits:
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                value={projectDetails.benefits}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Add project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
