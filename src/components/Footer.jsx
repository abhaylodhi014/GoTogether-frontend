import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-br  from-blue-900 to-black w-full text-white py-8 px-4">
      <div className="container flex flex-wrap justify-between items-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">GoTogether</h2>
          <p className="text-sm mt-1">Share your rides, connect with travelers, and save together!</p>
        </div>

        <div className="flex space-x-4 mb-4">
          <a href="#" className="text-white hover:text-blue-400 transition"><FaFacebookF /></a>
          <a href="#" className="text-white hover:text-pink-400 transition"><FaInstagram /></a>
          <a href="#" className="text-white hover:text-blue-300 transition"><FaTwitter /></a>
          <a href="#" className="text-white hover:text-blue-600 transition"><FaLinkedinIn /></a>
        </div>

        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <FaPhoneAlt />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaEnvelope />
            <span>contact@gotogether.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt />
            <span>IIT Indore, Madhya Pradesh, India</span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs mt-4 text-gray-400">
        © {new Date().getFullYear()} GoTogether. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
