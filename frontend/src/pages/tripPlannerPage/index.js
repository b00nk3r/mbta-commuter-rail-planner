import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import TripPlannerControlPanel from './ControlPanel';
import TripPlannerMap from './Map';

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
  const stationMap = { "North Station": "place-north", "South Station": "place-sstat" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = 'http://localhost:8081';
        const response = await axios.get(`${API_BASE_URL}/mbtaStops/getAll`);
        setStations(Array.isArray(response.data) ? response.data : []);

        const routesResponse = await axios.get(`${API_BASE_URL}/mbtaShapes/getAll`);
        const flattenedRoutes = flattenRouteLines(routesResponse.data);
        setRouteLines(flattenedRoutes.length > 0 ? flattenedRoutes : []);

        const linesResponse = await axios.get(`${API_BASE_URL}/mbtaLines/getAll`);
        setLines(Array.isArray(linesResponse.data) ? linesResponse.data : []);
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
        const response = await axios.get('http://localhost:8081/mbtaDepartures/getAll', { params: { origin: stopId, line: selectedLineId } });
        if (Array.isArray(response.data)) {
          setDepartures(response.data);
        }
      } catch (error) {
        console.error('Error fetching departures:', error);
      }
    };
    if (startStation) fetchDepartures();
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
      if (stationIdLower.includes('north') && TERMINALS['north'].includes(selectedLineId)) return true;
      if (stationIdLower.includes('sstat') && TERMINALS['sstat'].includes(selectedLineId)) return true;
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
        determinedStartStationName = northStationObj ? northStationObj.stationName : '';
      } else if (TERMINALS.sstat.includes(lineId)) {
        const southStationObj = stations.find(s => s._id && s._id.toLowerCase().includes('sstat'));
        determinedStartStationName = southStationObj ? southStationObj.stationName : '';
      }
      setStartStation(determinedStartStationName);
    }
  };

  const handleStopSelection = (e) => {
    const selectedStop = e.target.value;
    setStopStation(selectedStop);
    setIsStopStationSelected(selectedLine !== '' && startStation !== '' && selectedStop !== '');
  };

  return (
    <div className="relative h-screen">
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