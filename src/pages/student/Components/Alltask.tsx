import React from 'react';

interface Props{
  assignments: any[];
  loading: boolean;
}

export default function Alltask({assignments, loading}: Props) {
 

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
