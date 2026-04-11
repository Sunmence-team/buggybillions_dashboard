import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateCourseForm from "../../components/forms/CreateCourseForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const ManageCourses: React.FC = () => {
  const { token } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchCourses = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/courses?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle different API response structures
      let coursesData = [];
      
      if (response.data?.courses && Array.isArray(response.data.courses)) {
        coursesData = response.data.courses;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        coursesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        coursesData = response.data;
      }

      setCourses(coursesData);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || coursesData.length);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
      toast.error("Failed to load courses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token, currentPage]);

  const handleCreate = async (data: any) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price?.toString() || "");
      formData.append("language", data.language);
      formData.append("description", data.description);
      if (data.image) {
        formData.append("image", data.image);
      }

      await api.post("/api/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Course created successfully!");
      setIsCreateModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      console.error("Error creating course:", err);
      toast.error(err.response?.data?.message || "Failed to create course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Update Data:", data);
      setCourses((prev) =>
        prev.map((course) =>
          course.id === selectedCourse.id ? { ...course, ...data } : course
        )
      );
      toast.success("Course updated successfully (Demo)");
      setModalType(null);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Error updating course:", err);
      toast.error("Failed to update course.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Course Title",
      key: "title",
    },
    {
      title: "Price",
      key: "price",
      render: (item) => item.price ? `¥${item.price}` : "-",
    },
    {
      title: "Language",
      key: "language",
    },
    {
      title: "Description",
      key: "description",
      className: "p-3 text-sm text-black font-medium",
      render: (item) => (
        <span title={item.description} className="max-w-xs block truncate text-left">{item.description || "—"}</span>
      ),
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
                  setSelectedCourse(item);
                  setModalType("view");
                  setOpenActionId(null);
                }}
              >
                View Course
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedCourse(item);
                  setModalType("edit");
                  setOpenActionId(null);
                }}
              >
                Edit Course
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
        <h1 className="text-2xl font-bold text-tetiary">Manage Courses</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center justify-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> <span>Add Course</span>
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={courses}
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
          <CreateCourseForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {modalType && selectedCourse && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedCourse(null);
          }}
        >
          <CreateCourseForm
            initialData={selectedCourse}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedCourse(null);
            }}
            readOnly={modalType === "view"}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageCourses;
