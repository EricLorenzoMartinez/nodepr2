'use client';

import Link from 'next/link';
import { useAuth } from '../_context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  // Get the state
  const { state, dispatch } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    router.push('/login');
  };

  return (
    <header className="bg-blue-900 text-white p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold hover:text-blue-200 transition"
        >
          FlightBoard
        </Link>

        <nav>
          {state.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-200">
                Hi, {state.user?.name || 'User'}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-bold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-bold transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
