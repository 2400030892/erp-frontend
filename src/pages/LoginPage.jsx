import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let text = "";
  for (let i = 0; i < 6; i += 1) {
    const idx = Math.floor(Math.random() * chars.length);
    text += chars[idx];
  }
  return { question: text, answer: text };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (captchaInput.trim().toLowerCase() !== captcha.answer.toLowerCase()) {
      setError("Captcha is incorrect");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);
      login(res.data.data.token, res.data.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card" onSubmit={onSubmit}>
        <h2>Edu ERP Login</h2>
        <p className="muted">Use demo: admin@edu.com / Admin@123</p>

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />

        <label>Captcha</label>
        <div className="captcha-row">
          <div className="captcha-box">{captcha.question}</div>
          <button
            type="button"
            onClick={() => {
              setCaptcha(generateCaptcha());
              setCaptchaInput("");
            }}
          >
            Refresh
          </button>
        </div>
        <input
          name="captcha"
          placeholder="Enter captcha text"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
        />

        {error && <p className="error">{error}</p>}
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="muted">
          New user? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
