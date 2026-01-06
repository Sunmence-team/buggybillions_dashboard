import React, { useRef, useState } from "react";
import LeftNav from "../components/navs/LeftNav";
import TopNav from "../components/navs/TopNav"
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
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex items-start bg-white`}
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`lg:w-1/5 h-full w-full lg:static absolute ${
          isExpanded ? "top-0 left-0" : "-left-full"
        } z-50 bg-black/70`}
      >
        <LeftNav setIsExpanded={setIsExpanded} />
      </div>
      <div className="flex-1 flex flex-col h-full w-full">
        <div className="flex gap-2 items-center w-full overflow-hidden md:px-6 px-4 py-6 shadow-md">
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <FaBars />
          </button>
          <TopNav heading={heading} subText={subText} />
        </div>
        <main
          ref={mainContentRef}
          className={`transition-all duration-500 h-full overflow-y-auto md:px-6 px-4 no-scrollbar py-6 w-full`}
          style={{
            minHeight: "0",
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
          }}
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants as any}
              style={{
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
              }}
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
