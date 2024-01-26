import { useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import Oauth from '../components/Oauth';


export default function SignUp() {
const navigate=useNavigate();
const[formData,setFormData]=useState({});
const[loading,setLoading]=useState(false);
const[error,setError]=useState(null);
//trim: remove the spaces at the beginning and at the end of the string
const handleChange=(e)=>{
  setFormData({
    ...formData,
    [e.target.id]:e.target.value.trim()
  })

}
const handleSubmit=async(e)=>{
  e.preventDefault();
  if(!formData.username || !formData.email || !formData.password){
      return setError('All fields are required');
  }
  try {
    setLoading(true);
    setError(null);
    const res = await fetch('api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify(formData)
    });
    const data=await res.json();
    if(!res.ok){
      setError(data.message);
      setLoading(false);
      return 
      }
    setLoading(false);
    setError(null);
    navigate('/sign-in');
  } catch (error) {
      setLoading(false);
      setError(error.message);
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
              <Label value='Your username'/>             
              <TextInput onChange={handleChange} type="text" id='username' />
            </div>
            <div>
              <Label value='Your email'/>
              <TextInput onChange={handleChange} type="email" placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label value=' Your password'/>
              <TextInput onChange={handleChange} type="password" id='password' />
            </div>
            <Button gradientDuoTone='purpleToBlue'type='submit' outline disabled={loading} >
              {loading ? (
                <>
                <Spinner size='sm'/>
                <span>loading...</span>
                </>
                ) : 'Sign Up'
               
              }
            </Button>
            <Oauth/>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Have an account ?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
          {error && <Alert className='mt-5'color='failure'>{error}</Alert> }
        </div>
      </div>
    </div>
  )
}
