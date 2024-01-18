import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/user.slice.js';


export default function SignIn() {
const navigate=useNavigate();
const[formData,setFormData]=useState({});
const{loading,error}=useSelector((state)=>state.user)
const dispatch = useDispatch();
//trim: remove the spaces at the beginning and at the end of the string
const handleChange=(e)=>{
  setFormData({
    ...formData,
    [e.target.id]:e.target.value.trim()
  })

}
const handleSubmit=async(e)=>{
  e.preventDefault();
  if(!formData.email || !formData.password){
      return dispatch(signInFailure('please fill all the fields'));
  }
  try {
    dispatch(signInStart());
    const res = await fetch('api/auth/signin',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify(formData)
    });
    const data=await res.json();
    if(data.success === false){
      dispatch(signInFailure(data.message));
      return ;
      }
    dispatch(signInSuccess(data));
    navigate('/');
  } catch (error) {
      dispatch(signInFailure(error.message));
  }

};
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          {/*left side*/}
          <Link to='/' className='font-bold dark:text-white text-4xl' >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
            Omar's</span>
            Blog
         </Link>
         <p className='text-sm mt-5'>
          this is a demo project u can sign up with your email and password or with google
          </p>
        </div>
        <div className="flex-1">
          {/*right side*/}
          <form  onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div>
              <Label value='Email'/>
              <TextInput onChange={handleChange} type="email" placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value='Password'/>
              <TextInput onChange={handleChange} type="password" id='password' placeholder='***********' />
            </div>
            <Button gradientDuoTone='purpleToBlue'type='submit' disabled={loading} >
              {loading ? (
                <>
                <Spinner size='sm'/>
                <span>loading...</span>
                </>
                ) : 'Sign In'
               
              }
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>You dont have an account ?</span>
            <Link to='/sign-up' className='text-blue-500'>Sign Up</Link>
          </div>
          {error && <Alert className='mt-5'color='failure'>{error}</Alert> }
        </div>
      </div>
    </div>
  )
}
