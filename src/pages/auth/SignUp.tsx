import React from "react";
import { FaUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginValidationSchema } from "../../lib/validationschemas";
import { assests } from "../../assets/assest";
import api from "../../helpers/api";
import { useUser } from "../../context/UserContext";
import { toast } from "sonner";
import { IoMdMail } from "react-icons/io";

const SignUp: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      bug_id: "",
      password: "",
    },
    validationSchema: LoginValidationSchema,
    onSubmit: async (values) => {
      console.log("values", values)
      try {
        const response = await api.post("/api/login", values)
        console.log("response", response)

        if (response.status === 200) {
          const { role, token } = response.data
          login(token, role);
          navigate(
            role === "admin"
              ? "/admin/overview"
              : role === "tutor"
                ? "/tutor/curriculum"
                : "/student/overview"
          )
        }
      } catch (error: any) {
        console.log("Error occured logging in", error)
        toast.error(error.data?.response?.message || error?.message)
      }
    }
  })
  return (
    <div className="min-h-screen flex">
      <div
        className="p-5 md:w-1/1 text-white md:flex hidden text-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(121, 111, 171, 0.97), rgba(121, 111, 171, 0.96)), url('./lap.jpg')",
        }}
      >
        <div>
          <img src={assests.logo} className="w-55" />
        </div>
          <h1 className="text-4xl text-bold text-justify items-center my-auto">Join us today and <span className="text-yellow-400 text-5xl text-bold">start your Journey</span></h1>
    
      </div>

      <div className="w-1/1 flex flex-col justify-center items-center p-5 bg-white">
        <div className="w-full max-w-md">
          <div>
            <h2 className="text-2xl font-semibold text-black text-center">
              Login
            </h2>
            <p className="text-black mb-10 text-center">
              Sign in to your account
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <FaUser />
              <input
                type="text"
                className="w-full h-full outline-0 border-0"
                placeholder="Full name"
                name="bug_id"
                id="bug_id"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <IoMdMail />
              <input
                type="email"
                className="w-full h-full outline-0 border-0"
                placeholder="Email"
                name="bug_email"
                id="bug_email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <MdLock />
              <input
                type="password"
                className="w-full h-full outline-0 border-0"
                placeholder="Password"
                name="password"
                id="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="flex items-center gap-2 h-12.5 px-4 rounded-lg bg-gray-200">
              <MdLock />
              <input
                type="password"
                className="w-full h-full outline-0 border-0"
                placeholder="confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-black">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className="w-full bg-purple text-white h-11.25 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>

            <div className="text-sm text-center mt-4 text-gray-600 flex flex-col">
              <Link to="/" className="text-sm text-black">
                Forgot Password?
              </Link>
              <div className="flex justify-center gap-1">
                <p className="text-black"> Don’t have an account? </p>
                <Link to="/auth/register" className="text-red-500 font-semibold">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
