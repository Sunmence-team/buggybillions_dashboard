import React, { useState, useEffect } from "react";
import api from "../helpers/api";


interface ViewStackProps {
  stack: any;
  onClose: () => void;
}

const ViewStack: React.FC<ViewStackProps> = ({ stack, onClose }) => {
  const [courseName, setCourseName] = useState<string>("");

  useEffect(() => {
    if (stack.resolvedCourseName) {
      setCourseName(stack.resolvedCourseName);
    } else {
      const courseVal = stack.course_id || stack.course;
      if (courseVal) {
        if (typeof courseVal === 'string' && isNaN(Number(courseVal))) {
          setCourseName(courseVal);
        } else {
          fetchCourseName(courseVal);
        }
      }
    }
  }, [stack]);

  const fetchCourseName = async (courseId: number | string) => {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      setCourseName(response.data?.course?.title || response.data?.title || "Unknown");
    } catch (error) {
      console.error("Error fetching course:", error);
      setCourseName("Unknown");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple mb-2">
          Stack Details
        </h2>
        <p className="text-sm text-gray-600">
          View the stack information.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-purple mb-3">Stack Information</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Stack Title:</span>
              <p className="text-gray-900">{stack.title || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Course:</span>
              <p className="text-gray-900">{courseName || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Description:</span>
              <p className="text-gray-900 whitespace-pre-wrap">
                {stack.description || "—"}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Created At:</span>
              <p className="text-gray-900">
                {stack.created_at
                  ? new Date(stack.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStack;