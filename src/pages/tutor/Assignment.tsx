import React from "react";
import { useFormik } from "formik";
import * as yup from 'yup'
import { toast } from "sonner";
import api from "../../helpers/api";
import ReusableTable from "../../utility/ReusableTable";
import { useUser } from "../../context/UserContext";

const Assignment = () => {
  const {user} = useUser()

  const [loading, setLoading] = React.useState(false)
  const [fetchAssignments, setFetchAssignments] = React.useState<any[]>([])
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(10)
  const [totalItem, setTotalItem] = React.useState(10)

  const assignmentSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    attachment: yup
      .mixed()
      .required("Attachment is required")
      .test(
        "fileSize",
        "File is too large, maximum size is 5MB",
        (value) => !value || (value && value.size <= 5 * 1024 * 1024)
      )
      .test(
        "fileType",
        "Unsupported file format",
        (value) =>
          !value ||
          (value &&
            ["application/pdf", "image/jpeg", "image/png", "application/msword"].includes(
              value.type
            ))
      ),
  })

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      attachment: ''
    },
    validationSchema: assignmentSchema,
    onSubmit: async (values, {
      resetForm
    }) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token')
        if (!token) return
        

        const response = await api.post(`api/tutors/${user?.id}/assignments`, {
          header: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 200 || response.status === 201) {
          console.log(response.data)
        }
        resetForm()

      } catch (error: any) {
        const errMessage = error.response?.data?.data || error.message
        toast.error(errMessage)
      } finally {
        setLoading(false)
      }
    }
  })

  const columns = [
    {
      key: 'title',
      title: 'TITLE',
      render: (item: any) => item.title
    },
    {
      key: 'description',
      title: 'DESCRIPTION',
      render: (item: any) => item.description
    },
    {
      key: 'attachment',
      title: 'ATTACHMENT',
      render: (item: any) => item.attachment
    },
  ]

  return (
    <>
      <div className="flex flex-col justify-center">
        <h2 className="text-xl font-semibold mb-8 text-black text-center">
          Assignment
        </h2>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 bg-white shadow p-4 rounded-lg"
        >
          {/* Title */}
          <label className="font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-red-500 text-sm">{formik.errors.title}</p>
          )}

          {/* Description */}
          <label className="font-medium">Description</label>
          <textarea
          rows={3}
            name="description"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="resize-none p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}

          {/* File Upload */}
          <label className="font-medium">File</label>
          <input
            type="file"
            name="attachment"
            onChange={(event) => {
              formik.setFieldValue(
                "attachment",
                event.currentTarget.files?.[0]
              );
            }}
            onBlur={formik.handleBlur}
            className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
          />
          {formik.touched.attachment && formik.errors.attachment && (
            <p className="text-red-500 text-sm">
              {formik.errors.attachment}
            </p>
          )}

          {/* Submit */}
          <div className="flex justify-center gap-3 mt-2">
            <button
              type="submit"
              className="px-4 py-3 bg-[#796FAB] text-black rounded-lg w-full cursor-pointer"
            >
              Submit
            </button>
          </div>
        </form>
        <div className="mt-9">
          <ReusableTable
            columns={columns}
            data={fetchAssignments}
            isLoading={loading}
            error={null}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItem}
            setCurrentPage={setCurrentPage}
            hasSerialNo={true}
          />
        </div>
      </div>
    </>
  );
};

export default Assignment;
