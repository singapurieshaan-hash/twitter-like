const postsRouter = require("express").Router();
const Post = require("../models/post");
const User = require("../models/user");
const { userExtractor } = require("../middleware/auth");
const socket = require("../utils/socket");

const authorPopulate = { path: "author", select: "username name profileImage" };

// Reload a post with its author populated and return the JSON form.
const populatedPost = (id) => Post.findById(id).populate(authorPopulate);

// GET /api/posts  — home feed: posts by the user and people they follow,
// newest first. (protected)
postsRouter.get("/", userExtractor, async (request, response) => {
  const authorIds = [...request.user.following, request.user._id];
  const posts = await Post.find({ author: { $in: authorIds } })
    .sort({ createdAt: -1 })
    .populate(authorPopulate);
  response.json(posts);
});

// GET /api/posts/explore  — posts from users the current user does NOT
// follow (and not their own), newest first. (protected)
postsRouter.get("/explore", userExtractor, async (request, response) => {
  const excluded = [...request.user.following, request.user._id];
  const posts = await Post.find({ author: { $nin: excluded } })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate(authorPopulate);
  response.json(posts);
});

// GET /api/posts/saved  — the current user's saved/bookmarked posts. (protected)
postsRouter.get("/saved", userExtractor, async (request, response) => {
  const posts = await Post.find({ saves: request.user._id })
    .sort({ createdAt: -1 })
    .populate(authorPopulate);
  response.json(posts);
});

// POST /api/posts  — create a post. Only authenticated users. (protected)
postsRouter.post("/", userExtractor, async (request, response) => {
  const { content } = request.body;

  if (!content || !content.trim()) {
    return response.status(400).json({ error: "content is required" });
  }
  if (content.length > 500) {
    return response
      .status(400)
      .json({ error: "content must be 500 characters or fewer" });
  }

  const post = new Post({
    author: request.user._id,
    content: content.trim(),
  });

  const saved = await post.save();
  // Track the post on the author document.
  await User.findByIdAndUpdate(request.user._id, {
    $addToSet: { posts: saved._id },
  });

  const result = await populatedPost(saved._id);

  // Broadcast so followers' feeds update in real time.
  socket.emit("newPost", result.toJSON());

  response.status(201).json(result);
});

// GET /api/posts/:id  — single post.
postsRouter.get("/:id", async (request, response) => {
  const post = await populatedPost(request.params.id);
  if (!post) {
    return response.status(404).json({ error: "post not found" });
  }
  response.json(post);
});

// Shared helper for like / repost / save toggles.
// field: 'likes' | 'reposts' | 'saves'.  add: true to add, false to remove.
const toggleField = async (request, response, field, add) => {
  const userId = request.user._id;
  const post = await Post.findById(request.params.id);
  if (!post) {
    return response.status(404).json({ error: "post not found" });
  }

  const already = post[field].some((id) => id.toString() === userId.toString());

  if (add) {
    // Reject duplicate action explicitly for a clear status code.
    if (already) {
      return response
        .status(409)
        .json({ error: `you already ${field.replace(/s$/, "")}d this post` });
    }
    await Post.findByIdAndUpdate(post._id, { $addToSet: { [field]: userId } });
  } else {
    if (!already) {
      return response
        .status(409)
        .json({ error: `you have not ${field.replace(/s$/, "")}d this post` });
    }
    await Post.findByIdAndUpdate(post._id, { $pull: { [field]: userId } });
  }

  // Keep the user's savedPosts array in sync for the 'saves' field.
  if (field === "saves") {
    const op = add
      ? { $addToSet: { savedPosts: post._id } }
      : { $pull: { savedPosts: post._id } };
    await User.findByIdAndUpdate(userId, op);
  }

  const updated = await populatedPost(post._id);

  // Real-time update so like/repost/save counts refresh everywhere.
  socket.emit("postUpdated", updated.toJSON());

  response.json(updated);
};

// Likes
postsRouter.post("/:id/like", userExtractor, (req, res) =>
  toggleField(req, res, "likes", true),
);
postsRouter.delete("/:id/like", userExtractor, (req, res) =>
  toggleField(req, res, "likes", false),
);

// Reposts
postsRouter.post("/:id/repost", userExtractor, (req, res) =>
  toggleField(req, res, "reposts", true),
);
postsRouter.delete("/:id/repost", userExtractor, (req, res) =>
  toggleField(req, res, "reposts", false),
);

// Saves
postsRouter.post("/:id/save", userExtractor, (req, res) =>
  toggleField(req, res, "saves", true),
);
postsRouter.delete("/:id/save", userExtractor, (req, res) =>
  toggleField(req, res, "saves", false),
);

module.exports = postsRouter;
