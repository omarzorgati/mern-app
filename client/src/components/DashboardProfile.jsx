import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSucess, signoutUserFailure, signoutUserStart, signoutUserSucess, updateUserFailure, updateUserStart, updateUserSucess } from '../redux/user/user.slice.js';
import { useNavigate } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi';

export default function DashboardProfile() {
    const {currentUser,error,loading} = useSelector((state)=>state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadingProgress,setImageFileUploadingProgress]=useState(null);
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const filePickerRef = useRef();
    //console.log(imageFileUploadingProgress,imageFileUploadError)
    const [formData,setFormData]=useState({});
    const [imageFileUploading,setImageFileUploading]= useState(false);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null);
    const[showModel,setShowModel]=useState(false);


    const handleImageChange=(e)=>{
        const file = e.target.files[0];
        if(file){
            setImageFile(file);
            //get the url
            setImageFileUrl(URL.createObjectURL(file)) 
        }
    };
  //console.log(imageFile);
  //console.log(imageFileUrl);
    useEffect(()=>{
      if(imageFile){
        uploadImage();
      }  
    },[imageFile]);

    const uploadImage=async()=>{
     /*    service firebase.storage {
            match /b/{bucket}/o {
              match /{allPaths=**} {
                allow read;
                allow write : if
                request.resource.size < 2 * 1024 * 1024 &&
                request.resource.contentType.matches('image/.*')
                
              }
            }
          } */
        //adding it after the update fetching(imageFileUploadfinished)  
        setImageFileUploading(true);
        setImageFileUploadError(null);
        
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,imageFile);
        uploadTask.on('state_changed',
        (snapshot) => {
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadingProgress(progress.toFixed(0));
          },
          (error)=>{setImageFileUploadError('File must be less than 2 MB');
           setImageFileUploadingProgress(null)
           setImageFile(null);
           setImageFileUrl(null);
           setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL);
                setFormData({...formData,profilePicture:downloadURL});
                setImageFileUploading(false);
                setImageFileUploadError(null);

            })
          }
        )

    }
    const handleChangeUser =(e)=>{
      setFormData({...formData,[e.target.id]:e.target.value})
    };
    const handleUpdateUser=async(e)=>{
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      if(Object.keys(formData).length===0){
        setUpdateUserError("No changes made");
        return;
      }
      if(imageFileUploading){
        setUpdateUserError("Please wait for the image to upload");
        return;
      }
      dispatch(updateUserStart());
      try {
        const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method:'PUT',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        });
        const data = await res.json();
        if(!res.ok){
          dispatch(updateUserFailure(data.message));
          setUpdateUserError(data.message);
          return;
        }
        dispatch(updateUserSucess(data));
        setImageFileUploadingProgress(null);
        setUpdateUserSuccess("user's profile updated successfuly");
      } catch (error) {
         dispatch(updateUserFailure(error.message));
         setUpdateUserError(error.message);
       
      }
    }

    const handleSignout=async()=>{
      try {
        dispatch(signoutUserStart());
        const res = await fetch('/api/auth/signout',{
          method:'POST',
        });
        const data = await res.json();
        if(!res.ok){
          dispatch(signoutUserFailure(data.message));
          return;
        }
        dispatch(signoutUserSucess());
      } catch (error) {
          dispatch(signoutUserFailure(error.message));
      }
    }
    const handleDeleteUser=async()=>{
      setShowModel(false);
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`,{
          method:'DELETE',
        });
        const data = await res.json();
        if(!res.ok){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSucess(data))
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }



  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl' >Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdateUser}>
        <input onChange={handleImageChange} ref={filePickerRef} type="file" accept='image/*' hidden />
        <div onClick={()=>filePickerRef.current.click()} className=" relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            {imageFileUploadingProgress && (
                <CircularProgressbar value={imageFileUploadingProgress || 0 } text={`${imageFileUploadingProgress}%`}
                strokeWidth={5} styles={{root:{width:'100%',height:'100%',position:'absolute',top:0,left:0,}, 
                path:{stroke:`rgba(62,152,199,${imageFileUploadingProgress/100})`},}} />
            )}
            <img src={imageFileUrl || currentUser.profilePicture} alt="user" 
             className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                imageFileUploadingProgress &&
                imageFileUploadingProgress < 100 &&
                'opacity-60'
              }`}
            />
        </div>
        { imageFileUploadError && <Alert color='failure' >{imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChangeUser} />
        <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChangeUser} />
        <TextInput type='password' id='password' placeholder='password' onChange={handleChangeUser}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline >Update</Button>
     </form>
     <div className="flex justify-between mt-4 mb-2 ">
        <Button onClick={()=>setShowModel(true)} gradientDuoTone='purpleToBlue' outline>Delete Account</Button>
        <Button onClick={handleSignout} gradientDuoTone='purpleToBlue' outline>Sign Out</Button>
     </div>
     {updateUserSuccess && <Alert color='success' >{updateUserSuccess}</Alert>}
     {updateUserError && <Alert color='failure' >{updateUserError}</Alert>}
     <Modal show={showModel} onClose={()=>setShowModel(false)} popup size='md'>
        <Modal.Header/>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className='w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account </h3>
              <div className="flex justify-center gap-10 ">
                <Button onClick={handleDeleteUser} color='failure'>Yes, I'm sure</Button>
                <Button onClick={()=>setShowModel(false)} color='success'>No, cancel</Button>                  
              </div>
            </div>
          </Modal.Body>         
     </Modal>
     
    </div>
  )
}
