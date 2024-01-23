import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import {Button, Table} from 'flowbite-react'
import { Link } from 'react-router-dom'


export default function Posts() {
const {currentUser}=useSelector((state)=>state.user);
const [userPosts,setUserPosts]=useState([]);
const [showMore,setShowMore]=useState(true);

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
        setUserPosts((prev)=>[prev,...data.posts])
        if(data.posts.length<9){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
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
              <Table.Body className='divide-y'>
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
                    <Button color='failure'>Delete</Button>
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
              <button onClick={handleShowMore} className='self-center w-full text-sm text-teal-500 py-7'>Show More...</button>
            )
          }
        </>
        ):(<p> You have no posts yet</p>)}
    </div>
  )
}
