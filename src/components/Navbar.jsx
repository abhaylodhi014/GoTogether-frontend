import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faBars, faTimes, faComments } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from 'react-router-dom';
import API from '../service/api';

const Navbar = ({showAlert}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userName, setUserName] = useState("");

  const location = useLocation();
  const pathname = location.pathname;

  // Get username from sessionStorage when component mounts
  useEffect(() => {
    const User = sessionStorage.getItem('username');
    if (User) {
      setUserName(User);
    }
  }, []);

  // Fetch notifications related to the current user (unique other persons)
  useEffect(() => {
    const fetchReplies = async () => {
      if (!userName){
     
        return;
      } 

      try {
        const response = await API.getReplies();
        if (response.isSuccess) {
          const replies = response.data;

          // Extract unique other persons
          const otherPersons = new Set();

          replies.forEach((reply) => {
            if (reply.sender === userName) {
              otherPersons.add(reply.receiver);
            } else if (reply.receiver === userName) {
              otherPersons.add(reply.sender);
            }
          });

          setNotifications(otherPersons.size);
        }
      } catch (error) {
        console.error("Failed to fetch replies:", error);
        
      }
    };

    fetchReplies();

    // Optional polling (every 5 seconds)
    const interval = setInterval(fetchReplies, 5000);
    return () => clearInterval(interval);
  }, [userName]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="navbar z-50 flex items-center justify-between h-[70px] pr-4 pl-1 bg-[#0c0c0c] text-white">
      <div className="flex items-center">
        <img src="/car.png" alt="GoTogether Logo" className="w-12 h-8" />
        <Link to="/">
          <h1 className="text-2xl font-bold">GoTogether</h1>
        </Link>
      </div>

      <div className="flex gap-4 ml-2">
        <div className="flex items-center gap-4">
          <Link to="/chatsection">
            <div className="relative cursor-pointer">
              <FontAwesomeIcon icon={faComments} className="text-xl hover:text-blue-500" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </div>
          </Link>

          <div onClick={toggleMenu} className="sm:hidden cursor-pointer">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-2xl" />
          </div>
        </div>

        <div
          className={`links z-550 ${isMenuOpen ? 'flex gap-4' : 'hidden'
            } sm:flex flex-col sm:flex-row absolute sm:static top-[70px] left-0 right-0 bg-[#0c0c0c] p-4 sm:p-0 z-850 sm:gap-8 items-center`}
        >
          <Link to="/" className={`navLink ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`navLink ${pathname === '/about' ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/createRide" className={`navLink ${pathname === '/createRide' ? 'active' : ''}`}>
            Create-Ride
          </Link>
          <Link to="/contact" className={`navLink ${pathname === '/contact' ? 'active' : ''}`}>
            ContactUs
          </Link>

          <div className="flex items-center">
            <Link to="/profile">
              <FontAwesomeIcon icon={faUserCircle} className="text-2xl hover:text-blue-600" />
            </Link>
            <div className="ml-2">
              {userName ? <p>{userName.split(' ')[0]}</p> : <Link to="/auth" className="navLink">Login</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
