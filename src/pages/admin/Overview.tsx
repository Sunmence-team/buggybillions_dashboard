import React, { useEffect, useState } from "react";
import OverviewCards from "../../components/cards/OverviewCards";
import { HiOutlineIdentification } from "react-icons/hi";
import { FaTrophy } from "react-icons/fa";
import { formatterUtility } from "../../helpers/formatterUtility";
import api from "../../helpers/api";

/* ================= TYPES ================= */
interface LeaderboardUser {
  student_id: number;
  fullname: string | null;
  stack: string | null;
  average_assignment: number;
  attendance: number;
  overall_grade: number;
}

/* ================= COMPONENT ================= */
const AdminOverview: React.FC = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTutors, setTotalTutors] = useState(0);
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRes = await api.get("/api/all_students");
        const students = studentsRes.data.students || studentsRes.data || [];
        setTotalStudents(students.length);
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    };

    const fetchTutors = async () => {
      try {
        const tutorsRes = await api.get("/api/all_tutors");
        const tutors = tutorsRes.data.tutors || tutorsRes.data || [];
        setTotalTutors(tutors.length);
      } catch (error) {
        console.error("Failed to fetch tutors", error);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const leaderboardRes = await api.get("/api/leaderboard");
        const leaderboard = leaderboardRes.data.leaderboard || [];
        const sorted = [...leaderboard].sort(
          (a: LeaderboardUser, b: LeaderboardUser) =>
            b.overall_grade - a.overall_grade
        );
        setLeaders(sorted);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      }
    };

    const fetchAll = async () => {
      await Promise.all([fetchStudents(), fetchTutors(), fetchLeaderboard()]);
      setLoading(false);
    };

    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      {/* ================= OVERVIEW CARDS ================= */}
      <div className="grid grid-cols-2 gap-6">
        <OverviewCards
          icon={<HiOutlineIdentification size="30px" />}
          label="Total Students"
          value={formatterUtility(loading ? 0 : totalStudents)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />

        <OverviewCards
          icon={<HiOutlineIdentification size="30px" />}
          label="Total Tutors"
          value={formatterUtility(loading ? 0 : totalTutors)}
          iconBg="bg-gray-100"
          iconColor="text-gray-500"
        />
      </div>

      {/* ================= LEADERBOARD ================= */}
      <div className="bg-white rounded-3xl shadow p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            Students Leaderboard
          </h2>
          <span className="text-sm text-gray-400">Overall Performance</span>
        </div>

        {/* SCROLLABLE LEADERBOARD */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {leaders.map((user, index) => {
            const displayName =
              user.fullname && user.fullname.trim() !== ""
                ? user.fullname
                : `Student ${user.student_id}`;

            return (
              <div
                key={user.student_id}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : index === 2
                        ? "bg-orange-400"
                        : "bg-purple-500"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-medium capitalize">{displayName}</p>

                    <p className="text-xs text-purple-600 font-medium capitalize">
                      {user.stack || "—"}
                    </p>

                    <p className="text-xs text-gray-500">
                      Attendance: {user.attendance}%
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="w-[45%]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Overall</span>
                    <span>{user.overall_grade}%</span>
                  </div>

                  <div className="bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${user.overall_grade}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] mt-1 text-gray-400">
                    <span>Assignments: {user.average_assignment}%</span>
                    <span>Attendance: {user.attendance}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <p className="text-center py-6 text-gray-400">Loading leaderboard...</p>
          )}

          {!leaders.length && !loading && (
            <p className="text-center py-6 text-gray-400">
              No leaderboard data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
