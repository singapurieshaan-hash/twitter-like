require("express-async-errors");
const http = require("http");
const express = require("express");
const cors = require("cors");
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
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(tokenExtractor);

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
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
const start = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info("connected to MongoDB");
    server.listen(config.PORT, () => {
      logger.info(`server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error("failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

start();

module.exports = { app, server };
