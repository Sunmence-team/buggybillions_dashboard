import React from 'react'

interface Props {
  assignments: any[];
  loading: boolean;
}

interface Grade {
  user_id: string | number;
  assignment_name: string;
  assignment_description: string;
  status: string;
  created_at: string
  grade: number
}

export default function Graded({assignments, loading}: Props) {

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
      ) : assignments.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-500">
          No Assignment under review
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
          {assignments.map((grade: Grade) => (
            <div
              key={grade.user_id}
              className={`bg-white rounded-2xl border-l-4 p-5 shadow
    ${grade.status === 'graded'
                  ? 'border-purple'
                  : ''
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

              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-500 mt-2">
                {grade.assignment_description}
              </p>

              {/* FOOTER */}
              <div className="flex justify-between items-center mt-6 text-sm text-gray-500">

                {/* ACTION */}
                {grade.status === "graded" && (
                  <button className=" bg- text-white rounded-lg text-sm">
                    <span
                      className={`px-3 py-2 font-medium rounded-lg
    ${grade.grade < 50 ? 'bg-red-100 text-red-700' : 'bg-[#796FAB] text-white'}`}
                    >
                      {/* {grade ?? "Not Graded"} */}
                    Grade: {grade.grade}%
                    </span>
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
