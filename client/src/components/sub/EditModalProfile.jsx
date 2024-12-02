import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { UserContext } from "../../../context/UserContext";

const EditModalProfile = ({ close }) => {
  const { currentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_URL}/users/${currentUser.id}`
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (currentUser?.id) fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.API_URL}/users/${currentUser.id}`,
        userDetails
      );
      setSuccessMessage("User updated successfully!");
      close();
    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage("Failed to update the user. Please try again.");
    }
  };

  return (
    <div
      id="crud-modal"
      role="dialog"
      aria-labelledby="edit-profile-title"
      aria-hidden="true"
      className="flex justify-center overflow-y-auto fixed top-0 right-0 left-0 z-50 items-center w-full h-[calc(100%-1rem)] backdrop-blur-md"
    >
      <div className="relative p-4 w-full max-w-md">
        <div className="bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3
              id="edit-profile-title"
              className="text-lg font-semibold text-gray-900 "
            >
              Edit Profile
            </h3>
            <button
              type="button"
              className="text-red-400 hover:bg-red-500 rounded-lg text-sm w-8 h-8 flex justify-center items-center"
              onClick={close}
            >
              X<span className="sr-only">Close modal</span>
            </button>
          </div>
          <form className="p-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-2">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={userDetails?.firstName || ""}
                  onChange={handleChange}
                  className="block w-full p-2 rounded-lg border"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userDetails?.lastName || ""}
                  onChange={handleChange}
                  className="block w-full p-2 rounded-lg border"
                  required
                />
              </div>
              {/* <div>
                <label htmlFor="email" className="block mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={userDetails?.email || ""}
                  onChange={handleChange}
                  className="block w-full p-2 rounded-lg border"
                  required
                />
              </div> */}
              <div>
                <label htmlFor="role" className="block mb-2">
                  Role:
                </label>
                <input
                  type="text"
                  name="role"
                  value={userDetails?.role || ""}
                  onChange={handleChange}
                  className="block w-full p-2 rounded-lg border"
                  required
                />
              </div>
            </div>
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

EditModalProfile.propTypes = {
  close: PropTypes.func.isRequired,
};

export default EditModalProfile;
