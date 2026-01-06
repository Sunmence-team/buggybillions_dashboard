import React, { useState, useEffect } from "react";

interface CreateStudentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

const STACKS = {
  frontend: ["HTML", "CSS", "React", "Vue", "Angular"],
  backend: ["Node.js", "Python", "Java", "Go"],
  mobile: ["Flutter", "React Native", "Swift", "Kotlin"],
  uiux: ["Figma", "Adobe XD", "Sketch"],
};

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  readOnly = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    bug_id: "",
    password: "",
    stack: "",
    department: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        bug_id: initialData.bug_id || "",
        password: initialData.password || "",
        stack: initialData.stack || "",
        department: initialData.department || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset department if stack changes
      ...(name === "stack" ? { department: "" } : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const departments = formData.stack
    ? STACKS[formData.stack as keyof typeof STACKS] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-tetiary">
          {readOnly
            ? "Student Details"
            : initialData
            ? "Edit Student"
            : "Add New Student"}
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Bug ID</label>
        <input
          type="text"
          name="bug_id"
          value={formData.bug_id}
          onChange={handleChange}
          disabled={readOnly || isLoading}
          autoCapitalize="words"
          required
          className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
          placeholder="Enter Bug ID"
        />
      </div>

      {!readOnly && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required={!initialData} // Required only for new students
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder={initialData ? "Leave blank to keep current" : "Enter Password"}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Stack</label>
        <select
          name="stack"
          value={formData.stack}
          onChange={handleChange}
          disabled={readOnly || isLoading}
          required
          className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
        >
          <option value="">Select Stack</option>
          {Object.keys(STACKS).map((stack) => (
            <option key={stack} value={stack}>
              {stack.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          disabled={readOnly || !formData.stack || isLoading}
          required
          className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          {readOnly ? "Close" : "Cancel"}
        </button>
        {!readOnly && (
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-md disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update" : "Create"
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateStudentForm;