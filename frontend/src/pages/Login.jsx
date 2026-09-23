import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Input, PrimaryButton } from "../styles/shared";
import {
  AuthPage,
  AuthCard,
  Brand,
  FormError,
  AuthSwitch,
} from "../styles/auth";

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username, password);
      // On success the AuthProvider sets the user and App redirects to "/".
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <Brand $big>🐦 Chirp</Brand>
        <h2>Log in</h2>
        {error && <FormError>{error}</FormError>}
        <form onSubmit={submit}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton $full type="submit" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </PrimaryButton>
        </form>
        <AuthSwitch>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </AuthSwitch>
      </AuthCard>
    </AuthPage>
  );
};

export default Login;
