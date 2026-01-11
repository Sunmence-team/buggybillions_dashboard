import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoCheckmarkSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import api from "../../helpers/api";

/* ================= TYPES ================= */
type Student = {
  id: number;
  name: string;
  present: boolean;
};

/* ============== TEMP DATA (fallback) ============== */
const studentsData: Student[] = [
  { id: 25001, name: "Bamigbade Adeola Olabanji", present: true },
  { id: 25002, name: "Ajibade Adebisi Olakuleyin", present: false },
  { id: 25003, name: "Tinuade Adekitan Olabamire", present: true },
  { id: 25004, name: "Sijuade Adegoke Olasiku", present: false },
  { id: 25005, name: "Temilade Adegbemro Olalere", present: false },
];

const Attendance: React.FC = () => {
  /* ================= STATE ================= */
  const [lessonId] = useState<number>(1); // replace with real lesson id
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ================= STATS ================= */
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.present).length;
  const absentCount = totalStudents - presentCount;

  /* ================= FETCH ATTENDANCE ================= */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/attendance/lesson/${lessonId}`);

      if (Array.isArray(res.data) && res.data.length > 0) {
        const mapped: Student[] = res.data.map((item: any) => ({
          id: item.student_id,
          name: item.name,
          present: Boolean(item.present),
        }));

        setStudents(mapped);
      } else {
        setStudents(studentsData);
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      setStudents(studentsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  /* ================= TOGGLE ATTENDANCE ================= */
  const toggleAttendance = (id: number, value: boolean) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, present: value } : student
      )
    );

    if (selectedStudent?.id === id) {
      setSelectedStudent({ ...selectedStudent, present: value });
    }
  };

  /* ================= SAVE ATTENDANCE ================= */
  const saveAttendance = async () => {
    try {
      setSaving(true);

      await api.post("/attendance/mark", {
        lesson_id: lessonId,
        attendance: students.map((s) => ({
          student_id: s.id,
          present: s.present,
        })),
      });

      alert("Attendance marked successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-white shadow p-3 rounded-2xl">
        <SummaryCard title="Total Students" value={totalStudents} color="#E487BC" />
        <SummaryCard title="Present" value={presentCount} color="#796FAB" />
        <SummaryCard title="Absent" value={absentCount} color="#E5AA2D" />
      </div>

      {/* ================= TABLE + SELECTED ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TABLE */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow overflow-x-auto">
          <h2 className="font-semibold text-lg mb-3">
            Students Information
          </h2>

          {loading ? (
            <p className="text-center py-6">Loading attendance...</p>
          ) : (
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Profile</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="border-b cursor-pointer hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">
                      <CgProfile className="w-8 h-8" />
                    </td>

                    <td className="py-3 px-4">{student.name}</td>

                    <td className="py-3 px-4">{student.id}</td>

                    <td className="py-3 px-4">
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAttendance(student.id, true);
                          }}
                          className={`p-1 rounded ${
                            student.present
                              ? "bg-[#796FAB] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <IoCheckmarkSharp />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAttendance(student.id, false);
                          }}
                          className={`p-1 rounded ${
                            !student.present
                              ? "bg-red-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* SELECTED STUDENT */}
        <div className="bg-white p-6 rounded-2xl shadow self-start">
          <h3 className="font-semibold mb-4 text-[#796FAB]">
            Selected Student
          </h3>

          {selectedStudent ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CgProfile className="w-20 h-20 text-gray-400" />
              <h4 className="font-semibold">{selectedStudent.name}</h4>
              <p className="text-sm text-gray-500">
                ID: {selectedStudent.id}
              </p>
              <span
                className={`px-4 py-1 rounded-full text-sm ${
                  selectedStudent.present
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedStudent.present ? "Present" : "Absent"}
              </span>
            </div>
          ) : (
            <p className="text-center text-gray-400">
              Click a student to view details
            </p>
          )}
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        onClick={saveAttendance}
        disabled={saving}
        className={`w-full py-3 rounded-md font-semibold text-white ${
          saving ? "bg-gray-400" : "bg-[#E487BC] hover:opacity-90"
        }`}
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
};

/* ================= SUMMARY CARD ================= */
const SummaryCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    className="rounded-md flex items-center justify-center py-6"
    style={{ backgroundColor: color }}
  >
    <div className="flex gap-3 items-center text-white">
      <HiUserGroup className="text-[50px]" />
      <div>
        <p>{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
    </div>
  </div>
);

export default Attendance;
