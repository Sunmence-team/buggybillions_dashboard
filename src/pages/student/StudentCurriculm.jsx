const StudentCurriculum = () => {
  const scheduleData = [
    {
      date: "Phase 1: ",
      classes: [
        {
          week1: "Introduction To Ui Desing",
          week2: "Introduction To Ux Desing",
          week3: "Introduction To Proto",
          week4: "Introduction To Ui Desing",
        },
      ],
    },
    {
      date: "Phase 2: ",
      classes: [
        {
          week1: "Introduction To Ui Desing",
          week2: "Introduction To Ui Desing",
          week3: "Introduction To Ui Desing",
          week4: "Introduction To Ui Desing",
        },
      ],
    },
    {
      date: "Phase 3: ",
      classes: [
        {
          week1: "Introduction To Ui Desing",
          week2: "Introduction To Ui Desing",
          week3: "Introduction To Ui Desing",
          week4: "Introduction To Ui Desing",
        },
      ],
    },
    {    
      date: "Phase4: ",
      classes: [
        {
          week1: "Introduction To Ui Desing",
          week2: "Introduction To Ui Desing",
          week3: "Introduction To Ui Desing",
          week4: "Introduction To Ui Desing",
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
                <div
                  key={ola}
                  className="bg-White p-4 rounded shadow grid grid-cols-1 mb-4"
                >
                  <div>
                    <div className="flex items-center justify-center gap-10">
                      <div className="flex flex-col gap-1 bg-white shadow p-4">
                        <h2 className="text-black font-bold">week 1:</h2>
                        <p className="text-sm  text-black">{me.week1} </p>
                      </div>

                      <div className="flex flex-col gap-1 bg-white shadow p-4">
                        <h2 className="font-bold  text-black">week 2:</h2>
                        <p className="text-sm text-black">{me.week2}</p>
                      </div>
  kl; 
                      <div className="flex flex-col gap-1 bg-white shadow p-4">
                        <h2 className="font-bold  text-black">week 3:</h2>
                        <p className="text-sm  text-black">{me.week3}</p>
                      </div>

                      <div className="flex flex-col gap-1 bg-white shadow p-4">
                        <h2 className="font-bold  text-black">week 4:</h2>
                        <p className="text-sm  text-black">{me.week4}</p>
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
