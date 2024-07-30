// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'

const EditModal = ({project,close}) => {
    const {currentUser} = useContext(UserContext);
  return (
      <div className='fixed flex justify-center items-center mt-[-10%] w-[100vw] h-[100vh] fixed backdrop-blur-md'>
      <div className='bg-white p-10 rounded-md border border-gray-900 '>
      <button className='bg-red-500 text-2xl pl-5 pr-5 mt-2 text-white rounded-lg' onClick={close}>X</button>
      <h1 className='font-bold text-center text-2xl'>Edit {project.project_name}</h1>
      <div className='flex justify-center items-center flex-col'>
        <div id='form' className='p-4 '>
            <fieldset className='flex flex-col gap-3'>
              <legend className='text-xl font-bold p-4 text-center'>Project Details</legend>
              <div className='flex gap-2 items-center'>
                <label className='text-m font-bold'>Project Name:</label>
                <input type="text" value={project.project_name} className='border border-neutral-500 p-[4px] rounded-md bg-transparent'/>
              </div>
              <div className='flex gap-2'>
                <label className='text-m font-bold'>Project Name:</label>
                <input type="text" value={project.project_name} />
              </div>
              <div className='flex gap-2'>
                <label className='text-m font-bold'>Project Name:</label>
                <input type="text" value={project.project_name} />
              </div>
              <div className='flex gap-2'>
                <label className='text-m font-bold'>Project Name:</label>
                <input type="text" value={project.project_name} />
              </div>
              <div className='flex gap-2'>
                <label className='text-m font-bold'>Project Name:</label>
                <input type="text" value={project.project_name} />
              </div>
            </fieldset>
        </div>
        <div className='flex gap-3 '>
        <button onClick={close} className='text-red-500'>Cancel</button>
        <button >Edit</button>
        {currentUser.primaryEmailAddress.emailAddress ===
          project.owner.email && <p>Valid User</p>}
        </div>
        </div>
        </div>
    </div>

  )
}

export default EditModal
    