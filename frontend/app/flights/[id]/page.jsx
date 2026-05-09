import Link from 'next/link';
import FlightAdminZone from '../../_components/FlightAdminZone';

const API_BASE =
  process.env.API_BASE_URL ?? 'http://host.docker.internal:4000/api/v1';

async function getFlight(id) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/flights/${id}`);

    if (!res.ok) {
      if (res.status === 404) return null;
      const text = await res.text();
      console.error('Backend response:', text);
      throw new Error('Failed to fetch flight');
    }

    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching flight:', error);
    return null;
  }
}

export default async function FlightPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const flight = await getFlight(id);

  if (!flight) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center bg-white p-8 rounded-xl shadow-md border border-slate-200">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Flight Not Found
          </h1>
          <p className="text-slate-500 mb-6">
            The flight you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-slate-50 p-6">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-xl p-8 border border-slate-200">
        {/* Flight Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-slate-100 pb-6">
          <h1 className="text-4xl font-extrabold text-indigo-900 tracking-tight">
            {flight.origin} -&gt; {flight.destination}
          </h1>
          <span
            className={`px-5 py-2 rounded-full text-sm font-bold uppercase border shadow-sm ${
              flight.status === 'on_time' || flight.status === 'on-time'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            {flight.status?.replace('_', ' ').replace('-', ' ')}
          </span>
        </div>

        {/* Flight Details */}
        <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
          <p className="text-lg">
            <span className="font-bold text-slate-800">Flight id:</span>{' '}
            <span className="text-slate-600">{flight.id}</span>
          </p>
          <p className="text-lg" suppressHydrationWarning>
            <span className="font-bold text-slate-800">Departure date:</span>{' '}
            <span className="text-slate-600">
              {new Date(flight.time_departure).toLocaleString()}
            </span>
          </p>
        </div>

        {/* Administration Zone */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="font-bold text-xl text-blue-900 mb-2">
            Administration Zone
          </h2>
          <FlightAdminZone flight={flight} />
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
