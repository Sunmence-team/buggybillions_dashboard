import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateStudentForm from "../../components/forms/CreateStudentForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "upgrade" | null>(
    null
  );
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/all_students?page=${currentPage}`);
      setStudents(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || 0);
      // If the API returns 'current_page', we might sync it, but we manage it locally too
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please try again.");
      toast.error("Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [currentPage]);

  const handleCreate = async (data: any) => {
    try {
      await api.post("/api/create_users", {
        ...data,
        role: "student", // Assuming role is needed since it's a generic create_users endpoint
      });
      toast.success("Student created successfully!");
      setIsCreateModalOpen(false);
      fetchStudents(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating student:", err);
      toast.error(err.response?.data?.message || "Failed to create student.");
    }
  };

  const handleUpdate = (data: any) => {
    // Placeholder for Update API call
    console.log("Update Data:", data);
    // Optimistic update
    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...data } : s))
    );
    setModalType(null);
    setSelectedStudent(null);
    toast.success("Student updated successfully (Demo)");
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
      render: (item) => {
        if (!item.created_at) return "-";
        return new Date(item.created_at).toLocaleDateString();
      }
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
                  setModalType("edit"); // Reusing edit for "Upgrade"
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
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">Manage Students</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center justify-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> <span>Add Student</span>
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={students}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        tableType="Students"
      />

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