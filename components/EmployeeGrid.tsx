"use client";

import { useEmployees } from "../contexts/EmployeeContext";
import { EmployeeCard } from "./EmployeeCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, FolderOpen, Folder, Loader2 } from "lucide-react";
import { Department } from "../types/department";
import { Employee } from "../types/employee";
import { useState, useEffect, useCallback } from "react";
import { getDepartmentColor } from "../utils/departmentColors";

interface EmployeeGridProps {
  departmentId: string;
  onEmployeeSelect: (id: string) => void;
}

interface DepartmentSectionProps {
  department: Department;
  employees: Employee[];
  departments: Department[];
  onEmployeeSelect: (id: string) => void;
  level: number;
  selectedDepartmentId: string;
}

function DepartmentSection({
  department,
  employees,
  departments,
  onEmployeeSelect,
  level,
  selectedDepartmentId,
}: DepartmentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { refreshDepartments } = useEmployees();

  const memoizedGetEmployeeCountForDepartment = useCallback(
    (
      departmentId: string,
      employees: Employee[],
      departments: Department[]
    ): number => {
      const directEmployees = employees.filter(
        (e) => e.department === departmentId
      ).length;
      const childDepartments = departments.filter(
        (d) => d.parentId === departmentId
      );
      const childEmployees = childDepartments.reduce(
        (total, child) =>
          total +
          memoizedGetEmployeeCountForDepartment(
            child.id,
            employees,
            departments
          ),
        0
      );
      return directEmployees + childEmployees;
    },
    []
  );

  const departmentEmployees = employees
    .filter((e) => e.department === department.id)
    .sort((a, b) => a.order - b.order);
  const childDepartments = departments
    .filter((d) => d.parentId === department.id)
    .sort((a, b) => a.order - b.order);
  const totalEmployeeCount = memoizedGetEmployeeCountForDepartment(
    department.id,
    employees,
    departments
  );

  useEffect(() => {
    setIsExpanded(department.id === selectedDepartmentId);
  }, [selectedDepartmentId, department.id]);

  useEffect(() => {
    refreshDepartments();
  }, [refreshDepartments]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const bgColor = getDepartmentColor(department, departments);
  const textColor = "text-gray-800";

  return (
    <div
      className={`rounded-lg overflow-hidden mb-2 transition-colors duration-200`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`flex items-center cursor-pointer p-3 ${textColor} hover:bg-opacity-80 transition-colors duration-200`}
        onClick={toggleExpand}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-5 h-5 mr-2" />
        </motion.div>
        {isExpanded ? (
          <FolderOpen className="w-5 h-5 mr-2" />
        ) : (
          <Folder className="w-5 h-5 mr-2" />
        )}
        <span className={`font-semibold ${textColor}`}>{department.name}</span>
        <span className="ml-2 text-sm opacity-75">({totalEmployeeCount})</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-3 pt-0">
              <div className="flex flex-wrap gap-4 mb-4 justify-center">
                {departmentEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onClick={() => onEmployeeSelect(employee.id)}
                  />
                ))}
              </div>
              {childDepartments.map((childDept) => (
                <DepartmentSection
                  key={childDept.id}
                  department={childDept}
                  employees={employees}
                  departments={departments}
                  onEmployeeSelect={onEmployeeSelect}
                  level={level + 1}
                  selectedDepartmentId={selectedDepartmentId}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EmployeeGrid({
  departmentId,
  onEmployeeSelect,
}: EmployeeGridProps) {
  const {
    departments,
    isLoading,
    isDataInitialized,
    employees,
    refreshEmployees,
    refreshDepartments,
  } = useEmployees();

  const memoizedGetEmployeeCountForDepartment = useCallback(
    (
      departmentId: string,
      employees: Employee[],
      departments: Department[]
    ): number => {
      const directEmployees = employees.filter(
        (e) => e.department === departmentId
      ).length;
      const childDepartments = departments.filter(
        (d) => d.parentId === departmentId
      );
      const childEmployees = childDepartments.reduce(
        (total, child) =>
          total +
          memoizedGetEmployeeCountForDepartment(
            child.id,
            employees,
            departments
          ),
        0
      );
      return directEmployees + childEmployees;
    },
    []
  );

  const MemoizedDepartmentSection = useCallback(DepartmentSection, []);

  useEffect(() => {
    refreshEmployees();
    refreshDepartments();
  }, [refreshEmployees, refreshDepartments]);

  if (!isDataInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">データを準備中...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">読み込み中...</span>
      </div>
    );
  }

  const filteredEmployees = (
    departmentId === "all"
      ? employees
      : employees.filter((employee) => {
          const dept = departments.find((d) => d.id === employee.department);
          return (
            dept && (dept.id === departmentId || dept.parentId === departmentId)
          );
        })
  ).sort((a, b) => a.order - b.order);

  const rootDepartments =
    departmentId === "all"
      ? departments
          .filter((d) => d.parentId === null)
          .sort((a, b) => a.order - b.order)
      : departments
          .filter((d) => d.id === departmentId)
          .sort((a, b) => a.order - b.order);

  return (
    <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
      <div className="space-y-4 p-4">
        {rootDepartments.map((department) => (
          <MemoizedDepartmentSection
            key={department.id}
            department={department}
            employees={filteredEmployees}
            departments={departments}
            onEmployeeSelect={onEmployeeSelect}
            level={0}
            selectedDepartmentId={departmentId}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
