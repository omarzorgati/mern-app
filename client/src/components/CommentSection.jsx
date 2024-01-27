import { Alert, Button, Modal, Textarea } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Comments from './Comments'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function CommentSection({postId}) {
    const {currentUser}=useSelector((state)=>state.user)
    const [comment,setComment]=useState('');
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const [comments,setComments]=useState([]);
    const navigate = useNavigate();
    const[showModal,setShowModal]=useState(false);
    const [commentToDelete,setCommentToDelete]=useState(null);
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!comment || comment===' '){
            setError('comment is required');
            setLoading(false);
            return; 
        }
        if(comment.length>200){
            setError('comment must be less than 200 characters');
            setLoading(false);
            return; }
        try {
                setLoading(true);
                const res = await fetch('/api/comment/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({content:comment,postId,userId:currentUser._id})
            });
            const data= await res.json();
            if(!res.ok){
                setLoading(false);
                setError(data.error);
                return;
            }
            if(res.ok){
                setComment('');
                setComments([data,...comments]);
                setLoading(false);
                setError(null);
            }

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    useEffect(()=>{
        const getComments=async()=>{
        try {
            const res = await fetch(`/api/comment/getpostcomments/${postId}`);
            const data= await res.json();
            if(res.ok){
                setComments(data);
            }
        } catch (error) {
            console.log(error.message);
        } 
        };
        getComments();
    },[postId])
    const handleLike=async(commentId)=>{
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`,{
            method:'PUT',
            });
            const data= await res.json();
            if(res.ok){
                setComments(comments.map((comment)=>
                    comment._id===commentId ?{
                        ...comment,
                        likes:data.likes,
                        numberOfLikes:data.likes.length
                    }: comment
                ))
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    //when we update a comment or + we need to get all the updated comment so the edit function must be here
    const handleEdit=async(comment,editedContent)=>{
        setComments(comments.map((c)=>
                    c._id===comment._id ?{
                        ...c,
                        content:editedContent
                    }: c
                ))
    }

    const handleDelete=async(commentId)=>{
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/deletecomment/${commentId}`,{
                method:'DELETE',
            });
            if(res.ok){
                const data= await res.json();
                setComments(comments.filter((comment)=>comment._id!==commentId));
                }

            
        } catch (error) {
           console.log(error.message); 
        }
    }

  return (
    <div className='max-w-2xl w-full mx-auto p-3'>
      {currentUser ? 
      (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
            <p>Signed in as :</p>
            <img src={currentUser.profilePicture} alt={currentUser.username} className='h-5 w-5 object-cover' />
            <Link to='/dashboard?tab=profile' className='text-xs text-cyan-600 hover:underline ' >
            @{currentUser.username}
            </Link>
        </div>
      )
     :(
        <div className="text-sm text-teal-500 my-5 flex gap-1 ">
            You must be signed in to comment.
            <Link to='/sign-in' className='text-blue-500 hover:underline' >Sign In</Link>
        </div>
     )
    }
    {currentUser &&(
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea onChange={(e)=>setComment(e.target.value)} value={comment} placeholder='add a comment...' rows='3' maxLength='200'/>
            <div className="flex justify-between items-center mt-5">
                <p className='text-gray-500 text-xs' >{200 - comment.length} characters remaining</p>
                <Button gradientDuoTone='purpleToBlue'outline type='submit'>{loading ?'loading...':'submit'}</Button>
            </div>
            {error && <Alert color='failure' className='mt-5'>{error}</Alert>}
        </form>
    )}
    {comments.length === 0 ? 
    (
        <p className='text-sm my-5'>No comments yet</p>
    )
    :(  
        <>
        <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p>{comments.length}</p>
            </div>
        </div>
        {comments.map((comment)=>(
            <Comments key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} 
            onDelete={(commentId)=>{setShowModal(true);setCommentToDelete(commentId)}} />
        ))}
        </>
    )}
       <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment</h3>
              <div className="flex justify-center gap-10 ">
                <Button onClick={()=>handleDelete(commentToDelete)} color='failure'>Yes, I'm sure</Button>
                <Button onClick={()=>setShowModal(false)} color='success'>No, cancel</Button>                  
              </div>
            </div>
          </Modal.Body>         
     </Modal>
    </div>
  )
}
