"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getAllItems } from "../utils/indexedDB";
import { Employee } from "../types/employee";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  refreshEmployees: (signal?: AbortSignal) => Promise<void>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const refreshEmployees = useCallback(async (signal?: AbortSignal) => {
    console.log("refreshEmployees started");
    if (signal?.aborted) {
      console.log("Signal already aborted, returning early");
      return;
    }
    setIsLoading(true);
    console.log("isLoading set to true");
    try {
      console.log("Calling getAllItems for employees");
      const employees = await getAllItems<Employee>("employees", signal);
      console.log(
        `getAllItems for employees completed successfully. Retrieved ${employees.length} employees.`
      );
      // ここで従業員データを使用する処理を追加（例：状態の更新など）
      console.log("Employee data processed successfully");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Employee refresh was aborted");
      } else {
        console.error("Error refreshing employees:", error);
        throw error;
      }
    } finally {
      setIsLoading(false);
      console.log("isLoading set to false");
    }
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading, refreshEmployees }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
