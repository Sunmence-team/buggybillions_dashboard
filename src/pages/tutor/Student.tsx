import React, { useEffect, useState } from "react";
import ReusableTable from "../../utility/ReusableTable";
import type { TableColumnProps } from "../../lib/interfaces";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useUser } from "../../context/UserContext";

/* ================= TYPES ================= */
type Student = {
  id: number;
  fullname: string;
  email: string;
  username: string;
  bug_id: string;
  role: string;
  stack: string;
  department: string;
  mobile: string;
  enabled: string;
  active: string;
  created_at: string;
  updated_at: string;
};

const TutorStudents: React.FC = () => {
  const { user, token } = useUser();

  const tutorId = user?.id; // ✅ real tutor ID from auth

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* pagination (even if backend doesn’t paginate yet) */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = 10;

  /* ================= FETCH STUDENTS ================= */
  const fetchStudents = async () => {
    if (!token || !tutorId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get(`/api/tutors/${tutorId}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      /**
       * Backend response:
       * {
       *   tutor: {...},
       *   total_students: number,
       *   students: []
       * }
       */
      setStudents(res.data?.students || []);
      setTotalItems(res.data?.total_students || 0);
      setTotalPages(1); // backend doesn’t paginate yet
    } catch (err: any) {
      console.error("Failed to fetch tutor students", err);
      setError("Failed to load students.");
      toast.error("Failed to load tutor students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token, tutorId]);

  /* ================= TABLE COLUMNS ================= */
  const columns: TableColumnProps[] = [
    {
      title: "Full Name",
      key: "fullname",
    },
    {
      title: "Username",
      key: "username",
    },
    {
      title: "Bug ID",
      key: "bug_id",
    },
    {
      title: "Stack",
      key: "stack",
      render: (item) => <span className="uppercase">{item.stack}</span>,
    },
    {
      title: "Department",
      key: "department",
    },
    {
      title: "Status",
      key: "active",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.active === "1"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.active === "1" ? "Active" : "Inactive"}
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
  ];

  if (!tutorId) {
    return (
      <p className="text-center py-10 text-red-500">
        Tutor not authenticated
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-tetiary">
          My Students
        </h1>
        <p className="text-sm text-gray-500">
          Total students: {totalItems}
        </p>
      </div>

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
    </div>
  );
};

export default TutorStudents;
