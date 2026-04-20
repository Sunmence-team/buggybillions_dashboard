import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaBriefcase, FaIdBadge, FaBook, FaCode } from "react-icons/fa";
import { useUser } from "../../context/UserContext";

const TutorProfile: React.FC = () => {
  const { user } = useUser();

  const profileFields = [
    { label: "Full Name", value: user?.fullname, icon: FaUser },
    { label: "Email", value: user?.email, icon: FaEnvelope },
    { label: "Role", value: user?.role, icon: FaBriefcase, capitalize: true },
    { label: "User ID", value: user?.id, icon: FaIdBadge },
    { label: "Department", value: (user as any)?.department, icon: FaBook },
    { label: "Stack", value: (user as any)?.stack, icon: FaCode },
  ];

  return (
    <div className="w-full space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-tetiary">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-purple/10 flex items-center justify-center">
            <FaUser className="text-3xl text-purple" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.fullname || "Tutor"}
            </h2>
            <p className="text-gray-500 capitalize">{user?.role || "Tutor"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileFields.map((field, index) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              className="p-4 rounded-xl bg-gray-50/50 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <field.icon className="text-purple text-sm" />
                <label className="text-sm font-medium text-gray-500">{field.label}</label>
              </div>
              <p className={`text-lg font-medium text-gray-900 ${field.capitalize ? "capitalize" : ""}`}>
                {field.value || "—"}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TutorProfile;
