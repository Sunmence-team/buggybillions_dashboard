import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateClassForm from "../../components/forms/CreateClassForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import ActionCell from "../../utility/ActionCell";


const ManageClasses: React.FC = () => {
  const { token } = useUser();

  const [classes, setClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [modalType, setModalType] =
    useState<"view" | "edit" | "delete" | null>(null);

  const itemsPerPage = 10;

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/classes?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = [];
      if (res.data?.classes && Array.isArray(res.data.classes)) {
        data = res.data.classes;
      } else {
        data = res.data?.data || res.data || [];
      }

      setClasses(data);
      setTotalPages(res.data.last_page || 1);
      setTotalItems(res.data.total || data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load classes.");
      toast.error("Failed to load classes.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= FETCH COURSES =================
  const fetchCourses = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(res.data?.courses || res.data?.data || res.data || []);
    } catch {
      console.warn("Failed to load courses");
    }
  };

  // ================= FETCH TUTORS =================
  const fetchTutors = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/all_tutors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTutors(res.data?.tutors || res.data?.data || res.data || []);
    } catch {
      console.warn("Failed to load tutors");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchTutors();
  }, [token, currentPage]);

  // ================= CREATE =================
  const handleCreate = async (data: any) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      await api.post(
        "/api/classes",
        {
          name: data.name,
          course_id: data.courseId,
          tutor_id: data.tutorId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Class created successfully!");
      setIsCreateModalOpen(false);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create class.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === selectedClass.id ? { ...c, ...data } : c
        )
      );

      toast.success("Class updated (demo)");
      setModalType(null);
      setSelectedClass(null);
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (classItem: any) => {
    if (!classItem?.id) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/classes/${classItem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Class deleted successfully");
      setModalType(null);
      setSelectedClass(null);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= ACTION HANDLERS =================
  const handleView = (id: number) => {
    const item = classes.find((c) => c.id === id);
    if (!item) return;
    setSelectedClass(item);
    setModalType("view");
  };

  const handleEdit = (id: number) => {
    const item = classes.find((c) => c.id === id);
    if (!item) return;
    setSelectedClass(item);
    setModalType("edit");
  };

  const handleDeleteClick = (id: number) => {
    const item = classes.find((c) => c.id === id);
    if (!item) return;
    setSelectedClass(item);
    setModalType("delete");
  };

  // ================= TABLE =================
  const columns: TableColumnProps[] = [
    { title: "Class Name", key: "name" },
    {
      title: "Course",
      key: "course",
      render: (item) => item.course?.title || item.course_id || "-",
    },
    {
      title: "Tutor",
      key: "tutor",
      render: (item) =>
        item.tutor?.fullname ||
        item.tutor?.name ||
        item.tutor_id ||
        "-",
    },
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
          Manage Classes
        </h1>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 flex items-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> Add Class
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={classes}
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
          <CreateClassForm
            courses={courses}
            tutors={tutors}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* VIEW / EDIT */}
      {(modalType === "view" || modalType === "edit") && selectedClass && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedClass(null);
          }}
        >
          <CreateClassForm
            initialData={selectedClass}
            courses={courses}
            tutors={tutors}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedClass(null);
            }}
            readOnly={modalType === "view"}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* DELETE */}
      <ConfirmDialog
        isOpen={modalType === "delete" && selectedClass !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete class "${selectedClass?.name}"?`}
        onConfirm={() => handleDelete(selectedClass)}
        onCancel={() => {
          setModalType(null);
          setSelectedClass(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageClasses;