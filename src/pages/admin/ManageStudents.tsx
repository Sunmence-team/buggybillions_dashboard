import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateStudentForm from "../../components/forms/CreateStudentForm";
import ViewStudent from "../../components/ViewStudent";
import type { TableColumnProps } from "../../lib/interfaces";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api.tsx";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import { formatISODateToCustom } from "../../helpers/formatterUtility";
import ActionCell from "../../utility/ActionCell";


const ManageStudents: React.FC = () => {
  const { token } = useUser();

  const [students, setStudents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createKey, setCreateKey] = useState(0); // 👈 NEW: forces form remount
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);

  const itemsPerPage = 10;

  /* =======================
     FETCH STUDENTS
  ======================= */
  const fetchStudents = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/all_students?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        setStudents(response.data.students || []);
        setTotalPages(response.data.last_page || 1);
        setTotalItems(response.data.total || 0);
      }
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError("Failed to load students.");
      toast.error("Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token, currentPage]);

  /* =======================
     OPEN CREATE MODAL
  ======================= */
  const handleOpenCreate = () => {
    setSelectedStudent(null);        // 👈 clear any previous student
    setCreateKey((prev) => prev + 1); // 👈 increment key to force form remount
    setIsCreateModalOpen(true);
  };

  /* =======================
     CREATE
  ======================= */
  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/create_users", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Student created successfully!");
      setIsCreateModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     UPDATE
  ======================= */
  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...data } : s
        )
      );

      toast.success("Student updated successfully!");
      setModalType(null);
      setSelectedStudent(null);
    } catch (err) {
      toast.error("Failed to update student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================
     DELETE
  ======================= */
  const handleDelete = async (student: any) => {
    setIsDeleting(true);
    try {
      const res = await api.delete(`/api/users/${student.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setStudents((prev) =>
          prev.filter((s) => s.id !== student.id)
        );

        toast.success("Student deleted successfully!");
        setModalType(null);
        setSelectedStudent(null);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to delete student.");
    } finally {
      setIsDeleting(false);
    }
  };

  /* =======================
     TABLE COLUMNS
  ======================= */
  const columns: TableColumnProps[] = [
    {
      title: "Full Name",
      key: "fullname",
      render: (item) => (
        <span className="font-semibold text-sm capitalize">
          {item.fullname || "-"}
        </span>
      ),
    },
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
      render: (item) => (
        <span className="capitalize">
          {
            item.student_class?.name ||
            item.class?.name ||
            item.student_class_name ||
            item.class_name ||
            "N/A"
          }
        </span>
      ),
    },
    {
      title: "Department",
      key: "department",
    },
    {
      title: "Created At",
      key: "created_at",
      render: (item) => formatISODateToCustom(item.created_at),
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <ActionCell
          rowId={item.id}
          onView={() => {
            setSelectedStudent(item);
            setModalType("view");
          }}
          onEdit={() => {
            setSelectedStudent(item);
            setModalType("edit");
          }}
          onDelete={() => {
            setSelectedStudent(item);
            setModalType("delete");
          }}
        />
      ),
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">
          Manage Students
        </h1>

        {/* 👇 FIXED: now calls handleOpenCreate */}
        <button
          onClick={handleOpenCreate}
          className="px-3 h-11 flex items-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* TABLE */}
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
      />

      {/* CREATE */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateStudentForm
            key={createKey} // 👈 FIXED: forces full remount every time modal opens
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* VIEW */}
      {modalType === "view" && selectedStudent && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStudent(null);
          }}
        >
          <ViewStudent
            student={selectedStudent}
            onClose={() => {
              setModalType(null);
              setSelectedStudent(null);
            }}
          />
        </Modal>
      )}

      {/* EDIT */}
      {modalType === "edit" && selectedStudent && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStudent(null);
          }}
        >
          <CreateStudentForm
            key={selectedStudent.id} // 👈 FIXED: unique key per student being edited
            initialData={selectedStudent}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedStudent(null);
            }}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* DELETE */}
      <ConfirmDialog
        isOpen={modalType === "delete" && !!selectedStudent}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedStudent?.fullname}"?`}
        onConfirm={() => handleDelete(selectedStudent)}
        onCancel={() => {
          setModalType(null);
          setSelectedStudent(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageStudents;