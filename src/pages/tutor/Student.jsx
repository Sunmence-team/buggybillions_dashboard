import { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const studentsData = [
  {id: 25001, name: "Bamigbade Adeola Olabanji",stack:"Html", department:"Frontend", profile:FaUserCircle },
  {id: 25002, name: "Ajibade Adebisi Olakuleyin",stack:"Bootstrap", department:"Backend", profile:FaUserCircle},
  {id: 25003, name: "Tinuade Adekitan Olabamire", stack:"React", department:"Full Stack", profile:FaUserCircle},
  {id: 25004, name: "Sijuade Adegoke Olasiku", stack:"Css", department:"Frontend", profile:FaUserCircle},
  {id: 25005, name: "Temilade Adegbemro Olalere", stack:"Javascript", department:"Ui/Ux Deding", profile:FaUserCircle},
  {id: 25006, name: "Jolaade Aderibigbe Olaonipekun", stack:"Html", department:"Full Stack", profile:FaUserCircle},
  {id: 25007, name: "Omolade Adejare Oladayo", stack:"Html", department:"Ui/Ux Deding", profile:FaUserCircle},
  {id: 25008, name: "Gbolagade Adeoti Olasubomi", stack:"React", department:"Frontend", profile:FaUserCircle},
  {id: 25009, name: "Tiwalade Adewunmi Oladele", stack:"Javascript", department:"Backend", profile:FaUserCircle},
  {id: 25010, name: "Imade Adekunle Olaosebikan", stack:"Css", department:"FulL Stack", profile:FaUserCircle},
];

const tutorData = [
  {id: 25001, name: "Bamigbade Adeola Olabanji",stack:"Html", department:"Frontend", profile:FaUserCircle},
  {id: 25002, name: "Ajibade Adebisi Olakuleyin",stack:"Bootstrap", department:"Backend", profile:FaUserCircle},
  {id: 25003, name: "Tinuade Adekitan Olabamire", stack:"React", department:"Full Stack", profile:FaUserCircle},
  {id: 25004, name: "Sijuade Adegoke Olasiku", stack:"Css", department:"Frontend", profile:FaUserCircle},
  {id: 25005, name: "Temilade Adegbemro Olalere", stack:"Javascript", department:"Ui/Ux Deding", profile:FaUserCircle},
];

const Student = () => {
  const [students] = useState(studentsData);
  const [tutor] = useState(tutorData);
  const [selected] = useState(null);
  const [Btn, setOpen] = useState(false);
  const [Btns, setsOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
    
    
  return (
    <>
      <div>
        {Btn && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-70 z-50">
            <div className="bg-secWhite text-black p-6 rounded-2xl w-[40%] h-65">
              <h2 className="text-lg font-semibold mb-2">Say your mind 🤞</h2>
        
              <div
                type="button"
                onClick={() => setOpen(false)}
                className="flex justify-end relative bottom-9 cursor-pointer"
                >
                  <FaTimes />
              </div>
              <form className="flex flex-col gap-3">
                <input
                  type="text"
                  name='text'
                  placeholder="Bug Id"
                  className="p-2 rounded-lg bg-gray-300 text-black focus:outline-none"
                />

                <input
                  type="password"
                  name='password'
                  placeholder="Password"
                  className="p-2 rounded-lg bg-gray-300 text-black focus:outline-none"
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
        {Btns && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-70 z-50">
            <div className="bg-secWhite text-black p-6 rounded-2xl w-[50%] h-110">
              <h2 className="text-lg font-semibold mb-2">Say your mind 🤞</h2>
              <div
                type="button"
                onClick={() => setsOpen(false)}
                className="flex justify-end relative bottom-9 cursor-pointer"
                >
                <FaTimes />
              </div>
              <form>
                <input
                type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:outline-non"
                />

                <input
                type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:ring focus:outline-non"
                />

                <select
                  name="Stack"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:outline-non"
                  >
                  <option value="">Select Stack</option>
                  <option value="frontend">HTML</option>
                  <option value="backend">CSS</option>
                  <option value="FullStack">BOOTSTRAP</option>
                  <option value="design">JAVASCRIPT</option>
                  <option value="design">REACT</option>
                </select>

                <input
                type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:outline-non"
                />

                <input
                type="text"
                  name="bugid"
                  placeholder="Bug ID"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:outline-non"
                />

                <select
                  name="department"
                  className="w-full p-2 rounded-lg bg-gray-300 mb-3 focus:outline-non"
                  >
                  <option value="">Select Department</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="FullStack">Full Stack</option>
                  <option value="design">UI/UX Design</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#796FAB] w-[100%] rounded-lg"
                  >
                  Submit
                </button>
              </form>
                      
            </div>
          </div>
        )}
      </div>
      
      <div>
        <div class="ml-[49.30rem] items-center mb-6">
          <div class="flex gap-4">
            <button onClick={() => setOpen(true)} class="bg-[#796FAB] text-white px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">Student Form</button>
            <button onClick={() => setsOpen(true)} class="bg-[#796FAB] text-white px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">Tutor Form</button>
          </div>
        </div>
      </div>

      <div>
        <div className="w-full bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-lg mb-2">Students Information</h2>
          <table className="w-full text-justify">
            <thead className="bg-white shadow rounded-md">
                     <tr>
                       <th className="py-2 px-3">S/N</th>
                       <th className='py-2 px-3'>Name</th>
                       <th className='py-2 px-3'>Stack</th>
                       <th className='py-2 px-3'>Department</th>
                       <th className='py-2 px-3'>ID</th>
                       <th className='py-2 px-3'>View More</th>
                     </tr>
            </thead>
            <tbody>
              {students.map((alade,index) => (
                <tr>
                  <td>
                    <div className="ml-3">{index + 1}.</div>
                  </td>
                    <td className="py-2 px-3">{alade.name}</td>
                    <td className="py-2 px-3">{alade.stack}</td>
                    <td className="py-2 px-3">{alade.department}</td>
                    <td className="py-2 px-3">{alade.id}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedStudent(alade)}  className="bg-white shadow p-2 rounded-md cursor-pointer">
                          <IoIosEye />  
                        </button>
                      </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {selectedStudent && (
            <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-md w-100 relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-5 right-5 text-black cursor-pointer "
                >
                  <FaTimes />
                </button>
                <div className="flex items-center justify-center">
                  <h2 className="text-xl font-semibold mt-6 rounded bg-gray-300 p-2"><span> {<selectedStudent.profile size={30}/>} </span></h2>
                </div>
                
              <div className="space-y-2 mt-2">
                <p><span className="font-semibold">Name:</span> {selectedStudent.name}</p>
                <p><span className="font-semibold">Stack:</span> {selectedStudent.stack}</p>
                <p><span className="font-semibold">Department:</span> {selectedStudent.department}</p>
                <p><span className="font-semibold">ID:</span> {selectedStudent.id}</p>
              </div>
                <div className="flex flex-col gap-2 mt-3">
                  <button className="bg-green-500 p-2 rounded-md cursor-pointer">
                    Upgrade
                  </button>
                  <button className="bg-red-500 p-2 rounded-md cursor-pointer">
                    cancle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> 

      <div>
        <div className="w-full bg-white p-4 rounded-2xl shadow mt-15">
          <h2 className="font-semibold text-lg mb-2">Tutor Information</h2>
          <table className="w-full text-justify">
            <thead className="bg-white shadow rounded-md">
              <tr>
                <th className="py-2 px-3">S/N</th>
                <th className='py-2 px-3'>Name</th>
                <th className='py-2 px-3'>Stack</th>
                <th className='py-2 px-3'>Department</th>
                <th className='py-2 px-3'>ID</th>
                <th className='py-2 px-3'>View More</th>
              </tr>
            </thead>
            <tbody>
              {tutor.map((dev,index) => (
                <tr>
                  <td>
                    <div className="ml-3">{index + 1}.</div>
                  </td>
                  <td className="py-2 px-3">{dev.name}</td>
                  <td className="py-2 px-3">{dev.stack}</td>
                  <td className="py-2 px-3">{dev.department}</td>
                  <td className="py-2 px-3">{dev.id}</td>
                  <td className="py-2 px-3">
                    <div className="flex gap-2">
                        <button onClick={() => setSelectedTutor(dev)} className="bg-white shadow p-2 rounded-md cursor-pointer">
                          <IoIosEye />  
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
        <div>
          {selectedTutor && (
            <div className="fixed inset-0 bg-black/80 bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-md w-96 relative curse-pointer">
                <button
                  onClick={() => setSelectedTutor(null)}
                  className="absolute top-5 right-5 text-black"
                >
                  <FaTimes />
                </button>
                <div className="flex items-center justify-center">
                    <h2 className="font-semibold mt-6 rounded bg-gray-300 p-2"><span> {<selectedTutor.profile size={30}/>} </span></h2>
                  </div>
                <div className="space-y-2 mt-2">
                  <p><span className="font-semibold">Name:</span> {selectedTutor.name}</p>
                  <p><span className="font-semibold">Stack:</span> {selectedTutor.stack}</p>
                  <p><span className="font-semibold">Department:</span> {selectedTutor.department}</p>
                  <p><span className="font-semibold">ID:</span> {selectedTutor.id}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div> 
    </>
  )
}

export default Student