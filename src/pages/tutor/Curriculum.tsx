import React from "react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "../../helpers/api";
import { toast } from "sonner";
import { div, p } from "framer-motion/m";


const Curriculum = () => {
  const [loading, setLoading] = React.useState(false)
  const [getLesson, setGetLesson] = React.useState([])

  const navigate = useNavigate()

  const handleForm = () => {
    navigate('/tutor/curriculum/lessonForm')
  }

  const fetchLesson = async () => {
    const token = localStorage.getItem('token')
    if(!token) return
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
    } finally{
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Day</th>
              <th className="px-4 py-3 text-left font-semibold">Topic</th>
              <th className="px-4 py-3 text-left font-semibold">Introduction</th>
              <th className="px-4 py-3 text-left font-semibold">Resources</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Loading lessons...
                </td>
              </tr>
            ) : getLesson.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No lessons found. Create your first curriculum!
                </td>
              </tr>
            ) : (
              getLesson.map((lesson) => (
                <tr key={lesson.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{lesson.day}</td>
                  <td className="px-4 py-3">{lesson.topic}</td>
                  <td className="px-4 py-3">{lesson.introduction}</td>
                  <td className="px-4 py-3">
                    {lesson.resources ? (
                      lesson.resources.startsWith('http') ? (
                        <a
                          href={lesson.resources}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Resource
                        </a>
                      ) : (
                        <span>{lesson.resources}</span>
                      )
                    ) : (
                      <span className="text-gray-400">No resources</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


    </>
  );
};

export default Curriculum;