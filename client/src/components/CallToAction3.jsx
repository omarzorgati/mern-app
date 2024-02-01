import { Button } from 'flowbite-react'
import React from 'react'

export default function CallToActionC() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className='flex-1 justify-center flex flex-col'>
        {/* left side */}
        <h2 className='text-2xl' >Want to learn more about CSS ?</h2>
        <p className='text-gray-500 my-2' >Check out these ressources with CodeAcademy</p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none' >
        <a href="https://www.codecademy.com/learn/learn-css" target='_blank' rel='noopener noreferrer'>
        CodeAcademy</a></Button>
      </div>
      <div className="p-7 flex-1">
        {/* right side */}
        <img src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgHRiJ9JSm8LdO1Xg18zIx0jpxcHHIcMt1AF0Sd2AVWYIQ2ShHB5vJP7ZN5sbfcWrGTM9dStzkBzvxUOmbaLENF57ldzCqayreCJBNiqVtI7Qk1td22dReBUo8Qno3ILmUB-DY5UafMkTYS62dCbWYXfLoCyINU7HNYdh6qfGiuTISApZJSibyatw7d/s1280/css-min.png'/>
            
      </div>
    </div>
  )
}
