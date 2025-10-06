import { LuPlus } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";


const Curriculum = ()=>{
  const [Btn, setOpen] = useState(false);
  const scheduleData = [
    {
      date: 'Monday September 01, 2025',
      classes: [
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Mobile App Development',
          teacher: 'Summence Ajayi',
        },
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Career & Portfolio',
          teacher: 'Kolapo Balogun',
        },
      ],
    },

     {
      date: 'Monday September 02, 2025',
      classes: [
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Mobile App Development',
          teacher: 'Summence Ajayi',
        },
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Career & Portfolio',
          teacher: 'Kolapo Balogun',
        },
      ],
    },

     {
      date: 'Monday September 03, 2025',
      classes: [
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Mobile App Development',
          teacher: 'Summence Ajayi',
        },
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Career & Portfolio',
          teacher: 'Kolapo Balogun',
        },
      ],
    },

     {
      date: 'Monday September 04, 2025',
      classes: [
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Mobile App Development',
          teacher: 'Summence Ajayi',
        },
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Career & Portfolio',
          teacher: 'Kolapo Balogun',
        },
      ],
    },

     {
      date: 'Monday September 05, 2025',
      classes: [
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Mobile App Development',
          teacher: 'Summence Ajayi',
        },
        {
          from: '9:30 AM',
          to: '11:30 PM',
          course: 'Career & Portfolio',
          teacher: 'Kolapo Balogun',
        },
      ],
    },
  ];
  
  return (
    <>
      <div>
        {Btn && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-70 z-50">
            <div className="bg-secWhite text-black p-6 rounded-2xl w-[40%] h-65">
              <h2 className="text-lg font-semibold mb-4">Say your mind 🤞</h2>

              <div
                type="button"
                onClick={() => setOpen(false)}
                className="flex justify-end relative bottom-10 cursor-pointer"
                >
                  <FaTimes />
              </div>
              <form className="flex flex-col gap-4">
                <input
                  type="text"
                  name="text"
                  placeholder="❤️"
                  className="p-5 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                

                <div className="flex justify-center gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#796FAB] w-[100%] rounded-lg"
                  >
                    Submite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

       
      <div>
          <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-semibold text-[#796FAB]">Curriculum</h2>
              <div class="">
                <button onClick={() => setOpen(true)} class="bg-[#796FAB] text-white px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer"><LuPlus/> Create appointment</button>
              </div>
          </div>
      </div>
     

      <div>
        <div>
          {scheduleData.map((day, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{day.date}</h2>

                {day.classes.map((me, ola) => (
                  <div key={ola} className="bg-secWhite p-4 rounded shadow mb-4">
                    <div>
                      <div className="flex justify-between">
                        
                        <div className="flex gap-[20rem]">
                          <div className="flex flex-col gap-1">
                            <h2 className="text-sm  text-black">From</h2>
                            <p className="text-sm  text-black">
                              {me.from}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h2 className="text-sm  text-black">To</h2>
                            <p className="text-sm  text-black">
                              {me.to}
                            </p>
                          </div>

                          

                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1">
                              <h2 className="text-sm  text-black">Course</h2>
                              <p className="text-sm  text-black">
                                {me.course}
                              </p>
                            </div>

                            {
                              me.lecture && me.link ? (
                                <>
                                <div className="flex flex-col gap-1">
                                  <h2 className="text-sm text-black">Lecture</h2>
                                  <p className="text-sm text-black">
                                    <p className="text-sm text-black">{me.lecture}</p>
                                  </p>
                                </div>

                                <div className="flex flex-row items-center">
                                    <div className="flex items-end gap-[18.10rem]">
                                      <div className="flex flex-col gap-1">
                                        <h2 className="text-sm text-black">Link</h2>
                                        <p className="text-sm text-black">
                                          <p className="text-sm text-black">{me.link}</p>
                                        </p>
                                      </div>

                                      

                                     <div className="flex flex-row">
                                         {me.showButtons && (
                                        <div className="flex gap-3">
                                          <button className="px-3 py-1 c border-red-500 border-1 text-red-800 text-xs rounded cursor-pointer">
                                            Cancel
                                          </button>
                                          <button className="px-3 py-1  border-[#796FAB] border-1 text-[#796FAB] text-sm rounded cursor-pointer">
                                            Reschedule
                                          </button>
                                          <button className="px-3 py-1 bg-[#796FAB] text-white text-sm rounded cursor-pointer">
                                            Join meeting
                                          </button>
                                        </div>
                                      )}
                                     </div>

                                    </div>
                                </div>   
                              </>
                              ):null
                            }


                           
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
  )
}

export default Curriculum