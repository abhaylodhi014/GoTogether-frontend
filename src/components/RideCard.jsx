import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../service/api';

const RideCard = ({ ride }) => {

//format time from 24 hr system to am/pm system  
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = ride.username;

  useEffect(() => {
    if (!username) return;


//fetch rating of that rideowner
    const fetchRating = async () => {
      setLoading(true);
      try {
        const response = await API.getRatings(username);
        if (response.isSuccess) {
          setRating(response.data.averageRating);
        } else {
          setError('Failed to fetch rating');
        }
      } catch (error) {
        setError('Error fetching rating');
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [username]);

  const formattedDate = new Date(ride.arrivalDate).toLocaleDateString();

  return (
    <div className="border p-5 rounded-lg bg-white shadow-lg transition-transform transform hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="font-bold text-xl text-gray-800">{ride.username}</div>
          <p className='ml-3'>
            {loading ? 'Loading...' : error ? 'Error' : typeof rating === 'string' ? `${rating}⭐` : 'No Rating'}
          </p>
        </div>
        <div className="text-gray-500 text-sm">{formattedDate}</div>
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

      <div className="text-gray-600 mb-3">
        Available Seats: {ride.availableSeats}
      </div>

      <Link to={`/ridePage/${ride._id}`}>
        <p className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition button">
          Take Ride
        </p>
      </Link>
    </div>
  );
};

export default RideCard;
