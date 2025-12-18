import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./layout/MainLayout";
import Overview from "./pages/students/Overview";
import Curriculum from "./pages/tutor/Curriculum";
import Attendance from "./pages/tutor/Attendance";
import Student from "./pages/tutor/Student";
import Assignment from "./pages/tutor/Assignment";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import StudentCurriculm from "./pages/students/StudentCurriculm";
import StudentAssignments from "./pages/students/StudentAssignments";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/student/overview"
          element={<MainLayout child={<Overview />} />}
        />
        <Route
          path="/tutor/curriculum"
          element={<MainLayout child={<Curriculum />} />}
        />
        <Route
          path="/tutor/attendance"
          element={<MainLayout child={<Attendance />} />}
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
          path="/student/Studentcurriculum"
          element={<MainLayout child={<StudentCurriculm />} />}
        />
        <Route
          path="/student/StudentAssignments"
          element={<MainLayout child={<StudentAssignments />} />}
        />
      </Routes>
    </>
  );
}

export default App;
