import React from "react";

interface WeekClasses {
  week1: string;
  week2: string;
  week3: string;
  week4: string;
}

interface ScheduleItem {
  date: string;
  classes: WeekClasses[];
}

const StudentCurriculum: React.FC = () => {
  const scheduleData: ScheduleItem[] = [
    {
      date: "Phase 1:",
      classes: [
        {
          week1: "Introduction To UI Design",
          week2: "Introduction To UX Design",
          week3: "Introduction To Prototyping",
          week4: "Introduction To UI Design",
        },
      ],
    },
    {
      date: "Phase 2:",
      classes: [
        {
          week1: "Introduction To UI Design",
          week2: "Introduction To UI Design",
          week3: "Introduction To UI Design",
          week4: "Introduction To UI Design",
        },
      ],
    },
    {
      date: "Phase 3:",
      classes: [
        {
          week1: "Introduction To UI Design",
          week2: "Introduction To UI Design",
          week3: "Introduction To UI Design",
          week4: "Introduction To UI Design",
        },
      ],
    },
    {
      date: "Phase 4:",
      classes: [
        {
          week1: "Introduction To UI Design",
          week2: "Introduction To UI Design",
          week3: "Introduction To UI Design",
          week4: "Introduction To UI Design",
        },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-semibold text-black">Curriculum</h2>

      <div>
        {scheduleData.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-5 bg-white shadow p-3 rounded">
              {phase.date}
            </h2>

            {phase.classes.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="bg-white p-4 rounded shadow grid grid-cols-1 mb-4"
              >
                <div className="flex flex-wrap items-center justify-center gap-10">
                  <div className="flex flex-col gap-1 bg-white shadow p-4">
                    <h2 className="text-black font-bold">Week 1:</h2>
                    <p className="text-sm text-black">{week.week1}</p>
                  </div>

                  <div className="flex flex-col gap-1 bg-white shadow p-4">
                    <h2 className="font-bold text-black">Week 2:</h2>
                    <p className="text-sm text-black">{week.week2}</p>
                  </div>

                  <div className="flex flex-col gap-1 bg-white shadow p-4">
                    <h2 className="font-bold text-black">Week 3:</h2>
                    <p className="text-sm text-black">{week.week3}</p>
                  </div>

                  <div className="flex flex-col gap-1 bg-white shadow p-4">
                    <h2 className="font-bold text-black">Week 4:</h2>
                    <p className="text-sm text-black">{week.week4}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCurriculum;
