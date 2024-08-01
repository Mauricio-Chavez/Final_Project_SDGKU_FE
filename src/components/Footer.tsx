import React from "react";
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 mt-5 mb-0 w-full">
      <div className="w-full max-w-[95%] mx-auto md:py-8">
        <hr className="my-1 border-[#70000e] sm:mx-auto dark:border-[#70000e] lg:my-2" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
            <img src={`${process.env.PUBLIC_URL}/media/logo.png`} className="h-24" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">TutoringHub</span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-[#b27f00] sm:mb-0 dark:text-[#70000e]">
            <li>
              <Link to="/" className="hover:underline me-4 md:me-6">Home</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:underline me-4 md:me-6">Profile</Link>
            </li>
          </ul>
        </div>
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Tutoring Hub™. All Rights Reserved. By Chavez Mauricio & Ugalde Fernanda</span>
      </div>
    </footer>


  );
}

export default Footer;