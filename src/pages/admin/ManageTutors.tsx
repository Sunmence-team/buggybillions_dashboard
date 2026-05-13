import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateTutorForm from "../../components/forms/CreateTutorForm";
import ViewTutor from "../../components/ViewTutor";
import type { TableColumnProps } from "../../lib/interfaces";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api.tsx";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import ActionCell from "../../utility/ActionCell";


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
  const [stacks, setStacks] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [modalType, setModalType] = useState<
    "view" | "edit" | "delete" | null
  >(null);

  const itemsPerPage = 10;

  // ================= FETCH =================
  const fetchTutors = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `api/all_tutors?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTutors(response.data.tutors || []);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load tutors.");
      toast.error("Failed to load tutors.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStacks = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/stacks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStacks(res.data?.stacks || res.data?.data || res.data || []);
    } catch (err) {
      console.warn("Stacks load failed", err);
    }
  };

  const fetchClasses = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses(res.data?.classes || res.data?.data || res.data || []);
    } catch (err) {
      console.warn("Classes load failed", err);
    }
  };

  useEffect(() => {
    fetchTutors();
    fetchStacks();
    fetchClasses();
  }, [token, currentPage]);

  // ================= CRUD =================
  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/create_users", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Tutor created successfully!");
      setIsCreateModalOpen(false);
      fetchTutors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.put(`/api/users/${selectedTutor.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the local state to reflect the changes immediately
      setTutors((prev) =>
        prev.map((t) =>
          t.id === selectedTutor.id ? { ...t, ...data } : t
        )
      );

      toast.success("Tutor updated successfully!");
      setModalType(null);
      setSelectedTutor(null);
      fetchTutors(); // Refresh the list from the server to be completely sure
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update tutor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (data: any) => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/users/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTutors((prev) => prev.filter((t) => t.id !== data.id));
      toast.success("Tutor deleted successfully");
      setModalType(null);
      setSelectedTutor(null);
      fetchTutors();
    } catch (err: any) {
      try {
        await api.post(`/api/users/${data.id}`, { _method: "DELETE" }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTutors((prev) => prev.filter((t) => t.id !== data.id));
        toast.success("Tutor deleted successfully");
        setModalType(null);
        setSelectedTutor(null);
        fetchTutors();
      } catch (fallbackErr: any) {
        toast.error(fallbackErr.response?.data?.message || "Delete failed.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= ACTION HANDLERS =================
  const handleView = (id: number) => {
    const tutor = tutors.find((t) => t.id === id);
    if (!tutor) return;

    // Resolve stack and class names synchronously using the pre-fetched arrays
    const stack = stacks.find(
      (s) => s.id === tutor.stack || s.title === tutor.stack
    );
    const cls = classes.find(
      (c) => c.id === tutor.class || c.id === tutor.class_id
    );

    setSelectedTutor({
      ...tutor,
      resolvedStackName: stack?.title || tutor.stack,
      resolvedClassName: cls?.name || cls?.title || tutor.class,
    });
    setModalType("view");
  };

  const handleEdit = (id: number) => {
    const tutor = tutors.find((t) => t.id === id);
    if (!tutor) return;
    setSelectedTutor(tutor);
    setModalType("edit");
  };

  const handleDeleteClick = (id: number) => {
    const tutor = tutors.find((t) => t.id === id);
    if (!tutor) return;
    setSelectedTutor(tutor);
    setModalType("delete");
  };

  // ================= TABLE COLUMNS =================
  const columns: TableColumnProps[] = [
    {
      title: "Full Name",
      key: "fullname",
      render: (item) => (
        <span className="capitalize">{item.fullname}</span>
      ),
    },
    { title: "Username", key: "username" },
    {
      title: "Bug ID",
      key: "bug_id",
      render: (item) => (
        <span className="uppercase">{item.bug_id}</span>
      ),
    },
    {
      title: "Class",
      key: "class",
      render: (item) => {
        const cls = classes.find(
          (c) => c.id === item.class || c.id === item.class_id
        );
        return (
          <span className="capitalize">
            {cls?.name || cls?.title || "N/A"}
          </span>
        );
      },
    },
    {
      title: "Stack",
      key: "stack",
      render: (item) => {
        const stack = stacks.find(
          (s) => s.id === item.stack || s.title === item.stack
        );
        return (
          <span className="capitalize">
            {stack?.title || item.stack || "N/A"}
          </span>
        );
      },
    },
    { title: "Department", key: "department" },
    {
      title: "Created At",
      key: "created_at",
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "-",
    },

    // ================= ACTION CELL =================
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <ActionCell
          rowId={item.id}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          canView={true}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">
          Manage Tutors
        </h1>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> Add Tutor
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

      {/* CREATE */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateTutorForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* VIEW */}
      {modalType === "view" && selectedTutor && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedTutor(null);
          }}
        >
          <ViewTutor
            tutor={selectedTutor}
            onClose={() => {
              setModalType(null);
              setSelectedTutor(null);
            }}
          />
        </Modal>
      )}

      {/* EDIT */}
      {modalType === "edit" && selectedTutor && (
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
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* DELETE */}
      <ConfirmDialog
        isOpen={modalType === "delete" && selectedTutor !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete "${selectedTutor?.fullname}"?`}
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