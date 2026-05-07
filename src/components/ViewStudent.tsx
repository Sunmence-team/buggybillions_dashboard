import React, { useState, useEffect } from "react";
import api from "../helpers/api";


interface ViewStudentProps {
  student: any;
  onClose: () => void;
}

const ViewStudent: React.FC<ViewStudentProps> = ({ student, onClose }) => {
  const [stackName, setStackName] = useState<string>("");
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    if (student.stack_id) {
      fetchStackName(student.stack_id);
    }
    if (student.student_class_id) {
      fetchClassName(student.student_class_id);
    }
  }, [student]);

  const fetchStackName = async (stackId: number) => {
    try {
      const response = await api.get(`/api/stacks/${stackId}`);
      setStackName(response.data?.stack?.name || response.data?.name || "Unknown");
    } catch (error) {
      console.error("Error fetching stack:", error);
      setStackName("Unknown");
    }
  };

  const fetchClassName = async (classId: number) => {
    try {
      const response = await api.get(`/api/classes/${classId}`);
      setClassName(response.data?.class?.name || response.data?.name || "Unknown");
    } catch (error) {
      console.error("Error fetching class:", error);
      setClassName("Unknown");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple mb-2">
          Student Details
        </h2>
        <p className="text-sm text-gray-600">
          View the student information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple mb-3">Personal Information</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">ID:</span>
                <p className="text-gray-900 break-all">{student.bug_id || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Full Name:</span>
                <p className="text-gray-900 break-all">{student.fullname || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Username:</span>
                <p className="text-gray-900 break-all">{student.username || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Email:</span>
                <p className="text-gray-900 break-all">{student.email || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Mobile:</span>
                <p className="text-gray-900 break-all">{student.mobile || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Department:</span>
                <p className="text-gray-900 break-all">{student.department || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple mb-3">Academic Information</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Stack:</span>
                <p className="text-gray-900 break-all">{stackName || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Class:</span>
                <p className="text-gray-900 break-all">{className || "—"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple mb-3">System Information</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Created At:</span>
                <p className="text-gray-900 break-all">
                  {student.created_at
                    ? new Date(student.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudent;