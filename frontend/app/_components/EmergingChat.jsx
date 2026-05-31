'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../_context/AuthContext';

const API_BASE = process.env.API_BASE_URL ?? 'http://host.docker.internal:4000';

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() && socket) {
      socket.emit('sendMessage', { text: inputText });
      setInputText('');
    }
  };

  if (!state.isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          Chat
        </button>
      )}

      {isOpen && (
        <div className="bg-white border rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-bold">Support FlightBoard</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white font-bold"
            >
              X
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
            {messages.length === 0 && (
              <p className="text-xs text-gray-400 text-center">
                No messages yet :(
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded max-w-[80%] text-sm ${m.senderId === state.user._id ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'}`}
              >
                <span className="font-bold text-xs block mb-1">
                  {m.senderName}
                </span>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="border p-2 flex-1 rounded text-sm text-black"
              placeholder="Write a message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
