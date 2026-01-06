import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import MainLayout from "./layout/MainLayout";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

import StudentOverview from "./pages/student/Overview";
import Timetable from "./pages/student/Timetable";
import StudentCurriculm from "./pages/student/StudentCurriculm";
import StudentAssignments from "./pages/student/StudentAssignments";

import Dashboard from "./pages/tutor/Dashboard";
import Curriculum from "./pages/tutor/Curriculum";
import Attendance from "./pages/tutor/Attendance";
import Student from "./pages/tutor/Student";
import Assignment from "./pages/tutor/Assignment";
import TutorAnnouncement from "./pages/tutor/TutorAnnouncement";

import AdminOverview from "./pages/admin/Overview";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTutors from "./pages/admin/ManageTutors";


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
          element={
            <MainLayout 
              child={<StudentOverview />} 
              heading={"Student Dashboard"}
              subText={"Welcome Adeleke"}
            />
          }
        />

        <Route
          path="/student/studentcurriculum"
          element={
            <MainLayout 
              child={<StudentCurriculm />} 
              heading={"My Curriculum"}
              subText={"Check out your curriculum"}
            />
          }
        />
        <Route
          path="/student/studentassignments"
          element={
            <MainLayout 
              child={<StudentAssignments />} 
              heading={"Heading"}
            />
          }
        />
        <Route
          path="/student/timetable"
          element={
            <MainLayout 
              child={<Timetable />} 
              heading={"Heading"}
            />
          }
        />

        {/* Tutor */}
        <Route
          path="/tutor/curriculum"
          element={
            <MainLayout 
              child={<Curriculum />} 
              heading={"Heading"}
            />
          }
        />
        <Route
          path="/tutor/attendance"
          element={
            <MainLayout 
              child={<Attendance />} 
              heading={"Heading"}
            />
          }
        />
        <Route
          path="/tutor/dashboard"
          element={
            <MainLayout 
              child={<Dashboard />} 
              heading={"Tutor's Dashboard"}
              subText={"Manage your course and student progress"}
            />
          }
        />
        <Route
          path="/tutor/student"
          element={
            <MainLayout 
              child={<Student />} 
              heading={"Heading"}
            />
          }
        />
        <Route
          path="/tutor/tutorannouncement"
          element={
            <MainLayout 
              child={<TutorAnnouncement />} 
              heading={"Heading"}
            />
          }
        />
        <Route
          path="/tutor/assignment"
          element={
            <MainLayout 
              child={<Assignment />} 
              heading={"Heading"}
            />
          }
        />


        <Route
          path="/admin/overview"
          element={
            <MainLayout 
              child={<AdminOverview />} 
              heading={"Overview"}
            />
          }
        />
        <Route
          path="/admin/managestudents"
          element={
            <MainLayout 
              child={<ManageStudents />} 
              heading={"Manage Students"}
              subText="Easily manage all students"
            />
          }
        />
        <Route
          path="/admin/managetutors"
          element={
            <MainLayout 
              child={<ManageTutors />} 
              heading={"Manage Tutors"}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;





