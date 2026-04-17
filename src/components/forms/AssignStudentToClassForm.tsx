import React, { useEffect, useState } from "react";

interface ClassOption {
  id: string;
  name: string;
}

interface AssignStudentToClassFormProps {
  classOptions: ClassOption[];
  onSubmit: (data: { student_class_id: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  studentName?: string;
}

const AssignStudentToClassForm: React.FC<AssignStudentToClassFormProps> = ({
  classOptions,
  onSubmit,
  onCancel,
  isLoading = false,
  studentName,
}) => {
  const [classId, setClassId] = useState("");

  useEffect(() => {
    setClassId("");
  }, [classOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ student_class_id: classId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-tetiary">
          Assign {studentName || "Student"} to Class
        </h2>
        <p className="text-sm text-gray-500">
          Select a class from the list below to assign this student.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Class</label>
        <select
          name="student_class_id"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          disabled={isLoading}
          required
          className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
        >
          <option value="">Select a class</option>
          {classOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-md hover:bg-purple/90 disabled:opacity-50"
        >
          {isLoading ? "Assigning..." : "Assign to Class"}
        </button>
      </div>
    </form>
  );
};

export default AssignStudentToClassForm;
