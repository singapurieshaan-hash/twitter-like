import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Input, TextArea, PrimaryButton } from "../styles/shared";
import {
  AuthPage,
  AuthCard,
  Brand,
  FormError,
  AuthSwitch,
} from "../styles/auth";

const Signup = () => {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    bio: "",
    profileImage: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signup(form);
    } catch (err) {
      setError(err.response?.data?.error || "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthPage>
      <AuthCard>
        <Brand $big>🐦 Chirp</Brand>
        <h2>Create your account</h2>
        {error && <FormError>{error}</FormError>}
        <form onSubmit={submit}>
          <Input
            placeholder="Name"
            value={form.name}
            onChange={update("name")}
            autoFocus
          />
          <Input
            placeholder="Username"
            value={form.username}
            onChange={update("username")}
          />
          <Input
            type="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={update("password")}
          />
          <Input
            placeholder="Profile image URL (optional)"
            value={form.profileImage}
            onChange={update("profileImage")}
          />
          <TextArea
            placeholder="Bio (optional)"
            value={form.bio}
            onChange={update("bio")}
            rows={2}
          />
          <PrimaryButton $full type="submit" disabled={busy}>
            {busy ? "Creating…" : "Sign up"}
          </PrimaryButton>
        </form>
        <AuthSwitch>
          Already have an account? <Link to="/login">Log in</Link>
        </AuthSwitch>
      </AuthCard>
    </AuthPage>
  );
};

export default Signup;
