import React, { useState, useEffect } from "react";
import api from "../../helpers/api";

interface CreateStudentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  readOnly = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    department: "",
    stack: "",
    student_class_id: "",
  });

  const [stacks, setStacks] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingStacks, setLoadingStacks] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

  useEffect(() => {
    fetchStacks();
    fetchClasses();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullname: initialData.fullname || "",
        username: initialData.username || "",
        email: initialData.email || "",
        mobile: initialData.mobile || "",
        password: initialData.password || "",
        department: initialData.department || "",
        stack: initialData.stack || initialData.stack_id || "",
        student_class_id: initialData.student_class_id || initialData.student_class?.id || "",
      });
    }
  }, [initialData]);

  const fetchStacks = async () => {
    setLoadingStacks(true);
    try {
      const response = await api.get("/api/stacks");
      let stacksData = [];
      if (response.data?.stacks && Array.isArray(response.data.stacks)) {
        stacksData = response.data.stacks;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        stacksData = response.data.data;
      } else if (Array.isArray(response.data)) {
        stacksData = response.data;
      }
      setStacks(stacksData);
    } catch (error) {
      console.error("Error fetching stacks:", error);
    } finally {
      setLoadingStacks(false);
    }
  };

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const response = await api.get("/api/classes");
      let classesData = [];
      if (response.data?.classes && Array.isArray(response.data.classes)) {
        classesData = response.data.classes;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        classesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        classesData = response.data;
      }
      setClasses(classesData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Transform data to match backend expectations
    const submitData = {
      ...formData,
      stack: formData.stack, // This will be the stack_id
      role: "student"
    };
    onSubmit(submitData);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter Full Name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter Username"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter Email Address"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter Mobile Number"
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
              required={!initialData}
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
            disabled={readOnly || isLoading || loadingStacks}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
          >
            <option value="">
              {loadingStacks ? "Loading stacks..." : "Select Stack"}
            </option>
            {stacks.map((stack) => (
              <option key={stack.id} value={stack.id}>
                {stack.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Class (Optional)</label>
          <select
            name="student_class_id"
            value={formData.student_class_id}
            onChange={handleChange}
            disabled={readOnly || isLoading || loadingClasses}
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
          >
            <option value="">
              {loadingClasses ? "Loading classes..." : "Select Class"}
            </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name || cls.title || `Class ${cls.id}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter Department (e.g., Software, Design, etc.)"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
        {!readOnly && (
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-md hover:bg-purple/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : initialData ? "Update Student" : "Create Student"}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateStudentForm;