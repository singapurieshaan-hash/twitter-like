require("express-async-errors");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const config = require("./utils/config");
const logger = require("./utils/logger");
const socket = require("./utils/socket");

const { tokenExtractor } = require("./middleware/auth");
const { unknownEndpoint, errorHandler } = require("./middleware/errorHandler");

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const postsRouter = require("./controllers/posts");

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.static('dist'))
app.use(tokenExtractor);

// --- Routes ---
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

// --- HTTP + Socket.IO server ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.CLIENT_URL, credentials: true },
});
socket.init(io);

// Optionally authenticate sockets so we can join a private user room and
// deliver targeted events (e.g. newFollower). Anonymous sockets still get
// broadcast events like newPost / postUpdated.
io.use((clientSocket, next) => {
  const token = clientSocket.handshake.auth?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.SECRET);
      clientSocket.userId = decoded.id;
    } catch (e) {
      // Ignore bad token; connect as anonymous.
    }
  }
  next();
});

io.on("connection", (clientSocket) => {
  if (clientSocket.userId) {
    clientSocket.join(`user:${clientSocket.userId}`);
  }
  logger.info("socket connected", clientSocket.id);

  clientSocket.on("disconnect", () => {
    logger.info("socket disconnected", clientSocket.id);
  });
});

// --- Start ---
// Connect to MongoDB in the background without killing the process if it
// fails. On Vercel the app runs as a serverless function, so a failed
// connection must not crash the function, and the function must not call
// listen(). Mongoose buffers model operations until the connection is up.
mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("failed to connect to MongoDB:", error.message)
  );

// Only listen when run directly (local dev: `node app.js` / `npm run dev`).
// On Vercel, the platform invokes the exported app itself.
if (require.main === module) {
  server.listen(config.PORT, () => {
    logger.info(`server running on port ${config.PORT}`);
  });
}

module.exports = app;
