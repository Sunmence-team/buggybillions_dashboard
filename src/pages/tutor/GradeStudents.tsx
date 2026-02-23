import React from 'react'
import api from '../../../helpers/api';
import { useUser } from '../../../context/UserContext';
import { toast } from 'sonner';

interface gradeStudent {
  user_id: string | number;
  assignment_name: string;
  assignment_description: string;
  status: string;
  created_at: string
  grade: number
}

export default function GradeStudent() {

  const [loading, setLoading] = React.useState(false)
  const [gradedData, setGradedata] = React.useState<gradeStudent[]>([])
  const {user} = useUser()

  const fetchGradedData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;
    setLoading(true)
    try {
      const response = await api.post(`/api/assignments/${user?.id}/grade`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200 || response.status === 201) {
        console.log(response.data)
        // setGradedata(response.data.assignment)
      }

    } catch (error: any) {
      const errMessage = error.response?.data?.message || error.message
      toast.error(errMessage)
    } finally {
      setLoading(false)
    }
  }

   React.useEffect(() => {
    if (user?.id) {
      fetchGradedData()
    }
  }, [user?.id])

   const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (  
    <>
      {loading ? (
        <p className="text-center mt-10">Loading Grades...</p>
      ) : gradedData.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          No Assignment Graded
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          {gradedData.map((grade) => (
            <div
              key={grade.user_id}
              className={`bg-white rounded-2xl border-l-4 p-5 shadow
    ${grade.status === 'graded'
                  ? 'border-purple'
                  : 'border-yellow-500'
                }
  `}
            >
              {/* HEADER */}
              <span>
                <p className='font-normal '>
                  Graded on:{" "}
                  <span className="font-medium">
                    {formatDate(grade.created_at)}
                  </span>
                </p>
              </span>
              <div className="flex justify-between items-start">

                <h3 className="font-bold text-[18px]">
                  {grade.assignment_name}
                </h3>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
            ${grade.status === "submitted"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                    }
          `}
                >
                  {grade.status}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 mt-2">
                {grade.assignment_description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500">

                {/* ACTION */}
                {grade.status === "grade" && (
                  <button className="px-3 py-2 bg-[#796FAB] text-white rounded-lg text-sm">
                    View feedback: {grade.grade}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )
      }


    </>
  )
}
