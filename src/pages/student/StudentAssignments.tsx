import React from "react";
import { FaBell } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { MdEditCalendar } from "react-icons/md";
import Duesoon from "./Components/Duesoon";
import Alltask from "./Components/Alltask";
import Submitted from "./Components/Submitted";
import Modal from "../../components/modal/Modal";
import StudentAssignmentForm from "../../components/forms/StudentAssignmentForm";
import Graded from "./Components/Graded";
import { FaStar } from "react-icons/fa";
import { GrFormCheckmark } from "react-icons/gr";
import { CgSandClock } from "react-icons/cg";
import { MdArrowRightAlt } from "react-icons/md";

function StudentAssignments() {

  const [activeTab, setActiveTab] = React.useState('allTask')
  const [modal, setModal] = React.useState<boolean>(false)



  return (
    <div className="p-4">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 text-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[#E5AA2D] bg-gray-700 p-2 rounded-full">
              <CgSandClock />
            </span>
            <span className="text-xs bg-[#E5AA2D] px-2 py-1 rounded">
              High Priority
            </span>
          </div>
          <h2 className="text-3xl font-bold mt-4 text-white">2 Pending</h2>
          <p className="text-sm text-white">Assignments due this week</p>
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs ">Next due in 2 days</p>
            <MdArrowRightAlt color="#E5AA2D" />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="bg-[#796fab56] p-2 text-white rounded-2xl">
              <p className="bg-[#796FAB] rounded-full">
                <GrFormCheckmark />
              </p>
            </span>
            <p className="text-[#796FAB] bg-[#796fab56] p-1 rounded-full text-xs">
              85% complete
            </p>
          </div>
          <p className="text-black font-bold text-3xl mt-4">12 Submitted</p>
          <p className="text- text-black">Total Assignmebts this term</p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="bg-[#796fab56] p-2 text-[#796FAB] rounded-2xl">
              <FaStar />
            </span>
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Top 10%
            </span>
          </div>
          <h2 className="text-3xl font-bold  mt-4">94 / 100</h2>
          <p className="text-black">Average grade</p>
          <div className="flex items-center mt-2 gap-2">
            <h3 className="text-[15px]">RECENT:</h3>
            <p className="text-[#796FAB] text-xs">A+ on Wireframing</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center border justify-between mb-6">
        <div className="">
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <div className="flex gap-5 items-center justify-center mt-5">
            <p className="text-sm text-[#796FAB] py-2 px-3 bg-white shadow rounded-2xl">
              Semester 1{" "}
            </p>
            <div className="flex shadow-md rounded-2xl p-2 items-center justify-center gap-1">
              <MdEditCalendar color="#E5AA2D" size={25} />
              <p className="text-sm text-black">2 Assignments Pending</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <button
              onClick={() => setModal(true)}
              className="transition-all bg-purple text-white py-2 px-3 rounded-lg">
              Submit Assignment
            </button>

            {
              modal && (
                <Modal onClose={() => setModal(false)}>
                  <StudentAssignmentForm onClose={() => setModal(false)} />
                </Modal>
              )
            }
          </div>
          <div className="flexmflex-col md:flex-row">

          </div>
          <div className="relative none md:block">
            <IoIosSearch className="absolute left-3 top-2.5 h-4 w-4 text-black" />
            <input
              type="text"
              placeholder="Search assignments"
              className="pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            />
          </div>
          <button className="p-2 rounded-xl border bg-white">
            <FaBell className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 transition-all">
        <div className="flex gap-2 shadow bg-white md:p-2 w-auto rounded-full">
          <button
            className={`px-4 py-2 rounded-md text-black font-medium ${activeTab === 'allTask' ? 'text-purple' : ''}`}
            onClick={() => setActiveTab('allTask')}>
            All
          </button>
          <button
            className={`px-4 py-2 rounded-md text-black font-medium ${activeTab === 'dueSoon' ? 'text-purple' : ''}`}
            onClick={() => setActiveTab('dueSoon')}>
            Due Soon
          </button>
          <button
            className={`px-4 py-2 rounded-md text-black font-medium ${activeTab === 'submitted' ? 'text-purple' : ''}`}
            onClick={() => setActiveTab('submitted')}>
            Submitted
          </button>
          <button
            className={`px-4 py-2 rounded-md text-black font-medium ${activeTab === 'graded' ? 'text-purple' : ''}`}
            onClick={() => setActiveTab('graded')}>
            Graded
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-[13px]">STORY BY:</p>
          <select className="px-3 py-2 rounded-xl border text-sm">
            <option>Due Date (Closest)</option>
          </select>
        </div>
      </div>

      {activeTab === 'allTask' && (<Alltask />)}
      {activeTab === 'dueSoon' && (<Duesoon />)}
      {activeTab === 'submitted' && (<Submitted />)}
      {activeTab === 'graded' && (<Graded />)}

    </div>
  );
}

export default StudentAssignments;
