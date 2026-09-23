import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Avatar from "./Avatar.jsx";
import { Empty } from "../styles/shared";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 20, 25, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  width: 90%;
  max-width: 420px;
  max-height: 70vh;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0;
    font-size: 18px;
  }
`;

const Close = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: 50%;
  width: 34px;
  height: 34px;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const List = styled.div`
  overflow-y: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  .name {
    font-weight: 700;
  }
  .handle {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
  }
`;

// A modal listing users (followers or following). Clicking a user navigates
// to their profile.
const UserListModal = ({ title, users, onClose }) => {
  const navigate = useNavigate();

  const open = (id) => {
    onClose();
    navigate(`/profile/${id}`);
  };

  return (
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Head>
          <h3>{title}</h3>
          <Close onClick={onClose}>✕</Close>
        </Head>
        <List>
          {users.length === 0 && <Empty>No users yet.</Empty>}
          {users.map((u) => (
            <Row key={u.id} onClick={() => open(u.id)}>
              <Avatar user={u} size={44} />
              <RowText>
                <span className="name">{u.name}</span>
                <span className="handle">@{u.username}</span>
              </RowText>
            </Row>
          ))}
        </List>
      </Modal>
    </Backdrop>
  );
};

export default UserListModal;
