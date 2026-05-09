'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function FlightsListClient({ initialFlights = [] }) {
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
        <div className="grid gap-4">
          {filteredFlights.map((flight) => (
            <Link
              href={`/flights/${flight.id}`}
              key={flight.id}
              className="block hover:scale-[1.01] transition-transform"
            >
              <div className="p-5 border border-blue-100 rounded-lg shadow-md flex justify-between items-center bg-white cursor-pointer hover:border-blue-400">
                <div>
                  <span className="font-extrabold text-xl text-blue-900">
                    {flight.origin} -&gt; {flight.destination}
                  </span>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    ID: {flight.id}
                  </p>
                  <p
                    suppressHydrationWarning
                    className="text-sm font-semibold text-slate-700"
                  >
                    Departure:{' '}
                    {new Date(flight.time_departure).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    flight.status === 'on_time' || flight.status === 'on-time'
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                  }`}
                >
                  {flight.status.replace('_', ' ').replace('-', ' ')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
