import { useState } from "react";
import styled from "styled-components";
import api from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import { PrimaryButton } from "../styles/shared";

const MAX = 500;

const Form = styled.form`
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 8px solid ${({ theme }) => theme.colors.border};
`;

const Main = styled.div`
  flex: 1;
`;

const TextInput = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  font-size: 19px;
  font-family: inherit;
  padding: 8px 0;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 10px;
`;

const Count = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// Box at the top of the feed for writing a new post.
// `onPosted(newPost)` is called after a successful create.
const PostComposer = ({ onPosted }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      const res = await api.post("/posts", { content: text });
      setContent("");
      if (onPosted) onPosted(res.data);
    } catch (err) {
      console.error("failed to create post", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <Form onSubmit={submit}>
      <Avatar user={user} size={48} />
      <Main>
        <TextInput
          placeholder="What's happening?"
          value={content}
          maxLength={MAX}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <FooterRow>
          <Count>
            {content.length}/{MAX}
          </Count>
          <PrimaryButton
            $small
            type="submit"
            disabled={!content.trim() || sending}
          >
            {sending ? "Posting…" : "Post"}
          </PrimaryButton>
        </FooterRow>
      </Main>
    </Form>
  );
};

export default PostComposer;
