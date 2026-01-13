import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { toast } from 'sonner';
import api from '../../helpers/api';

interface StudentAssignmentFormProps {
  onClose?: () => void;
}

export default function StudentAssignmentForm({onClose}: StudentAssignmentFormProps) {

    const [loading, setLoading] = React.useState(false)
    // const [postAssignment, setPostAssignment] = React.useState<any[]>([])

    const assignmentSchema = yup.object({
        assignment_name: yup.string().required('Title is required'),
        assignment_description: yup.string().required('Description is required'),
        file: yup
            .mixed()
            // .test("fileRequired", "Attachment is required", value => value instanceof File)
            // .test("fileType", "Only ZIP files are allowed", value => value instanceof File ? value.type === "application/zip" : false)


    })

    const formik = useFormik({
        initialValues: {
            assignment_name: '',
            assignment_description: '',
            file: null
        },
        validationSchema: assignmentSchema,
        onSubmit: async (values, {
            resetForm
        }) => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return
                setLoading(true)

                const formData = new FormData();
                formData.append("assignment_name", values.assignment_name);
                formData.append("assignment_description", values.assignment_description);
                formData.append("file", values.file as File);

                const response = await api.post('/api/assignments/submit', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(response.status === 200 || response.status === 201){
                    toast.success('Successfully submitted assignment')
                    if (onClose) onClose();
                    resetForm()
                }


            } catch (error: any) {
                const ErrMessage = error.response?.data?.data || error.data
                toast.error(ErrMessage)
            } finally {
                setLoading(false)
            }
        }
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            formik.setFieldValue("file", file);
            formik.setFieldTouched("file", true, false);
        }
    };

    return (
        <div>
            <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-4 "
            >
                {/* Title */}
                <label className="font-medium">Title</label>
                <input
                    type="text"
                    name="assignment_name"
                    placeholder="Assignment Name"
                    value={formik.values.assignment_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.assignment_name && formik.errors.assignment_name && (
                    <p className="text-red-500 text-sm">{formik.errors.assignment_name}</p>
                )}

                {/* Description */}
                <label className="font-medium">Description</label>
                <textarea
                    rows={3}
                    name="assignment_description"
                    placeholder="Description"
                    value={formik.values.assignment_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="resize-none p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.assignment_description && formik.errors.assignment_description && (
                    <p className="text-red-500 text-sm">{formik.errors.assignment_description}</p>
                )}

                {/* File Upload */}
                <label className="font-medium">File</label>
                <input
                    type="file"
                    name="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.file && formik.errors.file && (
                    <p className="text-red-500 text-sm">{formik.errors.file}</p>
                )}


                {/* Submit */}
                <div className="flex justify-center gap-3 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-3 rounded-lg w-full 
                        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#796FAB]"}`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div>
            </form>
        </div>
    )
}
