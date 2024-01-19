import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider,getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/user.slice.js';
import { useNavigate } from 'react-router-dom';



export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const handleGoogleClick = async()=>{
        const provider = new GoogleAuthProvider();
        //in order to select an account every time u click continue with google
        provider.setCustomParameters({prompt:'select_account'});
        try {
            const resultsFromGoogle = await signInWithPopup(auth,provider)
            //console.log(resultsFromGoogle);
            const res = await fetch('/api/auth/google',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    name:resultsFromGoogle.user.displayName,
                    email:resultsFromGoogle.user.email,
                    GooglePhotoUrl:resultsFromGoogle.user.photoURL,
                }),    
            })
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/')

        } catch (error) {
            console.log("could not sing in with google",error);
        }
    }



  return (
    <Button onClick={handleGoogleClick} type='button' gradientDuoTone='purpleToBlue' outline>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with google
    </Button>
  )  
}
