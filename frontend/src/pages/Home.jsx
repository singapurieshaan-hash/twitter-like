import { useState, useEffect } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext.jsx";
import PostComposer from "../components/PostComposer.jsx";
import PostCard from "../components/PostCard.jsx";
import { Page, PageHeader, Loading, Empty } from "../styles/shared";

// Home feed: posts by the user and people they follow, newest first.
const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load the feed once on mount.
  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("failed to load feed", err))
      .finally(() => setLoading(false));
  }, []);

  // Subscribe to real-time events so the feed updates without refreshing.
  useEffect(() => {
    // Normalize following to a list of user IDs. /users/me populates
    // following as objects; the login payload may omit it entirely.
    const followingIds = (user.following || []).map((f) =>
      typeof f === "string" ? f : f.id,
    );

    // A new post: show it if it's ours or from someone we follow.
    const onNewPost = (post) => {
      const authorId = post.author?.id;
      const relevant = authorId === user.id || followingIds.includes(authorId);
      if (!relevant) return;
      setPosts((prev) =>
        prev.some((p) => p.id === post.id) ? prev : [post, ...prev],
      );
    };

    // Like/repost/save counts changed on an existing post.
    const onPostUpdated = (post) => {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    };

    socket.on("newPost", onNewPost);
    socket.on("postUpdated", onPostUpdated);
    return () => {
      socket.off("newPost", onNewPost);
      socket.off("postUpdated", onPostUpdated);
    };
  }, [user]);

  // Replace a post in state after a like/repost/save toggle.
  const handleChange = (updated) =>
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  // Prepend the post we just created (socket may also deliver it; deduped).
  const handlePosted = (post) =>
    setPosts((prev) =>
      prev.some((p) => p.id === post.id) ? prev : [post, ...prev],
    );

  return (
    <Page>
      <PageHeader>
        <h1>Home</h1>
      </PageHeader>

      <PostComposer onPosted={handlePosted} />

      {loading ? (
        <Loading>Loading feed…</Loading>
      ) : posts.length === 0 ? (
        <Empty>
          Your feed is empty. Follow people on Explore to see their posts here.
        </Empty>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onChange={handleChange} />
        ))
      )}
    </Page>
  );
};

export default Home;
