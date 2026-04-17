import { useState, useEffect } from "react";
import api from "../../helpers/api";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";

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
      console.log(`Fetching lessons for tutor ID: ${user.id}`);
      api.get(`/api/tutors/${user.id}/weekly-lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          console.log("Weekly lessons response:", res.data);
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
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create lessons");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-tetiary">Weekly Lessons</h1>
        <p className="text-gray-500">Add and manage your weekly lesson curriculum</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create Weekly Lessons</h2>

        <div className="max-w-md mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">Select a course</option>
            {loadingCourses ? (
              <option value="">Loading courses...</option>
            ) : (
              courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title} {course.stack && `(${course.stack.title})`}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-purple mb-3">{lesson.day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Topic</label>
                  <input
                    type="text"
                    value={lesson.topic}
                    onChange={(e) => handleChange(index, "topic", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter topic"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Resources</label>
                  <input
                    type="text"
                    value={lesson.resources}
                    onChange={(e) => handleChange(index, "resources", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Resource link"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Introduction</label>
                  <textarea
                    value={lesson.introduction}
                    onChange={(e) => handleChange(index, "introduction", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter introduction"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 w-full bg-purple text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition"
        >
          Create Weekly Lessons
        </button>
      </div>

      {existingLessons.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Existing Lessons ({existingLessons.length})</h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#ECFFFC] rounded-xl">
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-l-xl">Day</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Topic</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Introduction</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap">Resources</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-black/60 whitespace-nowrap rounded-r-xl">Course</th>
                </tr>
              </thead>
              <tbody>
                {existingLessons.map((lesson, index) => (
                  <tr key={lesson.id || index} className="h-12 border-b border-black/10 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-purple font-semibold whitespace-nowrap">{lesson.day}</td>
                    <td className="px-4 py-3 text-sm text-black font-medium whitespace-nowrap">{lesson.topic}</td>
                    <td className="px-4 py-3 text-sm text-black/70 max-w-xs truncate">{lesson.introduction}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {lesson.resources ? (
                        <a href={lesson.resources} target="_blank" rel="noopener noreferrer" className="text-purple hover:underline font-medium">
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">{getCourseName(lesson.course_id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loadingLessons && <p className="text-center py-4 text-gray-500">Loading lessons...</p>}
        </div>
      )}
    </div>
  );
};

export default WeeklyLessons;
