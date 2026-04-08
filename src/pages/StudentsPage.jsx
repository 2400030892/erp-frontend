import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

const defaultForm = {
  name: "",
  rollNo: "",
  className: "",
  section: "",
  email: "",
  attendancePercent: 0
};

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentRole = String(user?.role || "").toLowerCase();
  const canWrite = ["admin", "teacher"].includes(currentRole);
  const canDelete = currentRole === "admin";

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students");
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.rollNo || !form.className || !form.section || !form.email) {
      setError("All fields except attendance are required");
      return;
    }

    try {
      if (editId) {
        const res = await api.put(`/students/${editId}`, form);
        setStudents((prev) => prev.map((item) => (item.id === editId ? res.data.data : item)));
      } else {
        const res = await api.post("/students", form);
        setStudents((prev) => [res.data.data, ...prev]);
      }
      setForm(defaultForm);
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const onEdit = (student) => {
    setEditId(student.id);
    setForm(student);
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this student?")) {
      return;
    }
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="layout">
      <h2>Student Management</h2>
      {error && <p className="error">{error}</p>}

      {canWrite && (
        <form className="card form-grid" onSubmit={onSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
          <input name="rollNo" placeholder="Roll No" value={form.rollNo} onChange={onChange} />
          <input name="className" placeholder="Class" value={form.className} onChange={onChange} />
          <input name="section" placeholder="Section" value={form.section} onChange={onChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input
            name="attendancePercent"
            type="number"
            placeholder="Attendance %"
            value={form.attendancePercent}
            onChange={onChange}
          />
          <button type="submit">{editId ? "Update Student" : "Add Student"}</button>
        </form>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : students.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Class</th>
                <th>Section</th>
                <th>Email</th>
                <th>Attendance</th>
                {canWrite && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.className}</td>
                  <td>{s.section}</td>
                  <td>{s.email}</td>
                  <td>{s.attendancePercent}%</td>
                  {canWrite && (
                    <td>
                      <button onClick={() => onEdit(s)}>Edit</button>
                      {canDelete && <button onClick={() => onDelete(s.id)}>Delete</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
