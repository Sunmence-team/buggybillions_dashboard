import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../helpers/api.tsx";
import { useUser } from "../../context/UserContext";

interface CreateAnnouncementFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { token } = useUser();
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      api
        .get("/api/classes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClasses(res.data?.classes || res.data?.data || res.data || []);
        })
        .catch((err) => console.error("Failed to fetch classes", err));
    }
  }, [token]);

  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      type: initialData?.type || "global",
      student_class_id: initialData?.student_class_id || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      type: Yup.string()
        .oneOf(["global", "class"], "Invalid announcement type")
        .required("Type is required"),
      student_class_id: Yup.string().when("type", {
        is: "class",
        then: (schema) => schema.required("Class is required for class announcements"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      // Clean up payload based on type
      const payload = {
        ...values,
        student_class_id: values.type === "global" ? undefined : parseInt(values.student_class_id, 10),
      };
      onSubmit(payload);
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center">
        {initialData ? "Edit Announcement" : "Create Announcement"}
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            className={`h-11.25 indent-2 border rounded-lg outline-0 disabled:bg-gray-100 ${
              formik.touched.title && formik.errors.title ? "border-red-500" : "border-black/15"
            }`}
            placeholder="Enter announcement title"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            value={formik.values.type}
            onChange={(e) => {
              formik.handleChange(e);
              if (e.target.value === "global") {
                formik.setFieldValue("student_class_id", "");
              }
            }}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            className={`h-11.25 px-2 border rounded-lg outline-0 disabled:bg-gray-100 ${
              formik.touched.type && formik.errors.type ? "border-red-500" : "border-black/15"
            }`}
          >
            <option value="global">Global (All Users)</option>
            <option value="class">Specific Class</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.type}</p>
          )}
        </div>

        {/* Class Selection (Only shown if type === 'class') */}
        {formik.values.type === "class" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Class</label>
            <select
              name="student_class_id"
              value={formik.values.student_class_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={`h-11.25 px-2 border rounded-lg outline-0 disabled:bg-gray-100 ${
                formik.touched.student_class_id && formik.errors.student_class_id
                  ? "border-red-500"
                  : "border-black/15"
              }`}
            >
              <option value="">Select a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name || cls.title}
                </option>
              ))}
            </select>
            {formik.touched.student_class_id && formik.errors.student_class_id && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.student_class_id as string}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Content</label>
          <textarea
            name="content"
            rows={5}
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isLoading}
            className={`indent-2 pt-2 border rounded-lg outline-0 disabled:bg-gray-100 resize-none ${
              formik.touched.content && formik.errors.content ? "border-red-500" : "border-black/15"
            }`}
            placeholder="Enter announcement details"
          />
          {formik.touched.content && formik.errors.content && (
            <p className="text-red-500 text-xs mt-1">{formik.errors.content}</p>
          )}
        </div>

        {/* Actions */}
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
            className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-md disabled:opacity-70 flex items-center justify-center min-w-[100px] gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : initialData ? (
              "Update Announcement"
            ) : (
              "Create Announcement"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncementForm;
