import React, { useState, useEffect } from "react";
import ReusableTable from "../../utility/ReusableTable";
import Modal from "../../components/modal/Modal";
import type { TableColumnProps } from "../../lib/interfaces";
import { FaPlus } from "react-icons/fa6";
import api from "../../helpers/api.tsx";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import ActionCell from "../../utility/ActionCell";
import CreateAnnouncementForm from "../../components/forms/CreateAnnouncementForm";
import ViewAnnouncement from "../../components/ViewAnnouncement";

const ManageAnnouncements: React.FC = () => {
  const { token } = useUser();

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);

  const itemsPerPage = 10;

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

  const fetchAnnouncements = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/announcements?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = response.data?.announcements || response.data?.data || response.data || [];
      // Handle Laravel paginated response structure if applicable
      setAnnouncements(Array.isArray(data) ? data : data.data || []);
      setTotalPages(response.data?.last_page || 1);
      setTotalItems(response.data?.total || data.length || 0);
    } catch (err) {
      console.warn("Failed to load announcements.", err);
      // We don't show a toast here in case the endpoint doesn't exist yet, to prevent noisy errors
      setError("Failed to load announcements.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [token]);

  useEffect(() => {
    fetchAnnouncements();
  }, [token, currentPage]);

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/announcements", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Announcement created successfully!");
      setIsCreateModalOpen(false);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.put(`/api/announcements/${selectedAnnouncement.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Announcement updated successfully!");
      setModalType(null);
      setSelectedAnnouncement(null);
      fetchAnnouncements();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (data: any) => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/announcements/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnnouncements((prev) => prev.filter((a) => a.id !== data.id));
      toast.success("Announcement deleted successfully!");
      setModalType(null);
      setSelectedAnnouncement(null);
    } catch (err: any) {
      try {
        await api.post(`/api/announcements/${data.id}`, { _method: "DELETE" }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnnouncements((prev) => prev.filter((a) => a.id !== data.id));
        toast.success("Announcement deleted successfully!");
        setModalType(null);
        setSelectedAnnouncement(null);
      } catch (fallbackErr: any) {
        toast.error(fallbackErr.response?.data?.message || "Failed to delete announcement.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: TableColumnProps[] = [
    {
      title: "Title",
      key: "title",
      render: (item) => (
        <div className="font-semibold text-purple max-w-[200px] truncate" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-lg text-xs font-medium capitalize ${
            item.type === "global" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.type}
        </span>
      ),
    },
    {
      title: "Class Target",
      key: "student_class_id",
      render: (item) => {
        if (item.type !== "class" && !item.student_class_id) return <span className="text-gray-400">-</span>;
        const cls = classes.find((c) => c.id == item.student_class_id);
        return <span className="capitalize">{cls?.name || cls?.title || "Unknown Class"}</span>;
      },
    },
    {
      title: "Content",
      key: "content",
      render: (item) => (
        <div className="text-gray-500 text-sm max-w-[300px] truncate" title={item.content}>
          {item.content}
        </div>
      ),
    },
    {
      title: "Created At",
      key: "created_at",
      render: (item) =>
        item.created_at ? new Date(item.created_at).toLocaleDateString() : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (item) => (
        <ActionCell
          rowId={item.id}
          onView={() => {
            const cls = classes.find((c) => c.id == item.student_class_id);
            setSelectedAnnouncement({
              ...item,
              resolvedClassName: cls?.name || cls?.title || "Unknown Class"
            });
            setModalType("view");
          }}
          onEdit={() => {
            setSelectedAnnouncement(item);
            setModalType("edit");
          }}
          onDelete={() => {
            setSelectedAnnouncement(item);
            setModalType("delete");
          }}
          canView={true}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-tetiary">Manage Announcements</h1>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 text-sm flex items-center gap-2 bg-purple text-white rounded-lg shadow-md hover:bg-purple-dark transition-all"
        >
          <FaPlus /> Create Announcement
        </button>
      </div>

      <ReusableTable
        columns={columns}
        data={announcements}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
      />

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <CreateAnnouncementForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* VIEW MODAL */}
      {modalType === "view" && selectedAnnouncement && (
        <Modal onClose={() => setModalType(null)}>
          <ViewAnnouncement
            announcement={selectedAnnouncement}
            onClose={() => {
              setModalType(null);
              setSelectedAnnouncement(null);
            }}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {modalType === "edit" && selectedAnnouncement && (
        <Modal onClose={() => setModalType(null)}>
          <CreateAnnouncementForm
            initialData={selectedAnnouncement}
            onSubmit={handleUpdate}
            onCancel={() => {
              setModalType(null);
              setSelectedAnnouncement(null);
            }}
            isLoading={isSubmitting}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      <ConfirmDialog
        isOpen={modalType === "delete" && selectedAnnouncement !== null}
        title="Confirm Delete"
        message={`Are you sure you want to delete the announcement "${selectedAnnouncement?.title}"?`}
        onConfirm={() => handleDelete(selectedAnnouncement)}
        onCancel={() => {
          setModalType(null);
          setSelectedAnnouncement(null);
        }}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ManageAnnouncements;
