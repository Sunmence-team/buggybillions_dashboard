import React from "react";

const Timetable = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const times = [
    "8am - 10am",
    "10am - 12pm",
    "12pm - 2pm",
    "2pm - 4pm",
    "4pm - 6pm",
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white p-6 shadow-md border border-gray-200 ">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Weekly Timetable
      </h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">
              Day / Time
            </th>

            {times.map((time) => (
              <th
                key={time}
                className="border px-4 py-3 text-center text-sm font-medium text-gray-600 whitespace-nowrap"
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day} className="hover:bg-gray-50">
              <td className="border px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                {day}
              </td>

              {times.map((time) => (
                <td
                  key={time}
                  className="border px-4 py-3 text-center text-sm text-gray-400"
                >
                  —
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timetable;
