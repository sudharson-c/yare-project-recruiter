// eslint-disable-next-line no-unused-vars
import React from "react";

const Footer = () => {
  return (
    <footer className="bottom-0 mt-5 left-0 w-full bg-black text-white p-4 flex justify-between items-center">
      <p className="text-sm">&copy; 2024 Yare</p>
      <a href="#" className="text-sm hover:text-gray-300">
        Terms and Conditions
      </a>
      <ul className="flex gap-4">
        <li>
          <a href="/" className="text-sm hover:text-gray-300">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="text-sm hover:text-gray-300">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="text-sm hover:text-gray-300">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
