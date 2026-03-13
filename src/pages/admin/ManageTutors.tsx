import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";
import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateTutorForm from "../../components/forms/CreateTutorForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";

const ManageTutors: React.FC = () => {
  const { token } = useUser();
  const [tutors, setTutors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any | null>(null);
  const [modalType, setModalType] = useState<
    "view" | "edit" | "upgrade" | "delete" | null
  >(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchTutors = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/all_tutors?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTutors(response.data.tutors || []);
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
  }, [token, currentPage]);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/tutors", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Tutor created successfully!");
      setIsCreateModalOpen(false);
      fetchTutors();
    } catch (err: any) {
      console.error("Error creating tutor:", err);
      toast.error(err.response?.data?.message || "Failed to create tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Placeholder for Update API call
      console.log("Update Data:", data);
      setTutors((prev) =>
        prev.map((t) => (t.id === selectedTutor.id ? { ...t, ...data } : t)),
      );
      toast.success("Tutor updated successfully (Demo)");
      setModalType(null);
      setSelectedTutor(null);
    } catch (err: any) {
      console.error("Error updating tutor:", err);
      toast.error("Failed to update tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (data: any) => {
    setIsDeleting(true);
    try {
      const response = await api.delete(`/api/users/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setTutors((prev) => prev.filter((t) => t.id !== data.id));

        toast.success("Tutor deleted successfully.");
        setModalType(null);
        setSelectedTutor(null);
      }
    } catch (err: any) {
      console.error("Error deleting tutor:", err);
      toast.error("Failed to delete tutor.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Full Name",
      key: "fullname",
      render: (item) => <span className="capitalize">{item.fullname}</span>,
    },
    {
      title: "Username",
      key: "username",
    },
    {
      title: "Bug ID",
      key: "bug_id",
      render: (item) => <span className="uppercase">{item.bug_id}</span>,
    },
    {
      title: "Stack",
      key: "stack",
      render: (item) => <span className="capitalize">{item.stack}</span>,
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
      },
    },
    {
  title: "Action",
  key: "action",
  render: (item) => {
    const { refs, floatingStyles } = useFloating({
      placement: "bottom-end",
      middleware: [offset(4), flip(), shift()],
      whileElementsMounted: autoUpdate,
    });
    return (
      <div className="relative">
        <button
          ref={refs.setReference}
          onClick={() => toggleActionMenu(item.id)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <BsThreeDotsVertical />
        </button>
        {openActionId === item.id && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 9999, minWidth: "180px" }}
              className="bg-white shadow-lg rounded-md border border-gray-200 text-left"
            >
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
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedTutor(item);
                  setModalType("delete"); // Reusing edit for "Upgrade"
                  setOpenActionId(null);
                }}
              >
                Delete user
              </button>
            </div>
          </FloatingPortal>
        )}
      </div>
    );
  },
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
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateTutorForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* View/Edit/Upgrade Modal */}
      {(modalType === "edit" || modalType === "view") && selectedTutor && (
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
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={modalType === "delete" && selectedTutor !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete student "${selectedTutor?.fullname || selectedTutor?.bug_id}"? This action cannot be undone.`}
        onConfirm={() => handleDelete(selectedTutor)}
        onCancel={() => {
          setModalType(null);
          setSelectedTutor(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageTutors;
