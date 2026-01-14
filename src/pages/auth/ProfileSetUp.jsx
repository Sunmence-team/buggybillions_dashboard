import React from "react";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../helpers/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { assests } from "../../assets/assest";

const ProfileSetUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bug_id: "",
      fullname: "",
      username: "",
      mobile: "",
      email: "",
    },
    validationSchema: Yup.object({
      bug_id: Yup.string().required("Bug ID is required"),
      fullname: Yup.string().required("Full Name is required"),
      username: Yup.string().required("Username is required"),
      mobile: Yup.string().required("Mobile is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await api.post("/api/complete-profile", values);
        if (response.status === 200) {
          toast.success("Profile setup completed!");
          navigate("/student/overview");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Form on the left */}
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-semibold text-black text-center mb-3">
            Complete Your Profile
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Fill in your details to continue
          </p>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <FaUser />
              <input
                type="text"
                name="bug_id"
                placeholder="Bug ID"
                className="w-full h-full outline-0 border-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.bug_id}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <FaUser />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="w-full h-full outline-0 border-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <FaUser />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full h-full outline-0 border-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <FiPhone />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                className="w-full h-full outline-0 border-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <MdEmail />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full h-full outline-0 border-0"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full bg-purple text-white h-11.25 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Submitting..." : "Complete Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* Image on the right */}
      <div
        className="w-1/2 hidden md:flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(121, 111, 171, 0.9), rgba(121, 111, 171, 0.9)), url('./lap.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <img src={assests.logo} className="w-64" />
      </div>
    </div>
  );
};

export default ProfileSetUp;
