import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import PostCard from "../components/PostCard.jsx";
import UserListModal from "../components/UserListModal.jsx";
import { Page, PageHeader, Loading, Empty } from "../styles/shared";

const Head = styled.section`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const FollowButton = styled.button`
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 8px 20px;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.15s ease;

  /* "Follow" = solid blue; "Following" = outlined until hovered. */
  background: ${({ theme, $following }) =>
    $following ? theme.colors.white : theme.colors.blue};
  color: ${({ theme, $following }) =>
    $following ? theme.colors.text : theme.colors.white};
  border: 1px solid
    ${({ theme, $following }) =>
      $following ? theme.colors.borderStrong : theme.colors.blue};

  &:hover {
    ${({ $following, theme }) =>
      $following
        ? `border-color: ${theme.colors.danger}; color: ${theme.colors.danger};`
        : `background: ${theme.colors.blueDark};`}
  }
`;

const Name = styled.h2`
  margin: 12px 0 0;
  font-size: 20px;
`;

const Handle = styled.p`
  margin: 2px 0 8px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Bio = styled.p`
  margin: 8px 0;
  font-size: 15px;
  line-height: 1.4;
`;

const Stats = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const Stat = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.text};
    margin-right: 4px;
  }
  &:hover {
    text-decoration: underline;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button`
  flex: 1;
  background: transparent;
  border: none;
  padding: 16px 0;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  /* Blue underline indicator for the active tab. */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 4px;
    width: 56px;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme, $active }) =>
      $active ? theme.colors.blue : "transparent"};
  }
`;

// A user profile: header info, follow button, follower/following counts,
// and tabs for the user's own posts and their reposts.
const Profile = () => {
  const { id } = useParams();
  const { user: me } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [tab, setTab] = useState("posts");
  const [modal, setModal] = useState(null); // 'followers' | 'following' | null
  const [loading, setLoading] = useState(true);

  const isMe = me.id === id;
  const isFollowing = profile?.followers?.some((f) => f.id === me.id) || false;

  const load = useCallback(() => {
    setLoading(true);
    api
      .get(`/users/${id}`)
      .then((res) => {
        setProfile(res.data.user);
        setPosts(res.data.posts);
        setReposts(res.data.reposts);
      })
      .catch((err) => console.error("failed to load profile", err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  // Follow or unfollow, then reload to refresh counts and lists.
  const toggleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${id}/follow`);
      } else {
        await api.post(`/users/${id}/follow`);
      }
      load();
    } catch (err) {
      console.error("failed to toggle follow", err);
    }
  };

  const updatePostIn = (setter) => (updated) =>
    setter((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

  if (loading) return <Loading>Loading profile…</Loading>;
  if (!profile) return <Empty>User not found.</Empty>;

  const shown = tab === "posts" ? posts : reposts;

  return (
    <Page>
      <PageHeader>
        <h1>{profile.name}</h1>
      </PageHeader>

      <Head>
        <Top>
          <Avatar user={profile} size={84} />
          {!isMe && (
            <FollowButton $following={isFollowing} onClick={toggleFollow}>
              {isFollowing ? "Following" : "Follow"}
            </FollowButton>
          )}
        </Top>

        <Name>{profile.name}</Name>
        <Handle>@{profile.username}</Handle>
        {profile.bio && <Bio>{profile.bio}</Bio>}

        <Stats>
          <Stat onClick={() => setModal("following")}>
            <strong>{profile.following?.length || 0}</strong> Following
          </Stat>
          <Stat onClick={() => setModal("followers")}>
            <strong>{profile.followers?.length || 0}</strong> Followers
          </Stat>
        </Stats>
      </Head>

      <Tabs>
        <Tab $active={tab === "posts"} onClick={() => setTab("posts")}>
          Posts
        </Tab>
        <Tab $active={tab === "reposts"} onClick={() => setTab("reposts")}>
          Reposts
        </Tab>
      </Tabs>

      {shown.length === 0 ? (
        <Empty>{tab === "posts" ? "No posts yet." : "No reposts yet."}</Empty>
      ) : (
        shown.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onChange={updatePostIn(tab === "posts" ? setPosts : setReposts)}
          />
        ))
      )}

      {modal === "followers" && (
        <UserListModal
          title="Followers"
          users={profile.followers || []}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "following" && (
        <UserListModal
          title="Following"
          users={profile.following || []}
          onClose={() => setModal(null)}
        />
      )}
    </Page>
  );
};

export default Profile;
