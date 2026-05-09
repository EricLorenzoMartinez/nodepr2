'use client';

import { useState, useMemo } from 'react';

export default function FlightsListClient({ initialFlights }) {
  // State: save the actual value of the filters
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDestination, setFilterDestination] = useState('');
  const [searchCode, setSearchCode] = useState('');

  // Memorization: calculate the derivated list
  const filteredFlights = useMemo(() => {
    return initialFlights.filter((flight) => {
      const matchOrigin = flight.origin
        .toLowerCase()
        .includes(filterOrigin.toLowerCase());
      const matchDestination = flight.destination
        .toLowerCase()
        .includes(filterDestination.toLowerCase());
      const matchCode = flight.id
        .toLowerCase()
        .includes(searchCode.toLowerCase());

      return matchOrigin && matchDestination && matchCode;
    });
  }, [initialFlights, filterOrigin, filterDestination, searchCode]);

  return (
    <div className="w-full">
      {/* Filter controllers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-gray-500">
        <input
          type="text"
          placeholder="Filter by code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        />
        <input
          type="text"
          placeholder="Filter by origin"
          value={filterOrigin}
          onChange={(e) => setFilterOrigin(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        />
        <input
          type="text"
          placeholder="Filter by destination"
          value={filterDestination}
          onChange={(e) => setFilterDestination(e.target.value)}
          className="p-2 border border-gray-400 rounded"
        />
      </div>

      {/* Filtered flights list */}
      {filteredFlights.length === 0 ? (
        <p className="text-center text-gray-500 font-medium p-4">
          No flights match the current filters.
        </p>
      ) : (
        <div className="text-gray-500 text-center py-4 bg-gray-50 rounded border">
          {filteredFlights.map((flight) => (
            <div key={flight.id} className="p-2 border-b last:border-0">
              <div>
                <span className="font-bold text-lg">
                  {flight.origin} -`&gt` {flight.destination}
                </span>
                <p className="text-sm text-gray-500">Code: {flight.id}</p>
                <p className="text-sm text-gray-500">
                  Departure: {new Date(flight.time_departure).toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${flight.status === 'on_time' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
              >
                {flight.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
