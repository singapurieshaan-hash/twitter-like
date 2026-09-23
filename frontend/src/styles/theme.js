// Central design tokens for the blue-and-white Twitter-inspired theme.
// Consumed via styled-components' ThemeProvider, so any styled component
// can read `({ theme }) => theme.colors.blue`, etc.
const theme = {
  colors: {
    blue: "#1d9bf0", // primary bright blue accent
    blueDark: "#1a8cd8", // hover / pressed
    blueSoft: "#e8f5fe", // light blue hover backgrounds
    white: "#ffffff",
    text: "#0f1419", // near-black primary text
    textMuted: "#536471", // secondary / handle text
    border: "#eff3f4", // subtle borders between posts
    borderStrong: "#cfd9de",
    like: "#f91880", // pink for likes
    repost: "#00ba7c", // green for reposts
    danger: "#f4212e",
    bgHover: "#f7f9f9",
  },
  radius: {
    pill: "9999px",
    lg: "16px",
    md: "12px",
  },
  layout: {
    sidebar: "260px",
    content: "600px",
  },
};

export default theme;
