import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToActionH() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className='flex-1 justify-center flex flex-col'>
        {/* left side */}
        <h2 className='text-2xl' >Want to learn more about HTML ?</h2>
        <p className='text-gray-500 my-2' >Check out these ressources with W3Schools</p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none' >
        <a href="https://www.w3schools.com/html/" target='_blank' rel='noopener noreferrer'>
        W3Schools</a></Button>
      </div>
      <div className="p-7 flex-1">
        {/* right side */}
        <img src='https://www.dreamhost.com/blog/wp-content/uploads/2022/06/Learn-HTML-Fast-ES.png'/>
            
      </div>
    </div>
  )
}
