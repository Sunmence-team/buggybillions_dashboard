import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "./layout/MainLayout";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentOverview from "./pages/student/Overview";
import Timetable from "./pages/student/Timetable";
import StudentCurriculm from "./pages/student/StudentCurriculm";
import StudentAssignments from "./pages/student/StudentAssignments";

import WeeklyLessons from "./pages/tutor/WeeklyLessons";
import Assignment from "./pages/tutor/Assignment";
import Attendance from "./pages/tutor/Attendance";
import GradeAssignment from "./pages/tutor/GradeAssignment";
import TutorProfile from "./pages/tutor/TutorProfile";

import AdminOverview from "./pages/admin/Overview";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTutors from "./pages/admin/ManageTutors";
import Profile from "./pages/student/StudentProfile";
import ProfileSetUp from "./pages/auth/ProfileSetUp";
import { useUser } from "./context/UserContext";
import ManageStacks from "./pages/admin/ManageStacks";
import ManageCourses from "./pages/admin/ManageCourses";

function App() {
  const { user } = useUser();
  return (
    <>
      <Toaster />

      <Routes>
        {/* Auth */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/profilesetup" element={<ProfileSetUp />} />

        {/* Student */}
        <Route
          path="/student/overview"
          element={
            <MainLayout
              child={<StudentOverview />}
              heading="Student Dashboard"
              subText={`Welcome ${user?.fullname ?? ""}`}
            />
          }
        />

        <Route
          path="/student/studentcurriculum"
          element={
            <MainLayout
              child={<StudentCurriculm />}
              heading={"My Curriculum"}
            />
          }
        />
        <Route
          path="/student/studentassignments"
          element={
            <MainLayout child={<StudentAssignments />} heading={"My Assignments"} />
          }
        />
        <Route
          path="/student/timetable"
          element={<MainLayout child={<Timetable />} heading={"Heading"} />}
        />
        <Route
          path="/student/studentprofile"
          element={
            <MainLayout child={<Profile />} heading={"My profile"} />
          }
        />

        {/* Tutor */}
        <Route
          path="/tutor/weekly-lessons"
          element={
            <MainLayout
              child={<WeeklyLessons />}
              heading={"Create Weekly Lessons"}
            />
          }
        />
        <Route
          path="/tutor/assignment"
          element={
            <MainLayout
              child={<Assignment />}
              heading={"Create Assignment"}
            />
          }
        />
        <Route
          path="/tutor/attendance"
          element={
            <MainLayout
              child={<Attendance />}
              heading={"Mark Attendance"}
            />
          }
        />
        <Route
          path="/tutor/grade"
          element={
            <MainLayout
              child={<GradeAssignment />}
              heading={"Grade Assignment"}
            />
          }
        />
        <Route
          path="/tutor/profile"
          element={
            <MainLayout
              child={<TutorProfile />}
              heading={"Tutor Profile"}
            />
          }
        />

        {/* Admin */}
        <Route
          path="/admin/overview"
          element={
            <MainLayout child={<AdminOverview />} heading={"Admin Dashboard"} />
          }
        />
        <Route
          path="/admin/managestudents"
          element={
            <MainLayout
              child={<ManageStudents />}
              heading={"Manage All Students"}
              subText="Easily manage all students"
            />
          }
        />
        <Route
          path="/admin/managetutors"
          element={
            <MainLayout child={<ManageTutors />} 
            heading={"Manage All Tutors"} 
            subText="Easily manage all Tutors"
            />
          }
        />
        <Route
          path="/admin/managestacks"
          element={
            <MainLayout child={<ManageStacks />} heading={"Manage All Stacks"} />
          }
        />
        <Route
          path="/admin/managecourses"
          element={
            <MainLayout child={<ManageCourses />} heading={"Manage All Courses"} />
          }
        />
      </Routes>
      </>
  );
}

export default App;