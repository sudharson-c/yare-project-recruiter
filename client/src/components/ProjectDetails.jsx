/* eslint-disable no-unused-vars */
import React from 'react'

const ProjectDetails = () => {
  const handleBack=() =>{
    window.history.back()
  }
  return (
    
    <div>
      <button className='border border-fuchsia-500 rounded-md p-3' onClick={handleBack}>Go back</button>
      <div>
        ProjectDetails
        </div>
        </div>
  )
}

export default ProjectDetails