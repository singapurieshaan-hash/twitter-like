import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Profile from "./pages/Profile.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import { AppShell, MainColumn, Loading } from "./styles/shared";

// Wraps routes that require authentication. Redirects to /login when the
// user is not signed in.
const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading>Loading…</Loading>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <AppShell>
      <Sidebar />
      <MainColumn>{children}</MainColumn>
    </AppShell>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>

      {/* Public routes redirect to home when already logged in. */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      {/* Protected routes. */}
      <Route
        path="/"
        element={
          <Protected>
            <Home />
          </Protected>
        }
      />
      <Route
        path="/explore"
        element={
          <Protected>
            <Explore />
          </Protected>
        }
      />
      <Route
        path="/bookmarks"
        element={
          <Protected>
            <Bookmarks />
          </Protected>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <Protected>
            <Profile /> 
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};



export default App;
