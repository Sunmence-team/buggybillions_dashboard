import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateClassForm from "../../components/forms/CreateClassForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";

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
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchClasses = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let classesData = [];
      if (response.data?.classes && Array.isArray(response.data.classes)) {
        classesData = response.data.classes;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        classesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        classesData = response.data;
      }

      setClasses(classesData);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || classesData.length);
    } catch (err: any) {
      console.error("Error fetching classes:", err);
      setError("Failed to load classes. Please try again.");
      toast.error("Failed to load classes.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    if (!token) return;
    try {
      const response = await api.get("/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let coursesData = [];
      if (response.data?.courses && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      }

      setCourses(coursesData);
    } catch (err) {
      console.warn("Unable to load course options", err);
    }
  };

  const fetchTutors = async () => {
    if (!token) return;
    try {
      const response = await api.get("/api/all_tutors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let tutorsData = [];
      if (response.data?.tutors && Array.isArray(response.data.tutors)) {
        tutorsData = response.data.tutors;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        tutorsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        tutorsData = response.data;
      }

      setTutors(tutorsData);
    } catch (err) {
      console.warn("Unable to load tutor options", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchTutors();
  }, [token, currentPage]);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Class created successfully!");
      setIsCreateModalOpen(false);
      fetchClasses();
    } catch (err: any) {
      console.error("Error creating class:", err);
      toast.error(err.response?.data?.message || "Failed to create class.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Update Data:", data);
      setClasses((prev) =>
        prev.map((item) =>
          item.id === selectedClass?.id ? { ...item, ...data } : item
        )
      );
      toast.success("Class updated successfully (Demo)");
      setModalType(null);
      setSelectedClass(null);
    } catch (err: any) {
      console.error("Error updating class:", err);
      toast.error("Failed to update class.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (classItem: any) => {
    if (!classItem?.id || !token) return;

    setIsDeleting(true);
    try {
      await api.delete(`/api/classes/${classItem.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Class deleted successfully.");
      setModalType(null);
      setSelectedClass(null);
      fetchClasses();
    } catch (err: any) {
      console.error("Error deleting class:", err);
      toast.error(err.response?.data?.message || "Failed to delete class.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Class Name",
      key: "name",
    },
    {
      title: "Course",
      key: "course",
      render: (item) => item.course?.title || item.course_id || "-",
    },
    {
      title: "Tutor",
      key: "tutor",
      render: (item) => item.tutor?.fullname || item.tutor?.name || item.tutor_id || "-",
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
                  setSelectedClass(item);
                  setModalType("view");
                  setOpenActionId(null);
                }}
              >
                View Class
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedClass(item);
                  setModalType("edit");
                  setOpenActionId(null);
                }}
              >
                Update Class
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                onClick={() => {
                  setSelectedClass(item);
                  setModalType("delete");
                  setOpenActionId(null);
                }}
              >
                Delete Class
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
        <h1 className="text-2xl font-bold text-tetiary">Manage Classes</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center justify-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> <span>Add Class</span>
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

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateClassForm
            courses={courses.map((course) => ({ id: course.id, title: course.title }))}
            tutors={tutors.map((tutor) => ({ id: tutor.id, fullname: tutor.fullname || tutor.name || "Tutor" }))}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {modalType && selectedClass && modalType !== "delete" && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedClass(null);
          }}
        >
          <CreateClassForm
            initialData={selectedClass}
            courses={courses.map((course) => ({ id: course.id, title: course.title }))}
            tutors={tutors.map((tutor) => ({ id: tutor.id, fullname: tutor.fullname || tutor.name || "Tutor" }))}
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

      <ConfirmDialog
        isOpen={modalType === "delete" && selectedClass !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete class "${selectedClass?.name || selectedClass?.id}"? This action cannot be undone.`}
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
