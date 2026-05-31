// Punto de entrada de la aplicación.
// Inicia el servidor y escucha las peticiones entrantes.

import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { PORT } from './config/config.js';
import logger from './config/logger.js';
import { TokenHelper } from './utils/token.helper.js';
import { UserModel } from './models/user.model.js';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
    : `http://localhost:${PORT}`;

// Create HTTP server and Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Authentication middleware for socket
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    logger.warn('Socket.IO: No token provided in handshake');
    return next(new Error('Authentication error: No token provided'));
  }
  try {
    const decoded = TokenHelper.verifyToken(token);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      logger.warn(
        { userId: decoded.id },
        'Socket.IO: User not found for provided token'
      );
      return next(new Error('Authentication error: User not found'));
    }
    socket.data.user = user;
    logger.info('Socket.IO: Token verified successfully for socket connection');
    next();
  } catch (error) {
    logger.warn(
      { error: (error as Error).message },
      'Socket.IO: Invalid token in handshake'
    );
    next(new Error('Authentication error: Invalid token'));
  }
});

// Connection and rooms logic
io.on('connection', (socket) => {
  const user = socket.data.user;

  const isSupport = user.email === 'support@mail.com';
  const roomName = isSupport ? 'support_room' : `room_${user.id}`;

  socket.join(roomName);
  logger.info(
    `Socket.IO: User ${user.email} connected and joined room ${roomName}`
  );

  socket.on('sendMessage', (data) => {
    const messagePayload = {
      senderId: user.id.toString(),
      senderName: user.name,
      text: data.text,
      timestamp: new Date(),
    };

    if (isSupport) {
      io.emit('receiveMessage', messagePayload);
    } else {
      io.to(roomName).emit('receiveMessage', messagePayload);
      io.to('support_room').emit('receiveMessage', messagePayload);
    }
  });
});

httpServer.listen(PORT, () => {
  logger.info(`⚡️[server]: Server is running at ${BASE_URL}`);
});
