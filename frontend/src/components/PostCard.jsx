import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import { timeAgo } from "../utils/helpers";
import Avatar from "./Avatar.jsx";

const Card = styled.article`
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const AvatarWrap = styled.div`
  cursor: pointer;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;

  .name {
    font-weight: 700;
    cursor: pointer;
  }
  .name:hover {
    text-decoration: underline;
  }
  .handle,
  .dot,
  .time {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Content = styled.p`
  margin: 4px 0 10px;
  font-size: 15px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Actions = styled.div`
  display: flex;
  gap: 28px;
`;

// One action button. `$color` sets the active/hover tint per action type.
const Action = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 13px;
  color: ${({ theme, $active, $color }) =>
    $active ? $color : theme.colors.textMuted};
  transition:
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.blueSoft};
    color: ${({ $color }) => $color};
  }
`;

// A single post with author info and like / repost / save action buttons.
// `onChange(updatedPost)` lets the parent replace the post in its state.
const PostCard = ({ post, onChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const author = post.author || {};
  const has = (arr) => Array.isArray(arr) && arr.includes(user.id);

  const liked = has(post.likes);
  const reposted = has(post.reposts);
  const saved = has(post.saves);

  // Toggle an action by calling POST to add or DELETE to remove.
  const toggle = async (action, active) => {
    try {
      const method = active ? "delete" : "post";
      const res = await api[method](`/posts/${post.id}/${action}`);
      if (onChange) onChange(res.data);
    } catch (err) {
      console.error(`failed to ${action} post`, err);
    }
  };

  const goToProfile = () => navigate(`/profile/${author.id}`);

  return (
    <Card>
      <AvatarWrap onClick={goToProfile}>
        <Avatar user={author} size={48} />
      </AvatarWrap>

      <Body>
        <Header>
          <span className="name" onClick={goToProfile}>
            {author.name}
          </span>
          <span className="handle">@{author.username}</span>
          <span className="dot">·</span>
          <span className="time">{timeAgo(post.createdAt)}</span>
        </Header>

        <Content>{post.content}</Content>

        <Actions>
          <Action
            $active={reposted}
            $color="#00ba7c"
            onClick={() => toggle("repost", reposted)}
            title="Repost"
          >
            🔁 <span>{post.reposts?.length || 0}</span>
          </Action>

          <Action
            $active={liked}
            $color="#f91880"
            onClick={() => toggle("like", liked)}
            title="Like"
          >
            {liked ? "❤️" : "🤍"} <span>{post.likes?.length || 0}</span>
          </Action>

          <Action
            $active={saved}
            $color="#1d9bf0"
            onClick={() => toggle("save", saved)}
            title="Save"
          >
            {saved ? "🔖" : "📑"} <span>{post.saves?.length || 0}</span>
          </Action>
        </Actions>
      </Body>
    </Card>
  );
};

export default PostCard;
