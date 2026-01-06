import React from "react";

const TutorAnnouncement: React.FC = () => {
  return (
    <div className="w-full flex flex-row gap-4">
      {/* SCHEDULE FORM */}
      <form className="border w-[50%] border-gray-200 rounded-2xl shadow-2xl p-3 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="day">Day</label>
          <select
            name="day"
            id="day"
            className="rounded-md bg-pink-100 p-3"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            className="rounded-md bg-pink-100 p-3"
          />
        </div>
      </form>

      {/* ANNOUNCEMENT FORM */}
      <div className="w-[50%] border-gray-200 shadow-2xl p-3 rounded-2xl">
        <h1 className="text-center text-2xl my-3">
          Announcement (Tutor)
        </h1>

        <form className="grid grid-cols-2 mt-5 gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="heading">Heading</label>
            <input
              type="text"
              id="heading"
              name="heading"
              className="rounded-md bg-pink-100 p-3"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              className="rounded-md text-gray-500 bg-pink-100 p-3"
            >
              <option value="compulsory">Compulsory</option>
              <option value="optional">Optional</option>
              <option value="mandatory">Mandatory</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 col-span-2">
            <label htmlFor="subheading">Sub-Heading</label>
            <input
              type="text"
              id="subheading"
              name="subheading"
              className="rounded-md bg-pink-100 p-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorAnnouncement;
