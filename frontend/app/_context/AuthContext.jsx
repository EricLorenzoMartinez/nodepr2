'use client';

import { createContext, useReducer, useContext } from 'react';

// Initial authentication state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Reducer function to manage authentication state
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the application and provide authentication state
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Return the state and the function to send actions to all the app
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext in components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
