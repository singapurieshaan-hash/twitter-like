import styled from "styled-components";
import { initial } from "../utils/helpers";

// Rounded image avatar.
const AvatarImg = styled.img`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

// Blue circle fallback with the user's initial.
const AvatarFallback = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  font-size: ${({ $size }) => $size / 2.2}px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  user-select: none;
`;

// Shows the profile image if present, otherwise the initial fallback.
const Avatar = ({ user, size = 48 }) => {
  if (user?.profileImage) {
    return <AvatarImg $size={size} src={user.profileImage} alt={user.name} />;
  }
  return (
    <AvatarFallback $size={size}>
      {initial(user?.name || user?.username)}
    </AvatarFallback>
  );
};

export default Avatar;
