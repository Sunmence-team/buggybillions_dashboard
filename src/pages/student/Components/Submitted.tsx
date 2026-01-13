import React from 'react'
import api from '../../../helpers/api';
import { useUser } from '../../../context/UserContext';
import { toast } from 'sonner';

interface Sumbmitted {
  user_id: string | number;
  assignment_name: string;
  assignment_description: string;
  status: string;
  created_at: string
  grade?: any
}

export default function Submitted() {

  const [loading, setLoading] = React.useState(false)
  const [submittedData, setSubmittedData] = React.useState<Sumbmitted[]>([])
  const { user } = useUser()

  const fetchSubmittedData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return;
    setLoading(true)
    try {
      const response = await api.get(`/api/users/${user?.id}/assignments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200 || response.status === 201) {
        console.log(response.data)
        const submittedAssignments = response.data.assignments.filter(
          (assignment: Sumbmitted) => assignment.status === 'submitted'
        );
        setSubmittedData(submittedAssignments)
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
      fetchSubmittedData()
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
        <p className="text-center mt-10">Loading Submitted Assignment...</p>
      ) : submittedData.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          No Assignment Submitted
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          {submittedData.map((submit) => (
            <div
              key={submit.user_id}
              className={`bg-white rounded-2xl border-l-4 p-5 shadow
    ${submit.status === 'submitted'
                  ? 'border-green-500'
                  : ''
                }
  `}
            >
              {/* HEADER */}
              <span>
                <p className='font-normal '>
                  Submitted on:{" "}
                  <span className="font-medium">
                    {formatDate(submit.created_at)}
                  </span>
                </p>
              </span>
              <div className="flex justify-between items-start">

                <h3 className="font-bold text-[18px]">
                  {submit.assignment_name}
                </h3>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
            ${submit.status === "submitted"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple"
                    }
          `}
                >
                  {submit.status}
                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 mt-2">
                {submit.assignment_description}
              </p>


            </div>
          ))}
        </div>
      )
      }


    </>
  )
}
