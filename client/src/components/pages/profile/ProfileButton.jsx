import React from 'react';
import { useNavigate } from 'react-router-dom';

// person: { id, name, avatar }

const ProfileButton = ({ person }) => {
    const navigate = useNavigate();
    const handleNavigate=()=>{
        navigate(`/users/${person.userId}`);
    }

  return (
    <div className='flex items-center gap-3 p-2 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 cursor-pointer' onClick={handleNavigate} >
      <img
        src={person.userAvatar || 'https://via.placeholder.com/40'} // Placeholder if avatar is unavailable
        alt={`${person.userName}'s avatar`}
        className='w-10 h-10 rounded-full'
      />
      <p className='text-gray-700 font-medium'>{person.userName}</p>
    </div>
  );
};

export default ProfileButton;
