import { useState, useEffect } from 'react';
import RideList from './RideList';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

export default function HomePage({ showAlert }) {
    //state variable to set and get data
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');

   //fetch user current location   
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setStartCoords([latitude, longitude]); // Set initial starting point as user's location
      },
      (error) => {
        console.error('Error fetching location:', error);
        showAlert('Unable to fetch your location.');
      }
    );
  }, []);

// function to get coordinates from place name and update the usestate of coordinate  
  const getCoordinates = async (place, setCoordinates) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoordinates([lat, lon]);
      } else {
        showAlert(`Location not found: ${place}`);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      showAlert('Failed to get location coordinates.');
    }
  };

  //when user click on search ride then we get coordinates and we route between starting and ending point 
  const handleSearch = async () => {
    if (!map) return;
    if (startPoint.trim() === '' || endPoint.trim() === '') {
      showAlert('Please enter both starting point and destination.');
      return;
    }
//getting coordinates
    if (startPoint.trim() !== '') await getCoordinates(startPoint, setStartCoords);
    await getCoordinates(endPoint, setEndCoords);
  };
//if we have startcoordinates and endcoordinates then remove previous route and draw new route
  useEffect(() => {
    if (map && startCoords && endCoords) {
      if (routingControl) {
        map.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: [L.latLng(startCoords[0], startCoords[1]), L.latLng(endCoords[0], endCoords[1])],
        routeWhileDragging: true,
      }).addTo(map);
// adjust map view to show whole route
      newRoutingControl.on('routesfound', function (e) {
        const route = e.routes[0];
        const bounds = L.latLngBounds(route.coordinates);
        map.fitBounds(bounds);
      });

      setRoutingControl(newRoutingControl);
    }
  }, [startCoords, endCoords, map]);
//function to handle marker for current location and endtered locations  

  function Markers() {
    const map = useMap();

    useEffect(() => {
      if (startCoords) {
        map.setView(startCoords, 13);
      }
    }, [startCoords]);

    return (
      <>
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>You are here!</Popup>
          </Marker>
        )}
        {startCoords && startPoint && (
          <Marker position={startCoords}>
            <Popup>Starting Point: {startPoint}</Popup>
          </Marker>
        )}
        {endCoords && (
          <Marker position={endCoords}>
            <Popup>Destination: {endPoint}</Popup>
          </Marker>
        )}
      </>
    );
  }

  return (
    <>
      {username ? (
        <div className="h-400px relative z-40">
          {userLocation && (
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '60vh', width: '100vw' }}
              whenCreated={setMap}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Markers />
            </MapContainer>
          )}

          <div className="absolute z-400 right-1 top-1 bg-white p-4 rounded-3xl shadow-lg w-52 md:w-65">
            <h2 className="text-2xl font-bold mb-2 text-center text-gray-500">Find a Ride</h2>
            <input
              type="text"
              value={startPoint}
              placeholder="Starting Point (e.g., IIT Indore)"
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <input
              type="text"
              value={endPoint}
              placeholder="Destination (e.g., Mumbai)"
              onChange={(e) => setEndPoint(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <button
              onClick={handleSearch}
              className="button mx-auto"
              disabled={!map}
            >
              Search Ride
            </button>
          </div>

          <div className="bg-white w-full">
            <RideList startPoint={startPoint} destination={endPoint} />
          </div>
        </div>
      ) : (
        <div className="flex-col w-full justify-center items-center bg-gray-100 p-6 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Access Restricted</h1>
          <p className="text-gray-600 mb-6 text-center">
            To view available rides from other users, please sign in or create an account.
          </p>
          <div className="flex justify-around gap-4">
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              onClick={() => navigate('/auth')}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </>
  );
}
