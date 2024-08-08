// src/UserProfile.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router for routing

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const { userId } = useParams(); // Get userId from URL params (if using React Router)

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data());
        setFormData(userSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.lastName) validationErrors.lastName = 'Last Name is required';
    if (!formData.username) validationErrors.username = 'Username is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) validationErrors.email = 'Email is invalid';
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, formData);
      setIsEditing(false);
      setUser(formData); // Update the user state with the new data
      alert('Profile updated successfully!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
    setErrors({});
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      alert('Account deleted successfully');
      setUser(null); // Clear the user state
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md flex">
      <div className="w-1/3 flex justify-center items-center">
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-48 h-48 rounded-full"
        />
      </div>
      <div className="w-2/3 pl-8">
        {isEditing ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-md ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-md ${errors.username ? 'border-red-500' : ''}`}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 mt-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="mt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="text-xl text-gray-600 mb-2">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-xl text-gray-600 mb-4">
              <strong>Created At:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-2xl font-semibold mb-2">Projects:</h2>
            <div className="flex flex-wrap -mx-2">
              {user.projectIds.map((projectId, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
                  <div className="bg-gray-100 p-4 rounded-lg shadow">
                    <p className="text-gray-700 text-lg">{projectId}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Edit Account
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
