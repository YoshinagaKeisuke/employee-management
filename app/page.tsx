"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { EmployeeModal } from "../components/EmployeeModal";
import { EmployeeFormModal } from "../components/EmployeeFormModal";
import { EmployeeProvider, useEmployees } from "../contexts/EmployeeContext";
import { LoadingProvider, useLoading } from "../contexts/LoadingContext";
import { useSwipe } from "../hooks/useSwipe";
import { Sidebar } from "../components/Sidebar";
import { Main } from "../components/Main";
import { Header } from "../components/Header";
import { toast } from "sonner";
import ErrorBoundary from "../components/ErrorBoundary";

function EmployeeDirectoryContent() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formEmployeeId, setFormEmployeeId] = useState<string | null>(null);
  const { isLoading, refreshEmployees } = useLoading();
  const { isDataInitialized, refreshDepartments } = useEmployees();

  useEffect(() => {
    const initialize = async () => {
      try {
        await refreshEmployees();
      } catch (error) {
        console.error("Error during initial data load:", error);
        toast.error("初期データの読み込み中にエラーが発生しました。");
      }
    };

    if (!isDataInitialized) {
      initialize();
    }
  }, [refreshEmployees, isDataInitialized]);

  useEffect(() => {
    refreshDepartments();
  }, [refreshDepartments]);

  // モバイル表示の検出と処理
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // スワイプ処理の設定
  const handleSwipeRight = useCallback(() => {
    if (isMobile && !isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  }, [isMobile, isSidebarOpen]);

  const handleSwipeLeft = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useSwipe({
    onSwipeRight: handleSwipeRight,
    onSwipeLeft: handleSwipeLeft,
  });

  // メイン領域クリック時の処理
  const handleMainClick = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  // サイドバーの開閉処理
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // 新規従業員追加モーダルの表示
  const handleNewEmployee = useCallback(() => {
    setFormEmployeeId(null);
    setIsFormModalOpen(true);
  }, []);

  // 従業員編集モーダルの表示
  const handleEditEmployee = useCallback((id: string) => {
    setFormEmployeeId(id);
    setIsFormModalOpen(true);
  }, []);

  // 従業員選択時の処理
  const handleEmployeeSelect = useCallback((id: string) => {
    setSelectedEmployeeId(id);
  }, []);

  // 設定ページへの遷移
  //  const handleSettingsClick = useCallback(() => {
  //    window.location.href = '/settings';
  //  }, []);

  useEffect(() => {
    return () => {
      // abortControllerRef.current?.abort();
    };
  }, []);

  const handleCloseEmployeeModal = useCallback(() => {
    setSelectedEmployeeId(null);
  }, []);

  // サイドバーコンポーネントのメモ化
  const memoizedSidebar = useMemo(
    () => (
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        selectedDepartmentId={selectedDepartmentId}
        setSelectedDepartmentId={setSelectedDepartmentId}
        onOverlayClick={() => setIsSidebarOpen(false)}
      />
    ),
    [isSidebarOpen, isMobile, selectedDepartmentId, setSelectedDepartmentId]
  );

  // メインコンテンツコンポーネントのメモ化
  const memoizedMain = useMemo(
    () => (
      <Main
        selectedDepartmentId={selectedDepartmentId}
        onEmployeeSelect={handleEmployeeSelect}
        handleMainClick={handleMainClick}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />
    ),
    [
      selectedDepartmentId,
      handleEmployeeSelect,
      handleMainClick,
      isMobile,
      isSidebarOpen,
    ]
  );

  // ローディング中の表示
  if (isLoading || !isDataInitialized) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">データを準備中...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        handleNewEmployee={handleNewEmployee}
      />

      <div className="flex-1 flex overflow-hidden">
        {memoizedSidebar}
        {memoizedMain}
      </div>
      <EmployeeModal
        employeeId={selectedEmployeeId}
        onClose={handleCloseEmployeeModal}
        onEdit={handleEditEmployee}
      />
      {isFormModalOpen && (
        <EmployeeFormModal
          employeeId={formEmployeeId}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function EmployeeDirectory() {
  return (
    <ErrorBoundary>
      <LoadingProvider>
        <EmployeeProvider>
          <EmployeeDirectoryContent />
        </EmployeeProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
}
