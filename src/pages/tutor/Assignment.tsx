import { assests } from "../../assets/assest";

const Assignment = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-white rounded-md shadow">
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {[1, 2, 3, 4].map((item) => (
          <img
            key={item}
            src={assests.chat}
            alt="Assignment preview"
            className="w-full h-full object-cover rounded-md"
          />
        ))}
      </div>

      {/* Assignment Form */}
      <div className="w-full lg:w-80 bg-white p-4 shadow rounded-md flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-6 text-black text-center">
          Assignment
        </h2>

        <form className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm text-black">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter assignment title"
              className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
            />
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-1">
            <label htmlFor="file" className="text-sm text-black">
              File
            </label>
            <input
              id="file"
              type="file"
              className="p-2 rounded-lg bg-gray-300 text-black focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 px-4 py-3 bg-[#796FAB] text-white rounded-lg w-full hover:opacity-90 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Assignment;
