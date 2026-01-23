import { FiAlertTriangle } from 'react-icons/fi';
import { MdEditCalendar } from 'react-icons/md';
import { BiBookmarkPlus } from 'react-icons/bi';
import { IoMdTime, IoIosTimer } from 'react-icons/io';
import { GrFormCheckmark } from 'react-icons/gr';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

export const assignments = [
  {
    id: 1,
    week: "Week 05",
    category: "UX Research",
    title: "User Persona Profiles",
    description:
      "Create 3 detailed user personas based on interview data collected last week include goals, frustrations, and...",
    status: "due-soon",
    statusLabel: "Due Soon",
    statusIcon: FiAlertTriangle,
    dueDate: "2025-10-15T23:59:00",
    dateIcon: MdEditCalendar,
    buttonText: "Submit",
    buttonIcon: BiBookmarkPlus,
    borderColor: "border-[#E5AA2D]",
    statusBgColor: "bg-[#e5ab2d3d]",
    statusTextColor: "text-[#E5AA2D]",
    buttonBgColor: "bg-[#E5AA2D]",
    buttonTextColor: "text-white",
    statusIconBg: ""
  },
  {
    id: 2,
    week: "Week 05",
    category: "UX Research",
    title: "User Persona Profiles",
    description:
      "Create 3 detailed user personas based on interview data collected last week include goals, frustrations, and...",
    status: "pending",
    statusLabel: "Pending",
    statusIcon: IoMdTime,
    dueDate: "2025-10-15T23:59:00",
    dateIcon: MdEditCalendar,
    buttonText: "View Details",
    buttonIcon: null,
    borderColor: "border-gray-400",
    statusBgColor: "bg-gray-400",
    statusTextColor: "text-black",
    buttonBgColor: "bg-white shadow",
    buttonTextColor: "text-black",
    statusIconBg: ""
  },
  {
    id: 3,
    week: "Week 05",
    category: "UX Research",
    title: "User Persona Profiles",
    description:
      "Create 3 detailed user personas based on interview data collected last week include goals, frustrations, and...",
    status: "submitted",
    statusLabel: "Submitted",
    statusIcon: GrFormCheckmark,
    dueDate: "2025-10-10T12:00:00",
    dateIcon: MdEditCalendar,
    buttonText: "View Submission",
    buttonIcon: null,
    borderColor: "border-[#796fab78]",
    statusBgColor: "bg-[#796fab78]",
    statusTextColor: "text-[#796FAB]",
    buttonBgColor: "bg-[#796fab78]",
    buttonTextColor: "text-white",
    statusIconBg: "bg-[#796FAB] rounded-full text-white"
  },
  {
    id: 4,
    week: "Week 05",
    category: "UX Research",
    title: "User Persona Profiles",
    description:
      "Create 3 detailed user personas based on interview data collected last week include goals, frustrations, and...",
    status: "graded",
    statusLabel: "Graded",
    statusIcon: RiVerifiedBadgeFill,
    dueDate: "2025-10-02T12:00:00",
    dateIcon: IoIosTimer,
    buttonText: "View Feedback",
    buttonIcon: null,
    borderColor: "border-green-400",
    statusBgColor: "bg-green-200",
    statusTextColor: "text-green-600",
    buttonBgColor: "bg-green-100",
    buttonTextColor: "text-green-700",
    statusIconBg: "bg-green-400 rounded-full text-white"
  }
];
