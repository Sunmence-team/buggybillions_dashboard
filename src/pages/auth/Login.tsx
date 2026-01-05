import React from "react";
import { FaUser } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { LoginValidationSchema } from "../../lib/validationschemas";
import { assests } from "../../assets/assest";
import api from "../../helpers/api";

const Login: React.FC = () => {
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
      } catch (error: any) {

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
        <div className="text-center flex flex-col justify-center items-start">
          <h1 className="text-4xl text-bold text-justify">Hello!!</h1>
          <h2 className="text-yellow-400 text-5xl text-bold">Welcome</h2>
        </div>
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
                placeholder="Bug ID"
                name="bug_id"
                id="bug_id"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-black">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple text-white py-2 rounded-lg"
            >
              Login
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

export default Login;
