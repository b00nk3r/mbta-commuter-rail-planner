import React from 'react';
import { Link } from 'react-router-dom';

const TripPlannerControlPanel = ({
  selectedLine,
  selectedLineId,
  lines,
  startStation,
  stopStation,
  isStopStationSelected,
  stationsForStopDropdown,
  onLineChange,
  onStopChange,
}) => {
  // derived data
  const sortedLines = [...lines].sort((a, b) => a.lineName.localeCompare(b.lineName));
  const sortedStationsForStop = [...stationsForStopDropdown].sort((a, b) =>
    a.stationName.localeCompare(b.stationName)
  );

  return (
    <div className="absolute top-1/3 left-6 transform -translate-y-1/2 z-[700] w-72 sm:w-80 rounded-2xl bg-white/90 backdrop-blur shadow-lg">
            <div className="p-6">
                {/* Header with Train Icon and Title */}
                <div className="flex items-center gap-3 mb-6">
                    {/* Train Icon Placeholder */}
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                        <svg 
                            className="w-5 h-5 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM8 7h4v10H8V7z"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Trip Planner</h1>
                </div>

                {/* LINE Section */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        LINE
                    </label>
                    <div className="relative">
                        <select
                            value={selectedLine}
                            onChange={onLineChange}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base appearance-none bg-white"
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
                        <p className="text-red-600 mt-1 text-sm">
                            Please select a line first
                        </p>
                    )}
                </div>

                {/* START STATION Section */}
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        START STATION
                    </label>
                    <div className="w-full p-3 border border-gray-200 bg-gray-100 rounded-lg text-base text-gray-700 min-h-[48px]">
                        {startStation ? startStation : (selectedLine ? 'Determining...' : 'Select line above')}
                    </div>
                </div>

                {/* DESTINATION Section */}
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        DESTINATION
                    </label>
                    <div className="relative">
                        <select
                            value={stopStation}
                            onChange={onStopChange}
                            className="w-full p-3 border border-gray-300 rounded-lg text-base appearance-none bg-white"
                            disabled={!selectedLine || !startStation || sortedStationsForStop.length === 0}
                        >
                            <option value="">
                                {startStation ? 'Select a destination' : 'Select line first'}
                            </option>
                            {sortedStationsForStop.map(station => (
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
                    {selectedLine && startStation && !isStopStationSelected && (
                        <p className="text-red-600 mt-1 text-sm">
                            Please select a stop station.
                        </p>
                    )}
                </div>

                {/* Plan Trip Button */}
                <Link to="/tripSummaryPage">
                    <button
                        className="w-full bg-gray-700 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!isStopStationSelected}
                    >
                        Plan Trip
                    </button>
                </Link>
            </div>
        </div>
  );
};

export default TripPlannerControlPanel;