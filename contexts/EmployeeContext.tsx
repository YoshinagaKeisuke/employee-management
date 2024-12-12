"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Employee } from "../types/employee";
import { Department } from "../types/department";
import { Location } from "../types/location";
import { Position } from "../types/position";
import {
  getAllItems,
  initializeAllStores,
  addItem,
  updateItem,
  deleteItem,
  getItem,
} from "../utils/indexedDB";
import {
  katakanaToHiragana,
  hiraganaToKatakana,
} from "../utils/japaneseConverter";

interface EmployeeContextType {
  employees: Employee[];
  departments: Department[];
  locations: Location[];
  positions: Position[];
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  isLoading: boolean;
  searchEmployees: (term: string) => Promise<string[]>;
  isDataInitialized: boolean;
  refreshEmployees: () => Promise<void>;
  refreshLocations: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
  refreshPositions: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | null>(null);

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataInitialized, setIsDataInitialized] = useState(false);

  const refreshDepartments = useCallback(async () => {
    try {
      const departmentsData = await getAllItems<Department>("departments");
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Refreshing departments", error);
    }
  }, []);

  const refreshEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const employeesData = await getAllItems<Employee>("employees");
      setEmployees(employeesData);
    } catch (error) {
      console.error("Refreshing employees", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addEmployee = useCallback(
    async (employee: Omit<Employee, "id">) => {
      setIsLoading(true);
      try {
        const maxOrder = Math.max(...employees.map((e) => e.order), 0);
        const newEmployee = {
          ...employee,
          id: Date.now().toString(),
          order: maxOrder + 1,
        } as Employee;
        await addItem("employees", newEmployee);
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
      } catch (error) {
        console.error("Adding employee", error);
      } finally {
        setIsLoading(false);
      }
    },
    [employees]
  );

  const updateEmployee = useCallback(
    async (id: string, updatedEmployee: Partial<Employee>) => {
      setIsLoading(true);
      try {
        const existingEmployee = await getItem<Employee>("employees", id);
        if (!existingEmployee) {
          throw new Error("Employee not found");
        }
        const updated = {
          ...existingEmployee,
          ...updatedEmployee,
          order: updatedEmployee.order ?? existingEmployee.order,
        };
        await updateItem("employees", updated);
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) => (emp.id === id ? updated : emp))
        );
      } catch (error) {
        console.error("Updating employee", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteEmployee = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await deleteItem("employees", id);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== id)
      );
    } catch (error) {
      console.error("Deleting employee", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchEmployees = useCallback(
    async (term: string): Promise<string[]> => {
      const allEmployees = await getAllItems<Employee>("employees");
      const allDepartments = await getAllItems<Department>("departments");

      const searchTerms = term
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 0);
      const hiraganaTerms = searchTerms.map(katakanaToHiragana);
      const katakanaTerms = searchTerms.map(hiraganaToKatakana);

      const matchingEmployees = allEmployees.filter((employee) => {
        const fullName =
          `${employee.lastName}${employee.firstName}`.toLowerCase();
        const fullNameKana = `${employee.lastNameKana}${employee.firstNameKana}`;

        return searchTerms.every(
          (term) =>
            employee.lastName.toLowerCase().includes(term) ||
            employee.firstName.toLowerCase().includes(term) ||
            fullName.includes(term) ||
            employee.lastNameKana.includes(term) ||
            employee.firstNameKana.includes(term) ||
            fullNameKana.includes(term) ||
            hiraganaTerms.some(
              (hTerm) =>
                employee.lastNameKana.includes(hTerm) ||
                employee.firstNameKana.includes(hTerm) ||
                fullNameKana.includes(hTerm)
            ) ||
            katakanaTerms.some(
              (kTerm) =>
                employee.lastNameKana.includes(kTerm) ||
                employee.firstNameKana.includes(kTerm) ||
                fullNameKana.includes(kTerm)
            )
        );
      });

      const matchingDepartments = allDepartments.filter((dept) =>
        searchTerms.every((term) => dept.name.toLowerCase().includes(term))
      );

      const matchingDepartmentIds = new Set(
        matchingDepartments.map((d) => d.id)
      );
      const employeeDepartmentIds = new Set(
        matchingEmployees.map((e) => e.department)
      );

      const includeParentDepartments = (departmentId: string) => {
        let currentDept = allDepartments.find((d) => d.id === departmentId);
        while (currentDept && currentDept.parentId) {
          matchingDepartmentIds.add(currentDept.parentId);
          currentDept = allDepartments.find(
            (d) => currentDept && d.id === currentDept.parentId
          );
        }
      };

      Array.from(employeeDepartmentIds).filter((id): id is string => id !== null).forEach(includeParentDepartments);
      matchingDepartmentIds.forEach(includeParentDepartments);

      return Array.from(
        new Set([...matchingDepartmentIds, ...employeeDepartmentIds])
      );
    },
    []
  );

  const refreshLocations = useCallback(async () => {
    setIsLoading(true);
    try {
      const locationsData = await getAllItems<Location>("locations");
      setLocations(locationsData);
    } catch (error) {
      console.error("Refreshing locations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPositions = useCallback(async () => {
    setIsLoading(true);
    try {
      const positionsData = await getAllItems<Position>("positions");
      setPositions(positionsData);
    } catch (error) {
      console.error("Refreshing positions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAllData = async () => {
      if (isDataInitialized) return;
      setIsLoading(true);
      try {
        await initializeAllStores();
        await Promise.all([
          refreshEmployees(),
          refreshDepartments(),
          refreshLocations(),
          refreshPositions(),
        ]);
        setIsDataInitialized(true);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAllData();
  }, [
    isDataInitialized,
    refreshEmployees,
    refreshDepartments,
    refreshLocations,
    refreshPositions,
  ]);

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        departments,
        locations,
        positions,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        isLoading,
        searchEmployees,
        isDataInitialized,
        refreshEmployees,
        refreshLocations,
        refreshDepartments,
        refreshPositions,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === null) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
