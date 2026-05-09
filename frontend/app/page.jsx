import FlightsListClient from './_components/FlightsListClient';
import Link from 'next/link';

const API_BASE =
  process.env.API_BASE_URL ?? // p.ej. "http://host.docker.internal:4000" si usas Docker
  'http://127.0.0.1:4000';

async function getFlights() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/flights`, {
      next: { revalidate: 60 },
    });

    if (res.status === 404) {
      return [];
    }

    if (!res.ok) {
      throw new Error('Error while fetching flights');
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error while fetching flights:', error);
    return [];
  }
}

export default async function Home() {
  const flights = await getFlights();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-slate-50 p-6 space-y-6">
      {/* HEALTH CHECK */}
      <div className="max-w-4xl w-full flex justify-end">
        <Link
          href="/status"
          className="bg-indigo-100 text-indigo-800 font-bold px-4 py-2 rounded-lg hover:bg-indigo-200 transition border border-indigo-200"
        >
          Check Server Status
        </Link>
      </div>

      {/* FLIGHTS */}
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Scheduled Flights
        </h2>
        <FlightsListClient initialFlights={flights} />
      </div>
    </main>
  );
}
