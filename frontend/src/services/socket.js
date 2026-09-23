import { io } from "socket.io-client";

// A single shared socket connection for the whole app.
// `autoConnect: false` lets us set the auth token before connecting.
const socket = io("/", { autoConnect: false });

export const connectSocket = (token) => {
  socket.auth = { token };
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
