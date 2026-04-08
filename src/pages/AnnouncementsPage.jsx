import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", audience: "all" });
  const [error, setError] = useState("");
  const canPost = ["admin", "teacher", "administrator"].includes(user?.role);

  const load = async () => {
    try {
      const res = await api.get("/announcements");
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load announcements");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/announcements", form);
      setForm({ title: "", content: "", audience: "all" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post announcement");
    }
  };

  return (
    <div className="layout">
      <h2>Announcements</h2>
      {error && <p className="error">{error}</p>}
      {canPost && (
        <form className="card" onSubmit={onSubmit}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <input
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          />
          <select value={form.audience} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))}>
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
          </select>
          <button type="submit">Post Announcement</button>
        </form>
      )}
      <div className="card">
        {items.map((a) => (
          <div key={a.id} className="announcement-item">
            <h4>{a.title}</h4>
            <p>{a.content}</p>
            <p className="muted">
              Audience: {a.audience} | Date: {a.createdAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
