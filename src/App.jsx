import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import MainLayout from "./layout/MainLayout"
import Overview from "./pages/user/Overview"

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
      </Routes> 
    </>
  )
}

export default App
