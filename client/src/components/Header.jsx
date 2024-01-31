import { useSelector,useDispatch } from 'react-redux'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon,FaSun} from 'react-icons/fa'
import { toggleTheme } from '../redux/theme/theme.slice.js'
import { signoutUserFailure, signoutUserStart, signoutUserSucess } from '../redux/user/user.slice.js'
import { useEffect, useState } from 'react'

export default function Header() {
    //in order to know when we are in home page in the menu and active it(get a color when we are at home page)
    const path = useLocation().pathname;
    const {currentUser} = useSelector((state)=>state.user)
    const {theme} = useSelector((state)=>state.theme)
    const dispatch = useDispatch();
    const [searchTerm,setSearchTerm]=useState('');
    const location = useLocation();
    const navigate = useNavigate();

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

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])
    
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);

    }


  return (
    <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white' >
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
            Omar's</span>
            Blog
        </Link>
        <form onSubmit={handleSubmit} className='flex items-center' >
            <div className="relative">
            <TextInput type='text' placeholder='search...'  
            className='inline' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            <button className='absolute right-0 top-0 h-full px-4 rounded-r'><AiOutlineSearch/></button>
            </div>
        </form>
        <div className="flex gap-2 md:order-2">
            <Button onClick={()=>dispatch(toggleTheme())} className='w-12 h-10 hidden sm:inline'color='gray' pill >
                {theme==='light'?<FaSun/>:<FaMoon/>}
            </Button>
            {currentUser ? (
                <Dropdown arrowIcon={false} inline label = {<Avatar alt='user' img={currentUser.profilePicture} rounded />}>
                    <Dropdown.Header>
                        <span className='block text-sm'>{currentUser.username}</span>
                        <span className='block truncate text-sm font-medium'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
                </Dropdown>
            )
            :( <Link to='sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
        </Link>)}
           
            <Navbar.Toggle/>
        </div>
        <Navbar.Collapse>
{/* navbartoggle it make them  menu/navbarcollapse it appears in smaller size/in order to resolve this bug because we are having 2 'a' tags 2 link tags we change one of them to be a div  */}
                <Navbar.Link active={path==='/'} as={'div'} >
                    <Link to='/'>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/about'} as={'div'} >
                    <Link to='/about'>About</Link>
                </Navbar.Link>
                <Navbar.Link active={path==='/projects'} as={'div'} >
                    <Link to='/projects'>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
    </Navbar>
  )
}
