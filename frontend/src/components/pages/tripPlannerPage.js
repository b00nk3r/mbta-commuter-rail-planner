import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TripPlannerPage = () => {
  const [startStation, setStartStation] = useState('');
  const [stopStation, setStopStation] = useState('');
  const [isStationSelected, setIsStationSelected] = useState(false);
  const [stations, setStations] = useState([]);
  const massachusettsBounds = [[41.237964, -73.508142], [42.886589, -69.928393]];

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const API_BASE_URL = 'http://localhost:8081';
        const response = await axios.get(`${API_BASE_URL}/mbtaStops/getAll`);
        if (Array.isArray(response.data)) {
          setStations(response.data);
        } else {
          setStations([]); // Set empty array if data is invalid
        }
      } catch (error) {
        console.error('Error fetching stations:', error);
        setStations([]);
      }
    };

    fetchStations();
  }, []);

  const handleStartSelection = (e) => {
    setStartStation(e.target.value);
    checkBothStationsSelected(e.target.value, stopStation);
  };

  const handleStopSelection = (e) => {
    setStopStation(e.target.value);
    checkBothStationsSelected(startStation, e.target.value);
  };

  const checkBothStationsSelected = (start, stop) => {
    setIsStationSelected(start !== '' && stop !== '');
  };

  const sortedStations = [...stations].sort((a, b) =>
    a.stationName.localeCompare(b.stationName)
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-800">Trip Planner</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-96 bg-gray-100 p-6 overflow-y-auto shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Start</h2>
            <div className="relative">
              <select
                value={startStation}
                onChange={handleStartSelection}
                className="w-full p-3 border border-gray-300 rounded text-lg appearance-none"
              >
                <option value="">Select a station</option>
                {sortedStations.map(station => (
                  <option key={station._id} value={station.stationName}>
                    {station.stationName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Stop</h2>
            <div className="relative">
              <select
                value={stopStation}
                onChange={handleStopSelection}
                className="w-full p-3 border border-gray-300 rounded text-lg appearance-none"
              >
                <option value="">Select a station</option>
                {sortedStations.map(station => (
                  <option key={station._id} value={station.stationName}>
                    {station.stationName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {!isStationSelected && (
              <p className="text-red-700 mt-2 text-lg">
                Please select both a start and stop station
              </p>
            )}
          </div>
        </div>

        {/* Right Panel - Map and Station Info */}
        <div className="flex-1 flex flex-col relative">

          {/* Map Section */}
          <div className="flex-1 relative">
            <MapContainer
              center={[42.360082, -71.058880]} // Boston coordinates
              zoom={13}
              minZoom={9}  // 🔽 Set minimum zoom level
              maxZoom={11}  // 🔼 Set maximum zoom level
              maxBounds={massachusettsBounds}
              maxBoundsViscosity={1.0}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
              />


              {stations.map(station => {
                if (station.latitude != null && station.longitude != null) {
                  return (
                    <CircleMarker
                      key={station._id}
                      center={[station.latitude, station.longitude]}
                      radius={6}
                      pathOptions={{ fillColor: '#7B388C', color: '#7B388C', fillOpacity: 0.7 }}
                    >
                      <Popup>
                        <div style={{ width: '200px' }}>
                          <h3 className="font-bold text-lg mb-1">{station.stationName}</h3>
                          <p className="text-sm text-gray-700">DESCRIPTION COMING SOON</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                } else {
                  return null;
                }
              })}

            </MapContainer>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-200 p-4 flex justify-end">
        <button
          className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-8 rounded text-xl"
          disabled={!isStationSelected}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TripPlannerPage;