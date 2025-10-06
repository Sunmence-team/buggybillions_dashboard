import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import MainLayout from "./layout/MainLayout"
import Overview from "./pages/user/Overview"
import Curriculum from "./pages/tutor/Curriculum"
import Attendance from "./pages/tutor/Attendance"
import Student from "./pages/tutor/Student"

function App() {
  return (
    <>
      <Toaster/>
      <Routes>
        <Route 
          path="/login"
          element={<MainLayout child={<Overview />} />}
        />
        <Route 
          path="/user/overview"
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
      </Routes> 
    </>
  )
}

export default App
