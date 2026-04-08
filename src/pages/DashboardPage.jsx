import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = String(user?.role || "").toLowerCase();

  const roleHighlights = {
    admin: ["Manage ERP settings", "Monitor all modules", "Control user access"],
    teacher: ["Mark attendance", "Publish grades", "Track class progress"],
    student: ["View attendance", "Check results", "Read announcements"],
    administrator: ["Oversee operations", "Manage resources", "Generate reports"]
  };

  const highlights = roleHighlights[role] || ["Access your modules", "Track updates", "Manage records"];

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="topbar">
        <h2>Edu ERP Dashboard</h2>
        <div>
          <span className="muted">{user?.name} ({user?.role})</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="card">
        <h3>Quick Links</h3>
        <div className="links">
          <Link to="/students">Student Management</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/timetable">Timetable</Link>
          <Link to="/announcements">Announcements</Link>
          <Link to="/reports">Reports</Link>
        </div>
      </main>

      <section className="dashboard-grid">
        <article className="card metric">
          <h4>Current Role</h4>
          <p>{user?.role || "User"}</p>
        </article>
        <article className="card metric">
          <h4>Active Modules</h4>
          <p>6</p>
        </article>
        <article className="card metric">
          <h4>System Status</h4>
          <p>Online</p>
        </article>
      </section>

      <section className="dashboard-grid split">
        <article className="card">
          <h3>Role Highlights</h3>
          <div className="bullet-list">
            {highlights.map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Recent Activity</h3>
          <div className="bullet-list">
            <p>- Login successful for {user?.name}</p>
            <p>- Open modules from Quick Links</p>
            <p>- Use Reports for institution overview</p>
          </div>
        </article>
      </section>
    </div>
  );
}
