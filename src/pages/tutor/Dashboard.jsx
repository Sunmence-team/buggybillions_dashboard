import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full flex flex-row gap-4">
      <form
        action=""
        className="border w-[50%] border-gray-200 py-auto rounded-2xl shadow-2xl p-3  flex flex-col gap-4"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="day">Day</label>
          <select name="day" id="" className="rounded-md bg-pink-100 p-3">
            <option value="">Monday</option>
            <option value="">Tuesday</option>
            <option value="">Wednesday</option>
            <option value="">Thursday</option>
            <option value="">Friday</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="day">Time</label>
          <input type="time" className="rounded-md bg-pink-100 p-3" />
        </div>
      </form>
      <div className="w-[50%] border-gray-200 shadow-2xl p-3 rounded-2xl">
        <h1 className="text-center text-2xl my-3">Announcement (Tutor)</h1>
        <form action="" className="grid grid-cols-2 mt-5 gap-2">
          <div className="flex flex-col gap-3">
            <label htmlFor="heading">Heading</label>
            <input
              type="text"
              name="heading"
              className="rounded-md bg-pink-100 p-3"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="heading">Urgency</label>
            <select
              name=""
              id=""
              className="rounded-md text-gray-500 bg-pink-100 p-3"
            >
              <option value="">Compulsory</option>
              <option value="">Optional</option>
              <option value="">Mandatory</option>
            </select>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="heading">Sub-Heading</label>
            <input
              type="text"
              name="heading"
              className="rounded-md bg-pink-100 p-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
