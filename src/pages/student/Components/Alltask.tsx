import React from 'react';
import { assignments } from './data';

export default function Alltask() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
        {assignments.map((assignment) => {
          const StatusIcon = assignment.statusIcon;
          const DateIcon = assignment.dateIcon;
          const ButtonIcon = assignment.buttonIcon;

          return (
            <div
              key={assignment.id}
              className={`bg-white rounded-2xl border-l-4 ${assignment.borderColor} p-5 shadow`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-black">
                      {assignment.week} :
                    </p>
                    <p className="text-[#796FAB]">
                      {assignment.category}
                    </p>
                  </div>
                  <h3 className="font-bold text-[20px]">
                    {assignment.title}
                  </h3>
                </div>

                {/* STATUS */}
                <div
                  className={`flex items-center gap-1 ${assignment.statusBgColor} ${assignment.statusTextColor} px-2 py-1 rounded-full`}
                >
                  <span className={assignment.statusIconBg}>
                    <StatusIcon size={14} />
                  </span>
                  <span className="text-xs font-medium">
                    {assignment.statusLabel}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {assignment.description}
              </p>

              <div className="flex justify-between items-center mt-10">
                {/* DATE */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500">
                  <DateIcon size={16} />
                  <p className="text-[12px]">
                    {assignment.dueDate}
                  </p>
                </div>

                {/* BUTTON */}
                <button
                  className={`flex items-center gap-1 px-3 py-2 ${assignment.buttonBgColor} ${assignment.buttonTextColor} rounded-xl text-sm`}
                >
                  {ButtonIcon && <ButtonIcon size={14} />}
                  {assignment.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
