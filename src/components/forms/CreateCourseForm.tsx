import React, { useState, useEffect } from "react";

interface CreateCourseFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Chinese"];

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  readOnly = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    language: "",
    description: "",
    image: null as File | null,
  });
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        price: initialData.price?.toString() || "",
        language: initialData.language || "",
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
            ? "Course Details"
            : initialData
            ? "Edit Course"
            : "Add New Course"}
        </h2>
        <p className="text-sm text-gray-500">
          Provide the course information and upload a cover image.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Course Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter course title"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            min="0"
            step="0.01"
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
            placeholder="Enter price"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            disabled={readOnly || isLoading}
            required
            className="h-11.25 indent-2 border border-black/15 rounded-lg outline-0 disabled:bg-gray-100"
          >
            <option value="">Select language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Course Image</label>
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
              alt="Course preview"
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
          placeholder="Enter course description"
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
              "Update Course"
            ) : (
              "Create Course"
            )}
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateCourseForm;
