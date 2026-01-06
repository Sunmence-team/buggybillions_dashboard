import React, { useState } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateTutorForm from "../../components/forms/CreateTutorForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";

// Dummy Data
const INITIAL_TUTORS = [
  {
    id: "1",
    fullname: "John Doe",
    username: "johndoe",
    mobile: "1234567890",
    bug_id: "TUT-001",
    password: "pass",
    stack: "frontend",
    department: "React",
    created_at: "2024-01-01",
  },
  {
    id: "2",
    fullname: "Jane Smith",
    username: "janesmith",
    mobile: "0987654321",
    bug_id: "TUT-002",
    password: "pass",
    stack: "backend",
    department: "Node.js",
    created_at: "2024-01-02",
  },
];

const ManageTutors: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>(INITIAL_TUTORS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "upgrade" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Pagination logic (dummy)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(tutors.length / itemsPerPage);
  const currentData = tutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = (data: any) => {
    const newTutor = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString().split("T")[0],
    };
    setTutors([...tutors, newTutor]);
    setIsCreateModalOpen(false);
  };

  const handleUpdate = (data: any) => {
    setTutors((prev) =>
      prev.map((t) => (t.id === selectedTutor.id ? { ...t, ...data } : t))
    );
    setModalType(null);
    setSelectedTutor(null);
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Full Name",
      key: "fullname",
    },
    {
      title: "Username",
      key: "username",
    },
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
                  setSelectedTutor(item);
                  setModalType("view");
                  setOpenActionId(null);
                }}
              >
                View Tutor
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedTutor(item);
                  setModalType("edit");
                  setOpenActionId(null);
                }}
              >
                Edit Tutor Info
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedTutor(item);
                  setModalType("edit"); // Reuse edit for upgrade as per pattern
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">Manage Tutors</h1>
        {tutors.length > 0 && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Tutor
          </button>
        )}
      </div>

      {tutors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="text-lg text-gray-500 mb-4">No tutors yet.</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Add Tutor
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
          totalItems={tutors.length}
          itemsPerPage={itemsPerPage}
          setCurrentPage={setCurrentPage}
          tableType="Tutors"
        />
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateTutorForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      )}

      {/* View/Edit/Upgrade Modal */}
      {modalType && selectedTutor && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedTutor(null);
          }}
        >
          <CreateTutorForm
            initialData={selectedTutor}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedTutor(null);
            }}
            readOnly={modalType === "view"}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageTutors;
