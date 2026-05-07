import React, { useState, useEffect } from "react";
import api from "../helpers/api";


interface ViewClassProps {
  classData: any;
  onClose: () => void;
}

const ViewClass: React.FC<ViewClassProps> = ({ classData, onClose }) => {
  const [courseName, setCourseName] = useState<string>("");
  const [tutorName, setTutorName] = useState<string>("");

  useEffect(() => {
    if (classData.course_id) {
      fetchCourseName(classData.course_id);
    }
    if (classData.tutor_id) {
      fetchTutorName(classData.tutor_id);
    }
  }, [classData]);

  const fetchCourseName = async (courseId: number) => {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      setCourseName(response.data?.course?.title || response.data?.title || "Unknown");
    } catch (error) {
      console.error("Error fetching course:", error);
      setCourseName("Unknown");
    }
  };

  const fetchTutorName = async (tutorId: number) => {
    try {
      const response = await api.get(`/api/tutors/${tutorId}`);
      setTutorName(response.data?.tutor?.fullname || response.data?.fullname || "Unknown");
    } catch (error) {
      console.error("Error fetching tutor:", error);
      setTutorName("Unknown");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-purple mb-2">
          Class Details
        </h2>
        <p className="text-sm text-gray-600">
          View the class information.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-purple mb-3">Class Information</h3>
          <div className="space-y-2">
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Class Name:</span>
              <p className="text-gray-900">{classData.name || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Course:</span>
              <p className="text-gray-900">{courseName || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Tutor:</span>
              <p className="text-gray-900">{tutorName || "—"}</p>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-700">Created At:</span>
              <p className="text-gray-900">
                {classData.created_at
                  ? new Date(classData.created_at).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;