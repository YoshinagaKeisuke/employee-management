import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DepartmentTree } from "./DepartmentTree";

interface SidebarProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
  selectedDepartmentId: string;
  setSelectedDepartmentId: (id: string) => void;
  onOverlayClick: () => void;
}

export const Sidebar = React.memo(function Sidebar({
  isSidebarOpen,
  isMobile,
  selectedDepartmentId,
  setSelectedDepartmentId,
  onOverlayClick,
}: SidebarProps) {
  const sidebarContent = useMemo(
    () => (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <DepartmentTree
            onSelect={setSelectedDepartmentId}
            selectedDepartmentId={selectedDepartmentId}
          />
        </div>
      </div>
    ),
    [selectedDepartmentId, setSelectedDepartmentId]
  );

  return (
    <>
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            aria-hidden="true"
            onClick={onOverlayClick}
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={false}
        animate={{
          x: isSidebarOpen ? 0 : "-100%",
          width: isSidebarOpen ? "16rem" : "0",
          boxShadow: isSidebarOpen ? "0 0 15px rgba(0,0,0,0.1)" : "none",
        }}
        style={{
          width: isSidebarOpen ? "16rem" : "0",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
          duration: 0.3,
        }}
        className={`bg-secondary border-r border-border flex flex-col ${
          isMobile
            ? "fixed left-0 top-16 bottom-0 z-50"
            : "h-[calc(100vh-4rem)]"
        } will-change-transform`}
        aria-label="サイドバー"
        aria-hidden={!isSidebarOpen}
      >
        {isSidebarOpen && sidebarContent}
      </motion.aside>
    </>
  );
});
