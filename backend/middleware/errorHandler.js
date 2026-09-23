const logger = require("../utils/logger");

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.name, ":", error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  // Duplicate key (e.g. username already taken).
  if (error.name === "MongoServerError" && error.code === 11000) {
    return response.status(409).json({ error: "username already taken" });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  }
  if (error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "token expired" });
  }

  return response.status(500).json({ error: "internal server error" });
};

module.exports = { unknownEndpoint, errorHandler };
