import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Pane } from 'react-leaflet';

// Re-use helpers/constants by importing from sibling file or a utils file
import {
  TERMINALS,
  LINE_TO_PREFIX_MAP,
  getStationPrefix,
  decodePolyline,
} from './helpers';

const TripPlannerMap = ({
  massachusettsBounds,
  routeLines,
  stations,
  selectedLineId,
  startStation,
  stopStation,
}) => {
  const isRouteOnSelectedLine = (route) => {
    return (
      (route.routeId === selectedLineId) ||
      (selectedLineId && route._id && route._id.includes(selectedLineId))
    );
  };

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[42.360082, -71.058880]}
        zoom={13}
        minZoom={9}
        maxZoom={11}
        maxBounds={massachusettsBounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
      >
        <Pane name="unselectedLinesPane" style={{ zIndex: 440 }} />
                <Pane name="inactiveStationMarkersPane" style={{ zIndex: 450 }} />
                <Pane name="selectedLinePane" style={{ zIndex: 500 }} />
                <Pane name="activeStationMarkersPane" style={{ zIndex: 600 }} />

                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>'
                />

                {/* Render polylines for routes */}
                {routeLines
                    .filter(route => route._id && route._id.startsWith('canonical-'))
                    .map(route => {
                        const decodedCoordinates = decodePolyline(route.polyline);
                        return (
                            <Polyline
                                key={`${route._id}-unselected`}
                                positions={decodedCoordinates}
                                pane="unselectedLinesPane"
                                pathOptions={{
                                    color: '#DAB1DA',
                                    weight: 2.5,
                                    opacity: 1,
                                    interactive: false
                                }}
                            />
                        );
                    })}

                {routeLines
                    .filter(route => route._id && route._id.startsWith('canonical-') && isRouteOnSelectedLine(route))
                    .map(route => {
                        const decodedCoordinates = decodePolyline(route.polyline);
                        return (
                            <Polyline
                                key={`${route._id}-selected`}
                                positions={decodedCoordinates}
                                pane="selectedLinePane"
                                pathOptions={{
                                    color: '#80276C',
                                    weight: 5,
                                    opacity: 1,
                                    interactive: false
                                }}
                            />
                        );
                    })}

                {stations.map(station => {
                    if (station.latitude != null && station.longitude != null) {
                        let calculatedIsOnSelectedLine = false;
                        if (selectedLineId && station._id) {
                            const stationIdLower = station._id.toLowerCase();
                            const isNorthTerminalMatch = stationIdLower.includes("north") && TERMINALS["north"].includes(selectedLineId);
                            const isSouthTerminalMatch = stationIdLower.includes("sstat") && TERMINALS["sstat"].includes(selectedLineId);
                            const stationPrefix = getStationPrefix(station._id);
                            const validPrefixes = LINE_TO_PREFIX_MAP[selectedLineId] || [];
                            const isPrefixMatch = validPrefixes.includes(stationPrefix);
                            calculatedIsOnSelectedLine = isNorthTerminalMatch || isSouthTerminalMatch || isPrefixMatch;
                        }
                        const isStationOnSelectedLine = calculatedIsOnSelectedLine;

                        const isCurrentlyStartStation = station.stationName === startStation;
                        const isCurrentlyStopStation = station.stationName === stopStation;

                        const markerPaneName = (isCurrentlyStartStation || isCurrentlyStopStation || isStationOnSelectedLine)
                            ? "activeStationMarkersPane"
                            : "inactiveStationMarkersPane";

                        let fillColor, strokeColor, opacity, radius, interactive;

                        if (isCurrentlyStopStation) {
                            fillColor = '#FFFFFF';
                            strokeColor = '#000000';
                            opacity = 1;
                            radius = 7;
                            interactive = true;
                        } else if (isStationOnSelectedLine) {
                            fillColor = '#80276C';
                            strokeColor = '#80276C';
                            opacity = 1;
                            radius = 7;
                            interactive = true;
                        } else if (selectedLineId) {
                            fillColor = '#DAB1DA';
                            strokeColor = '#DAB1DA';
                            opacity = 1;
                            radius = 2;
                            interactive = false;
                        } else {
                            fillColor = '#DAB1DA';
                            strokeColor = '#DAB1DA';
                            opacity = 1;
                            radius = 3;
                            interactive = true;
                        }

                        return (
                            <CircleMarker
                                key={station._id}
                                center={[station.latitude, station.longitude]}
                                radius={radius}
                                pathOptions={{
                                    pane: markerPaneName,
                                    fillColor: fillColor,
                                    color: strokeColor,
                                    fillOpacity: opacity,
                                    opacity: opacity,
                                }}
                                eventHandlers={{
                                    click: (e) => {
                                        if (!interactive) {
                                            e.originalEvent.stopPropagation();
                                            e.originalEvent.preventDefault();
                                        }
                                    }
                                }}
                            >
                                {interactive && (
                                    <Popup>
                                        <div style={{ width: '200px' }}>
                                            <h3 className="font-bold text-lg mb-1">{station.stationName}</h3>
                                            {station.imageUrl && (
                                                <img
                                                    src={station.imageUrl}
                                                    alt={station.stationName}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        marginBottom: '0.5rem',
                                                        borderRadius: '6px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Popup>
                                )}
                            </CircleMarker>
                        );
                    } else {
                        return null;
                    }
                })}
      </MapContainer>
    </div>
  );
};

export default TripPlannerMap;