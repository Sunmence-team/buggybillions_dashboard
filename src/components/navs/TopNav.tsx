import React from "react";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { FaBell, FaSearch } from "react-icons/fa";

interface TopNavProps {
  heading: string;
  subText?: string;
}

const TopNav: React.FC<TopNavProps> = ({ heading, subText }) => {
  const { user, loading } = useUser();

  if (loading) {
    return null;
  }

  const initials =
    user?.fullname
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("") || user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between"
    >
      <div>
        <h4 className="text-xl font-semibold text-gray-900">{heading}</h4>
        {subText && <p className="text-sm text-gray-500 mt-0.5">{subText}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FaSearch className="text-gray-500" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
        >
          <FaBell className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </motion.div> */}

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.fullname || user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-purple text-white flex items-center justify-center font-semibold"
          >
            {initials}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;
