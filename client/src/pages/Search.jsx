import { Button, Select, Spinner, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import CartPost from '../components/CartPost';

export default function Search() {

  const[sideBarData,setSideBarData]=useState({
    searchTerm:'',
    sort:'desc',
    category:'uncategorized',

  });
  const [posts,setPosts]=useState([]);
  const [loading,setLoading]=useState(false);
  const [showMore,setShowMore]= useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  console.log(sideBarData);

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');
    if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
        setSideBarData({...sideBarData,
            searchTerm:searchTermFromUrl,
            sort:sortFromUrl,
            category:categoryFromUrl,
        });
    }
    const fetchPosts=async()=>{
        setLoading(true);
        const searchQuery= urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if(!res.ok){
            setLoading(false);
            return;
        }
        if(res.ok){
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            if(data.posts.length===9){
                setShowMore(true);
            }else{
                setShowMore(false);
            }
        }
    }
    fetchPosts();
  },[location.search])

  const handleChange =(e)=>{
    if(e.target.id==='searchTerm'){
        setSideBarData({...sideBarData,searchTerm:e.target.value});
    }
    if(e.target.id==='sort'){
        const order = e.target.value || 'desc';
        setSideBarData({...sideBarData,sort:order});
    }
    if(e.target.id==='category'){
        const category = e.target.value || 'uncategorized';
        setSideBarData({...sideBarData,category:category});
    }
  }
  //when we search the url changes
  const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',sideBarData.searchTerm);
    urlParams.set('sort',sideBarData.sort);
    urlParams.set('category',sideBarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  const handleShowMore=async()=>{
    const numberOfPosts = posts.length;
    const startIndex=numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex',startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`api/post/getposts?${searchQuery}`)
      const data = await res.json()
      if(!res.ok){
        return;
      }
      if(res.ok){
        setPosts((prev)=>[...prev,...data.posts])
        if(data.posts.length===9){
          setShowMore(true);
        }else{
            setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-1 border-b md:border-r border-gray-500 md:min-h-screen">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 ">
                <label className='whitespace-nowrap font-semibold'>Search Term :</label>
                <TextInput placeholder='Search...' id='searchTerm' type='text'
                value={sideBarData.searchTerm} onChange={handleChange}/>
            </div>
            <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>Sort :</label>
                <Select id='sort' value={sideBarData.sort} onChange={handleChange}>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>Category :</label>
                <Select id='category' value={sideBarData.category} onChange={handleChange}>
                    <option value='uncategorized'>uncategorized</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                    <option value='javascript'>JavaScript</option>
                </Select>
            </div>
            <Button type='submit' outline gradientDuoTone='purpleToBlue'>Search</Button>
        </form>
      </div>
        <div className="w-full">
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results :</h1>
            <div className="gap-4 p-7 flex-wrap lg:flex ">
            {
                !loading && posts.length === 0 && (<p className='text-xl text-gray-500'>No posts found.</p>
            )}
            {
                loading && (<div className="flex justify-center items-center"><Spinner size='xl' /></div>)
            }
            {
                !loading && posts  && posts.map((post)=>(
                    <CartPost key={post._id} post={post} />
                ))
            }
             {
            showMore && (
              <button onClick={handleShowMore} className='self-center w-full text-sm text-teal-500 py-7 hover:underline'>Show More...</button>
            )
          }
        </div>
       
        </div>
    </div>
  )
}
