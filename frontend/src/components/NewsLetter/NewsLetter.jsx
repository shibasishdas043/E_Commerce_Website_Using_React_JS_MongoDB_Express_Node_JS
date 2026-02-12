import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
      <div className='newsletter'>
          <h1>
              Get exclusive Components On your Email
          </h1>
          <p> 
              Subscribe To Our News Letter And Stay Updated
          </p>
          <div>
              <input id='form' type="email" placeholder='Your Email id' />
              <button>Subscribe</button>
          </div>
          
    </div>
  )
}

export default NewsLetter