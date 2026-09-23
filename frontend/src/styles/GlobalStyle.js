import { createGlobalStyle } from "styled-components";

// App-wide baseline styling: font, resets, and the white page background.
const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${({ theme }) => theme.colors.blue};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }
`;

export default GlobalStyle;
