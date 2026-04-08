import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/reports/overview");
        setReport(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load reports");
      }
    }
    load();
  }, []);

  return (
    <div className="layout">
      <h2>Institution Reports</h2>
      {error && <p className="error">{error}</p>}
      {report && (
        <div className="metrics">
          <div className="card metric">
            <h4>Total Students</h4>
            <p>{report.totalStudents}</p>
          </div>
          <div className="card metric">
            <h4>Total Teachers</h4>
            <p>{report.totalTeachers}</p>
          </div>
          <div className="card metric">
            <h4>Attendance Rate</h4>
            <p>{report.attendanceRate}%</p>
          </div>
          <div className="card metric">
            <h4>Average Marks</h4>
            <p>{report.averageMarks}</p>
          </div>
          <div className="card metric">
            <h4>Announcements</h4>
            <p>{report.totalAnnouncements}</p>
          </div>
        </div>
      )}
    </div>
  );
}
