import React from "react";
import { FaBell, FaStar } from "react-icons/fa";
import { IoIosSearch, IoIosTimer } from "react-icons/io";
import { MdEditCalendar, MdArrowRightAlt } from "react-icons/md";
import { CgSandClock } from "react-icons/cg";
import { GrFormCheckmark } from "react-icons/gr";
import { FiAlertTriangle } from "react-icons/fi";
import { BiBookmarkPlus } from "react-icons/bi";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const StudentAssignments: React.FC = () => {
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Assignments</h1>

          <div className="flex gap-5 items-center mt-5">
            <p className="text-sm text-[#796FAB] py-2 px-3 bg-white shadow rounded-2xl">
              Semester 1
            </p>

            <div className="flex items-center gap-1">
              <MdEditCalendar color="#E5AA2D" size={25} />
              <p className="text-sm text-black">
                2 Assignments Pending
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <IoIosSearch className="absolute left-3 top-2.5 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder="Search assignments"
              className="pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            />
          </div>

          <button className="p-2 rounded-xl border bg-white">
            <FaBell className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 text-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[#E5AA2D] bg-gray-700 p-2 rounded-full">
              <CgSandClock />
            </span>
            <span className="text-xs bg-[#E5AA2D] px-2 py-1 rounded">
              High Priority
            </span>
          </div>

          <h2 className="text-3xl font-bold mt-4">2 Pending</h2>
          <p className="text-sm">Assignments due this week</p>

          <div className="flex justify-between items-center mt-5">
            <p className="text-xs">Next due in 2 days</p>
            <MdArrowRightAlt color="#E5AA2D" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="bg-[#796fab56] p-2 text-white rounded-2xl">
              <span className="bg-[#796FAB] rounded-full">
                <GrFormCheckmark />
              </span>
            </span>
            <p className="text-[#796FAB] bg-[#796fab56] p-1 rounded-full text-xs">
              85% complete
            </p>
          </div>

          <p className="font-bold text-3xl mt-4">12 Submitted</p>
          <p className="text-black">
            Total Assignments this term
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="bg-[#796fab56] p-2 text-[#796FAB] rounded-2xl">
              <FaStar />
            </span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Top 10%
            </span>
          </div>

          <h2 className="text-3xl font-bold mt-4">94 / 100</h2>
          <p className="text-black">Average grade</p>

          <div className="flex items-center mt-2 gap-2">
            <h3 className="text-[15px]">RECENT:</h3>
            <p className="text-[#796FAB] text-xs">
              A+ on Wireframing
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex items-center justify-between mt-12">
        <div className="flex gap-2 shadow bg-white p-2 rounded-full">
          {["All Tasks", "Due Soon", "Submitted", "Graded"].map(
            (tab: string) => (
              <button
                key={tab}
                className="px-4 py-2 text-sm rounded-xl hover:bg-[#796FAB] hover:text-white transition"
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <p className="text-[13px]">SORT BY:</p>
          <select className="px-3 py-2 rounded-xl border text-sm">
            <option>Due Date (Closest)</option>
          </select>
        </div>
      </div>

      {/* ASSIGNMENT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
        {/* Due Soon */}
        <div className="bg-white rounded-2xl border-l-4 border-[#E5AA2D] p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs">Week 05 :</p>
                <p className="text-[#796FAB]">UX Research</p>
              </div>
              <h3 className="font-bold text-[20px]">
                User Persona Profiles
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-[#e5ab2d3d] text-[#E5AA2D] px-2 py-1 rounded-full">
              <FiAlertTriangle />
              Due Soon
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Create 3 detailed user personas based on interview data
            collected last week...
          </p>

          <div className="flex justify-between items-center mt-10">
            <div className="flex items-center gap-1">
              <MdEditCalendar color="#E5AA2D" size={20} />
              <p className="text-[12px]">
                Due Oct 15, 11:59 PM
              </p>
            </div>

            <button className="flex items-center gap-1 px-3 py-3 bg-[#E5AA2D] text-white rounded-xl text-sm">
              <BiBookmarkPlus size={15} />
              Submit
            </button>
          </div>
        </div>

        {/* Graded */}
        <div className="bg-white rounded-2xl border-l-4 border-[#796FAB] p-5 shadow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1">
                <p className="text-xs">Week 05 :</p>
                <p className="text-[#796FAB]">UX Research</p>
              </div>
              <h3 className="font-bold text-[20px]">
                User Persona Profiles
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-green-200 text-green-600 px-2 py-1 rounded-full">
              <RiVerifiedBadgeFill />
              Graded
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Create 3 detailed user personas based on interview data
            collected last week...
          </p>

          <div className="flex justify-between items-center mt-10">
            <div className="flex items-center gap-1">
              <IoIosTimer color="#796FAB" size={20} />
              <p className="text-[12px]">Graded Oct 02</p>
            </div>

            <button className="flex items-center gap-1 px-3 py-2 bg-[#796fab4c] text-[#796FAB] rounded-xl text-sm">
              View Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;
