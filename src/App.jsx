import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import StudentsPage from "./pages/StudentsPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import GradesPage from "./pages/GradesPage.jsx";
import TimetablePage from "./pages/TimetablePage.jsx";
import AnnouncementsPage from "./pages/AnnouncementsPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute roles={["admin", "teacher", "student", "administrator"]}>
            <StudentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute roles={["admin", "teacher", "student", "administrator"]}>
            <AttendancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grades"
        element={
          <ProtectedRoute roles={["admin", "teacher", "student", "administrator"]}>
            <GradesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable"
        element={
          <ProtectedRoute roles={["admin", "teacher", "student", "administrator"]}>
            <TimetablePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute roles={["admin", "teacher", "student", "administrator"]}>
            <AnnouncementsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute roles={["admin", "teacher", "administrator"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
