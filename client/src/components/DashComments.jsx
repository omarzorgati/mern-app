import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {Button, Modal, Table} from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashComments() {
const {currentUser}=useSelector((state)=>state.user);
const [comments,setComments]=useState([]);
const [showMore,setShowMore]=useState(true);
const [showModal,setShowModal]=useState(false);
const [commentIdToDelete,setCommentIdToDelete]=useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getcomments')
        const data = await res.json()
        if(res.ok){
            setComments(data.comments)
        if(data.comments.length<9){
             setShowMore(false);
          }
       }


      } catch (error) {
        console.log(error.message);
      }
    };
    if(currentUser.isAdmin){
      fetchComments();}
  },[currentUser._id])
  //console.log(userPosts);
  const handleShowMore=async()=>{
    const startIndex=comments.length;
    try {
      const res = await fetch(`api/comment/getcomments?startIndex=${startIndex}`)
      const data = await res.json()
      if(res.ok){
        setComments((prev)=>[...prev,...data.comments])
        if(data.comments.length<9){
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  }
  const handleDeleteComment=async()=>{
    setShowModal(false);
    try {
      const res = await fetch(`api/comment/deletecomment/${commentIdToDelete}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(!res.ok){
        console.log(data.message);
      }else{
        setComments((prev)=>prev.filter((comment)=>comment._id!==commentIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100
     scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 '>
      {currentUser.isAdmin && comments.length> 0 ? (
        <>
          <Table hoverable className='shadow-md '>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>postId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>

            </Table.Head> 
            {comments.map((comment)=>(
              <Table.Body key={comment._id} className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                     {comment.content}
                  </Table.Cell>
                  <Table.Cell>
                 {comment.numberOfLikes}
                  </Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <Button onClick={()=>{setShowModal(true);setCommentIdToDelete(comment._id)}} color='failure'>Delete</Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='self-center w-full text-sm text-teal-500 py-7 hover:underline'>
                Show More
              </button>
            )}
        </>
        ):(<p> No comments</p>)}

         <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment</h3>
              <div className="flex justify-center gap-10 ">
                <Button onClick={handleDeleteComment} color='failure'>Yes, I'm sure</Button>
                <Button onClick={()=>setShowModal(false)} color='success'>No, cancel</Button>                  
              </div>
            </div>
          </Modal.Body>         
     </Modal>
    </div>
  )
}
