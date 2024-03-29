import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Spinner } from 'flowbite-react';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import CartPost from '../components/CartPost';

export default function PostPage() {
const {postSlug} = useParams();
const [loading,setLoading]=useState(true);
const [error,setError]=useState(null);
const [post,setPost]=useState(null);
const [recentPosts,setRecentPosts]=useState(null)
useEffect(()=>{
    //console.log(postSlug);
    const fetchPost = async ()=>{
    try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if(!res.ok){
            setError(data.error);
            setLoading(false);
            return;
        }
        if(res.ok){
            setPost(data.posts[0]);
            setLoading(false);
            setError(null);
        }

        
    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
    }
    fetchPost();
},[postSlug])

useEffect(()=>{
    try {
        const fetchRecentPosts = async ()=>{
            const res = await fetch(`/api/post/getposts?limit=3`);
            const data = await res.json();
            if(res.ok){
                setRecentPosts(data.posts);
                //console.log(recentPosts);
            }
        }
        fetchRecentPosts();
    } catch (error) {
        console.log(error.message);
    }
},[])





  if(loading) 
  return (
  <div className='flex justify-center items-center min-h-screen'>
    <Spinner size='xl' />
  </div>);
  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
    <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
    </Link>
    <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h[600px] w-full object-cover' />
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic' >{post && (post.content.length/1000).toFixed(0)} mins read</span>
    </div>
    <div className='p-3 max-w-2xl mx-auto w-full post-content code-block' dangerouslySetInnerHTML={{__html:post && post.content}} >
    </div>
    <div className="max-w-4xl mx-auto w-full">
        <CallToAction/>
    </div>
    <div className="">
        <CommentSection postId={post._id} />
    </div>
    <div className="flex flex-col justify-center items-center mb-5">
        <h1 className='text-xl mt-5' >Recent Articles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center">
            {
                recentPosts && recentPosts.map((p)=>
                    <CartPost key={p._id} post={p} />
                )
            }
        </div>
    </div>
  </main>
 
  }
