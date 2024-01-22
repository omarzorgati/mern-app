import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';





export default function CreatePost() {

    const [file,setFile]=useState(null);
    const [ImageFileUploadingProgress,setImageFileUploadingProgress]=useState(null);
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const {currentUser}=useSelector((state)=>state.user);
    const[errorPublish,setErrorPublish]=useState(null);
    const navigate = useNavigate();



    const handleUploadImage=async()=>{
        try {
            if(!file){
                setImageFileUploadError('Please select an image');
                return;
        }
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on('state_changed',
        (snapshot) => {
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadingProgress(progress.toFixed(0));
          },
          (error)=>{setImageFileUploadError('failed');
           setImageFileUploadingProgress(null);
           
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFormData({...formData,image:downloadURL});
                setImageFileUploadingProgress(null);
                setImageFileUploadError(null);

            })
          }
        )
        } catch (error) {
            setImageFileUploadError('image upload failed');
            setImageFileUploadingProgress(null);
        }
    }
       

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
            body:JSON.stringify(formData),
            })
            const data = await res.json();
            
            if(!res.ok){
                setErrorPublish(data.message);
                return;
            }
            if(res.ok){
                setErrorPublish(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setErrorPublish('something went wrong');
        }
    }





  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold ' >Create a post</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput onChange={(e)=>setFormData({...formData,title:e.target.value})} type='text' placeholder='Title'  id='title' className='flex-1'/>
                <Select onChange={(e)=>setFormData({...formData,category:e.target.value})} >
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput onChange={(e)=>setFile(e.target.files[0])} type='file' accept='image/*' />
                <Button disabled={ImageFileUploadingProgress} onClick={handleUploadImage}type='button' gradientDuoTone='purpleToBlue'outline size='sm'>
                     {ImageFileUploadingProgress ? 
                     (<div className='w-16 h-16'>
                        <CircularProgressbar value={ImageFileUploadingProgress} text={`${ImageFileUploadingProgress || 0}%`} />
                     </div>)
                     :('Upload image')
                    }
                </Button>
            </div>
            {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
            {formData.image && <img src={formData.image} alt="upload" className='w-25 h-25  object-cover'/>}
            <ReactQuill onChange={(value)=>{setFormData({...formData,content:value})}} theme='snow' placeholder='Write your post here' className='h-72 mb-12'/>
            <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
            {errorPublish && <Alert color='failure'>{errorPublish}</Alert>}
        </form>
    </div>
  )
}
