import { RxDashboard } from "react-icons/rx";
import { MdOutlineTask, MdOutlineMessage, MdOutlineLogout } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";

export const navItems = [
  {
    name: "Dashboard",
    icon: RxDashboard,
    path: "/dashboard/employee/overview",
    role: ["employee"],
  },
  {
    name: "Task",
    icon: MdOutlineTask,
    path: "/dashboard/employee/tasks",
    role: ["employee"],
  },
  {
    name: "Communication",
    icon: MdOutlineMessage,
    path: "/dashboard/general/communication",
    role: ["admin"],
  },
  {
    name: "Leave Request",
    icon: MdOutlineLogout,
    path: "/dashboard/employee/managerequests",
    role: ["admin"],
  },
  {
    name: "Profile",
    icon: FaRegUser,
    path: "/dashboard/employee/profile",
    role: ["admin"],
  },
];
