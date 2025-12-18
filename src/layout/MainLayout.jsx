import React, { useRef, useState } from "react";
import LeftNav from "../components/LeftNav";
import TopNav from "../components/TopNav";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = ({ child }) => {
  const mainContentRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(true);
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
      className={`w-screen h-screen parent ${
        isExpanded && "expand"
      } overflow-hidden flex items-start bg-white`}
    >
      <LeftNav isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div className="flex-1 flex flex-col h-full">
        <TopNav />
        <main
          ref={mainContentRef}
          className={`transition-all duration-500 h-full overflow-y-auto no-scrollbar md:p-6 p-4 w-full`}
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
              variants={pageVariants}
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
