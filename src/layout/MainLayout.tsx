import React, { useRef, useState, useEffect } from "react";
import LeftNav from "../components/navs/LeftNav";
import TopNav from "../components/navs/TopNav";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import SetupPasswordModal from "../components/modal/SetupPasswordModal";

interface MainLayOutProps {
  child: React.ReactElement;
  heading: string;
  subText?: string;
}

const MainLayout: React.FC<MainLayOutProps> = ({ child, heading, subText }) => {
  const mainContentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { user } = useUser();
  const [showPasswordBanner, setShowPasswordBanner] = useState(false);
  const [isSetupPasswordOpen, setIsSetupPasswordOpen] = useState(false);

  useEffect(() => {
    if (user?.bug_id && user?.role !== "admin") {
      const hasSetup = localStorage.getItem(`has_setup_password_${user.bug_id}`);
      if (!hasSetup) {
        setShowPasswordBanner(true);
      }
    }
  }, [user]);

  const dismissBanner = () => {
    if (user?.bug_id) {
      localStorage.setItem(`has_setup_password_${user.bug_id}`, "true");
      setShowPasswordBanner(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-gray-50">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-72 h-full lg:static absolute z-50 ${
          isExpanded ? "top-0 left-0" : "-left-full"
        } transition-transform duration-300`}
      >
        <LeftNav setIsExpanded={setIsExpanded} />
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex items-center gap-4 lg:pl-0 pl-4 pr-4 py-4 lg:py-0">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FaBars className="text-gray-600" />
          </button>
          <div className="flex-1">
            <TopNav heading={heading} subText={subText || ""} />
          </div>
        </div>

        <main
          ref={mainContentRef}
          className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 flex flex-col"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
          }}
          tabIndex={-1}
        >
          <AnimatePresence>
            {showPasswordBanner && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-sm flex items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <FaExclamationTriangle className="text-yellow-500 text-xl shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong className="font-semibold">Security Alert:</strong> It looks like you haven't set up your custom password yet. Please update it to secure your account.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsSetupPasswordOpen(true)}
                    className="text-sm font-medium bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
                  >
                    Setup Password
                  </button>
                  <button
                    onClick={dismissBanner}
                    className="text-yellow-500 hover:text-yellow-700 p-1"
                    title="Dismiss"
                  >
                    <FaTimes />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1"
            >
              {child}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <SetupPasswordModal 
        isOpen={isSetupPasswordOpen} 
        onClose={() => setIsSetupPasswordOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;
