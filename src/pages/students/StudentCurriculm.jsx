const StudentCurriculum = () => {
  const scheduleData = [
    {
      date: "Phase 1: ",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
      ],
    },
    {
      date: "Phase 2: ",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
      ],
    },
    {
      date: "Phase 3: ",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
      ],
    },
    {
      date: "Phase 4: ",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
      ],
    },
    {
      date: "Phase 5: ",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
      ],
    },
  ];

  return (
    <>
      <div>
        <h2 class="text-3xl font-semibold text-black">Curriculum</h2>

        <div>
          {scheduleData.map((day, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-lg w-25 font-semibold text-gray-800 mt-10 mb-5 bg-[#FFFFFF] shadow p-3 rounded">
                {day.date}
              </h2>

              {day.classes.map((me, ola) => (
                <div key={ola} className="bg-White p-4 rounded shadow mb-4">
                  <div>
                    <div className="flex justify-between">
                      <div className="flex gap-[20rem]">
                        <div className="flex flex-col gap-1">
                          <h2 className="text-sm  text-black">From</h2>
                          <p className="text-sm  text-black">{me.from}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <h2 className="text-sm  text-black">To</h2>
                          <p className="text-sm  text-black">{me.to}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-sm  text-black">Course</h2>
                            <p className="text-sm  text-black">{me.course}</p>
                          </div>

                          {me.lecture && me.link ? (
                            <>
                              <div className="flex flex-col gap-1">
                                <h2 className="text-sm text-black">Lecture</h2>
                                <p className="text-sm text-black">
                                  <p className="text-sm text-black">
                                    {me.lecture}
                                  </p>
                                </p>
                              </div>

                              <div className="flex flex-row items-center">
                                <div className="flex items-end gap-[18.10rem]">
                                  <div className="flex flex-col gap-1">
                                    <h2 className="text-sm text-black">Link</h2>
                                    <p className="text-sm text-black">
                                      <p className="text-sm text-black">
                                        {me.link}
                                      </p>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentCurriculum;
