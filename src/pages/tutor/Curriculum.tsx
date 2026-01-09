import React from "react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "../../helpers/api";
import { toast } from "sonner";
import { FaFolder } from "react-icons/fa";

interface Lesson {
  id: number;
  day: string;
  topic: string;
  introduction: string;
  resources: string | null;
}


const Curriculum = () => {
  const [loading, setLoading] = React.useState(false)
  const [getLesson, setGetLesson] = React.useState<Lesson[]>([])

  const navigate = useNavigate()

  const handleForm = () => {
    navigate('/tutor/curriculum/lessonForm')
  }

  const fetchLesson = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    const tutorId = 8

    try {
      const response = await api.get(`/api/tutors/${tutorId}  /weekly-lessons`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);

        // Process the nested data structure
        const lessonsData = response.data.lessons;

        // Flatten all lessons from all dates into a single array
        const flattenedLessons = Object.keys(lessonsData).flatMap(
          date => lessonsData[date]
        );

        // Sort by day number (convert to number for proper sorting)
        const sortedLessons = flattenedLessons.sort((a, b) => {
          const dayA = parseInt(a.day) || 0;
          const dayB = parseInt(b.day) || 0;
          return dayA - dayB;
        });

        setGetLesson(sortedLessons);
      }
    } catch (error: any) {
      const errMessage = error.response?.data?.data || error.message;
      toast.error(errMessage)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchLesson()
  }, [])

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#796FAB]">Curriculum</h2>
        <button
          onClick={handleForm}
          className="bg-[#796FAB] hover:bg-[#6a5a9a] text-white px-5 py-3 rounded-lg flex items-center gap-2 transition shadow-md"
        >
          <LuPlus size={20} />
          Create Curriculum
        </button>
      </div>

      {/* <div>
        <div className="grid grid-cols-12 gap-4 bg-gray-100 p-4 font-semibold text-sm">
          <div className="col-span-2">Day</div>
          <div className="col-span-3">Topic</div>
          <div className="col-span-4">Introduction</div>
          <div className="col-span-3">Resources</div>
        </div>

        {
          getLesson.map((lesson, index) => (
            <div key={index}>
              <p>
                {lesson.day}
              </p>

            </div>

          ))
        }

      </div> */}

      <div className="space-y-4">
        {loading ? (
          <div className="px-4 py-8 text-center text-gray-500">
            Loading lessons...
          </div>
        ) : getLesson.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No lessons found. Create your first curriculum!
          </div>
        ) : (
          getLesson.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Day */}
              <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                {lesson.day}
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
                  <button className="text-gray-500 hover:text-gray-700">...</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>


    </>
  );
};

export default Curriculum;