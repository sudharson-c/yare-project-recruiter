import React, { useContext, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplyModal = ({ project, close }) => {
  const { currentUser } = useContext(UserContext);
  const [userMessage, setMsg] = useState("");
  const [formData, setFormData] = useState({
    projectId: project.id,
    applier: currentUser.id,
    owner: project.owner.clerkId,
    message: userMessage,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = { ...formData, message: userMessage };
      const response = await axios.post("http://localhost:5000/projects/apply", finalData);
      window.alert(response.data.message);
      close();
      navigate("/projects");
      
    } catch (error) {
      console.error("Error applying to project:", error);
      window.alert("Failed to apply to project. Please try again.");
    }
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
    setFormData((prevData) => ({ ...prevData, message: e.target.value }));
  };

  return (
    <div
      id="crud-modal"
      tabIndex="-1"
      aria-hidden="true"
      className="flex justify-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <center>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Apply to {project.project_name}
              </h3>
            </center>
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
                  Name:
                </label>
                <p>{currentUser.fullName}</p>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="project_desc"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email:
                </label>
                <p>{currentUser.primaryEmailAddress.emailAddress}</p>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter your message to project owner:
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="I am willing to work on this project.."
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex gap-5 justify-evenly">
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Apply
              </button>
              <button
                onClick={close}
                className="text-white inline-flex items-center border border-red-500 text-red-600 hover:bg-red-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
