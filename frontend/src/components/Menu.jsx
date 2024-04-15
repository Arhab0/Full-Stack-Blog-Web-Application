import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { baseUrl } from '../helper/baseUrl'

const Menu = ({cat}) => {
  const [posts,setPosts] = useState([])
  
  useEffect(()=>{
    const fetchData = async ()=>{
      try{
        await axios.get(`${baseUrl}/posts?cat=${cat}`).then((res)=>{
          const result = res.data
          if(result.length >=4)
          {
            let first = result.length
            let last = result.length-4
            setPosts(result.slice(last,first))
          } else{
            setPosts(result)
          }
        })
      } catch(err){
        console.log(err)
      }
    }
    fetchData()
  },[cat])
  return (
    <div>
        <h1 className='text-center md:border-t-0 border-t-2 md:pt-0 pt-5 font-bold md:text-2xl mb-4'>Post you may like</h1>
        {
            posts.map(post =>(
                <div key={post.id} className='md:mb-6 mb-3'>
                    <img src={`../upload/${post.img}`} className='rounded' alt="" />
                    <Link to={`/post/${post.id}`}>
                      <h1 className='font-bold text-lg mt-2'>{post.title}</h1>
                      <button  className='my-3 px-4 py-2 rounded-md bg-[#b9e7e7] hover:-translate-y-1
                      duration-200
                      '>Read More</button>
                    </Link>
                </div>
            ))
        }
        <div className='flex items-center justify-center'>
        <Link to={`/?cat=${cat}`} className='font-bold text-xl border-2 py-3 px-6 rounded-[30px] hover:border-black duration-300'>More Post</Link>
        </div>
    </div>
  )
}

export default Menu