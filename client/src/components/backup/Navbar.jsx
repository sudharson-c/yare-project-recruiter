// eslint-disable-next-line no-unused-vars
import React from 'react'
import './Navbar.css'


function Navbar() {
  return <>
  <div className='navbar'>
    <div className='brand'>
        <a href="/">Yare</a>
    </div>
    <div>
        <ul>
            <li><a href='#'>My Projects</a></li>
            <li><a href='#'>Community</a></li>
            <li><a href='#'>About</a></li>

        </ul>
    </div>
  </div>
  </>;
}

export default Navbar;