import { assests } from '../../assets/images/assest'

const Assignment = () => {
  return (
    <>
      <div className="flex gap-5 p-4 bg-white rounded-md shadow">

        <div className=" grid grid-cols-2 gap-4">
          <img
            src={assests.chat}
            className="w-full h-full object-cover rounded-md"
          />

           <img
            src={assests.chat}
            className="w-full h-full object-cover rounded-md"
          />

           <img
            src={assests.chat}
            className="w-full h-full object-cover rounded-md"
          />

          <img
            src={assests.chat}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="w-80  bg-white p-4 shadow rounded-md flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-8 text-black text-center">Assignment</h2>

          <form className="flex flex-col gap-4">
            <label>Title :</label>
            <input
              type="text"
              name="text"
              placeholder="Title"
              className="p-3 rounded-lg bg-gray-300 text-black"
            />

            <label htmlFor="">File :</label>
            <input
              type="file"
              name="file"
              placeholder="Password"
              className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
            />

            <div className="flex justify-center gap-3 mt-2">
              <button
                type="submit"
                className="px-4 py-3 bg-[#796FAB] text-black rounded-lg w-full cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}

export default Assignment