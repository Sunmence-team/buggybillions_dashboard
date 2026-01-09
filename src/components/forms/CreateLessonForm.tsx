import React from 'react'
import { LuPlus } from "react-icons/lu";
import { FaTimes, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import api from "../../helpers/api";
import { useNavigate } from 'react-router-dom';

export default function CreateLessonForm() {

    const navigate = useNavigate()

    const lessonSchema = yup.object({
        lessons: yup
            .array()
            .of(
                yup.object({
                    day: yup.string().required("Day is required"),
                    topic: yup.string().required("Topic is required"),
                    introduction: yup.string().required("Introduction is required"),
                    resources: yup
                        .string()
                        .url("Must be a valid URL")
                        .required("Resources URL is required"),
                })
            )
            .min(1, "At least one lesson is required"),
    });

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            lessons: [
                {
                    day: "",
                    topic: "",
                    introduction: "",
                    resources: "",
                },
            ],
        },
        validationSchema: lessonSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const res = await api.post("/api/weekly-lessons", values, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.status === 200 || res.status === 201) {
                    toast.success("Curriculum created successfully!");
                    resetForm();
                    navigate(-1)
                    // setOpen(false);
                }
            } catch (err: any) {
                toast.error(
                    err?.response?.data?.message ||
                    err.message ||
                    "Failed to save curriculum"
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const addLesson = () => {
        formik.setFieldValue("lessons", [
            ...formik.values.lessons,
            {
                day: "",
                topic: "",
                introduction: "",
                resources: "",
            },
        ]);
    };

    const removeLesson = (index: number) => {
        if (formik.values.lessons.length === 1) {
            toast.info("You must have at least one lesson");
            return;
        }
        const updated = formik.values.lessons.filter((_, i) => i !== index);
        formik.setFieldValue("lessons", updated);
    };

    // Helper to get field error
    const getError = (index: number, field: keyof typeof formik.values.lessons[0]) => {
        return (
            formik.touched.lessons?.[index]?.[field] &&
            formik.errors.lessons?.[index]?.[field as keyof {}]
        );
    };

    return (
        <div className="">

            <form onSubmit={formik.handleSubmit} className=" relative p-6 max-h-[80vh] overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 font-semibold text-sm text-gray-700 mb-2 border-b border-gray-300">
                    <div className="col-span-2">Day</div>
                    <div className="col-span-3">Topic</div>
                    <div className="col-span-4">Introduction</div>
                    <div className="col-span-2">Resources (URL)</div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {/* Lesson Rows */}
                {formik.values.lessons.map((lesson, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-start p-3 bg-white border-b border-gray-300 transition"
                    >
                        {/* Day */}
                        <div className="col-span-2">
                            <input
                                type="text"
                                placeholder="e.g. Monday"
                                name={`lessons.${index}.day`}
                                value={lesson.day}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border ${getError(index, "day")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-gray-100"
                                    } focus:outline-none font-medium`}
                            />
                            {getError(index, "day") && (
                                <p className="text-red-600 text-xs mt-1">{getError(index, "day")}</p>
                            )}
                        </div>

                        {/* Topic */}
                        <div className="col-span-3">
                            <input
                                type="text"
                                placeholder="Enter topic"
                                name={`lessons.${index}.topic`}
                                value={lesson.topic}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border ${getError(index, "topic")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-gray-100"
                                    } focus:outline-none font-medium`}
                            />
                            {getError(index, "topic") && (
                                <p className="text-red-600 text-xs mt-1">{getError(index, "topic")}</p>
                            )}
                        </div>

                        {/* Introduction */}
                        <div className="col-span-4">
                            <textarea
                                rows={2}
                                placeholder="Brief description..."
                                name={`lessons.${index}.introduction`}
                                value={lesson.introduction}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border resize-none ${getError(index, "introduction")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-gray-100"
                                    } focus:outline-none font-medium`}
                            />
                            {getError(index, "introduction") && (
                                <p className="text-red-600 text-xs mt-1">
                                    {getError(index, "introduction")}
                                </p>
                            )}
                        </div>

                        {/* Resources */}
                        <div className="col-span-2">
                            <input
                                type="url"
                                placeholder="https://..."
                                name={`lessons.${index}.resources`}
                                value={lesson.resources}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border ${getError(index, "resources")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300 bg-gray-100"
                                    } focus:outline-none font-medium`}
                            />
                            {getError(index, "resources") && (
                                <p className="text-red-600 text-xs mt-1">
                                    {getError(index, "resources")}
                                </p>
                            )}
                        </div>

                        {/* Delete Button */}
                        <div className="col-span-1 flex justify-center items-start pt-3">
                            <button
                                type="button"
                                onClick={() => removeLesson(index)}
                                className="text-red-600 hover:text-red-800 transition p-2 rounded-full hover:bg-red-50"
                                title="Remove lesson"
                            >
                                <FaTrash size={15} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Global Form Error */}
                {formik.errors.lessons && typeof formik.errors.lessons === "string" && (
                    <p className="text-red-600 text-sm text-center mb-4">
                        {formik.errors.lessons}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="sticky bottom-0 w-full border-t border-gray-300 flex justify-between items-center mt-8 bg-white h-[10vh]">
                    <button
                        type="button"
                        onClick={addLesson}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 rounded-lg font-medium transition"
                    >
                        <LuPlus size={20} />
                        Add Lesson
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !formik.isValid}
                        className="px-4 py-2 bg-[#796FAB] hover:bg-[#6a5a9a] disabled:bg-gray-400 text-white font-medium rounded-lg shadow-md transition disabled:cursor-not-allowed"
                    >
                        {loading ? "Saving..." : "Save Curriculum"}
                    </button>
                </div>
            </form>
        </div>
    )
}
