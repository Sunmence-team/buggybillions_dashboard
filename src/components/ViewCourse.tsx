import React from "react";

interface ViewCourseProps {
  course: any;
  onClose: () => void;
}

const ViewCourse: React.FC<ViewCourseProps> = ({ course, onClose }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple mb-2">
          Course Details
        </h2>
        <p className="text-sm text-gray-600">
          View the course information.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-purple mb-3">Course Information</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Course Title:</span>
              <p className="text-gray-900">{course.title || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Description:</span>
              <p className="text-gray-900 whitespace-pre-wrap">
                {course.description || "—"}
              </p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Created At:</span>
              <p className="text-gray-900">
                {course.created_at
                  ? new Date(course.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;