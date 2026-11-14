const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

// POST /api/login
loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response
      .status(400)
      .json({ error: "username and password are required" });
  }

  const user = await User.findOne({ username });

  // Verify the password against the stored bcrypt hash.
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: "invalid username or password" });
  }

  const userForToken = { username: user.username, id: user._id };
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: "7d" });

  response.status(200).json({
    token,
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    profileImage: user.profileImage,
    bio: user.bio,
  });
});

module.exports = loginRouter;
