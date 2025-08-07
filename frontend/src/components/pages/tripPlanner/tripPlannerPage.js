import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import TripPlannerControlPanel from './controlPanel';
import TripPlannerMap from './map';

import {
   TERMINALS,
   LINE_TO_PREFIX_MAP,
   getStationPrefix,
} from './helpers';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


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

const TripPlannerPage = ({ setDepartures }) => {
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedLineId, setSelectedLineId] = useState('');
  const [startStation, setStartStation] = useState('');
  const [stopStation, setStopStation] = useState('');
  const [isStopStationSelected, setIsStopStationSelected] = useState(false);
  const [stations, setStations] = useState([]);
  const [lines, setLines] = useState([]);
  const massachusettsBounds = [[41.237964, -73.508142], [43.222, -69.928393]];
  const [routeLines, setRouteLines] = useState([]);
  const [stationsForStopDropdown, setStationsForStopDropdown] = useState([]);
  const navigate = useNavigate();
  const stationMap = {
    "North Station": "place-north",
    "South Station": "place-sstat"
};



  
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
  const fetchDepartures = async () => {
    const stopId = stationMap[startStation]
    try {
        const response = await axios.get("http://localhost:8081/mbtaDepartures/getAll", {
          
            params: {origin: stopId, line: selectedLineId}
        });

        if (Array.isArray(response.data)) {
            setDepartures(response.data); // Updates state in App.js
            console.log("Fetched departures:", response.data);
        }
    } catch (error) {
        console.error("Error fetching departures:", error);
    }
};


  if (startStation) {
    console.log(startStation)
    console.log(selectedLineId)
      fetchDepartures();
  }
}, [startStation]);



  useEffect(() => {
    if (!selectedLineId || !startStation) {
      setStationsForStopDropdown([]);
      return;
    }

    const validPrefixes = LINE_TO_PREFIX_MAP[selectedLineId] || [];

    const stationsOnLine = stations.filter(station => {
      if (!station._id) return false;

      const stationIdLower = station._id.toLowerCase();

      if (stationIdLower.includes("north") && TERMINALS["north"].includes(selectedLineId)) return true;
      if (stationIdLower.includes("sstat") && TERMINALS["sstat"].includes(selectedLineId)) return true;

      const prefix = getStationPrefix(station._id);
      return validPrefixes.includes(prefix);
    });

    const filteredForStop = stationsOnLine.filter(station => station.stationName !== startStation);

    setStationsForStopDropdown(filteredForStop);
    setStopStation('');
    setIsStopStationSelected(false);
  }, [selectedLineId, startStation, stations]);

  const handleLineSelection = (e) => {
    const lineName = e.target.value;
    setSelectedLine(lineName);

    setStartStation('');
    setStopStation('');
    setIsStopStationSelected(false);
    setSelectedLineId('');
    setStationsForStopDropdown([]);

    const selectedLineObj = lines.find(line => line.lineName === lineName);
    if (selectedLineObj) {
      const lineId = selectedLineObj._id;
      setSelectedLineId(lineId);

      let determinedStartStationName = '';
      if (TERMINALS.north.includes(lineId)) {
        const northStationObj = stations.find(s => s._id && s._id.toLowerCase().includes('north'));
        if (northStationObj) {
          determinedStartStationName = northStationObj.stationName;
        } else {
          console.error("Could not find North Station data!");
        }
      } else if (TERMINALS.sstat.includes(lineId)) {
        const southStationObj = stations.find(s => s._id && s._id.toLowerCase().includes('sstat'));
        if (southStationObj) {
          determinedStartStationName = southStationObj.stationName;
        } else {
          console.error("Could not find South Station data!");
        }
      } else {
        console.warn(`Line ${lineId} not found in North or South terminal lists.`);
      }
      setStartStation(determinedStartStationName);
    } else {
      console.log("No line object found for name:", lineName);
    }
  };

  const handleStopSelection = (e) => {
    const selectedStop = e.target.value;
    setStopStation(selectedStop);
    checkStopStationSelected(selectedStop); // Check if a stop station is now selected
  };

  const checkStopStationSelected = (start, stop) => {
    setIsStopStationSelected(selectedLine !== '' && startStation !== '' && stop !== '');
  };

  const sortedStationsForStop = [...stationsForStopDropdown].sort((a, b) =>
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
    <div className="relative h-screen">
      {/* Floating Control Panel */}
      <TripPlannerControlPanel
        selectedLine={selectedLine}
        selectedLineId={selectedLineId}
        lines={lines}
        startStation={startStation}
        stopStation={stopStation}
        isStopStationSelected={isStopStationSelected}
        stationsForStopDropdown={stationsForStopDropdown}
        onLineChange={handleLineSelection}
        onStopChange={handleStopSelection}
      />

      {/* Full Screen Map */}
      <TripPlannerMap
        massachusettsBounds={massachusettsBounds}
        routeLines={routeLines}
        stations={stations}
        selectedLineId={selectedLineId}
        startStation={startStation}
        stopStation={stopStation}
      />
    </div>
);
};

export default TripPlannerPage;