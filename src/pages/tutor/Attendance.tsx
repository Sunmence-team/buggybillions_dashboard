import { useEffect, useState } from "react";
import api from "../../helpers/api";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

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
          console.log("Weekly lessons response:", res.data);
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
          console.log("Classes response:", res.data);
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
          console.log("Class details response:", res.data);
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
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tetiary">Mark Attendance</h1>
        <p className="text-gray-500">Mark student attendance for your class</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Class</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a class</option>
              {loadingClasses ? (
                <option value="">Loading classes...</option>
              ) : (
                studentClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} {cls.course && `(${cls.course.title})`}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson</label>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a lesson</option>
              {loadingLessons ? (
                <option value="">Loading lessons...</option>
              ) : (
                weeklyLessons.map((lesson, index) => (
                  <option key={lesson.id || index} value={lesson.id}>
                    {getLessonDisplay(lesson)}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {loadingStudents && (
          <p className="text-gray-500 text-center py-4">Loading students...</p>
        )}

        {!loadingStudents && students.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Absent Students ({absentStudents.length} selected)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {students.map((student) => (
                <label
                  key={student.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                    absentStudents.includes(student.id)
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={absentStudents.includes(student.id)}
                    onChange={() => toggleAbsent(student.id)}
                    className="w-4 h-4 accent-purple"
                  />
                  <span className="text-sm font-medium">{student.username || student.fullname}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {!loadingStudents && selectedClassId && students.length === 0 && (
          <p className="text-gray-500 text-center py-4">No students in this class</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-purple text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {submitting ? "Marking..." : "Mark Attendance"}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Attendance History</h2>
        
        {loadingHistory ? (
          <p className="text-gray-500 text-center py-4">Loading...</p>
        ) : !attendanceHistory?.attendance || attendanceHistory.attendance.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No attendance records yet</p>
        ) : (
          <div className="space-y-6">
            {attendanceHistory.attendance.map((day, dayIndex) => (
              <div key={dayIndex}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-purple">{day.date}</h3>
                  <div className="flex gap-3 text-sm">
                    <span className="text-green-600">Present: {day.total_present}</span>
                    <span className="text-red-600">Absent: {day.total_absent}</span>
                    <span className="text-gray-500">Total: {day.total_students}</span>
                  </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="bg-[#ECFFFC] rounded-xl">
                        <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-l-xl">Student</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Lesson</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Time In</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-r-xl">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.records.map((record, recordIndex) => (
                        <tr key={record.id || recordIndex} className="h-12 border-b border-black/10 hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <div className="font-medium">{record.student?.fullname || record.student?.username || "-"}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{record.student?.email || "-"}</td>
                          <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{getLessonName(record.lesson_id)}</td>
                          <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{record.time_in || "-"}</td>
                          <td className="px-4 py-3 text-sm whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
