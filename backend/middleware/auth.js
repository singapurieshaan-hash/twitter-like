const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");

// Pulls a bearer token out of the Authorization header, if present.
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

// Verifies the JWT and loads the corresponding user onto request.user.
// Any protected route mounts this after tokenExtractor.
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: "token missing" });
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, config.SECRET);
  } catch (e) {
    return response.status(401).json({ error: "token invalid or expired" });
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "user no longer exists" });
  }

  request.user = user;
  next();
};

module.exports = { tokenExtractor, userExtractor };
