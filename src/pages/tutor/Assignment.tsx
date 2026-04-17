import { useState, useEffect } from "react";
import { useFormik } from "formik";
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
          console.log("Courses response:", res.data);
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
          console.log("Assignments response:", res.data);
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
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tetiary">Create Assignment</h1>
        <p className="text-gray-500">Create a new assignment for your class</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Name</label>
          <input
            type="text"
            name="assignment_name"
            value={formik.values.assignment_name}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter assignment name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="assignment_description"
            value={formik.values.assignment_description}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter assignment description"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            name="course_id"
            value={formik.values.course_id}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select a course</option>
            {loadingCourses ? (
              <option value="">Loading courses...</option>
            ) : (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.stack && `(${course.stack.title})`}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Lesson</label>
          <select
            name="weekly_lesson_id"
            value={formik.values.weekly_lesson_id}
            onChange={formik.handleChange}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Class</label>
          <select
            name="student_class_id"
            value={formik.values.student_class_id}
            onChange={formik.handleChange}
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

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-purple text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {formik.isSubmitting ? "Creating..." : "Create Assignment"}
        </button>
      </form>

      {assignments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">All Assignments ({assignments.length})</h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-[#ECFFFC] rounded-xl">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-l-xl">Assignment</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Course</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Lesson</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-r-xl">Created</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment, index) => (
                  <tr key={assignment.id || index} className="h-12 border-b border-black/10 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <div className="font-semibold text-purple">{assignment.assignment_name}</div>
                      <div className="text-gray-500 text-xs max-w-xs truncate">{assignment.assignment_description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{assignment.course?.title || "-"}</td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">
                      {assignment.weekly_lesson?.day} - {assignment.weekly_lesson?.topic}
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{assignment.student_class?.name || "-"}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black/50 whitespace-nowrap">
                      {new Date(assignment.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loadingAssignments && <p className="text-center py-4 text-gray-500">Loading assignments...</p>}
        </div>
      )}
    </div>
  );
};

export default Assignment;
