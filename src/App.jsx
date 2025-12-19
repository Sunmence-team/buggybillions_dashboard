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
import StudentCurriculm from "./pages/student/StudentCurriculm";
import StudentAssignments from "./pages/student/StudentAssignments";
import Dashboard from "./pages/tutor/Dashboard";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Student */}
        <Route
          path="/student/overview"
          element={<MainLayout child={<Overview />} />}
        />

        <Route
          path="/student/studentcurriculum"
          element={<MainLayout child={<StudentCurriculm />} />}
        />
        <Route
          path="/student/studentassignments"
          element={<MainLayout child={<StudentAssignments />} />}
        />
        <Route
          path="/student/timetable"
          element={<MainLayout child={<Timetable />} />}
        />

        {/* Tutor */}
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
      </Routes>
    </>
  );
}

export default App;





