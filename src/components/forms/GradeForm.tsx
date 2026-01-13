import React from 'react'
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import api from '../../helpers/api';
import { useFormik } from 'formik';
import * as yup from 'yup'

interface Grade {
    user_id: string | number;
    assignment_name: string;
    assignment_description: string;
    status: string;
    created_at: string
    grade: number
}

interface GradeFormProps {
    onClose?: () => void;
    assignmentId: number;
}

export default function GradeForm({ onClose, assignmentId }: GradeFormProps) {

    const [loading, setLoading] = React.useState(false)
    const [gradedData, setGradedata] = React.useState<Grade[]>([])
    const { user } = useUser()

    const gradeSchema = yup.object({
        grade: yup.string().required('Grade the Submitted Assignment')
    })
    const formik = useFormik({
        initialValues: {
            grade: ''
        },
        validationSchema: gradeSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return;
                setLoading(true)

                const response = await api.post(`/api/assignments/${assignmentId}/grade`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    console.log(response.data)
                    // setGradedata(response.data.assignment)
                    resetForm()
                    if (onClose) onClose();
                    toast.success('Assignment Graded')

                }

            } catch (error: any) {
                const errMessage = error.response?.data?.message || error.message
                toast.error(errMessage)
            } finally {
                setLoading(false)
            }

        }
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col gap-2 shadow-lg rounded-lg p-3'>
                <label className="font-medium">Grade</label>
                <input
                    type="number"
                    name="grade"
                    placeholder="Input Grade"
                    value={formik.values.grade}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-3 rounded-lg bg-gray-300 text-black focus:outline-none"
                />
                {formik.touched.grade && formik.errors.grade && (
                    <p className="text-red-500 text-sm">{formik.errors.grade}</p>
                )}

                <div className='flex justify-self-start start mt-2 '>
                    <button
                        type='submit'
                        disabled={loading}
                        className={`px-4 py-3 rounded-lg w-full 
                        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#796FAB]"}`}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div>

            </div>

        </form>
    )
}
