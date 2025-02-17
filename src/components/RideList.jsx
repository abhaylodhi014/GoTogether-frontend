import { useState, useEffect } from 'react';
import RideCard from './RideCard';
import API from '../service/api';


const RideList = ({ startPoint, destination }) => {
  const [locationFilter, setLocationFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response = await API.getAllRide();
      if (response.isSuccess) {
        setRides(response.data);
      }
    };
    fetchData();
  }, []);

  const currentDate = new Date();

  const filteredRides = rides.filter((ride) => {
    const rideDate = new Date(ride.arrivalDate);
    const enteredDate = dateFilter ? new Date(dateFilter) : null;
    const rideTime = ride.departureTime;
    const enteredTime = timeFilter;

    return (
      // Show only future rides
      rideDate >= currentDate &&
    
      // Mandatory filter based on props (startPoint and destination)
      (!startPoint || ride.startPoint?.toLowerCase().includes(startPoint.toLowerCase())) &&
      (!destination || ride.destination?.toLowerCase().includes(destination.toLowerCase())) &&
    
      // Additional filters based on user inputs
      (locationFilter === '' ||
        (ride.startPoint && ride.startPoint.toLowerCase().includes(locationFilter.toLowerCase())) ||
        (ride.destination && ride.destination.toLowerCase().includes(locationFilter.toLowerCase()))
      )
       &&
      (timeFilter === '' || rideTime >= enteredTime) &&
      (dateFilter === '' || rideDate >= enteredDate)
    );
  });

  return (
    <div className="p-4 bg-gray-200 ">
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">Starting Location</label>
          <input
            type="text"
            placeholder="Search your starting position..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">Arrival Time</label>
          <input
            type="time"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-lg font-semibold text-gray-700 mb-2">Arrival Date</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-400 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
   
    </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => (
            <div key={ride._id}>
              <RideCard ride={ride} />
            </div>
          ))
        ) : (
          <div>No rides available</div>
        )}
      </div>
      
      
    </div>
  );
};

export default RideList;
