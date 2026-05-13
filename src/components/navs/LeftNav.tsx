import React from "react";
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { RiUserAddFill } from "react-icons/ri";
import { MdAssignmentAdd, MdLibraryBooks, MdLayers, MdSentimentVerySatisfied, MdLogout, MdSchool, MdCampaign } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { useUser } from "../../context/UserContext";
import { PiStudent, PiChalkboardTeacherFill } from "react-icons/pi";
import { FaRegUser, FaGraduationCap } from "react-icons/fa";
import { motion } from "framer-motion";
import { assests } from "../../assets/assest";

interface LeftNavProps {
  setIsExpanded: (value: boolean) => void;
}

const LeftNav: React.FC<LeftNavProps> = ({ setIsExpanded }) => {
  const { user, logout } = useUser();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/student/overview",
      icon: <LuLayoutDashboard />,
      role: "student",
    },
    {
      name: "Student Curriculum",
      path: "/student/studentcurriculum",
      icon: <BsFileEarmarkMedicalFill />,
      role: "student",
      hidden: true,
    },
    {
      name: "Assignments",
      path: "/student/studentassignments",
      icon: <MdSentimentVerySatisfied />,
      role: "student",
    },
    {
      name: "Profile",
      path: "/student/studentprofile",
      icon: <FaRegUser />,
      role: "student",
    },
    {
      name: "Dashboard",
      path: "/admin/overview",
      icon: <LuLayoutDashboard />,
      role: "admin",
    },
    {
      name: "Weekly Lessons",
      path: "/tutor/weekly-lessons",
      icon: <LuLayoutDashboard />,
      role: "tutor",
    },
    {
      name: "Create Assignment",
      path: "/tutor/assignment",
      icon: <BsFileEarmarkMedicalFill />,
      role: "tutor",
    },
    {
      name: "Mark Attendance",
      path: "/tutor/attendance",
      icon: <GiNotebook />,
      role: "tutor",
    },
    {
      name: "Grade Assignment",
      path: "/tutor/grade",
      icon: <RiUserAddFill />,
      role: "tutor",
    },
    {
      name: "Profile",
      path: "/tutor/profile",
      icon: <MdAssignmentAdd />,
      role: "tutor",
    },
    {
      name: "Students",
      path: "/admin/managestudents",
      icon: <PiStudent />,
      role: "admin",
    },
    {
      name: "Tutors",
      path: "/admin/managetutors",
      icon: <PiChalkboardTeacherFill />,
      role: "admin",
    },
    {
      name: "Courses",
      path: "/admin/managecourses",
      icon: <MdLibraryBooks />,
      role: "admin",
    },
    {
      name: "Stacks",
      path: "/admin/managestacks",
      icon: <MdLayers />,
      role: "admin",
    },
    {
      name: "Classes",
      path: "/admin/manageclasses",
      icon: <MdSchool />,
      role: "admin",
    },
    {
      name: "Announcements",
      path: "/admin/manageannouncements",
      icon: <MdCampaign />,
      role: "admin",
    },
  ];

  const filteredLinks = navLinks.filter(
    (navlink) => navlink.role === user?.role && !navlink.hidden
  );

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full flex flex-col bg-purple"
    >
      <div className="p-2 border-b border-white/20">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 rounded-xl flex items-center justify-center ms-5">
            <img src={assests.smalllogo} alt="" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">BuggyBillions</h1>
            <p className="text-white/60 text-xs capitalize">{user?.role} Portal</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-1 mt-3">
        {filteredLinks.map((navlink, index) => (
          <motion.div
            key={navlink.path}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <NavLink
              to={navlink.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all duration-200 ${
                  isActive
                    ? "bg-white/20 font-semibold"
                    : "hover:bg-white/10"
                }
              `}
              onClick={() => setIsExpanded(false)}
            >
              <span className="text-lg">{navlink.icon}</span>
              <span className="text-sm">{navlink.name}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/20">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <MdLogout className="text-lg" />
          <span className="text-sm">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default LeftNav;
