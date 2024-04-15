import React from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = () => {
  const {isLoggedIn,user} = useSelector((state)=>state.auth)

  return (
    <div className='px-6 pt-32'>
      <div className=' max-w-7xl'>
        {
          isLoggedIn ? (
            <div>{user?.username}</div>
          ) : (
            <div className='flex justify-center items-center flex-col pt-44'>
              <h1 className='md:text-3xl text-lg font-bold'>Please Login again</h1>
              <div className='mt-6'>
                <Link to='/login'><button className='w-[110px] hover:drop-shadow-2xl hover:-translate-y-1 duration-300 py-2 border-2 border-zinc-700 rounded-2xl'>Login</button></Link> or <Link to='/'><button className='w-[110px] hover:drop-shadow-2xl hover:-translate-y-1 duration-300 py-2 border-2 border-zinc-700 rounded-2xl'>Home</button></Link>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Profile