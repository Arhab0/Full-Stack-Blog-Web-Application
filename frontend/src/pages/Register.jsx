import React, { useState,useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import { baseUrl } from '../helper/baseUrl'
const Register = () => {
  
  
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()
  const [error , setError] = useState("")

  const {isLoggedIn} = useSelector((state)=>state.auth)


  useEffect(()=>{
    if(isLoggedIn)
    {
      navigate('/')
    }else{
      navigate('/login')
    }
  },[isLoggedIn])
  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    await axios.post(`${baseUrl}/register`,{
      username,
      email,
      password
    }).then((res)=>{
      if(res.data.message == "User already exits")
      {
          setError(res.data.message)
      } else{
        alert("New account has been created")
        navigate('/login')
      }
    })
  }

  return (
    <div className='flex items-center justify-center flex-col h-screen bg-[#b9e7e7]'>
        <h1 className='text-4xl font-bold text-teal-700 mb-11'>Register</h1>
        <form className='flex flex-col gap-5 bg-white p-6 w-[400px] rounded'>
          <input type="text" name="username" placeholder='Enter your name'
          className=' border-b border-1 border-zinc-600 p-4 placeholder:text-gray-500 outline-none' 
          value={username}
          onChange={(e)=>{setUsername(e.target.value)}}
          />
          <input type="email" name="email" placeholder='Enter your email'
          className=' border-b border-1 border-zinc-600 p-4 placeholder:text-gray-500 outline-none' 
          onChange={(e)=>{setEmail(e.target.value)}}
          value={email}
          />
          <input type="password" name="password" placeholder='Enter your password'
          className=' border-b border-1 border-zinc-600 p-4 placeholder:text-gray-500 outline-none'
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
           />
          <p className='text-red-700 font-semibold text-center'>
            {error == "" ? '' : error}
            </p>
          <button onClick={handleSubmit} className='bg-teal-700 text-white p-3 border-none
          rounded transition-all ease-out duration-200
          hover:-translate-y-1'>
            Signup
          </button>
        </form>
    </div>
  )
}

export default Register