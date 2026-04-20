import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../helpers/api";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import { Skeleton, TableSkeleton, FormSkeleton } from "../../components/ui/Skeleton";

interface ExistingLesson {
  id?: number;
  day?: string;
  topic?: string;
  introduction?: string;
  resources?: string;
  course_id?: string;
  course?: { title: string; stack?: { title: string } };
}

type LessonFormItem = { day: string; topic: string; introduction: string; resources: string };

const WeeklyLessons = () => {
  const { token, user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [existingLessons, setExistingLessons] = useState<ExistingLesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [lessons, setLessons] = useState<LessonFormItem[]>([
    { day: "Day 1", topic: "", introduction: "", resources: "" },
    { day: "Day 2", topic: "", introduction: "", resources: "" },
    { day: "Day 3", topic: "", introduction: "", resources: "" },
    { day: "Day 4", topic: "", introduction: "", resources: "" },
    { day: "Day 5", topic: "", introduction: "", resources: "" },
  ]);

  const getCourseName = (courseId?: string) => {
    if (!courseId) return "-";
    const course = courses.find((c: any) => c.id === courseId);
    return course?.title || courseId;
  };

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
          const flatLessons: ExistingLesson[] = [];
          Object.values(lessonsData).forEach((dateLessons: any) => {
            if (Array.isArray(dateLessons)) {
              flatLessons.push(...dateLessons);
            }
          });
          setExistingLessons(flatLessons);
        })
        .catch((err) => console.error("Failed to fetch lessons", err))
        .finally(() => setLoadingLessons(false));
    }
  }, [token, user?.id]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...lessons];
    const current = { ...updated[index] } as LessonFormItem;
    (current as Record<string, string>)[field] = value;
    updated[index] = current;
    setLessons(updated);
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/weekly-lessons", {
        course_id: selectedCourseId,
        lessons
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Weekly lessons created successfully!");
      
      const updated = await api.get(`/api/tutors/${user?.id}/weekly-lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const lessonsData = updated.data?.lessons || {};
      const flatLessons: ExistingLesson[] = [];
      Object.values(lessonsData).forEach((dateLessons: any) => {
        if (Array.isArray(dateLessons)) {
          flatLessons.push(...dateLessons);
        }
      });
      setExistingLessons(flatLessons);
      
      setLessons([
        { day: "Day 1", topic: "", introduction: "", resources: "" },
        { day: "Day 2", topic: "", introduction: "", resources: "" },
        { day: "Day 3", topic: "", introduction: "", resources: "" },
        { day: "Day 4", topic: "", introduction: "", resources: "" },
        { day: "Day 5", topic: "", introduction: "", resources: "" },
      ]);
      setSelectedCourseId("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create lessons");
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
        <h1 className="text-3xl font-bold text-tetiary">Weekly Lessons</h1>
        <p className="text-gray-500 mt-1">Create and manage your weekly curriculum</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Create Weekly Lessons</h2>

        {loadingCourses ? (
          <FormSkeleton />
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200 max-w-md"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.title} {course.stack && `(${course.stack.title})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border border-gray-200 rounded-xl p-6 bg-gray-50/50"
                >
                  <h3 className="font-semibold text-purple mb-4">{lesson.day}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Topic</label>
                      <input
                        type="text"
                        value={lesson.topic}
                        onChange={(e) => handleChange(index, "topic", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                        placeholder="Enter topic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Resources</label>
                      <input
                        type="text"
                        value={lesson.resources}
                        onChange={(e) => handleChange(index, "resources", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                        placeholder="Resource link"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-2">Introduction</label>
                      <textarea
                        value={lesson.introduction}
                        onChange={(e) => handleChange(index, "introduction", e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all duration-200"
                        placeholder="Enter introduction"
                        rows={2}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

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
                  Creating...
                </span>
              ) : (
                "Create Weekly Lessons"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {existingLessons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Existing Lessons ({existingLessons.length})
            </h2>

            {loadingLessons ? (
              <TableSkeleton rows={5} cols={5} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-[#ECFFFC]">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-l-xl">Day</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Topic</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Introduction</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Resources</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-r-xl">Course</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {existingLessons.map((lesson, index) => (
                      <motion.tr
                        key={lesson.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-purple whitespace-nowrap">{lesson.day}</td>
                        <td className="px-5 py-4 text-gray-900 font-medium whitespace-nowrap">{lesson.topic}</td>
                        <td className="px-5 py-4 text-gray-500 max-w-xs truncate">{lesson.introduction}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {lesson.resources ? (
                            <a
                              href={lesson.resources}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple hover:underline font-medium"
                            >
                              Link
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{getCourseName(lesson.course_id)}</td>
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

export default WeeklyLessons;
