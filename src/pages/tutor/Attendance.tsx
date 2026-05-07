import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../helpers/api.tsx";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import { Skeleton, TableSkeleton, FormSkeleton } from "../../components/ui/Skeleton";

interface WeeklyLesson {
  id?: number;
  day?: string;
  topic?: string;
  course_id?: string;
  course?: { title: string; stack?: { title: string } };
}

interface StudentClass {
  id: number;
  name: string;
  course?: { title: string };
}

interface Student {
  id: number;
  fullname: string;
  username: string;
  email: string;
}

interface AttendanceRecord {
  id: number;
  user_id: number;
  lesson_id: number;
  date: string;
  time_in: string | null;
  status: string;
  created_at: string;
  student: {
    id: number;
    fullname: string;
    username: string;
    email: string;
  };
}

interface AttendanceDay {
  date: string;
  total_students: number;
  total_present: number;
  total_absent: number;
  records: AttendanceRecord[];
}

interface AttendanceHistory {
  tutor_id: number;
  attendance: AttendanceDay[];
}

const Attendance = () => {
  const { token, user } = useUser();
  const [weeklyLessons, setWeeklyLessons] = useState<WeeklyLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const [absentStudents, setAbsentStudents] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (token && user?.id) {
      setLoadingLessons(true);
      api.get(`/api/tutors/${user.id}/weekly-lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          const lessonsData = res.data?.lessons || {};
          const flatLessons: WeeklyLesson[] = [];
          Object.values(lessonsData).forEach((dateLessons: any) => {
            if (Array.isArray(dateLessons)) {
              flatLessons.push(...dateLessons);
            }
          });
          setWeeklyLessons(flatLessons);
        })
        .catch((err) => console.error("Failed to fetch lessons", err))
        .finally(() => setLoadingLessons(false));
    }
  }, [token, user?.id]);

  useEffect(() => {
    if (token) {
      setLoadingClasses(true);
      api.get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setStudentClasses(res.data || []);
        })
        .catch((err) => console.error("Failed to fetch classes", err))
        .finally(() => setLoadingClasses(false));
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedClassId) {
      setLoadingStudents(true);
      setStudents([]);
      setAbsentStudents([]);
      api.get(`/api/classes/${selectedClassId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setStudents(res.data?.students || []);
        })
        .catch((err) => console.error("Failed to fetch students", err))
        .finally(() => setLoadingStudents(false));
    }
  }, [token, selectedClassId]);

  useEffect(() => {
    if (token) {
      fetchAttendanceHistory();
    }
  }, [token]);

  const fetchAttendanceHistory = async () => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await api.get("/api/yourstudent_attendance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttendanceHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getCourseName = (courseId?: string) => {
    if (!courseId) return "-";
    return courseId;
  };

  const getLessonDisplay = (lesson: WeeklyLesson) => {
    const courseName = getCourseName(lesson.course_id);
    return `${lesson.day} - ${lesson.topic}`;
  };

  const getLessonName = (lessonId: number) => {
    const lesson = weeklyLessons.find(l => l.id === lessonId);
    return lesson ? getLessonDisplay(lesson) : `Lesson ${lessonId}`;
  };

  const getClassName = (classId: number) => {
    const cls = studentClasses.find(c => c.id === classId);
    return cls?.name || `Class ${classId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-700";
      case "absent": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const toggleAbsent = (studentId: number) => {
    setAbsentStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!selectedLessonId) {
      toast.error("Please select a lesson");
      return;
    }
    if (!selectedClassId) {
      toast.error("Please select a class");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/api/attendance/mark-class", {
        lesson_id: parseInt(selectedLessonId),
        student_class_id: parseInt(selectedClassId),
        absent_students: absentStudents,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Attendance marked successfully!");
      setAbsentStudents([]);
      setSelectedLessonId("");
      setSelectedClassId("");
      setStudents([]);
      fetchAttendanceHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-tetiary">Mark Attendance</h1>
        <p className="text-gray-500 mt-1">Track and manage student attendance records</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Mark New Attendance</h2>

          {loadingClasses && loadingLessons ? (
            <FormSkeleton />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a class</option>
                    {studentClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} {cls.course && `(${cls.course.title})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson</label>
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a lesson</option>
                    {weeklyLessons.map((lesson, index) => (
                      <option key={lesson.id || index} value={lesson.id}>
                        {getLessonDisplay(lesson)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <AnimatePresence>
                {loadingStudents && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Skeleton className="h-4 w-48" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-14 rounded-xl" />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!loadingStudents && students.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Absent Students ({absentStudents.length} selected)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {students.map((student) => (
                      <motion.label
                        key={student.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          absentStudents.includes(student.id)
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={absentStudents.includes(student.id)}
                          onChange={() => toggleAbsent(student.id)}
                          className="w-5 h-5 rounded border-gray-300 text-purple focus:ring-purple"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {student.username || student.fullname}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}

              {!loadingStudents && selectedClassId && students.length === 0 && (
                <p className="text-gray-500 text-center py-8">No students in this class</p>
              )}

              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full py-4 bg-purple text-white font-semibold rounded-xl shadow-lg shadow-purple/25 hover:shadow-purple/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Marking...
                  </span>
                ) : (
                  "Mark Attendance"
                )}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendance History</h2>

        {loadingHistory ? (
          <TableSkeleton rows={3} cols={5} />
        ) : !attendanceHistory?.attendance || attendanceHistory.attendance.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No attendance records yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {attendanceHistory.attendance.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: dayIndex * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-purple text-lg">{day.date}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Present: {day.total_present}
                    </span>
                    <span className="text-red-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Absent: {day.total_absent}
                    </span>
                    <span className="text-gray-500">
                      Total: {day.total_students}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#ECFFFC]">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Student</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time In</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {day.records.map((record, recordIndex) => (
                        <motion.tr
                          key={record.id || recordIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: recordIndex * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <span className="font-medium text-gray-900">
                              {record.student?.fullname || record.student?.username || "-"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500">{record.student?.email || "-"}</td>
                          <td className="px-5 py-4 text-gray-500">{getLessonName(record.lesson_id)}</td>
                          <td className="px-5 py-4 text-gray-500">{record.time_in || "-"}</td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Attendance;
