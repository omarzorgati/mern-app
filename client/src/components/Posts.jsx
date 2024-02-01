import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import {Button, Modal, Table} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function Posts() {
const {currentUser}=useSelector((state)=>state.user);
const [userPosts,setUserPosts]=useState([]);
const [showMore,setShowMore]=useState(true);
const [showModal,setShowModal]=useState(false);
const [postIdToDelete,setpostIdToDelete]=useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if(res.ok){
          setUserPosts(data.posts)
          if(data.posts.length<9){
            setShowMore(false);
          }
       }


      } catch (error) {
          console.log(error.message);
      }
    };
    if(currentUser.isAdmin){
      fetchPosts();}
  },[currentUser._id])
  //console.log(userPosts);
  const handleShowMore=async()=>{
    const startIndex=userPosts.length;
    try {
      const res = await fetch(`api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
          setUserPosts(prev => [...prev, ...data.posts]);
        if(data.posts.length<9){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  }
  const handleDeletePost=async()=>{
    setShowModal(false);
    try {
      const res = await fetch(`api/post/delete/${postIdToDelete}/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setUserPosts((prev)=>prev.filter((post)=>post._id!==postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 min-h-screen '>
      {currentUser.isAdmin && userPosts.length>0 ? (
        <>
          <Table hoverable className='shadow-md '>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>category</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
              <Table.HeadCell>
                <span>edit</span>
              </Table.HeadCell>

            </Table.Head> 
            {userPosts.map((post)=>(
              <Table.Body key={post._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white' >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={()=>{setShowModal(true);setpostIdToDelete(post._id)}} color='failure'>Delete</Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <Button color='blue'>Edit</Button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='self-center w-full text-sm text-teal-500 py-7 hover:underline'>Show More...</button>
            )
          }
        </>
        ):(<p> You have no posts yet</p>)}
         <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post</h3>
              <div className="flex justify-center gap-10 ">
                <Button onClick={handleDeletePost} color='failure'>Yes, I'm sure</Button>
                <Button onClick={()=>setShowModal(false)} color='success'>No, cancel</Button>                  
              </div>
            </div>
          </Modal.Body>         
     </Modal>
    </div>
  )
}
