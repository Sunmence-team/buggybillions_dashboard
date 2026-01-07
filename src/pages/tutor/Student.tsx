import { useState } from "react";
import { IoIosEye } from "react-icons/io";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Person {
  id: number;
  name: string;
  stack: string;
  department: string;
  profile: IconType;
}

const studentsData: Person[] = [
  {
    id: 25001,
    name: "Bamigbade Adeola Olabanji",
    stack: "Html",
    department: "Frontend",
    profile: FaUserCircle,
  },
  {
    id: 25002,
    name: "Ajibade Adebisi Olakuleyin",
    stack: "Bootstrap",
    department: "Backend",
    profile: FaUserCircle,
  },
  {
    id: 25003,
    name: "Tinuade Adekitan Olabamire",
    stack: "React",
    department: "Full Stack",
    profile: FaUserCircle,
  },
];

const tutorData: Person[] = [
  {
    id: 35001,
    name: "Summence Ajayi",
    stack: "React",
    department: "Frontend",
    profile: FaUserCircle,
  },
  {
    id: 35002,
    name: "Kolapo Balogun",
    stack: "Javascript",
    department: "Backend",
    profile: FaUserCircle,
  },
];

const Student = () => {
  const [students] = useState<Person[]>(studentsData);
  const [tutors] = useState<Person[]>(tutorData);

  const [showStudentForm, setShowStudentForm] = useState<boolean>(false);
  const [showTutorForm, setShowTutorForm] = useState<boolean>(false);

  const [selectedStudent, setSelectedStudent] = useState<Person | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Person | null>(null);

  return (
    <>
      {/* STUDENT FORM MODAL */}
      {showStudentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-[40%]">
            <button
              onClick={() => setShowStudentForm(false)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>
            <h2 className="text-lg font-semibold mb-4">Student Form</h2>
            <input className="w-full p-2 bg-gray-200 rounded mb-3" placeholder="Name" />
            <button className="bg-[#796FAB] w-full p-2 rounded text-white">
              Submit
            </button>
          </div>
        </div>
      )}

      {/* BUTTONS */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => setShowStudentForm(true)}
          className="bg-[#796FAB] text-white px-4 py-2 rounded"
        >
          Student Form
        </button>
        <button
          onClick={() => setShowTutorForm(true)}
          className="bg-[#796FAB] text-white px-4 py-2 rounded"
        >
          Tutor Form
        </button>
      </div>

      {/* STUDENT TABLE */}
      <div className="bg-white p-4 rounded-xl shadow mb-10">
        <h2 className="font-semibold mb-3">Students Information</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Stack</th>
              <th>Department</th>
              <th>ID</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.stack}</td>
                <td>{s.department}</td>
                <td>{s.id}</td>
                <td>
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="p-2 shadow rounded"
                  >
                    <IoIosEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* STUDENT DETAILS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <div className="flex justify-center mb-4">
              <selectedStudent.profile size={40} />
            </div>

            <p><b>Name:</b> {selectedStudent.name}</p>
            <p><b>Stack:</b> {selectedStudent.stack}</p>
            <p><b>Department:</b> {selectedStudent.department}</p>
            <p><b>ID:</b> {selectedStudent.id}</p>
          </div>
        </div>
      )}

      {/* TUTOR TABLE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Tutor Information</h2>
        <table className="w-full">
          <tbody>
            {tutors.map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.name}</td>
                <td>{t.stack}</td>
                <td>{t.department}</td>
                <td>
                  <button
                    onClick={() => setSelectedTutor(t)}
                    className="p-2 shadow rounded"
                  >
                    <IoIosEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TUTOR DETAILS MODAL */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 relative">
            <button
              onClick={() => setSelectedTutor(null)}
              className="absolute top-4 right-4"
            >
              <FaTimes />
            </button>

            <div className="flex justify-center mb-4">
              <selectedTutor.profile size={40} />
            </div>

            <p><b>Name:</b> {selectedTutor.name}</p>
            <p><b>Stack:</b> {selectedTutor.stack}</p>
            <p><b>Department:</b> {selectedTutor.department}</p>
            <p><b>ID:</b> {selectedTutor.id}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Student;
