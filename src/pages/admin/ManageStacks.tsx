import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import CreateStackForm from "../../components/forms/CreateStackForm";
import type { TableColumnProps } from "../../lib/interfaces";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

const ManageStacks: React.FC = () => {
  const { token } = useUser();
  const [stacks, setStacks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStack, setSelectedStack] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchStacks = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/stacks?page=${currentPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle different API response structures
      let stacksData = [];
      
      if (response.data?.stacks && Array.isArray(response.data.stacks)) {
        stacksData = response.data.stacks;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        stacksData = response.data.data;
      } else if (Array.isArray(response.data)) {
        stacksData = response.data;
      }

      setStacks(stacksData);
      setTotalPages(response.data.last_page || 1);
      setTotalItems(response.data.total || stacksData.length);
    } catch (err: any) {
      console.error("Error fetching stacks:", err);
      setError("Failed to load stacks. Please try again.");
      toast.error("Failed to load stacks.");
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
    } catch (err) {
      console.warn("Unable to load course options", err);
    }
  };

  useEffect(() => {
    fetchStacks();
    fetchCourses();
  }, [token, currentPage]);

  const handleCreate = async (data: any) => {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("course_id", data.courseId);
      formData.append("description", data.description);
      if (data.image) {
        formData.append("image", data.image);
      }

      await api.post("/api/stacks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Stack created successfully!");
      setIsCreateModalOpen(false);
      fetchStacks();
    } catch (err: any) {
      console.error("Error creating stack:", err);
      toast.error(err.response?.data?.message || "Failed to create stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      console.log("Update Data:", data);
      setStacks((prev) =>
        prev.map((stack) =>
          stack.id === selectedStack.id ? { ...stack, ...data } : stack
        )
      );
      toast.success("Stack updated successfully (Demo)");
      setModalType(null);
      setSelectedStack(null);
    } catch (err: any) {
      console.error("Error updating stack:", err);
      toast.error("Failed to update stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActionMenu = (id: string) => {
    setOpenActionId(openActionId === id ? null : id);
  };

  const columns: TableColumnProps[] = [
    {
      title: "Stack Title",
      key: "title",
    },
    {
      title: "Course",
      key: "course",
      render: (item) => item.course?.title || item.course_id || "-",
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
                  setSelectedStack(item);
                  setModalType("view");
                  setOpenActionId(null);
                }}
              >
                View Stack
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                onClick={() => {
                  setSelectedStack(item);
                  setModalType("edit");
                  setOpenActionId(null);
                }}
              >
                Edit Stack
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
        <h1 className="text-2xl font-bold text-tetiary">Manage Stacks</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 h-11.25 text-sm flex items-center justify-center gap-2 bg-purple text-white rounded-md"
        >
          <FaPlus /> <span>Add Stack</span>
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

      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateStackForm
            courses={courses.map((course) => ({
              id: course.id,
              title: course.title,
            }))}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {modalType && selectedStack && (
        <Modal
          onClose={() => {
            setModalType(null);
            setSelectedStack(null);
          }}
        >
          <CreateStackForm
            initialData={selectedStack}
            courses={courses.map((course) => ({
              id: course.id,
              title: course.title,
            }))}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedStack(null);
            }}
            readOnly={modalType === "view"}
            isLoading={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageStacks;
