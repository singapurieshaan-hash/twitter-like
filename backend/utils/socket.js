// A tiny module that holds the Socket.IO server instance so route
// handlers can emit events without a circular dependency on app.js.
let io = null;

const init = (ioInstance) => {
  io = ioInstance;
};

const getIo = () => io;

// Emit an event to everyone connected.
const emit = (event, payload) => {
  if (io) io.emit(event, payload);
};

// Emit an event to a specific user's private room (see socket join below).
const emitToUser = (userId, event, payload) => {
  if (io) io.to(`user:${userId}`).emit(event, payload);
};

module.exports = { init, getIo, emit, emitToUser };
