import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: "", date: "", status: "present" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canMark = ["admin", "teacher"].includes(user?.role);

  const load = async () => {
    try {
      setLoading(true);
      const [attendanceRes, studentRes] = await Promise.all([api.get("/attendance"), api.get("/students")]);
      setRecords(attendanceRes.data.data || []);
      setStudents(studentRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.studentId || !form.date || !form.status) {
      setError("All fields are required");
      return;
    }
    try {
      await api.post("/attendance", form);
      setForm({ studentId: "", date: "", status: "present" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  return (
    <div className="layout">
      <h2>Attendance</h2>
      {error && <p className="error">{error}</p>}
      {canMark && (
        <form className="card form-grid" onSubmit={onSubmit}>
          <select value={form.studentId} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}>
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo})
              </option>
            ))}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
          <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
          <button type="submit">Mark Attendance</button>
        </form>
      )}
      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Student Id</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.studentId}</td>
                  <td>{r.date}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
