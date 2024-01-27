import  { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comments({comment,onLike,onEdit,onDelete}) {
    const [user,setUser]=useState([]);
    //console.log(user);
    const {currentUser}=useSelector((state)=>state.user)
    const [isEditing,setIsEditing]=useState(false);
    const[editedContent,setEditedContent]=useState(comment.content)

 useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
            setUser(data);
        }
      } catch (error) {
            console.log(error.message);
      }
    };
    getUser();
  },[comment]);

  const handleEdit=async()=>{
    setIsEditing(true);
    setEditedContent(comment.content);
    }
    const handleSave=async()=>{
        try {
            const res = await fetch(`/api/comment/updatecomment/${comment._id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({content:editedContent})
            });
            const data= await res.json();
            if(res.ok){
                setIsEditing(false);
                onEdit(comment,editedContent);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm w-full'>
       <div className="flex-shrink-0 mr-3">
        <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full bg-gray-200' />
       </div>
       <div className="flex-1 ">
            <div className="flex items-center">
                <span className='font-bold mr-1 text-xs truncate' >{user ? `@${user.username}`:'anonymous user'}</span>
                <span className='text-xs text-gray-500' >{moment(comment.createdAt).fromNow()}</span>
            </div>
            {isEditing ? (
            <>
              <Textarea className='mb-2'
              maxLength='200'
              value={editedContent}
              onChange={(e)=>setEditedContent(e.target.value)}
              style={{
                maxHeight: '120px',
                resize: 'none', 
                overflowY: 'auto', 
                whiteSpace: 'pre-wrap',
              }}
              />
              <div className="flex justify-end gap-2 text-xs">
                <Button type='button' size='sm'gradientDuoTone='purpleToBlue'
                onClick={handleSave}> Save</Button>
                <Button onClick={()=>setIsEditing(false)} type='button' size='sm'gradientDuoTone='purpleToBlue' outline>Cancel</Button>

              </div>
            </>
            ):(
                <>
                <p className='text-gray-500 pb-2'>{comment.content}</p>
                <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button type='button' onClick={()=>onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${currentUser && 
                comment.likes.includes(currentUser._id) && '!text-blue-500'}`} >
                    <FaThumbsUp className='text-sm '/>
                </button>
                <p className='text-gray-400'>
                    {
                        comment.numberOfLikes > 0 && comment.numberOfLikes + " "+(comment.numberOfLikes === 1 ? 'like':'likes')
                    }
                </p>
                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <button type='button'className='text-gray-400 hover:text-blue-500' onClick={handleEdit} >Edit</button>
                )}
                {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <button type='button'className='text-gray-400 hover:text-red-500' onClick={()=>onDelete(comment._id)}>Delete</button>
                )}
            </div>
            </>
            )}
            
       </div>
    </div>
  )
}
