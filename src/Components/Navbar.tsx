import React from 'react'
import usericon from '..//assets/usrIcon.webp'
const Navbar:React.FC = () => {
  return (
    <div className='w-full h-15  p-2 flex justify-between shadow-lg items-center fixed top-0 left-0 z-50 bg-white'>
        <h1 className='text-blue-600 text-3xl font-bold [text-shadow:1px_1px_2px_rgba(0,0,0,0.25)]'>EnvVault</h1>
        <div className='flex gap-3'>
            <img className='h-8 w-8 rounded-full border border black' src={usericon}></img>
            <button className='bg-red-500 text-white hover:cursor-pointer hover:bg-red-600 p-1 rounded w-20 h-8'>Log Out</button>
        </div>
    </div>
  )
}

export default Navbar
