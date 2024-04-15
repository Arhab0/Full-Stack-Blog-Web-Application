import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useNavigate} from "react-router-dom";
import { baseUrl } from '../helper/baseUrl';

const UpdatePost = () => {
  const[values,setValues] = useState('')
  const[cat,setCat] = useState('')
  const [title,setTitle] = useState('')
  const navigate = useNavigate()
  const postId = location.pathname.split("/")[2];


  const modules = {
    toolbar: [
      [{header:[1,2,3,4,5,6,false]}],
      [{font:[]}],
      [{size:[]}],
      ["bold", "italic", "underline", "strike","blockquote"],
      [
        {list:"ordered"},
        {list:"bullet"},
        {indent:"-1"},
        {indent:"+1"}
      ],
      ["link","image","video"]
    ]
  }

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
      try{
        await axios.put(`${baseUrl}/update-post/${postId}`,{
          title,
          description:values,
          cat
        })
        alert("Post has been updated")
        navigate('/')

      }catch(err){
        console.log(err)
      }
  };

  useEffect(()=>{
    getData()
  },[postId])

  const getData = async ()=>{
    const res = await axios.get(`${baseUrl}/post/${postId}`);
    
    setTitle(res.data.title)
    setValues(res.data.description)
    setCat(res.data.cat)
  }
  return (

    <div className='px-6 py-32'>
      <div className=' max-w-7xl'>
          <div className='w-[100%] flex md:flex-row gap-11 flex-col'>

                {/* editing section */}
                <div className='md:w-[70%]'>
                  <input type="text" className='p-[10px] mb-2 w-full outline-none'
                  value={title} placeholder='Title'
                  onChange={e=>{setTitle(e.target.value)}}
                  style={{border: '1px solid gray'}}
                  />
                  <div className=' overflow-y-scroll h-[300px] border-1 border-[#b9e7e7]'>
                    <ReactQuill 
                    className='h-full border-none'
                    theme='snow' value={values} onChange={setValues} modules={modules}/>
                  </div>
                </div>

                {/* menu section */}
                <div className='md:w-[30%] full flex flex-col'>
                  {/* Public */}
                    <div className='flex flex-col w-[230px]'
                    style={{border:'1px solid gray',padding:'5px 10px',marginBottom:'10px'}}
                    >
                      <h1 className='font-bold md:text-2xl text-lg mb-6'>Publish</h1>
                      <span><b>Status: </b>Draft</span>
                      <span className='mb-4'><b>Visbility: </b>Public</span>
                      <div className='mt-2'>
                        {/* <button className='my-3 mr-2 px-2 py-2 rounded-md bg-[#b9e7e7] hover:-translate-y-1 duration-200'>
                          Save as a draft
                        </button> */}
                        <button onClick={handleSubmit} className='my-3 px-2 py-2 rounded-md bg-[#b9e7e7] hover:-translate-y-1 duration-200'>
                          Publish
                        </button>
                      </div>
                    </div>

                  {/* Category */}
                    <div className='text-teal-600 w-[230px]'
                    style={{border:'1px solid gray',padding:'5px 10px'}}
                    >
                        <h1 className='font-bold md:text-2xl text-lg text-black mb-5'>Category</h1>
                        <div className='flex gap-2'>
                          <input type="radio" name='cat' value='art' id='art' 
                          checked={cat === 'art'}
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="art">Art</label>
                        </div>
                        <div className="flex gap-2">
                          <input type="radio" name='cat' value='science' id='science' 
                          checked={cat === 'science'}
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="science">science</label>
                        </div>
                        <div className="flex gap-2">
                          <input type="radio" name='cat' value='technology' id='technology'
                          checked={cat === 'technology'} 
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="technology">Technology</label>
                        </div>
                        <div className="flex gap-2">
                          <input type="radio" name='cat' value='cinema' id='cinema' 
                          checked={cat === 'cinema'}
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="cinema">Cinema</label>
                        </div>
                        <div className="flex gap-2">
                          <input type="radio" name='cat' value='design' id='design'
                          checked={cat === 'design'} 
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="design">Design</label>
                        </div>
                        <div className="flex gap-2">
                          <input type="radio" name='cat' value='food' id='food' 
                          checked={cat === 'food'}
                          onChange={e=>{setCat(e.target.value)}}
                          />
                          <label htmlFor="food">Food</label>
                        </div>


                    </div>
                </div>
          </div>
      </div>
    </div>
  )
}

export default UpdatePost