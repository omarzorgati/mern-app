import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashboardProfile from '../components/DashboardProfile';
import Posts from '../components/Posts';
import Users from '../components/Users';
import DashComments from '../components/DashComments';
import DashboardStatistiques from '../components/DashboardStatistiques';

export default function Dashboard() {
  const location = useLocation();
  const [tab,setTab] = useState('');

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    //console.log(tabFromUrl);
    if(tabFromUrl){
    setTab(tabFromUrl);
    }

  },[location.search])


  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar/>
      </div>
        {tab ==='profile' && <DashboardProfile/>}
        {/* profile... */}
        {/* posts... */}
        {tab === 'posts' && <Posts/>}
        {/* users... */}
        {tab === 'users' && <Users/>}
         {/* comments... */}
         {tab === 'comments' && <DashComments/>}
         {/* statistiques... */}
         {tab === 'dash' && <DashboardStatistiques/>}

           

        

     
    </div>
  )
}
