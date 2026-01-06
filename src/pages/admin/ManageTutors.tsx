import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateTutorForm from "../../components/forms/CreateTutorForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";

const ManageTutors: React.FC = () => {
  const [tutors, setTutors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "upgrade" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchTutors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/all_tutors?page=${currentPage}`);
      setTutors(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || 0);
    } catch (err: any) {
      console.error("Error fetching tutors:", err);
      setError("Failed to load tutors. Please try again.");
      toast.error("Failed to load tutors.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, [currentPage]);

  const handleCreate = async (data: any) => {
    try {
      await api.post("/api/create_users", {
        ...data,
        role: "tutor",
      });
      toast.success("Tutor created successfully!");
      setIsCreateModalOpen(false);
      fetchTutors();
    } catch (err: any) {
      console.error("Error creating tutor:", err);
      toast.error(err.response?.data?.message || "Failed to create tutor.");
    }
  };

  const handleUpdate = (data: any) => {
    // Placeholder for Update API call
    console.log("Update Data:", data);
    setTutors((prev) =>
      prev.map((t) => (t.id === selectedTutor.id ? { ...t, ...data } : t))
    );
    setModalType(null);
    setSelectedTutor(null);
    toast.success("Tutor updated successfully (Demo)");
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
                  setModalType("edit"); 
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
        <h1 className="text-2xl font-bold text-tetiary">Manage Tutors</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center justify-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> <span>Add Tutor</span>
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={tutors}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        tableType="Tutors"
      />

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