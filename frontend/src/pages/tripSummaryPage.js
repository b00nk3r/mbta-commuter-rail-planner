import React from 'react';

function formatDepartureTime(rawTime) {
    const date = new Date(rawTime);
        return date.toLocaleString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true, 
        
    });
}

function formatDepartureDate(rawTime) {
    const date = new Date(rawTime);
    return date.toLocaleDateString("en-US", { 
        weekday: "long", 
        month: "long", 
        day: "numeric",
        year: "numeric"
    });
}


function getLastSegment(trainNumber) {
    const parts = trainNumber.split("-"); // Split at dashes
    return parts.length >= 3 ? parts[2] : null; // Get the third part (after the second dash)
}

function TripSummaryPage({ departures }) {

    const filteredDepartures = departures.filter(departure => 
        departure.departure_time && 
        !isNaN(new Date(departure.departure_time).getTime())
    );

    const firstDepartureDate = filteredDepartures.length > 0 ? formatDepartureDate(filteredDepartures[0].departure_time) : "No departures available";

    return (
        <div className="flex flex-col items-center mt-6">
            <h2 className="text-2xl font-bold mb-4">{firstDepartureDate}</h2> {/* Display formatted date */}
            <table className="table-auto border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Train #</th>
                        <th className="border border-gray-300 px-4 py-2">Departure Time</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDepartures.length > 0 ? (
                        filteredDepartures.map((departure, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{getLastSegment(departure.train_number)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatDepartureTime(departure.departure_time)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">No departures available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}


export default TripSummaryPage;