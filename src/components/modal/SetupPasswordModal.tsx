import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import api from "../../helpers/api.tsx";
import { useUser } from "../../context/UserContext";

interface SetupPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetupPasswordModal: React.FC<SetupPasswordModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!user?.bug_id || !user?.email) {
        toast.error("User information is missing. Please log in again.");
        return;
      }

      try {
        const payload = {
          bug_id: user.bug_id,
          email: user.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
        };

        const response = await api.post("/api/setup-password", payload);

        if (response.status === 200 || response.status === 201) {
          toast.success("Password set up successfully! Please log in with your new password.");
          
          // Mark as setup so the banner doesn't show again
          localStorage.setItem(`has_setup_password_${user.bug_id}`, "true");

          resetForm();
          onClose();
          // Log out so they can log in with the new password, as it's an initial setup
          logout();
        }
      } catch (error: any) {
        const message = error.response?.data?.message || error.response?.data?.error || "Failed to set up password";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-xl font-bold leading-6 text-gray-900 mb-2">
                  Set Up Password
                </DialogTitle>
                <div className="mt-2 mb-6">
                  <p className="text-sm text-gray-500">
                    It looks like you are using the default admin-provided password. Please set up a new password to secure your account.
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdLock className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your new password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdLock className="text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        placeholder="Confirm your new password"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                      <p className="mt-1 text-sm text-red-500">{formik.errors.password_confirmation}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting || !formik.isValid}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-lg hover:bg-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                    >
                      {formik.isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        "Set Password"
                      )}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SetupPasswordModal;
