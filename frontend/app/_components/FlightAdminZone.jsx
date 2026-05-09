'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_context/AuthContext';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export default function FlightAdminZone({ flightId }) {
  const { state } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!state.isAuthenticated) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded border border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">
          Login to update or delete this flight.
        </p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/flights/${flightId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Backend response:', text);
        throw new Error('Failed to delete flight');
      }

      alert('Flight deleted successfully');
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
          {error}
        </p>
      )}
      <div className="flex gap-4">
        {/* Edit button */}
        <button>Edit Flight</button>
        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded hover:bg-red-200 transition border border-red-300 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Flight'}
        </button>
      </div>
    </div>
  );
}
