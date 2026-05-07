import React, { useState, useEffect } from "react";
import api from "../helpers/api";


interface ViewTutorProps {
  tutor: any;
  onClose: () => void;
}

const ViewTutor: React.FC<ViewTutorProps> = ({ tutor, onClose }) => {
  const [stackName, setStackName] = useState<string>("");
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    if (tutor.stack_id) {
      fetchStackName(tutor.stack_id);
    }
    if (tutor.class_id) {
      fetchClassName(tutor.class_id);
    }
  }, [tutor]);

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
          Tutor Details
        </h2>
        <p className="text-sm text-gray-600">
          View the tutor information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-purple mb-3">Personal Information</h3>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">ID:</span>
                <p className="text-gray-900 break-all">{tutor.bug_id || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Full Name:</span>
                <p className="text-gray-900 break-all">{tutor.fullname || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Username:</span>
                <p className="text-gray-900 break-all">{tutor.username || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Email:</span>
                <p className="text-gray-900 break-all">{tutor.email || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Mobile:</span>
                <p className="text-gray-900 break-all">{tutor.mobile || "—"}</p>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-gray-700 min-w-fit">Department:</span>
                <p className="text-gray-900 break-all">{tutor.department || "—"}</p>
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
                  {tutor.created_at
                    ? new Date(tutor.created_at).toLocaleDateString()
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

export default ViewTutor;