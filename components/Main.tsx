import React from "react";
import { EmployeeGrid } from "./EmployeeGrid";

interface MainProps {
  selectedDepartmentId: string;
  onEmployeeSelect: (id: string) => void;
  handleMainClick: () => void;
  isMobile: boolean;
  isSidebarOpen: boolean;
}

export const Main = React.memo(function Main({
  selectedDepartmentId,
  onEmployeeSelect,
  handleMainClick,
  isMobile,
  isSidebarOpen,
}: MainProps) {
  return (
    <main
      className="flex-1 overflow-auto p-6 will-change-transform transition-all duration-300 ease-in-out md:mx-auto md:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
      onClick={isMobile && isSidebarOpen ? handleMainClick : undefined}
      role="main"
      aria-label="社員一覧"
    >
      <div className="max-w-7xl mx-auto h-full">
        <EmployeeGrid
          className="h-full transition-all duration-300 ease-in-out"
          departmentId={selectedDepartmentId}
          onEmployeeSelect={onEmployeeSelect}
        />
      </div>
    </main>
  );
});
