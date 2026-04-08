import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.role) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      setSuccess("Registration successful. Please login.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={onSubmit}>
        <h2>Register</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />

        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
          <option value="administrator">Administrator</option>
        </select>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button disabled={loading} type="submit">
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
