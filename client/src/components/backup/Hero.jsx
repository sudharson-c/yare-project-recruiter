// eslint-disable-next-line no-unused-vars
import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <div className='hero'>
      <div className='hero-content'>
        <img src="/hero.svg" alt="" className='hero'/>
        <h1>Welcome to <span className='hero-brand'>Yare</span></h1>
        <p>Your ultimate project management and collaboration tool</p>
        <a href="#get-started" className="btn">Get Started</a>
      </div>
      <div className="features">
        <div className="feature">
          <img src="/hero.svg" alt="" />
          <h3>Feature 1</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
        </div>
        <div className="feature">
          <img src="/hero.svg" alt="" />
          <h3>Feature 2</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
        </div>
        <div className="feature">
          <img src="/hero.svg" alt="" />
          <h3>Feature 3</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.</p>
        </div>
      </div>
      <button><a href="/">Get Started Free</a></button>
    </div>
  );
}

export default Hero;
