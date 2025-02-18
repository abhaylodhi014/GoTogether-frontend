import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../service/api";

export default function CreateRide({ showAlert }) {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  // Redirect to auth page if username is not found
  if (!username) {
    showAlert("For creating a ride, you need to be logged in.", "error");
    navigate("/auth");
  }

  const initialRideDetails = {
    username: username,
    vehicleName: "",
    startPoint: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    totalSeats: 0,
    availableSeats: 0,
    price: 0,
    sharingPrice: 0,
    vehicleDescription: "",
  };

  const [ride, setRide] = useState(initialRideDetails);
  const [loading, setLoading] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRide({ ...ride, [name]: value });
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate fields before submitting
    if (ride.totalSeats <= 0 || ride.availableSeats <= 0 || ride.price <= 0 || ride.sharingPrice <= 0) {
      showAlert("Please make sure all fields are filled correctly.", "warning");
      setLoading(false);
      return;
    }

    try {
//create ride api call
      let response = await API.createRide(ride);
      if (response.isSuccess) {
        showAlert("Ride Created Successfully", "success");
        navigate('/');
      } else {
        showAlert("Failed to create ride. Please try again.", "info");
      }
    } catch (error) {
      showAlert("Something went wrong. Check your internet connection.", "warning");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-gray-200 p-3 rounded-2xl shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Create a Ride</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="vehicleName"
              name="vehicleName"
              value={ride.vehicleName}
              onChange={handleChange}
              placeholder="Enter vehicle name"
              className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="startPoint"
              name="startPoint"
              value={ride.startPoint}
              onChange={handleChange}
              placeholder="Enter starting point"
              className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="destination"
              name="destination"
              value={ride.destination}
              onChange={handleChange}
              placeholder="Enter destination"
              className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="arrivalDate" className="block text-sm font-bold text-gray-700">Arrival Date</label>
              <input
                type="date"
                id="arrivalDate"
                name="arrivalDate"
                value={ride.arrivalDate}
                onChange={handleChange}
                className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="arrivalTime" className="block text-sm font-bold text-gray-700">Arrival Time</label>
              <input
                type="time"
                id="arrivalTime"
                name="arrivalTime"
                value={ride.arrivalTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 input focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="departureDate" className="block text-sm font-bold text-gray-700">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={ride.departureDate}
                onChange={handleChange}
                className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="departureTime" className="block text-sm font-bold text-gray-700">Departure Time</label>
              <input
                type="time"
                id="departureTime"
                name="departureTime"
                value={ride.departureTime}
                onChange={handleChange}
                className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="totalSeats" className="block text-sm font-bold text-gray-700">Total Seats</label>
              <input
                type="number"
                id="totalSeats"
                name="totalSeats"
                value={ride.totalSeats}
                onChange={handleChange}
                placeholder="Enter total seats"
                className="w-full border border-gray-300 rounded-lg p-2 input focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="availableSeats" className="block text-sm font-bold text-gray-700">Available Seats</label>
              <input
                type="number"
                id="availableSeats"
                name="availableSeats"
                value={ride.availableSeats}
                onChange={handleChange}
                placeholder="Enter available seats"
                className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-bold text-gray-700">Total Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={ride.price}
                onChange={handleChange}
                placeholder="Enter total price"
                className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="sharingPrice" className="block text-sm font-bold text-gray-700">Sharing Price per Seat</label>
              <input
                type="number"
                id="sharingPrice"
                name="sharingPrice"
                value={ride.sharingPrice}
                onChange={handleChange}
                placeholder="Enter sharing price"
                className="w-full border border-gray-300 rounded-lg p-2 input focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="vehicleDescription" className="block text-sm font-bold text-gray-700">Description</label>
            <textarea
              id="vehicleDescription"
              name="vehicleDescription"
              value={ride.vehicleDescription}
              onChange={handleChange}
              placeholder="Enter Description Ex:(only boys)"
              className="w-full border input border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full button"
            disabled={loading}
          >
            {loading ? "Creating Ride..." : "Share Ride"}
            <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
