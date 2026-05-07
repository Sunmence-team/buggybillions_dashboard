import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateStackForm from "../../components/forms/CreateStackForm";
import ViewStack from "../../components/ViewStack";
import type { TableColumnProps } from "../../lib/interfaces";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api.tsx";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import ActionCell from "../../utility/ActionCell";

const ManageStacks: React.FC = () => {
  const { token } = useUser();

  const [stacks, setStacks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]); // 👈 important
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);

  const itemsPerPage = 10;

  // ================= FETCH STACKS =================
  const fetchStacks = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/stacks?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = [];
      if (res.data?.stacks && Array.isArray(res.data.stacks)) {
        data = res.data.stacks;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else {
        data = res.data?.data || [];
      }

      setStacks(data);
      setTotalPages(res.data.last_page || 1);
      setTotalItems(res.data.total || data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load stacks.");
      toast.error("Failed to load stacks.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= FETCH COURSES (same style as ManageCourses) =================
  const fetchCourses = async () => {
    if (!token) return;

    try {
      const res = await api.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = [];
      if (res.data?.courses && Array.isArray(res.data.courses)) {
        data = res.data.courses;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else {
        data = res.data?.data || [];
      }

      setCourses(data);
    } catch (err) {
      console.warn("Failed to load courses", err);
    }
  };

  useEffect(() => {
    fetchStacks();
    fetchCourses();
  }, [token, currentPage]);

  // ================= CREATE =================
  const handleCreate = async (data: any) => {
    if (!token) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        course_id: data.courseId,
        description: data.description,
      };

      await api.post("/api/stacks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Stack created successfully!");
      setIsCreateModalOpen(false);
      fetchStacks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (data: any) => {
    if (!token || !selectedStack?.id) return;

    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        course_id: data.courseId,
        description: data.description,
      };

      await api.put(`/api/stacks/${selectedStack.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Stack updated successfully!");

      setModalType(null);
      setSelectedStack(null);
      fetchStacks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (stack: any) => {
    if (!token || !stack?.id) return;

    setIsDeleting(true);

    try {
      await api.delete(`/api/stacks/${stack.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStacks((prev) => prev.filter((s) => s.id !== stack.id));

      toast.success("Stack deleted successfully.");

      setModalType(null);
      setSelectedStack(null);

      fetchStacks();
    } catch {
      try {
        await api.post(
          `/api/stacks/${stack.id}`,
          { _method: "DELETE" },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStacks((prev) => prev.filter((s) => s.id !== stack.id));

        toast.success("Stack deleted successfully.");

        setModalType(null);
        setSelectedStack(null);

        fetchStacks();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Delete failed.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= ACTION HANDLERS =================
  const handleView = (id: number) => {
    const stack = stacks.find((s) => s.id === id);
    if (!stack) return;
    setSelectedStack(stack);
    setModalType("view");
  };

  const handleEdit = (id: number) => {
    const stack = stacks.find((s) => s.id === id);
    if (!stack) return;
    setSelectedStack(stack);
    setModalType("edit");
  };

  const handleDeleteClick = (id: number) => {
    const stack = stacks.find((s) => s.id === id);
    if (!stack) return;
    setSelectedStack(stack);
    setModalType("delete");
  };

  // ================= TABLE =================
  const columns: TableColumnProps[] = [
    { title: "Stack Title", key: "title" },

    {
      title: "Courses",
      key: "courses",
      render: (item) => {
        // ✅ multiple courses
        if (Array.isArray(item.courses)) {
          return item.courses.map((c: any) => c.title).join(", ");
        }

        // ✅ single relation
        if (item.course) {
          return item.course.title;
        }

        // ✅ fallback using course_id (THIS FIXES YOUR ISSUE)
        if (item.course_id) {
          const found = courses.find((c) => c.id === item.course_id);
          return found?.title || "-";
        }

        return "-";
      },
    },

    {
      title: "Description",
      key: "description",
      render: (item) => (
        <span className="truncate block max-w-xs" title={item.description}>
          {item.description || "—"}
        </span>
      ),
    },

    {
      title: "Created At",
      key: "created_at",
      render: (item) =>
        item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "-",
    },

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
        <h1 className="text-2xl font-bold text-tetiary">Manage Stacks</h1>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 flex items-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> Add Stack
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={stacks}
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
          <CreateStackForm
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* VIEW */}
      {modalType === "view" && selectedStack && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStack(null);
          }}
        >
          <ViewStack
            stack={selectedStack}
            onClose={() => {
              setModalType(null);
              setSelectedStack(null);
            }}
          />
        </Modal>
      )}

      {/* EDIT */}
      {modalType === "edit" && selectedStack && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStack(null);
          }}
        >
          <CreateStackForm
            initialData={selectedStack}
            courses={courses.map((c) => ({ id: c.id, title: c.title }))}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedStack(null);
            }}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* DELETE */}
      <ConfirmDialog
        isOpen={modalType === "delete" && selectedStack !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete stack "${selectedStack?.title}"?`}
        onConfirm={() => handleDelete(selectedStack)}
        onCancel={() => {
          setModalType(null);
          setSelectedStack(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageStacks;