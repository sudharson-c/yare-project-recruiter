import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

const EditModal = ({ project, close }) => {
  const { currentUser } = useContext(UserContext);
  const [projectDetails, setProjectDetails] = useState({ ...project });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.API_URL}/projects/${project.id}`,
        projectDetails
      );
      window.alert("Project updated successfully");
      close();
      navigate(0);
    } catch (error) {
      console.error("Error updating project:", error);
      window.alert("Failed to update the project. Please try again.");
    }
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={
        "flex justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md"
      }
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit {project.project_name}
            </h3>
            <button
              type="button"
              className="text-red-400 bg-transparent hover:bg-red-500 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={close}
            >
              X<span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4 md:p-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label
                  htmlFor="project_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Project Name:
                </label>
                <input
                  type="text"
                  name="project_name"
                  id="project_name"
                  value={projectDetails.project_name}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="project_desc"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Project Description:
                </label>
                <input
                  type="text"
                  name="project_desc"
                  id="project_desc"
                  value={projectDetails.project_desc}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="project_link"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Project Link:
                </label>
                <input
                  type="text"
                  name="project_link"
                  id="project_link"
                  value={projectDetails.project_link}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="stipend"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label
                  htmlFor="stipend"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter the status
                </label>
                <select
                  id="status"
                  name="status"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={projectDetails.status}
                  onChange={handleChange}
                >
                  <option>NEW</option>
                  <option>IN PROGRESS</option>
                  <option>COMPLETED</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="benefits"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Benefits:
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={projectDetails.benefits}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
