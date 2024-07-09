// eslint-disable-next-line no-unused-vars
import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="flex justify-between bg-black text-azure-50 p-5 text-center items-center mt-4 text-white">
        <p>Copyrights @2024</p>
        <a href="#" className="no-underline text-azure-50">Terms and Conditions</a>
        <ul className="flex gap-4 list-none">
            <li><a href="/" className="no-underline text-azure-50">Home</a></li>
            <li><a href="/" className="no-underline text-azure-50">About</a></li>
            <li><a href="/" className="no-underline text-azure-50">Contact</a></li>
        </ul>
      </footer>
    </>
  );
}

export default Footer;
