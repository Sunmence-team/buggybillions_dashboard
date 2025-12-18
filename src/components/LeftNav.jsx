import React from "react";
import { assests } from "../assets/assest";
import { LuLayoutDashboard } from "react-icons/lu";
import { NavLink } from "react-router-dom";
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { RiUserAddFill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";

const LeftNav = ({ isExpanded, setIsExpanded }) => {
  const navLinks = [
    {
      name: "Dashboard",
      path: "/student/overview",
      icon: <LuLayoutDashboard />,
      role: "student",
    },
    {
      name: "Timetable",
      path: "/student/Timetable",
      icon: <LuLayoutDashboard />,
      role: "student",
    },
    {
      name: "StudentCurriculum",
      path: "/student/Studentcurriculum",
      icon: <BsFileEarmarkMedicalFill />,
      role: "student",
    },
    {
      name: "Assignments ",
      path: "/student/StudentAssignments ",
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
  ];

  return (
    <div
      className={`transition-all left-nav duration-500 left-nav relative ${
        isExpanded ? "w-64" : "md:w-20 w-0"
      } bg-purple h-full pt-4 lg:pt-2 pb-8 px-2 flex items-start flex-col gap-2`}
    >
      <div className="py-4 mb-4 border-b pe-0 border-gray-300">
        {isExpanded ? (
          <img src={assests.logo} className="" alt="Buggy Academy Logo" />
        ) : (
          <img
            src={assests.smalllogo}
            className="w-1/2 mx-auto"
            alt="Buggy Academy Logo"
          />
        )}
      </div>
      <nav className="overflow-y-auto no-scrollbar w-full flex flex-col gap-2.5 border-b border-white/30 h-[calc(100%-(24px+3rem))]">
        {/* {navLinks.filter(link => link.role === user?.role).map((item) => { */}
        {navLinks.map((navlink) => {
          return (
            <NavLink
              to={navlink.path}
              key={navlink.path}
              className={({ isActive }) => `
                            nav-link flex items-center justify-center gap-3 p-3 text-white
                            ${
                              isActive
                                ? "font-semibold opacity-100"
                                : "hover:font-bold opacity-70"
                            }
                        `}
              onClick={() => setIsExpanded(false)}
            >
              {navlink.icon}
              <span
                className={`text-sm whitespace-nowrap ${
                  isExpanded ? "" : "hidden"
                }`}
              >
                {navlink.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default LeftNav;
