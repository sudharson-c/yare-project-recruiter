// eslint-disable-next-line no-unused-vars
import React from 'react'

const ApplyModal = ({project,close}) => {
  return (
    <div className='fixed items-center w-[100vw] h-[100vh] fixed bg-slate-200'>
      <button onClick={close}>X</button>
      <h1 className='font-bold'>Apply to {project.project_name}</h1>
      <div className='flex gap-3 '>
        <button onClick={close}>Cancel</button>
        <button >Apply</button>
        </div>
    </div>
  )
}

export default ApplyModal
