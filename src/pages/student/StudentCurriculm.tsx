import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../helpers/api";
import { FaFolder } from "react-icons/fa";

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
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-black">Curriculum</h2>

      {loadingCurriculum ? (
        <p className="text-center text-gray-500 mt-6">Loading curriculum...</p>
      ) : dates.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No curriculum available</p>
      ) : (
        dates.map((date) => (
          <div key={date}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{date}</h3>

            <div className="space-y-4">
              {lessonsByDate[date].map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Day */}
                  <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                    DAY {lesson.day}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:flex md:items-start md:space-x-6">
                    {/* Topic */}
                    <div className="mb-4 md:mb-0 md:w-1/4">
                      <p className="text-blue-600 font-bold text-sm uppercase">Topic</p>
                      <h2 className="text-gray-900 font-semibold text-lg mt-1">
                        {lesson.topic}
                      </h2>
                    </div>

                    {/* Introduction */}
                    <div className="flex-1">
                      <p className="text-blue-600 font-bold text-sm uppercase">Introduction</p>
                      <p className="text-gray-700 mt-1">{lesson.introduction}</p>
                    </div>

                    {/* Resources */}
                    <div className="flex items-center mt-4 md:mt-0 space-x-2">
                      {lesson.resources ? (
                        <a
                          href={lesson.resources}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-200 transition"
                        >
                          <FaFolder className="mr-2" />
                          Resources
                        </a>
                      ) : (
                        <span className="text-gray-400">No resources</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentCurriculum;