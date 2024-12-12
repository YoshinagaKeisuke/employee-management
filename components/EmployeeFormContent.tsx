/**
 * @file components/EmployeeFormContent.tsx
 * @description 従業員フォームの内容を表示するコンポーネントを定義します。
 * このコンポーネントは、個人情報、業務情報、自己紹介、プロフィール画像の
 * セクションを含む従業員情報フォームを構成します。
 */
import React, { useMemo } from "react";
import { Employee } from "../types/employee";
import { Department } from "../types/department";
import { Location } from "../types/location";
import { Position } from "../types/position";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { WorkInfoSection } from "./WorkInfoSection";
import { IntroductionSection } from "./IntroductionSection";
import { ProfileImageSection } from "./ProfileImageSection";
import { Separator } from "@/components/ui/separator";

/**
 * EmployeeFormContentProps インターフェース
 * EmployeeFormContent コンポーネントのプロパティを定義します。
 */
interface EmployeeFormContentProps {
  formData: Employee;
  handleChange: (field: keyof Employee, value: string | number | boolean | null) => void;
  handleImageChange: (file: File | null, error: string) => void;
  imageError: string;
  departments: Department[];
  locations: Location[];
  positions: Position[];
  updatedAt?: string;
}

/**
 * EmployeeFormContent コンポーネント
 * 従業員フォームの内容を表示します。個人情報、業務情報、自己紹介、プロフィール画像のセクションで構成されています。
 *
 * @param props EmployeeFormContentProps
 * @returns JSX.Element
 */
export function EmployeeFormContent({
  formData,
  handleChange,
  handleImageChange,
  imageError,
  departments,
  locations,
  positions,
  updatedAt,
}: EmployeeFormContentProps) {
  const memoizedPersonalInfoSection = useMemo(
    () => (
      <PersonalInfoSection formData={formData} handleChange={handleChange} />
    ),
    [formData, handleChange]
  );

  const memoizedWorkInfoSection = useMemo(
    () => (
      <WorkInfoSection
        formData={formData}
        handleChange={handleChange}
        departments={departments}
        locations={locations}
        positions={positions}
      />
    ),
    [formData, handleChange, departments, locations, positions]
  );

  const memoizedIntroductionSection = useMemo(
    () => (
      <IntroductionSection formData={formData} handleChange={handleChange} />
    ),
    [formData, handleChange]
  );

  const memoizedProfileImageSection = useMemo(
    () => (
      <ProfileImageSection
        imageUrl={formData.imageUrl}
        handleImageChange={handleImageChange}
        imageError={imageError}
      />
    ),
    [formData.imageUrl, handleImageChange, imageError]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-8">
        {memoizedPersonalInfoSection}
        <Separator />
        {memoizedWorkInfoSection}
        <Separator />
        {memoizedIntroductionSection}
        <Separator />
        {memoizedProfileImageSection}
        {updatedAt && (
          <>
            <Separator />
            <div className="text-sm text-gray-500" aria-live="polite">
              最終更新日: {new Date(updatedAt).toLocaleString("ja-JP")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
