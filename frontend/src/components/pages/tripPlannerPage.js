import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
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

const TERMINALS = {
  "north": ["CR-Fitchburg", "CR-Lowell", "CR-Haverhill", "CR-Newburyport"],
  "sstat": ["CR-Fairmount", "CR-Worcester", "CR-Franklin", "CR-Providence", "CR-Kingston", "CR-Needham", "CR-Greenbush", "CR-NewBedford"]
};

const LINE_TO_PREFIX_MAP = {
  "CR-Fairmount": ["DB"],
  "CR-NewBedford": ["NBM", "FRS", "MM", "brntn", "qnctr", "jfk"],
  "CR-Fitchburg": ["FR", "portr", "north"],
  "CR-Worcester": ["WML", "bbsta"],
  "CR-Franklin": ["FB", "forhl", "rugg"],
  "CR-Foxboro": ["FS"],
  "CR-Greenbush": ["GRB"],
  "CR-Haverhill": ["WR", "ogmnl", "mlmnl"],
  "CR-Kingston": ["KB", "PB", "brntn", "qnctr", "jfk"],
  "CR-Lowell": ["NHRML"],
  "CR-Needham": ["NB", "forhl", "rugg"],
  "CR-Newburyport": ["GB", "ER", "wondl", "chels"],
  "CR-Providence": ["NEC", "bbsta"],
  "Common-Stations": ["sstat", "north"]
};

const getStationPrefix = (stationId) => {
  if (!stationId) return "";
  
  // Handle special cases for stations without dashes
  if (!stationId.includes("-")) {
      return stationId;
  }
  
  const parts = stationId.split("-");
  if (parts.length < 2) return "";
  
  return parts[1];
};

const decodePolyline = (encoded) => {
  const points = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
};

const flattenRouteLines = (routeData) => {
  if (!routeData || typeof routeData !== 'object') return [];
  
  const flattenedRoutes = [];
  
  Object.keys(routeData).forEach(routeKey => {
    if (Array.isArray(routeData[routeKey])) {
      flattenedRoutes.push(...routeData[routeKey]);
    }
  });
  
  return flattenedRoutes;
};

const TripPlannerPage = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedLineId, setSelectedLineId] = useState('');
  const [startStation, setStartStation] = useState('');
  const [stopStation, setStopStation] = useState('');
  const [isStationSelected, setIsStationSelected] = useState(false);
  const [stations, setStations] = useState([]);
  const [lines, setLines]  = useState([]);
  const massachusettsBounds = [[41.237964, -73.508142], [42.886589, -69.928393]];
  const [routeLines, setRouteLines] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = 'http://localhost:8081';
        const response = await axios.get(`${API_BASE_URL}/mbtaStops/getAll`);
        if (Array.isArray(response.data)) {
          setStations(response.data);
        } else {
          setStations([]);
        }

        const routesResponse = await axios.get(`${API_BASE_URL}/mbtaShapes/getAll`);
        const flattenedRoutes = flattenRouteLines(routesResponse.data);
        console.log("Route data structure:", flattenedRoutes[0]);
        if (flattenedRoutes.length > 0) {
          setRouteLines(flattenedRoutes);
        } else {
            setRouteLines([]);
        }

        const linesResponse = await axios.get(`${API_BASE_URL}/mbtaLines/getAll`);
        if (Array.isArray(linesResponse.data)) {
          setLines(linesResponse.data);
          console.log("Lines data:", linesResponse.data);
        } else {
          setLines([]);
        }

      } catch (error) {
        console.error('Error fetching stations:', error);
        setStations([]);
        setRouteLines([]);
        setLines([]);
      }


    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedLineId) {
        setFilteredStations([]);
        return;
    }

    console.log("Finding stations for line ID:", selectedLineId);
    
    const validPrefixes = LINE_TO_PREFIX_MAP[selectedLineId] || [];
    console.log("Valid prefixes for this line:", validPrefixes);
    
    const stationsOnLine = stations.filter(station => {
        if (!station._id) return false;
        
        const stationIdLower = station._id.toLowerCase();
        
        if (stationIdLower.includes("north") && 
            TERMINALS["north"].includes(selectedLineId)) {
            return true;
        }
        
        if (stationIdLower.includes("sstat") && 
            TERMINALS["sstat"].includes(selectedLineId)) {
            return true;
        }
        
        const prefix = getStationPrefix(station._id);
        return validPrefixes.includes(prefix);
    });
    
    console.log(`Found ${stationsOnLine.length} stations for line ${selectedLineId}`);
    
    setFilteredStations(stationsOnLine);
    setStartStation('');
    setStopStation('');
    setIsStationSelected(false);
  }, [selectedLineId, stations]);

  const handleLineSelection = (e) => {
    const lineName = e.target.value;
    setSelectedLine(lineName);
    
    const selectedLineObj = lines.find(line => line.lineName === lineName);
    if (selectedLineObj) {
        setSelectedLineId(selectedLineObj._id);
        console.log(`Selected line: ${lineName}, ID: ${selectedLineObj._id}`);
    } else {
        setSelectedLineId('');
    }
  };

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

  const sortedStations = [...filteredStations].sort((a, b) =>
    a.stationName.localeCompare(b.stationName)
  );

  const sortedLines = [...lines].sort((a, b) =>
    a.lineName.localeCompare(b.lineName)
  );

  const isRouteOnSelectedLine = (route) => {
    // Check if the route matches the selected line ID
    return (
        (route.routeId === selectedLineId) ||
        (selectedLineId && route._id && route._id.includes(selectedLineId))
    );
  };

 
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

        {/* Select Line */}
        <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Line</h2>
            <div className="relative">
              <select
                value={selectedLine}
                onChange={handleLineSelection}
                className="w-full p-3 border border-gray-300 rounded text-lg appearance-none"
              >
                <option value="">Select a Commuter Rail Line</option>
                {sortedLines.map(line => (
                  <option key={line._id} value={line.lineName}>
                    {line.lineName}
                  </option>
                ))}
                
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {!selectedLine && (
              <p className="text-red-700 mt-2 text-lg">
                Please select a line first
              </p>
            )}
          </div>

          {/* Select Start */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Start</h2>
            <div className="relative">
              <select
                value={startStation}
                onChange={handleStartSelection}
                className="w-full p-3 border border-gray-300 rounded text-lg appearance-none"
                disabled={!selectedLine}
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

          {/* Select Stop */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">Stop</h2>
            <div className="relative">
              <select
                value={stopStation}
                onChange={handleStopSelection}
                className="w-full p-3 border border-gray-300 rounded text-lg appearance-none"
                disabled={!selectedLine}
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

              {/* Render polylines for routes */}
              {routeLines
                .filter(route => route._id && route._id.startsWith('canonical-'))
                .map(route => {
                  const decodedCoordinates = decodePolyline(route.polyline);
                  const isSelectedLine = selectedLine && isRouteOnSelectedLine(route);
                  const routeColor = '#80276C';
                  const opacity = isSelectedLine ? 0.8 : 0.2;
                  const weight = isSelectedLine ? 5 : 2;
                  return (
                    <Polyline
                      key={route._id}
                      positions={decodedCoordinates}
                      pathOptions={{
                        color: routeColor,
                        weight: weight,
                        opacity: opacity,
                        interactive: false
                      }}
                    >
                    </Polyline>
                  );
                })}

              {stations.map(station => {
                if (station.latitude != null && station.longitude != null) {
                  return (
                    <CircleMarker
                      key={station._id}
                      center={[station.latitude, station.longitude]}
                      radius={6}
                      pathOptions={{ fillColor: '#7B388C', color: '#7B388C', fillOpacity: 0.9 }}
                      pane="tooltipPane"
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