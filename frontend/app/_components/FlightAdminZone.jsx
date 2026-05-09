'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_context/AuthContext';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export default function FlightAdminZone({ flight }) {
  const { state } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    origin: flight.origin,
    destination: flight.destination,
    status: flight.status,
  });

  if (!state.isAuthenticated) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded border border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">
          Login to update or delete this flight.
        </p>
      </div>
    );
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/flights/${flight.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Backend response:', text);
        throw new Error('Failed to update flight');
      }

      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/flights/${flight.id}`, {
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

  if (isEditing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="space-y-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm"
      >
        <h3 className="font-bold text-blue-800">Update flight data</h3>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Origin
            </label>
            <input
              type="text"
              value={editForm.origin}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  origin: e.target.value.toUpperCase(),
                })
              }
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              value={editForm.destination}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  destination: e.target.value.toUpperCase(),
                })
              }
              className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={editForm.status}
            onChange={(e) =>
              setEditForm({ ...editForm, status: e.target.value })
            }
            className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
          >
            <option value="on-time">On Time</option>
            <option value="delayed">Delayed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded hover:bg-indigo-700 transition"
        >
          Edit Flight
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-100 text-red-700 font-bold py-2 rounded border border-red-300 hover:bg-red-200 transition"
        >
          Delete Flight
        </button>
      </div>
    </div>
  );
}
