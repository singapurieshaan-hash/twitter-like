const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Post = require("../models/post");
const { userExtractor } = require("../middleware/auth");
const socket = require("../utils/socket");

// Populate config used to shape post lists on a profile.
const postPopulate = {
  path: "author",
  select: "username name profileImage",
};

// GET /api/users  — list all users (lightweight, for Explore / search).
usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).select(
    "username name profileImage bio followers following",
  );
  response.json(users);
});

// GET /api/users/me  — the currently authenticated user (protected).
usersRouter.get("/me", userExtractor, async (request, response) => {
  const user = await User.findById(request.user._id)
    .populate("followers", "username name profileImage")
    .populate("following", "username name profileImage");
  response.json(user);
});

// POST /api/users  — sign up.
usersRouter.post("/", async (request, response) => {
  const { username, name, password, bio, profileImage } = request.body;

  if (!username || !name || !password) {
    return response
      .status(400)
      .json({ error: "username, name and password are required" });
  }
  if (username.length < 3) {
    return response
      .status(400)
      .json({ error: "username must be at least 3 characters" });
  }
  if (password.length < 6) {
    return response
      .status(400)
      .json({ error: "password must be at least 6 characters" });
  }

  const existing = await User.findOne({ username });
  if (existing) {
    return response.status(409).json({ error: "username already taken" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    bio: bio || "",
    profileImage: profileImage || "",
  });

  const saved = await user.save();
  response.status(201).json(saved);
});

// GET /api/users/:id  — a profile with its posts and reposts.
usersRouter.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id)
    .populate("followers", "username name profileImage")
    .populate("following", "username name profileImage");

  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }

  // Posts authored by this user.
  const posts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate(postPopulate);

  // Posts this user has reposted (authored by anyone).
  const reposts = await Post.find({ reposts: user._id })
    .sort({ createdAt: -1 })
    .populate(postPopulate);

  response.json({ user, posts, reposts });
});

// POST /api/users/:id/follow  — follow a user (protected).
usersRouter.post("/:id/follow", userExtractor, async (request, response) => {
  const targetId = request.params.id;
  const currentUser = request.user;

  // A user cannot follow themselves.
  if (targetId === currentUser._id.toString()) {
    return response.status(400).json({ error: "you cannot follow yourself" });
  }

  const target = await User.findById(targetId);
  if (!target) {
    return response.status(404).json({ error: "user not found" });
  }

  // Prevent duplicate follows. $addToSet only adds if not already present.
  const alreadyFollowing = currentUser.following.some(
    (id) => id.toString() === targetId,
  );
  if (alreadyFollowing) {
    return response.status(409).json({ error: "already following this user" });
  }

  await User.findByIdAndUpdate(currentUser._id, {
    $addToSet: { following: target._id },
  });
  await User.findByIdAndUpdate(target._id, {
    $addToSet: { followers: currentUser._id },
  });

  // Notify the followed user in real time.
  socket.emitToUser(targetId, "newFollower", {
    follower: {
      id: currentUser._id.toString(),
      username: currentUser.username,
      name: currentUser.name,
      profileImage: currentUser.profileImage,
    },
  });

  response.json({ following: true, targetId });
});

// DELETE /api/users/:id/follow  — unfollow a user (protected).
usersRouter.delete("/:id/follow", userExtractor, async (request, response) => {
  const targetId = request.params.id;
  const currentUser = request.user;

  if (targetId === currentUser._id.toString()) {
    return response.status(400).json({ error: "you cannot unfollow yourself" });
  }

  const target = await User.findById(targetId);
  if (!target) {
    return response.status(404).json({ error: "user not found" });
  }

  await User.findByIdAndUpdate(currentUser._id, {
    $pull: { following: target._id },
  });
  await User.findByIdAndUpdate(target._id, {
    $pull: { followers: currentUser._id },
  });

  response.json({ following: false, targetId });
});


module.exports = usersRouter;
