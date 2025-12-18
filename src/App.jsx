import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "./layout/MainLayout";

import Overview from "./pages/student/Overview";
import Curriculum from "./pages/tutor/Curriculum";
import Attendance from "./pages/tutor/Attendance";
import Student from "./pages/tutor/Student";
import Assignment from "./pages/tutor/Assignment";
import Timetable from "./pages/student/TimeTable";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/tutor/Dashboard";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* student routes */}
        <Route
          path="/student/overview"
          element={<MainLayout child={<Overview />} />}
        />

        {/* Tutor routes */}
        <Route
          path="/tutor/curriculum"
          element={<MainLayout child={<Curriculum />} />}
        />
        <Route
          path="/tutor/attendance"
          element={<MainLayout child={<Attendance />} />}
        />
        <Route
          path="/tutor/dashboard"
          element={<MainLayout child={<Dashboard />} />}
        />
        <Route
          path="/tutor/student"
          element={<MainLayout child={<Student />} />}
        />
        <Route
          path="/tutor/assignment"
          element={<MainLayout child={<Assignment />} />}
        />
        <Route
          path="/student/timetable"
          element={<MainLayout child={<Timetable />} />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </>
  );
}

export default App;





