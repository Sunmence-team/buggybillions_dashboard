import { useState, useEffect } from "react";
import { useFormik } from "formik";
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

interface Course {
  id: string;
  title: string;
  stack?: { title: string };
}

interface StudentClass {
  id: number;
  name: string;
  course?: { title: string };
}

interface AssignmentData {
  id: number;
  student_class_id: number;
  user_id: number;
  weekly_lesson_id: number;
  course_id: string;
  assignment_name: string;
  assignment_description: string;
  file_path: string;
  status: string;
  grade: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; fullname: string };
  weekly_lesson: { id: number; day: string; topic: string };
  course: { id: string; title: string };
  student_class: { id: number; name: string };
}

const Assignment = () => {
  const { token, user } = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [weeklyLessons, setWeeklyLessons] = useState<WeeklyLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  useEffect(() => {
    if (token) {
      setLoadingCourses(true);
      api.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setCourses(res.data?.data || res.data || []);
        })
        .catch((err) => console.error("Failed to fetch courses", err))
        .finally(() => setLoadingCourses(false));
    }
  }, [token]);

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
          setStudentClasses(res.data?.data || res.data || []);
        })
        .catch((err) => console.error("Failed to fetch classes", err))
        .finally(() => setLoadingClasses(false));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setLoadingAssignments(true);
      api.get("/api/assignments", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          setAssignments(res.data?.assignments || []);
        })
        .catch((err) => console.error("Failed to fetch assignments", err))
        .finally(() => setLoadingAssignments(false));
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      assignment_name: "",
      assignment_description: "",
      weekly_lesson_id: "",
      course_id: "",
      student_class_id: "",
    },
    onSubmit: async (values) => {
      if (!token) return;
      try {
        await api.post("/api/tutor/assignments/class", {
          assignment_name: values.assignment_name,
          assignment_description: values.assignment_description,
          weekly_lesson_id: parseInt(values.weekly_lesson_id),
          course_id: values.course_id,
          student_class_id: parseInt(values.student_class_id),
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Assignment created successfully!");
        formik.resetForm();

        const updated = await api.get("/api/assignments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(updated.data?.assignments || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to create assignment");
      }
    },
  });

  const getCourseName = (courseId?: string) => {
    if (!courseId) return "-";
    const course = courses.find((c) => c.id === courseId);
    return course?.title || courseId;
  };

  const getLessonDisplay = (lesson: WeeklyLesson) => {
    const courseName = getCourseName(lesson.course_id);
    return `${lesson.day} - ${lesson.topic} (${courseName})`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "bg-yellow-100 text-yellow-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "graded": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-tetiary">Create Assignment</h1>
        <p className="text-gray-500 mt-1">Create and manage assignments for your students</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">New Assignment</h2>

        {loadingCourses && loadingLessons && loadingClasses ? (
          <FormSkeleton />
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Name</label>
                <input
                  type="text"
                  name="assignment_name"
                  value={formik.values.assignment_name}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                  placeholder="Enter assignment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  name="course_id"
                  value={formik.values.course_id}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} {course.stack && `(${course.stack.title})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="assignment_description"
                value={formik.values.assignment_description}
                onChange={formik.handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                placeholder="Enter assignment description"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Lesson</label>
                <select
                  name="weekly_lesson_id"
                  value={formik.values.weekly_lesson_id}
                  onChange={formik.handleChange}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Class</label>
                <select
                  name="student_class_id"
                  value={formik.values.student_class_id}
                  onChange={formik.handleChange}
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
            </div>

            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: formik.isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: formik.isSubmitting ? 1 : 0.98 }}
              className="w-full py-4 bg-purple text-white font-semibold rounded-xl shadow-lg shadow-purple/25 hover:shadow-purple/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Assignment"
              )}
            </motion.button>
          </form>
        )}
      </motion.div>

      <AnimatePresence>
        {assignments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              All Assignments ({assignments.length})
            </h2>

            {loadingAssignments ? (
              <TableSkeleton rows={5} cols={6} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#ECFFFC]">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Assignment</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {assignments.map((assignment, index) => (
                      <motion.tr
                        key={assignment.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-purple">{assignment.assignment_name}</div>
                          <div className="text-gray-500 text-xs max-w-xs truncate mt-1">{assignment.assignment_description}</div>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{assignment.course?.title || "-"}</td>
                        <td className="px-5 py-4 text-gray-500">
                          {assignment.weekly_lesson?.day} - {assignment.weekly_lesson?.topic}
                        </td>
                        <td className="px-5 py-4 text-gray-500">{assignment.student_class?.name || "-"}</td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {new Date(assignment.created_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assignment;
