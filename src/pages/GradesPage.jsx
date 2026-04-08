import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../services/AuthContext.jsx";

export default function GradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", className: "", dueDate: "" });
  const [gradeForm, setGradeForm] = useState({ studentId: "", assignmentId: "", marks: "" });
  const [error, setError] = useState("");
  const canWrite = ["admin", "teacher"].includes(user?.role);

  const load = async () => {
    try {
      const [g, a, s] = await Promise.all([api.get("/grades"), api.get("/grades/assignments"), api.get("/students")]);
      setGrades(g.data.data || []);
      setAssignments(a.data.data || []);
      setStudents(s.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load grades");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades/assignments", assignmentForm);
      setAssignmentForm({ title: "", className: "", dueDate: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create assignment");
    }
  };

  const addGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades", gradeForm);
      setGradeForm({ studentId: "", assignmentId: "", marks: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add grade");
    }
  };

  return (
    <div className="layout">
      <h2>Grades & Assignments</h2>
      {error && <p className="error">{error}</p>}
      {canWrite && (
        <>
          <form className="card form-grid" onSubmit={createAssignment}>
            <input
              placeholder="Assignment title"
              value={assignmentForm.title}
              onChange={(e) => setAssignmentForm((p) => ({ ...p, title: e.target.value }))}
            />
            <input
              placeholder="Class"
              value={assignmentForm.className}
              onChange={(e) => setAssignmentForm((p) => ({ ...p, className: e.target.value }))}
            />
            <input
              type="date"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm((p) => ({ ...p, dueDate: e.target.value }))}
            />
            <button type="submit">Create Assignment</button>
          </form>
          <form className="card form-grid" onSubmit={addGrade}>
            <select value={gradeForm.studentId} onChange={(e) => setGradeForm((p) => ({ ...p, studentId: e.target.value }))}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={gradeForm.assignmentId}
              onChange={(e) => setGradeForm((p) => ({ ...p, assignmentId: e.target.value }))}
            >
              <option value="">Select assignment</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Marks"
              value={gradeForm.marks}
              onChange={(e) => setGradeForm((p) => ({ ...p, marks: e.target.value }))}
            />
            <button type="submit">Add Grade</button>
          </form>
        </>
      )}
      <div className="card">
        <h3>Grade Records</h3>
        <table>
          <thead>
            <tr>
              <th>Student Id</th>
              <th>Assignment Id</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id}>
                <td>{g.studentId}</td>
                <td>{g.assignmentId}</td>
                <td>{g.marks}</td>
                <td>{g.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
