import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../service/api.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import Replies from './Replys.jsx';
const RidePage = ({ showAlert }) => {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  const loggedInUsername = sessionStorage.getItem('username');

  const formatTime = (time) => {
    if (!time) return 'Invalid Time'; // or some fallback text
  
    const [hour, minute] = time.split(':');
    const hourInt = parseInt(hour, 10);
    const amPm = hourInt >= 12 ? 'PM' : 'AM';
    const formattedHour = hourInt % 12 || 12; // convert 0 to 12
  
    return `${formattedHour}:${minute} ${amPm}`;
  };

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!id) return;
      try {
        const response = await API.getRideById(id);
        if (response.isSuccess) {
          const rideData = response.data;
          setRide(rideData);
          setFormData(rideData);
          showAlert('Ride details fetched successfully', 'success');
          
        } else {
          showAlert('Failed to fetch ride details', 'error');
        }
      } catch (error) {
       
        showAlert('Error fetching ride details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ride?')) {
      const response = await API.deleteRide(id);
      if (response.isSuccess) {
        showAlert('Ride deleted successfully!', 'info');
        navigate('/');
      } else {
        showAlert('Failed to delete ride. Try again later.', 'error');
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await API.updateRide(formData);
      if (response.isSuccess) {
        setRide(formData);
        setIsEditing(false);
        showAlert('Ride updated successfully!', 'success');
      } else {
        showAlert('Failed to update ride.', 'error');
      }
    } catch (error) {
      showAlert('Error updating ride.', 'error');
    }
  };

  if (loading) return <p className="text-center">Loading ride details...</p>;
  if (!ride) return <p className="text-center">Ride not found!</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-gray-600">Ride Details</h1>

      {isEditing ? (
  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Vehicle Name */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Vehicle Name</label>
      <input
        type="text"
        name="vehicleName"
        value={formData.vehicleName}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Departure Point */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Departure Point</label>
      <input
        type="text"
        name="startPoint"
        value={formData.startPoint}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Departure Date */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Departure Date</label>
      <input
        type="date"
        name="departureDate"
        value={formData.departureDate}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Departure Time */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Departure Time</label>
      <input
        type="time"
        name="departureTime"
        value={formData.departureTime}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Destination */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Destination</label>
      <input
        type="text"
        name="destination"
        value={formData.destination}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Arrival Date */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Arrival Date</label>
      <input
        type="date"
        name="arrivalDate"
        value={formData.arrivalDate}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Arrival Time */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Arrival Time</label>
      <input
        type="time"
        name="arrivalTime"
        value={formData.arrivalTime}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Total Seats */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Total Seats</label>
      <input
        type="number"
        name="totalSeats"
        value={formData.totalSeats}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Available Seats */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Available Seats</label>
      <input
        type="number"
        name="availableSeats"
        value={formData.availableSeats}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Price per Seat */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Price per Seat (₹)</label>
      <input
        type="number"
        name="sharingPrice"
        value={formData.sharingPrice}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Total Price */}
    <div className="col-span-1">
      <label className="block text-sm font-bold">Total Price (₹)</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
      />
    </div>

    {/* Vehicle Description */}
    <div className="col-span-2">
      <label className="block text-sm font-bold">Vehicle Description</label>
      <textarea
        name="vehicleDescription"
        value={formData.vehicleDescription}
        onChange={handleInputChange}
        className="w-full input p-2 border rounded"
        rows="3"
      />
    </div>

    {/* Buttons */}
    <div className="col-span-2 flex gap-4 mt-4">
      <button
        type="button"
        onClick={handleSaveChanges}
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Changes
      </button>
      <button
        type="button"
        onClick={handleEditToggle}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </div>
  </form>


      ) : (
        <div className="bg-white px-4 pb-5 rounded-lg">
  <h2 className="text-2xl font-bold mb-4 text-gray-500">{ride.username} </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
    <p><strong>Vehicle:</strong> {ride.vehicleName}</p>
    <p><strong>Departure:</strong> {new Date(ride.departureDate).toDateString()}  at {formatTime(ride.departureTime)}</p>
    <p><strong>StartPoint:</strong> {ride.startPoint}</p>
    <p><strong>Destination:</strong> {ride.destination}</p>
    
    <p><strong>Arrival:</strong> {new Date(ride.arrivalDate).toDateString()} at {formatTime(ride.arrivalTime)}</p>
    <p><strong>Total Seats:</strong> {ride.totalSeats}</p>
    <p><strong>Available Seats:</strong> {ride.availableSeats}</p>
    <p><strong>Price per Seat:</strong> ₹{ride.sharingPrice}</p>
    <p><strong>Total Price:</strong> ₹{ride.price}</p>
    <div className="md:col-span-2">
      <p><strong>Description:</strong> {ride.vehicleDescription}</p>
    </div>
  </div>

  {loggedInUsername === ride.username && (
    <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
      <button
        onClick={handleEditToggle}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faPen} className="mr-2" /> Update
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
      </button>
    </div>
  )}
</div>

      )}
      <div>
       <Link to={`/rating/${ride.username}`} key={ride._id}>
         <p className='text-blue-500 mx-3 hover:text-blue-700 font-bold text-lg hover:underline'>Give Rating ⭐ </p>
        </Link>
        <Replies ride={ride} showAlert={showAlert}/>
      </div>
    </div>
  );
};

export default RidePage;
