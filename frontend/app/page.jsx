import FlightsListClient from './_components/FlightsListClient';

const API_BASE =
  process.env.API_BASE_URL ?? // p.ej. "http://host.docker.internal:4000" si usas Docker
  'http://127.0.0.1:4000';

async function getHealth() {
  const res = await fetch(`${API_BASE}/health`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Server status could not be retrieved');
  }

  return res.json();
}

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
  const data = await getHealth();
  const flights = await getFlights();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      {/* HEALTH CHECK */}
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Server status
        </h1>
        <div className="text-sm text-gray-700 mb-4 text-center">
          Endpoint: <code className="font-mono text-blue-600">/health</code>
        </div>
        <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
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
