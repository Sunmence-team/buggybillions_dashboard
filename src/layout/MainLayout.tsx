import React, { useRef, useState } from "react";
import LeftNav from "../components/navs/LeftNav";
import TopNav from "../components/navs/TopNav";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars } from "react-icons/fa";

interface MainLayOutProps {
  child: React.ReactElement;
  heading: string;
  subText?: string;
}

const MainLayout: React.FC<MainLayOutProps> = ({ child, heading, subText }) => {
  const mainContentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
          className="flex-1 overflow-y-auto no-scrollbar px-6 py-6"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
          }}
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {child}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
