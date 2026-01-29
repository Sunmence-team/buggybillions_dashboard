import React from 'react'
import { toast } from 'sonner';
import { useUser } from '../../context/UserContext';
import api from '../../helpers/api';
import { useFormik } from 'formik';
import * as yup from 'yup'

interface GradeFormProps {
    onClose?: () => void;
    assignmentId: number;
    onSuccess: any
}

export default function GradeForm({ onClose, assignmentId, onSuccess }: GradeFormProps) {

    const [loading, setLoading] = React.useState(false)
    const { token } = useUser()

    const gradeSchema = yup.object({
        grade: yup.string()
            .required('Grade the Submitted Assignment')
            .min(0)
            .max(100)
    })

    const formik = useFormik({
        initialValues: {
            grade: ""
        },
        validationSchema: gradeSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (!token) return;
                setLoading(true)

                const response = await api.post(`/api/assignments/${assignmentId}/grade`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.status === 200 || response.status === 201) {
                    console.log(response.data)
                    resetForm()
                    if (onClose) onClose();
                    toast.success('Assignment Graded')
                    onSuccess()

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
            <h1 className='text-2xl font-semibold!'>Grade Assignment</h1>
            <div className='mt-10 flex flex-col gap-4'>
                <input
                    type="number"
                    name="grade"
                    placeholder="Input Grade between 0 - 100"
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
                        className={`px-4 py-3 rounded-lg w-full text-white font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple"}`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </div>

            </div>

        </form>
    )
}
