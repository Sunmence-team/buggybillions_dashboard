import React, { useState, useEffect } from "react";

interface CreateStackFormProps {
  initialData?: any;
  courses?: { id: string; title: string }[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

const CreateStackForm: React.FC<CreateStackFormProps> = ({
  initialData,
  courses = [],
  onSubmit,
  onCancel,
  readOnly = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    description: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        courseId: initialData.course_id || initialData.courseId || "",
        description: initialData.description || "",
        image: null,
      });
      if (initialData.image) {
        setPreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-tetiary">
          {readOnly
            ? "Stack Details"
            : initialData
            ? "Edit Stack"
            : "Add New Stack"}
        </h2>
        <p className="text-sm text-gray-500">
          Create a stack with a related course ID, image, and description.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Stack Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter stack title"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Course ID</label>
          {courses.length > 0 ? (
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={readOnly || isLoading}
              required
              className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={readOnly || isLoading}
              required
              className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
              placeholder="Enter course ID"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Stack Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={readOnly || isLoading}
            className="text-sm text-gray-600"
          />
          {preview && (
            <img
              src={preview}
              alt="Stack preview"
              className="max-h-40 w-full object-cover rounded-lg border border-black/10"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={readOnly || isLoading}
          required
          rows={5}
          className="indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
          placeholder="Enter stack description"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
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
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : initialData ? (
              "Update Stack"
            ) : (
              "Create Stack"
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateStackForm;
