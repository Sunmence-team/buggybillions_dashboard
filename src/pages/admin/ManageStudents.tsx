import React, { useState } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateStudentForm from "../../components/forms/CreateStudentForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";

// Dummy Data
const INITIAL_STUDENTS = [
  {
    id: "1",
    bug_id: "BUG-001",
    password: "pass",
    stack: "frontend",
    department: "React",
    created_at: "2024-01-01",
  },
  {
    id: "2",
    bug_id: "BUG-002",
    password: "pass",
    stack: "backend",
    department: "Node.js",
    created_at: "2024-01-02",
  },
];

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>(INITIAL_STUDENTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "upgrade" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Pagination logic (dummy)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentData = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = (data: any) => {
    const newStudent = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString().split("T")[0],
    };
    setStudents([...students, newStudent]);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = (data: any) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...data } : s))
    );
    setModalType(null);
    setSelectedStudent(null);
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Bug ID",
      key: "bug_id",
    },
    {
      title: "Stack",
      key: "stack",
      render: (item) => <span className="uppercase">{item.stack}</span>,
    },
    {
      title: "Department",
      key: "department",
    },
    {
      title: "Created At",
      key: "created_at",
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <div className="relative">
          <button
            onClick={() => toggleActionMenu(item.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <BsThreeDotsVertical />
          </button>
          {openActionId === item.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50 text-left">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedStudent(item);
                  setModalType("view");
                  setOpenActionId(null);
                }}
              >
                View Student
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedStudent(item);
                  setModalType("edit");
                  setOpenActionId(null);
                }}
              >
                Edit Student Info
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedStudent(item);
                  setModalType("edit"); // Reusing edit for "Upgrade" as per instruction context, or could be separate if needed.
                  setOpenActionId(null);
                }}
              >
                Upgrade Stack/Dept
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Close action menu when clicking outside (simple handling via overlay if needed, or just let it be for now)
  // For better UX, we could add a global click listener, but for this task scope, let's keep it simple.

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">Manage Students</h1>
        {students.length > 0 && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Student
          </button>
        )}
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg text-gray-500 mb-4">No students yet.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Student
          </button>
        </div>
      ) : (
        <ReusableTable
          columns={columns}
          data={currentData}
          isLoading={false}
          error={null}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={students.length}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          tableType="Students"
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateStudentForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      )}

      {/* View/Edit/Upgrade Modal */}
      {modalType && selectedStudent && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStudent(null);
          }}
        >
          <CreateStudentForm
            initialData={selectedStudent}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedStudent(null);
            }}
            readOnly={modalType === "view"}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageStudents;
