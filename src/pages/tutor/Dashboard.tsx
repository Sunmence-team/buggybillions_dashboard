import React, { useEffect, useState } from "react";
import OverviewCards from "../../components/cards/OverviewCards";
import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineChecklist } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import api from "../../helpers/api";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Link } from "react-router-dom";

dayjs.extend(relativeTime);

interface Submission {
  assignment_title: string;
  assignment_description: string;
  status: string;
  time: string;
}

interface TopStudent {
  student_id: number;
  fullname: string;
  stack: string;
  average_assignment: number;
  attendance: number;
  overall_grade: number;
}

const Dashboard: React.FC = () => {
  const { user, token } = useUser();
  const tutorId = user?.id;

  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const [topStudent, setTopStudent] = useState<TopStudent | null>(null);
  const [loadingTopStudent, setLoadingTopStudent] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const pendingGrading = submissions.filter(
    (s) => s.status !== "graded",
  ).length;

  // Filtered submissions based on search
  const filteredSubmissions = submissions.filter(
    (item) =>
      item.assignment_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignment_description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!tutorId || !token) {
        setFetchError("Not logged in as tutor");
        setLoadingStudents(false);
        setLoadingSubmissions(false);
        setLoadingTopStudent(false);
        return;
      }

      try {
        // 1. Total students
        const studentsRes = await api.get(`/api/tutors/${tutorId}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const totalStudents =
          studentsRes.data?.total_students ??
          studentsRes.data?.data?.total_students ??
          0;

        setStudentsCount(totalStudents);

        // 2. Recent submissions
        const assignmentsRes = await api.get(
          `/api/tutors/${tutorId}/assignments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const assignmentsArray =
          assignmentsRes.data?.data ||
          assignmentsRes.data?.assignments ||
          assignmentsRes.data ||
          [];

        const submissionsData: Submission[] = assignmentsArray
          .slice(0, 5)
          .map((item: any) => ({
            assignment_title: item.assignment_name || "Untitled",
            assignment_description:
              item.assignment_description || "No description",
            status: item.status || "submitted",
            time: item.created_at
              ? dayjs(item.created_at).fromNow()
              : "Recently",
          }));

        setSubmissions(submissionsData);

        // 3. Top student
        const topRes = await api.get(`/api/tutor/${tutorId}/top-student`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTopStudent(topRes.data?.top_student || null);
      } catch (err: any) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Could not fetch dashboard data";

        toast.error(message);
        setFetchError(message);
      } finally {
        setLoadingStudents(false);
        setLoadingSubmissions(false);
        setLoadingTopStudent(false);
      }
    };

    fetchData();
  }, [tutorId, token]);

  if (user?.role !== "tutor") {
    return (
      <div className="p-8 text-center text-red-600">
        <p className="text-lg font-medium">{fetchError}</p>
        <p className="mt-2 text-sm text-gray-600">
          Please make sure you're logged in as a tutor.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SEARCH + ADD CURRICULUM */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            className="w-full rounded-md border border-gray-200 shadow-sm bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          to="/tutor/curriculum" // Your route
          className="flex-shrink-0 rounded-md bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors text-center"
        >
          Add Curriculum
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCards
          icon={<HiOutlineUsers />}
          label="Total Students"
          value={loadingStudents ? "..." : studentsCount.toLocaleString()}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
        <OverviewCards
          icon={<MdOutlineChecklist />}
          label="Pending Grading"
          value={loadingSubmissions ? "..." : pendingGrading.toLocaleString()}
          iconBg="bg-gray-100"
          iconColor="text-gray-600"
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* RECENT SUBMISSIONS */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="mb-5 text-lg font-semibold text-gray-800">
            Recent Submissions
          </h3>

          <div className="max-h-72 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {filteredSubmissions.length === 0 ? (
              <p className="text-center py-10 text-gray-400">
                No submissions found
              </p>
            ) : (
              filteredSubmissions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-lg bg-gray-50 p-4 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">
                      {item.assignment_title}
                    </p>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        item.status === "graded"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.assignment_description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOP STUDENT */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="mb-5 text-lg font-semibold flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Top Student
          </h3>

          <div className="max-h-72 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {loadingTopStudent ? (
              <p className="text-center text-gray-400 py-10">Loading...</p>
            ) : !topStudent ? (
              <p className="text-center text-gray-400 py-10">
                No leaderboard data
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">{topStudent.fullname ?? "[No Name]"}</p>
                    <p className="text-xs text-purple-600 capitalize">
                      {topStudent.stack}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Overall</span>
                    <span>{topStudent.overall_grade}%</span>
                  </div>

                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${topStudent.overall_grade}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] mt-2 text-gray-400">
                    <span>Assignments: {topStudent.average_assignment}%</span>
                    <span>Attendance: {topStudent.attendance}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
