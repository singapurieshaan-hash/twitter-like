import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import { PrimaryButton } from "../styles/shared";

const Nav = styled.nav`
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
  width: ${({ theme }) => theme.layout.sidebar};
  padding: 12px 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 700px) {
    width: 70px;
  }
`;

const Brand = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.blue};
  padding: 8px 12px 16px;
`;

// Navigation link that highlights when active (blue text + soft blue pill).
const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 19px;
  color: ${({ theme }) => theme.colors.text};
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
    text-decoration: none;
  }
  &.active {
    color: ${({ theme }) => theme.colors.blue};
    font-weight: 700;
  }

  @media (max-width: 700px) {
    justify-content: center;
    span.label {
      display: none;
    }
  }
`;

const Icon = styled.span`
  font-size: 20px;
`;

const PostBtn = styled(PrimaryButton)`
  margin-top: 12px;

  @media (max-width: 700px) {
    padding: 12px;
    font-size: 0;
    &::after {
      content: "＋";
      font-size: 20px;
    }
  }
`;

const Footer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.pill};

  @media (max-width: 700px) {
    justify-content: center;
    .user-text {
      display: none;
    }
  }
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  overflow: hidden;

  .name {
    font-weight: 700;
    font-size: 14px;
  }
  .handle {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 13px;
  }
`;

const LogoutBtn = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 10px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.blueSoft};
  }
`;

// Twitter-style left navigation.
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <Brand>🐦 Chirp</Brand>

      <NavItem to="/" end>
        <Icon>🏠</Icon> <span className="label">Home</span>
      </NavItem>
      <NavItem to="/explore">
        <Icon>🔍</Icon> <span className="label">Explore</span>
      </NavItem>
      <NavItem to="/bookmarks">
        <Icon>🔖</Icon> <span className="label">Bookmarks</span>
      </NavItem>
      <NavItem to={`/profile/${user.id}`}>
        <Icon>👤</Icon> <span className="label">Profile</span>
      </NavItem>

      <PostBtn onClick={() => navigate("/")} title="Go to feed to post">
        Post
      </PostBtn>

      <Footer>
        <UserBox>
          <Avatar user={user} size={40} />
          <UserText className="user-text">
            <span className="name">{user.name}</span>
            <span className="handle">@{user.username}</span>
          </UserText>
        </UserBox>
        <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
      </Footer>
    </Nav>
  );
};

export default Sidebar;
