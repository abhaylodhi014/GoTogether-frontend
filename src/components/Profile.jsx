import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../service/api.js';
import { Link } from 'react-router-dom';

const Profile = ({ showAlert }) => {
  const email = sessionStorage.getItem('email');
  const username = sessionStorage.getItem('username');
  const photoURL = sessionStorage.getItem('photoURL');
  const [userRides, setUserRides] = useState([]);
  const navigate = useNavigate();
  const [rating, setRating] = useState(null);


  //formattime function that conver 24 hr system to am and pm system
  const formatTime = (time) => {
    if (!time) return 'Invalid Time';
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const amPm = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${amPm}`;
  };

  useEffect(() => {
    if (!username) return;
//fetch all ride and select ride that are upload by currentuser by use of username
    const fetchRides = async () => {
      try {
        const response = await API.getAllRide();
        if (response.isSuccess) {
          const userSpecificRides = response.data.filter((ride) => ride.username === username);
          setUserRides(userSpecificRides);
        }
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };
//fetch average rating from backend 
    const fetchRating = async () => {
      const response = await API.getRatings(username);
      if (response.isSuccess) {
        setRating(response.data.averageRating);
      }
    };

    fetchRating();
    fetchRides();
  }, [username]);


// generate start based on ratings 
  const renderStars = () => {
    const stars = [];
    const filledStars = Math.round(rating); 
    // Round the rating for full stars

    // Create full stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-yellow-400 "
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 17.75l-6.12 3.215 1.17-7.216-5.232-5.1 7.219-.883L12 .25l3.98 7.871 7.22.883-5.231 5.1 1.171 7.216L12 17.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

  // Create empty stars for the rest
    for (let i = filledStars; i < 5; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 17.75l-6.12 3.215 1.17-7.216-5.232-5.1 7.219-.883L12 .25l3.98 7.871 7.22.883-5.231 5.1 1.171 7.216L12 17.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return stars;
  };

  //if user want to loguout then clear all detail store in sessionstorage like accesstoken and refreshtoken username , email and then new user login with new token
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/auth');
  };

  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4">
        <h1 className="text-3xl font-semibold text-gray-800">You are not signed in!</h1>
        <p className="text-gray-600 mt-2">Please sign in to view your profile and rides.</p>
        <button
          onClick={() => navigate('/auth')}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  //acess today date and separate the ride based on today day as pending and completed ride 
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  //if ride have arrivaldate > today then its pendign otherwise its previous
  const pendingRides = userRides.filter((ride) => new Date(ride.arrivalDate) >= today);
  const completedRides = userRides.filter((ride) => new Date(ride.arrivalDate) < today);

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-100">
      <div className="bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center">
        <img
          src={photoURL || '/profile.jpg'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-2 border-gray-300 mb-4 md:mb-0 md:mr-6"
        />
        <div className=''>
          <h1 className="text-2xl font-bold text-gray-800">@{username}</h1>
          <p className="text-gray-700">{email}</p>
          <div className="flex space-x-1"><p className="text-gray-700">{rating ||  "N/A"}</p>
          {renderStars()}
          </div>
          <button
            onClick={handleLogout}
            className=" text-blue-500 px-4 hover:text-blue-700 font-bold text-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">Pending Rides</h2>
        {pendingRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {pendingRides.map((ride) => (
              <Link to={`/ridePage/${ride._id}`} key={ride._id}>
              <div key={ride._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-gray-800">{ride.username}</div>
                  <div className="text-gray-500 text-sm">{new Date(ride.arrivalDate).toDateString()}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-gray-700 font-semibold">{ride.startPoint} ➡️ {ride.destination}</p>
                  <p className="text-gray-500 text-sm mt-1">Vehicle: {ride.vehicleName}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-green-600 font-bold">Price: ₹{ride.price}</p>
                  <p className="text-blue-500 font-bold">Sharing: ₹{ride.sharingPrice}</p>
                </div>
                <div className="text-gray-600 mb-3">
                  Time: {formatTime(ride.arrivalTime)} - {formatTime(ride.departureTime)}
                </div>
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No pending or current rides.</p>
        )}

        <h2 className="text-xl font-semibold text-gray-800 mt-8">Previous Rides</h2>
        {completedRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {completedRides.map((ride) => (
              <div key={ride._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-xl text-gray-800">{ride.username}</div>
                  <div className="text-gray-500 text-sm">{new Date(ride.arrivalDate).toDateString()}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg mb-3">
                  <p className="text-gray-700 font-semibold">{ride.startPoint} ➡️ {ride.destination}</p>
                  <p className="text-gray-500 text-sm mt-1">Vehicle: {ride.vehicleName}</p>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-green-600 font-bold">Price: ₹{ride.price}</p>
                  <p className="text-blue-500 font-bold">Sharing: ₹{ride.sharingPrice}</p>
                </div>
                <div className="text-gray-600 mb-3">
                  Time: {formatTime(ride.arrivalTime)} - {formatTime(ride.departureTime)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">No completed or previous rides.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
