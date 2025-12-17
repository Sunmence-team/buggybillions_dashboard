import React from 'react'
import { assests } from '../assets/images/assest'
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { BsFileEarmarkMedicalFill } from "react-icons/bs";
import { RiUserAddFill } from "react-icons/ri";
import { MdAssignmentAdd } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";

const LeftNav = ({ isOpen = false, toggleSidebar }) => {


    const navLinks = [
        { 
            name: "Dashboard", 
            path: "/user/overview", 
            icon: <LuLayoutDashboard />, 
            role: "user" 
        },
        { 
            name: "Curriculum", 
            path: "/tutor/curriculum", 
            icon: <BsFileEarmarkMedicalFill />, 
            role: "tutor" 
        },
        { 
            name: "Attendance", 
            path: "/tutor/Attendance", 
            icon: <GiNotebook />, 
            role: "tutor" 
        },
        { 
            name: "Member", 
            path: "/tutor/Student", 
            icon: <RiUserAddFill />, 
            role: "tutor" 
        },
        { 
            name: "Assignment", 
            path: "/tutor/Assignment", 
            icon: <MdAssignmentAdd />, 
            role: "tutor" 
        }
    ]

    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <div className={`
            fixed md:relative h-full w-1/5 bg-[#796FAB] text-white
            transform transition-transform duration-300 ease-in-out z-20 rounded-r-[30px]
            ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
            <div className="flex flex-col h-full pt-4 px-4 lg:pt-2">
            <div className="p-4 mb-4 border-b pe-0 border-gray-300 py-5">
                <div className="flex items-center justify-between">
                    <img src={assests.logo} className='' alt="Buggy Academy Logo" />
                    <button 
                        type='button'
                        className='md:hidden inline-block'
                        onClick={toggleSidebar}
                    >
                        <IoIosClose />
                    </button>
                    </div>
            </div>
            <nav className="flex-1 overflow-y-auto no-scrollbar">
                <ul className="space-y-2">
                {/* {navLinks.filter(link => link.role === user?.role).map((item) => { */}
                {navLinks.map((navlink) => {
                    return (
                        <li key={navlink.path}>
                            <NavLink
                                to={navlink.path}
                                end
                                className={({ isActive }) => `
                                    flex items-center gap-3 p-3 text-white
                                    ${(isActive ? 'font-semibold opacity-100' : 'hover:font-bold opacity-70')}
                                `}
                                onClick={handleNavClick}
                            >
                                {navlink.icon}
                            <span>{navlink.name}</span>
                            </NavLink>
                        </li>
                    )
                })}
                </ul>
            </nav>
            </div>
        </div>
    )
}

export default LeftNav