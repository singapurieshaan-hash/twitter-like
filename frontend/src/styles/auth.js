import styled from "styled-components";

// Full-screen centered container for the login / signup screens.
export const AuthPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.blueSoft};
`;

export const AuthCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0 2px 24px rgba(15, 20, 25, 0.12);

  h2 {
    margin: 4px 0 20px;
    font-size: 24px;
  }
`;

export const Brand = styled.div`
  font-size: ${({ $big }) => ($big ? "34px" : "24px")};
  font-weight: 800;
  color: ${({ theme }) => theme.colors.blue};
  text-align: center;
  margin-bottom: 8px;
`;

export const FormError = styled.div`
  background: #fdecef;
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px 12px;
  margin-bottom: 14px;
  font-size: 14px;
`;

export const AuthSwitch = styled.p`
  margin-top: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;
