<<<<<<< HEAD
import React, { useState } from "react";
import { FaTimes, FaUser } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoCheckmarkSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { VscCopilot } from "react-icons/vsc";

// Define a type for a student
interface Student {
  id: number;
  name: string;
  present: boolean;
}

const studentsData: Student[] = [
  { id: 25001, name: "Bamigbade Adeola Olabanji", present: true },
  { id: 25002, name: "Ajibade Adebisi Olakuleyin", present: false },
  { id: 25003, name: "Tinuade Adekitan Olabamire", present: true },
  { id: 25004, name: "Sijuade Adegoke Olasiku", present: false },
  { id: 25005, name: "Temilade Adegbemro Olalere", present: false },
  { id: 25006, name: "Jolaade Aderibigbe Olaonipekun", present: true },
  { id: 25007, name: "Omolade Adejare Oladayo", present: true },
  { id: 25008, name: "Gbolagade Adeoti Olasubomi", present: false },
  { id: 25009, name: "Tiwalade Adewunmi Oladele", present: true },
  { id: 25010, name: "Imade Adekunle Olaosebikan", present: false },
];

const Attendance: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [selected, setSelected] = useState<Student | null>(null);

  const allTotal = students.length;
  const present = students.filter((s) => s.present).length;
  const attendanceRate = Math.round((present / allTotal) * 100);

  const toggleAttendance = (id: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Attendance Summary Cards */}
      <div className="grid grid-cols-3 gap-5 bg-white shadow p-3 rounded-2xl">
        <div className="bg-[#E487BC] w-full h-35 rounded-md flex items-center justify-center">
          <div className="flex justify-center items-center gap-3">
            <HiUserGroup className="text-white text-[50px]" />
            <div className="flex flex-col">
              <h2 className="text-white text-[18px]">Total Student</h2>
              <h2 className="text-white text-[37px]">{allTotal}</h2>
            </div>
          </div>
        </div>

        <div className="bg-[#796FAB] w-full h-35 rounded-md flex items-center justify-center">
          <div className="flex justify-center items-center gap-3">
            <HiUserGroup className="text-white text-[50px]" />
            <div className="flex flex-col">
              <h2 className="text-white text-[18px]">Present</h2>
              <h2 className="text-white text-[37px]">{present}</h2>
            </div>
          </div>
        </div>

        <div className="bg-[#E5AA2D] w-full h-35 rounded-md flex items-center justify-center">
          <div className="flex justify-center items-center gap-3">
            <VscCopilot className="text-white text-[50px]" />
            <div className="flex flex-col">
              <h2 className="text-white text-[18px]">Absent</h2>
              <h2 className="text-white text-[37px]}">{allTotal - present}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-2">Students Information</h2>
          <table className="w-full text-justify">
            <thead>
              <tr className="bg-white shadow rounded">
                <th className="py-2 px-3">Profile</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className={`hover:bg-gray-300 ${
                    selected?.id === s.id ? "bg-gray-800" : ""
                  }`}
                >
                  <td>
                    <CgProfile className="w-8 h-8 rounded-full bg-red-400" />
                  </td>
                  <td className="py-2 px-3">{s.name}</td>
                  <td className="py-2 px-3">{s.id}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleAttendance(s.id)}
                        className={`p-1 rounded ${
                          s.present ? "bg-[#796FAB]" : "bg-gray-200"
                        }`}
                      >
                        <IoCheckmarkSharp className="w-4 h-4 cursor-pointer" />
                      </button>
                      <button
                        onClick={() => toggleAttendance(s.id)}
                        className={`p-1 rounded ${
                          !s.present ? "bg-red-500" : "bg-gray-200"
                        }`}
                      >
                        <FaTimes className="w-4 h-4 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance Rate & Profile */}
        <div className="flex flex-col justify-between">
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <h2 className="mb-4 font-semibold flex text-[#796FAB]">Attendance Rate:</h2>
            <div className="relative w-32 h-32">
              <span className="absolute inset-0 flex items-center justify-center font-bold text-[50px]">
                {attendanceRate}%
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow text-center">
            <div className="flex flex-col justify-center gap-1 items-center">
              <div className="rounded-sm bg-gray-300 p-2">b</div>
              <h2 className="font-semibold flex gap-1 items-center">
                OLAONIPEKUN, <p>Jolaade</p>
              </h2>
              <p>Aderibigbe</p>
            </div>
            <p>ID: 123456</p>
            <p>Email: jolaao@gmail.com</p>
            <p>Phone: +2349032615233</p>
            <p>Address: LAUTECH Area, Ogb.</p>
            <p>This Week: Present: 4 | Absent: 1</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-md p-2 w-full">
        <button className="w-full bg-[#E487BC] text-white py-3 rounded-md">
          Save Attendance
        </button>
=======
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { useUser } from "../../context/UserContext";
import api from "../../helpers/api";
import { toast } from "sonner";

/* ================= TYPES ================= */
type Lesson = {
  id: number;
  day: string;
  topic: string;
  introduction: string;
  resources: string | null;
};

type Student = {
  id: number;
  fullname: string;
  bug_id: string;
  username: string;
};

/* ================= COMPONENT ================= */
const Attendance: React.FC = () => {
  const { user, token } = useUser();
  const tutorId = user?.id;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<Record<number, number[]>>({}); // lessonId -> array of present student IDs
  
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingStudent, setSavingStudent] = useState<number | null>(null);

  /* ================= FETCH LESSONS ================= */
  const fetchLessons = async () => {
    if (!token || !tutorId) return;
    setLoadingLessons(true);

    try {
      const response = await api.get(`/api/tutors/${tutorId}/weekly-lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200 || response.status === 201) {
        const lessonsData = response.data.lessons;
        
        if (!lessonsData || typeof lessonsData !== 'object') {
          setLessons([]);
          return;
        }

        const flattenedLessons = Object.keys(lessonsData).flatMap(
          date => lessonsData[date]
        );

        const sortedLessons = flattenedLessons.sort((a, b) => {
          const dayA = parseInt(a.day) || 0;
          const dayB = parseInt(b.day) || 0;
          return dayA - dayB;
        });

        setLessons(sortedLessons);
      }
    } catch (error: any) {
      console.error("Failed to fetch lessons", error);
      toast.error("Failed to load lessons");
    } finally {
      setLoadingLessons(false);
    }
  };

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    if (!token || !tutorId) return;
    setLoadingStudents(true);

    try {
      const res = await api.get(`/api/tutors/${tutorId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStudents(res.data?.students || []);
    } catch (error: any) {
      console.error("Failed to fetch students", error);
      toast.error("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ================= FETCH ATTENDANCE FOR LESSON ================= */
  const fetchAttendanceForLesson = async (lessonId: number) => {
    try {
      const res = await api.get(`/api/attendance/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.attendance && Array.isArray(res.data.attendance)) {
        // Extract IDs of students who are present
        const presentStudentIds = res.data.attendance
          .filter((item: any) => item.status === "present")
          .map((item: any) => item.student.id);

        setAttendance(prev => ({
          ...prev,
          [lessonId]: presentStudentIds
        }));
      }
    } catch (error) {
      console.error("Failed to fetch attendance", error);
      // Don't show error toast, just initialize empty
      setAttendance(prev => ({
        ...prev,
        [lessonId]: []
      }));
    }
  };

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    if (tutorId && token) {
      fetchLessons();
      fetchStudents();
    }
  }, [tutorId, token]);

  /* ================= TOGGLE ACCORDION ================= */
  const toggleAccordion = (lessonId: number) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lessonId);
      if (!attendance[lessonId]) {
        fetchAttendanceForLesson(lessonId);
      }
    }
  };

  /* ================= TOGGLE STUDENT ATTENDANCE - SAVES IMMEDIATELY ================= */
  const toggleStudentAttendance = async (lessonId: number, studentId: number) => {
    setSavingStudent(studentId);
    
    try {
      // Call backend immediately - exactly as backend expects
      await api.post("/api/attendance/mark", {
        lesson_id: lessonId,
        student_id: studentId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state after successful save
      setAttendance(prev => {
        const currentPresent = prev[lessonId] || [];
        const isPresent = currentPresent.includes(studentId);
        
        const updatedPresent = isPresent
          ? currentPresent.filter(id => id !== studentId) // Remove if present
          : [...currentPresent, studentId]; // Add if absent
        
        return {
          ...prev,
          [lessonId]: updatedPresent
        };
      });

      toast.success("Attendance marked!");
    } catch (error: any) {
      console.error("Failed to mark attendance", error);
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSavingStudent(null);
    }
  };

  /* ================= CHECK IF STUDENT IS PRESENT ================= */
  const isStudentPresent = (lessonId: number, studentId: number): boolean => {
    const presentIds = attendance[lessonId] || [];
    return presentIds.includes(studentId);
  };

  /* ================= STATS FOR LESSON ================= */
  const getLessonStats = (lessonId: number) => {
    const presentCount = (attendance[lessonId] || []).length;
    const absentCount = students.length - presentCount;
    return { present: presentCount, absent: absentCount };
  };

  if (!tutorId) {
    return (
      <p className="text-center py-10 text-red-500">
        Tutor not authenticated
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple">Mark Attendance</h1>
        <p className="text-sm text-gray-500">
          Total Lessons: {lessons.length} | Total Students: {students.length}
        </p>
      </div>

      {/* ================= LOADING ================= */}
      {(loadingLessons || loadingStudents) && (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading data...</p>
        </div>
      )}

      {/* ================= NO DATA ================= */}
      {!loadingLessons && !loadingStudents && lessons.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No lessons found</p>
        </div>
      )}

      {/* ================= ACCORDION LESSONS ================= */}
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const isExpanded = expandedLesson === lesson.id;
          const stats = getLessonStats(lesson.id);

          return (
            <div
              key={lesson.id}
              className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* ACCORDION HEADER */}
              <button
                onClick={() => toggleAccordion(lesson.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className={`text-left ${isExpanded ? "w-3/4" : ""}`}>
                  <div className="flex flex-col-reverse items-start gap-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {lesson.topic}
                    </h3>
                    <div className="bg-purple text-white rounded-md flex items-center px-3 text-sm py-1 justify-center font-bold">
                    {lesson.day}
                  </div>
                  </div>
                  <p className="text-sm text-gray-500">{lesson.introduction}</p>
                </div>

                <div className="flex items-center gap-4">
                  {isExpanded && (
                    <div className="flex gap-3 text-sm">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        Present: {stats.present}
                      </span>
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        Absent: {stats.absent}
                      </span>
                    </div>
                  )}
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </button>

              {/* ACCORDION CONTENT */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50">
                  {students.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No students found</p>
                  ) : (
                    <div className="space-y-2">
                      {students.map((student) => {
                        const isPresent = isStudentPresent(lesson.id, student.id);
                        const isSaving = savingStudent === student.id;

                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple hover:shadow-sm transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <HiUserGroup className="text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{student.fullname}</p>
                                <p className="text-sm text-gray-500">{student.bug_id}</p>
                              </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isPresent}
                                onChange={() => toggleStudentAttendance(lesson.id, student.id)}
                                disabled={isSaving}
                                className="w-5 h-5 text-purple rounded focus:ring-purple disabled:opacity-50"
                              />
                              <span className={`text-sm font-medium ${isPresent ? "text-green-600" : "text-gray-400"}`}>
                                {isSaving ? "Saving..." : isPresent ? "Present" : "Absent"}
                              </span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
>>>>>>> f9a4756d867b88dbf400b50d1275195d8cae5a90
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Attendance;
=======
export default Attendance;
>>>>>>> f9a4756d867b88dbf400b50d1275195d8cae5a90
