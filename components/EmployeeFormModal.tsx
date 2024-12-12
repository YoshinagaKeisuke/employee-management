/**
 * @file components/EmployeeFormModal.tsx
 * @description 従業員情報の編集・追加を行うモーダルコンポーネントを定義します。
 * このコンポーネントは、従業員情報のフォームを表示し、データの送信や検証を管理します。
 */

'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, Save } from 'lucide-react'
import { useLoading } from '../contexts/LoadingContext';
import { DialogHeader } from './DialogHeader'
import { EmployeeFormContent } from './EmployeeFormContent'
import { useEmployeeForm } from '../hooks/useEmployeeForm'
import { useEmployees } from '../contexts/EmployeeContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Note: This component must be wrapped within an EmployeeProvider higher up in the component tree.
// To fix the "useEmployees must be used within an EmployeeProvider" error, ensure that this component
// is rendered within the context of an EmployeeProvider.
// 
// Example usage in a parent component:
// 
// import { EmployeeProvider } from '../contexts/EmployeeContext';
// 
// function ParentComponent() {
//   return (
//     <EmployeeProvider>
//       {/* Other components */}
//       <EmployeeFormModal employeeId={someId} onClose={handleClose} />
//     </EmployeeProvider>
//   );
// }

interface EmployeeFormModalProps {
  employeeId: string | null;
  onClose: () => void;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employeeId, onClose: propsonClose }: EmployeeFormModalProps) => {
  const { isLoading } = useLoading();
  const { updateEmployee, refreshEmployees } = useEmployees();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const {
    formData,
    imageFile,
    imageError,
    isEditMode,
    handleChange,
    handleImageChange,
    handleSubmit,
    hasFormChanged,
    departments,
    locations,
    positions,
    isLoading: isFormLoading,
    isFormChanged,
    isFormDataLoaded,
  } = useEmployeeForm(employeeId, propsonClose, updateEmployee);

  const handleClose = useCallback(() => {
    if (hasFormChanged()) {
      setShowConfirmDialog(true);
    } else {
      propsonClose();
    }
  }, [hasFormChanged, propsonClose]);

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    propsonClose();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };


  if (isLoading || isFormLoading || !isFormDataLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md p-6">
          <CardContent className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full overflow-hidden bg-white shadow-lg">
              <DialogHeader
                title={isEditMode ? '社員情報編集' : '新規社員登録'}
                description={isEditMode ? '社員の情報を更新します。' : '新しい社員の情報を入力してください。'}
                onClose={handleClose}
                className="bg-[rgb(2,65,115)]"
              />
              <form onSubmit={handleSubmit}>
                <CardContent className="px-8 py-6">
                  <EmployeeFormContent
                    formData={formData}
                    handleChange={handleChange}
                    handleImageChange={handleImageChange}
                    imageError={imageError}
                    departments={departments}
                    locations={locations}
                    positions={positions}
                    updatedAt={formData.updatedAt}
                  />
                </CardContent>
                <CardFooter className="flex justify-end items-center px-8 py-4 bg-gray-50">
                  <div className="space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      disabled={!!imageError || isLoading || isFormLoading || !isFormChanged}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    >
                      {isLoading || isFormLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditMode ? '更新中...' : '登録中...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {isEditMode ? '更新' : '登録'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent description="フォームの変更内容を破棄するか確認します。">
          <AlertDialogHeader>
            <AlertDialogTitle>変更を破棄しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              フォームに変更が加えられています。このまま閉じると、変更内容は失われます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>閉じる</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

