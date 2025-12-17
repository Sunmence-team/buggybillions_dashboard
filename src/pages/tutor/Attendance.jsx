import React from 'react'
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoCheckmarkSharp } from "react-icons/io5";
import { HiUserGroup } from "react-icons/hi2";
import { VscCopilot } from "react-icons/vsc";
import { FaUser } from "react-icons/fa";

const studentsData = [
  { id: 25001, name: "Bamigbade Adeola Olabanji", present: true },
  { id: 25002, name: "Ajibade Adebisi Olakuleyin", present: false },
  { id: 25003, name: "Tinuade Adekitan Olabamire", present: true },
  { id: 25004, name: "Sijuade Adegoke Olasiku", present: false },
  { id: 25005, name: "Temilade Adegbemro Olalere", present: false },
  { id: 25006, name: "Jolaade Aderibigbe Olaonipekun", present: true },
  { id: 25007, name: "Omolade Adejare Oladayo", present: true },
  { id: 25008, name: "Gbolagade Adeoti Olasubomi", present: false },
  { id: 25009, name: "Tiwalade Adewunmi Oladele", present: true },
  { id: 25010, name: "Imade Adekunle Olaosebikan", present: false },
];

const Attendance = () => {
  const [students, setStudents] = useState(studentsData);
  const [selected, setSelected] = useState(null);

  const allTotal = students.length;
  const present = students.filter((alade) => alade.present).length;
  const attendanceRate = Math.round((present / allTotal) * 100);

  const allAttendance = (id)  => {
    setStudents((prev) =>
      prev.map((alade) => (alade.id === id ? { ...alade, present: !alade.present } : alade))
    );
  };

  return (
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-3 gap-5 bg-white shadow p-3  rounded-2xl">
        <div className='bg-[#E487BC] w-full h-35 rounded-md flex items-center justify-center'>
          <div className='flex justify-center items-center gap-3'>
            <div>
              <HiUserGroup className='text-white text-[50px]' />  
            </div>
            
            <div className="flex flex-col">
              <h2 className='text-white text-[18px]'>Total Student</h2>
              <h2 className='text-white text-[37px]'>24</h2>
            </div>
          </div>
            
        </div>

        <div className='bg-[#796FAB] w-full h-35 rounded-md flex items-center justify-center'>
          <div className='flex justify-center items-center gap-3'>
            <div>
              <HiUserGroup className='text-white text-[50px]' />  
            </div>
            
            <div className="flex flex-col">
              <h2 className='text-white text-[18px]'>Total Student</h2>
              <h2 className='text-white text-[37px]'>20</h2>
            </div>
          </div>
            
        </div>

        <div className='bg-[#E5AA2D] w-full h-35 rounded-md flex items-center justify-center'>
          <div className='flex justify-center items-center gap-3'>
            <div>
              <VscCopilot  className='text-white text-[50px]' />  
            </div>
            
            <div className="flex flex-col">
              <h2 className='text-white text-[18px]'>Total Student</h2>
              <h2 className='text-white text-[37px]'>04</h2>
            </div>
          </div>
            
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-2">Students Information</h2>
          <table className="w-full text-justify">
            <thead>
              <tr className='bg-white shadow rounded'>
                <th className="py-2 px-3">Profile</th>
                <th className='py-2 px-3'>Name</th>
                <th className='py-2 px-3'>ID</th>
                <th className='py-2 px-3'>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((alade) => (
                <tr
                  key={alade.id}
                  className={`hover:bg-gray-300 ${
                    selected?.id === alade.id ? "bg-gray-800" : ""
                  }`}
                >
                  <td className="">
                    <CgProfile className="w-8 h-8 rounded-full bg-red-400"/> 
                  </td>
                  <td className="py-2 px-3">{alade.name}</td>
                  <td className="py-2 px-3">{alade.id}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          allAttendance(alade.id);
                        }}
                        className={`p-1 rounded ${
                          alade.present ? "bg-[#796FAB]" : "bg-gray-200"
                        }`}
                      >
                        <IoCheckmarkSharp className="w-4 h-4 cursor-pointer" />
                      </button>
                      <button
                        onClick={(e) => {
                          allAttendance(alade.id);
                        }}
                        className={`p-1 rounded ${
                          !alade.present ? "bg-red-500" : "bg-gray-200"
                        }`}
                      >
                        <FaTimes className="w-4 h-4 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col justify-between">
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col items-center">
            <h2 className="mb-4 font-semibold flex text-[#796FAB]">Attendance Rate:</h2>
            <div className="relative w-32 h-32">
              <span className="absolute inset-0 text-[50px] flex items-center justify-center font-bold text-lg">
                {attendanceRate}%
              </span>
            </div>
          </div>

          
          <div className="bg-white p-4 rounded-2xl shadow">
            <div className='flex flex-col justify-center gap-1 items-center'>
               <div className="rounded-sm  bg-gray-300 p-2">
                 <FaUser size={25}/>
               </div>
              <h2 className="font-semibold  flex gap-1 items-center">OLAONIPEKUN, <p>Jolaade</p> </h2>
              <p>Aderibigbe</p>
            </div>
            
            <p>ID: 123456</p>
            <p>Email: jolaao@gmail.com</p>
            <p>Phone: +2349032615233</p>
            <p>Address: LAUTECH Area, Ogb.</p>
            <p>
              This Week: Present: 4 | Absent: 1
            </p>
          </div>
        </div>
      </div>  

      <div className='bg-white shadow rounded-md p-2 w-full'>
          <button className="w-full bg-[#E487BC] text-white py-3 rounded-md">
            Save Attendance
          </button>
      </div>
    </div>
  );
}


export default Attendance