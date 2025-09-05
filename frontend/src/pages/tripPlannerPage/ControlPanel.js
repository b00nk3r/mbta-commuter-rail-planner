import React from 'react';
import { Link } from 'react-router-dom';

const TripPlannerControlPanel = ({
  selectedLine,
  lines,
  startStation,
  stopStation,
  isStopStationSelected,
  stationsForStopDropdown,
  onLineChange,
  onStopChange,
}) => {
  const sortedLines = [...lines].sort((a, b) => a.lineName.localeCompare(b.lineName));
  const sortedStationsForStop = [...stationsForStopDropdown].sort((a, b) => a.stationName.localeCompare(b.stationName));

  return (
    <div className="tp-panel">
      <div className="tp-inner">
        <div className="tp-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" className="w-12 h-12">
            <title>Commuter Rail</title>
            <path fill="rgb(160,68,118)" d="M24 0a24 24 0 1 0 24 24 24 24 0 0 0 -24-24" />
            <path fill="#fff" d="M33.39 14.48a1.35829 1.35829 0 0 1 -.61-1.15v-3.59a2.26665 2.26665 0 0 0 -1.78-2.16 57.59524 57.59524 0 0 0 -6.52-1.5 2.38727 2.38727 0 0 0 -1.03.01c-1.95.43-3.91.81-5.84 1.35-1.14.31-2.34.94-2.34 2.3v3.56a1.33683 1.33683 0 0 1 -.62 1.16 2.35679 2.35679 0 0 0 -1.12 2.01v15.14a2.37064 2.37064 0 0 0 .88 1.82l3.83 2.8-3.09 5.74h2.52l.44-.79h11.83l.45.79h2.5l-3.07-5.74h.01l3.75-2.77a2.37807 2.37807 0 0 0 .89-1.85v-15.14a2.37165 2.37165 0 0 0 -1.08-1.99Zm-7.55-5.6a.74769.74769 0 0 1 .91-.73l3.7.78a.7302.7302 0 0 1 .59.72v2.2a.752.752 0 0 1 -.89.74l-3.7-.72a.75966.75966 0 0 1 -.61-.74Zm2.07 28.65h-7.79l.66-1.2h6.46Zm-3.91-20.89a2.705 2.705 0 1 1 -2.7 2.71 2.70364 2.70364 0 0 1 2.7-2.71Zm-6.81-6.99a.7201.7201 0 0 1 .6-.72l3.69-.78a.73962.73962 0 0 1 .9.73v2.25a.75086.75086 0 0 1 -.6.74l-3.7.72a.75207.75207 0 0 1 -.89-.74Zm.8 23.91a2.015 2.015 0 1 1 2.01-2.01 2.01015 2.01015 0 0 1 -2.01 2.01Zm.78 6.41.69-1.24h9.12l.69 1.24Zm11.22-6.41a2.015 2.015 0 1 1 2.01-2.01 2.01015 2.01015 0 0 1 -2.01 2.01Z" />
          </svg>
          <h1 className="tp-title">Trip Planner</h1>
        </div>

        <div className="mb-4">
          <label className="tp-label" htmlFor="line-select">LINE</label>
          <div className="relative">
            <select id="line-select" value={selectedLine} onChange={onLineChange} className="tp-select">
              <option value="">Select a Line</option>
              {sortedLines.map((line) => (
                <option key={line._id} value={line.lineName}>{line.lineName}</option>
              ))}
            </select>
            <div className="tp-chevron">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          {!selectedLine && (<p className="tp-error">Please select a line first</p>)}
        </div>

        <div className="mb-4">
          <div className="tp-label">START STATION</div>
          <div className="tp-value">
            {startStation ? startStation : (selectedLine ? 'Determining...' : 'Select a line above')}
          </div>
        </div>

        <div className="mb-10">
          <label className="tp-label" htmlFor="stop-select">DESTINATION</label>
          <div className="relative">
            <select id="stop-select" value={stopStation} onChange={onStopChange} className="tp-select" disabled={!selectedLine || !startStation || sortedStationsForStop.length === 0}>
              <option value="">{startStation ? 'Select a destination' : 'Select line first'}</option>
              {sortedStationsForStop.map(station => (
                <option key={station._id} value={station.stationName}>{station.stationName}</option>
              ))}
            </select>
            <div className="tp-chevron">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>
          {selectedLine && startStation && !isStopStationSelected && (<p className="tp-error">Please select a stop station.</p>)}
        </div>

        <Link to="/tripSummaryPage">
          <button className="tp-btn-primary" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }} disabled={!isStopStationSelected}>
            Plan Trip
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TripPlannerControlPanel;