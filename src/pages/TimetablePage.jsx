import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

export default function TimetablePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    className: "",
    section: "",
    subject: "",
    teacher: "",
    day: "",
    startTime: "",
    endTime: ""
  });
  const [error, setError] = useState("");
  const canWrite = ["admin", "teacher", "administrator"].includes(user?.role);

  const load = async () => {
    try {
      const res = await api.get("/timetable");
      setItems(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load timetable");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/timetable", form);
      setForm({ className: "", section: "", subject: "", teacher: "", day: "", startTime: "", endTime: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save timetable");
    }
  };

  return (
    <div className="layout">
      <h2>Timetable</h2>
      {error && <p className="error">{error}</p>}
      {canWrite && (
        <form className="card form-grid" onSubmit={onSubmit}>
          <input placeholder="Class" value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} />
          <input placeholder="Section" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
          <input placeholder="Teacher" value={form.teacher} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} />
          <input placeholder="Day" value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))} />
          <input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
          <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
          <button type="submit">Add Slot</button>
        </form>
      )}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Day</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.className}</td>
                <td>{t.section}</td>
                <td>{t.subject}</td>
                <td>{t.teacher}</td>
                <td>{t.day}</td>
                <td>
                  {t.startTime} - {t.endTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
