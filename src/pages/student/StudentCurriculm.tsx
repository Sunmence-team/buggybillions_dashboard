import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../helpers/api";

// Types (optional but recommended)
interface Lesson {
  id: number;
  day: string;
  topic: string;
  introduction: string;
  resources: string | null;
}

interface LessonsByDate {
  [date: string]: Lesson[];
}

const StudentCurriculum = () => {
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [lessonsByDate, setLessonsByDate] = useState<LessonsByDate>({});

  const fetchCurriculum = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingCurriculum(true);

    try {
      const response = await api.get("/api/student/weekly-lessons", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        // API shape: data.lessons = { "2026-01-08": [ ... ] }
        const lessons = response.data?.data?.lessons || response.data?.lessons;
        setLessonsByDate(lessons || {});
      }
    } catch (error: any) {
      const errMessage = error.response?.data?.data || error.message;
      toast.error(errMessage);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const dates = Object.keys(lessonsByDate);

  return (
    <div>
      <h2 className="text-3xl font-semibold text-black">Curriculum</h2>

      {loadingCurriculum && (
        <p className="text-center text-gray-500 mt-6">Loading curriculum...</p>
      )}

      {!loadingCurriculum && dates.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No curriculum available</p>
      )}

      {/* Render grouped by date */}
      {!loadingCurriculum &&
        dates.map((date) => (
          <div key={date} className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {date}
            </h3>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Day
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Topic
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Introduction
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                      Resources
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lessonsByDate[date].map((lesson) => (
                    <tr key={lesson.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {lesson.day}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {lesson.topic}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-700">
                        {lesson.introduction}
                      </td>
                      <td className="px-4 py-2 text-sm text-blue-600">
                        {lesson.resources ? (
                          <a
                            href={lesson.resources}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
    </div>
  );
};

export default StudentCurriculum;