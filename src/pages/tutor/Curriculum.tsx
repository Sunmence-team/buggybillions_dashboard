import { LuPlus } from "react-icons/lu";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";

/* ---------- TYPES ---------- */
interface ClassItem {
  from: string;
  to: string;
  course: string;
  teacher: string;
  lecture?: string;
  link?: string;
  showButtons?: boolean;
}

interface ScheduleDay {
  date: string;
  classes: ClassItem[];
}

/* ---------- COMPONENT ---------- */
const Curriculum: React.FC = () => {
  const [Btn, setOpen] = useState<boolean>(false);

  const scheduleData: ScheduleDay[] = [
    {
      date: "Monday September 01, 2025",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Career & Portfolio",
          teacher: "Kolapo Balogun",
        },
      ],
    },
    {
      date: "Monday September 02, 2025",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Career & Portfolio",
          teacher: "Kolapo Balogun",
        },
      ],
    },
    {
      date: "Monday September 03, 2025",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Career & Portfolio",
          teacher: "Kolapo Balogun",
        },
      ],
    },
    {
      date: "Monday September 04, 2025",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Career & Portfolio",
          teacher: "Kolapo Balogun",
        },
      ],
    },
    {
      date: "Monday September 05, 2025",
      classes: [
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Mobile App Development",
          teacher: "Summence Ajayi",
        },
        {
          from: "9:30 AM",
          to: "11:30 PM",
          course: "Career & Portfolio",
          teacher: "Kolapo Balogun",
        },
      ],
    },
  ];

  return (
    <>
      {/* MODAL */}
      {Btn && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-70 z-50">
          <div className="bg-secWhite text-black p-6 rounded-2xl w-[40%] h-65 relative">
            <h2 className="text-lg font-semibold mb-4">Say your mind 🤞</h2>

            <div
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 cursor-pointer"
            >
              <FaTimes />
            </div>

            <form className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="❤️"
                className="p-5 rounded-lg bg-gray-300 text-black focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#796FAB] w-full rounded-lg"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#796FAB]">Curriculum</h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#796FAB] text-white px-3 py-2 rounded-lg flex items-center gap-1"
        >
          <LuPlus /> Create appointment
        </button>
      </div>

      {/* SCHEDULE */}
      {scheduleData.map((day: ScheduleDay, index: number) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {day.date}
          </h2>

          {day.classes.map((me: ClassItem, ola: number) => (
            <div key={ola} className="bg-secWhite p-4 rounded shadow mb-4">
              <div className="flex justify-between">
                <div className="flex gap-[20rem]">
                  <div>
                    <h2 className="text-sm text-black">From</h2>
                    <p className="text-sm text-black">{me.from}</p>
                  </div>

                  <div>
                    <h2 className="text-sm text-black">To</h2>
                    <p className="text-sm text-black">{me.to}</p>
                  </div>

                  <div>
                    <h2 className="text-sm text-black">Course</h2>
                    <p className="text-sm text-black">{me.course}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default Curriculum;
