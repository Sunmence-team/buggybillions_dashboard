import React from "react";
import { useUser } from "../../context/UserContext";
import OverviewCards from "../../components/cards/OverviewCards";
import { HiOutlineIdentification } from "react-icons/hi";
import { PiBookOpenUserFill, PiArrowFatLineUp } from "react-icons/pi";

const StudentOverview: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <p>Loading...</p>;
  }

  // Placeholder recent activities and announcements
  const recentActivities = user?.recentActivities || [
    { title: "Assignment Submitted", description: "Food App Project", time: "2 hours ago" },
    { title: "Quiz Completed", description: "UI/UX Basics", time: "1 day ago" },
    { title: "Project Feedback Received", description: "Landing Page Project", time: "3 days ago" },
    { title: "Forum Participation", description: "Week 2 Discussion", time: "5 days ago" },
  ];

  const announcements = user?.announcements || [
    {
      date: "Today",
      type: "Important",
      title: "Project Submission Reminder",
      description: "This is to remind you all to submit your project on or before 12am on Friday",
      color: "yellow",
    },
    {
      date: "17/12/2025",
      type: "Info",
      title: "New Course Materials Available",
      description: "UI/UX advanced resources are now available in your dashboard",
      color: "gray",
    },
    {
      date: "16/12/2025",
      type: "Info",
      title: "Workshop Invitation",
      description: "Join our Figma workshop this Friday at 3 PM",
      color: "gray",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 justify-between md:grid-cols-3">
        <OverviewCards
          icon={<HiOutlineIdentification size="30px" />}
          label="Student ID"
          value={user?.bug_id?.toString() || "N/A"}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
        <OverviewCards
          icon={<PiBookOpenUserFill size="30px" />}
          label="Course Enrolled"
          value={user?.department || "N/A"}
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
        />
        <OverviewCards
          icon={<PiArrowFatLineUp size="30px" />}
          label="Grade"
          value={user?.grade || "N/A"}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>

      {/* Recent Activities & Announcements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow-md border border-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[25px] font-semibold">Recent Activities</h3>
            <span className="cursor-pointer text-sm text-purple-600">
              View all history
            </span>
          </div>

          <ul className="space-y-4 max-h-50 styled-scrollbar overflow-y-scroll pe-2">
            {recentActivities.map((activity, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-lg bg-gray-200 p-4"
              >
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
                <span className="text-[19px] text-gray-700">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Announcements */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-200">
          <h3 className="mb-4 text-lg font-semibold">Announcement</h3>
          <div className="space-y-4 max-h-[200px] pe-2 styled-scrollbar overflow-y-scroll">
            {announcements.map((ann, index) => (
              <div
                key={index}
                className={`rounded-lg border-l-4 ${ann.color === "yellow" ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-gray-50"} p-4`}
              >
                <small className={`text-xs ${ann.color === "yellow" ? "text-yellow-700" : "text-gray-400"}`}>
                  {ann.date} • {ann.type}
                </small>
                <h4 className="mt-1 font-medium line-clamp-1">{ann.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{ann.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
