'use client';

import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../_context/AuthContext';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export default function EmergingChat() {
  const { state } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (state?.isAuthenticated && state?.token) {
      const newSocket = io(API_BASE, {
        auth: {
          token: state.token,
        },
      });

      newSocket.on('receiveMessage', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) socket.disconnect();
      setSocket(null);
      setIsOpen(false);
      setMessages([]);
    }
  }, [state?.isAuthenticated, state?.token]);
}
