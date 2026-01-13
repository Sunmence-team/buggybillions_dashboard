import React from 'react';
import { toast } from "sonner";
import { useUser } from '../../../context/UserContext';
import api from '../../../helpers/api';

interface Assignment {
  id: string | number;
  assignment_name: string;
  assignment_description: string;
  status: string;
  created_at: string;
}

export default function Alltask() {

  const [loading, setLoading] = React.useState(false)
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const { user } = useUser()

  const fetchAssignment = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)

    try {
      const response = await api.get(`/api/users/${user?.id}/assignments`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200 || response.status === 201) {
        setAssignments(response.data.assignments)

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
      fetchAssignment()
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
        <p className="text-center mt-10">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          No Assignment found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`bg-white rounded-2xl border-l-4 p-5 shadow
    ${assignment.status === 'submitted'
                  ? 'border-green-500'
                  : 'border-purple'
                }
  `}
            >
              {/* HEADER */}
              <span>
                <p className='font-normal '>
                  Created on:{" "}
                  <span className="font-medium">
                    {formatDate(assignment.created_at)}
                  </span>
                </p>
              </span>
              <div className="flex justify-between items-start">

                <h3 className="font-bold text-[18px]">
                  {assignment.assignment_name}
                </h3>

                {/* STATUS */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
            ${assignment.status === "submitted"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple"
                    }
          `}
                >
                  {assignment.status}
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 mt-2">
                {assignment.assignment_description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500">

                {/* ACTION */}
                {/* {assignment.status !== "submitted" && (
                  <button className="px-3 py-2 bg-[#796FAB] text-white rounded-lg text-sm">
                    Submit
                  </button>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )
      }


    </>

  );
}
