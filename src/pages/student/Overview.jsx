import React from "react";
import OverviewCards from "../../components/OverviewCards";
import { HiOutlineIdentification } from "react-icons/hi";
import { PiBookOpenUserFill } from "react-icons/pi";
import { PiArrowFatLineUp } from "react-icons/pi";

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 justify-between md:grid-cols-3">
        {/* Grey */}
        <OverviewCards
          icon={<HiOutlineIdentification size={"30px"}/>}
          label="Student ID"
          value="BBSTU2025001"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />

        {/* Orange (middle card) */}
        <OverviewCards
          icon={<PiBookOpenUserFill size={"30px"} />}
          label="Course Enrolled"
          value="UI/UX Design"
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
        />

        {/* Grey */}
        <OverviewCards
          icon={<PiArrowFatLineUp size={"30px"}/>}
          label="Grade"
          value="90% Excellent"
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow-md border border-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[25px] font-semibold">Recent Activities</h3>
            <span className="cursor-pointer text-sm text-purple-600">
              View all history
            </span>
          </div>

          <ul className="space-y-4 max-h-[200px] styled-scrollbar overflow-y-scroll pe-2">
            {[1, 2, 3, 4].map((_, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-200 p-4"
              >
                <div>
                  <p className="font-medium">Assignment Submitted</p>
                  <p className="text-sm text-gray-500">Food App Project</p>
                </div>
                <span className="text-[19px] text-gray-700">2 hours ago</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <h3 className="mb-4 text-lg font-semibold">Announcement</h3>

          <div className="space-y-4 max-h-[200px] pe-2 styled-scrollbar overflow-y-scroll">
            <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <small className="text-xs text-yellow-700">
                Today • Important
              </small>
              <h4 className="mt-1 font-medium line-clamp-1">
                Project Submission Reminder
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                This is to remind you all to submit your project on or before
                12am on Friday
              </p>
            </div>

            {[1, 2].map((_, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
              >
                <small className="text-xs text-gray-400">17/12/2025</small>
                <h4 className="mt-1 font-medium line-clamp-1">
                  Project Submission Reminder
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  This is to remind you all to submit your project on or before
                  12am on Friday
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
