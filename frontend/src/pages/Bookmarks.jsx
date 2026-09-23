import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import PostCard from "../components/PostCard.jsx";
import { Page, PageHeader, Loading, Empty } from "../styles/shared";

// Bookmarks: posts the current user has saved.
const Bookmarks = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/saved")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("failed to load bookmarks", err))
      .finally(() => setLoading(false));
  }, []);

  // After any action, refresh the post. If the user un-saved it, it no
  // longer belongs on this page, so remove it from the list.
  const handleChange = (updated) => {
    const stillSaved = (updated.saves || []).includes(user.id);
    setPosts((prev) =>
      stillSaved
        ? prev.map((p) => (p.id === updated.id ? updated : p))
        : prev.filter((p) => p.id !== updated.id),
    );
  };

  return (
    <Page>
      <PageHeader>
        <h1>Bookmarks</h1>
      </PageHeader>

      {loading ? (
        <Loading>Loading…</Loading>
      ) : posts.length === 0 ? (
        <Empty>You haven&apos;t saved any posts yet.</Empty>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onChange={handleChange} />
        ))
      )}
    </Page>
  );
};

export default Bookmarks;
