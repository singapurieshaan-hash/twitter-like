import { useState, useEffect } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard.jsx";
import { Page, PageHeader, Loading, Empty } from "../styles/shared";

// Explore: posts from users the current user does not follow.
const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/explore")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("failed to load explore", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (updated) =>
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  return (
    <Page>
      <PageHeader>
        <h1>Explore</h1>
      </PageHeader>

      {loading ? (
        <Loading>Loading…</Loading>
      ) : posts.length === 0 ? (
        <Empty>No new posts to explore right now.</Empty>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onChange={handleChange} />
        ))
      )}
    </Page>
  );
};

export default Explore;
