import React, { FC } from "react";
import { assests } from "../../assets/assest";
import { NavLink } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { RiUserAddFill } from "react-icons/ri";
import { MdAssignmentAdd, MdSentimentVerySatisfied } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { useUser } from "../../context/UserContext";
import { PiStudent, PiChalkboardTeacherFill } from "react-icons/pi";

interface LeftNavProps {
  setIsExpanded: (value: boolean) => void;
}

const LeftNav: FC<LeftNavProps> = ({ setIsExpanded }) => {
  const { user } = useUser();

  const navLinks = [
    {
      name: "Dashboard",
      path: "/student/overview",
      icon: <LuLayoutDashboard />,
      role: "student",
    },
    {
      name: "Timetable",
      path: "/student/timetable",
      icon: <LuLayoutDashboard />,
      role: "student",
    },
    {
      name: "Student Curriculum",
      path: "/student/studentcurriculum",
      icon: <BsFileEarmarkMedicalFill />,
      role: "student",
    },
    {
      name: "Assignments",
      path: "/student/studentassignments",
      icon: <MdSentimentVerySatisfied />,
      role: "student",
    },
    {
      name: "Curriculum",
      path: "/tutor/curriculum",
      icon: <BsFileEarmarkMedicalFill />,
      role: "tutor",
    },
    {
      name: "Attendance",
      path: "/tutor/attendance",
      icon: <GiNotebook />,
      role: "tutor",
    },
    {
      name: "Member",
      path: "/tutor/student",
      icon: <RiUserAddFill />,
      role: "tutor",
    },
    {
      name: "Assignment",
      path: "/tutor/assignment",
      icon: <MdAssignmentAdd />,
      role: "tutor",
    },
    {
      name: "Dashboard",
      path: "/admin/overview",
      icon: <LuLayoutDashboard />,
      role: "admin",
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
  ];

  return (
    <div className="lg:w-full md:w-1/2 w-3/4 transition-all duration-500 relative bg-purple h-full pt-4 lg:pt-2 pb-8 px-4 flex items-start flex-col gap-2">
      <div className="py-4 mb-4 pe-3 w-full">
        <img src={assests.logo} alt="Buggy Academy Logo" />
      </div>

      <nav className="overflow-y-auto no-scrollbar w-full flex flex-col gap-2.5 border-b border-white/30 h-[calc(100%-(24px+3rem))]">
        {navLinks
          .filter((navlink) => navlink.role === user?.role)
          .map((navlink) => (
            <NavLink
              key={navlink.path}
              to={navlink.path}
              className={({ isActive }) =>
                `nav-link flex items-center w-full rounded-md gap-3 p-3 text-white ${
                  isActive
                    ? "font-semibold opacity-100 bg-white/20"
                    : "hover:bg-white/20"
                }`
              }
              onClick={() => setIsExpanded(false)}
            >
              {navlink.icon}
              <span className="text-sm whitespace-nowrap">
                {navlink.name}
              </span>
            </NavLink>
          ))}
      </nav>
    </div>
  );
};

export default LeftNav;
