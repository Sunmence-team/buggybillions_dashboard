import React from "react";
import OverviewCards from "../../components/OverviewCards";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineChecklist } from "react-icons/md";
import { BsClipboardCheck } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

const Dashboard = () => {
  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search activities"
            className="w-full rounded-md border border-gray-200 shadow-sm bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex gap-3">
          <button className="rounded-md cursor-pointer bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition">
            Upload Assignment
          </button>

          <button className="rounded-md cursor-pointer bg-yellow-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-yellow-600 transition">
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <OverviewCards
          icon={<HiOutlineUsers />}
          label="Total Students"
          value="10"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />

        <OverviewCards
          icon={<BsClipboardCheck />}
          label="Class Attendance For Today"
          value="3 Present"
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
        />

        <OverviewCards
          icon={<MdOutlineChecklist />}
          label="Pending Grading"
          value="5"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* RECENT SUBMISSION */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-md border border-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Submission</h3>
            <span className="cursor-pointer text-sm text-purple-600">
              View all Submission
            </span>
          </div>

          {/* INNER SCROLL AREA */}
          <div className="max-h-60 overflow-y-scroll pe-3 space-y-4 styled-scrollbar">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4"
              >
                <div>
                  <p className="font-medium">Precious Whitequeen</p>
                  <p className="text-sm text-gray-500">
                    Submitted Food UI project
                  </p>
                </div>

                <span
                  className={`rounded-md px-3 py-1 text-xs font-medium ${
                    index === 1
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {index === 1 ? "Review" : "Grade"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="rounded-xl bg-white p-6 shadow-md border border-gray-200">
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>

          {/* INNER SCROLL AREA */}
          <div className="max-h-60 overflow-y-scroll pe-3 space-y-4 styled-scrollbar">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4"
              >
                <p className="text-xs text-gray-400 mb-1">2 hours ago</p>
                <p className="font-medium">Uploaded Assignment</p>
                <p className="text-sm text-gray-500">
                  Redesign Summence Website and make sure you submit as soon as
                  possible
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
