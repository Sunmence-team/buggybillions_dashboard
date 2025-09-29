import React, { useRef } from 'react';
import LeftNav from '../components/LeftNav';
import TopNav from '../components/TopNav';
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = ({ child }) => {
    const mainContentRef = useRef(null);
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
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <LeftNav />
            <div className="flex-1 flex flex-col">
                <TopNav />
                <div className="flex flex-1 overflow-hidden">
                    <main 
                        ref={mainContentRef}
                        className="main-content no-scrollbar flex-1 overflow-y-auto p-4 md:p-6"
                        style={{
                            minHeight: '0',
                            WebkitOverflowScrolling: 'touch',
                            overscrollBehaviorY: 'contain'
                        }}
                        tabIndex={-1}
                    >
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageVariants}
                            style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
                        >
                            {child}
                        </motion.div>
                    </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default MainLayout