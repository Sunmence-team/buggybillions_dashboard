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

import Student from "./pages/tutor/Student";
import Assignment from "./pages/tutor/Assignment";
import TutorAnnouncement from "./pages/tutor/TutorAnnouncement";

import AdminOverview from "./pages/admin/Overview";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageTutors from "./pages/admin/ManageTutors";
import CreateLessonForm from "./components/forms/CreateLessonForm";
import Attendance from "./pages/tutor/Attendance";
import TutorProfile from "./pages/tutor/TutorProfile";
import Profile from "./pages/student/StudentProfile";
import ProfileSetUp from "./pages/auth/ProfileSetUp";
import { useUser } from "./context/UserContext";

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
        {/* <Route
          path="/student/timetable"
          element={<MainLayout child={<Timetable />} heading={"Heading"} />}
        /> */}
        <Route
          path="/student/studentprofile"
          element={
            <MainLayout child={<Profile />} heading={"My profile"} />
          }
        />

        {/* Tutor */}
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
          path="/tutor/curriculum"
          element={<MainLayout child={<Curriculum />} heading={"My Curriculum"} />}
        />
        <Route
          path="/tutor/curriculum/lessonForm"
          element={
            <MainLayout child={<CreateLessonForm />} heading={"CreateLesson"} />
          }
        />
        <Route
          path="/tutor/attendance"
          element={<MainLayout child={<Attendance />} heading={"My student's Attendance"} />}
        />
        
        <Route
          path="/tutor/tutorprofile"
          element={
            <MainLayout child={<TutorProfile />} heading={"Tutor's Profile"} />
          }
        />
        <Route
          path="/tutor/student"
          element={<MainLayout child={<Student />} heading={"My Students"} />}
        />
        <Route
          path="/tutor/tutorannouncement"
          element={
            <MainLayout child={<TutorAnnouncement />} heading={"Announcemwnt"} />
          }
        />
        <Route
          path="/tutor/assignment"
          element={<MainLayout child={<Assignment />} heading={"Student's Assignment"} />}
        />

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
            subText="Easily manage all Tutors"/>
          }
        />
      </Routes>
    </>
  );
}

export default App;
