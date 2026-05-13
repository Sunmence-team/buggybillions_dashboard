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
  const [classes, setClasses] = useState<any[]>([]);
  const [stacks, setStacks] = useState<any[]>([]);
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

  const fetchClasses = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = [];
      if (res.data?.classes && Array.isArray(res.data.classes)) {
        data = res.data.classes;
      } else {
        data = res.data?.data || res.data || [];
      }
      setClasses(data);
    } catch (err) {
      console.warn("Failed to load classes for lookup");
    }
  };

  const fetchStacks = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/stacks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = [];
      if (res.data?.stacks && Array.isArray(res.data.stacks)) {
        data = res.data.stacks;
      } else {
        data = res.data?.data || res.data || [];
      }
      setStacks(data);
    } catch (err) {
      console.warn("Failed to load stacks for lookup");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchStacks();
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
      const response = await api.post("/api/create_users", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract newly created user ID
      const newUserId = response.data?.user?.id || response.data?.student?.id || response.data?.id || response.data?.data?.id;

      // If a class was selected, assign the student to it
      if (newUserId && data.student_class_id) {
        try {
          await api.post("/api/classes/assign-student", {
            student_id: newUserId,
            student_class_id: data.student_class_id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (assignErr) {
          console.error("Failed to assign to class:", assignErr);
          toast.warning("Student was created, but assigning to class failed.");
        }
      }

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
      await api.put(`/api/users/${selectedStudent.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the local state
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id ? { ...s, ...data } : s
        )
      );

      // Re-assign class if class changed during edit
      if (data.student_class_id) {
        try {
          await api.post("/api/classes/assign-student", {
            student_id: selectedStudent.id,
            student_class_id: data.student_class_id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (assignErr) {
          console.warn("Class reassignment might have failed", assignErr);
        }
      }

      toast.success("Student updated successfully!");
      setModalType(null);
      setSelectedStudent(null);
      fetchStudents(); // Refresh from server
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update student.");
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
      await api.delete(`/api/users/${student.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      toast.success("Student deleted successfully!");
      setModalType(null);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err: any) {
      try {
        // Fallback for CORS/method issues
        await api.post(`/api/users/${student.id}`, { _method: "DELETE" }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setStudents((prev) => prev.filter((s) => s.id !== student.id));
        toast.success("Student deleted successfully!");
        setModalType(null);
        setSelectedStudent(null);
        fetchStudents();
      } catch (fallbackErr: any) {
        console.error(fallbackErr);
        toast.error(fallbackErr.response?.data?.message || "Failed to delete student.");
      }
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
      render: (item) => {
        // Try direct nested objects first
        let className = item.student_class?.name || item.class?.name || item.student_class_name || item.class_name;
        
        // If not found, lookup by ID from the classes array
        if (!className) {
          const classId = item.student_class_id || item.class_id;
          if (classId) {
            const matchedClass = classes.find((c: any) => c.id == classId);
            if (matchedClass) {
              className = matchedClass.name || matchedClass.title || `Class ${classId}`;
            }
          }
        }

        return (
          <span className="capitalize">
            {className || "N/A"}
          </span>
        );
      },
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
            let className = item.student_class?.name || item.class?.name || item.student_class_name || item.class_name;
            if (!className) {
              const classId = item.student_class_id || item.class_id;
              if (classId) {
                const matchedClass = classes.find((c: any) => c.id == classId);
                if (matchedClass) {
                  className = matchedClass.name || matchedClass.title || `Class ${classId}`;
                }
              }
            }

            let stackName = item.stack?.name || item.stack?.title;
            if (!stackName) {
              const stackId = item.stack_id || item.stack;
              if (stackId) {
                const matchedStack = stacks.find((s: any) => s.id == stackId);
                if (matchedStack) {
                  stackName = matchedStack.name || matchedStack.title;
                } else if (typeof stackId === 'string' && isNaN(Number(stackId))) {
                  stackName = stackId;
                }
              }
            }

            setSelectedStudent({
              ...item,
              resolvedClassName: className || undefined,
              resolvedStackName: stackName || undefined
            });
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