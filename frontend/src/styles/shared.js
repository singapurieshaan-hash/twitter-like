import styled, { css } from "styled-components";

// The blue pill "Post" / primary button used across the app.
// Variants: `full` (100% width), `small` (compact).
export const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-weight: 700;
  font-size: 15px;
  padding: ${({ $small }) => ($small ? "8px 18px" : "12px 20px")};
  width: ${({ $full }) => ($full ? "100%" : "auto")};
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.blueDark};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Two-column app shell: fixed sidebar + scrolling content column.
export const AppShell = styled.div`
  display: flex;
  min-height: 100vh;
  max-width: calc(
    ${({ theme }) => theme.layout.sidebar} +
      ${({ theme }) => theme.layout.content} + 40px
  );
  margin: 0 auto;
`;

// The central content column with subtle side borders.
export const MainColumn = styled.main`
  flex: 1;
  min-height: 100vh;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  max-width: ${({ theme }) => theme.layout.content};

  @media (max-width: 700px) {
    border: none;
    max-width: 100%;
  }
`;

// Sticky page heading bar.
export const PageHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 5;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 14px 16px;

  h1 {
    margin: 0;
    font-size: 20px;
  }
`;

const centeredText = css`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const Loading = styled.div`
  ${centeredText}
`;

export const Empty = styled.div`
  ${centeredText}
`;

// Simple wrapper for a page's content within the main column.
export const Page = styled.div`
  padding-bottom: 60px;
`;

// Text input / textarea used on auth and composer forms.
export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 12px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue};
  }
`;
