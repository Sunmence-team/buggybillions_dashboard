import React from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup'
import { toast } from 'sonner';
import api from '../../helpers/api';
import { useUser } from '../../context/UserContext';

interface StudentAssignmentFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function StudentAssignmentForm({ onClose, onSuccess }: StudentAssignmentFormProps) {

    const [loading, setLoading] = React.useState(false)
    const { user } = useUser();
    // const [postAssignment, setPostAssignment] = React.useState<any[]>([])

    const assignmentSchema = yup.object({
        assignment_name: yup.string().required('Title is required'),
        assignment_description: yup.string().required('Description is required'),
        weekly_lesson_id: yup.string().required('Weekly lesson is required'),
        course_id: yup.string().required('Course is required'),
        file: yup
            .mixed()
            .test("fileRequired", "Attachment is required", value => value instanceof File)
            // .test("fileType", "Only ZIP files are allowed", value => value instanceof File ? value.type === "application/zip" : false)
    })

    const formik = useFormik({
        initialValues: {
            assignment_name: '',
            assignment_description: '',
            weekly_lesson_id: '',
            course_id: '',
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

                if (!user?.id) {
                    toast.error('Unable to submit assignment: user not found.');
                    return;
                }

                const formData = new FormData();
                formData.append("assignment_name", values.assignment_name);
                formData.append("assignment_description", values.assignment_description);
                formData.append("student_id", user.id.toString());
                formData.append("weekly_lesson_id", values.weekly_lesson_id);
                formData.append("course_id", values.course_id);
                formData.append("file", values.file as unknown as File);

                const response = await api.post('/api/assignments/submit', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(response.status === 200 || response.status === 201){
                    toast.success('Successfully submitted assignment')
                    onSuccess?.();
                    if (onClose) onClose();
                    resetForm()
                }


            } catch (error: any) {
                const ErrMessage =
                    error.response?.data?.message ||
                    error.response?.data?.data ||
                    error.message ||
                    "Failed to submit assignment";
                toast.error(ErrMessage);
            } finally {
                setLoading(false);
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

                {/* Weekly Lesson */}
                <label className="font-medium">Weekly Lesson ID</label>
                <input
                    type="text"
                    name="weekly_lesson_id"
                    placeholder="Enter weekly lesson id"
                    value={formik.values.weekly_lesson_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.weekly_lesson_id && formik.errors.weekly_lesson_id && (
                    <p className="text-red-500 text-sm">{formik.errors.weekly_lesson_id}</p>
                )}

                {/* Course */}
                <label className="font-medium">Course ID</label>
                <input
                    type="text"
                    name="course_id"
                    placeholder="Enter course id"
                    value={formik.values.course_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.course_id && formik.errors.course_id && (
                    <p className="text-red-500 text-sm">{formik.errors.course_id}</p>
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
                        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple hover:bg-purple-900 cursor-pointer"} text-white font-medium`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div>
            </form>
        </div>
    )
}
