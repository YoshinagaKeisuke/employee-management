/**
 * @file hooks/useEmployeeForm.ts
 * @description 従業員フォームの状態と操作を管理するカスタムフックを提供します。
 * このフックは、従業員の追加・編集フォームで使用され、フォームデータの管理、
 * バリデーション、送信処理などを行います。
 */

import { useState, useEffect, useCallback } from "react";
import { Employee } from "../types/employee";
import { Department } from "../types/department";
import { Location } from "../types/location";
import { Position } from "../types/position";
import { toast } from "sonner";
import { errorMessages } from "../utils/errorMessages";
import { showErrorToast, showSuccessToast } from "../utils/notifications";
import { getItem, getAllItems } from "../utils/indexedDB";
import { useEmployees } from "../contexts/EmployeeContext";

/**
 * オブジェクトの等価性を比較する関数
 * @param obj1 比較対象のオブジェクト1
 * @param obj2 比較対象のオブジェクト2
 * @returns 等価の場合はtrue、そうでない場合はfalse
 */
const isEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * 初期フォームデータを取得する関数
 * @returns 初期化された従業員データ
 */
const getInitialFormData = (): Employee => ({
  id: "",
  lastName: "",
  firstName: "",
  lastNameKana: "",
  firstNameKana: "",
  email: "",
  gender: "男性",
  birthDate: null,
  phoneNumber: "",
  introduction: "",
  imageUrl: "",
  department: "",
  location: "",
  position: "",
  employeeNumber: "",
  hireDate: "",
  createdAt: "",
  updatedAt: "",
  order: 0,
});

/**
 * useEmployeeForm フック
 * 従業員フォームの状態と操作を管理します。
 *
 * @param employeeId 編集する従業員のID（新規作成の場合はnull）
 * @param onClose フォームを閉じる際のコールバック関数
 * @returns フォームの状態と操作を含むオブジェクト
 */
export function useEmployeeForm(
  employeeId: string | null,
  onClose: () => void
) {
  const { updateEmployee, refreshEmployees, addEmployee, employees } =
    useEmployees();
  const [formData, setFormData] = useState<Employee>(getInitialFormData());
  const [initialFormData, setInitialFormData] = useState<Employee | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isFormDataLoaded, setIsFormDataLoaded] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoadingState] = useState(true);

  const isEditMode = employeeId !== null;

  /**
   * フォームデータの初期化と関連データの取得を行う副作用
   */
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      setIsLoadingState(true);
      console.log("Fetching data...");
      try {
        const [depts, locs, pos] = await Promise.all([
          getAllItems<Department>("departments"),
          getAllItems<Location>("locations"),
          getAllItems<Position>("positions"),
        ]);

        if (!isMounted) return;

        setDepartments(depts);
        setLocations(locs);
        setPositions(pos);

        if (isEditMode && employeeId) {
          console.log("Fetching employee data...");
          const employee = await getItem<Employee>("employees", employeeId);
          if (employee && isMounted) {
            const initialData = {
              ...employee,
              gender: employee.gender || "男性",
              department: employee.department || "",
              location: employee.location || "",
              position: employee.position || "",
              birthDate: employee.birthDate
                ? new Date(employee.birthDate).toISOString().split("T")[0]
                : null,
              hireDate: employee.hireDate || "",
            };
            setFormData(initialData);
            setInitialFormData(initialData);
          }
        } else {
          setFormData(getInitialFormData());
          setInitialFormData(getInitialFormData());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          toast.error("データの取得に失敗しました。");
        }
      } finally {
        if (isMounted) {
          setIsLoadingState(false);
          setIsFormDataLoaded(true);
          console.log("Data fetching complete.");
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [isEditMode, employeeId]);

  /**
   * フォームデータの変更を処理する関数
   * @param field 変更されたフィールド名
   * @param value 新しい値
   */
  const handleChange = (field: keyof Employee, value: any) => {
    setFormData((prev) => {
      let newValue = value;
      if (field === "birthDate" || field === "hireDate") {
        newValue =
          value instanceof Date ? value.toISOString().split("T")[0] : value;
      }
      const newFormData = { ...prev, [field]: newValue };
      setIsFormChanged(
        !isEqual(newFormData, initialFormData || getInitialFormData())
      );
      return newFormData;
    });
  };

  /**
   * 画像の変更を処理する関数
   * @param file 選択された画像ファイル
   * @param error エラーメッセージ（存在する場合）
   */
  const handleImageChange = (file: File | null, error: string) => {
    setImageFile(file);
    setImageError(error);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => {
          const newFormData = { ...prev, imageUrl: reader.result as string };
          setIsFormChanged(
            !isEqual(newFormData, initialFormData || getInitialFormData())
          );
          return newFormData;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * フォームの送信を処理する関数
   * @param e フォーム送信イベント
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    if (imageFile) {
      updatedFormData.imageUrl = URL.createObjectURL(imageFile);
    }

    try {
      if (employeeId) {
        await updateEmployee(employeeId, updatedFormData);
      } else {
        const maxOrder = Math.max(...employees.map((e) => e.order), 0);
        await addEmployee({
          ...updatedFormData,
          createdAt: updatedFormData.updatedAt,
          order: maxOrder + 1,
        });
      }
      await refreshEmployees();
      onClose();
      showSuccessToast(
        employeeId ? "社員情報を更新しました" : "新規社員を登録しました",
        `${updatedFormData.lastName} ${updatedFormData.firstName}さんの情報を${
          employeeId ? "更新" : "登録"
        }しました。`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast(
        "エラーが発生しました",
        errorMessages[employeeId ? "updateEmployee" : "addEmployee"]
      );
    }
  };

  /**
   * フォームデータが変更されたかどうかを確認する関数
   * @returns フォームデータが変更された場合はtrue、そうでない場合はfalse
   */
  const hasFormChanged = useCallback(() => {
    return !isEqual(formData, initialFormData || getInitialFormData());
  }, [formData, initialFormData]);

  return {
    formData,
    imageFile,
    imageError,
    isEditMode: !!employeeId,
    handleChange,
    handleImageChange,
    handleSubmit,
    hasFormChanged,
    departments,
    locations,
    positions,
    isLoading,
    isFormChanged,
    isFormDataLoaded,
  };
}
